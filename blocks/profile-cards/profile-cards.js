/* eslint-disable function-paren-newline */
/* eslint-disable import/extensions */
/* eslint-disable no-alert */

import { createOptimizedPicture } from '../../scripts/aem.js';
import {
  a, div, li, h3, h4, ul
} from '../../scripts/block-party/dom-helpers.js';
import ffetch from '../../scripts/block-party/ffetch.js';

export default async function decorate(block) {
  const content = await ffetch('/modals/profiles/query-index.json').all();

  // Append sorted and filtered content to the block, obeying limits
  const profileContainer = ul(
    ...content.map((profile) => li(
      div({ class: 'card-image' },
        a({ href: profile.path }, // Link wrapping the image
          createOptimizedPicture(profile.image, profile.headline, false, [{ width: '750' }]),
        ),
      ),
      a({ class: 'card-body', href: profile.path },
        h3((profile.name)),
        h4((profile.title)),
      ),
    )),
  );

  block.append(profileContainer);
  profileContainer.classList.add('profile-container');
}
