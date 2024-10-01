import { Ai } from '@cloudflare/ai'
import { generateImage } from './imageGenerator'
import * as base64 from 'base64-js'
import * as mustache from 'mustache'

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
      const { toolName, messages } = await request.json();

      if (toolName === 'DALL-E') {
        const prompt = messages[messages.length - 1].content;
        return generateImage(prompt, env);
      } else {
        const ai = new Ai(env.AI);
        try {
          const response = await ai.run('@cf/meta/llama-2-7b-chat-int8', {
            messages: messages,
          });

          const aiResponse = typeof response === 'string' ? response : JSON.stringify(response);

          return new Response(JSON.stringify({ response: aiResponse }), {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          });
        } catch (error) {
          console.error('AI Error:', error);
          return new Response(JSON.stringify({ error: 'Failed to process request' }), {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          });
        }
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

function formatResponse(text: string): string {
  // Add some basic formatting
  let formatted = text.trim();
  
  // If the response is very short, make it a heading
  if (formatted.length < 20) {
    formatted = `## ${formatted}`;
  } else {
    // Otherwise, add a generic greeting and make the response a paragraph
    formatted = `## Hello!\n\n${formatted}`;
  }
  
  // Add a separator
  formatted += '\n\n---\n\n*Powered by AI*';

  return formatted;
}