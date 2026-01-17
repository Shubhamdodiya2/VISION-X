// Projects Page JavaScript

class ProjectsManager {
  constructor() {
    this.projects = [];
    this.filteredProjects = [];
    this.currentView = 'grid';
    this.activeFilters = new Set();
    this.searchQuery = '';
    this.isInitialLoad = true;
    this.projectsPerRow = 3; // Assuming 3 projects per row in grid
    this.initialRows = 2;
    this.currentRows = this.initialRows;
    this.maxRows = 10; // Maximum rows to show

    this.init();
  }

  async init() {
    this.setupEventListeners();
    this.setupDarkMode();
    await this.loadProjects();
    this.filteredProjects = [...this.projects];

    // Set container to grid view by default
    const container = document.getElementById('projectsContainer');
    container.className = 'projects-container grid-view';

    this.renderProjects();
    this.updateShowMoreButton();
    this.updateLastUpdated();
    this.isInitialLoad = false;
  }

  setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    searchInput.addEventListener('input', (e) => {
      this.searchQuery = e.target.value.toLowerCase();
      this.filterProjects();
    });

    searchBtn.addEventListener('click', () => {
      this.filterProjects();
    });

    // Show more button
    const showMoreBtn = document.getElementById('showMoreBtn');
    if (showMoreBtn) {
      showMoreBtn.addEventListener('click', () => {
        this.showMoreProjects();
      });
    }

    // Back to top button
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }

    // Scroll event for back to top button
    window.addEventListener('scroll', () => {
      this.toggleBackToTopButton();
    });

    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark');
        localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
      });
    }

  }

  setupDarkMode() {
    const checkbox = document.getElementById('dark-mode-toggle');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
      if (checkbox) checkbox.checked = true;
    }
  }

  async loadProjects() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const container = document.getElementById('projectsContainer');

    try {
      // Add our static project cards
      this.projects = [
        {
          id: 'static-1',
          name: 'Web Development Portfolio',
          description: 'A modern, responsive portfolio website built with HTML, CSS, and JavaScript showcasing various web development projects and skills.',
          url: 'https://github.com',
          admin: 'Vision X Team',
          adminLinkedin: 'https://github.com',
          source: 'static',
          stars: 0,
          forks: 0,
          language: 'HTML/CSS/JS',
          lastUpdated: new Date().toISOString(),
          techStack: ['HTML', 'CSS', 'JavaScript', 'Responsive Design']
        },
        {
          id: 'static-2',
          name: 'E-Commerce Mobile App',
          description: 'A full-featured mobile e-commerce application with user authentication, product catalog, shopping cart, and payment integration.',
          url: 'https://github.com',
          admin: 'Vision X Team',
          adminLinkedin: 'https://github.com',
          source: 'static',
          stars: 0,
          forks: 0,
          language: 'React Native',
          lastUpdated: new Date().toISOString(),
          techStack: ['React Native', 'Node.js', 'MongoDB', 'Stripe API']
        },
        {
          id: 'static-3',
          name: 'Data Analytics Dashboard',
          description: 'An interactive dashboard for data visualization and analytics with real-time charts, graphs, and customizable reports.',
          url: 'https://github.com',
          admin: 'Vision X Team',
          adminLinkedin: 'https://github.com',
          source: 'static',
          stars: 0,
          forks: 0,
          language: 'Python',
          lastUpdated: new Date().toISOString(),
          techStack: ['Python', 'Django', 'Chart.js', 'PostgreSQL']
        },
        {
          id: 'static-4',
          name: 'AI Chatbot Assistant',
          description: 'An intelligent chatbot powered by machine learning that provides customer support and answers frequently asked questions.',
          url: 'https://github.com',
          admin: 'Vision X Team',
          adminLinkedin: 'https://github.com',
          source: 'static',
          stars: 0,
          forks: 0,
          language: 'Python',
          lastUpdated: new Date().toISOString(),
          techStack: ['Python', 'TensorFlow', 'NLP', 'Flask']
        },
        {
          id: 'static-5',
          name: '2D Platformer Game',
          description: 'A fun and engaging 2D platformer game with multiple levels, power-ups, and smooth gameplay mechanics.',
          url: 'https://github.com',
          admin: 'Vision X Team',
          adminLinkedin: 'https://github.com',
          source: 'static',
          stars: 0,
          forks: 0,
          language: 'C#',
          lastUpdated: new Date().toISOString(),
          techStack: ['Unity', 'C#', 'Game Design', 'Animation']
        },
        {
          id: 'static-6',
          name: 'Security Management System',
          description: 'A comprehensive security management system with user authentication, role-based access control, and audit logging.',
          url: 'https://github.com',
          admin: 'Vision X Team',
          adminLinkedin: 'https://github.com',
          source: 'static',
          stars: 0,
          forks: 0,
          language: 'Java',
          lastUpdated: new Date().toISOString(),
          techStack: ['Java', 'Spring Boot', 'JWT', 'MySQL']
        }
      ];

      // Try to load additional projects from JSON file and GitHub API
      try {
        const jsonResponse = await fetch('./src/data/projects.json');
        const jsonProjects = await jsonResponse.json();
        const githubProjects = await this.fetchGitHubProjects();

        // Add additional projects
        this.projects = [
          ...this.projects,
          ...jsonProjects.map(project => this.processJsonProject(project)),
          ...githubProjects.map(project => this.processGitHubProject(project))
        ];
      } catch (additionalError) {
        console.log('Additional projects not available, using static projects only');
      }

      // Hide loading spinner
      if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
      }

    } catch (error) {
      console.error('Error loading projects:', error);
      container.innerHTML = `
        <div class="error-message">
          <h3>Error Loading Projects</h3>
          <p>Unable to load projects at this time. Please try again later.</p>
        </div>
      `;
    }
  }

  async fetchGitHubProjects() {
    try {
      // Fetch trending repositories from GitHub API
      const response = await fetch('https://api.github.com/search/repositories?q=stars:>100+language:javascript+language:python+language:java&sort=stars&order=desc&per_page=20');
      const data = await response.json();

      return data.items.map(repo => ({
        name: repo.name,
        description: repo.description || 'No description available',
        html_url: repo.html_url,
        owner: repo.owner.login,
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        language: repo.language,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        topics: repo.topics || []
      }));
    } catch (error) {
      console.error('Error fetching GitHub projects:', error);
      return [];
    }
  }

  processJsonProject(project) {
    return {
      id: `json-${Math.random().toString(36).substr(2, 9)}`,
      name: project['Project name'],
      description: project['Project description'],
      url: project['Project link'],
      admin: project['Project admin'],
      adminLinkedin: project['Admin linkedin'],
      source: 'json',
      stars: 0,
      forks: 0,
      language: 'Web Development',
      lastUpdated: new Date().toISOString()
    };
  }

  processGitHubProject(project) {
    return {
      id: `github-${project.name}-${project.owner}`,
      name: project.name,
      description: project.description,
      url: project.html_url,
      admin: project.owner,
      adminLinkedin: `https://github.com/${project.owner}`,
      source: 'github',
      stars: project.stargazers_count,
      forks: project.forks_count,
      language: project.language,
      lastUpdated: project.updated_at
    };
  }


  filterProjects() {
    this.filteredProjects = this.projects.filter(project => {
      // Search filter
      const matchesSearch = !this.searchQuery ||
        project.name.toLowerCase().includes(this.searchQuery) ||
        project.description.toLowerCase().includes(this.searchQuery) ||
        project.admin.toLowerCase().includes(this.searchQuery);

      return matchesSearch;
    });

    // Reset to initial rows when filtering
    this.currentRows = this.initialRows;
    this.renderProjects();
    this.updateShowMoreButton();
  }


  showMoreProjects() {
    this.currentRows++;
    this.renderProjects();
    this.updateShowMoreButton();
  }

  toggleBackToTopButton() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  }

  updateShowMoreButton() {
    const showMoreBtn = document.getElementById('showMoreBtn');
    if (showMoreBtn) {
      const maxProjects = this.projectsPerRow * this.maxRows;
      const currentProjects = this.projectsPerRow * this.currentRows;

      if (currentProjects >= this.filteredProjects.length || currentProjects >= maxProjects) {
        showMoreBtn.disabled = true;
        showMoreBtn.innerHTML = '<span>No More Projects</span>';
      } else {
        showMoreBtn.disabled = false;
        showMoreBtn.innerHTML = `
          <span>Show More</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        `;
      }
    }
  }

  renderProjects() {
    const container = document.getElementById('projectsContainer');

    if (this.filteredProjects.length === 0) {
      container.innerHTML = `
      <div class="no-results">
        <h3>No projects found</h3>
        <p>Try adjusting your search or filters to find more projects.</p>
      </div>
    `;
      return;
    }
    // Calculate how many projects to show
    const projectsToShow = Math.min(
      this.projectsPerRow * this.currentRows,
      this.filteredProjects.length
    );

    // Get the projects to display
    const projectsToDisplay = this.filteredProjects.slice(0, projectsToShow);

    container.innerHTML = projectsToDisplay.map(project =>
      this.createProjectCard(project)
    ).join('');
  }

  createProjectCard(project) {

    const adminInitials = project.admin.split(' ').map(name => name[0]).join('').toUpperCase();

    // Get tech stack tags
    const techStackTags = project.techStack ? 
      project.techStack.map(tech => `<span class="tech-tag">${tech}</span>`).join('') : 
      `<span class="tech-tag">${project.language}</span>`;

    const githubStats = project.source === 'github' ? `
      <div class="github-stats">
        <div class="stat-item">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 .25a.75.75 0 0 1 .673.418l3.058 6.13c.042.084.061.18.061.273 0 .313-.253.567-.567.567H9.5v3.75a.75.75 0 0 1-1.5 0V7.5H5.567a.567.567 0 0 1-.567-.567c0-.093.02-.189.061-.273L8.327.668A.75.75 0 0 1 8 .25Z"/>
          </svg>
          ${project.stars}
        </div>
        <div class="stat-item">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5 3.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm0 2.122a2.25 2.25 0 1 0 0 4.244 2.25 2.25 0 0 0 0-4.244ZM7.5 5.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 7.25a2.25 2.25 0 1 0 0 4.244 2.25 2.25 0 0 0 0-4.244ZM9.5 5.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.5 7.25a2.25 2.25 0 1 0 0 4.244 2.25 2.25 0 0 0 0-4.244ZM11.5 5.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM11.5 7.25a2.25 2.25 0 1 0 0 4.244 2.25 2.25 0 0 0 0-4.244ZM13.5 5.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM13.5 7.25a2.25 2.25 0 1 0 0 4.244 2.25 2.25 0 0 0 0-4.244Z"/>
          </svg>
          ${project.forks}
        </div>
      </div>
    ` : '';

    return `
      <div class="project-card">
        <div class="project-header">
          <div class="project-icon">
            ${project.name.charAt(0).toUpperCase()}
          </div>
          <div class="project-info">
            <h3 class="project-title">${project.name}</h3>
            <p class="project-description">${project.description}</p>
            <div class="tech-stack">
              ${techStackTags}
            </div>
            <div class="project-meta">
              <div class="project-admin">
                <div class="admin-avatar">${adminInitials}</div>
                <span>${project.admin}</span>
              </div>
            </div>
            <div class="project-actions">
              <a href="${project.url}" target="_blank" class="project-link github-btn">
                <i class="fab fa-github"></i>
                GitHub
              </a>
            </div>
            ${githubStats}
          </div>
        </div>
      </div>
    `;
  }

  updateLastUpdated() {
    const lastUpdatedElement = document.getElementById('lastUpdated');
    if (lastUpdatedElement) {
      const now = new Date();
      lastUpdatedElement.textContent = now.toLocaleTimeString();
    }
  }
}


// Initialize the projects manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ProjectsManager();
});