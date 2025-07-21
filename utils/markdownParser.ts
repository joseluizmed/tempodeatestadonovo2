
import { ArticleDetails } from '../types';

// Simple parser for YAML frontmatter and markdown body
export const parseMarkdown = (slug: string, rawContent: string): ArticleDetails | null => {
    try {
        const frontmatterMatch = rawContent.match(/^---\n([\s\S]+?)\n---/);
        if (!frontmatterMatch) {
            // If no frontmatter, treat the whole file as the body.
            return {
                slug,
                title: 'Título não encontrado',
                author: 'Autor desconhecido',
                publish_date: new Date().toISOString(),
                body: rawContent
            };
        }

        const frontmatterText = frontmatterMatch[1];
        const body = rawContent.substring(frontmatterMatch[0].length).trim();

        const frontmatter: { [key: string]: string } = {};
        frontmatterText.split('\n').forEach(line => {
            const parts = line.split(':');
            if (parts.length > 1) {
                const key = parts[0].trim();
                const value = parts.slice(1).join(':').trim().replace(/^["']|["']$/g, ''); // Handles colons in value and removes quotes
                frontmatter[key] = value;
            }
        });

        return {
            slug,
            title: frontmatter.title || 'Título não encontrado',
            author: frontmatter.author || 'Autor desconhecido',
            publish_date: frontmatter.publish_date || new Date().toISOString(),
            image: frontmatter.image,
            summary: frontmatter.summary,
            body: body
        };
    } catch (error) {
        console.error("Failed to parse markdown file:", error);
        return null;
    }
};