export default function decorate(block) {
  const tagsBlock = document.querySelector('.tags.block');
  let tagsHTML = '';
  if (window.siteConfig && window.siteConfig['$meta:service$']) {
    tagsHTML += `<span class='card-tag'>${window.siteConfig['$meta:service$']}</span>`;
  }
  if (window.siteConfig && window.siteConfig['$meta:resource$']) {
    tagsHTML += `<span class='card-tag alt'>${window.siteConfig['$meta:resource$']}</span>`;
  }
  if (tagsHTML) {
    tagsBlock.innerHTML = tagsHTML;
    block.appendChild(tagsBlock);
  }
}
