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
                    subtitle: "Vision • Cognition • Computation",
                    lastUpdated: "2025"
                },
                header: {
                    name: "Philip Sulewski",
                    tagline: "Vision • Cognition • Computation"
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
                <div class="publication-category">
                    <h3 class="publication-category-title">Recent Publications</h3>
                    <div class="publication paper">
                        <div class="publication-title">Two types of representational echoes in the human visual system</div>
                        <div class="publication-details">Sulewski, P., König, P., Kriegeskorte, N., & Kietzmann, T.C.<br>European Conference for Visual Perception (ECVP), 2022</div>
                        <span class="publication-type">paper</span>
                    </div>
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
        // Get the intro paragraph
        const introParagraph = content.replace(/<p>|<\/p>/g, '').trim();
        
        // Terminal content with ASCII art
        const terminalContent = `Greetings! I am Philip Sulewski, a PhD student in the Kietzmann Lab at University of Osnabrück, working at the intersection of neuroscience and machine learning. My research focuses on understanding how the human brain solves the exploration-exploitation dilemma in visual information sampling.
        Currently investigating neural mechanisms of visual attention using MEG, eye-tracking, and computational modeling. Previously worked on individual differences in visual object representations and brain-computer interfaces.

        Research interests:
        • Timing of visual attention
        • Neural dynamics of active vision 
        • Predictive computations for visual perception
        • Individual differences in neural representations
        • Computational modeling of visiual intelligence`


                    
        


     ;
        
        return introParagraph + `
            <div class="about-content">
                ${terminalContent}
                <span class="cursor"></span>
            </div>
        `;
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
        // We need to work with the original markdown, not the converted HTML
        // Let's fetch the raw markdown again for publications
        return this.parsePublicationsFromMarkdown();
    }

    async parsePublicationsFromMarkdown() {
        try {
            // Fetch the raw markdown file directly
            const response = await fetch('./content/publications.md');
            const rawMarkdown = await response.text();
            
            const lines = rawMarkdown.split('\n');
            let formattedHTML = '';
            let currentSection = null;
            let currentPublication = null;
            let publicationLines = [];
            
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();
                
                // Check for section headers (## Section Name)
                if (line.startsWith('## ')) {
                    // Save previous publication if exists
                    if (currentPublication && publicationLines.length > 0) {
                        formattedHTML += this.formatSinglePublication(
                            currentPublication, 
                            publicationLines.join(' '), 
                            currentSection
                        );
                    }
                    
                    // Start new section
                    currentSection = line.replace('## ', '').trim();
                    // Rename "Conference Papers" to "Conference Contributions"
                    if (currentSection === 'Conference Papers') {
                        currentSection = 'Conference Contributions';
                    }
                    
                    formattedHTML += `<div class="publication-category">`;
                    formattedHTML += `<h3 class="publication-category-title">${currentSection}</h3>`;
                    currentPublication = null;
                    publicationLines = [];
                    continue;
                }
                
                // Check for publication start (- **Title**)
                const pubMatch = line.match(/^- \*\*(.+?)\*\*/);
                if (pubMatch) {
                    // Save previous publication if exists
                    if (currentPublication && publicationLines.length > 0) {
                        formattedHTML += this.formatSinglePublication(
                            currentPublication, 
                            publicationLines.join(' '), 
                            currentSection
                        );
                    }
                    
                    // Start new publication
                    currentPublication = pubMatch[1];
                    publicationLines = [];
                    
                    // Get the rest of the line after the title
                    const restOfLine = line.replace(/^- \*\*.+?\*\*\s*/, '');
                    if (restOfLine) {
                        publicationLines.push(restOfLine);
                    }
                    continue;
                }
                
                // Add content to current publication (lines that don't start with - or ##)
                if (currentPublication && line && !line.startsWith('- ') && !line.startsWith('## ') && !line.startsWith('# ')) {
                    publicationLines.push(line);
                }
            }
            
            // Don't forget the last publication
            if (currentPublication && publicationLines.length > 0) {
                formattedHTML += this.formatSinglePublication(
                    currentPublication, 
                    publicationLines.join(' '), 
                    currentSection
                );
            }
            
            // Close the last section
            if (currentSection) {
                formattedHTML += `</div>`;
            }
            
            return formattedHTML;
            
        } catch (error) {
            console.warn('Failed to parse publications from markdown:', error);
            return this.getFallbackContent('publications');
        }
    }

    formatSinglePublication(title, details, category) {
        // Clean up the details
        let cleanDetails = details
            .replace(/^\s*-?\s*/, '') // Remove leading dashes/spaces
            .replace(/\*([^*]+)\*/g, '<em>$1</em>') // Convert *italic* to <em>
            .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="pub-link">$1</a>') // Make URLs clickable
            .replace(/\s+/g, ' ') // Normalize spaces
            .trim();
        
        // Determine publication type based on category and content
        let pubType = 'paper';
        const categoryLower = category.toLowerCase();
        const detailsLower = cleanDetails.toLowerCase();
        
        if (categoryLower.includes('preprint')) {
            pubType = 'preprint';
        } else if (categoryLower.includes('conference') || detailsLower.includes('conference') || 
                   detailsLower.includes('presented at') || detailsLower.includes('ecvp') || 
                   detailsLower.includes('poster') || detailsLower.includes('ccn') || 
                   detailsLower.includes('assc') || detailsLower.includes('neuromatch')) {
            pubType = 'conference';
        } else if (categoryLower.includes('thesis') || categoryLower.includes('theses')) {
            pubType = 'thesis';
        } else if (categoryLower.includes('talk') || categoryLower.includes('invited')) {
            pubType = 'talk';
        }
        
        return `
            <div class="publication ${pubType}">
                <div class="publication-title">${title}</div>
                <div class="publication-details">${cleanDetails}</div>
                <span class="publication-type">${pubType}</span>
            </div>
        `;
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
        
        await this.updateDOM();
    }

    async updateDOM() {
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
        for (const section of Object.keys(this.content)) {
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
                        formattedContent = await this.formatPublicationsContent(formattedContent);
                        break;
                    case 'contact':
                        formattedContent = this.formatContactContent(formattedContent);
                        break;
                }
                
                element.innerHTML = formattedContent;
            }
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const contentManager = new ContentManager();
    contentManager.init();
});