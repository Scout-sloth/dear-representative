import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {defineConfig, mergeConfig} from 'vite';
import baseConfig from './vite.config';

export default defineConfig(({command, isPreview}) => {
  // No certificate loading or HTTPS changes for builds or production previews.
  if (command !== 'serve' || isPreview) return baseConfig;
  const certificateDirectory = new URL('./.certs/', import.meta.url);
  let cert: Buffer;
  let key: Buffer;
  try {
    cert = readFileSync(new URL('localhost.pem', certificateDirectory));
    key = readFileSync(new URL('localhost-key.pem', certificateDirectory));
  } catch {
    throw new Error(
      `HTTPS development needs readable localhost.pem and localhost-key.pem in ${fileURLToPath(certificateDirectory)}. ` +
      'See README: Optional HTTPS development. Generate them with mkcert; HTTP remains available with npm run dev.',
    );
  }
  return mergeConfig(baseConfig, {
    server: {host: '0.0.0.0', port: 5173, strictPort: true, https: {cert, key}},
  });
});
