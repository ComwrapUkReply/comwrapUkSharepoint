export default function decorate(block) {
  [...block.children].forEach((col) => {
    col.classList.add('column');
    const colChild = col.querySelector('div');

    if (colChild) {
      colChild.classList.add('score');
      const h3Tag = colChild.querySelector('h3');
      h3Tag.classList.add('score-value');
      h3Tag.setAttribute('role', 'progressbar');
      h3Tag.setAttribute('aria-valuemin', '0');
      h3Tag.setAttribute('aria-valuemax', '100');
      h3Tag.setAttribute('style', '0');
    }
  });
}
