// Netlify Serverless Function for visit counter
// Uses persistent storage for true cross-device counting
const https = require('https');
const { URL } = require('url');

const DEFAULT_COUNT = 0;

// For production: Set these environment variables in Netlify dashboard:
// - STORAGE_API_URL: Your storage API URL (optional, defaults to JSONBin.io)
// - STORAGE_BIN_ID: Your storage bin/container ID
// - STORAGE_API_KEY: Your storage API key
// 
// Free options:
// - JSONBin.io: https://jsonbin.io (free tier available)
// - Or use your own database (Fauna, Supabase, MongoDB, etc.)

const STORAGE_API_URL = process.env.STORAGE_API_URL || 'https://api.jsonbin.io/v3/b';
const STORAGE_BIN_ID = process.env.STORAGE_BIN_ID;
const STORAGE_API_KEY = process.env.STORAGE_API_KEY;

// Fallback to in-memory storage if no API configured (for local dev)
let memoryStorage = { count: DEFAULT_COUNT };

// Helper function to make HTTP requests (Node.js compatible)
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, json: () => Promise.resolve(parsed) });
        } catch (e) {
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, json: () => Promise.resolve({}) });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

// Helper function to read count from external storage or fallback
async function readCount() {
  // First, try environment variable (can be set manually in Netlify dashboard)
  if (process.env.VISIT_COUNT) {
    const envCount = parseInt(process.env.VISIT_COUNT, 10);
    if (!isNaN(envCount) && envCount >= 0) {
      return envCount;
    }
  }
  
  // If storage API is configured, use it
  if (STORAGE_BIN_ID && STORAGE_API_KEY) {
    try {
      const response = await makeRequest(`${STORAGE_API_URL}/${STORAGE_BIN_ID}/latest`, {
        headers: {
          'X-Master-Key': STORAGE_API_KEY,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const count = parseInt(data.record?.count || DEFAULT_COUNT, 10);
        if (!isNaN(count) && count >= 0) {
          return count;
        }
      }
    } catch (error) {
      console.error('Error reading from storage API:', error);
    }
  }
  
  // Fallback to memory storage (for local dev or if API fails)
  return memoryStorage.count;
}

// Helper function to write count to external storage
async function writeCount(count) {
  // If storage API is configured, use it
  if (STORAGE_BIN_ID && STORAGE_API_KEY) {
    try {
      const response = await makeRequest(`${STORAGE_API_URL}/${STORAGE_BIN_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': STORAGE_API_KEY,
        },
        body: JSON.stringify({ 
          count, 
          lastUpdated: new Date().toISOString() 
        }),
      });
      
      if (response.ok) {
        return true;
      }
    } catch (error) {
      console.error('Error writing to storage API:', error);
    }
  }
  
  // Fallback to memory storage (for local dev)
  memoryStorage.count = count;
  return true;
}

exports.handler = async (event) => {
  // Handle CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  if (event.httpMethod === "GET") {
    // Return current count from storage
    try {
      const count = await readCount();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ count }),
      };
    } catch (error) {
      console.error('Error reading count:', error);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ count: DEFAULT_COUNT }),
      };
    }
  }

  if (event.httpMethod === "POST") {
    // Read current count, increment, and save
    try {
      let currentCount = await readCount();
      
      // Ensure count is a valid number, default to 0 if not
      if (currentCount === null || currentCount === undefined || isNaN(currentCount) || currentCount < 0) {
        currentCount = 0;
      }
      
      // Always increment by 1
      const newCount = Number(currentCount) + 1;
      
      // Save the new count
      await writeCount(newCount);
      
      // Update memory storage as well for consistency
      memoryStorage.count = newCount;
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          count: newCount,
          message: "Visit count incremented" 
        }),
      };
    } catch (error) {
      console.error('Error incrementing count:', error);
      // Try to return current count if available
      try {
        const currentCount = await readCount();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            count: currentCount || 0,
            error: "Failed to increment count" 
          }),
        };
      } catch (e) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            count: 0,
            error: "Failed to increment count" 
          }),
        };
      }
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: "Method not allowed" }),
  };
};
