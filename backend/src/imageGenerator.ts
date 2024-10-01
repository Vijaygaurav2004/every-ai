import { Ai } from '@cloudflare/ai';

export interface Env {
  AI: Ai;
}

export async function generateImage(prompt: string, env: Env): Promise<Response> {
  try {
    const inputs = {
      prompt: prompt,
    };

    const response = await env.AI.run(
      "@cf/stabilityai/stable-diffusion-xl-base-1.0",
      inputs
    );

    // Convert the ArrayBuffer to a base64 string
    const base64 = btoa(String.fromCharCode.apply(null, new Uint8Array(response)));

    return new Response(JSON.stringify({ image: base64 }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error('Image Generation Error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate image' }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}