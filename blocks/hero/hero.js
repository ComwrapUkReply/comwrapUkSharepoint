/* Hero core block */
export default function decorate(block) {
  [...block.children].forEach((heroItem) => {
    heroItem.classList.add('hero-item');

    // Replace 'p' with 'div' and add a new class to the container
    const pictureContainer = heroItem.querySelector('picture');
    if (pictureContainer) {
      const imageParent = pictureContainer.parentNode; // picture parent

      const newDiv = document.createElement('div');
      newDiv.innerHTML = imageParent.innerHTML;
      newDiv.classList.add('hero-image');
      imageParent.replaceWith(newDiv);
    }

    const h1Element = document.createElement('h1');
    const paragraphs = heroItem.querySelectorAll('p');

    if (paragraphs.length > 0) {
      h1Element.textContent = paragraphs[0].innerHTML;
      h1Element.classList.add('hero-title');
      paragraphs[0].parentNode.replaceChild(h1Element, paragraphs[0]);
      paragraphs[1].classList.add('hero-subtitle');
    }

    // Add class to UL and LI elements
    const ulServices = heroItem.querySelector('ul');
    if (ulServices) {
      ulServices.classList.add('service-list');

      // Add class to each LI element
      const liServices = ulServices.querySelectorAll('li');
      liServices.forEach((li) => {
        li.classList.add('service-item');
      });

      // Custom code
      liServices.forEach((li, index) => {
        li.classList.add(`service-item-${index + 1}`);
      });
    }
    // hero page code
    const pageHero = document.querySelector('.hero-page');

    if (pageHero) {
      const heroItem = document.querySelector('.hero-item');
      const heroDesc = heroItem.nextElementSibling;
      if (heroDesc) {
        heroDesc.classList.add('hero-desc');

        const pars = heroDesc.querySelectorAll('p');

        if (pars.length > 0) {
          const heroTag = pars[0];
          const heroMainTitle = pars[1];
          const heroSubTitle = pars[2];

          const heroSpan = document.createElement('span');
          heroTag.replaceWith(heroSpan);
          heroSpan.classList.add('hero-tag');
          heroSpan.textContent = heroTag.textContent;

          const heroH1 = document.createElement('h1');
          heroMainTitle.replaceWith(heroH1);
          heroH1.classList.add('hero-title');
          heroH1.textContent = heroMainTitle.textContent;

          const heroP = document.createElement('span');
          heroSubTitle.replaceWith(heroP);
          heroP.classList.add('hero-sub-title');
          heroP.textContent = heroSubTitle.textContent;
        };
      } else {
        const heroItem = document.querySelector('.hero-item');

        const innerDiv = heroItem.querySelector('div');

        const paragraphs = heroItem.querySelectorAll('p');
        const heroMainTitle = heroItem.querySelector('h1');

        const newDiv = document.createElement('div');
        newDiv.classList.add('hero-info');

        const heroH1 = document.createElement('h1');
        heroH1.classList.add('hero-title');
        heroH1.textContent = paragraphs[0].textContent;

        const heroSpan = document.createElement('span');
        heroSpan.classList.add('hero-tag');
        heroSpan.textContent = heroMainTitle.textContent;

        const heroP = document.createElement('span');
        if (paragraphs[1]) {
          heroP.classList.add('hero-sub-title');
          heroP.textContent = paragraphs[1].textContent;
        }

        newDiv.appendChild(heroSpan);
        newDiv.appendChild(heroH1);
        if (heroP) {
          newDiv.appendChild(heroP);
        }

        heroItem.appendChild(newDiv);
        const heroImage = innerDiv.querySelector('.hero-image');
        heroItem.insertBefore(heroImage, newDiv);
        innerDiv.remove();
      };
    }
  });

  const pageHalf = document.querySelector('.hero-half');
  if (pageHalf) {
    const heroItem = pageHalf.querySelector('.hero-item');
    const heroDescExists = pageHalf.querySelector('.hero-desc.hero-item') !== null;

    if (heroDescExists) {
      heroItem.classList.remove('hero-item');
    }
  }

  const pageHome = document.querySelector('.hero-home');
  const animation = document.querySelector('.animation');
  if (pageHome && animation && window.innerWidth >= 900) {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      // Extract the full text and then split to get the first word and the rest
      const fullText = heroTitle.textContent.trim();
      const wordsArray = fullText.split(' ');
      const firstWord = wordsArray[0];
      const restOfContent = wordsArray.slice(1);

      // Clear the hero title and set up initial display
      heroTitle.textContent = '';

      // Create and append a span for the initial first word
      const firstWordSpan = document.createElement('span');
      firstWordSpan.textContent = firstWord;
      heroTitle.appendChild(firstWordSpan);

      const restOfContentSpan = document.createElement('span');
      if (restOfContent.length > 1) {
        restOfContentSpan.innerHTML = ' ' + restOfContent.slice(0, 1).join(' ') + '<br>' + restOfContent.slice(1).join(' ');
      } else {
        restOfContentSpan.textContent = ' ' + restOfContent.join(' ');
      }
      heroTitle.appendChild(restOfContentSpan);
    }

    // Typing animation effect, starting with the initial first word
    const words = ['Converting', 'Orchestrating', 'Transforming'];
    const text = document.querySelector('.hero-title span:first-child');

    // Generator to cycle through words
    function * generator() {
      let index = 0;
      while (true) {
        yield words[index++];
        if (index >= words.length) {
          index = 0;
        }
      }
    }

    // Printing effect
    function printChar(word) {
      let i = 0;
      text.innerHTML = '';
      const id = setInterval(() => {
        if (i >= word.length) {
          clearInterval(id);
          setTimeout(() => deleteChar(), 700);
        } else {
          text.innerHTML += word[i];
          i++;
        }
      }, 200);
    }

    // Deleting effect
    function deleteChar() {
      const word = text.innerHTML;
      let i = word.length - 1;
      const id = setInterval(() => {
        if (i >= 0) {
          text.innerHTML = text.innerHTML.substring(0, text.innerHTML.length - 1);
          i--;
        } else {
          printChar(gen.next().value);
          clearInterval(id);
        }
      }, 115);
    }

    // Initializing generator
    const gen = generator();

    // Start the animation with a 3-second delay
    setTimeout(() => {
      printChar(gen.next().value);
    }, 3000);
  }
}
