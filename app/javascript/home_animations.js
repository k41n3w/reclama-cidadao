// Initialize all animations and interactive elements
document.addEventListener('DOMContentLoaded', function() {
    console.log("[HomeAnimations] DOMContentLoaded event fired");
    initializeAll();
  });
  
  document.addEventListener('turbo:load', function() {
    console.log("[HomeAnimations] turbo:load event fired");
    initializeAll();
  });
  
  document.addEventListener('turbo:render', function() {
    console.log("[HomeAnimations] turbo:render event fired");
    initializeAll();
  });
  
  // Initialize all components
  function initializeAll() {
    console.log("[HomeAnimations] Initializing all components");
    setTimeout(() => {
      initializeSwiper();
      initializeCounters();
      initializeScrollAnimations();
      initializeMapFilters();
      initializeFaqAccordion();
    }, 300); // Small delay to ensure DOM is fully loaded
  }
  
  // Initialize Swiper carousel
  function initializeSwiper() {
    console.log("[HomeAnimations] Initializing Swiper");
    const swiperElement = document.querySelector('.testimonial-swiper');
    
    if (swiperElement) {
      console.log("[HomeAnimations] Swiper element found");
      
      // Check if Swiper is already initialized on this element
      if (swiperElement.swiper) {
        console.log("[HomeAnimations] Swiper already initialized, destroying");
        swiperElement.swiper.destroy();
      }
      
      // Create new Swiper instance
      try {
        const swiper = new Swiper('.testimonial-swiper', {
          slidesPerView: 1,
          spaceBetween: 30,
          loop: true,
          autoplay: {
            delay: 5000,
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
          breakpoints: {
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }
        });
        
        console.log("[HomeAnimations] Swiper initialized successfully");
        
        // Force update after initialization
        setTimeout(() => {
          if (swiper && swiper.update) {
            swiper.update();
            console.log("[HomeAnimations] Swiper updated");
          }
        }, 500);
      } catch (error) {
        console.error("[HomeAnimations] Error initializing Swiper:", error);
      }
    } else {
      console.log("[HomeAnimations] No Swiper element found");
    }
  }
  
  // Initialize CountUp.js for statistics
  function initializeCounters() {
    console.log("[HomeAnimations] Initializing Counters");
    const statElements = document.querySelectorAll('.stat-number');
    
    if (statElements.length > 0) {
      console.log("[HomeAnimations] Found", statElements.length, "stat elements");
      
      statElements.forEach(element => {
        try {
          const target = parseInt(element.getAttribute('data-target'), 10);
          console.log("[HomeAnimations] Initializing counter for target:", target);
          
          // Check if CountUp is available
          if (typeof CountUp === 'undefined') {
            console.error("[HomeAnimations] CountUp is not defined");
            element.textContent = target; // Fallback
            return;
          }
          
          try {
            const counter = new CountUp(element, 0, target, 0, 2.5, {
              useEasing: true,
              useGrouping: true,
              separator: '.',
              decimal: ',',
            });
            
            if (!counter.error) {
              // Start counter when element is in viewport
              const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                  if (entry.isIntersecting) {
                    counter.start();
                    observer.unobserve(element);
                  }
                });
              }, { threshold: 0.1 });
              
              observer.observe(element);
            } else {
              console.error("[HomeAnimations] CountUp error:", counter.error);
              element.textContent = target; // Fallback
            }
          } catch (error) {
            console.error("[HomeAnimations] Error initializing counter:", error);
            element.textContent = target; // Fallback
          }
        } catch (error) {
          console.error("[HomeAnimations] Error initializing counter:", error);
          element.textContent = element.getAttribute('data-target'); // Fallback
        }
      });
    } else {
      console.log("[HomeAnimations] No stat elements found");
    }
  }
  
  // Initialize scroll animations
  function initializeScrollAnimations() {
    console.log("[HomeAnimations] Initializing Scroll Animations");
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animateElements.length > 0) {
      console.log("[HomeAnimations] Found", animateElements.length, "animate elements");
      
      // Add the animate-on-scroll class to elements that don't have it
      document.querySelectorAll('.benefit-card, .step-card, .stat-card').forEach(element => {
        if (!element.classList.contains('animate-on-scroll')) {
          element.classList.add('animate-on-scroll');
        }
      });
      
      const checkScroll = function() {
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
          const elementTop = element.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;
          
          if (elementTop < windowHeight * 0.8) {
            element.classList.add('animated');
          }
        });
      };
      
      // Check on initial load
      checkScroll();
      
      // Check on scroll
      window.addEventListener('scroll', checkScroll);
    } else {
      console.log("[HomeAnimations] No animate elements found");
    }
  }
  
  // Initialize map filter buttons
  function initializeMapFilters() {
    console.log("[HomeAnimations] Initializing Map Filters");
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (filterButtons.length > 0) {
      console.log("[HomeAnimations] Found", filterButtons.length, "filter buttons");
      
      filterButtons.forEach(button => {
        button.addEventListener('click', function() {
          // Remove active class from all buttons
          filterButtons.forEach(btn => btn.classList.remove('active'));
          
          // Add active class to clicked button
          this.classList.add('active');
          
          // Get filter value
          const filter = this.getAttribute('data-filter');
          console.log("[HomeAnimations] Filter clicked:", filter);
          
          // If MapManager is available, filter markers
          if (window.MapManager && window.MapManager.filterMarkers) {
            window.MapManager.filterMarkers(filter);
          } else {
            console.log("[HomeAnimations] MapManager not available for filtering");
          }
        });
      });
    } else {
      console.log("[HomeAnimations] No filter buttons found");
    }
  }
  
  // Initialize FAQ accordion
  function initializeFaqAccordion() {
    console.log("[HomeAnimations] Initializing FAQ Accordion");
    const accordionButtons = document.querySelectorAll('.accordion-button');
    
    if (accordionButtons.length > 0) {
      console.log("[HomeAnimations] Found", accordionButtons.length, "accordion buttons");
      
      accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
          const isCollapsed = this.classList.contains('collapsed');
          
          if (isCollapsed) {
            this.classList.remove('collapsed');
            const target = document.querySelector(this.getAttribute('data-bs-target'));
            if (target) {
              target.classList.add('show');
            }
          } else {
            this.classList.add('collapsed');
            const target = document.querySelector(this.getAttribute('data-bs-target'));
            if (target) {
              target.classList.remove('show');
            }
          }
        });
      });
    } else {
      console.log("[HomeAnimations] No accordion buttons found");
    }
  }