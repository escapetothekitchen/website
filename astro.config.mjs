import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://escapetothekitchen.com',
  output: 'static',
  server: { port: 4321 },
  integrations: [tailwind({ applyBaseStyles: false })],
}); 