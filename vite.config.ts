import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    // Preserve Vite's default sensitive-file exclusions and protect local TLS files.
    fs: {deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/.certs/**', '**/.tools/**', '**/*.{key,cer,pfx,p12}']},
  },
});
