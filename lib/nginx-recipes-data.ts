export interface NginxRecipe {
  slug: string;
  title: string;
  shortTitle: string;
  category: 'Reverse Proxy & APIs' | 'Security & SSL' | 'Frontend & SPAs' | 'Performance & Caching' | 'Traffic & Redirects';
  description: string;
  summary: string;
  configFileName: string;
  configContent: string;
  directivesExplained: { directive: string; description: string }[];
  verificationCommands: { command: string; explanation: string }[];
  troubleshootingTips: string[];
  faqs: { question: string; answer: string }[];
}

export const NGINX_RECIPES: NginxRecipe[] = [
  {
    slug: 'nginx-reverse-proxy-nodejs-fastapi',
    title: 'How to Configure Nginx Reverse Proxy for Node.js, FastAPI & Go',
    shortTitle: 'Reverse Proxy Setup',
    category: 'Reverse Proxy & APIs',
    summary: 'Forward incoming public HTTP requests to internal application servers (Node.js, Express, Python FastAPI, Go, Docker) with real client IP headers.',
    description: 'A reverse proxy sits between the public internet and backend application runtimes. It handles SSL termination, load balancing, security buffering, and forwards traffic to ports like 3000, 8000, or 8080 while preserving client headers.',
    configFileName: 'app.example.com.conf',
    configContent: `server {
    listen 80;
    server_name api.example.com;

    # Redirect plain HTTP to HTTPS (optional but recommended)
    # return 301 https://$host$request_uri;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        # Header forwarding for real client IP & SSL detection
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";

        # Timeouts and buffers
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        proxy_buffering on;
        proxy_buffer_size 16k;
        proxy_buffers 4 32k;
    }
}`,
    directivesExplained: [
      { directive: 'proxy_pass http://127.0.0.1:3000;', description: 'Points to the internal host and port where your upstream web application daemon is running.' },
      { directive: 'proxy_set_header Host $host;', description: 'Preserves the original Host header submitted by the client browser so virtual hosts and redirects work.' },
      { directive: 'proxy_set_header X-Real-IP $remote_addr;', description: 'Passes the real client IP address to the backend instead of the loopback 127.0.0.1 IP.' },
      { directive: 'proxy_set_header X-Forwarded-Proto $scheme;', description: 'Informs the backend whether the initial request arrived over http or https.' }
    ],
    verificationCommands: [
      { command: 'sudo nginx -t', explanation: 'Test Nginx configuration files for syntax errors before reloading' },
      { command: 'sudo systemctl reload nginx', explanation: 'Gracefully reload Nginx without dropping active client connections' },
      { command: 'curl -I http://api.example.com', explanation: 'Verify HTTP status and response headers returned by the reverse proxy' }
    ],
    troubleshootingTips: [
      'If you see "502 Bad Gateway", your backend application is not running or not listening on 127.0.0.1:3000.',
      'Ensure SELinux or firewalls do not block Nginx from connecting to network sockets: sudo setsebool -P httpd_can_network_connect 1 on CentOS/RHEL.',
      'Check error logs located in /var/log/nginx/error.log for detailed connection refused diagnostics.'
    ],
    faqs: [
      { question: 'Why use Nginx in front of Node.js or FastAPI?', answer: 'Nginx handles slow clients, TLS/SSL handshake encryption, DDoS rate limiting, and static file caching far more efficiently than single-threaded runtime engines.' },
      { question: 'What is the difference between proxy_pass with trailing slash and without?', answer: 'With trailing slash (proxy_pass http://127.0.0.1:3000/), Nginx strips the matched location prefix URI before passing to backend. Without trailing slash, the full URI is preserved.' }
    ]
  },
  {
    slug: 'nginx-ssl-redirect-http-to-https',
    title: 'How to Redirect HTTP to HTTPS & Configure SSL/TLS in Nginx',
    shortTitle: 'HTTP to HTTPS & SSL',
    category: 'Security & SSL',
    summary: 'Force secure HTTPS connections, redirect port 80 traffic with 301 Moved Permanently, and configure Let\'s Encrypt / modern TLS 1.2 & 1.3 ciphers.',
    description: 'Serving websites over insecure HTTP exposes user sessions to man-in-the-middle attacks. This configuration redirects all port 80 requests to port 443 HTTPS and applies secure TLS encryption directives.',
    configFileName: 'ssl-redirect.conf',
    configContent: `server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;

    # Permanent redirect to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name example.com www.example.com;

    # SSL Certificates (e.g. Let's Encrypt Certbot)
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    # Modern TLS protocols and high-security ciphers
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # SSL Session Caching for faster handshakes
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;
    ssl_session_tickets off;

    # HTTP Strict Transport Security (HSTS)
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    root /var/www/html;
    index index.html;
}`,
    directivesExplained: [
      { directive: 'return 301 https://$host$request_uri;', description: 'Issues an instant HTTP 301 permanent redirect preserving the original query parameters and path.' },
      { directive: 'listen 443 ssl http2;', description: 'Binds to port 443, enables SSL/TLS encryption layer, and enables HTTP/2 multiplexing.' },
      { directive: 'ssl_protocols TLSv1.2 TLSv1.3;', description: 'Disables insecure legacy SSLv2, SSLv3, TLS 1.0, and TLS 1.1 versions to prevent downgrade exploits.' },
      { directive: 'add_header Strict-Transport-Security ...', description: 'Enforces HSTS, instructing browsers to strictly communicate exclusively over HTTPS for future visits.' }
    ],
    verificationCommands: [
      { command: 'sudo nginx -t', explanation: 'Verify certificate file paths exist and TLS directives are syntactically valid' },
      { command: 'curl -IL http://example.com', explanation: 'Follow redirect headers to verify HTTP 301 response points to https://' },
      { command: 'openssl s_client -connect example.com:443 -servername example.com', explanation: 'Inspect SSL certificate chain and negotiated TLS cipher suite' }
    ],
    troubleshootingTips: [
      'Ensure ports 80 and 443 are opened in your firewall: sudo ufw allow "Nginx Full" on Ubuntu.',
      'Check certificate permissions: Nginx master process needs read access to private keys.',
      'When testing certbot renewal, run certbot renew --dry-run to guarantee automation works.'
    ],
    faqs: [
      { question: 'Why use 301 Moved Permanently instead of 302 Found?', answer: '301 tells search engines (Googlebot) to transfer SEO ranking and PageRank authority directly to the HTTPS URL canonical version.' },
      { question: 'What is HTTP/2 multiplexing?', answer: 'HTTP/2 allows browsers to download CSS, JS, images, and fonts concurrently over a single TCP connection, eliminating head-of-line blocking.' }
    ]
  },
  {
    slug: 'nginx-react-spa-react-router-try-files',
    title: 'How to Fix React Router, Vue & SPA 404 on Reload with Nginx try_files',
    shortTitle: 'SPA & React Router 404 Fix',
    category: 'Frontend & SPAs',
    summary: 'Solve the notorious single-page application (SPA) 404 error when refreshing client-side routes like /dashboard or /profile using Nginx try_files.',
    description: 'When users visit client-side routes directly or reload the page in React, Vue, Angular, or Vite apps, Nginx looks for a physical directory on the disk and returns a 404 Not Found error. Configuring try_files falls back to index.html so client routers can handle URL rendering.',
    configFileName: 'spa.conf',
    configContent: `server {
    listen 80;
    server_name myapp.com;

    root /var/www/myapp/dist;
    index index.html;

    location / {
        # Check for static file, directory, or fallback to index.html
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets (JS, CSS, images) with long TTL
    location ~* \\.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg|webp|avif)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # Ensure index.html is NEVER cached so updates appear immediately
    location = /index.html {
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }
}`,
    directivesExplained: [
      { directive: 'try_files $uri $uri/ /index.html;', description: 'Tests if $uri is an existing file, if not checks if it is a directory, and if neither exists, silently rewrites to /index.html.' },
      { directive: 'expires 1y;', description: 'Sets client-side caching header for hashed JavaScript bundles, stylesheets, and fonts for maximum performance.' },
      { directive: 'location = /index.html { add_header Cache-Control "no-store"; }', description: 'Prevents browsers from caching index.html, ensuring users always fetch new script asset hashes after new deployments.' }
    ],
    verificationCommands: [
      { command: 'sudo nginx -t', explanation: 'Verify try_files and regex location blocks for syntax correctness' },
      { command: 'curl -I http://myapp.com/dashboard', explanation: 'Confirm client route returns HTTP 200 OK with text/html content instead of 404' }
    ],
    troubleshootingTips: [
      'Ensure root points to the built production folder (e.g. /dist or /build) containing index.html, not the source code root.',
      'Check file system read permissions for www-data: chmod -R 755 /var/www/myapp/dist.',
      'If you have API routes on the same domain, place location /api/ { proxy_pass ... } ABOVE the location / { try_files ... } block.'
    ],
    faqs: [
      { question: 'Why does React Router break on page reload?', answer: 'Browsers request /dashboard from Nginx directly. Since /dashboard is not a physical file on the server disk, Nginx returns 404 unless try_files instructs it to serve index.html.' },
      { question: 'Will this hurt SEO for static content?', answer: 'For pure SPAs, search bots will parse index.html and run client-side JavaScript. For SSR (Server Side Rendering), use Next.js or Nuxt with a reverse proxy instead.' }
    ]
  },
  {
    slug: 'nginx-rate-limiting-api-ddos',
    title: 'How to Configure Rate Limiting in Nginx to Prevent API Abuse & DDoS',
    shortTitle: 'Rate Limiting & Anti-DDoS',
    category: 'Security & SSL',
    summary: 'Protect login endpoints, public REST APIs, and sensitive routes from brute-force attacks and volumetric spam using Nginx limit_req zones.',
    description: 'Nginx provides an efficient leaky-bucket rate limiting mechanism built directly into C memory buffers. It rejects or queues excessive requests before they ever hit your database or upstream application.',
    configFileName: 'rate-limit.conf',
    configContent: `# Define memory zones in the http {} context
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;
limit_req_status 429;

server {
    listen 80;
    server_name api.example.com;

    # General API endpoints: 10 requests/sec with burst of 20
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Strict login rate limit: 5 requests/minute to prevent credential stuffing
    location /api/v1/auth/login {
        limit_req zone=login_limit burst=2 nodelay;
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}`,
    directivesExplained: [
      { directive: 'limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;', description: 'Allocates a 10MB shared memory zone tracking binary client IPs, allowing up to 10 requests per second per IP.' },
      { directive: 'limit_req_status 429;', description: 'Instructs Nginx to return HTTP 429 Too Many Requests instead of the default 503 Service Temporarily Unavailable.' },
      { directive: 'burst=20 nodelay;', description: 'Allows short bursts up to 20 requests without artificial artificial delay, rejecting the 21st request immediately.' }
    ],
    verificationCommands: [
      { command: 'sudo nginx -t', explanation: 'Validate limit_req_zone syntax and placement inside http context' },
      { command: 'ab -n 50 -c 10 http://api.example.com/api/v1/auth/login', explanation: 'Run ApacheBench stress test to confirm excess requests trigger HTTP 429' },
      { command: 'tail -f /var/log/nginx/error.log | grep limiting', explanation: 'Monitor real-time rate limiting drops in the Nginx error log' }
    ],
    troubleshootingTips: [
      'If your Nginx sits behind Cloudflare or AWS ALB, $binary_remote_addr will track the proxy IP instead of the visitor! Use $http_cf_connecting_ip or set_real_ip_from directives.',
      'Remember limit_req_zone MUST be placed outside server {} blocks in the main http {} block.',
      'A 10MB zone can hold state for approximately 160,000 unique concurrent IP addresses.'
    ],
    faqs: [
      { question: 'What does nodelay do?', answer: 'Without nodelay, requests in excess of the rate are delayed with sleep intervals. With nodelay, burst requests execute instantly, and subsequent requests are rejected with 429 immediately.' },
      { question: 'Why use $binary_remote_addr instead of $remote_addr?', answer: '$binary_remote_addr consumes only 4 bytes (IPv4) or 16 bytes (IPv6) in memory, saving 75% RAM compared to ASCII string representations.' }
    ]
  },
  {
    slug: 'nginx-cors-headers-options-preflight',
    title: 'How to Configure CORS Headers & Handle OPTIONS Preflight in Nginx',
    shortTitle: 'CORS Headers & Preflight',
    category: 'Reverse Proxy & APIs',
    summary: 'Allow Cross-Origin Resource Sharing (CORS) across single-page apps, mobile apps, and microservices with automated HTTP 204 No Content preflight handling.',
    description: 'When frontend apps on https://frontend.com call APIs on https://api.com, browsers enforce the Same-Origin Policy. Configuring Nginx to respond to OPTIONS preflight calls and set Access-Control headers solves CORS errors at the edge without touching application code.',
    configFileName: 'cors.conf',
    configContent: `server {
    listen 80;
    server_name api.example.com;

    location / {
        # Handle CORS Preflight OPTIONS requests directly
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '$http_origin' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, PATCH, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
            add_header 'Access-Control-Allow-Credentials' 'true' always;
            add_header 'Access-Control-Max-Age' 86400 always;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }

        # Regular request headers
        add_header 'Access-Control-Allow-Origin' '$http_origin' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, PATCH, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;

        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}`,
    directivesExplained: [
      { directive: 'add_header Access-Control-Allow-Origin $http_origin always;', description: 'Echoes the requesting origin back to the browser while permitting credentials (cookies/auth headers).' },
      { directive: 'return 204;', description: 'Immediately terminates the preflight OPTIONS request with 204 No Content without passing it to backend runtimes.' },
      { directive: 'Access-Control-Max-Age 86400', description: 'Caches preflight check result in the user browser for 24 hours to reduce latency on subsequent API calls.' }
    ],
    verificationCommands: [
      { command: 'sudo nginx -t', explanation: 'Verify Nginx syntax before reloading' },
      { command: 'curl -I -X OPTIONS -H "Origin: https://app.example.com" -H "Access-Control-Request-Method: POST" http://api.example.com/', explanation: 'Send simulated preflight request to verify 204 No Content response and CORS headers' }
    ],
    troubleshootingTips: [
      'If you send cookies with fetch/axios (withCredentials: true), Access-Control-Allow-Origin cannot be set to a wildcard *; it MUST match the specific origin.',
      'Always append the always parameter to add_header so Nginx attaches CORS headers even when an upstream returns 4xx or 5xx errors.',
      'Do not set duplicate CORS headers in both Nginx and your Node.js/Express app, as multiple headers will cause browsers to reject the response.'
    ],
    faqs: [
      { question: 'Why does the browser send an OPTIONS request before my POST request?', answer: 'Browsers send preflight OPTIONS requests for any non-simple request (custom headers like Authorization, application/json content type) to verify server permissions before sending payload data.' },
      { question: 'What does the always parameter do on add_header?', answer: 'By default, Nginx only adds headers on 200, 201, 204, 206, 301, 302, 303, 304, 307 status codes. Adding always ensures CORS headers appear on 401, 403, 404, and 500 error responses.' }
    ]
  },
  {
    slug: 'nginx-websocket-proxy-pass-upgrade',
    title: 'How to Proxy WebSockets in Nginx (Socket.io, WS, WSS)',
    shortTitle: 'WebSocket Proxying',
    category: 'Reverse Proxy & APIs',
    summary: 'Enable persistent real-time bidirectional communication for Socket.io, Chat engines, GraphQL subscriptions, and WebSockets over Nginx.',
    description: 'WebSockets begin as an HTTP handshake that requests a protocol upgrade to ws:// or wss://. Nginx terminates HTTP by default and closes idle connections unless explicit Upgrade and Connection headers are configured.',
    configFileName: 'websocket.conf',
    configContent: `map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

server {
    listen 80;
    server_name ws.example.com;

    location /socket.io/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;

        # WebSocket handshake upgrade headers
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection $connection_upgrade;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # Keep idle WebSockets alive for 1 day instead of default 60s
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}`,
    directivesExplained: [
      { directive: 'proxy_http_version 1.1;', description: 'Required for WebSocket handshakes. The default Nginx proxy protocol is HTTP 1.0 which does not support persistent multiplexing.' },
      { directive: 'proxy_set_header Upgrade $http_upgrade;', description: 'Passes the client upgrade token ("websocket") to the upstream application.' },
      { directive: 'proxy_set_header Connection $connection_upgrade;', description: 'Translates connection header dynamically using map to ensure clean close when no upgrade is requested.' },
      { directive: 'proxy_read_timeout 86400s;', description: 'Prevents Nginx from killing inactive WebSocket connections after the default 60-second idle timeout.' }
    ],
    verificationCommands: [
      { command: 'sudo nginx -t', explanation: 'Check configuration and map block syntax' },
      { command: 'wscat -c ws://ws.example.com/socket.io/?EIO=4&transport=websocket', explanation: 'Connect using wscat CLI to verify instant protocol upgrade and echo responses' }
    ],
    troubleshootingTips: [
      'The map $http_upgrade directive MUST be placed inside the http {} block, outside server {}.',
      'If connections disconnect exactly after 60 seconds, verify that proxy_read_timeout has been increased.',
      'For SSL WebSockets (wss://), ensure the server block listens on 443 ssl and has valid TLS certificates.'
    ],
    faqs: [
      { question: 'Why does Nginx disconnect WebSockets after 60 seconds?', answer: 'The default proxy_read_timeout is 60 seconds. If neither the client nor server sends a ping/pong frame within that window, Nginx terminates the TCP socket.' },
      { question: 'What does the map block achieve?', answer: 'It sets $connection_upgrade to "upgrade" when the Upgrade header is present, and "close" when it is empty, preserving HTTP connection standards.' }
    ]
  },
  {
    slug: 'nginx-gzip-brotli-compression',
    title: 'How to Enable Gzip & Brotli Compression in Nginx for High PageSpeed',
    shortTitle: 'Gzip & Brotli Compression',
    category: 'Performance & Caching',
    summary: 'Compress HTML, CSS, JavaScript, JSON, and SVG files dynamically on the fly to reduce network payload size by up to 75% and boost Google Lighthouse scores.',
    description: 'Text-based web assets contain repetitive tokens that compress dramatically. Enabling Nginx compression reduces transfer bandwidth, accelerates First Contentful Paint (FCP), and improves Core Web Vitals.',
    configFileName: 'compression.conf',
    configContent: `# Place in http {} block or server {} block
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_min_length 256;
gzip_buffers 16 8k;
gzip_http_version 1.1;

gzip_types
    application/atom+xml
    application/geo+json
    application/javascript
    application/x-javascript
    application/json
    application/ld+json
    application/manifest+json
    application/rdf+xml
    application/rss+xml
    application/xhtml+xml
    application/xml
    font/eot
    font/otf
    font/ttf
    image/svg+xml
    text/css
    text/javascript
    text/plain
    text/xml;

# If ngx_brotli module is installed:
# brotli on;
# brotli_comp_level 6;
# brotli_types text/plain text/css application/javascript application/json image/svg+xml;`,
    directivesExplained: [
      { directive: 'gzip on;', description: 'Enables dynamic Gzip compression of server HTTP responses.' },
      { directive: 'gzip_comp_level 6;', description: 'Optimal trade-off between CPU consumption and compression ratio (levels 7-9 yield negligible gains with high CPU overhead).' },
      { directive: 'gzip_min_length 256;', description: 'Skips compression for files smaller than 256 bytes, where compression headers would actually increase total payload size.' },
      { directive: 'gzip_vary on;', description: 'Adds "Vary: Accept-Encoding" header so intermediate CDNs cache compressed and uncompressed assets separately.' }
    ],
    verificationCommands: [
      { command: 'sudo nginx -t', explanation: 'Test syntax of gzip configuration' },
      { command: 'curl -H "Accept-Encoding: gzip" -I http://example.com/main.js', explanation: 'Verify Content-Encoding: gzip header is returned in response' }
    ],
    troubleshootingTips: [
      'Do NOT compress already compressed binary formats like PNG, JPEG, WebP, MP4, or ZIP — it wastes server CPU and can enlarge the file.',
      'Ensure gzip_vary on is enabled so corporate proxy caches do not serve Gzipped content to ancient legacy clients.',
      'If testing locally with curl without -H "Accept-Encoding: gzip", Nginx will correctly return uncompressed plain text.'
    ],
    faqs: [
      { question: 'Why level 6 instead of level 9?', answer: 'Level 6 achieves 95% of maximum compression with minimal CPU latency. Levels 7-9 require up to 4x more CPU cycles for less than 1% file size reduction.' },
      { question: 'Is Brotli better than Gzip?', answer: 'Yes! Brotli compresses text files 14-25% smaller than Gzip at similar compression speeds and is supported by all modern browsers.' }
    ]
  },
  {
    slug: 'nginx-static-files-cache-control-expires',
    title: 'How to Set Cache-Control & Long-Lived Expires for Static Assets in Nginx',
    shortTitle: 'Static Asset Caching',
    category: 'Performance & Caching',
    summary: 'Instruct browsers and CDNs to cache hashed CSS, JS, images, and fonts with immutable 1-year lifetimes to eliminate duplicate requests.',
    description: 'Modern bundlers (Webpack, Vite, Turbopack) include content hashes in asset filenames (e.g. app.8f2a91.js). Setting aggressive caching policies ensures visitors only download assets once.',
    configFileName: 'cache-static.conf',
    configContent: `server {
    listen 80;
    server_name example.com;
    root /var/www/site;

    # 1 Year Cache for hashed immutable production assets
    location ~* \\.(?:css|js|woff2?|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # Media assets (images, audio, video) cached for 30 days
    location ~* \\.(?:jpg|jpeg|gif|png|ico|cur|gz|svg|svgz|mp4|ogg|ogv|webm|webp|avif)$ {
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
        access_log off;
    }

    # Disable caching for dynamic HTML files and service workers
    location ~* \\.(?:html?|xml|json)$ {
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
    }
}`,
    directivesExplained: [
      { directive: 'expires 1y;', description: 'Sets both Expires HTTP header and max-age directive to 31536000 seconds (1 year).' },
      { directive: 'immutable;', description: 'Tells modern browsers that the file content will never change during its lifetime, preventing 304 conditional revalidation queries on page reload.' },
      { directive: 'access_log off;', description: 'Disables access logging for static asset requests to eliminate disk I/O bottlenecks.' }
    ],
    verificationCommands: [
      { command: 'sudo nginx -t', explanation: 'Validate regex location blocks' },
      { command: 'curl -I http://example.com/assets/main.css', explanation: 'Check Cache-Control and Expires response headers' }
    ],
    troubleshootingTips: [
      'Never mark non-hashed assets (like favicon.ico or logo.png) as immutable unless you never plan to update them.',
      'If you update a CSS file without cache-busting query strings or content hashes, users will not see changes until their cache expires.',
      'Check browser DevTools Network tab to confirm assets load with status "(from disk cache)" or "(from memory cache)".'
    ],
    faqs: [
      { question: 'What does immutable mean in Cache-Control?', answer: 'It tells browsers not to send If-None-Match or If-Modified-Since requests when the user presses refresh (F5), saving network roundtrips completely.' },
      { question: 'Why turn access_log off for images and CSS?', answer: 'On high-traffic sites, logging every single font, icon, and CSS file can thrash server disk IOPS without providing meaningful analytics.' }
    ]
  },
  {
    slug: 'nginx-client-max-body-size-file-upload',
    title: 'How to Fix 413 Request Entity Too Large in Nginx (client_max_body_size)',
    shortTitle: 'File Upload & 413 Fix',
    category: 'Reverse Proxy & APIs',
    summary: 'Increase the default 1MB file upload limit in Nginx to allow large uploads (images, videos, PDF documents) without 413 errors.',
    description: 'By default, Nginx enforces a strict 1 Megabyte ceiling on incoming HTTP request body payloads. When users try to upload files larger than 1MB, Nginx immediately drops the connection and returns HTTP 413 Request Entity Too Large.',
    configFileName: 'upload-size.conf',
    configContent: `server {
    listen 80;
    server_name uploads.example.com;

    # Increase maximum upload file size to 100MB (can be set to 0 for unlimited)
    client_max_body_size 100M;

    # Buffer client request body in memory before disk write
    client_body_buffer_size 128k;

    # Adjust upload timeout for slow client connections
    client_body_timeout 120s;

    location /api/upload {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;

        # Keep proxy timeout aligned with client upload time
        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
        proxy_request_buffering off; # Stream upload directly to backend
    }
}`,
    directivesExplained: [
      { directive: 'client_max_body_size 100M;', description: 'Configures maximum permissible client body size. Suffixes can be M for megabytes or G for gigabytes.' },
      { directive: 'proxy_request_buffering off;', description: 'Disables temporary disk buffering in Nginx, streaming the upload chunk-by-chunk directly into the upstream backend.' },
      { directive: 'client_body_timeout 120s;', description: 'Sets timeout interval for reading request body chunks from slow mobile connections.' }
    ],
    verificationCommands: [
      { command: 'sudo nginx -t', explanation: 'Verify configuration syntax' },
      { command: 'sudo systemctl reload nginx', explanation: 'Apply new body size limits' },
      { command: 'curl -F "file=@large_video.mp4" http://uploads.example.com/api/upload', explanation: 'Test uploading a file larger than 1MB to verify HTTP 200 OK' }
    ],
    troubleshootingTips: [
      'client_max_body_size can be placed in http {}, server {}, or specific location {} blocks depending on whether you want global or route-specific permissions.',
      'If using PHP, remember to also increase upload_max_filesize and post_max_size in php.ini.',
      'Setting client_max_body_size 0; disables body size checking entirely, but exposes the server to memory exhaustion attacks.'
    ],
    faqs: [
      { question: 'What is the default client_max_body_size in Nginx?', answer: 'The default value is 1m (1 Megabyte).' },
      { question: 'What does proxy_request_buffering off do?', answer: 'It prevents Nginx from waiting until the entire 100MB file is uploaded before sending it to backend. It streams data in real-time, drastically lowering server disk IO and memory usage.' }
    ]
  },
  {
    slug: 'nginx-basic-auth-htpasswd-protect',
    title: 'How to Password-Protect Admin & Staging Sites with HTTP Basic Auth in Nginx',
    shortTitle: 'Basic Auth & htpasswd',
    category: 'Security & SSL',
    summary: 'Restrict access to staging environments, internal docs, or admin tools with prompt-based HTTP authentication using htpasswd credentials.',
    description: 'Before exposing staging websites, Prometheus dashboards, or internal APIs to the public internet, configuring Nginx HTTP Basic Authentication provides a bulletproof first layer of defense that stops unauthorized visitors and search engine crawlers.',
    configFileName: 'basic-auth.conf',
    configContent: `server {
    listen 80;
    server_name staging.example.com;

    location / {
        # Enable basic auth prompt
        auth_basic "Restricted Staging Environment";
        auth_basic_user_file /etc/nginx/.htpasswd;

        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Allow health checks and webhooks without password
    location /api/health {
        auth_basic off;
        proxy_pass http://127.0.0.1:3000;
    }
}`,
    directivesExplained: [
      { directive: 'auth_basic "Restricted Staging Environment";', description: 'Enables authentication and sets the prompt realm message displayed in the browser login modal.' },
      { directive: 'auth_basic_user_file /etc/nginx/.htpasswd;', description: 'Specifies the absolute path to the file containing username and bcrypt/Apache password hashes.' },
      { directive: 'auth_basic off;', description: 'Selectively turns off authentication for specific sub-paths like health checks, status monitors, or webhooks.' }
    ],
    verificationCommands: [
      { command: 'sudo apt-get install apache2-utils -y', explanation: 'Install htpasswd utility tool on Ubuntu/Debian' },
      { command: 'sudo htpasswd -c /etc/nginx/.htpasswd admin', explanation: 'Create new .htpasswd file with user admin and hashed password' },
      { command: 'curl -u admin:secret http://staging.example.com/', explanation: 'Test HTTP Basic Auth credentials via curl CLI' }
    ],
    troubleshootingTips: [
      'Ensure the Nginx worker user (usually www-data) has read permission for /etc/nginx/.htpasswd: sudo chmod 640 /etc/nginx/.htpasswd && sudo chown root:www-data /etc/nginx/.htpasswd.',
      'Always serve Basic Auth over HTTPS! On plain HTTP, base64-encoded credentials can be sniffed in cleartext over the network.',
      'To add another user without wiping existing users, omit the -c flag: sudo htpasswd /etc/nginx/.htpasswd developer.'
    ],
    faqs: [
      { question: 'How do I create an htpasswd file without installing apache2-utils?', answer: 'You can generate a password hash with openssl: openssl passwd -apr1 mypassword and append user:hash into /etc/nginx/.htpasswd directly.' },
      { question: 'Will search engines index password-protected pages?', answer: 'No. Search engine crawlers (Googlebot) receive HTTP 401 Unauthorized and will not index the content or scrape private staging links.' }
    ]
  }
];

export function getNginxRecipeBySlug(slug: string): NginxRecipe | undefined {
  return NGINX_RECIPES.find((r) => r.slug === slug);
}

export function getAllNginxRecipes(): NginxRecipe[] {
  return NGINX_RECIPES;
}
