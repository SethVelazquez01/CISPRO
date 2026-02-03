// ===== MOBILE NAVIGATION =====
const mobileToggle = document.querySelector('.mobile-toggle');
const nav = document.querySelector('.nav');
const navDropdowns = document.querySelectorAll('.nav-dropdown');

if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    nav.classList.toggle('active');
  });
}

// Mobile dropdown toggle
navDropdowns.forEach(dropdown => {
  const link = dropdown.querySelector('.nav-link');
  if (link) {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        dropdown.classList.toggle('active');
      }
    });
  }
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.header')) {
    nav.classList.remove('active');
    mobileToggle?.classList.remove('active');
  }
});

// ===== HEADER SCROLL EFFECT =====
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header?.classList.add('scrolled');
  } else {
    header?.classList.remove('scrolled');
  }
});

// ===== FAQ ACCORDION =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  
  if (question) {
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all FAQ items in the same category
      const parentCategory = item.closest('.faq-category');
      if (parentCategory) {
        parentCategory.querySelectorAll('.faq-item').forEach(faq => {
          faq.classList.remove('active');
        });
      }
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  }
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId !== '#') {
      e.preventDefault();
      const target = document.querySelector(targetId);
      if (target) {
        const headerHeight = header?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile menu after clicking
        nav.classList.remove('active');
        mobileToggle?.classList.remove('active');
      }
    }
  });
});

// ===== ANIMATE ON SCROLL =====
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add animation classes
document.querySelectorAll('.service-card, .large-card, .small-card, .mvv-card, .client-logo').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// CSS for animation
const style = document.createElement('style');
style.textContent = `
  .animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
  }
`;
document.head.appendChild(style);

// ===== COUNTER ANIMATION =====
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  const updateCounter = () => {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start) + '+';
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target + '+';
    }
  };
  
  updateCounter();
}

// Animate stats when visible
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumbers = entry.target.querySelectorAll('.hero-stat-number, .about-image-badge-number');
      statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent);
        if (!isNaN(target)) {
          animateCounter(stat, target);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats, .about-image-badge').forEach(el => {
  statsObserver.observe(el);
});

// ===== ACTIVE NAV LINK =====
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
  
  document.querySelectorAll('.nav-dropdown-item').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
      link.closest('.nav-dropdown')?.querySelector('.nav-link')?.classList.add('active');
    }
  });
}

setActiveNavLink();

// ===== IMAGE LAZY LOADING =====
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ===== FORM VALIDATION HELPER =====
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^[\d\s\-\+\(\)]{10,}$/;
  return re.test(phone);
}

// Export for use in forms
window.validateEmail = validateEmail;
window.validatePhone = validatePhone;
