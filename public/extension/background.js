const BASE_URL = 'https://devtransform-hub.vercel.app';

const SHORTCUTS = {
  'word': '/tools/word-to-pdf/',
  'pdf': '/tools/word-to-pdf/',
  'image': '/tools/image-compressor/',
  'compress': '/tools/image-compressor/',
  'cron': '/tools/cron-expression-explainer/',
  'chmod': '/tools/chmod-calculator/',
  'json': '/tools/json-to-typescript/',
  'ts': '/tools/json-to-typescript/',
  'port': '/port/directory/',
  'ports': '/port/directory/',
  'regex': '/regex/directory/',
  'http': '/tools/http-status-codes/',
  'status': '/tools/http-status-codes/',
  'uuid': '/tools/uuid-generator/',
  'base64': '/tools/base64-encode-decode/',
  'sql': '/tools/sql-formatter/',
  'diff': '/tools/diff-checker/',
};

// Listen for omnibox input
chrome.omnibox.onInputEntered.addListener((text) => {
  const query = text.trim().toLowerCase();
  if (SHORTCUTS[query]) {
    chrome.tabs.create({ url: `${BASE_URL}${SHORTCUTS[query]}` });
  } else if (query) {
    chrome.tabs.create({ url: `${BASE_URL}/#tools` });
  } else {
    chrome.tabs.create({ url: BASE_URL });
  }
});

// Set default suggestion in address bar
chrome.omnibox.setDefaultSuggestion({
  description: 'DevTransform Hub: Jump to 145+ developer tools (e.g. "dt json", "dt cron", "dt word")'
});
