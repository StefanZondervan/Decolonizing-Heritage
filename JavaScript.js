document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const legendItems = document.querySelectorAll('.legend-item');

    // Main map display elements that will fade and are linked by ID
    const introImage = document.getElementById('intro-image');
    const institutionalImage = document.getElementById('institutional-image');
    const mentalRiverImage = document.getElementById('mental-river-image');
    const portLines = document.getElementById('Port_lines'); // Ensure this ID exists in your SVG
    const maasRiverLine = document.getElementById('Maas_River_Line'); // Ensure this ID exists in your SVG
    const mapBackground = document.getElementById('map-background');

    // Group all individual SVG elements (dots and lines) that need fading and interaction
    const allControlledSvgElements = document.querySelectorAll(
        '.cls-1, .cls-2, .cls-4, .cls-5, .cls-1-water, .cls-6, #Port_lines, #Maas_River_Line'
    );

    const containers = {
        tangible: document.getElementById('tangible-images'),
        institutional: document.getElementById('institutional-images'),
        intangible: document.getElementById('intangible-images'),
        mental: document.getElementById('mental-images')
    };

    const slides = {
        tangible: {
            images: document.querySelectorAll('#tangible-images .carousel-slide'),
            texts: document.querySelectorAll('#tangible-images .text-slide'),
            dots: Array.from(document.querySelectorAll('.cls-1')) // Assuming cls-1 are tangible dots
        },
        institutional: {
            images: document.querySelectorAll('#institutional-images .carousel-slide'),
            texts: document.querySelectorAll('#institutional-images .text-slide'),
            dots: Array.from(document.querySelectorAll('.cls-5')) // Assuming cls-5 are institutional dots
        },
        intangible: {
            images: document.querySelectorAll('#intangible-images .carousel-slide'),
            texts: document.querySelectorAll('#intangible-images .text-slide'),
            dots: Array.from(document.querySelectorAll('.cls-2')) // Assuming cls-2 are intangible dots
        },
        mental: {
            images: document.querySelectorAll('#mental-images .carousel-slide'),
            texts: document.querySelectorAll('#mental-images .text-slide'),
            dots: Array.from(document.querySelectorAll('.cls-4')) // Assuming cls-4 are mental dots
        }
    };

    const textSections = document.querySelectorAll('.text-section');

    // Store current slide per category to remember user's last position
    const currentSlides = {
        tangible: 0,
        institutional: 0,
        intangible: 0,
        mental: 0
    };

    let activeCategory = null;

    // Helper function to detect mobile mode based on your CSS media query
    function isMobileMode() {
        return window.matchMedia("(max-width: 768px)").matches;
    }

    // Add fade-element class to all relevant elements that need to fade
    [introImage, institutionalImage, mentalRiverImage, ...Array.from(allControlledSvgElements)].forEach(el => {
        if (el) {
            el.classList.add('fade-element');
        }
    });

    // Helper to control visibility with fade effect (for images and main SVG elements)
    function setFadeElementVisibility(element, isVisible) {
        if (element) {
            if (isVisible) {
                element.classList.add('is-visible');
            } else {
                element.classList.remove('is-visible');
            }
        }
    }

    // Function to hide all main display elements (images, SVG lines, dots)
    function hideAllDisplayElements() {
        setFadeElementVisibility(introImage, false);
        setFadeElementVisibility(institutionalImage, false);
        setFadeElementVisibility(mentalRiverImage, false);

        allControlledSvgElements.forEach(el => {
            setFadeElementVisibility(el, false);
            el.classList.remove('highlighted', 'active-dot', 'flicker');
            el.style.animation = ''; // Clear any lingering inline animation styles
        });
        clearFlickerFromAllDots(); // Ensures no lingering flicker state
    }

    // Show a specific slide (image + text + highlight dot)
    // The `highlightActiveDot` parameter controls if a *single* dot is "active" or just all are highlighted
    function showSlide(index, imageSlides, textSlides, svgDots, highlightActiveDot = true) {
        imageSlides.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
        textSlides.forEach((txt, i) => {
            txt.classList.toggle('active', i === index);
        });

        // Make sure all dots of this group are highlighted, but only one is 'active-dot'
        svgDots.forEach((dot, i) => {
            dot.classList.add('highlighted');
            dot.classList.toggle('active-dot', highlightActiveDot && i === index);
            setFadeElementVisibility(dot, true); // Ensure the dot is visible via fade-element
        });
    }

    // Forces a reflow and restarts the flicker animation on a single dot
    function resetAnimation(dot) {
        dot.classList.remove('flicker');
        void dot.offsetHeight; // Force reflow
        dot.classList.add('flicker');
    }

    // Applies flicker to a collection of dots
    function applyFlickerToDots(dots) {
        // Wait until next frame so elements are visible before flicker starts
        requestAnimationFrame(() => {
            dots.forEach(dot => {
                resetAnimation(dot); // Safely restart flicker
            });
        });
    }

    // Function to clear flicker from all dots, stopping any ongoing animations
    function clearFlickerFromAllDots() {
        Object.values(slides).forEach(group => {
            group.dots.forEach(dot => {
                dot.classList.remove('flicker');
                dot.style.animation = ''; // Clear any inline animation styles that might persist
            });
        });
    }

    // Hide all image containers helper (for carousels)
    function hideAllContainers() {
        Object.values(containers).forEach(container => {
            if (container) container.style.display = 'none';
        });
    }

    // Show container helper (for carousels)
    function showImageContainer(category) {
        const container = containers[category];
        if (container) {
            container.style.display = 'flex';
        }
    }

    // Change slide index by direction (+1 or -1) for a category
    function changeSlide(direction, category) {
        const current = slides[category];
        if (!current) return;

        const length = current.images.length;
        currentSlides[category] = (currentSlides[category] + direction + length) % length;
        showSlide(currentSlides[category], current.images, current.texts, current.dots, true); // Ensure active dot is shown
        showImageContainer(category); // Ensure carousel is visible
    }

    // Handle legend item click to switch categories
    function handleLegendClick() {
        // Remove active class from all legend items
        legendItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');

        const category = this.getAttribute('data-category');

        // Remove all map-level classes first
        mapBackground.classList.remove('map-level-full', 'map-level-medium', 'map-level-light', 'map-level-none');

        // Apply background fade based on active category
        switch (category) {
            case 'introduction':
            case 'institutional':
                mapBackground.classList.add('map-level-full');
                break;
            case 'tangible':
                mapBackground.classList.add('map-level-medium');
                break;
            case 'intangible':
                mapBackground.classList.add('map-level-light');
                break;
            case 'mental':
                mapBackground.classList.add('map-level-none');
                break;
        }

        // 1. Hide ALL elements that can transition (images, lines, dots) and ALL carousels.
        hideAllDisplayElements();
        hideAllContainers();

        activeCategory = category;

        // 2. Display logic based on new active category
        let dotsToFlicker = []; // Collect dots that should flicker for the current category

        switch (category) {
            case 'introduction':
                setFadeElementVisibility(introImage, true);
                break;

            case 'institutional':
                setFadeElementVisibility(institutionalImage, true);
                slides.institutional.dots.forEach(dot => {
                    dot.classList.add('highlighted');
                    setFadeElementVisibility(dot, true);
                });
                dotsToFlicker = slides.institutional.dots;
                break;

            case 'tangible':
                setFadeElementVisibility(portLines, true);
                slides.tangible.dots.forEach(dot => {
                    dot.classList.add('highlighted');
                    setFadeElementVisibility(dot, true);
                });
                dotsToFlicker = slides.tangible.dots;
                break;

            case 'intangible':
                setFadeElementVisibility(maasRiverLine, true);
                slides.intangible.dots.forEach(dot => {
                    dot.classList.add('highlighted');
                    setFadeElementVisibility(dot, true);
                });
                document.querySelectorAll('.cls-1-water').forEach(el => { // Assuming this is part of intangible
                    el.classList.add('highlighted');
                    setFadeElementVisibility(el, true);
                });
                dotsToFlicker = slides.intangible.dots;
                break;

            case 'mental':
                setFadeElementVisibility(mentalRiverImage, true);
                slides.mental.dots.forEach(dot => {
                    dot.classList.add('highlighted');
                    setFadeElementVisibility(dot, true);
                });
                document.querySelectorAll('.cls-6').forEach(el => { // Assuming this is part of mental
                    el.classList.add('highlighted');
                    setFadeElementVisibility(el, true);
                });
                dotsToFlicker = slides.mental.dots;
                break;
        }

        // Update text sections visibility
        textSections.forEach(section => {
            section.classList.toggle('active', section.getAttribute('data-category') === activeCategory);
        });

        // *** NEW LOGIC FOR MOBILE MODE OR GENERAL DESKTOP INITIAL FLICKER ***
        if (category !== 'introduction') { // Only apply this logic to categories with dots/carousels
            const selectedSlides = slides[category];
            if (selectedSlides && selectedSlides.dots.length > 0) {
                if (isMobileMode()) {
                    // On mobile, show the first dot and carousel immediately
                    clearFlickerFromAllDots(); // Ensure no other dots are flickering
                    currentSlides[category] = 0; // Reset to first slide
                    showSlide(0, selectedSlides.images, selectedSlides.texts, selectedSlides.dots, true);
                    showImageContainer(category);

                    // Re-apply flicker specifically to the active (first) dot after showSlide has run
                    if (selectedSlides.dots[0]) {
                        resetAnimation(selectedSlides.dots[0]);
                    }
                } else {
                    // On desktop, apply flicker to all relevant dots after they are visible
                    applyFlickerToDots(dotsToFlicker);
                }
            }
        }
    }

    // Add carousel button event listeners for prev/next
    function addCarouselButtonListeners(prevBtnId, nextBtnId, category) {
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (activeCategory === category) {
                    changeSlide(-1, category);
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (activeCategory === category) {
                    changeSlide(1, category);
                }
            });
        }
    }

    // Add click listeners on dots for direct navigation in carousel
    function addDotClickListeners(category) {
        const current = slides[category];
        if (!current) return;

        current.dots.forEach((dot, index) => {
            dot.style.cursor = 'pointer';
            dot.onclick = () => {
                if (activeCategory === category) {
                    currentSlides[category] = index;
                    showSlide(currentSlides[category], current.images, current.texts, current.dots, true); // Make the clicked dot active
                    showImageContainer(category); // Make the carousel visible here
                }
            };
        });
    }

    // Remove dot click listeners and reset cursor style
    function clearDotClickListeners() {
        Object.values(slides).forEach(group => {
            group.dots.forEach(dot => {
                dot.onclick = null;
                dot.style.cursor = 'default';
                dot.classList.remove('active-dot', 'flicker'); // Remove active-dot and flicker states
                dot.style.animation = ''; // Ensure no lingering flicker animation
            });
        });
    }

    // Attach event listeners to legend items
    legendItems.forEach(item => {
        item.addEventListener('click', function () {
            handleLegendClick.call(this);
            clearDotClickListeners(); // Ensure old dot listeners are cleared
            if (this.getAttribute('data-category') !== 'introduction') {
                addDotClickListeners(this.getAttribute('data-category')); // Add new dot listeners for active category
            }
        });
    });

    // Initialize carousel buttons for each category
    addCarouselButtonListeners('prev-btn', 'next-btn', 'tangible');
    addCarouselButtonListeners('inst-prev-btn', 'inst-next-btn', 'institutional');
    addCarouselButtonListeners('int-prev-btn', 'int-next-btn', 'intangible');
    addCarouselButtonListeners('men-prev-btn', 'men-next-btn', 'mental');

    // --- Default view setup on page load (Introduction category) ---
    // 1. Hide ALL elements that can transition and ALL carousels initially
    hideAllDisplayElements();
    hideAllContainers();

    // 2. Set up the initial 'introduction' state
    setFadeElementVisibility(introImage, true); // Show the intro image fading in

    textSections.forEach(section => {
        section.classList.toggle('active', section.getAttribute('data-category') === 'introduction');
    });

    legendItems.forEach(item => {
        item.classList.toggle('active', item.getAttribute('data-category') === 'introduction');
    });

    activeCategory = 'introduction';
});