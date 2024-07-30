import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
	base: '/',
	plugins: [react()],
	server: {
		port: 1167,
		strictPort: true,
		host: true,
		origin: 'http://0.0.0.0:1167',
		watch: {
			usePolling: true
		}
	},
	define: {
		'process.env': process.env
	}
});
