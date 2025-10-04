// Sidebar component functionality
class Sidebar {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.logo = document.getElementById('site-logo');
        this.isOpen = false;
        this.init();
    }

    init() {
        // Add click event to logo
        this.logo.addEventListener('click', () => this.toggleSidebar());

        // Add click events to all collapsible items
        document.querySelectorAll('.sidebar-section > .sidebar-header').forEach(header => {
            header.addEventListener('click', (e) => this.toggleSection(e));
        });
    }

    toggleSidebar() {
        this.isOpen = !this.isOpen;
        this.sidebar.classList.toggle('open');
        this.logo.classList.toggle('active');
    }

    toggleSection(e) {
        const section = e.target.closest('.sidebar-section');
        if (section) {
            section.classList.toggle('expanded');
        }
    }
}

// Initialize sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Sidebar();
});