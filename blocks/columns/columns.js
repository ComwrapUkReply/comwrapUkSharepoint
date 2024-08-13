/* Columns core component */
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-img-col');
        }
      }
    });
    const container = document.querySelector('.parallax');
    if (container) {
      const item = container.children[0].children[0];
      item.classList.add('parallax-container');
      const children = Array.from(item.children);
      const ParallaxInfoDiv = document.createElement('div');
      ParallaxInfoDiv.classList.add('parallax-info');
      const temporaryDiv = document.createElement('div');
      temporaryDiv.classList.add('info-container');
      if (block === container) {
        children.forEach((child, index) => {
          if (child?.tagName === 'P' && child?.children[0]?.tagName === 'PICTURE') {
            const Picture = child.children[0];
            const newDiv = document.createElement('div');
            newDiv.classList.add('parallax-image');
            newDiv.appendChild(Picture);
            child.replaceWith(newDiv);
          } else {
            if (!child.classList.contains('button-container')) {
              temporaryDiv.appendChild(child);
            } else ParallaxInfoDiv.appendChild(child);
          }
        });
        ParallaxInfoDiv.prepend(temporaryDiv);
        item.appendChild(ParallaxInfoDiv);
      }
    }
  });

  const columnsTextHeadings = document.querySelectorAll('.columns-wrapper h2');
  columnsTextHeadings.forEach((h2) => {
    h2.classList.add('columns-text-heading');
  });

  const columnsTextSubheading = document.querySelectorAll('h3');
  columnsTextSubheading.forEach((h3) => {
    h3.classList.add('columns-subheading');
    const columnsTextColumn = h3.parentNode;
    columnsTextColumn.classList.add('columns-text-column');
  });
}
