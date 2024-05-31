document.addEventListener('DOMContentLoaded', function() {
  let startX = 0;
  let startWidth = 0;
  let isDragging = false;
  let isInitialized = false;
  let isAutoOpeningAllowed = true; // Flag to control auto-opening

  const zipperHandle = document.querySelector('.zipper-handle');
  const zipContainer = document.querySelector('.zip-container');
  const zipper = document.querySelector('.zipper');
  const content = document.querySelector('.content');

  function resetZipperPosition() {
    zipperHandle.style.left = '0';
    zipper.style.width = '0';
    content.style.transform = 'translateX(100%)';
  }

  zipperHandle.addEventListener('mousedown', function(e) {
    e.preventDefault();
    startX = e.clientX;
    startWidth = zipper.offsetWidth;
    isDragging = true;

    if (!isInitialized) {
      isInitialized = true;
      resetZipperPosition();
    }

    hideCountdown(); // Hide countdown if it exists
  });

  document.addEventListener('mousemove', function(e) {
    if (isDragging) {
      const deltaX = e.clientX - startX;
      const newWidth = Math.min(Math.max(0, startWidth + deltaX), zipContainer.offsetWidth);
      const unzipPercentage = newWidth / zipContainer.offsetWidth;

      zipper.style.width = `${newWidth}px`;
      zipperHandle.style.left = `${newWidth - zipperHandle.offsetWidth / 2}px`;
      content.style.transform = `translateX(${(1 - unzipPercentage) * 100}%)`;

      // Disable auto-opening if the zipper handle is dragged back
      if (unzipPercentage < 0.5) {
        isAutoOpeningAllowed = true;
      }
    }
  });

  document.addEventListener('mouseup', function() {
    if (isDragging) {
      isDragging = false;
      const unzipPercentage = zipper.offsetWidth / zipContainer.offsetWidth;

      if (unzipPercentage >= 0.5 && isAutoOpeningAllowed) {
        zipContainer.classList.add('unzip');
        startTimer(unzipPercentage); // Pass unzipPercentage to startTimer
      } else {
        zipContainer.classList.remove('unzip');
        resetZipperPosition();
        stopTimer();

        // Reset auto-opening flag if re-zipping
        isAutoOpeningAllowed = false;
      }
    }
  });

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
