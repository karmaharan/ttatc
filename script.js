document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');
  const sections = container.querySelectorAll('.section');
  let currentIndex = 0;
  let isScrolling = false;
  let startX, startY;
  let touchStarted = false;

  const handleTouchStart = (event) => {
    touchStarted = true;
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
  };

  const handleTouchMove = (event) => {
    if (touchStarted) {
      isScrolling = true;

      setTimeout(() => {
        isScrolling = false;
      }, 800);

      const currentX = event.touches[0].clientX;
      const currentY = event.touches[0].clientY;
      const diffX = currentX - startX;
      const diffY = currentY - startY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        event.preventDefault(); // Prevent default scrolling behavior

        // Swipe direction based on diffX
        if (diffX > 0) {
          // Swipe right (next section)
          currentIndex = (currentIndex + 1) % sections.length;
        } else {
          // Swipe left (previous section)
          currentIndex = (currentIndex - 1 + sections.length) % sections.length;
        }

        sections[currentIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        transformActiveSection();
      }
    }
  };

  const handleTouchEnd = () => {
    touchStarted = false;
    startX = null;
    startY = null;
  };

  container.addEventListener('touchstart', handleTouchStart, { passive: true });
  container.addEventListener('touchmove', handleTouchMove, { passive: false });
  container.addEventListener('touchend', handleTouchEnd);

  // Function to transform the active section
  function transformActiveSection() {
    sections.forEach((section, index) => {
      section.style.transform = index === currentIndex ? 'scale(1.05)' : 'scale(1)';
    });
  }

  transformActiveSection();
});
