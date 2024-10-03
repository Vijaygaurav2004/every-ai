import { Ai } from '@cloudflare/ai';

export interface Env {
  AI: Ai;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    if (request.method === 'POST') {
      try {
        const { prompt } = await request.json();
        console.log('Received image generation prompt:', prompt);

        const ai = new Ai(env.AI);
        const enhancedPrompt = `Create a highly detailed, photorealistic image of ${prompt}. Focus on intricate textures, accurate lighting, and lifelike details. The image should be of the highest possible quality, suitable for professional use.`;
        
        const response = await ai.run('@cf/black-forest-labs/flux-1-schnell', {
          prompt: enhancedPrompt,
          num_steps: 8, // Maximum allowed steps for Flux model
        });
        
        if (response && typeof response.image === 'string') {
          // It's an image response
          const binaryString = atob(response.image);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
              bytes[i] = binaryString.charCodeAt(i);
          }
          
          return new Response(bytes, {
            headers: { 
              'Content-Type': 'image/png',
              ...corsHeaders,
            },
          });
        } else {
          // Unexpected response format
          return new Response(JSON.stringify({ error: 'Unexpected response format from AI model' }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              ...corsHeaders,
            },
          });
        }
      } catch (error) {
        console.error('Error generating image:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate image' }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
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