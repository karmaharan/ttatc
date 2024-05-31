document.addEventListener('DOMContentLoaded', () => {
    // Variables for the first script (section navigation)
    const container = document.querySelector('.container');
    const sections = container.querySelectorAll('.section');
    let currentIndex = 0;
    let isScrolling = false;
    let startX = 0, startY = 0;
    const swipeThreshold = 50; // Minimum swipe distance to trigger navigation

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

    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // Function to transform the active section
    function transformActiveSection() {
        sections.forEach((section, index) => {
            // Add transformation logic here
        });
    }

    transformActiveSection();

    // Variables for the second script (zipper functionality)
    let startXZip = 0;
    let isDragging = false;
    let isInitialized = false;
    let isAutoOpeningAllowed = true;
    let initialSlideDone = false;

    const zipperHandle = document.querySelector('.zipper-handle');
    const zipContainer = document.querySelector('.zip-container');
    const zipper = document.querySelector('.zipper');
    const content = document.querySelector('.content');

    function resetZipperPosition() {
        zipperHandle.style.left = '0';
        zipper.style.width = '0';
        content.style.transform = 'translateX(100%)';
    }

    function handleStartZip(e) {
        e.preventDefault();
        const touchEvent = e.type.startsWith('touch');
        startXZip = touchEvent ? e.touches[0].clientX : e.clientX;
        isDragging = true;

        if (!isInitialized) {
            isInitialized = true;
            resetZipperPosition();
        }

        hideCountdown();
    }

    function handleMoveZip(e) {
        if (isDragging) {
            const touchEvent = e.type.startsWith('touch');
            const currentX = touchEvent ? e.touches[0].clientX : e.clientX;
            const deltaX = currentX - startXZip;
            const newWidth = Math.min(Math.max(0, deltaX), zipContainer.offsetWidth);
            const unzipPercentage = newWidth / zipContainer.offsetWidth;

            zipper.style.width = `${newWidth}px`;
            zipperHandle.style.left = `${newWidth - zipperHandle.offsetWidth / 2}px`;
            content.style.transform = `translateX(${(1 - unzipPercentage) * 100}%)`;

            if (unzipPercentage < 0.5) {
                isAutoOpeningAllowed = true;
            }
        }
    }

    function handleEndZip() {
        if (isDragging) {
            isDragging = false;
            const unzipPercentage = zipper.offsetWidth / zipContainer.offsetWidth;

            if (unzipPercentage >= 0.5 && isAutoOpeningAllowed) {
                zipContainer.classList.add('unzip');
                startTimer(unzipPercentage);
            } else {
                zipContainer.classList.remove('unzip');
                resetZipperPosition();
                stopTimer();
                isAutoOpeningAllowed = false;
            }
        }
    }

    zipperHandle.addEventListener('touchstart', handleStartZip, { passive: false });
    zipperHandle.addEventListener('mousedown', handleStartZip);

    document.addEventListener('touchmove', handleMoveZip, { passive: false });
    document.addEventListener('mousemove', handleMoveZip);

    document.addEventListener('touchend', handleEndZip);
    document.addEventListener('mouseup', handleEndZip);

    let timerInterval;
    let countdownElement;
    let countdownActive = false;

    function startTimer(unzipPercentage) {
        let timerSeconds = 5;
        countdownActive = true;

        if (countdownElement) {
            countdownElement.remove();
        }

        countdownElement = document.createElement('div');
        countdownElement.textContent = `Countdown: ${timerSeconds} seconds`;
        content.appendChild(countdownElement);

        timerInterval = setInterval(function() {
            timerSeconds--;
            countdownElement.textContent = `Countdown: ${timerSeconds} seconds`;

            if (timerSeconds <= 0) {
                clearInterval(timerInterval);
                countdownActive = false;
                if (unzipPercentage >= 0.5 && zipContainer.classList.contains('unzip')) {
                    window.location.href = 'https://razorpay.com/payment-button/pl_OGrQe9LVBk78uu/view';
                }
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
        countdownActive = false;

        if (countdownElement) {
            countdownElement.remove();
            countdownElement = null;
        }
    }

    function hideCountdown() {
        if (countdownElement) {
            countdownElement.remove();
            countdownElement = null;
        }
    }
});
