/* eslint-disable no-restricted-syntax */
/* site configuration module */
/*

   ++++++++++++++++++++++++++++++++++++++++++++++++++

   NOTHING iN HERE CAN USE OR DERIVE FROM siteConfig
   until you are sure you know what you are doing
   i.e no use of siteConfig['$meta:author$'] etc
   The stuff in here has to be super fast
   do not use ffetch or loading 3rd party libs
   all such things should be done in their own plugin
   after the call to createJSON is done siteConfig[...]
   is ok
   ++++++++++++++++++++++++++++++++++++++++++++++++++

*/

import {
  tidyDOM,
  possibleMobileFix,
  swiftChangesToDOM
} from './reModelDom.js';

import {
  constructGlobal
} from './variables.js';

import {
  initializeClientConfig
} from './clientConfig.js';

import {
  handleMetadataJsonLd,
  createJSON
} from './jsonHandler.js';

await import('../../config/config.js');

function noAction() {
}
export async function initializeSiteConfig() {
// Determine the environment and locality based on the URL
  const getEnvironment = () => {
  // Define an array of environments with their identifying substrings in the URL
    const environments = [
      { key: '.html', value: 'final' },
      { key: 'hlx.page', value: 'preview' },
      { key: 'hlx.live', value: 'live' },
    ];

    for (const env of environments) {
      if (window.location.href.includes(env.key)) {
        return env.value;
      }
    }
    // If no match is found, it defaults to 'final'
    return 'final';
  };

  const getLocality = () => {
    const environments = [
      { key: 'localhost', value: 'local' },
      { key: 'stage', value: 'stage' },
      { key: 'fastly', value: 'preprod' },
      { key: 'preprod.', value: 'preprod' },
      { key: 'prod', value: 'prod' },
      { key: 'dev', value: 'dev' },
    ];
    for (const env of environments) {
      if (window.location.href.includes(env.key)) {
        return env.value;
      }
    }

    // Return 'unknown' if no environment matches
    return 'unknown';
  };

  window.cmsplus = {
    environment: getEnvironment(),
    locality: getLocality(),
  };
  window.cmsplus.callbackPageLoadChain = [];
  window.cmsplus.callbackAfter3SecondsChain = [];

  window.cmsplus.callbackAfter3SecondsChain.push(noAction); // set up nop.
  window.cmsplus.callbackPageLoadChain.push(noAction); // set up nop.
  possibleMobileFix('hero');
  await constructGlobal();
  swiftChangesToDOM();
  await createJSON();// *********   siteConfig is ready now *******
  await initializeClientConfig();
  if (window.cmsplus.environment === 'preview') {
    import('./debugPanel.js');
  }

  // all configuration completed, make any further callbacks from here

  // attempt at overwriting the loadDelayed function
  // window.cmsplus.loadDelayed = function loadDelayed() {
  // window.setTimeout(() => import('../delayed.js'), window.cmsplus.analyticsdelay);
  // };

  await tidyDOM();
  await handleMetadataJsonLd();
  await window.cmsplus?.callbackMetadataTracker?.();
  if (window.cmsplus.environment !== 'final') {
    window.cmsplus.callbackCreateDebugPanel?.();
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const callback of window.cmsplus.callbackPageLoadChain) {
  // eslint-disable-next-line no-await-in-loop
    await callback();
  }
}
