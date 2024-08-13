// Block custom block
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('blogs-item');
    while (item.firstElementChild) li.append(item.firstElementChild);

    // Find the h2 element within the li
    const BLOG_CARD_HEADING = 'blogs-card-heading';
    const BLOG_CARD_TAG = 'blogs-card-tag';
    const BLOG_CARD_DATE = 'blogs-card-date';
    const BLOG_CARD_AUTHOR = 'blogs-card-author';
    const BLOG_CARD_TITLE = 'blogs-card-title';
    const H2ELEMANT = li.querySelector('h2');

    // console.log(PARAGRAPH);

    // If the h2 element is found, add the class to it
    if (H2ELEMANT) {
      H2ELEMANT.classList.add(BLOG_CARD_HEADING);
    }

    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'blogs-card-image';
      } else if (div.querySelector('h2')) {
        div.classList.add(BLOG_CARD_TITLE);
        // const firstParagraph = div.querySelector(`.${BLOG_CARD_HEADING} + p`);
        const paragraphs = div.querySelectorAll(`.${BLOG_CARD_TITLE} > p`);

        if (paragraphs.length > 0) {
          paragraphs[0].classList.add(BLOG_CARD_TAG);

          if (paragraphs.length > 1) {
            paragraphs[1].classList.add(BLOG_CARD_DATE);

            if (paragraphs.length > 2) {
              paragraphs[2].classList.add(BLOG_CARD_AUTHOR);
            }
          }
        }
      } else {
        div.className = 'blogs-card-body';
      }
    });

    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
  ul.classList.add('blogs-items');
}
