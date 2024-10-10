import { Ai } from '@cloudflare/ai';
import { saveToHistory } from './db';

export interface Env {
  AI: Ai;
  DB: D1Database;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method === 'POST') {
      try {
        const { messages, userId, toolName } = await request.json();
        console.log('Received text generation request:', { messagesCount: messages.length, userId, toolName });

        const ai = new Ai(env.AI);
        const response = await ai.run('@cf/meta/llama-2-7b-chat-int8', { messages });
        
        console.log('AI response:', response);

        if (typeof response === 'object' && 'response' in response) {
          // Save to history
          await saveToHistory(env.DB, userId, toolName, messages[messages.length - 1].content, 'text', response.response);

          return new Response(JSON.stringify({ response: response.response }), {
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders,
            },
          });
        } else {
          console.error('Unexpected response format:', response);
          throw new Error('Unexpected response format from AI model');
        }
      } catch (error) {
        console.error('Error generating text:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate text', details: error instanceof Error ? error.message : String(error) }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }
    }

    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  },
};