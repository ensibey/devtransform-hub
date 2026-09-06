export interface ChmodData {
  octal: string;
  slug: string;
  symbolic: string;
  owner: { read: boolean; write: boolean; execute: boolean };
  group: { read: boolean; write: boolean; execute: boolean };
  others: { read: boolean; write: boolean; execute: boolean };
  securityRating: 'Safe' | 'Standard' | 'Elevated' | 'Dangerous';
  summary: string;
  description: string;
  recommendedFor: string[];
  securityWarning?: string;
  commands: {
    singleFile: string;
    recursive: string;
    findDirectories?: string;
    findFiles?: string;
  };
}

export const CHMOD_DATA: ChmodData[] = [
  {
    octal: '755',
    slug: 'chmod-755',
    symbolic: 'rwxr-xr-x',
    owner: { read: true, write: true, execute: true },
    group: { read: true, write: false, execute: true },
    others: { read: true, write: false, execute: true },
    securityRating: 'Standard',
    summary: 'Owner has full control (read, write, execute). Group and Everyone else can read and execute, but cannot modify.',
    description: 'chmod 755 is the universal standard permission for web server public directories (`public_html`, `/var/www/html`) and executable shell scripts. It allows web servers (like NGINX and Apache) to traverse directories and serve files while preventing external visitors or group members from tampering with the files.',
    recommendedFor: [
      'Web server directories (`/var/www/html`)',
      'Shell scripts (`deploy.sh`, `backup.sh`)',
      'Compiled binaries (`/usr/local/bin/*`)',
      'Git hook scripts (`.git/hooks/pre-commit`)',
    ],
    commands: {
      singleFile: 'chmod 755 script.sh',
      recursive: 'chmod -R 755 /var/www/html',
      findDirectories: 'find /var/www/html -type d -exec chmod 755 {} +',
    },
  },
  {
    octal: '644',
    slug: 'chmod-644',
    symbolic: 'rw-r--r--',
    owner: { read: true, write: true, execute: false },
    group: { read: true, write: false, execute: false },
    others: { read: true, write: false, execute: false },
    securityRating: 'Standard',
    summary: 'Owner can read and write. Group and Everyone else can only read.',
    description: 'chmod 644 is the default security standard for all regular files hosted on Linux web servers, including HTML, CSS, JavaScript, images, and PHP scripts. It ensures that the web server process can read and serve the file to visitors, but no external entity can overwrite or execute malicious code.',
    recommendedFor: [
      'Web assets (HTML, CSS, JS, PNG, SVG)',
      'Source code files (`.py`, `.ts`, `.php`, `.go`)',
      'Configuration files without sensitive passwords',
      'Documentation files (`README.md`, `LICENSE`)',
    ],
    commands: {
      singleFile: 'chmod 644 index.html',
      recursive: 'chmod -R 644 /var/www/html/*.html',
      findFiles: 'find /var/www/html -type f -exec chmod 644 {} +',
    },
  },
  {
    octal: '600',
    slug: 'chmod-600',
    symbolic: 'rw-------',
    owner: { read: true, write: true, execute: false },
    group: { read: false, write: false, execute: false },
    others: { read: false, write: false, execute: false },
    securityRating: 'Safe',
    summary: 'Only the Owner can read and write. All group members and others have zero permissions.',
    description: 'chmod 600 provides strict cryptographic isolation. It is the required permission for SSH private keys, AWS EC2 `.pem` certificates, and sensitive environment files (`.env`). OpenSSH will actively refuse to connect if a private key has looser permissions.',
    recommendedFor: [
      'SSH Private Keys (`id_ed25519`, `id_rsa`)',
      'AWS EC2 Key Pairs (`keypair.pem`)',
      'Production environment secrets (`.env.production`)',
      'Database credentials (`wp-config.php`, `.my.cnf`)',
    ],
    securityWarning: 'If OpenSSH outputs "UNPROTECTED PRIVATE KEY FILE! Permissions 0644 for id_rsa are too open", immediately run `chmod 600 id_rsa`.',
    commands: {
      singleFile: 'chmod 600 ~/.ssh/id_rsa',
      recursive: 'chmod 600 /app/.env.production',
    },
  },
  {
    octal: '400',
    slug: 'chmod-400',
    symbolic: 'r--------',
    owner: { read: true, write: false, execute: false },
    group: { read: false, write: false, execute: false },
    others: { read: false, write: false, execute: false },
    securityRating: 'Safe',
    summary: 'Read-only access strictly for the file Owner. Even the owner cannot write or execute without changing permissions.',
    description: 'chmod 400 is the most paranoid and secure permission setting for sensitive cryptographic keys. AWS explicitly recommends `chmod 400 my-key.pem` before connecting to EC2 instances to prevent accidental file corruption or tampering.',
    recommendedFor: [
      'AWS EC2 `.pem` private keys',
      'TLS / SSL private keys (`server.key`)',
      'GPG private signing keys',
    ],
    commands: {
      singleFile: 'chmod 400 ~/.ssh/id_ed25519',
      recursive: 'chmod 400 /etc/ssl/private/server.key',
    },
  },
  {
    octal: '700',
    slug: 'chmod-700',
    symbolic: 'rwx------',
    owner: { read: true, write: true, execute: true },
    group: { read: false, write: false, execute: false },
    others: { read: false, write: false, execute: false },
    securityRating: 'Safe',
    summary: 'Full access for the Owner only. Completely hidden and inaccessible to group members and public users.',
    description: 'chmod 700 is the required permission for user private directories, most notably `~/.ssh`. It prevents any other local user on a shared server from listing directory contents or reading authorized_keys.',
    recommendedFor: [
      'SSH configuration directory (`~/.ssh`)',
      'GnuPG directory (`~/.gnupg`)',
      'Private backup directories',
    ],
    commands: {
      singleFile: 'chmod 700 ~/.ssh',
      recursive: 'chmod -R 700 /home/user/private_backups',
    },
  },
  {
    octal: '777',
    slug: 'chmod-777',
    symbolic: 'rwxrwxrwx',
    owner: { read: true, write: true, execute: true },
    group: { read: true, write: true, execute: true },
    others: { read: true, write: true, execute: true },
    securityRating: 'Dangerous',
    summary: 'CRITICAL HAZARD: Complete read, write, and execute permissions granted to EVERYONE on the system.',
    description: 'chmod 777 is an extreme security risk. It allows any user, background service, web visitor, or malicious process to read, overwrite, infect, or delete your files. Never use chmod 777 as a quick fix for permission errors on production web servers.',
    recommendedFor: [
      'NEVER recommended in production',
      'Temporary local testing only when completely isolated',
    ],
    securityWarning: 'CRITICAL VULNERABILITY: Setting chmod 777 on web uploads or directories allows hackers to upload web shells (PHP/Python backdoors) and take complete control of your server.',
    commands: {
      singleFile: 'chmod 777 temp_scratchpad.tmp (NOT RECOMMENDED)',
      recursive: '# DO NOT RUN chmod -R 777 on servers!',
    },
  },
  {
    octal: '750',
    slug: 'chmod-750',
    symbolic: 'rwxr-x---',
    owner: { read: true, write: true, execute: true },
    group: { read: true, write: false, execute: true },
    others: { read: false, write: false, execute: false },
    securityRating: 'Standard',
    summary: 'Owner has full control. Group members can read and execute. Others have zero access.',
    description: 'chmod 750 is an ideal permission setting for multi-user shared hosting or team environments where team members in the same group need to run scripts, but public visitors should have no directory traversal rights.',
    recommendedFor: [
      'Team project root directories',
      'Internal deployment scripts',
      'Staging environment folders',
    ],
    commands: {
      singleFile: 'chmod 750 /var/www/internal-app',
      recursive: 'chmod -R 750 /opt/team-scripts',
    },
  },
  {
    octal: '775',
    slug: 'chmod-775',
    symbolic: 'rwxrwxr-x',
    owner: { read: true, write: true, execute: true },
    group: { read: true, write: true, execute: true },
    others: { read: true, write: false, execute: true },
    securityRating: 'Elevated',
    summary: 'Owner and Group have full control (read, write, execute). Others can read and execute.',
    description: 'chmod 775 is commonly used in collaborative development environments where multiple developers in a shared Linux group (`developers` or `www-data`) need to write and deploy code to the same web directory.',
    recommendedFor: [
      'Shared group storage directories',
      'CI/CD deployment target folders',
      'Content Management System cache directories',
    ],
    commands: {
      singleFile: 'chmod 775 /var/www/shared-repo',
      recursive: 'chmod -R 775 /shared/workspace',
    },
  },
  {
    octal: '664',
    slug: 'chmod-664',
    symbolic: 'rw-rw-r--',
    owner: { read: true, write: true, execute: false },
    group: { read: true, write: true, execute: false },
    others: { read: true, write: false, execute: false },
    securityRating: 'Standard',
    summary: 'Owner and Group can read and write. Others can only read.',
    description: 'chmod 664 allows collaborative editing by team members sharing a group without granting unnecessary execution rights to static files.',
    recommendedFor: [
      'Collaborative configuration files',
      'Shared project documentation',
      'Team log files',
    ],
    commands: {
      singleFile: 'chmod 664 config.yaml',
      recursive: 'chmod -R 664 /shared/project/*.txt',
    },
  },
  {
    octal: '444',
    slug: 'chmod-444',
    symbolic: 'r--r--r--',
    owner: { read: true, write: false, execute: false },
    group: { read: true, write: false, execute: false },
    others: { read: true, write: false, execute: false },
    securityRating: 'Safe',
    summary: 'Read-only access for EVERYONE, including the file owner.',
    description: 'chmod 444 locks down a file against any accidental modifications or deletions. Even the owner must explicitly alter permissions with `chmod u+w` before editing.',
    recommendedFor: [
      'Read-only archives and audit logs',
      'System-wide public certificates (`ca-bundle.crt`)',
      'License files and immutable legal notices',
    ],
    commands: {
      singleFile: 'chmod 444 audit_log_2026.log',
      recursive: 'chmod -R 444 /etc/ssl/certs/*.pem',
    },
  },
];

export function getAllChmods(): ChmodData[] {
  return CHMOD_DATA;
}

export function getChmodBySlug(slug: string): ChmodData | undefined {
  return CHMOD_DATA.find((c) => c.slug === slug);
}
