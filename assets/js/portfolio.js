// Portfolio JavaScript Functionality
document.addEventListener('DOMContentLoaded', function () {
  // Portfolio filtering functionality
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  // Initialize portfolio items with a staggered delay
  portfolioItems.forEach((item, index) => {
    setTimeout(() => {
      item.classList.add('show');
    }, index * 100);
  });

  // Filter functionality
  filterButtons.forEach(button => {
    button.addEventListener('click', function () {
      const filter = this.getAttribute('data-filter');

      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      // Filter items based on the selected filter
      portfolioItems.forEach((item, index) => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          setTimeout(() => {
            item.classList.remove('hide');
            item.classList.add('show');
          }, index * 50);
        } else {
          item.classList.remove('show');
          item.classList.add('hide');
        }
      });
    });
  });

  // Modal functionality
  const portfolioModal = document.getElementById('portfolioModal');
  const modalContent = document.getElementById('modalContent');
  const closeModalBtn = document.getElementById('closeModal');
  const portfolioBtns = document.querySelectorAll('.btn-portfolio');

  // Ensure projectData is defined somewhere in your code
  const projectData = {}; // Define your project data here

  portfolioBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const projectId = this.getAttribute('data-project');
      const project = projectData[projectId];

      if (project) {
        modalContent.innerHTML = `
                    <h2>${project.title}</h2>
                    <p><strong>Category:</strong> ${project.category}</p>
                    <img src="${project.image}" alt="${project.title}" style="width: 100%; max-height: 300px; object-fit: cover; margin: 10px 0;">
                    <p>${project.description}</p>
                    <ul>
                        ${project.details.map(detail => `<li>${detail}</li>`).join('')}
                    </ul>
                    <p><strong>Date:</strong> ${project.date}</p>
                    <p><strong>Client:</strong> ${project.client}</p>
                    <p><strong>Duration:</strong> ${project.duration}</p>
                `;
        portfolioModal.classList.add('open');
      }
    });
  });

  // Close modal functionality
  closeModalBtn.addEventListener('click', function () {
    portfolioModal.classList.remove('open');
    modalContent.innerHTML = '';
  });

  // Close modal on outside click
  window.addEventListener('click', function (e) {
    if (e.target === portfolioModal) {
      portfolioModal.classList.remove('open');
      modalContent.innerHTML = '';
    }
  });
});

