
import { ArticleDetails } from '../types';

// Simple parser for YAML frontmatter and markdown body
export const parseMarkdown = (slug: string, rawContent: string): ArticleDetails | null => {
    try {
        const frontmatterMatch = rawContent.match(/^---\n([\s\S]+?)\n---/);
        const frontmatter: { [key: string]: string } = {};
        let body: string;

        if (!frontmatterMatch) {
            // If no frontmatter, treat the whole file as the body.
            body = rawContent;
        } else {
            const frontmatterText = frontmatterMatch[1];
            body = rawContent.substring(frontmatterMatch[0].length).trim();
            frontmatterText.split('\n').forEach(line => {
                const parts = line.split(':');
                if (parts.length > 1) {
                    const key = parts[0].trim();
                    const value = parts.slice(1).join(':').trim().replace(/^["']|["']$/g, ''); // Handles colons in value and removes quotes
                    frontmatter[key] = value;
                }
            });
        }

        return {
            slug,
            title: frontmatter.title || 'Título não encontrado',
            author: frontmatter.author || 'Autor desconhecido',
            publish_date: frontmatter.publish_date || new Date().toISOString(),
            image: frontmatter.image || '', // Default empty string if not present
            summary: frontmatter.summary || 'Resumo não disponível.', // Default summary
            body: body
        };
    } catch (error) {
        console.error("Failed to parse markdown file:", error);
        return null;
    }
};