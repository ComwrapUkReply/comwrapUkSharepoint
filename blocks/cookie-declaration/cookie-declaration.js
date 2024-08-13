async function loadScript(src, attrs) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    if (attrs) {
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const attr in attrs) {
        script.setAttribute(attr, attrs[attr]);
      }
    }
    script.onload = resolve;
    script.onerror = reject;
    const targetElement = document.querySelector('.cookie-declaration');
    targetElement.appendChild(script);
  });
}

loadScript('https://consent.cookiebot.com/747c7864-bf4d-4b8f-9e92-69d5eb6be267/cd.js');
