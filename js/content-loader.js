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
            // Fallback config
            this.config = {
                site: {
                    title: "Philip Sulewski",
                    subtitle: "PhD Student • NeuroAI Research • University of Osnabrück",
                    lastUpdated: "2025"
                },
                header: {
                    name: "Philip Sulewski",
                    tagline: "PhD Student • NeuroAI Research • University of Osnabrück"
                }
            };
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
            return this.getFallbackContent(section);
        }
    }

    parseMarkdown(markdown) {
        // Remove code block markers if present
        markdown = markdown.replace(/^```markdown\s*\n?/gm, '').replace(/^```\s*$/gm, '');
        
        // Parse markdown with proper HTML structure
        let html = markdown
            // Headers
            .replace(/^### (.+)$/gm, '<h3>$1</h3>')
            .replace(/^## (.+)$/gm, '<h2>$1</h2>')
            .replace(/^# (.+)$/gm, '<h1>$1</h1>')
            // Bold and italic
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            // Lists
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            // Paragraphs (split by double newlines)
            .split('\n\n')
            .map(paragraph => {
                paragraph = paragraph.trim();
                if (!paragraph) return '';
                if (paragraph.startsWith('<h') || paragraph.startsWith('<li')) {
                    return paragraph;
                }
                if (paragraph.includes('<li>')) {
                    return '<ul>' + paragraph + '</ul>';
                }
                return '<p>' + paragraph.replace(/\n/g, '<br>') + '</p>';
            })
            .join('\n');

        // Clean up list formatting
        html = html.replace(/<\/li>\n<li>/g, '</li><li>');
        html = html.replace(/<li>/g, '<ul><li>').replace(/<\/li>(?!\s*<li>)/g, '</li></ul>');
        html = html.replace(/<\/ul>\s*<ul>/g, '');

        return html;
    }

    getFallbackContent(section) {
        const fallbacks = {
            about: `
                <p>I'm a PhD student at the University of Osnabrück, working at the intersection of neuroscience and artificial intelligence. My research focuses on understanding how the human brain solves the exploration-exploitation dilemma in visual information sampling.</p>
                <div class="about-content">
                    Currently investigating neural mechanisms of visual attention using MEG, eye-tracking, and computational modeling. Previously worked on individual differences in visual object representations and brain-computer interfaces.
                    <span class="cursor"></span>
                </div>
            `,
            research: `
                <div class="research-item">
                    <h3>Visual Attention & Exploration</h3>
                    <p>How does the brain decide where to look next? Investigating the neural dynamics of visual information sampling using MEG and eye-tracking.</p>
                </div>
                <div class="research-item">
                    <h3>Individual Neural Variability</h3>
                    <p>Understanding spatiotemporal differences in neural representations during visual object recognition across individuals.</p>
                </div>
                <div class="research-item">
                    <h3>Brain-Computer Interfaces</h3>
                    <p>Exploring attention, metacognition, and perceptual decision-making through neural feedback systems.</p>
                </div>
                <div class="research-item">
                    <h3>Computational Modeling</h3>
                    <p>Building models that bridge the gap between neural mechanisms and cognitive behavior.</p>
                </div>
            `,
            publications: `
                <div class="publication">
                    <div class="publication-title">Two types of representational echoes in the human visual system</div>
                    <div class="publication-details">Sulewski, P., König, P., Kriegeskorte, N., & Kietzmann, T.C.<br>European Conference for Visual Perception (ECVP), 2022</div>
                </div>
                <div class="publication">
                    <div class="publication-title">Analyses of the neural population dynamics during human object vision</div>
                    <div class="publication-details">Sulewski, P., König, P., Kriegeskorte, N., & Kietzmann, T.C.<br>Neuromatch 4.0, 2021</div>
                </div>
                <div class="publication">
                    <div class="publication-title">Neurofeedback-induced choice blindness reveals integration of metacognition</div>
                    <div class="publication-details">Rebouillat, B., Sulewski, P. & Kouider, S.<br>23rd Annual Meeting of ASSC, 2019</div>
                </div>
                <div class="publication">
                    <div class="publication-title">Tracing individual variability of visual object representations</div>
                    <div class="publication-details">Master Thesis, University of Göttingen, 2020<br>Grade: 1.0 (with distinction)</div>
                </div>
            `,
            contact: `
                <div class="contact-info">
                    <div class="contact-item">email: psulewski@uos.de</div>
                    <div class="contact-item">location: Osnabrück, Germany</div>
                    <div class="contact-item">office: IKW Room: 50/110</div>
                    <div class="contact-item">twitter: @PhilipSulewski</div>
                </div>
            `
        };
        return fallbacks[section] || '<p>Content not available</p>';
    }

    formatAboutContent(content) {
        // Special formatting for about section
        const parts = content.split('## Terminal Content');
        if (parts.length > 1) {
            return parts[0] + `
                <div class="about-content">
                    ${parts[1].replace(/<p>|<\/p>/g, '').trim()}
                    <span class="cursor"></span>
                </div>
            `;
        }
        return content + '<div class="about-content">Loading...<span class="cursor"></span></div>';
    }

    formatResearchContent(content) {
        // Convert research content to styled research items
        const sections = content.split('<h2>').filter(section => section.trim());
        return sections.map(section => {
            const [title, ...contentParts] = section.split('</h2>');
            const description = contentParts.join('</h2>').trim();
            return `
                <div class="research-item">
                    <h3>${title}</h3>
                    ${description}
                </div>
            `;
        }).join('');
    }

    formatPublicationsContent(content) {
        // Parse publications and format them
        const sections = content.split('<h2>').filter(section => section.trim());
        let formattedPubs = '';
        
        sections.forEach(section => {
            const lines = section.split('\n').filter(line => line.trim());
            const sectionTitle = lines[0].replace('</h2>', '');
            
            lines.slice(1).forEach(line => {
                if (line.startsWith('<li>')) {
                    const pubContent = line.replace('<li>', '').replace('</li>', '');
                    const parts = pubContent.split('\n').filter(p => p.trim());
                    
                    if (parts.length >= 2) {
                        const title = parts[0].replace(/^\*\*|\*\*$/g, '');
                        const details = parts.slice(1).join('<br>');
                        
                        formattedPubs += `
                            <div class="publication">
                                <div class="publication-title">${title}</div>
                                <div class="publication-details">${details}</div>
                            </div>
                        `;
                    }
                }
            });
        });
        
        return formattedPubs || this.getFallbackContent('publications');
    }

    formatContactContent(content) {
        // Convert contact list to styled contact info
        const items = content.match(/<li>([^<]+)<\/li>/g) || [];
        const contactItems = items.map(item => {
            const text = item.replace(/<li>|<\/li>/g, '').replace(/^- /, '');
            return `<div class="contact-item">${text}</div>`;
        }).join('');
        
        return `<div class="contact-info">${contactItems}</div>`;
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
        // Update header from config
        if (this.config.header) {
            const titleElement = document.querySelector('.header h1');
            const taglineElement = document.querySelector('.tagline');
            
            if (titleElement && this.config.header.name) {
                titleElement.textContent = this.config.header.name;
            }
            if (taglineElement && this.config.header.tagline) {
                taglineElement.innerHTML = this.config.header.tagline.replace(/•/g, '• <span class="accent-text">').replace(/University/, '</span> University');
            }
        }

        // Update last updated date
        if (this.config.site && this.config.site.lastUpdated) {
            const lastUpdatedElement = document.querySelector('#last-updated');
            if (lastUpdatedElement) {
                lastUpdatedElement.textContent = this.config.site.lastUpdated;
            }
        }

        // Update content sections with special formatting
        Object.keys(this.content).forEach(section => {
            const element = document.querySelector(`#${section} .content`);
            if (element) {
                let formattedContent = this.content[section];
                
                // Apply special formatting based on section
                switch (section) {
                    case 'about':
                        formattedContent = this.formatAboutContent(formattedContent);
                        break;
                    case 'research':
                        formattedContent = this.formatResearchContent(formattedContent);
                        break;
                    case 'publications':
                        formattedContent = this.formatPublicationsContent(formattedContent);
                        break;
                    case 'contact':
                        formattedContent = this.formatContactContent(formattedContent);
                        break;
                }
                
                element.innerHTML = formattedContent;
            }
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const contentManager = new ContentManager();
    contentManager.init();
});