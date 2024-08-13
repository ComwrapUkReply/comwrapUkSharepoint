// Client custom block
export default function decorate(block) {
  const CLIENT = 'client';
  const CLIENT_IMAGE = 'client-image';
  const PICTURE = 'picture';

  [...block.children].forEach((item) => {
    item.classList.add(CLIENT);
    if (item.classList.contains(CLIENT)) {
      [...item.children].forEach((image) => {
        const hasPictureTag = [...image.children].some((child) => child.tagName.toLowerCase() ===
        PICTURE);
        if (hasPictureTag) {
          image.classList.add(CLIENT_IMAGE);
        } else {
          item.remove();
        }
      });
    }
  });

  // Version with unorder list
  // const ul = document.createElement('ul');
  // [...block.children].forEach((item) => {
  //   const li = document.createElement('li');
  //   while (item.firstElementChild) li.append(item.firstElementChild);
  //   ul.append(li);
  //   li.classList.add('client-item');
  // });
  // block.textContent = '';
  // block.append(ul);
  // ul.classList.add('clients-items');
}
