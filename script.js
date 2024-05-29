document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');
  const sections = container.querySelectorAll('.section');
  let currentIndex = 0;
  let isScrolling = false; // Flag to prevent rapid scrolling
  let startX, startY, scrollLeft;

  const handleTouchStart = (event) => {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
    scrollLeft = container.scrollLeft;
  };

  const handleTouchMove = (event) => {
    if (!isScrolling) {
      isScrolling = true; // Set scrolling flag

      setTimeout(() => {
        isScrolling = false; // Reset scrolling flag after scroll action
      }, 800); // Adjust scroll speed timeout as needed

      const currentX = event.touches[0].clientX;
      const currentY = event.touches[0].clientY;
      const diffX = currentX - startX;
      const diffY = currentY - startY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal scroll
        const newScrollLeft = scrollLeft - diffX;
        container.scrollTo({
          left: newScrollLeft,
          behavior: 'smooth'
        });
      } else {
        // Vertical scroll
        if (diffY < 0) {
          // Scroll up (previous section)
          currentIndex = Math.max(currentIndex - 1, 0);
        } else {
          // Scroll down (next section)
          currentIndex = Math.min(currentIndex + 1, sections.length - 1);
        }

        sections[currentIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        transformActiveSection();
      }
    }
  };

  container.addEventListener('touchstart', handleTouchStart, { passive: true });
  container.addEventListener('touchmove', handleTouchMove, { passive: true });

  // Function to transform the active section
  function transformActiveSection() {
    // Reset transformation for all sections
    sections.forEach((section, index) => {
      section.style.transform = index === currentIndex ? 'scale(1.05)' : 'scale(1)';
    });
  }

  // Initial transformation for the first active section
  transformActiveSection();
});
