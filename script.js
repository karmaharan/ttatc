document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');
  const sections = container.querySelectorAll('.section');
  let currentIndex = 0;
  let isScrolling = false;
  let startX = 0, startY = 0;
  const swipeThreshold = 50; // Minimum swipe distance to trigger navigation

  const handleStart = (event) => {
    if (isScrolling) return;
    startX = event.type.startsWith('touch') ? event.touches[0].clientX : event.clientX;
    startY = event.type.startsWith('touch') ? event.touches[0].clientY : event.clientY;
  };

  const handleMove = (event) => {
    if (isScrolling) return;
    const currentX = event.type.startsWith('touch') ? event.touches[0].clientX : event.clientX;
    const currentY = event.type.startsWith('touch') ? event.touches[0].clientY : event.clientY;
    const diffX = startX - currentX;
    const diffY = currentY - startY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
      event.preventDefault();

      if (diffX > 0 && currentIndex < sections.length - 1) {
        currentIndex++;
      } else if (diffX < 0 && currentIndex > 0) {
        currentIndex--;
      } else {
        return;
      }

      isScrolling = true;
      sections[currentIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      transformActiveSection();

      setTimeout(() => {
        isScrolling = false;
      }, 800);
    }
  };

  const handleEnd = () => {
    startX = 0;
    startY = 0;
  };

  container.addEventListener('mousedown', handleStart, { passive: true });
  container.addEventListener('mousemove', handleMove, { passive: false });
  container.addEventListener('mouseup', handleEnd);

  // Function to transform the active section
  function transformActiveSection() {
    sections.forEach((section, index) => {
      section.style.transform = index === currentIndex ? 'scale(1.05)' : 'scale(1)';
    });
  }

  transformActiveSection();
});
