/* eslint-disable function-paren-newline */
/* eslint-disable import/extensions */
/* eslint-disable no-alert */

export default async function decorate(block) {
  const className = ['profile-social', 'profile-image', 'profile-name', 'profile-title', 'profile-info', 'profile-spec', 'profile-fun', 'profile-cert'];

  [...block.children].forEach((child, index) => {
    if (className[index]) {
      child.classList.add(className[index]);
    }
  });
}
