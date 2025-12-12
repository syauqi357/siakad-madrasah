import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	// Added Config Part

	// source modify : https://dev.to/digitaldrreamer/change-your-sveltekit-or-any-vite-powered-dev-server-localhost-port-2e2h
	server: {
		port: 1245
	},
	preview: {
		port: 1243
	}
});
