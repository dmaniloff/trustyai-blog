// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { visit } from 'unist-util-visit';

// Site configuration for GitHub Pages
const siteUrl = 'https://dmaniloff.github.io';
// Only use base path for GitHub Pages deployment, not for local development
const basePath = process.env.GITHUB_PAGES === 'true' ? '/trustyai-blog' : '';

console.log('Build environment:', {
	site: siteUrl,
	base: basePath || '(root path)',
	NODE_ENV: process.env.NODE_ENV,
	GITHUB_PAGES: process.env.GITHUB_PAGES
});

// Custom remark plugin to handle base URL for images in markdown content
function remarkBaseUrl() {
	// @ts-ignore
	return (tree) => {
		// Only transform URLs if we have a base path (i.e., for GitHub Pages)
		if (!basePath) return;
		
		visit(tree, 'image', (node) => {
			if (node.url && node.url.startsWith('/') && !node.url.startsWith(siteUrl)) {
				console.log(`Transforming image URL: ${node.url} -> ${basePath}${node.url}`);
				node.url = `${basePath}${node.url}`;
			}
		});
		// Also handle HTML img tags in MDX
		visit(tree, 'html', (node) => {
			if (node.value && node.value.includes('<img')) {
				node.value = node.value.replace(
					/src="(\/[^"]*?)"/g,
					(match, src) => {
						if (!src.startsWith(siteUrl)) {
							const newSrc = `${basePath}${src}`;
							console.log(`Transforming HTML img src: ${src} -> ${newSrc}`);
							return `src="${newSrc}"`;
						}
						return match;
					}
				);
			}
		});
	};
}

// https://astro.build/config
export default defineConfig({
	site: siteUrl,
	base: basePath,
	integrations: [mdx(), sitemap()],
	markdown: {
		remarkPlugins: [remarkBaseUrl],
	},
});
