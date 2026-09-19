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

// Helper to convert single digit to permissions
export function digitToPerms(d: number): { read: boolean; write: boolean; execute: boolean; symbol: string } {
  const read = (d & 4) !== 0;
  const write = (d & 2) !== 0;
  const execute = (d & 1) !== 0;
  const symbol = (read ? 'r' : '-') + (write ? 'w' : '-') + (execute ? 'x' : '-');
  return { read, write, execute, symbol };
}

// Dedicated curated definitions for high-volume chmod permissions
const CURATED_CHMODS: Record<string, Partial<ChmodData>> = {
  '755': {
    securityRating: 'Standard',
    summary: 'Owner has full control (rwx). Group and Everyone else can read and execute (r-x), but cannot modify.',
    description: 'chmod 755 is the universal standard permission for web server public directories (`public_html`, `/var/www/html`) and executable shell scripts. It allows web servers (like NGINX and Apache) to traverse directories and serve files while preventing external visitors or group members from tampering with the files.',
    recommendedFor: [
      'Web server directories (`/var/www/html`)',
      'Shell scripts (`deploy.sh`, `backup.sh`)',
      'Compiled binaries (`/usr/local/bin/*`)',
      'Git hook scripts (`.git/hooks/pre-commit`)',
    ],
  },
  '644': {
    securityRating: 'Standard',
    summary: 'Owner can read and write (rw-). Group and Everyone else can only read (r--).',
    description: 'chmod 644 is the default security standard for all regular files hosted on Linux web servers, including HTML, CSS, JavaScript, images, and PHP scripts. It ensures that the web server process can read and serve the file to visitors, but no external entity can overwrite or execute malicious code.',
    recommendedFor: [
      'Web assets (HTML, CSS, JS, PNG, SVG)',
      'Source code files (`.py`, `.ts`, `.php`, `.go`)',
      'Configuration files without sensitive passwords',
      'Documentation files (`README.md`, `LICENSE`)',
    ],
  },
  '777': {
    securityRating: 'Dangerous',
    summary: 'Full read, write, and execute permissions for EVERYONE on the system.',
    description: 'chmod 777 grants universal unrestricted access. Any user or compromised process can read, edit, overwrite, execute, or delete this file or directory. NEVER use chmod 777 in production environments.',
    securityWarning: 'CRITICAL SECURITY HAZARD: Using chmod 777 on web servers allows attackers to upload web shells, execute arbitrary code, and completely compromise your Linux server.',
    recommendedFor: [
      'Temporary local Docker test mounts (strictly non-production)',
      'Shared local scratch pipes during prototyping',
    ],
  },
  '700': {
    securityRating: 'Safe',
    summary: 'Owner has full control (rwx). Group and Others have ZERO permissions (---).',
    description: 'chmod 700 completely locks down a file or folder so only the specific file owner (or the root superuser) can enter the directory or execute files inside it.',
    recommendedFor: [
      'SSH configuration directory (`~/.ssh/`)',
      'Private backup directories (`/var/backups/private`)',
      'Personal user directories',
      'Root administrative scripts',
    ],
  },
  '600': {
    securityRating: 'Safe',
    summary: 'Owner can read and write (rw-). Group and Others have ZERO access (---).',
    description: 'chmod 600 is mandatory for highly sensitive private credentials. OpenSSH will actively refuse to connect if your private key does not have chmod 600 permissions.',
    recommendedFor: [
      'SSH Private Keys (`~/.ssh/id_rsa`, `~/.ssh/id_ed25519`)',
      'Database password files and `.env` files with API keys',
      'Server TLS/SSL Private Keys (`/etc/ssl/private/server.key`)',
      'GPG private keyrings',
    ],
  },
  '400': {
    securityRating: 'Safe',
    summary: 'Owner can ONLY read (r--). Group and Others have ZERO access (---).',
    description: 'chmod 400 is the most restrictive practical permission for read-only private keys. It prevents accidental overwrites or edits even by the file owner.',
    recommendedFor: [
      'Production AWS EC2 Key Pairs (`.pem` files)',
      'Immutable cryptographic signing keys',
      'Production audit certificates',
    ],
  },
  '775': {
    securityRating: 'Elevated',
    summary: 'Owner and Group have full control (rwx). Others can read and execute (r-x).',
    description: 'chmod 775 is ideal for shared team directories and web deployment directories where multiple developers belong to the same group (e.g. `www-data` or `developers`).',
    recommendedFor: [
      'Shared team web directories (`/var/www/shared`)',
      'CMS upload cache folders with group write access',
      'Collaborative build output directories',
    ],
  },
  '664': {
    securityRating: 'Standard',
    summary: 'Owner and Group can read and write (rw-). Others can only read (r--).',
    description: 'chmod 664 allows collaborative editing by team members sharing a group without granting unnecessary execution rights to static files.',
    recommendedFor: [
      'Collaborative configuration files',
      'Shared project documentation',
      'Team log files',
    ],
  },
  '660': {
    securityRating: 'Elevated',
    summary: 'Owner and Group can read and write (rw-). Others have ZERO permissions (---).',
    description: 'chmod 660 is used for confidential files that must be shared between a specific service user and a system group (e.g. web server and database daemon).',
    recommendedFor: [
      'Database unix domain sockets (`/var/run/mysqld/mysqld.sock`)',
      'Shared application log files containing sensitive telemetry',
      'Application configuration files shared across local team members',
    ],
  },
  '750': {
    securityRating: 'Safe',
    summary: 'Owner has full control (rwx). Group can read and execute (r-x). Others have ZERO access (---).',
    description: 'chmod 750 provides strong isolation. Members of the system group can access the directory or script, but unprivileged public users cannot even see the directory contents.',
    recommendedFor: [
      'Internal service directories (`/opt/myapp/`)',
      'Internal deployment scripts',
      'Shared departmental directories on multi-user servers',
    ],
  },
  '711': {
    securityRating: 'Elevated',
    summary: 'Owner has full control (rwx). Group and Others can only traverse/execute (x).',
    description: 'chmod 711 allows other users to execute files inside a directory or access subfolders if they know the exact file path, without being able to list (`ls`) the directory contents.',
    recommendedFor: [
      'User `~/public_html` home directories on shared hosting',
      'Restricted binary execution paths',
    ],
  },
  '444': {
    securityRating: 'Safe',
    summary: 'Read-only access for EVERYONE (r--r--r--), including the file owner.',
    description: 'chmod 444 locks down a file against any accidental modifications or deletions. Even the owner must explicitly alter permissions before editing.',
    recommendedFor: [
      'Read-only archives and audit logs',
      'System-wide public certificates (`ca-bundle.crt`)',
      'License files and immutable legal notices',
    ],
  },
  '555': {
    securityRating: 'Safe',
    summary: 'Read and execute for EVERYONE (r-xr-xr-x). NO ONE can write or modify.',
    description: 'chmod 555 creates immutable executable binaries and read-only searchable directories that cannot be altered or overwritten by any regular user.',
    recommendedFor: [
      'Read-only shared CD-ROM/NFS mount points',
      'Protected administrative tools and read-only binaries',
    ],
  },
  '666': {
    securityRating: 'Dangerous',
    summary: 'Read and write for EVERYONE (rw-rw-rw-). No execution rights.',
    description: 'chmod 666 allows any user on the system to overwrite, corrupt, or erase file content. Rarely recommended except for specific named pipes or dev fixtures.',
    securityWarning: 'SECURITY RISK: Any local user or malicious daemon can overwrite files with chmod 666, leading to data tampering or denial of service.',
    recommendedFor: [
      'Special FIFO pipes and local mock devices',
      'Temporary debug log fixtures',
    ],
  },
  '000': {
    securityRating: 'Safe',
    summary: 'NO permissions for ANYONE (---------). Completely inaccessible.',
    description: 'chmod 000 revokes all read, write, and execute permissions from the file. Only root or the file owner (after executing `chmod`) can restore access.',
    recommendedFor: [
      'Temporarily quarantine suspected malicious files',
      'Disabling sensitive data files during security audits',
    ],
  },
};

// 64 Core Octals used in Linux administration
const CORE_OCTALS: string[] = [
  '755', '644', '777', '700', '600', '400', '775', '664',
  '750', '660', '711', '444', '555', '666', '000', '770',
  '500', '550', '640', '744', '710', '705', '715', '740',
  '440', '404', '444', '450', '455', '470', '475', '477',
  '505', '510', '511', '554', '575', '604', '644', '645',
  '654', '655', '670', '674', '675', '677', '701', '704',
  '714', '720', '745', '751', '752', '754', '760', '764',
  '765', '766', '771', '772', '773', '774', '776', '300',
];

// Deduplicate list
const UNIQUE_OCTALS = Array.from(new Set(CORE_OCTALS));

export const CHMOD_DATA: ChmodData[] = UNIQUE_OCTALS.map((octal) => {
  const o = parseInt(octal[0], 10);
  const g = parseInt(octal[1], 10);
  const ot = parseInt(octal[2], 10);

  const ownerPerm = digitToPerms(o);
  const groupPerm = digitToPerms(g);
  const othersPerm = digitToPerms(ot);

  const symbolic = `${ownerPerm.symbol}${groupPerm.symbol}${othersPerm.symbol}`;
  const slug = `chmod-${octal}`;

  const curated = CURATED_CHMODS[octal] || {};

  // Compute security rating if not curated
  let securityRating: ChmodData['securityRating'] = curated.securityRating || 'Standard';
  if (!curated.securityRating) {
    if (othersPerm.write || (groupPerm.write && othersPerm.read && ot > 5)) {
      securityRating = 'Dangerous';
    } else if (groupPerm.write || othersPerm.execute) {
      securityRating = 'Elevated';
    } else if (!groupPerm.write && !othersPerm.write && !othersPerm.execute) {
      securityRating = 'Safe';
    }
  }

  const summary =
    curated.summary ||
    `Owner has (${ownerPerm.symbol}), Group has (${groupPerm.symbol}), and Others have (${othersPerm.symbol}).`;

  const description =
    curated.description ||
    `chmod ${octal} (${symbolic}) configures specific Linux permission bits where the owner receives numeric value ${o}, the group receives ${g}, and public users receive ${ot}. Total combined mask is ${octal}.`;

  const recommendedFor =
    curated.recommendedFor || [
      `Files requiring owner ${ownerPerm.symbol} and group ${groupPerm.symbol}`,
      `Restricted scripts and utilities`,
      `Custom deployment configurations`,
    ];

  const securityWarning =
    curated.securityWarning ||
    (othersPerm.write
      ? `SECURITY WARNING: The 'Others' octal digit is ${ot}, giving public write access. Avoid this on public web servers.`
      : undefined);

  return {
    octal,
    slug,
    symbolic,
    owner: { read: ownerPerm.read, write: ownerPerm.write, execute: ownerPerm.execute },
    group: { read: groupPerm.read, write: groupPerm.write, execute: groupPerm.execute },
    others: { read: othersPerm.read, write: othersPerm.write, execute: othersPerm.execute },
    securityRating,
    summary,
    description,
    recommendedFor,
    securityWarning,
    commands: {
      singleFile: `chmod ${octal} target_file`,
      recursive: `chmod -R ${octal} /path/to/folder`,
      findDirectories: `find /path/to/folder -type d -exec chmod ${octal} {} +`,
      findFiles: `find /path/to/folder -type f -exec chmod ${octal} {} +`,
    },
  };
});

export function getAllChmods(): ChmodData[] {
  return CHMOD_DATA;
}

export function getChmodBySlug(slug: string): ChmodData | undefined {
  return CHMOD_DATA.find((c) => c.slug === slug);
}

export function getChmodByOctal(octal: string): ChmodData | undefined {
  return CHMOD_DATA.find((c) => c.octal === octal);
}
