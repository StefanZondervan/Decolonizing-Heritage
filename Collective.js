document.addEventListener('DOMContentLoaded', () => {
  // Information for each tag filter
  const tagInfo = {
    All: "Showing all heritage items.",
    Tangible: "Tangible heritage includes physical artifacts and monuments.",
    Intangible: "Intangible heritage involves traditions, rituals, music, and oral history.",
    Mental: "Mental heritage includes philosophical concepts, knowledge systems, and memory-based culture."
  };

  // DOM elements
  const buttons = document.querySelectorAll('.filter-bar button');
  const cards = document.querySelectorAll('.heritage-card');
  const explanation = document.getElementById('tagExplanation');

  // Initialize explanation text
  explanation.textContent = tagInfo.All;

  // Filter button click handler
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove 'active' class from all buttons
      buttons.forEach(btn => btn.classList.remove('active'));
      // Add 'active' class to the clicked button
      button.classList.add('active');

      const filter = button.getAttribute('data-filter');

      // Update explanation text based on filter
      explanation.textContent = tagInfo[filter];

      // Show or hide cards based on the selected filter
      cards.forEach(card => {
        const tag = card.getAttribute('data-tag');
        if (filter === 'All' || tag === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Set the 'All' button as active by default when the page loads
  const allButton = document.querySelector('.filter-bar button[data-filter="All"]');
  if (allButton) {
      allButton.classList.add('active');
  }

  // Modal elements
  const modalOverlay = document.getElementById('modalOverlay');
  const modalBody = document.getElementById('modalBody');
  const modalClose = document.getElementById('modalClose');
  const heritageCards = document.querySelectorAll('.heritage-card');

  // Function to open the modal and display card content
  function openModal(cardElement) {
      modalBody.innerHTML = ''; // Clear previous content

      // Clone the clicked card and append to modal
      const clonedCard = cardElement.cloneNode(true);
      clonedCard.classList.add('modal-card-display'); // Add class for modal-specific styling
      clonedCard.style.transform = 'none'; // Remove any hover transform
      clonedCard.style.boxShadow = 'none'; // Remove any hover shadow

      // Ensure audio elements are playable if present
      const audioPlayer = clonedCard.querySelector('audio');
      if (audioPlayer) {
          audioPlayer.controls = true; // Show audio controls
          audioPlayer.currentTime = 0; // Reset audio to beginning
      }

      modalBody.appendChild(clonedCard);

      modalOverlay.style.display = 'flex'; // Make modal visible
      document.body.style.overflow = 'hidden'; // Prevent body scrolling
  }

  // Function to close the modal
  function closeModal() {
    modalOverlay.style.display = 'none';
    modalBody.innerHTML = ''; // Clear modal content
    document.body.style.overflow = ''; // Restore body scrolling
  }

  // Add click listener to each heritage card to open modal
  heritageCards.forEach(card => {
    card.addEventListener('click', () => {
      openModal(card);
    });
  });

  // Add click listener to modal close button
  modalClose.addEventListener('click', closeModal);

  // Close modal if user clicks outside the modal content area
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });
});
