import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
	html: {
    title: 'Bolsa Empleo',
		favicon: './src/assets/icon.svg',
  },
  plugins: [pluginReact()],
	resolve: {
    alias: {
      '@': './src',
    },
  },
});
