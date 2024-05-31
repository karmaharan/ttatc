document.addEventListener('DOMContentLoaded', function() {
  let startX = 0;
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

  function handleStart(e) {
  e.preventDefault();
  const touchEvent = e.type.startsWith('touch');
  startX = touchEvent ? e.touches[0].clientX : e.clientX;
  isDragging = true;

  if (!isInitialized) {
    isInitialized = true;
    resetZipperPosition();
  }

  hideCountdown();
}

  function handleMove(e) {
    if (isDragging) {
      const touchEvent = e.type.startsWith('touch');
      const currentX = touchEvent ? e.touches[0].clientX : e.clientX;
      const deltaX = currentX - startX;
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

  function handleEnd() {
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

  zipperHandle.addEventListener('touchstart', handleStart, { passive: true });
  zipperHandle.addEventListener('mousedown', handleStart);

  document.addEventListener('touchmove', handleMove, { passive: true });
  document.addEventListener('mousemove', handleMove);

  document.addEventListener('touchend', handleEnd);
  document.addEventListener('mouseup', handleEnd);

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
