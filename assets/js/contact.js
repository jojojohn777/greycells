document.addEventListener('DOMContentLoaded', () => {
  // Particle Reset Loop
  const particles = document.querySelectorAll('.particle');
  particles.forEach(p => {
    const duration = 12 + Math.random() * 6;
    p.style.animationDuration = `${duration}s`;
    p.style.top = `${Math.random() * 100}%`;
  });

  // Animate Text Lines on Load
  const animateText = () => {
    const lines = document.querySelectorAll('.title-line-1, .title-line-2, .title-line-3, .hero-subtitle');
    lines.forEach(line => {
      line.style.opacity = '1';
      line.style.transform = 'translateX(0)';
    });
  };
  animateText();

  // Floating Emoji Animation Enhancement (randomized drift)
  const floatingElements = document.querySelectorAll('.floating-element');
  floatingElements.forEach(el => {
    const randomDuration = 5 + Math.random() * 4;
    el.style.animationDuration = `${randomDuration}s`;
    el.style.animationTimingFunction = 'ease-in-out';
  });

  // Contact Form Submission
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', e => {
    e.preventDefault();

    const btn = form.querySelector('.submit-btn');
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = `<i class="fas fa-spinner fa-spin me-2"></i> Sending...`;

    // Simulate async submission
    setTimeout(() => {
      alert('Thank you! Your message has been sent.');
      btn.disabled = false;
      btn.innerHTML = originalText;
      form.reset();
    }, 2000);
  });

  // Shine effect on submit button
  const shineBtn = document.querySelector('.submit-btn');
  const shineDiv = document.createElement('div');
  shineDiv.classList.add('btn-shine');
  shineBtn.appendChild(shineDiv);

  shineBtn.addEventListener('mousemove', e => {
    const rect = shineBtn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    shineDiv.style.left = `${x}px`;
  });

  // Scroll-based animation (fade-in / slide-in)
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  document.querySelectorAll('.quick-contact-grid, .social-links, .contact-form-container').forEach(el => {
    observer.observe(el);
  });
});

