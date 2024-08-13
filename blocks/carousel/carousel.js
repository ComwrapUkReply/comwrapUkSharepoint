/* Carousel core block */
import { fetchPlaceholders } from '../../scripts/aem.js';

function updateActiveSlide(slide) {
  const block = slide.closest('.carousel');
  const slideIndex = parseInt(slide.dataset.slideIndex, 10);
  block.dataset.activeSlide = slideIndex;

  const slides = block.querySelectorAll('.carousel-slide');

  slides.forEach((aSlide, idx) => {
    aSlide.setAttribute('aria-hidden', idx !== slideIndex);
    aSlide.querySelectorAll('a').forEach((link) => {
      if (idx !== slideIndex) {
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });
  });

  const indicators = block.querySelectorAll('.carousel-slide-indicator');
  indicators.forEach((indicator, idx) => {
    if (idx !== slideIndex) {
      indicator.querySelector('button').removeAttribute('disabled');
    } else {
      indicator.querySelector('button').setAttribute('disabled', 'true');
    }
  });
}

function showSlide(block, slideIndex = 0) {
  const slides = block.querySelectorAll('.carousel-slide');
  let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
  if (slideIndex >= slides.length) realSlideIndex = 0;
  const activeSlide = slides[realSlideIndex];

  activeSlide
    .querySelectorAll('a')
    .forEach((link) => link.removeAttribute('tabindex'));
  block.querySelector('.carousel-slides').scrollTo({
    top: 0,
    left: activeSlide.offsetLeft,
    behavior: 'smooth',
  });
}

function bindEvents(block) {
  const slideIndicators = block.querySelector('.carousel-slide-indicators');
  if (!slideIndicators) return;

  slideIndicators.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', (e) => {
      const slideIndicator = e.currentTarget.parentElement;
      showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
    });
  });

  block.querySelector('.slide-prev').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) - 1);
  });
  block.querySelector('.slide-next').addEventListener('click', () => {
    showSlide(block, parseInt(block.dataset.activeSlide, 10) + 1);
  });

  const slideObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) updateActiveSlide(entry.target);
      });
    },
    { threshold: 0.5 },
  );
  block.querySelectorAll('.carousel-slide').forEach((slide) => {
    slideObserver.observe(slide);
  });
}

function createSlide(row, slideIndex, carouselId) {
  const slide = document.createElement('li');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('id', `carousel-${carouselId}-slide-${slideIndex}`);
  slide.classList.add('carousel-slide');

  row.querySelectorAll(':scope > div').forEach((column, colIdx) => {
    column.classList.add(`carousel-slide-${colIdx === 0 ? 'image' : 'content'}`);
    slide.append(column);

    if (colIdx === 1) {
      // Create a div inside carousel-content
      const contentDiv = document.createElement('div');
      contentDiv.classList.add('image-carousel-content');

      // Find h2 and the following p element
      const carouselHeading = column.querySelector('h2');
      const carouselParagraph = carouselHeading ? carouselHeading.nextElementSibling : null;

      // Append h2 and p elements to the new div and remove them from the original column
      if (carouselHeading) {
        contentDiv.appendChild(carouselHeading);
      }
      if (carouselParagraph && carouselParagraph.tagName.toLowerCase() === 'p') {
        contentDiv.appendChild(carouselParagraph);
      }

      // Append the new div inside carousel-slide-content
      const carouselContent = slide.querySelector('.carousel-slide-content');
      if (carouselContent) {
        carouselContent.appendChild(contentDiv);
      }

      // Add button containers into new div
      const buttonContainers = column.querySelectorAll('.button-container');
      if (buttonContainers.length > 0) {
        const buttonContainerDiv = document.createElement('div');
        buttonContainerDiv.classList.add('image-carousel-buttons');
        buttonContainers.forEach((buttonContainer) => {
          buttonContainerDiv.appendChild(buttonContainer.cloneNode(true));
          buttonContainer.remove();
        });

        // Append the new div inside carousel-content
        carouselContent.appendChild(buttonContainerDiv);
      }
    }
  });

  const labeledBy = slide.querySelector('h1, h2, h3, h4, h5, h6');
  if (labeledBy) {
    slide.setAttribute('aria-labelledby', labeledBy.getAttribute('id'));
  }

  return slide;
}

let carouselId = 0;
const autoplayInterval = 10000; // 1 seconds
let autoplayTimer;

export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-${carouselId}`);
  const rows = block.querySelectorAll(':scope > div');
  const isSingleSlide = rows.length < 2;
  const placeholders = await fetchPlaceholders();
  block.setAttribute('role', 'region');
  block.setAttribute(
    'aria-roledescription',
    placeholders.carousel || 'Carousel',
  );
  const container = document.createElement('div');
  container.classList.add('carousel-slides-container');
  const slidesWrapper = document.createElement('ul');
  slidesWrapper.classList.add('carousel-slides');
  block.prepend(slidesWrapper);
  let slideIndicators;
  if (!isSingleSlide) {
    const slideIndicatorsNav = document.createElement('nav');
    slideIndicatorsNav.setAttribute(
      'aria-label',
      placeholders.carouselSlideControls || 'Carousel Slide Controls',
    );
    slideIndicators = document.createElement('ol');
    slideIndicators.classList.add('carousel-slide-indicators');
    slideIndicatorsNav.append(slideIndicators);
    block.append(slideIndicatorsNav);
    const slideNavButtons = document.createElement('div');
    slideNavButtons.classList.add('carousel-navigation-buttons');
    slideNavButtons.innerHTML = `
      <button type="button" class= "slide-prev" aria-label="${
  placeholders.previousSlide || 'Previous Slide'
}"></button>
  <button type="button" class="slide-next" aria-label="${
  placeholders.nextSlide || 'Next Slide'
}"></button>
    `;
    container.append(slideNavButtons);
  }
  rows.forEach((row, idx) => {
    const slide = createSlide(row, idx, carouselId);
    slidesWrapper.append(slide);
    if (slideIndicators) {
      const indicator = document.createElement('li');
      indicator.classList.add('carousel-slide-indicator');
      indicator.dataset.targetSlide = idx;
      indicator.innerHTML = `<button type="button"><span>${
        placeholders.showSlide || 'Show Slide'
      } ${idx + 1} ${placeholders.of || 'of'} ${rows.length}</span></button>`;
      slideIndicators.append(indicator);
    }
    row.remove();
  });
  container.append(slidesWrapper);
  block.prepend(container);
  if (!isSingleSlide) {
    bindEvents(block);

    // Autoplay functionality
    // const startAutoplay = () => {
    //   autoplayTimer = setInterval(() => {
    //     const currentSlideIndex = parseInt(block.dataset.activeSlide, 10);
    //     const nextSlideIndex = (currentSlideIndex + 1) % rows.length;
    //     showSlide(block, nextSlideIndex);
    //   }, autoplayInterval);
    // };

    // const stopAutoplay = () => {
    //   clearInterval(autoplayTimer);
    // };

    // startAutoplay();

    // block.addEventListener('mouseenter', stopAutoplay);
    // block.addEventListener('mouseleave', startAutoplay);

    const startAutoplay = () => {
      autoplayTimer = setInterval(() => {
        const currentSlideIndex = block.dataset.activeSlide ? parseInt(block.dataset.activeSlide, 10) : 0;
        const nextSlideIndex = (currentSlideIndex + 1) % (rows.length || 1);
        showSlide(block, nextSlideIndex);
      }, autoplayInterval);
    };

    const stopAutoplay = () => {
      clearInterval(autoplayTimer);
    };
    startAutoplay();
    block.addEventListener('mouseenter', stopAutoplay);
    block.addEventListener('touchstart', stopAutoplay);
    function showSlide(block, slideIndex = 0) {
      if (!block) {
        return;
      }
      const slides = block.querySelectorAll('.carousel-slide');
      if (!slides || slides.length === 0) {
        return;
      }
      let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
      if (slideIndex >= slides.length) realSlideIndex = 0;
      const activeSlide = slides[realSlideIndex];
      if (!activeSlide) {
        return;
      }
      activeSlide
        .querySelectorAll('a')
        .forEach((link) => link.removeAttribute('tabindex'));
      if (block.querySelector('.carousel-slides')) {
        block.querySelector('.carousel-slides').scrollTo({
          top: 0,
          left: activeSlide.offsetLeft,
          behavior: 'smooth',
        });
      }
    }
  }
}

/* Image carousel block */

const imageCarousel = document.querySelector('.image-carousel');
if (imageCarousel) {
  const imageCarouselParent = imageCarousel.parentElement.parentElement;
  imageCarouselParent.classList.add('image-carousel-container');
}
