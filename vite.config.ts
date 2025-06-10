import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // Allow access from network/IP
    port: 5173,
    strictPort: true,
    cors: true, // Optional
    hmr: {
      protocol: "wss",
      host: "7901-125-17-13-54.ngrok-free.app",
      clientPort: 443, // HTTPS default port
    },
  },
});
