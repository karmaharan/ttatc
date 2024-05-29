document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');
  const sections = container.querySelectorAll('.section');
  let currentIndex = 0;
  let isScrolling = false;
  let startX, startY;

  const handleTouchStart = (event) => {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
  };

  const handleTouchMove = (event) => {
    if (!isScrolling) {
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
        if (diffX > 0) {
          // Swipe right (next section)
          currentIndex = Math.min(currentIndex + 1, sections.length - 1);
        } else {
          // Swipe left (previous section)
          currentIndex = Math.max(currentIndex - 1, 0);
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
    sections.forEach((section, index) => {
      section.style.transform = index === currentIndex ? 'scale(1.05)' : 'scale(1)';
    });
  }

  transformActiveSection();
});
