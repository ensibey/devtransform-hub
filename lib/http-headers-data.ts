export interface HttpHeaderItem {
  slug: string;
  name: string;
  category: 'Security' | 'Caching' | 'CORS' | 'Authentication' | 'Transport & Cookie';
  type: 'Response Header' | 'Request Header' | 'Response & Request';
  owaspRating: 'Essential (A+)' | 'Highly Recommended' | 'Context-Dependent' | 'Deprecated / Legacy';
  recommendedValue: string;
  summary: string;
  syntax: string;
  directives: {
    name: string;
    description: string;
  }[];
  nginxConfig: string;
  apacheConfig: string;
  nextjsConfig: string;
  expressConfig: string;
  pitfalls: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const HTTP_HEADERS: HttpHeaderItem[] = [
  {
    slug: 'content-security-policy',
    name: 'Content-Security-Policy (CSP)',
    category: 'Security',
    type: 'Response Header',
    owaspRating: 'Essential (A+)',
    recommendedValue: "default-src 'self'; img-src 'self' data: https:; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none';",
    summary: 'Restricts where scripts, images, styles, and frames can be loaded from, protecting websites from Cross-Site Scripting (XSS) and data injection attacks.',
    syntax: "Content-Security-Policy: <directive> <source-list>; <directive> <source-list>;",
    directives: [
      { name: "default-src 'self'", description: 'Fallback source for all unspecified fetch directives. Restricts resources to origin.' },
      { name: "script-src 'self'", description: 'Restricts executable JavaScript sources to same-origin. Blocks unauthorized external scripts.' },
      { name: "object-src 'none'", description: 'Disables Flash, Java applets, and other outdated plugins that carry severe vulnerabilities.' },
      { name: "frame-ancestors 'none'", description: 'Modern CSP replacement for X-Frame-Options DENY to prevent clickjacking.' },
      { name: "base-uri 'self'", description: 'Restricts allowed URLs in the document <base> element to avoid base tag hijacking.' },
    ],
    nginxConfig: "add_header Content-Security-Policy \"default-src 'self'; script-src 'self'; object-src 'none';\" always;",
    apacheConfig: "Header always set Content-Security-Policy \"default-src 'self'; script-src 'self'; object-src 'none';\"",
    nextjsConfig: "{\n  key: 'Content-Security-Policy',\n  value: \"default-src 'self'; script-src 'self'; object-src 'none';\"\n}",
    expressConfig: "app.use((req, res, next) => {\n  res.setHeader('Content-Security-Policy', \"default-src 'self'; script-src 'self'; object-src 'none';\");\n  next();\n});",
    pitfalls: [
      "Avoid using 'unsafe-eval' or 'unsafe-inline' without nonces or hashes as they neutralize XSS protection.",
      "Test thoroughly using 'Content-Security-Policy-Report-Only' before enforcing to avoid breaking third-party analytics.",
    ],
    faqs: [
      {
        question: 'What is the difference between CSP and X-Frame-Options?',
        answer: 'X-Frame-Options only prevents clickjacking by restricting iframe embedding. CSP includes "frame-ancestors" for clickjacking and additionally guards against XSS, script injection, and unsafe plugin execution.',
      },
      {
        question: 'How do I test CSP without breaking my production website?',
        answer: 'Use the "Content-Security-Policy-Report-Only" header with a report-uri or report-to endpoint. Violations will be logged without blocking legitimate user assets.',
      },
    ],
  },
  {
    slug: 'strict-transport-security-hsts',
    name: 'Strict-Transport-Security (HSTS)',
    category: 'Security',
    type: 'Response Header',
    owaspRating: 'Essential (A+)',
    recommendedValue: 'max-age=63072000; includeSubDomains; preload',
    summary: 'Forces modern web browsers to communicate exclusively over encrypted HTTPS connections, preventing SSL stripping and man-in-the-middle (MITM) attacks.',
    syntax: 'Strict-Transport-Security: max-age=<expire-time> [; includeSubDomains] [; preload]',
    directives: [
      { name: 'max-age=63072000', description: 'Duration in seconds (2 years) the browser must remember to force HTTPS for this domain.' },
      { name: 'includeSubDomains', description: 'Applies the HTTPS enforcement rule to all subdomains (api., mail., dev., etc.).' },
      { name: 'preload', description: 'Consents to inclusion in Google Chrome and major browsers permanent hardcoded HSTS preload list.' },
    ],
    nginxConfig: 'add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;',
    apacheConfig: 'Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"',
    nextjsConfig: "{\n  key: 'Strict-Transport-Security',\n  value: 'max-age=63072000; includeSubDomains; preload'\n}",
    expressConfig: "res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');",
    pitfalls: [
      'Never send HSTS on plain HTTP responses. Browsers ignore HSTS over HTTP for security reasons.',
      'Only add "preload" if all subdomains permanently support valid SSL/TLS certificates.',
    ],
    faqs: [
      {
        question: 'How do I submit my site to the official Chrome HSTS preload list?',
        answer: 'Once your domain serves HSTS with max-age >= 31536000, includeSubDomains, and preload, submit it at hstspreload.org.',
      },
    ],
  },
  {
    slug: 'x-frame-options',
    name: 'X-Frame-Options',
    category: 'Security',
    type: 'Response Header',
    owaspRating: 'Essential (A+)',
    recommendedValue: 'DENY',
    summary: 'Indicates whether a browser should be allowed to render a page inside an <iframe>, <frame>, or <object>, protecting users against clickjacking attacks.',
    syntax: 'X-Frame-Options: DENY | SAMEORIGIN',
    directives: [
      { name: 'DENY', description: 'Completely blocks the page from being displayed in an iframe on any site, including same origin.' },
      { name: 'SAMEORIGIN', description: 'Permits iframe rendering only if the parent frame belongs to the exact same origin (scheme, host, port).' },
    ],
    nginxConfig: 'add_header X-Frame-Options "DENY" always;',
    apacheConfig: 'Header always set X-Frame-Options "DENY"',
    nextjsConfig: "{\n  key: 'X-Frame-Options',\n  value: 'DENY'\n}",
    expressConfig: "res.setHeader('X-Frame-Options', 'DENY');",
    pitfalls: [
      'The legacy "ALLOW-FROM uri" directive is obsolete and not supported in modern browsers. Use CSP "frame-ancestors" instead.',
    ],
    faqs: [
      {
        question: 'What is Clickjacking?',
        answer: 'Clickjacking is an attack where a malicious site embeds your page in a transparent iframe and tricks authenticated users into clicking invisible buttons (like "Transfer Funds" or "Delete Account").',
      },
    ],
  },
  {
    slug: 'x-content-type-options',
    name: 'X-Content-Type-Options',
    category: 'Security',
    type: 'Response Header',
    owaspRating: 'Essential (A+)',
    recommendedValue: 'nosniff',
    summary: 'Prevents the browser from MIME-sniffing a response away from the declared Content-Type header, mitigating drive-by malware and MIME confusion attacks.',
    syntax: 'X-Content-Type-Options: nosniff',
    directives: [
      { name: 'nosniff', description: 'Tells the browser to strictly trust the declared Content-Type header and reject executable files with mismatched MIME types.' },
    ],
    nginxConfig: 'add_header X-Content-Type-Options "nosniff" always;',
    apacheConfig: 'Header always set X-Content-Type-Options "nosniff"',
    nextjsConfig: "{\n  key: 'X-Content-Type-Options',\n  value: 'nosniff'\n}",
    expressConfig: "res.setHeader('X-Content-Type-Options', 'nosniff');",
    pitfalls: [
      'Ensure server configurations set accurate Content-Type headers for .js (text/javascript) and .css (text/css), or browsers will block them.',
    ],
    faqs: [
      {
        question: 'Why does MIME sniffing pose a security hazard?',
        answer: 'If an attacker uploads a malicious script with an image extension (.jpg), a sniffing browser might execute it as HTML/JavaScript, leading to account takeover.',
      },
    ],
  },
  {
    slug: 'referrer-policy',
    name: 'Referrer-Policy',
    category: 'Security',
    type: 'Response Header',
    owaspRating: 'Highly Recommended',
    recommendedValue: 'strict-origin-when-cross-origin',
    summary: 'Controls how much referrer information (URL path and query parameters) is included when navigating away or loading external assets.',
    syntax: 'Referrer-Policy: strict-origin-when-cross-origin | no-referrer | origin',
    directives: [
      { name: 'strict-origin-when-cross-origin', description: 'Sends full URL for same-origin, domain-only for HTTPS cross-origin, and zero referrer when downgrading to HTTP.' },
      { name: 'no-referrer', description: 'Never sends the Referer header under any circumstances for maximum privacy.' },
      { name: 'origin-when-cross-origin', description: 'Sends full path for same-origin requests, but only domain origin for third-party requests.' },
    ],
    nginxConfig: 'add_header Referrer-Policy "strict-origin-when-cross-origin" always;',
    apacheConfig: 'Header always set Referrer-Policy "strict-origin-when-cross-origin"',
    nextjsConfig: "{\n  key: 'Referrer-Policy',\n  value: 'strict-origin-when-cross-origin'\n}",
    expressConfig: "res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');",
    pitfalls: [
      'Sensitive tokens, session IDs, or password reset parameters in URL query strings can leak to third parties if Referrer-Policy is permissive.',
    ],
    faqs: [
      {
        question: 'What is the default Referrer-Policy in modern browsers?',
        answer: 'Chrome, Firefox, and Safari default to "strict-origin-when-cross-origin" if the header is not specified.',
      },
    ],
  },
  {
    slug: 'permissions-policy',
    name: 'Permissions-Policy',
    category: 'Security',
    type: 'Response Header',
    owaspRating: 'Highly Recommended',
    recommendedValue: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
    summary: 'Allows site owners to selectively restrict browser hardware features, sensors, APIs, and privacy-invasive tracking mechanisms.',
    syntax: 'Permissions-Policy: <feature>=(<allowlist>), <feature>=(<allowlist>)',
    directives: [
      { name: 'camera=()', description: 'Completely disables webcam access for this origin and any embedded iframes.' },
      { name: 'microphone=()', description: 'Disables microphone audio recording for the page and third-party widgets.' },
      { name: 'geolocation=()', description: 'Blocks GPS location coordinate queries from the browser API.' },
      { name: 'browsing-topics=()', description: 'Opts out of Google Chrome Privacy Sandbox ad tracking and behavioral profiling.' },
    ],
    nginxConfig: 'add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), browsing-topics=()" always;',
    apacheConfig: 'Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), browsing-topics=()"',
    nextjsConfig: "{\n  key: 'Permissions-Policy',\n  value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()'\n}",
    expressConfig: "res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), browsing-topics=()');",
    pitfalls: [
      'Permissions-Policy replaces the deprecated Feature-Policy header. Ensure you use the newer key-value list syntax.',
    ],
    faqs: [
      {
        question: 'Can I allow camera or microphone only for my own domain?',
        answer: 'Yes! Use "camera=(self), microphone=(self)" to allow your primary application while locking out third-party embedded iframes.',
      },
    ],
  },
  {
    slug: 'cache-control',
    name: 'Cache-Control',
    category: 'Caching',
    type: 'Response & Request',
    owaspRating: 'Essential (A+)',
    recommendedValue: 'public, max-age=31536000, immutable (Static Assets) OR no-store, max-age=0 (Dynamic APIs)',
    summary: 'Specifies browser and CDN caching directives for requests and responses, dramatically accelerating load speeds or preventing cache leakage.',
    syntax: 'Cache-Control: <directive> [,<directive>...]',
    directives: [
      { name: 'no-store', description: 'Forbids browsers and CDNs from storing any response data on disk or memory (essential for private user data).' },
      { name: 'max-age=<seconds>', description: 'Maximum lifetime in seconds that a cached resource is considered fresh.' },
      { name: 'immutable', description: 'Indicates the response body will never change over time, bypassing conditional validation requests.' },
      { name: 'stale-while-revalidate=<seconds>', description: 'Allows serving stale cached data instantly while fetching an updated copy in the background.' },
    ],
    nginxConfig: 'expires 1y; add_header Cache-Control "public, immutable";',
    apacheConfig: 'Header set Cache-Control "public, max-age=31536000, immutable"',
    nextjsConfig: "{\n  key: 'Cache-Control',\n  value: 'public, max-age=31536000, immutable'\n}",
    expressConfig: "res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');",
    pitfalls: [
      'Do NOT use "immutable" on assets without cache-busting hashes (like main.css instead of main.a1b2c3.css).',
      'Using "no-cache" does NOT mean do not cache; it means revalidate with the server before using.',
    ],
    faqs: [
      {
        question: 'What is the best Cache-Control policy for hashed production bundles?',
        answer: '"public, max-age=31536000, immutable" provides maximum performance because modern bundlers give changed files unique hashes.',
      },
    ],
  },
  {
    slug: 'access-control-allow-origin-cors',
    name: 'Access-Control-Allow-Origin (CORS)',
    category: 'CORS',
    type: 'Response Header',
    owaspRating: 'Context-Dependent',
    recommendedValue: 'https://app.example.com (Never wildcard * with credentials)',
    summary: 'Tells browsers which specific origins are permitted to access resources via XMLHttpRequest or Fetch API across domains.',
    syntax: 'Access-Control-Allow-Origin: * | <origin> | null',
    directives: [
      { name: 'https://trusted.com', description: 'Explicitly authorizes only the trusted domain to read cross-origin API responses.' },
      { name: '*', description: 'Wildcard allowing any public website to fetch response (safe only for truly public static assets).' },
    ],
    nginxConfig: 'add_header Access-Control-Allow-Origin "https://app.example.com" always;',
    apacheConfig: 'Header set Access-Control-Allow-Origin "https://app.example.com"',
    nextjsConfig: "{\n  key: 'Access-Control-Allow-Origin',\n  value: 'https://app.example.com'\n}",
    expressConfig: "res.setHeader('Access-Control-Allow-Origin', 'https://app.example.com');",
    pitfalls: [
      'Browsers reject responses with "*" wildcard if "Access-Control-Allow-Credentials: true" is present.',
      'Never echo back the request "Origin" header blindly without validation.',
    ],
    faqs: [
      {
        question: 'Why does CORS block requests in the browser but works fine in Postman/cURL?',
        answer: 'CORS is a browser security sandbox mechanism. Postman and cURL are terminal utilities that do not enforce the browser Same-Origin Policy.',
      },
    ],
  },
  {
    slug: 'authorization-header',
    name: 'Authorization',
    category: 'Authentication',
    type: 'Request Header',
    owaspRating: 'Essential (A+)',
    recommendedValue: 'Bearer <token> OR Basic <base64-credentials>',
    summary: 'Contains the client credentials used to authenticate a user agent with the server, most commonly holding JWT or OAuth access tokens.',
    syntax: 'Authorization: <type> <credentials>',
    directives: [
      { name: 'Bearer <token>', description: 'Standard OAuth 2.0 and JWT token authentication scheme.' },
      { name: 'Basic <base64>', description: 'HTTP Basic Auth scheme encoding "username:password" in Base64.' },
    ],
    nginxConfig: 'proxy_set_header Authorization $http_authorization;',
    apacheConfig: 'RequestHeader set Authorization ...',
    nextjsConfig: '// Client fetch header:\nfetch(url, {\n  headers: { Authorization: `Bearer ${token}` }\n});',
    expressConfig: "const authHeader = req.headers['authorization'];\nconst token = authHeader && authHeader.split(' ')[1];",
    pitfalls: [
      'Never send Authorization headers over plain HTTP connections, as credentials can be intercepted in plaintext.',
    ],
    faqs: [
      {
        question: 'How do I extract a Bearer token in Express.js?',
        answer: 'Use req.headers.authorization?.split(" ")[1] to isolate the token string from the "Bearer " prefix.',
      },
    ],
  },
  {
    slug: 'set-cookie',
    name: 'Set-Cookie',
    category: 'Transport & Cookie',
    type: 'Response Header',
    owaspRating: 'Essential (A+)',
    recommendedValue: 'session_id=xyz; Secure; HttpOnly; SameSite=Lax; Path=/',
    summary: 'Transfers session cookies from server to client with security flags controlling JavaScript access, cross-site transmission, and SSL encryption.',
    syntax: 'Set-Cookie: <name>=<value>[; <flag>...]',
    directives: [
      { name: 'HttpOnly', description: 'Prevents client-side scripts (document.cookie) from accessing the cookie, blocking XSS session hijacking.' },
      { name: 'Secure', description: 'Forces the cookie to only be transmitted over encrypted HTTPS connections.' },
      { name: 'SameSite=Lax', description: 'Protects against Cross-Site Request Forgery (CSRF) by withholding cookie on cross-site requests.' },
      { name: 'SameSite=Strict', description: 'Maximum CSRF protection: never sends cookie on any third-party link navigation.' },
    ],
    nginxConfig: 'proxy_cookie_flags ~ nosecure samesite=lax httponly;',
    apacheConfig: 'Header edit Set-Cookie ^(.*)$ "$1; HttpOnly; Secure; SameSite=Lax"',
    nextjsConfig: "// Set cookie in Next.js Server Action or API Route:\ncookies().set('session', 'xyz', {\n  httpOnly: true,\n  secure: true,\n  sameSite: 'lax'\n});",
    expressConfig: "res.cookie('sessionId', 'xyz', {\n  httpOnly: true,\n  secure: true,\n  sameSite: 'lax'\n});",
    pitfalls: [
      'Omitting HttpOnly allows any minor XSS vulnerability to compromise the entire user session.',
      'SameSite=None MUST be accompanied by the "Secure" flag, otherwise modern browsers reject the cookie.',
    ],
    faqs: [
      {
        question: 'What happens if a cookie is set without the Secure flag?',
        answer: 'The browser may transmit the session cookie in plaintext if the user accesses an HTTP URL, exposing the session to Wi-Fi eavesdroppers.',
      },
    ],
  },
  {
    slug: 'cross-origin-opener-policy-coop',
    name: 'Cross-Origin-Opener-Policy (COOP)',
    category: 'Security',
    type: 'Response Header',
    owaspRating: 'Highly Recommended',
    recommendedValue: 'same-origin',
    summary: 'Isolates your top-level browsing context from other origins, preventing cross-origin window tampering and Spectre side-channel attacks.',
    syntax: 'Cross-Origin-Opener-Policy: same-origin | same-origin-allow-popups | unsafe-none',
    directives: [
      { name: 'same-origin', description: 'Completely isolates the window context. Cross-origin documents opened in new windows cannot access window.opener.' },
      { name: 'same-origin-allow-popups', description: 'Retains opener references for popups opened by this document.' },
    ],
    nginxConfig: 'add_header Cross-Origin-Opener-Policy "same-origin" always;',
    apacheConfig: 'Header always set Cross-Origin-Opener-Policy "same-origin"',
    nextjsConfig: "{\n  key: 'Cross-Origin-Opener-Policy',\n  value: 'same-origin'\n}",
    expressConfig: "res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');",
    pitfalls: [
      'Required together with Cross-Origin-Embedder-Policy (COEP) to enable SharedArrayBuffer and high-resolution performance timers.',
    ],
    faqs: [
      {
        question: 'Why is COOP important for modern web apps?',
        answer: 'It shields against cross-origin attacks such as XS-Leaks and Spectre by ensuring your web application process is completely isolated in memory.',
      },
    ],
  },
  {
    slug: 'etag-header',
    name: 'ETag (Entity Tag)',
    category: 'Caching',
    type: 'Response Header',
    owaspRating: 'Context-Dependent',
    recommendedValue: 'W/"33a64df551425fcc55e4d42a148795d9f25f89d4"',
    summary: 'Unique hash or identifier for a specific version of a resource, allowing efficient cache revalidation with 304 Not Modified responses.',
    syntax: 'ETag: W/"<hash>" (Weak) OR ETag: "<hash>" (Strong)',
    directives: [
      { name: 'W/ (Weak Validator)', description: 'Indicates the resource is semantically equivalent even if byte-by-byte representations differ slightly.' },
      { name: 'Strong ETag', description: 'Requires strict byte-for-byte identity matching between client and server copies.' },
    ],
    nginxConfig: 'etag on; # Default in modern NGINX versions',
    apacheConfig: 'FileETag MTime Size',
    nextjsConfig: '// Next.js handles ETag generation automatically for SSG and API routes',
    expressConfig: "app.set('etag', 'strong'); // or 'weak'",
    pitfalls: [
      'In multi-server load-balanced environments, ensure all server nodes generate identical ETags for identical content.',
    ],
    faqs: [
      {
        question: 'How does ETag save bandwidth?',
        answer: 'When a cached file expires, the browser sends "If-None-Match: <etag>". If unchanged, the server returns a 304 Not Modified with zero body payload.',
      },
    ],
  },
];

export function getAllHttpHeaders(): HttpHeaderItem[] {
  return HTTP_HEADERS;
}

export function getHttpHeaderBySlug(slug: string): HttpHeaderItem | undefined {
  return HTTP_HEADERS.find((h) => h.slug === slug);
}
