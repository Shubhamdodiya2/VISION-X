    // Dark mode functionality
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // Check for saved dark mode preference
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
      body.classList.add('dark');
      darkModeToggle.checked = true;
    }

    darkModeToggle.addEventListener('change', () => {
      if (darkModeToggle.checked) {
        body.classList.add('dark');
        localStorage.setItem('darkMode', 'enabled');
      } else {
        body.classList.remove('dark');
        localStorage.setItem('darkMode', 'disabled');
      }
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const roadmapsContainer = document.getElementById('roadmapsContainer');
    const noResults = document.getElementById('noResults');

    function filterRoadmaps() {
      const searchTerm = searchInput.value.toLowerCase().trim();
      const roadmapCards = document.querySelectorAll('.roadmap-card');
      let visibleCount = 0;

      roadmapCards.forEach(card => {
        const title = card.getAttribute('data-title').toLowerCase();
        const description = card.getAttribute('data-description').toLowerCase();
        
        if (searchTerm === '' || title.includes(searchTerm) || description.includes(searchTerm)) {
          card.style.display = 'block';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Show/hide no results message
      if (visibleCount === 0 && searchTerm !== '') {
        noResults.style.display = 'block';
        roadmapsContainer.style.display = 'none';
      } else {
        noResults.style.display = 'none';
        roadmapsContainer.style.display = 'grid';
      }
    }

    // Search event listeners
    searchInput.addEventListener('input', filterRoadmaps);
    searchBtn.addEventListener('click', filterRoadmaps);

    // Enter key support for search
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        filterRoadmaps();
      }
    });

    // Back to top button functionality
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Clear search when page loads
    window.addEventListener('load', () => {
      searchInput.value = '';
      filterRoadmaps();
    });