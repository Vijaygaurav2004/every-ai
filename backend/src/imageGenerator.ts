import { Ai } from '@cloudflare/ai';

export interface Env {
  AI: Ai;
}

// This function is no longer used, but kept for reference
export async function generateImage(prompt: string, env: Env): Promise<Response> {
  // Implementation moved to main index.ts file
  throw new Error('This function is deprecated. Image generation is now handled in the main fetch function.');
}