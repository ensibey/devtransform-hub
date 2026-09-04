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
  // 1xx Informational
  {
    code: 100,
    slug: '100-continue',
    name: '100 Continue',
    nameTr: '100 Devam Et',
    category: '1xx',
    categoryName: 'Informational',
    summary: 'The client should continue with its request body. Used with Expect: 100-continue headers.',
    summaryTr: 'İstemci isteğin gövdesini göndermeye devam edebilir.',
    causes: ['Client sent Expect: 100-continue header for large uploads.'],
    fixes: [
      {
        title: 'Server accepts upload',
        description: 'Server verifies headers and prompts client to send payload body.',
      },
    ],
  },
  {
    code: 101,
    slug: '101-switching-protocols',
    name: '101 Switching Protocols',
    nameTr: '101 Protokol Değiştiriliyor',
    category: '1xx',
    categoryName: 'Informational',
    summary: 'The requester has asked the server to switch protocols (e.g. HTTP to WebSocket).',
    summaryTr: 'İstemcinin protokol değiştirme talebi kabul edildi (örn. WebSocket el sıkışması).',
    causes: ['WebSocket Upgrade request sent over HTTP/1.1.'],
    fixes: [
      {
        title: 'WebSocket Handshake',
        description: 'Verify connection headers include Upgrade: websocket.',
      },
    ],
  },

  // 2xx Success
  {
    code: 200,
    slug: '200-ok',
    name: '200 OK',
    nameTr: '200 Tamam / Başarılı',
    category: '2xx',
    categoryName: 'Success',
    summary: 'The standard response for successful HTTP requests. The actual response will depend on the request method used.',
    summaryTr: 'Başarılı HTTP istekleri için standart yanıt kodu.',
    causes: ['The client sent a valid request and the server processed it without errors.'],
    fixes: [
      {
        title: 'Express JSON Response',
        description: 'Return a standard 200 OK response with JSON data.',
        codeSnippet: `res.status(200).json({ status: "success", data: result });`,
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
    summaryTr: 'İstek başarıyla yerine getirildi ve sunucuda yeni bir kaynak oluşturuldu.',
    causes: ['A successful POST request created a new record in the database.'],
    fixes: [
      {
        title: 'Return 201 on Resource Creation',
        description: 'Send back status 201 with created resource.',
        codeSnippet: `res.status(201).location('/items/' + item.id).json(item);`,
      },
    ],
  },
  {
    code: 202,
    slug: '202-accepted',
    name: '202 Accepted',
    nameTr: '202 Kabul Edildi (Kuyrukta)',
    category: '2xx',
    categoryName: 'Success',
    summary: 'The request has been accepted for processing, but the processing has not been completed.',
    summaryTr: 'İstek arka planda işlenmek üzere kabul edildi ve kuyruğa alındı.',
    causes: ['Asynchronous batch job or background queue worker queued the task.'],
    fixes: [
      {
        title: 'Return 202 for Async Jobs',
        description: 'Return job ID and status poll endpoint.',
        codeSnippet: `res.status(202).json({ jobId: "job_99812", status: "queued" });`,
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
    summary: 'The server has successfully fulfilled the request and that there is no additional content to send in the response body.',
    summaryTr: 'Sunucu isteği tamamladı ancak geri dönecek herhangi bir gövde verisi bulunmuyor.',
    causes: ['Successful resource deletion (DELETE) or CORS OPTIONS pre-flight check.'],
    fixes: [
      {
        title: 'Express 204 response',
        description: 'Send status 204 without body content.',
        codeSnippet: `res.status(204).send();`,
      },
    ],
  },
  {
    code: 206,
    slug: '206-partial-content',
    name: '206 Partial Content',
    nameTr: '206 Kısmi İçerik (Streaming)',
    category: '2xx',
    categoryName: 'Success',
    summary: 'The server is delivering only part of the resource due to a Range header sent by the client.',
    summaryTr: 'İstemcinin Range başlığı nedeniyle dosyanın sadece belirli bir bayt aralığı teslim ediliyor.',
    causes: ['Video streaming or resume download requests with Range headers.'],
    fixes: [
      {
        title: 'HTTP Range Stream',
        description: 'Set Content-Range header: bytes 0-1023/2048.',
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
    summaryTr: 'Talep edilen sayfa kalıcı olarak yeni bir URL adresine taşındı.',
    causes: ['Site migration, domain change, HTTP to HTTPS redirect, URL restructuring.'],
    fixes: [
      {
        title: 'Nginx 301 Permanent Redirect',
        description: 'Add a 301 redirect block in nginx.conf.',
        codeSnippet: `return 301 https://example.com$request_uri;`,
      },
    ],
  },
  {
    code: 302,
    slug: '302-found',
    name: '302 Found (Temporary Redirect)',
    nameTr: '302 Geçici Yönlendirme',
    category: '3xx',
    categoryName: 'Redirection',
    summary: 'Tells the client to look at (browse to) another URL temporarily.',
    summaryTr: 'Kaynak geçici olarak farklı bir URL adresinde bulunmaktadır.',
    causes: ['Temporary maintenance redirect, A/B test routing, auth login flow.'],
    fixes: [
      {
        title: 'Express 302 Redirect',
        description: 'Redirect user temporarily to login page.',
        codeSnippet: `res.redirect(302, '/login');`,
      },
    ],
  },
  {
    code: 304,
    slug: '304-not-modified',
    name: '304 Not Modified',
    nameTr: '304 Değiştirilmedi (Önbellek)',
    category: '3xx',
    categoryName: 'Redirection',
    summary: 'Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match.',
    summaryTr: 'İstenen kaynak tarayıcının önbelleğindeki sürümden bu yana değişmedi.',
    causes: ['Browser sends ETag or If-Modified-Since and server verifies content is unchanged.'],
    fixes: [
      {
        title: 'ETag Cache Hit',
        description: 'Return empty body with 304 status to save bandwidth.',
      },
    ],
  },
  {
    code: 307,
    slug: '307-temporary-redirect',
    name: '307 Temporary Redirect',
    nameTr: '307 Geçici Yönlendirme (Metodu Koru)',
    category: '3xx',
    categoryName: 'Redirection',
    summary: 'In contrast to 302, the request method (POST, GET) is not allowed to be changed when redirecting.',
    summaryTr: '302 yönlendirmesinin aksine, POST isteği GET metoduna dönüştürülmez.',
    causes: ['Redirecting form submission to confirmation page while preserving POST method.'],
    fixes: [
      {
        title: 'Preserve Method Redirect',
        description: 'Send 307 status with Location header.',
      },
    ],
  },
  {
    code: 308,
    slug: '308-permanent-redirect',
    name: '308 Permanent Redirect',
    nameTr: '308 Kalıcı Yönlendirme (Metodu Koru)',
    category: '3xx',
    categoryName: 'Redirection',
    summary: 'This and all future requests should be directed to the given URI, and the request method MUST not change.',
    summaryTr: 'Kalıcı yönlendirme ve istek metodu (POST/PUT/DELETE) değiştirilmeden korunur.',
    causes: ['API endpoint permanent migration preserving HTTP method payload.'],
    fixes: [
      {
        title: 'FastAPI Permanent Redirect',
        description: 'Return 308 status code on moved API routes.',
      },
    ],
  },

  // 4xx Client Errors
  {
    code: 400,
    slug: '400-bad-request',
    name: '400 Bad Request',
    nameTr: '400 Hatalı İstek',
    category: '4xx',
    categoryName: 'Client Error',
    summary: 'The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, invalid request message framing).',
    summaryTr: 'Sunucu, istemci tarafındaki sözdizimi veya veri hatası nedeniyle isteği işleyemedi.',
    causes: ['Malformed JSON body, missing required fields, invalid query parameters.'],
    fixes: [
      {
        title: 'Validate Request Schema',
        description: 'Use Zod or Joi to validate incoming payload.',
        codeSnippet: `const result = userSchema.safeParse(req.body);\nif (!result.success) return res.status(400).json(result.error);`,
      },
    ],
  },
  {
    code: 401,
    slug: '401-unauthorized',
    name: '401 Unauthorized',
    nameTr: '401 Yetkisiz (Giriş Gerekli)',
    category: '4xx',
    categoryName: 'Client Error',
    summary: 'Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.',
    summaryTr: 'Kaynağa erişmek için geçerli bir kimlik doğrulama belirteci (token/şifre) gereklidir.',
    causes: ['Missing Authorization header, expired JWT token, invalid API key.'],
    fixes: [
      {
        title: 'Check Bearer Token',
        description: 'Ensure client sends Authorization: Bearer <token>.',
        codeSnippet: `if (!authHeader) return res.status(401).json({ error: "Missing Bearer token" });`,
      },
    ],
  },
  {
    code: 403,
    slug: '403-forbidden',
    name: '403 Forbidden',
    nameTr: '403 Erişim Yasak',
    category: '4xx',
    categoryName: 'Client Error',
    summary: 'The request contained valid data and was understood by the server, but the server is refusing action.',
    summaryTr: 'Kimlik doğrulandı ancak kullanıcının bu kaynağa erişim yetkisi (RBAC) bulunmuyor.',
    causes: ['Insufficient user role (e.g. non-admin accessing admin panel), IP blacklist, directory browsing disabled.'],
    fixes: [
      {
        title: 'Verify User Permissions',
        description: 'Check if user has required scope or role before executing action.',
        codeSnippet: `if (user.role !== 'admin') return res.status(403).json({ error: "Admin role required" });`,
      },
    ],
  },
  {
    code: 404,
    slug: '404-not-found',
    name: '404 Not Found',
    nameTr: '404 Bulunamadı',
    category: '4xx',
    categoryName: 'Client Error',
    summary: 'The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible.',
    summaryTr: 'Talep edilen URL veya veritabanı kaydı sunucuda bulunamadı.',
    causes: ['Broken link, mistyped URL, deleted resource from database.'],
    fixes: [
      {
        title: 'Handle 404 in Route Handler',
        description: 'Return 404 when resource ID does not exist in DB.',
        codeSnippet: `if (!user) return res.status(404).json({ error: "User not found" });`,
      },
    ],
  },
  {
    code: 405,
    slug: '405-method-not-allowed',
    name: '405 Method Not Allowed',
    nameTr: '405 Metoda İzin Verilmiyor',
    category: '4xx',
    categoryName: 'Client Error',
    summary: 'A request method is not supported for the requested resource (e.g. GET on an endpoint that only accepts POST).',
    summaryTr: 'İlgili uç nokta kullanılan HTTP metodunu (POST, GET, PUT) desteklemiyor.',
    causes: ['Sending GET to a POST-only API endpoint.'],
    fixes: [
      {
        title: 'Include Allow Header',
        description: 'Server must send Allow: POST, PUT header with 405 status.',
      },
    ],
  },
  {
    code: 408,
    slug: '408-request-timeout',
    name: '408 Request Timeout',
    nameTr: '408 İstek Zaman Aşımı',
    category: '4xx',
    categoryName: 'Client Error',
    summary: 'The server timed out waiting for the request from client.',
    summaryTr: 'Sunucu, istemcinin isteği tamamlamasını beklerken zaman aşımına uğradı.',
    causes: ['Slow network connection, interrupted client upload.'],
    fixes: [
      {
        title: 'Retry Request',
        description: 'Client can resend request with exponential backoff.',
      },
    ],
  },
  {
    code: 409,
    slug: '409-conflict',
    name: '409 Conflict',
    nameTr: '409 Çakışma',
    category: '4xx',
    categoryName: 'Client Error',
    summary: 'Indicates that the request could not be processed because of conflict in the current state of the resource, such as an edit conflict between multiple concurrent updates.',
    summaryTr: 'Kaynak durumunda çakışma oluştu (örn. veritabanında zaten kayıtlı benzersiz e-posta).',
    causes: ['Unique constraint violation (duplicate username/email), git merge conflict.'],
    fixes: [
      {
        title: 'Handle Duplicate Key Error',
        description: 'Catch unique constraint error and return 409 with explanatory message.',
      },
    ],
  },
  {
    code: 410,
    slug: '410-gone',
    name: '410 Gone',
    nameTr: '410 Kalıcı Olarak Kaldırıldı',
    category: '4xx',
    categoryName: 'Client Error',
    summary: 'Indicates that the resource requested is no longer available and will not be available again.',
    summaryTr: 'Talep edilen sayfa veya API kalıcı olarak silindi ve geri gelmeyecektir.',
    causes: ['Intentionally deleted product, deprecated v1 API endpoint.'],
    fixes: [
      {
        title: 'De-index from Search Engines',
        description: 'Return 410 so Google drops page from search index immediately.',
      },
    ],
  },
  {
    code: 413,
    slug: '413-payload-too-large',
    name: '413 Payload Too Large',
    nameTr: '413 İstek Boyutu Çok Büyük',
    category: '4xx',
    categoryName: 'Client Error',
    summary: 'The request is larger than the server is willing or able to process.',
    summaryTr: 'Yüklenen dosya veya JSON gövdesi sunucunun izin verdiği azami boyutu aşıyor.',
    causes: ['Uploading file larger than Nginx client_max_body_size or body-parser limit.'],
    fixes: [
      {
        title: 'Increase Nginx Body Size',
        description: 'Set client_max_body_size 50M in nginx.conf.',
        codeSnippet: `client_max_body_size 50M;`,
      },
    ],
  },
  {
    code: 415,
    slug: '415-unsupported-media-type',
    name: '415 Unsupported Media Type',
    nameTr: '415 Desteklenmeyen Medya Türü',
    category: '4xx',
    categoryName: 'Client Error',
    summary: 'The request entity has a media type which the server or resource does not support.',
    summaryTr: 'İsteğin Content-Type başlığı sunucu tarafından desteklenmiyor.',
    causes: ['Sending XML or text/plain to an endpoint expecting Content-Type: application/json.'],
    fixes: [
      {
        title: 'Set Content-Type Header',
        description: 'Set headers: { "Content-Type": "application/json" } in client fetch.',
      },
    ],
  },
  {
    code: 418,
    slug: '418-im-a-teapot',
    name: '418 I\'m a Teapot',
    nameTr: '418 Ben Bir Çaydanlığım (HTCPCP)',
    category: '4xx',
    categoryName: 'Client Error',
    summary: 'Defined in 1998 as an IETF April Fools\' joke in RFC 2324 (Hyper Text Coffee Pot Control Protocol). Returned by teapots requested to brew coffee.',
    summaryTr: '1998 yılında 1 Nisan şakası olarak RFC 2324 protokolünde tanımlanmış kült HTTP durum kodu.',
    causes: ['Easter egg implementations or WAF bot blocking challenge response.'],
    fixes: [
      {
        title: 'Easter Egg Implementation',
        description: 'Used by APIs as a playful Easter egg response.',
        codeSnippet: `res.status(418).send("Short and stout!");`,
      },
    ],
  },
  {
    code: 422,
    slug: '422-unprocessable-entity',
    name: '422 Unprocessable Entity',
    nameTr: '422 İşlenemeyen Varlık (Validasyon)',
    category: '4xx',
    categoryName: 'Client Error',
    summary: 'The request was well-formed but was unable to be followed due to semantic errors.',
    summaryTr: 'Sözdizimi doğru ancak semantik doğrulama kurallarına uymayan veri (FastAPI/Rails validasyon hatası).',
    causes: ['Form validation failed (e.g. email format invalid, age negative).'],
    fixes: [
      {
        title: 'Return Validation Error Map',
        description: 'Send back field-level error messages to help user correct input.',
        codeSnippet: `res.status(422).json({ errors: { email: "Invalid email domain" } });`,
      },
    ],
  },
  {
    code: 429,
    slug: '429-too-many-requests',
    name: '429 Too Many Requests',
    nameTr: '429 Çok Fazla İstek (Rate Limit)',
    category: '4xx',
    categoryName: 'Client Error',
    summary: 'The user has sent too many requests in a given amount of time ("rate limiting").',
    summaryTr: 'İstemci belirlenen zaman aralığında izin verilen istek limitini aştı.',
    causes: ['API rate limiter triggered, bot scraping prevention, DDoS mitigation.'],
    fixes: [
      {
        title: 'Include Retry-After Header',
        description: 'Inform client when they can retry requests.',
        codeSnippet: `res.set('Retry-After', '60');\nres.status(429).json({ error: "Rate limit exceeded. Try again in 60s." });`,
      },
    ],
  },

  // 5xx Server Errors
  {
    code: 500,
    slug: '500-internal-server-error',
    name: '500 Internal Server Error',
    nameTr: '500 Sunucu Hatası',
    category: '5xx',
    categoryName: 'Server Error',
    summary: 'A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.',
    summaryTr: 'Sunucuda beklenmeyen bir istisna (unhandled exception) meydana geldi.',
    causes: ['Unhandled exception in backend code, database connection drop, null pointer error.'],
    fixes: [
      {
        title: 'Global Error Middleware',
        description: 'Catch unhandled exceptions and log stack traces in Sentry.',
        codeSnippet: `app.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).json({ error: "Internal Server Error" });\n});`,
      },
    ],
  },
  {
    code: 501,
    slug: '501-not-implemented',
    name: '501 Not Implemented',
    nameTr: '501 Uygulanmadı',
    category: '5xx',
    categoryName: 'Server Error',
    summary: 'The server either does not recognize the request method, or it lacks the ability to fulfill the request.',
    summaryTr: 'Sunucu talep edilen metodu destekleyecek altyapıya henüz sahip değil.',
    causes: ['Unimplemented HTTP method or API stub endpoint in development.'],
    fixes: [
      {
        title: 'Implement API Method',
        description: 'Provide handler or route for requested HTTP method.',
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
    summaryTr: 'Ters proxy (Nginx, Cloudflare), arka plandaki uygulama sunucusundan geçersiz yanıt aldı.',
    causes: [
      'Backend Node.js / Python PM2 process crashed or is down.',
      'Nginx proxy_pass pointing to wrong internal port.',
      'Upstream server ran out of memory (OOM killed).',
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
    summaryTr: 'Sunucu geçici olarak aşırı yük altında veya bakım modundadır.',
    causes: ['Server CPU or RAM at 100% capacity, database maintenance in progress.'],
    fixes: [
      {
        title: 'Enable Cloudflare Under Attack Mode or Scale Instances',
        description: 'Scale CPU/RAM or distribute load across multiple servers.',
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
    summary: 'The server, while acting as a gateway or proxy, did not receive a timely response from an upstream server.',
    summaryTr: 'Nginx veya Cloudflare proxy, arka plandaki sunucudan zamanında yanıt alamadı.',
    causes: ['Slow database query running longer than proxy_read_timeout (usually 60s).'],
    fixes: [
      {
        title: 'Increase Nginx Proxy Timeout',
        description: 'Adjust timeout settings in nginx.conf for long-running endpoints.',
        codeSnippet: `proxy_read_timeout 300;\nproxy_connect_timeout 300;`,
      },
    ],
  },
  {
    code: 406,
    slug: '406-not-acceptable',
    name: '406 Not Acceptable',
    nameTr: '406 Kabul Edilemez',
    category: '4xx',
    categoryName: 'Client Error',
    summary: 'The target resource does not have a current representation that would be acceptable to the user agent according to the proactive negotiation headers (Accept, Accept-Charset, Accept-Encoding, Accept-Language).',
    summaryTr: 'Sunucu, istemcinin Accept başlığında talep ettiği içerik türünü (MIME type) üretemiyor.',
    causes: ['Client requested format not produced by server (e.g. Accept: application/xml when API only serves application/json).'],
    fixes: [
      {
        title: 'Check Accept Headers',
        description: 'Ensure client Accept header matches server supported MIME types.',
        codeSnippet: `curl -H "Accept: application/json" https://api.example.com/data`,
      },
    ],
  },
  {
    code: 451,
    slug: '451-unavailable-for-legal-reasons',
    name: '451 Unavailable For Legal Reasons',
    nameTr: '451 Yasal Nedenlerle Kullanılamıyor',
    category: '4xx',
    categoryName: 'Client Error',
    summary: 'Access to the resource is blocked as a consequence of legal demands, such as government censorship or court injunctions (RFC 7725).',
    summaryTr: 'İçerik mahkeme kararı, telif hakkı veya yasal sansür nedeniyle erişime engellenmiştir.',
    causes: ['Court order, DMCA takedown notice, or national ISP blocking.'],
    fixes: [
      {
        title: 'Verify Legal Injunction Details',
        description: 'Inspect the response body for a link to the legal order or contact the website operator.',
      },
    ],
  },
  {
    code: 505,
    slug: '505-http-version-not-supported',
    name: '505 HTTP Version Not Supported',
    nameTr: '505 HTTP Sürümü Desteklenmiyor',
    category: '5xx',
    categoryName: 'Server Error',
    summary: 'The server does not support, or refuses to support, the major version of HTTP that was used in the request message.',
    summaryTr: 'Sunucu, istemcinin kullandığı HTTP protokol sürümünü (örn. HTTP/3 veya HTTP/0.9) desteklemiyor.',
    causes: ['Outdated HTTP client library or misconfigured HTTP/2 / HTTP/3 negotiation.'],
    fixes: [
      {
        title: 'Downgrade or Align HTTP Protocol',
        description: 'Configure client or reverse proxy to use HTTP/1.1 or HTTP/2.',
        codeSnippet: `curl --http1.1 https://api.example.com`,
      },
    ],
  },
  {
    code: 507,
    slug: '507-insufficient-storage',
    name: '507 Insufficient Storage',
    nameTr: '507 Yetersiz Depolama Alanı',
    category: '5xx',
    categoryName: 'Server Error',
    summary: 'The method could not be performed on the resource because the server is unable to store the representation needed to successfully complete the request (WebDAV).',
    summaryTr: 'Sunucu diski doldu veya depolama kotası aşıldı, istek kaydedilemiyor.',
    causes: ['Server hard drive disk usage at 100%, inode exhaustion, or storage quota exceeded.'],
    fixes: [
      {
        title: 'Check and Free Disk Space',
        description: 'Clean up old log files, docker images, and temporary directories.',
        codeSnippet: `df -h\ndocker system prune -a\njournalctl --vacuum-time=2d`,
      },
    ],
  },
  {
    code: 508,
    slug: '508-loop-detected',
    name: '508 Loop Detected',
    nameTr: '508 Sonsuz Döngü Algılandı',
    category: '5xx',
    categoryName: 'Server Error',
    summary: 'The server terminated an operation because it encountered an infinite loop while processing a request with Depth: infinity (WebDAV).',
    summaryTr: 'Sunucu, isteği işlerken sonsuz döngü tespit etti ve işlemi sonlandırdı.',
    causes: ['Cyclic redirection rules, recursive WebDAV binding, or looping proxy configurations.'],
    fixes: [
      {
        title: 'Inspect Redirect Chains & Proxy Loops',
        description: 'Audit Nginx rewrite directives and symlinks to prevent circular self-referencing requests.',
      },
    ],
  },
  {
    code: 426,
    slug: '426-upgrade-required',
    name: '426 Upgrade Required',
    nameTr: '426 Protokol Yükseltmesi Gerekli',
    category: '4xx',
    categoryName: 'Client Error',
    summary: 'The client should switch to a different protocol such as TLS/1.3 or WebSocket specified in the Upgrade header.',
    summaryTr: 'İstemcinin Upgrade başlığında belirtilen protokole (ör. WebSocket veya TLS) geçmesi zorunludur.',
    causes: ['Connecting with plaintext HTTP to an endpoint requiring modern TLS or WebSocket handshake.'],
    fixes: [
      {
        title: 'Send Upgrade Header',
        description: 'Ensure client sends Upgrade: websocket and Connection: Upgrade headers during handshake.',
      },
    ],
  },
  {
    code: 428,
    slug: '428-precondition-required',
    name: '428 Precondition Required',
    nameTr: '428 Ön Koşul Başlığı Gerekli (If-Match)',
    category: '4xx',
    categoryName: 'Client Error',
    summary: 'The origin server requires the request to be conditional to prevent the "lost update" problem where multiple clients modify a resource simultaneously.',
    summaryTr: 'Kaynakta çakışmaları ve eşzamanlı üzerine yazmaları önlemek için sunucu If-Match veya If-Unmodified-Since başlığı talep ediyor.',
    causes: ['PUT or PATCH request sent without an ETag-based If-Match header.'],
    fixes: [
      {
        title: 'Include If-Match Header',
        description: 'Fetch the latest ETag via GET first, then provide If-Match: "etag_value" in your mutation.',
      },
    ],
  },
  {
    code: 511,
    slug: '511-network-authentication-required',
    name: '511 Network Authentication Required',
    nameTr: '511 Ağ Kimlik Doğrulaması Gerekli (Captive Portal)',
    category: '5xx',
    categoryName: 'Server Error',
    summary: 'Indicates that the client needs to authenticate to gain network access, such as logging into a Wi-Fi captive portal.',
    summaryTr: 'Ağ erişimi kazanmak için kullanıcının bir captive portal (ör. otel veya havaalanı Wi-Fi giriş ekranı) üzerinden oturum açması gerektiğini belirtir.',
    causes: ['Intercepting proxy or captive portal preventing internet access until terms or credentials are submitted.'],
    fixes: [
      {
        title: 'Log In via Captive Portal',
        description: 'Navigate browser to default gateway or captive portal login URL to authenticate connection.',
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
