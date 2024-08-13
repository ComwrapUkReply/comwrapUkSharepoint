export default async function decorate(block) {
  const infoGraphic = [...block.firstElementChild.children];
  const div = document.createElement('div');
  div.classList.add('span-arrow');
  infoGraphic[infoGraphic.length - 1].insertAdjacentElement('afterend', div);
  if (infoGraphic.length > 0) {
    infoGraphic[0].classList.add('info-graphic-img');
  }
}
