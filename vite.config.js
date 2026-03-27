import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      {
        name: 'retell-api',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url === '/api/create-web-call' && req.method === 'POST') {
              const RETELL_API_KEY = env.RETELL_API_KEY;
              const RETELL_AGENT_ID = env.RETELL_AGENT_ID;

              if (!RETELL_API_KEY || !RETELL_AGENT_ID) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Retell API configuration missing locally. Check your .env file.' }));
                return;
              }

              try {
                const response = await fetch('https://api.retellai.com/v2/create-web-call', {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${RETELL_API_KEY}`,
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ agent_id: RETELL_AGENT_ID }),
                });
                
                const data = await response.json();
                res.statusCode = response.status;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(data));
              } catch (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: err.message }));
              }
            } else {
              next();
            }
          });
        }
      }
    ],
  }
})
