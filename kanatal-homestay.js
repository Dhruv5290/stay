/**
 * MOUNTAIN RETREAT HOMESTAY - KANATAL
 * JavaScript for smooth animations and interactions
 */

'use strict';

// ===================================
// UTILITY FUNCTIONS
// ===================================

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// ===================================
// LOADING SCREEN
// ===================================

class LoadingScreen {
  constructor() {
    this.loadingScreen = document.getElementById('loadingScreen');
    this.init();
  }

  init() {
    // Ensure smooth rendering
    if (this.loadingScreen) {
      // Force hardware acceleration
      this.loadingScreen.style.transform = 'translateZ(0)';
    }

    window.addEventListener('load', () => {
      setTimeout(() => {
        this.hide();
      }, 1200); // Slightly longer to ensure smooth experience
    });

    // Fallback: Hide after max 3.5 seconds
    setTimeout(() => {
      this.hide();
    }, 3500);
  }

  hide() {
    if (this.loadingScreen && !this.loadingScreen.classList.contains('hidden')) {
      this.loadingScreen.classList.add('hidden');
      
      // Remove from DOM after animation completes
      setTimeout(() => {
        if (this.loadingScreen.parentNode) {
          this.loadingScreen.remove();
        }
      }, 800); // Match CSS transition duration
    }
  }
}

// ===================================
// NAVIGATION
// ===================================

class Navigation {
  constructor() {
    this.navbar = document.getElementById('navbar');
    this.hamburger = document.getElementById('hamburger');
    this.navMenu = document.getElementById('navMenu');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.init();
  }

  init() {
    // Scroll effect
    window.addEventListener('scroll', throttle(() => {
      this.handleScroll();
    }, 100));

    // Hamburger toggle
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => {
        this.toggleMenu();
      });
    }

    // Smooth scroll for nav links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        this.handleNavClick(e, link);
      });
    });

    // Active section highlighting
    window.addEventListener('scroll', throttle(() => {
      this.updateActiveLink();
    }, 100));
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
        this.closeMenu();
      }
    });
  }

  handleScroll() {
    if (window.scrollY > 100) {
      this.navbar.classList.add('scrolled');
    } else {
      this.navbar.classList.remove('scrolled');
    }
  }

  toggleMenu() {
    this.hamburger.classList.toggle('active');
    this.navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    
    // Close menu when clicking outside
    if (this.navMenu.classList.contains('active')) {
      const closeOnClickOutside = (e) => {
        if (!this.navMenu.contains(e.target) && !this.hamburger.contains(e.target)) {
          this.closeMenu();
          document.removeEventListener('click', closeOnClickOutside);
        }
      };
      
      // Add listener after a small delay to prevent immediate closing
      setTimeout(() => {
        document.addEventListener('click', closeOnClickOutside);
      }, 100);
    }
  }
  
  closeMenu() {
    this.hamburger.classList.remove('active');
    this.navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
  }

  handleNavClick(e, link) {
    const href = link.getAttribute('href');
    
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        const headerHeight = this.navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        if (this.navMenu.classList.contains('active')) {
          this.closeMenu();
        }
      }
    }
  }

  updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const scrollPosition = window.pageYOffset + 200;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    this.navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      
      if (href === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }
}

// ===================================
// SCROLL REVEAL ANIMATIONS
// ===================================

class ScrollReveal {
  constructor() {
    this.elements = document.querySelectorAll('.reveal');
    this.init();
  }

  init() {
    if (this.elements.length === 0) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    this.elements.forEach(element => {
      observer.observe(element);
    });
  }
}

// ===================================
// BACK TO TOP BUTTON
// ===================================

class BackToTop {
  constructor() {
    this.button = document.getElementById('backToTop');
    this.init();
  }

  init() {
    if (!this.button) return;

    window.addEventListener('scroll', throttle(() => {
      this.toggleVisibility();
    }, 100));

    this.button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  toggleVisibility() {
    if (window.scrollY > 300) {
      this.button.classList.add('visible');
    } else {
      this.button.classList.remove('visible');
    }
  }
}

// ===================================
// FORM HANDLING
// ===================================

class ContactForm {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.init();
  }

  init() {
    if (!this.form) return;

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Set minimum date for check-in to today
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    
    if (checkinInput && checkoutInput) {
      const today = new Date().toISOString().split('T')[0];
      checkinInput.setAttribute('min', today);
      
      // Update checkout minimum when checkin changes
      checkinInput.addEventListener('change', () => {
        const checkinDate = new Date(checkinInput.value);
        checkinDate.setDate(checkinDate.getDate() + 1);
        const minCheckout = checkinDate.toISOString().split('T')[0];
        checkoutInput.setAttribute('min', minCheckout);
        
        // Reset checkout if it's before new minimum
        if (checkoutInput.value && checkoutInput.value < minCheckout) {
          checkoutInput.value = '';
        }
      });
    }
  }

  handleSubmit() {
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);

    // Here you would typically send the data to a server
    console.log('Booking request:', data);

    // Show success message
    this.showMessage('Thank you! Your booking request has been received. We will contact you shortly.');
    
    // Reset form
    this.form.reset();
  }

  showMessage(message) {
    // Create a simple message notification
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      position: fixed;
      top: 100px;
      right: 30px;
      background: linear-gradient(135deg, #8ba89c, #b8d4a8);
      color: white;
      padding: 20px 30px;
      border-radius: 15px;
      box-shadow: 0 8px 30px rgba(139, 168, 156, 0.3);
      z-index: 10000;
      animation: slideInRight 0.5s ease;
      max-width: 350px;
      font-family: 'Montserrat', sans-serif;
      font-size: 0.95rem;
      line-height: 1.6;
    `;
    messageDiv.textContent = message;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideInRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(messageDiv);

    // Remove after 5 seconds
    setTimeout(() => {
      messageDiv.style.animation = 'slideOutRight 0.5s ease';
      setTimeout(() => {
        messageDiv.remove();
        style.remove();
      }, 500);
    }, 5000);
  }
}

// ===================================
// GALLERY LIGHTBOX (Simple)
// ===================================

class GalleryLightbox {
  constructor() {
    this.galleryItems = document.querySelectorAll('.gallery-item');
    this.init();
  }

  init() {
    this.galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          this.openLightbox(img.src, img.alt);
        }
      });
    });
  }

  openLightbox(src, alt) {
    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: rgba(0, 0, 0, 0.95);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      cursor: pointer;
      animation: fadeIn 0.3s ease;
    `;

    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.cssText = `
      max-width: 90%;
      max-height: 90vh;
      border-radius: 10px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      animation: zoomIn 0.3s ease;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.style.cssText = `
      position: absolute;
      top: 30px;
      right: 30px;
      background: white;
      border: none;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      font-size: 1.5rem;
      color: #4a5759;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    `;

    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.transform = 'scale(1.1) rotate(90deg)';
    });

    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.transform = 'scale(1) rotate(0deg)';
    });

    // Add animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes zoomIn {
        from {
          transform: scale(0.8);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);

    lightbox.appendChild(img);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Close on click
    const closeLightbox = () => {
      lightbox.style.animation = 'fadeIn 0.3s ease reverse';
      setTimeout(() => {
        lightbox.remove();
        style.remove();
        document.body.style.overflow = '';
      }, 300);
    };

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    closeBtn.addEventListener('click', closeLightbox);

    // Close on escape key
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);
  }
}

// ===================================
// PARALLAX EFFECT (Subtle)
// ===================================

class ParallaxEffect {
  constructor() {
    this.heroBackground = document.querySelector('.hero-background');
    this.init();
  }

  init() {
    if (!this.heroBackground) return;

    window.addEventListener('scroll', throttle(() => {
      const scrolled = window.pageYOffset;
      const parallaxSpeed = 0.5;
      this.heroBackground.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }, 10));
  }
}

// ===================================
// ROOMS CAROUSEL
// ===================================

class RoomsCarousel {
  constructor() {
    this.carousel = document.getElementById('roomsCarousel');
    this.leftArrow = document.querySelector('.carousel-arrow-left');
    this.rightArrow = document.querySelector('.carousel-arrow-right');
    this.dotsContainer = document.getElementById('carouselDots');
    this.currentIndex = 0;
    this.totalRooms = 0;
    this.isScrolling = false;
    this.isMobile = window.innerWidth <= 768;
    this.init();
  }

  init() {
    if (!this.carousel) return;

    this.totalRooms = this.carousel.querySelectorAll('.room-card').length;
    
    // Create dots based on screen size
    this.createDots();
    
    // Arrow click handlers
    if (this.leftArrow) {
      this.leftArrow.addEventListener('click', () => this.goToPrevious());
    }
    
    if (this.rightArrow) {
      this.rightArrow.addEventListener('click', () => this.goToNext());
    }
    
    // Listen to manual scroll events
    this.carousel.addEventListener('scroll', throttle(() => {
      this.syncWithScroll();
    }, 100));
    
    // Touch/swipe support
    this.addSwipeSupport();
    
    // Keyboard support
    this.addKeyboardSupport();
    
    // Handle window resize
    window.addEventListener('resize', debounce(() => {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth <= 768;
      
      // Recreate dots if screen size category changed
      if (wasMobile !== this.isMobile) {
        this.dotsContainer.innerHTML = '';
        this.createDots();
        this.currentIndex = 0;
        this.updateCarousel();
      }
    }, 250));
    
    // Update initial state
    this.updateCarousel();
  }

  createDots() {
    if (!this.dotsContainer) return;
    
    // Desktop: 2 dots (showing 3 cards, need 2 positions)
    // Mobile: 3 dots (showing 1 card at a time)
    const numDots = this.isMobile ? this.totalRooms : Math.max(1, this.totalRooms - 1);
    
    for (let i = 0; i < numDots; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Go to position ${i + 1}`);
      
      if (i === 0) {
        dot.classList.add('active');
      }
      
      dot.addEventListener('click', () => this.goToSlide(i));
      this.dotsContainer.appendChild(dot);
    }
  }

  syncWithScroll() {
    if (this.isScrolling) return;
    
    const scrollLeft = this.carousel.scrollLeft;
    const cardWidth = this.carousel.querySelector('.room-card').offsetWidth;
    const gap = 30;
    
    let newIndex;
    
    if (this.isMobile) {
      // Mobile: each dot represents one card
      newIndex = Math.round(scrollLeft / (cardWidth + gap));
      newIndex = Math.max(0, Math.min(newIndex, this.totalRooms - 1));
    } else {
      // Desktop: each dot represents a scroll position
      const maxScroll = this.carousel.scrollWidth - this.carousel.clientWidth;
      if (maxScroll > 0) {
        const scrollPercentage = scrollLeft / maxScroll;
        newIndex = Math.round(scrollPercentage * (this.totalRooms - 2));
        newIndex = Math.max(0, Math.min(newIndex, this.totalRooms - 2));
      } else {
        newIndex = 0;
      }
    }
    
    if (newIndex !== this.currentIndex) {
      this.currentIndex = newIndex;
      this.updateUI();
    }
  }

  goToPrevious() {
    const maxIndex = this.isMobile ? this.totalRooms - 1 : this.totalRooms - 2;
    
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
    }
  }

  goToNext() {
    const maxIndex = this.isMobile ? this.totalRooms - 1 : this.totalRooms - 2;
    
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
      this.updateCarousel();
    }
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateCarousel();
  }

  updateCarousel() {
    this.isScrolling = true;
    
    const cards = this.carousel.querySelectorAll('.room-card');
    const cardWidth = cards[0].offsetWidth;
    const gap = 30;
    
    let scrollPosition;
    
    if (this.isMobile) {
      // Mobile: scroll to specific card
      scrollPosition = (cardWidth + gap) * this.currentIndex;
    } else {
      // Desktop: scroll to position (showing 3 cards at a time)
      scrollPosition = (cardWidth + gap) * this.currentIndex;
    }
    
    this.carousel.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });

    this.updateUI();
    
    // Reset scrolling flag after animation
    setTimeout(() => {
      this.isScrolling = false;
    }, 500);
  }

  updateUI() {
    // Update dots
    if (this.dotsContainer) {
      const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((dot, index) => {
        if (index === this.currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    }

    // Update arrow states
    const maxIndex = this.isMobile ? this.totalRooms - 1 : this.totalRooms - 2;
    
    if (this.leftArrow) {
      this.leftArrow.disabled = this.currentIndex === 0;
    }
    
    if (this.rightArrow) {
      this.rightArrow.disabled = this.currentIndex >= maxIndex;
    }
  }

  addSwipeSupport() {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;
    let isHorizontalSwipe = false;

    this.carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
      isHorizontalSwipe = false;
    }, { passive: true });

    this.carousel.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
      
      const diffX = Math.abs(currentX - startX);
      const diffY = Math.abs(currentY - startY);
      
      if (diffX > 10 || diffY > 10) {
        if (diffX > diffY * 1.5) {
          isHorizontalSwipe = true;
          if (e.cancelable) {
            e.preventDefault();
          }
        } else {
          isDragging = false;
        }
      }
    }, { passive: false });

    this.carousel.addEventListener('touchend', (e) => {
      if (!isDragging || !isHorizontalSwipe) {
        isDragging = false;
        isHorizontalSwipe = false;
        return;
      }
      
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.goToNext();
        } else {
          this.goToPrevious();
        }
      }

      isDragging = false;
      isHorizontalSwipe = false;
    }, { passive: true });
  }

  addKeyboardSupport() {
    document.addEventListener('keydown', (e) => {
      const carouselRect = this.carousel.getBoundingClientRect();
      const isInView = carouselRect.top < window.innerHeight && carouselRect.bottom > 0;
      
      if (!isInView) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.goToNext();
      }
    });
  }
}

// ===================================
// ROOM IMAGE ZOOM (Mobile Only)
// ===================================

class RoomImageZoom {
  constructor() {
    this.init();
  }

  init() {
    const roomImages = document.querySelectorAll('.room-image');
    
    roomImages.forEach(imageContainer => {
      imageContainer.addEventListener('click', (e) => {
        // Prevent if clicking on card content (not image)
        if (e.target.closest('.room-content')) return;
        
        // Toggle zoom
        const isZoomed = imageContainer.classList.contains('zoom-active');
        
        // Remove zoom from all images
        document.querySelectorAll('.room-image').forEach(img => {
          img.classList.remove('zoom-active');
        });
        
        // Add zoom to clicked image if it wasn't already zoomed
        if (!isZoomed) {
          imageContainer.classList.add('zoom-active');
          
          // Auto remove after 2 seconds
          setTimeout(() => {
            imageContainer.classList.remove('zoom-active');
          }, 2000);
        }
      });
    });
  }
}

// ===================================
// SMOOTH ANCHOR SCROLLING
// ===================================

class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        if (href === '#') return;
        
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          
          const headerHeight = document.getElementById('navbar')?.offsetHeight || 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

// ===================================
// AMENITIES CAROUSEL (Mobile)
// ===================================

class AmenitiesCarousel {
  constructor() {
    this.carousel = document.getElementById('amenitiesCarousel');
    this.leftArrow = document.querySelector('.amenities-arrow-left');
    this.rightArrow = document.querySelector('.amenities-arrow-right');
    this.currentIndex = 0;
    this.totalCards = 0;
    this.isScrolling = false;
    this.isMobile = window.innerWidth <= 768;
    this.init();
  }

  init() {
    if (!this.carousel) return;

    this.totalCards = this.carousel.querySelectorAll('.amenity-card').length;
    
    // Arrow click handlers
    if (this.leftArrow) {
      this.leftArrow.addEventListener('click', () => this.goToPrevious());
    }
    
    if (this.rightArrow) {
      this.rightArrow.addEventListener('click', () => this.goToNext());
    }
    
    // Listen to manual scroll events
    this.carousel.addEventListener('scroll', throttle(() => {
      this.syncWithScroll();
    }, 100));
    
    // Touch/swipe support
    this.addSwipeSupport();
    
    // Handle window resize
    window.addEventListener('resize', debounce(() => {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth <= 768;
      
      // Reset if screen size category changed
      if (wasMobile !== this.isMobile) {
        this.currentIndex = 0;
        this.updateCarousel();
      }
    }, 250));
    
    // Update initial state
    this.updateCarousel();
  }

  syncWithScroll() {
    if (this.isScrolling) return;
    
    const scrollLeft = this.carousel.scrollLeft;
    
    let newIndex;
    
    if (this.isMobile) {
      // Mobile: calculate based on card width
      const cardWidth = this.carousel.querySelector('.amenity-card').offsetWidth;
      const gap = 20;
      newIndex = Math.round(scrollLeft / (cardWidth + gap));
      newIndex = Math.max(0, Math.min(newIndex, this.totalCards - 1));
    } else {
      // Desktop: calculate based on total scroll width
      const maxScroll = this.carousel.scrollWidth - this.carousel.clientWidth;
      if (maxScroll > 0) {
        const scrollPercentage = scrollLeft / maxScroll;
        // For 8 cards shown 4 at a time, we have 5 positions (0-4)
        const maxIndex = Math.max(0, this.totalCards - 4);
        newIndex = Math.round(scrollPercentage * maxIndex);
        newIndex = Math.max(0, Math.min(newIndex, maxIndex));
      } else {
        newIndex = 0;
      }
    }
    
    if (newIndex !== this.currentIndex) {
      this.currentIndex = newIndex;
      this.updateUI();
    }
  }

  goToPrevious() {
    const maxIndex = this.isMobile ? this.totalCards - 1 : Math.max(0, this.totalCards - 4);
    
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.updateCarousel();
    }
  }

  goToNext() {
    const maxIndex = this.isMobile ? this.totalCards - 1 : Math.max(0, this.totalCards - 4);
    
    if (this.currentIndex < maxIndex) {
      this.currentIndex++;
      this.updateCarousel();
    }
  }

  updateCarousel() {
    this.isScrolling = true;
    
    const cards = this.carousel.querySelectorAll('.amenity-card');
    const cardWidth = cards[0].offsetWidth;
    const gap = 20;
    
    let scrollPosition;
    
    if (this.isMobile) {
      // Mobile: scroll to specific card
      scrollPosition = (cardWidth + gap) * this.currentIndex;
    } else {
      // Desktop: scroll to position (showing 4 cards at a time)
      scrollPosition = (cardWidth + gap) * this.currentIndex;
    }
    
    this.carousel.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });

    this.updateUI();
    
    // Reset scrolling flag after animation
    setTimeout(() => {
      this.isScrolling = false;
    }, 500);
  }

  updateUI() {
    const maxIndex = this.isMobile ? this.totalCards - 1 : Math.max(0, this.totalCards - 4);
    
    // Update arrow states
    if (this.leftArrow) {
      this.leftArrow.disabled = this.currentIndex === 0;
    }
    
    if (this.rightArrow) {
      this.rightArrow.disabled = this.currentIndex >= maxIndex;
    }
  }

  addSwipeSupport() {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;
    let isHorizontalSwipe = false;

    this.carousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
      isHorizontalSwipe = false;
    }, { passive: true });

    this.carousel.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
      
      const diffX = Math.abs(currentX - startX);
      const diffY = Math.abs(currentY - startY);
      
      if (diffX > 10 || diffY > 10) {
        if (diffX > diffY * 1.5) {
          isHorizontalSwipe = true;
          if (e.cancelable) {
            e.preventDefault();
          }
        } else {
          isDragging = false;
        }
      }
    }, { passive: false });

    this.carousel.addEventListener('touchend', (e) => {
      if (!isDragging || !isHorizontalSwipe) {
        isDragging = false;
        isHorizontalSwipe = false;
        return;
      }
      
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          this.goToNext();
        } else {
          this.goToPrevious();
        }
      }

      isDragging = false;
      isHorizontalSwipe = false;
    }, { passive: true });
  }
}

// ===================================
// INITIALIZE ALL
// ===================================

class App {
  constructor() {
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.initializeModules();
      });
    } else {
      this.initializeModules();
    }
  }

  initializeModules() {
    try {
      new LoadingScreen();
      new Navigation();
      new ScrollReveal();
      new BackToTop();
      new ContactForm();
      new GalleryLightbox();
      new ParallaxEffect();
      new SmoothScroll();
      new RoomsCarousel();
      new RoomImageZoom();
      new AmenitiesCarousel();
      
      console.log('✨ Mountain Retreat website initialized successfully!');
    } catch (error) {
      console.error('Error initializing website:', error);
    }
  }
}

// Start the application
new App();