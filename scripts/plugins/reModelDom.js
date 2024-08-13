/* eslint-disable max-len */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { getConfigTruth } from './variables.js';

function findTitleElement() {
  const h1 = document.querySelector('h1'); // Prioritize H1
  if (h1) return h1;

  // Look in more specific areas (adjust selectors as needed)
  const mainContent = document.querySelector('main') || document.querySelector('article');
  if (mainContent) {
    const potentialText = mainContent.firstChild;
    if (potentialText && potentialText.nodeType === Node.TEXT_NODE) {
      return potentialText;
    }
  }
  return null; // No suitable title found
}

export function addByLine() {
  if (getConfigTruth('$system:addbyline$')) {
    if (!window.siteConfig['$meta:suppressbyline$']) {
      const firstH1 = document.querySelector('h1');
      if (firstH1) {
        const appendString = `Published: ${window.siteConfig['$system:dateinenglish$']}; By ${window.siteConfig['$meta:author$']},  ${window.siteConfig['$page:readspeed$']} </strong>minute(s) reading.`;
        // Append the constructed string to the h1 element's current content
        const newElement = document.createElement('div');
        newElement.className = 'byLine';
        newElement.innerHTML = appendString;
        firstH1.insertAdjacentElement('afterend', newElement);
      }
    }
  }
}

export function removeMeta() {
  const metadataNames = [
    'description',
    'twitter:card',
    'twitter:title',
    'twitter:description',
    'twitter:image',
    'referrer',
    'viewport',
    'og:title',
    'og:description',
    'og:image',
    'og:type',
    'og:url',
    'og:site_name',
    'keywords',
  ];
  const elements = document.querySelectorAll('meta[name]');

  elements.forEach((element) => {
    const name = element.getAttribute('name');
    if (!metadataNames.includes(name)) {
      element.remove();
    }
  });
}

export function removeCommentBlocks() {
  document.querySelectorAll('div.section-metadata.comment').forEach((section) => section.remove());
}

function makeLinksRelative() {
  function sanitize(url) {
    let ret = url.trim();
    if (!ret.endsWith('/')) {
      ret = `${ret}/`;
    }
    return ret;
  }
  const domains = [];
  domains.push(sanitize(window.location.origin));
  const finalUrl = window.finaLUrl;
  if (finalUrl) {
    domains.push(sanitize(finalUrl));
  }
  const links = document.getElementsByTagName('a');
  for (let i = 0; i < links.length; i += 1) {
    const link = links[i];
    const href = link.getAttribute('href');
    if (href) {
      for (let j = 0; j < domains.length; j += 1) {
        const domain = domains[j];
        if (href.startsWith(domain)) {
          const relativePath = href.slice(domain.length);
          link.setAttribute('href', relativePath);
          break;
        }
      }
    }
  }
}

export async function possibleMobileFix(container) {
  // Select the element by its class
  const firstPicture = document.querySelector(`.${container} > div:first-of-type picture`);
  const secondPicture = document.querySelector(`.${container} > div:first-of-type > div:nth-of-type(2) picture`);

  if (firstPicture && secondPicture) {
    // Select the second source element from the second picture element
    const secondSource = secondPicture.querySelector('source:nth-of-type(2)');

    if (secondSource) {
      const newSource = secondSource.cloneNode(true);
      const firstPictureSecondSource = firstPicture.querySelector('source:nth-of-type(2)');

      if (firstPictureSecondSource) {
        firstPicture.replaceChild(newSource, firstPictureSecondSource);
      } else {
        firstPicture.appendChild(newSource);
      }

      secondPicture.remove();
    }
  }
}

function DynamicSVGWidthHeight() {
  // Add dynamic width and height to all SVG image
  const imgSvg = document.querySelectorAll('img[src$=".svg"]');
  imgSvg.forEach((img) => {
    const imgWidth = img.clientWidth;
    const imgHeight = img.clientHeight;
    img.setAttribute('width', imgWidth);
    img.setAttribute('height', imgHeight);
  });
}

/**
 * Adds a <meta> element to the <head> of the document with the given name and content.
 * If a meta element with the given name already exists, it is not added.
 * @param {string} name The name of the meta element.
 * @param {string} content The content of the meta element.
 */

function createTitle() {
  const metaTitle = document.querySelector('meta[name="title"]');
  if (!metaTitle) {
    const titleElement = findTitleElement();
    if (titleElement) {
      const defaultTitle = titleElement.textContent.trim();
      const title = document.createElement('meta');
      title.name = 'title';
      title.content = defaultTitle;
      document.head.appendChild(title);
    }
  }
}

export function handleExternalLinks() {
  const siteDomain = window.location.hostname;
  const links = document.querySelectorAll('a');

  links.forEach((link) => {
    try {
      const linkDomain = new URL(link.href).hostname;
      if (linkDomain !== siteDomain && !link.href.startsWith('/') && !link.href.startsWith('#')) {
        link.setAttribute('target', '_blank');
      }
    } catch (error) {
      // Invalid URL, skip this link
      console.warn(`Skipping invalid URL: ${link.href}`);
    }
  });
}

// perform very fast changes before the page is shown
export function swiftChangesToDOM() {
  addByLine();
  DynamicSVGWidthHeight();
}

// tidyDOM is the slow fixes to the Dom that do not change styles or view
export async function tidyDOM() {
  makeLinksRelative();
  createTitle();
  removeCommentBlocks();
  removeMeta();
  if (document.querySelector('coming-soon')) {
    document.body.classList.add('hide');
  }

  // Remove title from link with images
  const links = document.querySelectorAll('a');
  const containsVisualElements = (link) => link.querySelectorAll('img') || link.querySelector('picture') || link.querySelector('i[class^="icon"], i[class*=" icon"], i[class^="fa"], i[class*=" fa"]');

  // Remove title from link
  links.forEach((link) => {
    if (containsVisualElements(link)) {
      // If a title attribute exists, remove it
      if (link.hasAttribute('title')) {
        link.removeAttribute('title');
      }
    }
  });

  // Add button="role" to every link with button class
  const buttonRole = document.querySelectorAll('.button');
  buttonRole.forEach((button) => {
    button.setAttribute('role', 'button');
  });

  // Handle external links
  handleExternalLinks();

  // Add current class to any current visited
  const currentPage = window.location.href;
  links.forEach((link) => {
    if (link.href === currentPage) {
      link.classList.add('current');
    }
  });
}

export function allowAnimations() {
  // Implementation for allowing animations
}

export function create3SecondDelayFunction() {
  window.cmsplus.callbackAfter3SecondsChain.push(allowAnimations);
}
