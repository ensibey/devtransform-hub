export interface OpenSslRecipe {
  slug: string;
  title: string;
  shortTitle: string;
  category: 'Generation & Keys' | 'Verification & Inspection' | 'Format Conversions' | 'Testing & Handshake';
  riskLevel: 'safe' | 'caution' | 'destructive';
  command: string;
  summary: string;
  description: string;
  prerequisites: string[];
  parameters: { flag: string; purpose: string; defaultValue?: string }[];
  steps: { title: string; instruction: string; command?: string }[];
  troubleshootingTips: string[];
  faqs: { question: string; answer: string }[];
}

export const OPENSSL_RECIPES: OpenSslRecipe[] = [
  {
    slug: 'generate-self-signed-certificate',
    title: 'How to Generate a Self-Signed SSL Certificate with OpenSSL',
    shortTitle: 'Generate Self-Signed Certificate',
    category: 'Generation & Keys',
    riskLevel: 'safe',
    command: 'openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes -subj "/CN=localhost"',
    summary: 'Create a standalone 4096-bit RSA private key and self-signed X.509 certificate for local HTTPS testing or staging servers.',
    description: 'A self-signed certificate encrypts traffic between client and server without requiring validation from a public Certificate Authority (CA). The `-nodes` flag generates an unencrypted private key suitable for automated daemon restarts in NGINX, Apache, or Node.js.',
    prerequisites: [
      'OpenSSL 1.1.1 or 3.x installed on your system.',
      'Terminal with write permissions to the working directory.',
    ],
    parameters: [
      { flag: '-x509', purpose: 'Outputs a self-signed X.509 certificate instead of a certificate signing request (CSR)' },
      { flag: '-newkey rsa:4096', purpose: 'Generates a new 4096-bit RSA private key simultaneously' },
      { flag: '-keyout key.pem', purpose: 'Output destination file for the private key' },
      { flag: '-out cert.pem', purpose: 'Output destination file for the public certificate' },
      { flag: '-sha256', purpose: 'Uses SHA-256 hashing algorithm instead of insecure SHA-1' },
      { flag: '-days 365', purpose: 'Certificate validity duration in days' },
      { flag: '-nodes', purpose: 'No DES encryption on private key (prevents password prompt on server restart)' },
      { flag: '-subj "/CN=localhost"', purpose: 'Subject string providing Common Name to avoid interactive wizard prompts' },
    ],
    steps: [
      {
        title: 'Run one-line generation command',
        instruction: 'Generate both the private key and public certificate in a single non-interactive command:',
        command: 'openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 365 -nodes -subj "/CN=localhost"',
      },
      {
        title: 'Verify generated files',
        instruction: 'Confirm key.pem and cert.pem were created and verify permissions:',
        command: 'chmod 600 key.pem && ls -lh cert.pem key.pem',
      },
      {
        title: 'Inspect certificate expiry',
        instruction: 'Check valid dates to confirm the 365-day lifetime:',
        command: 'openssl x509 -in cert.pem -noout -dates',
      },
    ],
    troubleshootingTips: [
      'Browsers like Chrome will show NET::ERR_CERT_AUTHORITY_INVALID because the certificate is self-signed. You can add it to your OS trust store or use mkcert for local CA trust.',
      'Always set private key file permissions to 600 (`chmod 600 key.pem`) so other users on the system cannot read your key.',
    ],
    faqs: [
      {
        question: 'What does the -nodes flag mean in OpenSSL?',
        answer: 'It stands for "No DES". It tells OpenSSL not to encrypt the private key with a passphrase, allowing web servers like NGINX or Caddy to boot without human intervention.'
      },
      {
        question: 'Should I use 2048 or 4096 bits for RSA keys?',
        answer: '2048-bit RSA is currently secure and fast. 4096-bit provides extra future-proof security margin with a minor CPU overhead during TLS handshakes.'
      }
    ]
  },
  {
    slug: 'check-ssl-certificate-expiration',
    title: 'How to Check SSL Certificate Expiration Date from Domain or File',
    shortTitle: 'Check Certificate Expiration',
    category: 'Verification & Inspection',
    riskLevel: 'safe',
    command: 'openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null | openssl x509 -noout -dates',
    summary: 'Query a live HTTPS domain or local file to display notBefore and notAfter certificate expiration dates.',
    description: 'This command establishes a TLS connection to the remote host using SNI (`-servername`), extracts the server certificate, and pipes it to `openssl x509` to print the exact validity start (`notBefore`) and expiration (`notAfter`) timestamps.',
    prerequisites: [
      'Outbound network access on TCP port 443 to target domain.',
    ],
    parameters: [
      { flag: '-connect <host>:<port>', purpose: 'Target hostname and TLS port (typically 443 for HTTPS)' },
      { flag: '-servername <host>', purpose: 'Server Name Indication (SNI) header to route to correct virtual host' },
      { flag: '-noout -dates', purpose: 'Suppresses raw certificate text and only prints valid date range' },
      { flag: '-checkend <seconds>', purpose: 'Returns exit code 0 if certificate is valid for the next N seconds, 1 if expired' },
    ],
    steps: [
      {
        title: 'Check expiration of live remote domain',
        instruction: 'Query the target domain via s_client and print expiration dates:',
        command: 'openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null | openssl x509 -noout -dates',
      },
      {
        title: 'Check expiration of a local certificate file',
        instruction: 'Inspect a .pem, .crt, or .cer file on disk:',
        command: 'openssl x509 -in cert.pem -noout -enddate',
      },
      {
        title: 'Check if certificate expires within 30 days (automation check)',
        instruction: 'Automate alerting with -checkend (2592000 seconds = 30 days):',
        command: 'openssl x509 -in cert.pem -checkend 2592000 -noout && echo "Valid for >=30 days" || echo "Expiring soon!"',
      },
    ],
    troubleshootingTips: [
      'Always supply `-servername <domain>`! Without SNI, cloud providers (Cloudflare, AWS CloudFront, Kubernetes Ingress) will return an invalid default certificate instead of your domain certificate.',
      'If querying from bash scripts, redirect stderr (`2>/dev/null`) and supply `</dev/null` so the connection closes immediately after the handshake.',
    ],
    faqs: [
      {
        question: 'Why does s_client hang when I run it?',
        answer: 'By default, s_client remains open waiting for interactive input. Piping `</dev/null` sends an immediate EOF, allowing the command to exit promptly.'
      }
    ]
  },
  {
    slug: 'view-certificate-details',
    title: 'How to View and Inspect SSL Certificate Details (Subject, Issuer, SAN)',
    shortTitle: 'Inspect Certificate Details',
    category: 'Verification & Inspection',
    riskLevel: 'safe',
    command: 'openssl x509 -in cert.pem -text -noout',
    summary: 'Print complete human-readable details of an X.509 certificate including Subject, Issuer, Serial Number, and Subject Alternative Names (SANs).',
    description: 'The `openssl x509 -text -noout` command decodes all ASN.1 structures of an X.509 certificate. It reveals which Certificate Authority signed it, all covered domains, signature algorithms, and key usage constraints.',
    prerequisites: [
      'Local certificate file in PEM format (.crt, .pem, or .cer).',
    ],
    parameters: [
      { flag: '-in cert.pem', purpose: 'Input certificate path' },
      { flag: '-text', purpose: 'Decodes and displays all certificate fields in readable format' },
      { flag: '-noout', purpose: 'Suppresses printing of the raw base64 encoded PEM block' },
      { flag: '-subject', purpose: 'Prints only the Subject line (CN, Organization, Country)' },
      { flag: '-issuer', purpose: 'Prints only the signing Certificate Authority (CA) identity' },
    ],
    steps: [
      {
        title: 'Display complete certificate breakdown',
        instruction: 'Inspect all fields and extensions:',
        command: 'openssl x509 -in cert.pem -text -noout',
      },
      {
        title: 'Extract Subject Alternative Names (SANs) only',
        instruction: 'View all domains and subdomains covered by the certificate:',
        command: 'openssl x509 -in cert.pem -noout -ext subjectAltName',
      },
      {
        title: 'Check Issuer and Fingerprint',
        instruction: 'View issuing CA and SHA-256 fingerprint:',
        command: 'openssl x509 -in cert.pem -noout -issuer -fingerprint -sha256',
      },
    ],
    troubleshootingTips: [
      'If you get "unable to load certificate", check if the file is in binary DER format. Convert it with: `openssl x509 -inform der -in cert.cer -out cert.pem`.',
    ],
    faqs: [
      {
        question: 'Where can I find the covered domains in the certificate output?',
        answer: 'Look under the "X509v3 Subject Alternative Name" extension block for `DNS:domain.com, DNS:www.domain.com` entries.'
      }
    ]
  },
  {
    slug: 'verify-private-key-matches-certificate',
    title: 'How to Verify Private Key Matches SSL Certificate (Modulus MD5 Check)',
    shortTitle: 'Verify Key Matches Certificate',
    category: 'Verification & Inspection',
    riskLevel: 'safe',
    command: 'openssl x509 -noout -modulus -in cert.pem | openssl md5 && openssl rsa -noout -modulus -in key.pem | openssl md5',
    summary: 'Ensure that a private key and an SSL certificate are an exact cryptographic pair before deploying them to web servers.',
    description: 'In RSA cryptography, the public certificate and private key share the exact same mathematical modulus. By hashing the modulus of both files with MD5, identical hash outputs prove that the key matches the certificate without revealing sensitive private key material.',
    prerequisites: [
      'Both certificate and private key files on disk.',
    ],
    parameters: [
      { flag: '-modulus', purpose: 'Extracts the RSA public modulus from the key or certificate' },
      { flag: 'openssl md5', purpose: 'Computes MD5 checksum of the modulus for easy visual comparison' },
    ],
    steps: [
      {
        title: 'Check certificate modulus hash',
        instruction: 'Extract and hash the certificate modulus:',
        command: 'openssl x509 -noout -modulus -in cert.pem | openssl md5',
      },
      {
        title: 'Check private key modulus hash',
        instruction: 'Extract and hash the private key modulus:',
        command: 'openssl rsa -noout -modulus -in key.pem | openssl md5',
      },
      {
        title: 'Compare the outputs',
        instruction: 'If both 32-character hexadecimal hashes are identical, the certificate and key pair match 100%.',
      },
    ],
    troubleshootingTips: [
      'Mismatch between key and certificate will cause NGINX or Apache to fail starting with errors like: "SSL: error:0B080074:x509 certificate routines:X509_check_private_key:key values mismatch".',
      'For CSR validation, run: `openssl req -noout -modulus -in domain.csr | openssl md5`.',
    ],
    faqs: [
      {
        question: 'Does this work for Elliptic Curve (ECDSA) keys too?',
        answer: 'No, ECDSA keys do not have an RSA modulus. For ECDSA, compare the public key coordinates: `openssl ec -in key.pem -pubout` vs `openssl x509 -in cert.pem -pubkey -noout`.'
      }
    ]
  },
  {
    slug: 'generate-csr-with-san',
    title: 'How to Generate a Certificate Signing Request (CSR) with SAN',
    shortTitle: 'Generate CSR with SAN',
    category: 'Generation & Keys',
    riskLevel: 'safe',
    command: 'openssl req -new -newkey rsa:2048 -nodes -keyout domain.key -out domain.csr -subj "/CN=example.com" -addext "subjectAltName=DNS:example.com,DNS:www.example.com"',
    summary: 'Generate a new private key and CSR including Subject Alternative Names (SANs) required by modern browsers and CAs.',
    description: 'Modern browsers and Certificate Authorities (Let\'s Encrypt, DigiCert, Sectigo) require all domains (including the apex domain and www) to be listed in the Subject Alternative Name (SAN) extension. OpenSSL 1.1.1+ supports the `-addext` flag for instant SAN inclusion.',
    prerequisites: [
      'OpenSSL 1.1.1 or higher for the `-addext` parameter.',
    ],
    parameters: [
      { flag: '-new -newkey rsa:2048', purpose: 'Generates new 2048-bit RSA key and CSR simultaneously' },
      { flag: '-nodes', purpose: 'Disables passphrase on the resulting private key' },
      { flag: '-subj "/CN=example.com"', purpose: 'Specifies primary domain name without prompting' },
      { flag: '-addext "subjectAltName=..."', purpose: 'Specifies comma-separated list of SAN domains' },
    ],
    steps: [
      {
        title: 'Generate key and CSR with SANs',
        instruction: 'Run the one-liner specifying your primary and alternative domains:',
        command: 'openssl req -new -newkey rsa:2048 -nodes -keyout domain.key -out domain.csr -subj "/CN=example.com" -addext "subjectAltName=DNS:example.com,DNS:www.example.com"',
      },
      {
        title: 'Verify the CSR contents',
        instruction: 'Verify that the SAN extension and Common Name are correctly populated:',
        command: 'openssl req -in domain.csr -text -noout | grep -A 1 "Subject Alternative Name"',
      },
      {
        title: 'Submit CSR to Certificate Authority',
        instruction: 'Copy the contents of domain.csr and provide to your CA portal.',
      },
    ],
    troubleshootingTips: [
      'If using OpenSSL 1.0.2 or earlier, `-addext` is not supported; you must use an `openssl.cnf` config file with `[req_ext]`.',
      'Never send domain.key to anyone! Only domain.csr is shared with the Certificate Authority.',
    ],
    faqs: [
      {
        question: 'Can I include IP addresses in SANs?',
        answer: 'Yes! Prefix with `IP:`, e.g. `-addext "subjectAltName=DNS:example.com,IP:192.168.1.100"`.'
      }
    ]
  },
  {
    slug: 'convert-pfx-pkcs12-to-pem',
    title: 'How to Convert PFX / PKCS#12 to PEM Certificate and Private Key',
    shortTitle: 'Convert PFX / PKCS#12 to PEM',
    category: 'Format Conversions',
    riskLevel: 'caution',
    command: 'openssl pkcs12 -in bundle.pfx -nocerts -out key.pem -nodes && openssl pkcs12 -in bundle.pfx -clcerts -nokeys -out cert.pem',
    summary: 'Extract individual PEM private key and certificate files from a password-protected Windows / IIS .pfx or .p12 bundle.',
    description: 'PKCS#12 (.pfx or .p12) is the standard format used by Microsoft Windows and IIS to store certificates alongside private keys and CA chains. Linux web servers like NGINX require separate PEM files (`.crt` and `.key`).',
    prerequisites: [
      'Valid .pfx or .p12 archive and its export password.',
    ],
    parameters: [
      { flag: '-in bundle.pfx', purpose: 'Input PKCS#12 archive file' },
      { flag: '-nocerts', purpose: 'Extracts only the private key, skipping certificates' },
      { flag: '-clcerts', purpose: 'Extracts only client/server certificate, skipping CA chain' },
      { flag: '-cacerts', purpose: 'Extracts intermediate and root CA certificates' },
      { flag: '-nodes', purpose: 'Extracts private key without setting an output passphrase' },
    ],
    steps: [
      {
        title: 'Extract the private key',
        instruction: 'Extract unencrypted private key to key.pem:',
        command: 'openssl pkcs12 -in bundle.pfx -nocerts -out key.pem -nodes',
      },
      {
        title: 'Extract the primary SSL certificate',
        instruction: 'Extract public server certificate to cert.pem:',
        command: 'openssl pkcs12 -in bundle.pfx -clcerts -nokeys -out cert.pem',
      },
      {
        title: 'Extract the intermediate CA chain bundle',
        instruction: 'Extract intermediate certificates for full SSL chain validation:',
        command: 'openssl pkcs12 -in bundle.pfx -cacerts -nokeys -out chain.pem',
      },
    ],
    troubleshootingTips: [
      'In OpenSSL 3.0, older PFX files created with legacy algorithms (RC2/3DES) will fail with "error:0308010C:digital envelope routines::unsupported". Fix by appending the `-legacy` flag: `openssl pkcs12 -legacy -in bundle.pfx ...`.',
    ],
    faqs: [
      {
        question: 'What is the difference between .pfx and .p12?',
        answer: 'They are virtually identical file formats implementing the PKCS#12 standard. .pfx was originally created by Microsoft, while .p12 is the official IETF standard.'
      }
    ]
  },
  {
    slug: 'convert-crt-cer-to-pem',
    title: 'How to Convert CRT, CER or DER to PEM Format',
    shortTitle: 'Convert DER / CRT to PEM',
    category: 'Format Conversions',
    riskLevel: 'safe',
    command: 'openssl x509 -inform der -in certificate.cer -out certificate.pem',
    summary: 'Convert binary DER-encoded SSL certificates (.cer or .der) to standard ASCII base64 PEM format.',
    description: 'Many Java applications, Windows export wizards, and hardware firewalls export certificates in binary DER format. Converting them to ASCII PEM format (`-----BEGIN CERTIFICATE-----`) makes them compatible with modern Linux servers and cloud load balancers.',
    prerequisites: [
      'Input certificate file in DER binary format.',
    ],
    parameters: [
      { flag: '-inform der', purpose: 'Specifies input format as binary DER (Distinguished Encoding Rules)' },
      { flag: '-outform pem', purpose: 'Specifies output format as base64 ASCII PEM (default)' },
    ],
    steps: [
      {
        title: 'Check if certificate is binary or ASCII',
        instruction: 'Open the file in a text editor or run `head -n 1 certificate.cer`. If it begins with `-----BEGIN CERTIFICATE-----`, it is already PEM! If binary garble, it is DER.',
      },
      {
        title: 'Convert DER to PEM',
        instruction: 'Execute the format translation:',
        command: 'openssl x509 -inform der -in certificate.cer -out certificate.pem',
      },
      {
        title: 'Verify converted PEM file',
        instruction: 'Confirm the converted certificate is valid:',
        command: 'openssl x509 -in certificate.pem -noout -subject',
      },
    ],
    troubleshootingTips: [
      'Many files with `.crt` extension are already in PEM format. You only need this conversion if `openssl x509 -in file.crt` returns "unable to load certificate".',
    ],
    faqs: [
      {
        question: 'How do I convert a PEM certificate back to DER binary?',
        answer: 'Reverse the parameters: `openssl x509 -outform der -in cert.pem -out cert.der`.'
      }
    ]
  },
  {
    slug: 'generate-rsa-private-key',
    title: 'How to Generate a Secure RSA Private Key (2048 or 4096 bit)',
    shortTitle: 'Generate RSA Private Key',
    category: 'Generation & Keys',
    riskLevel: 'safe',
    command: 'openssl genrsa -out private.key 4096',
    summary: 'Generate a standalone, high-entropy 2048-bit or 4096-bit RSA private key for SSL/TLS, SSH, or JWT authentication.',
    description: '`openssl genrsa` creates a standard PKCS#1 RSA private key. The resulting key can be paired with certificate signing requests, used as signing keys for JSON Web Tokens (JWT RS256), or deployed to TLS terminators.',
    prerequisites: [
      'Local terminal with OpenSSL.',
    ],
    parameters: [
      { flag: '-out private.key', purpose: 'Destination path for generated private key' },
      { flag: '4096', purpose: 'Modulus size in bits (2048 or 4096 recommended)' },
      { flag: '-aes256', purpose: 'Optional: Encrypt the key with AES-256 and prompt for a passphrase' },
    ],
    steps: [
      {
        title: 'Generate 4096-bit RSA key',
        instruction: 'Create the key without a passphrase:',
        command: 'openssl genrsa -out private.key 4096',
      },
      {
        title: 'Protect key file permissions',
        instruction: 'Lock down read access to current user only:',
        command: 'chmod 600 private.key',
      },
      {
        title: 'Extract corresponding public key',
        instruction: 'Generate the matching public key for sharing:',
        command: 'openssl rsa -in private.key -pubout -out public.key',
      },
    ],
    troubleshootingTips: [
      'Never commit private.key to Git! Add `*.key` and `*.pem` to your `.gitignore`.',
      'For modern high-performance cryptography with smaller keys, consider Ed25519 or ECDSA P-256: `openssl ecparam -name prime256v1 -genkey -noout -out ec-private.key`.',
    ],
    faqs: [
      {
        question: 'How long does 4096-bit RSA generation take?',
        answer: 'On modern CPUs, generating a 4096-bit RSA key takes between 0.1 and 0.5 seconds.'
      }
    ]
  },
  {
    slug: 'remove-passphrase-from-private-key',
    title: 'How to Remove Passphrase from an RSA Private Key for NGINX/Apache',
    shortTitle: 'Remove Passphrase from Key',
    category: 'Generation & Keys',
    riskLevel: 'caution',
    command: 'openssl rsa -in encrypted.key -out decrypted.key',
    summary: 'Decrypt a passphrase-protected RSA private key so automated web servers can boot without manual password entry.',
    description: 'When an RSA private key is encrypted with AES or DES, web servers prompt for the passphrase every time the process starts or reloads. Removing the passphrase creates an unencrypted key that NGINX, Apache, and Docker containers can read unattended.',
    prerequisites: [
      'Encrypted private key and its current passphrase.',
    ],
    parameters: [
      { flag: '-in encrypted.key', purpose: 'Source passphrase-protected private key' },
      { flag: '-out decrypted.key', purpose: 'Destination unencrypted private key' },
    ],
    steps: [
      {
        title: 'Decrypt the key',
        instruction: 'Run the decryption command and enter the passphrase when prompted:',
        command: 'openssl rsa -in encrypted.key -out decrypted.key',
      },
      {
        title: 'Secure the unencrypted key file',
        instruction: 'Restrict file access permissions to owner read/write:',
        command: 'chmod 600 decrypted.key',
      },
      {
        title: 'Verify header difference',
        instruction: 'Check that DEK-Info header is gone and file begins with standard `BEGIN RSA PRIVATE KEY`:',
        command: 'head -n 5 decrypted.key',
      },
    ],
    troubleshootingTips: [
      'Ensure the server hosting the decrypted key has strict file permissions, as anyone with read access can impersonate the certificate.',
    ],
    faqs: [
      {
        question: 'How do I add a passphrase to an unencrypted key later?',
        answer: 'Run: `openssl rsa -aes256 -in decrypted.key -out encrypted.key` and enter your desired new passphrase.'
      }
    ]
  },
  {
    slug: 'test-tls-handshake-ciphers',
    title: 'How to Test TLS Handshake, Protocols, and Cipher Suites with s_client',
    shortTitle: 'Test TLS Handshake & Ciphers',
    category: 'Testing & Handshake',
    riskLevel: 'safe',
    command: 'openssl s_client -connect example.com:443 -servername example.com -tls1_3 -brief',
    summary: 'Diagnose TLS handshake negotiation, verify supported protocol versions (TLS 1.2 vs 1.3), and check negotiated cipher suites.',
    description: '`openssl s_client` is the definitive CLI tool for testing TLS handshakes. It simulates a client connection, negotiates cipher suites, tests SNI routing, and reports handshake errors such as cipher mismatch or protocol deprecation.',
    prerequisites: [
      'Target domain reachable on TCP port 443.',
    ],
    parameters: [
      { flag: '-tls1_3', purpose: 'Forces handshake to use TLS v1.3 only (or -tls1_2)' },
      { flag: '-brief', purpose: 'Prints concise one-line summary of handshake result instead of verbose output' },
      { flag: '-cipher <list>', purpose: 'Tests specific cipher suite string against the server' },
    ],
    steps: [
      {
        title: 'Test TLS 1.3 support with brief output',
        instruction: 'Check if the server supports TLS 1.3:',
        command: 'openssl s_client -connect example.com:443 -servername example.com -tls1_3 -brief </dev/null',
      },
      {
        title: 'Test if legacy TLS 1.0/1.1 is properly disabled',
        instruction: 'Verify insecure protocols are rejected:',
        command: 'openssl s_client -connect example.com:443 -servername example.com -tls1 </dev/null',
      },
      {
        title: 'Print complete certificate chain sent by server',
        instruction: 'Check for missing intermediate certificates causing SSL errors on mobile devices:',
        command: 'openssl s_client -connect example.com:443 -servername example.com -showcerts </dev/null',
      },
    ],
    troubleshootingTips: [
      'If mobile clients or curl report "certificate signed by unknown authority", check `-showcerts` output. Usually the server is missing intermediate CA certificates.',
    ],
    faqs: [
      {
        question: 'What does Verify return code: 0 (ok) mean?',
        answer: 'It means the remote server\'s certificate chain was validated successfully against your local CA trust store.'
      }
    ]
  }
];

export function getAllOpenSslRecipes(): OpenSslRecipe[] {
  return OPENSSL_RECIPES;
}

export function getOpenSslRecipeBySlug(slug: string): OpenSslRecipe | undefined {
  return OPENSSL_RECIPES.find((r) => r.slug === slug);
}
