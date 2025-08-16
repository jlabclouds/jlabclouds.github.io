    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        // Set current year
        document.getElementById('year').textContent = new Date().getFullYear();

        // Enhanced search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', debounce(function(e) {
            // Implement advanced search logic here
            console.log('Searching:', e.target.value);
        }, 300));

        // Debounce function
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
