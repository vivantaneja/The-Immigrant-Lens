// Netlify Edge Function for visit counter
// Uses Netlify Blobs for persistent storage (automatic in Edge Functions!)

import { getStore } from "https://esm.sh/@netlify/blobs";

const STORE_NAME = "visitor-counter";
const COUNT_KEY = "total-visits";
const DEFAULT_COUNT = 0;

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

export default async function handler(request: Request, context: any) {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return new Response("", { headers: corsHeaders });
  }

  // Get the Netlify Blobs store - context is automatically provided in Edge Functions
  const store = getStore(STORE_NAME);

  try {
    if (request.method === "GET") {
      // Return current count
      const data = await store.get(COUNT_KEY, { type: "json" }) as { count?: number } | null;
      const count = data?.count ?? DEFAULT_COUNT;

      return new Response(JSON.stringify({ count }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (request.method === "POST") {
      // Read current count
      const data = await store.get(COUNT_KEY, { type: "json" }) as { count?: number } | null;
      let currentCount = data?.count ?? DEFAULT_COUNT;

      // Ensure valid number
      if (currentCount === null || currentCount === undefined || isNaN(currentCount) || currentCount < 0) {
        currentCount = 0;
      }

      // Increment
      const newCount = Number(currentCount) + 1;

      // Save persistently
      await store.setJSON(COUNT_KEY, {
        count: newCount,
        lastUpdated: new Date().toISOString(),
      });

      return new Response(JSON.stringify({ count: newCount, message: "Visit count incremented" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in visitor counter:", error);
    return new Response(JSON.stringify({ count: DEFAULT_COUNT, error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}

export const config = {
  path: "/.netlify/functions/increment-visits",
};
