import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: { adapter: adapter(), alias: {"@/*": "./src/lib/*",}, kit: {
  csrf: {
    checkOrigin: false
  }
} }
};

export default config;
