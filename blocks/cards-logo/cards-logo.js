// Cards core block
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const CARD_IMAGE = 'card-image';
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1) { div.className = CARD_IMAGE; }
    });
    ul.append(li);
  });
  ul.querySelectorAll('icon').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}
