import { defineConfig } from 'tsup';
import { readFileSync } from 'fs';
import { join } from 'path';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'components/store/index': 'src/components/store/index.ts',
    'components/store/ProductList': 'src/components/store/ProductList.tsx',
    'components/store/ProductDetails':
      'src/components/store/ProductDetails.tsx',
  },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  external: [
    'react',
    'react-dom',
    '@wix/*',
    '@radix-ui/*',
    'lucide-react',
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
    'react-hook-form',
    '@hookform/resolvers',
    'zod',
    'date-fns',
    'embla-carousel-react',
    'input-otp',
    'next-themes',
    'react-day-picker',
    'react-resizable-panels',
    'react-router-dom',
    'react-share',
    'recharts',
    'sonner',
    'vaul',
    'cmdk',
  ],
  esbuildOptions(options) {
    options.jsx = 'automatic';
    options.jsxImportSource = 'react';
  },
  async onSuccess() {
    // Process CSS with Tailwind CSS v4 for each component
    try {
      const postcss = await import('postcss');
      const tailwindcssPostcss = await import('@tailwindcss/postcss');
      const fs = await import('fs/promises');

      // Read the global CSS file
      const cssContent = readFileSync(
        join(process.cwd(), 'src/styles/global-loader.css'),
        'utf8'
      );

      // Ensure dist directory exists
      await fs.mkdir(join(process.cwd(), 'dist'), { recursive: true });

      // Define component-specific CSS generation
      const cssConfigs = [
        {
          name: 'styles.css',
          content: ['src/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}'],
          description: 'Global styles',
          cssContent: cssContent, // Use full CSS with all imports
        },
        {
          name: 'ProductList.css',
          content: [
            'src/components/store/ProductList.tsx',
            'src/components/store/ProductActionButtons.tsx',
            'src/components/store/QuickViewModal.tsx',
            'src/components/store/SortDropdown.tsx',
            'src/components/store/CategoryPicker.tsx',
            'src/components/store/ProductFilters.tsx',
            'src/components/ui/**/*.{ts,tsx}',
            'src/headless/**/*.{ts,tsx}',
          ],
          description: 'ProductList component styles',
          cssContent: `@import "tailwindcss";
@theme {
  --color-primary: rgb(66, 165, 245);
  --color-primary-foreground: #ffffff;
  --color-secondary: rgb(3, 218, 198);
  --color-secondary-foreground: #ffffff;
  --color-background: #ffffff;
  --color-foreground: #000000;
  --font-heading: 'Inter', sans-serif;
  --font-paragraph: 'Inter', sans-serif;
}`, // Only Tailwind, no theme imports
        },
        {
          name: 'ProductDetails.css',
          content: [
            'src/components/store/ProductDetails.tsx',
            'src/components/store/ProductActionButtons.tsx',
            'src/components/social/SocialSharingButtons.tsx',
            'src/components/media/MediaGallery.tsx',
            'src/components/ui/**/*.{ts,tsx}',
            'src/headless/**/*.{ts,tsx}',
          ],
          description: 'ProductDetails component styles',
          cssContent: `@import "tailwindcss";
@theme {
  --color-primary: rgb(66, 165, 245);
  --color-primary-foreground: #ffffff;
  --color-secondary: rgb(3, 218, 198);
  --color-secondary-foreground: #ffffff;
  --color-background: #ffffff;
  --color-foreground: #000000;
  --font-heading: 'Inter', sans-serif;
  --font-paragraph: 'Inter', sans-serif;
}`, // Only Tailwind, no theme imports
        },
      ];

      // Process CSS for each configuration
      for (const config of cssConfigs) {
        const processor = postcss.default([
          tailwindcssPostcss.default({
            content: config.content,
          }),
        ]);

        const result = await processor.process(config.cssContent, {
          from: 'src/styles/global-loader.css',
          to: `dist/${config.name}`,
        });

        await fs.writeFile(
          join(process.cwd(), 'dist', config.name),
          result.css
        );

        if (result.map) {
          await fs.writeFile(
            join(process.cwd(), 'dist', `${config.name}.map`),
            result.map.toString()
          );
        }

        console.log(`✅ ${config.description} processed: ${config.name}`);
      }
    } catch (error) {
      console.error('❌ Error processing CSS:', error);
    }
  },
});
