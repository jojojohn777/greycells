function animateCounters() {
    const counters = document.querySelectorAll('.impact-number');
    
    counters.forEach(counter => {
      const target = parseInt(counter.parentElement.parentElement.getAttribute('data-target'));
      const increment = target / 100;
      let current = 0;
      
      const updateCounter = () => {
        if (current < target) {
          current += increment;
          counter.textContent = Math.ceil(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };
      
      updateCounter();
    });
  }

  // Filter functionality
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');
      
      const filter = button.getAttribute('data-filter');
      const items = document.querySelectorAll('.portfolio-item');
      
      items.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Load more functionality
  document.getElementById('loadMore').addEventListener('click', () => {
    alert('This would load more articles from your blog database!');
  });

  // Modal content loading
  document.querySelectorAll('.btn-portfolio').forEach(button => {
    button.addEventListener('click', (e) => {
      const project = e.target.closest('.btn-portfolio').getAttribute('data-project');
      const modalContent = document.getElementById('modalContent');
      
      // Sample content - replace with actual article content
      modalContent.innerHTML = `
        <div class="article-preview">
          <h4>Article: ${project}</h4>
          <p class="lead">This is where the full article content would be displayed...</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
          <div class="mt-4">
            <a href="#" class="btn btn-primary">Read Full Article</a>
            <a href="#" class="btn btn-outline-secondary ms-2">Share</a>
          </div>
        </div>
      `;
    });
  });

  // Initialize animations on page load
  window.addEventListener('load', () => {
    animateCounters();
  });

  // Newsletter subscription
  document.querySelectorAll('.newsletter-form').forEach(form => {
    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button') || form.querySelector('.btn');
    
    if (button) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const email = input.value;
        if (email) {
          alert(`Thank you for subscribing with email: ${email}`);
          input.value = '';
        } else {
          alert('Please enter a valid email address.');
        }
      });
    }
  });