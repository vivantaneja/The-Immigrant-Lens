// Netlify Serverless Function for visit counter
// For production, replace this with a database (e.g., Fauna, Supabase, MongoDB, etc.)

// Note: This in-memory approach resets on each deploy
// For persistent storage, use a database service
// Start at 200, then increment by 1 for each visitor
let visitCount = 200;

// Initialize from environment variable if available
if (process.env.VISIT_COUNT) {
  visitCount = parseInt(process.env.VISIT_COUNT, 10) || 200;
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
    // Return current count
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ count: visitCount }),
    };
  }

  if (event.httpMethod === "POST") {
    // Increment count by 1 (starts at 200, so first visitor is 201, second is 202, etc.)
    visitCount += 1;
    
    // In production, save to database here
    // Example: await saveToDatabase(visitCount);
    
    // Return count (already includes the 200 base)
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        count: visitCount,
        message: "Visit count incremented" 
      }),
    };
  }

  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({ error: "Method not allowed" }),
  };
};

