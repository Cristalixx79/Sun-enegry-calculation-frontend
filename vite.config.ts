import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' — чтобы собранное приложение открывалось из любой папки
// (в том числе с GitHub Pages); маршрутизация сделана через HashRouter.
export default defineConfig({
  plugins: [react()],
  base: './',
});
