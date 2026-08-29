export interface HttpStatusInfo {
  code: number;
  slug: string;
  name: string;
  nameTr: string;
  category: '1xx' | '2xx' | '3xx' | '4xx' | '5xx';
  categoryName: string;
  summary: string;
  summaryTr: string;
  causes: string[];
  fixes: {
    title: string;
    description: string;
    codeSnippet?: string;
  }[];
}

export const HTTP_STATUSES: HttpStatusInfo[] = [
  // 2xx Success
  {
    code: 200,
    slug: '200-ok',
    name: '200 OK',
    nameTr: '200 Tamam / Başarılı',
    category: '2xx',
    categoryName: 'Success',
    summary: 'The standard response for successful HTTP requests. The actual response will depend on the request method used.',
    summaryTr: 'Başarılı HTTP istekleri için standart yanıt kodu. Sunucu isteği başarıyla aldı, anladı ve yanıtladı.',
    causes: ['The client sent a valid request and the server processed it without errors.'],
    fixes: [
      {
        title: 'Node.js Express Response',
        description: 'Return a standard 200 OK response with JSON data.',
        codeSnippet: `res.status(200).json({ status: "success", data: result });`,
      },
      {
        title: 'Python FastAPI Response',
        description: 'FastAPI returns 200 OK by default on endpoint functions.',
        codeSnippet: `@app.get("/items")\ndef get_items():\n    return {"items": []}`,
      },
    ],
  },
  {
    code: 201,
    slug: '201-created',
    name: '201 Created',
    nameTr: '201 Oluşturuldu',
    category: '2xx',
    categoryName: 'Success',
    summary: 'The request has been fulfilled and has resulted in one or more new resources being created on the server.',
    summaryTr: 'İstek başarıyla yerine getirildi ve sunucuda bir veya daha fazla yeni kaynak oluşturuldu (POST istekleri).',
    causes: ['A successful POST request created a new record in the database.'],
    fixes: [
      {
        title: 'Return 201 on Resource Creation',
        description: 'Send back status 201 along with the created resource and Location header.',
        codeSnippet: `res.status(201).location('/users/' + user.id).json(user);`,
      },
    ],
  },
  {
    code: 204,
    slug: '204-no-content',
    name: '204 No Content',
    nameTr: '204 İçerik Yok',
    category: '2xx',
    categoryName: 'Success',
    summary: 'The server has successfully fulfilled the request and that there is no additional content to send in the response payload body.',
    summaryTr: 'Sunucu isteği başarıyla tamamladı ancak geri dönecek herhangi bir gövde verisi (payload) bulunmuyor (DELETE istekleri).',
    causes: ['Successful resource deletion or OPTIONS pre-flight checks.'],
    fixes: [
      {
        title: 'Express 204 response',
        description: 'Send status 204 without body content.',
        codeSnippet: `res.status(204).send();`,
      },
    ],
  },

  // 3xx Redirection
  {
    code: 301,
    slug: '301-moved-permanently',
    name: '301 Moved Permanently',
    nameTr: '301 Kalıcı Olarak Taşındı',
    category: '3xx',
    categoryName: 'Redirection',
    summary: 'This and all future requests should be directed to the given URI in the Location header.',
    summaryTr: 'Talep edilen sayfa veya kaynak kalıcı olarak yeni bir URL adresine taşındı. SEO PageRank aktarımı sağlar.',
    causes: ['Site migration, domain change, HTTP to HTTPS redirect, URL restructuring.'],
    fixes: [
      {
        title: 'Nginx 301 Permanent Redirect',
        description: 'Add a 301 redirect block in nginx.conf.',
        codeSnippet: `server {\n    listen 80;\n    server_name oldsite.com;\n    return 301 https://newsite.com$request_uri;\n}`,
      },
    ],
  },
  {
    code: 302,
    slug: '302-found',
    name: '302 Found (Temporary Redirect)',
    nameTr: '302 Geçici Olarak Taşındı',
    category: '3xx',
    categoryName: 'Redirection',
    summary: 'Tells the client to look at (browse to) another URL temporarily.',
    summaryTr: 'Kaynağın geçici olarak farklı bir URL adresinde bulunduğunu belirtir. Arama motorları eski URL’i dizinde tutmaya devam eder.',
    causes: ['Temporary maintenance pages, A/B testing, authentication redirect flows.'],
    fixes: [
      {
        title: 'Express 302 Redirect',
        description: 'Redirect user temporarily to login page.',
        codeSnippet: `res.redirect('/login');`,
      },
    ],
  },

  // 4xx Client Errors
  {
    code: 400,
    slug: '400-bad-request',
    name: '400 Bad Request',
    nameTr: '400 Geçersiz İstek',
    category: '4xx',
    categoryName: 'Client Error',
    summary: 'The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, size too large, invalid request message framing).',
    summaryTr: 'Sunucu, istemciden gelen isteği hatalı sözdizimi, eksik parametreler veya geçersiz JSON gövdesi nedeniyle işleyemedi.',
    causes: [
      'Malformed JSON body payload syntax (e.g., unescaped quotes, trailing commas).',
      'Missing required query parameters or header values.',
      'Request header or cookie size exceeded server limit.',
    ],
    fixes: [
      {
        title: 'Validate Request Schema with Zod / Joi',
        description: 'Ensure incoming request body conforms to expected types before processing.',
        codeSnippet: `const result = userSchema.safeParse(req.body);\nif (!result.success) {\n  return res.status(400).json({ errors: result.error.errors });\n}`,
      },
    ],
  },
  {
    code: 401,
    slug: '401-unauthorized',
    name: '401 Unauthorized',
    nameTr: '401 Yetkisiz Erişim',
    category: '4xx',
    categoryName: 'Client Error',
    summary: 'Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.',
    summaryTr: 'İstenen kaynağa erişmek için geçerli bir kimlik doğrulaması (Bearer Token, API Key, Cookie) gereklidir.',
    causes: [
      'Missing Authorization header in HTTP request.',
      'Expired or invalid JWT (JSON Web Token).',
      'Incorrect API key or credentials provided.',
    ],
    fixes: [
      {
        title: 'Check and Attach Bearer Token',
        description: 'Ensure authorization header is set in fetch or axios client requests.',
        codeSnippet: `fetch('/api/protected', {\n  headers: {\n    'Authorization': 'Bearer ' + userToken\n  }\n});`,
      },
    ],
  },
  {
    code: 403,
    slug: '403-forbidden',
    name: '403 Forbidden',
    nameTr: '403 Erişim Yasak / İzin Yok',
    category: '4xx',
    categoryName: 'Client Error',
    summary: 'The request was valid, but the server is refusing action. The user might not have the necessary permissions for a resource.',
    summaryTr: 'Kimlik doğrulandı ancak kullanıcının bu kaynağı görüntülemek veya düzenlemek için gerekli rol/izin yetkisi yok.',
    causes: [
      'Insufficient user role permissions (e.g., regular user trying to access admin panel).',
      'IP restriction or Cloudflare WAF block rule triggered.',
      'CORS policy blocking origin request.',
    ],
    fixes: [
      {
        title: 'Check User Roles (RBAC)',
        description: 'Verify if authenticated user has required role permissions.',
        codeSnippet: `if (user.role !== 'ADMIN') {\n  return res.status(403).json({ error: 'Access denied: Admin role required' });\n}`,
      },
    ],
  },
  {
    code: 404,
    slug: '404-not-found',
    name: '404 Not Found',
    nameTr: '404 Sayfa veya Kaynak Bulunamadı',
    category: '4xx',
    categoryName: 'Client Error',
    summary: 'The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.',
    summaryTr: 'İstenen URL adresi veya veritabanı kaydı sunucuda bulunamadı. Bağlantı silinmiş veya yanlış yazılmış olabilir.',
    causes: [
      'Broken hyperlink or typo in requested URL path.',
      'Deleted database record or removed page route.',
      'Missing routing configuration in SPA or Next.js App Router.',
    ],
    fixes: [
      {
        title: 'Implement 404 Fallback in Express',
        description: 'Catch unhandled routes and return structured 404 error.',
        codeSnippet: `app.use((req, res) => {\n  res.status(404).json({ error: 'Endpoint not found' });\n});`,
      },
    ],
  },
  {
    code: 429,
    slug: '429-too-many-requests',
    name: '429 Too Many Requests',
    nameTr: '429 Çok Fazla İstek (Rate Limit Aşıldı)',
    category: '4xx',
    categoryName: 'Client Error',
    summary: 'The user has sent too many requests in a given amount of time (rate limiting).',
    summaryTr: 'Kullanıcı veya bot belirli bir zaman diliminde izin verilen istek sınırını (Rate Limit) aştı.',
    causes: [
      'Sending too many automated API requests without backoff.',
      'Hitting public API rate limits (e.g., OpenAI, Twitter, GitHub APIs).',
    ],
    fixes: [
      {
        title: 'Implement Exponential Backoff Retry',
        description: 'Wait for Retry-After header duration before sending next request.',
        codeSnippet: `async function fetchWithRetry(url, delay = 1000) {\n  const res = await fetch(url);\n  if (res.status === 429) {\n    await new Promise(r => setTimeout(r, delay * 2));\n    return fetchWithRetry(url, delay * 2);\n  }\n  return res.json();\n}`,
      },
    ],
  },

  // 5xx Server Errors
  {
    code: 500,
    slug: '500-internal-server-error',
    name: '500 Internal Server Error',
    nameTr: '500 Sunucu İçi Hata',
    category: '5xx',
    categoryName: 'Server Error',
    summary: 'A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.',
    summaryTr: 'Sunucu tarafında işlenmeyen bir istisna (exception), veritabanı bağlantı kopması veya kod çökmesi meydana geldi.',
    causes: [
      'Unhandled runtime exceptions (e.g., TypeError: Cannot read properties of undefined).',
      'Database connection timeout or pool exhaustion.',
      'Missing environment variables on production server.',
    ],
    fixes: [
      {
        title: 'Add Global Error Handler in Express',
        description: 'Catch unexpected exceptions and log stack traces safely.',
        codeSnippet: `app.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).json({ error: 'Internal Server Error' });\n});`,
      },
    ],
  },
  {
    code: 502,
    slug: '502-bad-gateway',
    name: '502 Bad Gateway',
    nameTr: '502 Hatalı Ağ Geçidi',
    category: '5xx',
    categoryName: 'Server Error',
    summary: 'The server, while acting as a gateway or proxy, received an invalid response from the inbound server it accessed.',
    summaryTr: 'Ters proxy (Nginx, Cloudflare, AWS ALB), arkasındaki uygulama sunucusundan (Node.js, Python, PHP-FPM) geçersiz veya boş yanıt aldı.',
    causes: [
      'Backend Node.js / Python PM2 process crashed or is not running on port.',
      'Nginx proxy_pass pointing to wrong internal port or IP address.',
      'Upstream server out of memory (OOM killed).',
    ],
    fixes: [
      {
        title: 'Check PM2 or Systemd Backend Service',
        description: 'Verify if backend application process is running.',
        codeSnippet: `pm2 status\npm2 logs backend\nsystemctl status nginx`,
      },
    ],
  },
  {
    code: 503,
    slug: '503-service-unavailable',
    name: '503 Service Unavailable',
    nameTr: '503 Hizmet Kullanılamıyor / Bakım',
    category: '5xx',
    categoryName: 'Server Error',
    summary: 'The server cannot handle the request (because it is overloaded or down for maintenance). Generally, this is a temporary state.',
    summaryTr: 'Sunucu geçici olarak aşırı yük altında veya bakım modunda olduğu için isteği işleyemiyor.',
    causes: [
      'Server CPU or RAM at 100% capacity.',
      'Scheduled maintenance or database upgrade in progress.',
    ],
    fixes: [
      {
        title: 'Scale Server Resources or Enable CDN Caching',
        description: 'Distribute traffic across multiple instances with load balancing.',
      },
    ],
  },
  {
    code: 504,
    slug: '504-gateway-timeout',
    name: '504 Gateway Timeout',
    nameTr: '504 Ağ Geçidi Zaman Aşımı',
    category: '5xx',
    categoryName: 'Server Error',
    summary: 'The server, while acting as a gateway or proxy, did not receive a timely response from an upstream server it needed for the request to be complete.',
    summaryTr: 'Proxy veya Nginx sunucusu, arka plandaki uygulama sunucusunun yanıt vermesini beklerken belirlenen zaman aşımı süresine (timeout) ulaştı.',
    causes: [
      'Slow database query running longer than Nginx proxy_read_timeout (usually 60s).',
      'Calling slow external third-party API in blocking synchronous manner.',
    ],
    fixes: [
      {
        title: 'Increase Nginx Proxy Timeout',
        description: 'Adjust timeout settings in nginx.conf for long-running endpoints.',
        codeSnippet: `location /api/ {\n    proxy_read_timeout 300;\n    proxy_connect_timeout 300;\n    proxy_send_timeout 300;\n}`,
      },
    ],
  },
];

export function getAllHttpStatuses(): HttpStatusInfo[] {
  return HTTP_STATUSES;
}

export function getHttpStatusBySlug(slug: string): HttpStatusInfo | undefined {
  return HTTP_STATUSES.find((s) => s.slug === slug || `${s.code}` === slug);
}
