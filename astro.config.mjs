// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { visit } from 'unist-util-visit';

// Site configuration for GitHub Pages
const siteUrl = 'https://dmaniloff.github.io';
// For preview builds, don't use base path
const isPreviewBuild = process.env.PREVIEW_BUILD === 'true';
const basePath = isPreviewBuild ? '' : '/trustyai-blog'; // GitHub Pages subdirectory deployment

console.log('Build environment:', {
	site: siteUrl,
	base: basePath || '(root path)',
	NODE_ENV: process.env.NODE_ENV,
	PREVIEW_BUILD: process.env.PREVIEW_BUILD
});

// Custom remark plugin to handle base URL for images in markdown content
function remarkBaseUrl() {
	// @ts-ignore
	return (tree) => {
		// Skip URL transformation for preview builds
		if (isPreviewBuild) {
			return;
		}
		
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
					// @ts-ignore
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
