class ContentManager {
    constructor() {
        this.content = {};
        this.config = {};
    }

    async loadConfig() {
        try {
            const response = await fetch('./content/config.json');
            this.config = await response.json();
        } catch (error) {
            console.warn('Could not load config:', error);
        }
    }

    async loadContent(section) {
        try {
            const response = await fetch(`./content/${section}.md`);
            const markdown = await response.text();
            this.content[section] = this.parseMarkdown(markdown);
            return this.content[section];
        } catch (error) {
            console.warn(`Could not load ${section}:`, error);
            return null;
        }
    }

    parseMarkdown(markdown) {
        // Simple markdown parser for basic formatting
        return markdown
            .replace(/^# (.+)$/gm, '$1')
            .replace(/^## (.+)$/gm, '$1')
            .replace(/\*\*(.+?)\*\*/g, '$1')
            .replace(/\*(.+?)\*/g, '$1')
            .replace(/^\- (.+)$/gm, '$1')
            .replace(/(.*<\/li>)/gs, '$1')
            .replace(/\n\n/g, '')
            .replace(/^(.+)$/gm, '$1')
            .replace(/<h/g, '<h')
            .replace(/<\/h([1-6])><\/p>/g, '</h$1>')
            .replace(//g, '')
            .replace(/<\/ul><\/p>/g, '');
    }

    async init() {
        await this.loadConfig();
        
        // Load all content sections
        const sections = ['about', 'research', 'publications', 'contact'];
        const promises = sections.map(section => this.loadContent(section));
        await Promise.all(promises);
        
        this.updateDOM();
    }

    updateDOM() {
        // Update header
        if (this.config.header) {
            const titleElement = document.querySelector('.header h1');
            const taglineElement = document.querySelector('.tagline');
            
            if (titleElement) titleElement.textContent = this.config.header.name;
            if (taglineElement) taglineElement.innerHTML = this.config.header.tagline;
        }

        // Update content sections
        Object.keys(this.content).forEach(section => {
            const element = document.querySelector(`#${section} .content`);
            if (element) {
                element.innerHTML = this.content[section];
            }
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const contentManager = new ContentManager();
    contentManager.init();
});