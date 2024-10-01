# AI Workplace

AI Workplace is a web application that provides an interface for various AI tools, including text generation and image creation using Cloudflare AI.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- npm (usually comes with Node.js)
- A Cloudflare account with access to Cloudflare AI

## Local Setup

### Frontend Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd ai-workplace
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add the following:
   ```
   VITE_API_URL=http://localhost:8787
   ```

4. Start the development server:
   ```
   npm run dev
   ```

   The frontend should now be running on `http://localhost:5173`.

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Ensure your `wrangler.toml` file in the backend directory has the following content:
   ```toml
   name = "ai-workplace-backend"
   main = "dist/index.js"
   compatibility_date = "2023-05-18"

   [vars]
   ENVIRONMENT = "production"

   [ai]
   binding = "AI"
   ```

4. Log in to your Cloudflare account:
   ```
   npx wrangler login
   ```

5. Start the local development server:
   ```
   npm run dev
   ```

   The backend should now be running on `http://localhost:8787`.

## Development

- Frontend code is located in the `src` directory.
- Backend code is located in the `backend/src` directory.
- Make sure both frontend and backend servers are running for full functionality.

## Testing

To test the application:

1. Open your browser and navigate to `http://localhost:5173`.
2. Use the interface to interact with different AI tools.
3. For the DALL-E tool, enter a prompt to generate an image.
4. For text-based tools, enter prompts to generate text responses.

## Troubleshooting

- If you encounter CORS issues, ensure that your backend is properly configured to allow requests from your frontend's origin.
- Check the browser console and server logs for any error messages.

## Additional Information

- The frontend uses React with TypeScript and Vite.
- The backend uses Cloudflare Workers with the Cloudflare AI integration.
- Styling is done with Tailwind CSS.

For more detailed information about the project structure and components, please refer to the source code and comments within the files.
