import { Ai } from '@cloudflare/ai'
import { generateImage } from './imageGenerator'
import { initializeDatabase, saveToHistory, getHistory } from './db'
import { D1Database } from '@cloudflare/workers-types';

export interface Env {
  AI: Ai;
  DB: D1Database;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    await initializeDatabase(env.DB);

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
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
        const history = await getHistory(env.DB, userId);
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

    if (request.method === 'POST') {
      try {
        const { toolName, messages, userId } = await request.json();
        console.log('Received request:', { toolName, userId, messagesCount: messages.length });
        
        const ai = new Ai(env.AI);

        if (toolName === 'DALL-E') {
          // Image generation
          const prompt = messages[messages.length - 1].content;
          const imageResponse = await generateImage(prompt, env);
          
          // Save to history
          await saveToHistory(env.DB, userId, toolName, prompt, 'image', await imageResponse.text());

          return new Response(imageResponse.body, {
            headers: {
              ...imageResponse.headers,
              ...corsHeaders,
            },
          });
        } else {
          // Text generation
          console.log('Running AI model for text generation');
          try {
            const response = await ai.run('@cf/meta/llama-2-7b-chat-int8', {
              messages: messages,
            });
            console.log('AI response:', response);

            if (typeof response === 'object' && 'response' in response) {
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
          } catch (aiError) {
            console.error('AI model error:', aiError);
            throw new Error(`AI model error: ${aiError.message}`);
          }
        }
      } catch (error) {
        console.error('Error processing request:', error);
        return new Response(JSON.stringify({ error: 'Failed to process request', details: error instanceof Error ? error.message : String(error) }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        });
      }
    }

    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders,
    });
  },
};