import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),], extend: {
    colors: {
      background: '#F8F9FA',     // off-white
      primary: '#111111',        // black
      bluePrimary: '#1271BA',    // primary blue
      blueAccent: '#37AADF',     // accent blue
      greenAccent: '#B0E3BB',    // subtle green
    },
  }

})
