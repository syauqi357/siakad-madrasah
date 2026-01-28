import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

export const load = async () => {
	const docsDir = path.resolve('docs');

	// 1. Get list of all .md files
	let files = [];
	try {
		files = fs.readdirSync(docsDir).filter((file) => file.endsWith('.md'));
	} catch (e) {
		console.error('Could not read docs directory:', e);
		return { docs: [] };
	}

	// 2. Read and parse each file
	const docs = files.map((filename) => {
		const content = fs.readFileSync(path.join(docsDir, filename), 'utf-8');
		const html = marked.parse(content);

		// Create a readable title from filename (e.g., "testscore.md" -> "Testscore")
		const title = filename
			.replace('.md', '')
			.replace(/-/g, ' ')
			.replace(/\b\w/g, (l) => l.toUpperCase());

		return {
			filename,
			title,
			content: html
		};
	});

	return {
		docs
	};
};
