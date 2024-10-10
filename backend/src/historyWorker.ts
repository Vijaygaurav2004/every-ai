import { getUserHistory, deleteHistoryItem } from './db';

export interface Env {
  DB: D1Database;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/history' && request.method === 'GET') {
      const userId = url.searchParams.get('userId');
      
      if (!userId) {
        return new Response(JSON.stringify({ error: 'User ID is required' }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      }

      try {
        const history = await getUserHistory(env.DB, userId);
        return new Response(JSON.stringify({ results: history }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      } catch (error) {
        console.error('Error fetching history:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch history', details: error instanceof Error ? error.message : String(error) }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      }
    }

    if (path.startsWith('/history/') && request.method === 'DELETE') {
      const id = parseInt(path.split('/').pop() || '', 10);
      const { userId } = await request.json();

      if (isNaN(id) || !userId) {
        return new Response(JSON.stringify({ error: 'Invalid ID or User ID' }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      }

      try {
        await deleteHistoryItem(env.DB, id, userId);
        return new Response(JSON.stringify({ success: true }), {
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      } catch (error) {
        console.error('Error deleting history item:', error);
        return new Response(JSON.stringify({ error: 'Failed to delete history item', details: error instanceof Error ? error.message : String(error) }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      }
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  },
};