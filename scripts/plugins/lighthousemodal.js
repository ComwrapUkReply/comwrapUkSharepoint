/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
// Script fetching Lighthouse result via API
function setUpQuery(category) {
  const api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
  const apiKey = `${window.siteConfig['$system:.lighthousekey$']}`;
  const parameters = {
    url: encodeURIComponent(window.location.href),
    key: apiKey, // Include the API key in the parameters.
    category,
    strategy: 'DESKTOP',
  };
  let query = `${api}?`;
  for (const key in parameters) { // Correctly declare key with let
    query += `${key}=${parameters[key]}&`;
  }
  return query.slice(0, -1); // Remove the trailing '&' from the query string
}

function wrapper(category, results) {
  const url = setUpQuery(category);
  return fetch(url)
    .then((response) => response.json())
    .then((json) => {
      // Push the category and analysisUTCTimestamp to results array
      results.push({ category, data: json.lighthouseResult.categories });
    })
    .catch((error) => console.error('Error fetching PageSpeed Insights:', error));
}

async function run() {
  const categories = [
    'ACCESSIBILITY',
    'BEST_PRACTICES',
    'PERFORMANCE',
    'SEO',
  ];
  const promises = [];
  const results = [];
  categories.forEach((category) => {
    promises.push(wrapper(category, results)); // Pass current timestamp
  });
  await Promise.all(promises);

  results.forEach((item) => {
    const categoryObject = item.data;
    for (const category in categoryObject) {
      const details = categoryObject[category];
      const scoreValue = `${details.score * 100}`;
      const elementId = category.toLowerCase();
      const element = document.getElementById(elementId);

      if (element) {
        element.innerText = `${scoreValue}%`;
        element.setAttribute('aria-valuenow', scoreValue);
        element.setAttribute('style', `--value: ${scoreValue}`);
      }

      // Dynamically inject style for progress animation and content counter
      const dynamicStyleId = 'dynamicScoreStyle';
      let styleTag = document.getElementById(dynamicStyleId);
      if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = dynamicStyleId;
        document.head.appendChild(styleTag);
      }
      styleTag.textContent = `
          .score-value::after {
              content: '${scoreValue}%' !important;
              counter-reset: percentage ${scoreValue} !important;
          }
          `;
    }
  });

  // Function to reset score styles to zero
  function resetScoreStyles() {
    const styleTag = document.getElementById('dynamicScoreStyle');
    if (styleTag) {
      styleTag.textContent = `
          .score-value::after {
              content: '0%';
              counter-reset: percentage 0;
          }
      `;
    }
  }

  function initializeObserver() {
    const body = document.querySelector('body');
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          const modalOpen = body.classList.contains('modal-open');
          if (modalOpen) {
            run(); // Run the PageSpeed tests when modal is opened
          } else {
            resetScoreStyles(); // Reset styles when modal is closed
          }
        }
      });
    });

    const observerConfig = {
      attributes: true,
      attributeFilter: ['class'],
      subtree: true,
    };

    observer.observe(body, observerConfig);
  }

  // Set everything up
  initializeObserver();

  const modalBox = document.querySelector('.modal-content');
  const heroItem = modalBox.querySelector('.modal-hero div');

  // Get the current date and time
  const now = new Date();

  // Options for formatting the date and time
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  };

  // Create a formatter for the locale 'en-US' (you can change this to match your user's locale)
  const formatter = new Intl.DateTimeFormat('en-UK', options);

  // Format the current date and time
  const prettyDate = formatter.format(now);

  // Create a paragraph element to display the formatted date and time
  const currentTestDataPar = document.createElement('p');
  currentTestDataPar.textContent = prettyDate;

  // Append the paragraph to the hero item
  heroItem.appendChild(currentTestDataPar);
}

run();
