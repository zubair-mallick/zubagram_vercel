import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Proxy all requests starting with '/api' to your backend
      '/api': {
        target: 'https://zubagram-vercel-4tkk.vercel.app',  // Your backend URL
        changeOrigin: true,  // Makes sure the host header matches the target
        secure: false,  // Set to true if you're using HTTPS with self-signed certificates
        // rewrite: (path) => path.replace(/^\/api/, ''),  // Optional: rewrites the path if necessary
      },
    },
  },
});
