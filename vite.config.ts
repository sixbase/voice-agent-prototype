import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  /* GitHub Pages serves this from /voice-agent-prototype/, so the built asset
     URLs need that prefix. Dev stays at the root — otherwise localhost moves
     too, and every bookmark and hash link in the workflow breaks. */
  base: command === 'build' ? '/voice-agent-prototype/' : '/',
  plugins: [react()],
}))
