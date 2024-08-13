/* Quote core block */
function hasWrapper(el) {
  return (
    !!el.firstElementChild && window.getComputedStyle(el.firstElementChild).display === 'block'
  );
}

export default function decorate(block) {
  const [quotation, description] = [...block.children].map((c) => c.firstElementChild);

  const blockquote = document.createElement('blockquote');

  quotation.className = 'quote-quotation';
  if (!hasWrapper(quotation)) {
    quotation.innerHTML = `<p>${quotation.innerHTML}</p>`;
  }
  blockquote.append(quotation);

  if (description) {
    description.className = 'quote-description';
    if (!hasWrapper(description)) {
      description.innerHTML = `<p>${description.innerHTML}</p>`;
    }
    blockquote.append(description);

    const ems = description.querySelectorAll('em');
    ems.forEach((em) => {
      const cite = document.createElement('cite');
      cite.innerHTML = em.innerHTML;
      em.replaceWith(cite);
    });
  }

  block.innerHTML = '';
  block.append(blockquote);
}
