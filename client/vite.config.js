import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'
import dotenv from "dotenv"
dotenv.config()
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
  server:{
    proxy:{
      "/api":{
        target: process.env.BACKEND_URL,
        changeOrigin:true,
        secure:false
      }
    }
  }
})
