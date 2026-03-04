import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api/orchestrator': {
        target: 'https://gylv2iabjpsbte727qkawailjm0xnctf.lambda-url.us-east-1.on.aws',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/orchestrator/, '')
      }
    }
  }
})
