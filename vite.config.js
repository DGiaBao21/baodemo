import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  optimizeDeps: {
    include: ['@ckeditor/ckeditor5-vue', '@ckeditor/ckeditor5-build-classic']
  }
})