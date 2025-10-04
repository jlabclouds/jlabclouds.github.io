// static/scripts/site.js
document.addEventListener('DOMContentLoaded', function() {
    // Cache for loaded content
    const contentCache = new Map();

    // Initialize Bootstrap components
    function initializeBootstrapComponents(container = document) {
        const components = {
            tooltip: bootstrap.Tooltip,
            popover: bootstrap.Popover,
            modal: bootstrap.Modal,
            dropdown: bootstrap.Dropdown,
            offcanvas: bootstrap.Offcanvas
        };

        // Initialize components
        Object.entries(components).forEach(([type, Component]) => {
            const elements = container.querySelectorAll(`[data-bs-toggle="${type}"]`);
            elements.forEach(el => new Component(el));
        });

        // Initialize carousels separately as they have a different data attribute
        container.querySelectorAll('.carousel').forEach(el => new bootstrap.Carousel(el));
    }

    // Set current year
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Sanitize HTML (basic)
    function sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    // Initialize Bootstrap components after content load
    function initializeBootstrapComponents() {
        const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltips.forEach(el => new bootstrap.Tooltip(el));

        const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
        popovers.forEach(el => new bootstrap.Popover(el));

        const dropdowns = document.querySelectorAll('[data-bs-toggle="dropdown"]');
        dropdowns.forEach(el => new bootstrap.Dropdown(el));
    }

    // Handle navigation clicks
    document.addEventListener('click', function(e) {
        // Check if the clicked element is a link within our site
        const link = e.target.closest('a');
        if (link && 
            link.href && 
            link.href.startsWith(window.location.origin) && 
            !link.hasAttribute('data-no-dynamic') && 
            !link.getAttribute('target')) {
            
            e.preventDefault();
            const url = link.href;
            
            // Update URL without reload
            window.history.pushState({}, '', url);
            
            // Load the content
            loadContent(url);
        }
    });

    // Load page components
    Promise.all([
        fetch('main/nav.html').then(res => res.ok ? res.text() : Promise.reject(res)),
        fetch('main/welcome.html').then(res => res.ok ? res.text() : Promise.reject(res)),
        fetch('main/footer.html').then(res => res.ok ? res.text() : Promise.reject(res))
    ])
    .then(([navContent, headContent, footerContent]) => {
        // Insert the content
        const navPlaceholder = document.getElementById('nav-placeholder');
        const headPlaceholder = document.getElementById('head-placeholder');
        const footerPlaceholder = document.getElementById('footer-placeholder');

        if (navPlaceholder) navPlaceholder.innerHTML = navContent;
        if (headPlaceholder) headPlaceholder.innerHTML = headContent;
        if (footerPlaceholder) footerPlaceholder.innerHTML = footerContent;

        initializeBootstrapComponents();
    });

    // Start the application
    async function loadContent(url, targetId) {
        try {
            let content;
            if (contentCache.has(url)) {
                content = contentCache.get(url);
            } else {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                content = await response.text();
                contentCache.set(url, content);
            }

            const target = document.getElementById(targetId);
            if (target) {
                target.innerHTML = content;
                initializeBootstrapComponents(target);
                window.scrollTo(0, 0);
            }
        } catch (error) {
            console.error('Error loading content:', error);
        }
    }
});


