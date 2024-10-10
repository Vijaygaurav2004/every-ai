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
        const { prompt, userId } = await request.json();
        console.log('Received image generation prompt:', prompt);

        const ai = new Ai(env.AI);
        const enhancedPrompt = `Create a highly detailed, photorealistic image of ${prompt}. Focus on intricate textures, accurate lighting, and lifelike details.`;
        const aiModel = '@cf/black-forest-labs/flux-1-schnell';

        console.log('Sending request to AI model:', aiModel, 'with prompt:', enhancedPrompt);
        const response = await ai.run(aiModel, { prompt: enhancedPrompt });
        
        console.log('AI response type:', typeof response);

        if (response && response instanceof Uint8Array) {
          const base64Image = btoa(String.fromCharCode.apply(null, response));
          
          // Save to history
          await saveToHistory(env.DB, userId, 'Image Generation', prompt, 'image', base64Image);

          return new Response(response, {
            headers: { 
              'Content-Type': 'image/png',
              ...corsHeaders,
            },
          });
        } else {
          console.error('Unexpected response format:', response);
          throw new Error('Unexpected response format from AI model');
        }
      } catch (error) {
        console.error('Error generating image:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate image', details: error instanceof Error ? error.message : String(error) }), {
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