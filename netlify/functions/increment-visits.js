// Netlify Serverless Function for visit counter
// Uses Netlify Blobs for persistent storage (built-in, no external service needed)

const { getStore } = require("@netlify/blobs");

const STORE_NAME = "visitor-counter";
const COUNT_KEY = "total-visits";
const DEFAULT_COUNT = 0;

exports.handler = async (event, context) => {
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

  // Initialize the Netlify Blobs store
  // In deployed functions, just pass the store name - Netlify handles the rest
  const store = getStore(STORE_NAME);

  if (event.httpMethod === "GET") {
    // Return current count from storage
    try {
      const data = await store.get(COUNT_KEY, { type: "json" });
      const count = data?.count ?? DEFAULT_COUNT;
      
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
      // Read current count
      let data = await store.get(COUNT_KEY, { type: "json" });
      let currentCount = data?.count ?? DEFAULT_COUNT;
      
      // Ensure count is a valid number
      if (currentCount === null || currentCount === undefined || isNaN(currentCount) || currentCount < 0) {
        currentCount = 0;
      }
      
      // Increment by 1
      const newCount = Number(currentCount) + 1;
      
      // Save the new count persistently
      await store.setJSON(COUNT_KEY, { 
        count: newCount, 
        lastUpdated: new Date().toISOString() 
      });
      
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
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          count: DEFAULT_COUNT,
          error: "Failed to increment count: " + error.message 
        }),
      };
    }
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: "Method not allowed" }),
  };
};
