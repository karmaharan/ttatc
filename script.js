document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const sections = container.querySelectorAll('.section');
    const trigger = document.querySelector('.trigger');
    let currentIndex = 0;
    let isScrolling = false;
    let startX = 0, startY = 0;
    const swipeThreshold = 50; // Minimum swipe distance to trigger navigation

    const isMobile = window.innerWidth <= 768; // Check if the screen width is 768px or less

    const handleTouchStart = (event) => {
        if (isScrolling) return; // Prevent starting a new swipe if already scrolling
        startX = event.touches[0].clientX;
        startY = event.touches[0].clientY;
    };

    const handleTouchMove = (event) => {
        if (isScrolling) return; // Prevent move events during scrolling
        const currentX = event.touches[0].clientX;
        const currentY = event.touches[0].clientY;
        const diffX = startX - currentX;
        const diffY = currentY - startY;

        // Determine if this is a horizontal swipe
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
            event.preventDefault(); // Prevent default scrolling behavior
            if (diffX > 0 && currentIndex < sections.length - 1) {
                // Swipe left (next section)
                currentIndex++;
            } else if (diffX < 0 && currentIndex > 0) {
                // Swipe right (previous section)
                currentIndex--;
            } else {
                // If at the edge, do nothing
                return;
            }
            isScrolling = true; // Set scrolling flag
            sections[currentIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            transformActiveSection();
            setTimeout(() => {
                isScrolling = false; // Reset scrolling flag after animation
                resetTriggerPosition(); // Reset the trigger position
            }, 800);
        }
    };

    const handleTouchEnd = () => {
        startX = 0;
        startY = 0;
    };

    const handleWheel = (event) => {
        event.preventDefault(); // Prevent default scrolling behavior
        if (isScrolling) return; // Prevent wheel events during scrolling
        const delta = Math.sign(event.deltaY);
        if (delta > 0 && currentIndex < sections.length - 1) {
            // Scroll down (next section)
            currentIndex++;
        } else if (delta < 0 && currentIndex > 0) {
            // Scroll up (previous section)
            currentIndex--;
        } else {
            // If at the edge, do nothing
            return;
        }
        isScrolling = true; // Set scrolling flag
        sections[currentIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        transformActiveSection();
        setTimeout(() => {
            isScrolling = false; // Reset scrolling flag after animation
        }, 800);
    };

    const resetTriggerPosition = () => {
        trigger.style.transform = 'translate(-50%, -50%)';
    };

    const handleTriggerMove = (event) => {
        if (isScrolling) return; // Prevent move events during scrolling
        const touch = event.touches[0];
        const touchX = touch.clientX - container.offsetLeft;
        const touchY = touch.clientY - container.offsetTop;
        trigger.style.transform = `translate(${touchX - trigger.clientWidth / 2}px, ${touchY - trigger.clientHeight / 2}px)`;
    };

    const handleTriggerEnd = () => {
        startX = 0;
        resetTriggerPosition();
    };

    if (isMobile) {
        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd);

        trigger.addEventListener('touchmove', handleTriggerMove, { passive: false });
        trigger.addEventListener('touchend', handleTriggerEnd);
    } else {
        container.addEventListener('wheel', handleWheel, { passive: false });
    }

    // Function to transform the active section
    function transformActiveSection() {
        sections.forEach((section, index) => {
            // Add your transformation logic here if needed
        });
    }

    transformActiveSection();
});
