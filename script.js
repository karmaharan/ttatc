document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');
  const sections = container.querySelectorAll('.section');
  let currentIndex = 0;
  let isScrolling = false; // Flag to prevent rapid scrolling

  container.addEventListener('wheel', (event) => {
    // Check if the window width is greater than 768px
    if (window.innerWidth > 768) {
      event.preventDefault(); // Prevent default scrolling behavior

      if (!isScrolling) {
        isScrolling = true; // Set scrolling flag

        setTimeout(() => {
          isScrolling = false; // Reset scrolling flag after scroll action
        }, 800); // Adjust scroll speed timeout as needed

        // Determine scrolling direction based on deltaY
        if (event.deltaY < 0) {
          // Scroll up (previous section)
          currentIndex = Math.max(currentIndex - 1, 0);
        } else {
          // Scroll down (next section)
          currentIndex = Math.min(currentIndex + 1, sections.length - 1);
        }

        // Scroll horizontally if deltaX is detected
        if (event.deltaX !== 0) {
          // Scroll left or right (assuming horizontal sections)
          const currentSection = sections[currentIndex];
          const scrollLeft = currentSection.scrollLeft + event.deltaX;
          currentSection.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
          });
        } else {
          // Scroll vertically to the current section
          sections[currentIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'start' // Adjust as needed ('nearest', 'center', 'end')
          });
        }
      }
    }
  });

  // Optional: Handle resizing of the window
  window.addEventListener('resize', () => {
    // Recalculate currentIndex and re-enable scrolling as needed
    if (window.innerWidth <= 768) {
      currentIndex = 0; // Reset to the first section on mobile view
    }
  });
});
