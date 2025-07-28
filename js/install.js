let deferredPrompt;
const installBtn = document.getElementById('installBtn');

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // Prevent the mini-infobar
  deferredPrompt = e;
  installBtn.classList.remove('hidden');
});

// Handle click on the install button
installBtn.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;

    if (result.outcome === 'accepted') {
      console.log('PWA setup accepted');
    } else {
      console.log('PWA setup dismissed');
    }

    deferredPrompt = null;
    installBtn.classList.add('hidden');
  }
});
