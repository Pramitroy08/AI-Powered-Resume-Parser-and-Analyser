/*import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})*/


/*import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Add this line here!
})*/

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // This polyfills 'global' for the browser
      global: 'global-internal',
    },
  },
  define: {
    // This fixes the "global is not defined" error properly
    global: 'window',
  },
  optimizeDeps: {
    // This prevents Vite from trying to optimize Node-only parts of the SDK
    exclude: ['@aws-sdk/util-user-agent-node']
  }
})