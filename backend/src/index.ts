import { Ai } from '@cloudflare/ai'
import { generateImage } from './imageGenerator'

export interface Env {
  AI: Ai;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (request.method === 'POST') {
      try {
        const body = await request.text();
        console.log('Received request body:', body);

        const { toolName, messages } = JSON.parse(body);
        console.log('Parsed request:', { toolName, messages });

        const ai = new Ai(env.AI);

        if (toolName === 'DALL-E') {
          // Image generation
          const prompt = messages[messages.length - 1].content;
          return generateImage(prompt, env);
        } else {
          // Text generation
          const response = await ai.run('@cf/meta/llama-2-7b-chat-int8', {
            messages: messages,
          });
          console.log('AI response:', response);

          return new Response(JSON.stringify({ response: response.response }), {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          });
        }
      } catch (error) {
        console.error('Error processing request:', error);
        return new Response(JSON.stringify({ error: 'Failed to process request', details: error.message }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    }

    return new Response('Method not allowed', { 
      status: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
  },
};