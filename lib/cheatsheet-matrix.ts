export interface CheatSheetCommand {
  command: string;
  description: string;
  example?: string;
  tags?: string[];
}

export interface CheatSheetSection {
  title: string;
  items: CheatSheetCommand[];
}

export interface CheatSheetDefinition {
  slug: string;
  title: string;
  category: 'git' | 'docker' | 'linux' | 'database' | 'web' | 'terminal' | 'devops' | 'python' | 'css';
  description: string;
  sections: CheatSheetSection[];
  faqs: { question: string; answer: string }[];
}

export const CHEATSHEETS: CheatSheetDefinition[] = [
  {
    slug: 'git-commands-cheat-sheet',
    title: 'Git Commands & Workflow Cheat Sheet',
    category: 'git',
    description: 'The definitive Git command reference for developers. Covers cloning, branching, staging, rebasing, stashing, and conflict resolution.',
    sections: [
      {
        title: 'Repository Setup & Staging',
        items: [
          { command: 'git init', description: 'Initialize a brand new local Git repository in current directory' },
          { command: 'git clone <url>', description: 'Clone a remote repository with full history' },
          { command: 'git status', description: 'Show the working tree status, staged and unstaged files' },
          { command: 'git add .', description: 'Stage all modified, new, and deleted files for next commit' },
          { command: 'git commit -m "feat: message"', description: 'Commit staged changes with a descriptive message' },
        ],
      },
      {
        title: 'Branching & Merging',
        items: [
          { command: 'git branch', description: 'List all local branches' },
          { command: 'git checkout -b <branch-name>', description: 'Create a new branch and immediately switch to it' },
          { command: 'git switch <branch-name>', description: 'Modern command to switch branches cleanly' },
          { command: 'git merge <branch-name>', description: 'Merge specified branch into current active branch' },
          { command: 'git branch -d <branch-name>', description: 'Safely delete a merged local branch' },
        ],
      },
      {
        title: 'Undoing Changes & Stashing',
        items: [
          { command: 'git stash', description: 'Temporarily shelve uncommitted dirty working changes' },
          { command: 'git stash pop', description: 'Restore previously stashed changes and remove from stash list' },
          { command: 'git reset --soft HEAD~1', description: 'Undo last commit but keep changes staged in working directory' },
          { command: 'git reset --hard HEAD~1', description: 'Permanently discard last commit and uncommitted changes (destructive)' },
          { command: 'git revert <commit-hash>', description: 'Safely undo changes by creating a new inverse commit' },
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the difference between git merge and git rebase?',
        answer: 'Git merge preserves the complete chronological history including branch nodes, while git rebase re-applies your commits on top of another branch, resulting in a cleaner linear project history.',
      },
      {
        question: 'How do I undo a commit pushed to remote?',
        answer: 'Use git revert <commit_hash> to create a new commit that reverses the unwanted changes without rewriting shared Git history.',
      },
    ],
  },
  {
    slug: 'docker-cli-cheat-sheet',
    title: 'Docker CLI Commands Cheat Sheet',
    category: 'docker',
    description: 'Essential Docker commands for container lifecycle, image building, volume management, and docker-compose workflows.',
    sections: [
      {
        title: 'Container Lifecycle',
        items: [
          { command: 'docker run -d -p 8080:80 --name web nginx:alpine', description: 'Run container in background with port mapping' },
          { command: 'docker ps', description: 'List currently running containers' },
          { command: 'docker ps -a', description: 'List all containers including stopped ones' },
          { command: 'docker stop <container_id>', description: 'Gracefully stop a running container (SIGTERM)' },
          { command: 'docker rm -f <container_id>', description: 'Force kill and remove a container' },
          { command: 'docker logs -f --tail 100 <container>', description: 'Follow real-time stdout/stderr container logs' },
          { command: 'docker exec -it <container> sh', description: 'Open an interactive shell inside a running container' },
        ],
      },
      {
        title: 'Image Management & Building',
        items: [
          { command: 'docker build -t my-app:latest .', description: 'Build a Docker image from Dockerfile in current directory' },
          { command: 'docker images', description: 'List all locally downloaded and built images' },
          { command: 'docker rmi <image_id>', description: 'Remove an image from local storage' },
          { command: 'docker system prune -af --volumes', description: 'Reclaim disk space: delete unused containers, networks, images, and volumes' },
        ],
      },
    ],
    faqs: [
      {
        question: 'How do I clean up all unused Docker resources?',
        answer: 'Run docker system prune -af --volumes to remove all stopped containers, unused networks, dangling images, and build caches.',
      },
    ],
  },
  {
    slug: 'linux-chmod-permissions-cheat-sheet',
    title: 'Linux chmod File Permissions Cheat Sheet',
    category: 'linux',
    description: 'Clear reference for Linux numeric (octal) and symbolic file permissions (rwx, 777, 755, 644, 600).',
    sections: [
      {
        title: 'Common Numeric Permissions',
        items: [
          { command: 'chmod 755 <directory>', description: 'Standard directories: Owner read/write/execute; Group & Others read/execute' },
          { command: 'chmod 644 <file>', description: 'Standard files: Owner read/write; Group & Others read only' },
          { command: 'chmod 600 ~/.ssh/id_rsa', description: 'SSH Private Keys: Owner read/write only; zero access to others' },
          { command: 'chmod 700 ~/.ssh', description: 'SSH Directory: Owner read/write/execute only' },
          { command: 'chmod 777 <file>', description: 'Full access to Everyone: High security risk, avoid in production' },
          { command: 'chmod +x script.sh', description: 'Make shell script executable by all users' },
        ],
      },
      {
        title: 'Permission Octal Calculations',
        items: [
          { command: 'Read (r) = 4', description: 'Allows viewing file contents or listing directory' },
          { command: 'Write (w) = 2', description: 'Allows modifying or deleting file contents' },
          { command: 'Execute (x) = 1', description: 'Allows running program or traversing into directory' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Why should I never use chmod 777 in production?',
        answer: 'chmod 777 grants read, write, and execute permissions to all users and processes on the server. If an attacker gains minimal web access, they can overwrite or execute malicious code.',
      },
    ],
  },
  {
    slug: 'sql-queries-cheat-sheet',
    title: 'SQL Queries & Joins Cheat Sheet',
    category: 'database',
    description: 'Comprehensive guide to SQL queries, table joins (INNER, LEFT, RIGHT, FULL), grouping, aggregations, and subqueries.',
    sections: [
      {
        title: 'Querying & Filtering',
        items: [
          { command: 'SELECT * FROM users WHERE status = "active" ORDER BY created_at DESC LIMIT 10;', description: 'Fetch latest 10 active users' },
          { command: 'SELECT DISTINCT country FROM customers;', description: 'Return unique values without duplicates' },
          { command: 'SELECT * FROM products WHERE price BETWEEN 10 AND 50 AND category IN ("tech", "dev");', description: 'Range and list filtering' },
          { command: 'SELECT COUNT(*), AVG(salary), MAX(salary) FROM employees GROUP BY department_id;', description: 'Aggregate calculations grouped by department' },
        ],
      },
      {
        title: 'Table Joins',
        items: [
          { command: 'SELECT u.name, o.total FROM users u INNER JOIN orders o ON u.id = o.user_id;', description: 'INNER JOIN: Returns rows when matching keys exist in both tables' },
          { command: 'SELECT u.name, o.total FROM users u LEFT JOIN orders o ON u.id = o.user_id;', description: 'LEFT JOIN: Returns all users, plus matching orders if they exist' },
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the difference between WHERE and HAVING in SQL?',
        answer: 'WHERE filters rows before any groupings or aggregations are calculated, while HAVING filters grouped rows after GROUP BY aggregations.',
      },
    ],
  },
  {
    slug: 'bash-shortcuts-cheat-sheet',
    title: 'Bash & Zsh Terminal Shortcuts Cheat Sheet',
    category: 'terminal',
    description: 'Essential terminal keyboard shortcuts to speed up CLI productivity on Linux, macOS, and WSL.',
    sections: [
      {
        title: 'Cursor Navigation',
        items: [
          { command: 'Ctrl + A', description: 'Move cursor to beginning of the line' },
          { command: 'Ctrl + E', description: 'Move cursor to end of the line' },
          { command: 'Alt + F / Esc + F', description: 'Move cursor forward one word' },
          { command: 'Alt + B / Esc + B', description: 'Move cursor backward one word' },
          { command: 'Ctrl + L', description: 'Clear terminal screen (equivalent to clear command)' },
        ],
      },
      {
        title: 'Editing & Command History',
        items: [
          { command: 'Ctrl + U', description: 'Cut everything from cursor to the start of line' },
          { command: 'Ctrl + K', description: 'Cut everything from cursor to the end of line' },
          { command: 'Ctrl + Y', description: 'Paste previously cut text' },
          { command: 'Ctrl + R', description: 'Reverse interactive search through past command history' },
          { command: '!!', description: 'Repeat the last executed command (e.g. sudo !!)' },
        ],
      },
    ],
    faqs: [
      {
        question: 'How do I run the previous command with sudo?',
        answer: 'Type sudo !! and press Enter. The exclamation marks automatically expand to the last executed command in Bash/Zsh.',
      },
    ],
  },
  {
    slug: 'kubernetes-kubectl-cheat-sheet',
    title: 'Kubernetes (kubectl) Commands Cheat Sheet',
    category: 'devops',
    description: 'Comprehensive kubectl commands cheat sheet for managing Kubernetes clusters, pods, deployments, services, ingress, and configmaps.',
    sections: [
      {
        title: 'Cluster & Nodes',
        items: [
          { command: 'kubectl cluster-info', description: 'Display cluster endpoint addresses and core services' },
          { command: 'kubectl get nodes -o wide', description: 'List all worker and master nodes with OS, kernel, and internal IPs' },
          { command: 'kubectl describe node <node-name>', description: 'Inspect CPU/memory allocation, conditions, and taints on a node' },
          { command: 'kubectl top nodes', description: 'View current CPU and memory consumption per node' },
        ],
      },
      {
        title: 'Pods & Debugging',
        items: [
          { command: 'kubectl get pods -A', description: 'List all running pods across all namespaces' },
          { command: 'kubectl get pods -l app=backend -w', description: 'Watch status updates for pods matching label app=backend in real-time' },
          { command: 'kubectl logs -f <pod-name> -c <container>', description: 'Stream live stdout/stderr log output from specific pod container' },
          { command: 'kubectl exec -it <pod-name> -- /bin/sh', description: 'Open interactive bash/sh shell session inside running container' },
          { command: 'kubectl port-forward <pod-name> 8080:80', description: 'Forward local port 8080 directly to port 80 on remote pod' },
        ],
      },
      {
        title: 'Deployments & Scaling',
        items: [
          { command: 'kubectl rollout restart deployment/<name>', description: 'Perform rolling restart of all pods in a deployment with zero downtime' },
          { command: 'kubectl scale deployment/<name> --replicas=5', description: 'Scale deployment replica count up or down instantly' },
          { command: 'kubectl rollout status deployment/<name>', description: 'Check the real-time rollout status of a new image release' },
          { command: 'kubectl rollout undo deployment/<name>', description: 'Rollback deployment to immediately preceding revision' },
        ],
      },
    ],
    faqs: [
      {
        question: 'How do I quickly switch namespaces in kubectl?',
        answer: 'You can run `kubectl config set-context --current --namespace=<namespace-name>` to change your default active namespace without typing -n on every command.',
      },
    ],
  },
  {
    slug: 'python-syntax-cheat-sheet',
    title: 'Python 3 Modern Syntax & Standard Methods Cheat Sheet',
    category: 'python',
    description: 'Quick reference guide for Python 3 syntax, list/dict comprehensions, slicing, unpacking, decorators, and context managers.',
    sections: [
      {
        title: 'Data Structures & Comprehensions',
        items: [
          { command: '[x**2 for x in nums if x % 2 == 0]', description: 'List comprehension with conditional filtering' },
          { command: '{k: v.upper() for k, v in data.items()}', description: 'Dictionary comprehension transforming keys and values' },
          { command: 'nums[::-1]', description: 'Reverse list, tuple, or string in O(N) using slice step -1' },
          { command: 'merged = {**dict_a, **dict_b} # or dict_a | dict_b', description: 'Merge two dictionaries into a single new dict' },
        ],
      },
      {
        title: 'Useful Built-ins & Itertools',
        items: [
          { command: 'enumerate(iterable, start=0)', description: 'Loop over collection yielding index and item pair' },
          { command: 'zip(names, ages, strict=True)', description: 'Pair elements across multiple iterables concurrently' },
          { command: 'sorted(users, key=lambda u: u["age"], reverse=True)', description: 'Sort collection by specific attribute or key callback' },
          { command: 'from collections import defaultdict, Counter', description: 'Specialized containers for auto-defaulting keys and tallying frequencies' },
        ],
      },
      {
        title: 'Context Managers & File I/O',
        items: [
          { command: 'with open("file.json", "r", encoding="utf-8") as f: data = json.load(f)', description: 'Safely read file with automatic descriptor cleanup' },
          { command: 'with open("output.txt", "w") as f: f.write("Hello World")', description: 'Safely write file content with auto-close' },
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the fastest way to format strings in modern Python?',
        answer: 'Use f-strings (e.g. f"Hello {name}, score is {score:.2f}"). Introduced in Python 3.6, they are evaluated at runtime directly in bytecode and are faster than % formatting or str.format().',
      },
    ],
  },
  {
    slug: 'css-flexbox-cheat-sheet',
    title: 'CSS Flexbox Layout Properties Cheat Sheet',
    category: 'css',
    description: 'Complete visual and syntax reference for CSS Flexible Box layout properties on parent containers and flex children.',
    sections: [
      {
        title: 'Parent Container Properties',
        items: [
          { command: 'display: flex | inline-flex;', description: 'Defines container as flex formatting context' },
          { command: 'flex-direction: row | row-reverse | column | column-reverse;', description: 'Defines main axis direction along which items are arranged' },
          { command: 'justify-content: flex-start | center | flex-end | space-between | space-around | space-evenly;', description: 'Aligns flex items along the main axis' },
          { command: 'align-items: stretch | flex-start | center | flex-end | baseline;', description: 'Aligns flex items along the cross axis' },
          { command: 'flex-wrap: nowrap | wrap | wrap-reverse;', description: 'Controls whether flex items are forced into single line or wrap' },
          { command: 'gap: 1rem 1.5rem; /* row-gap column-gap */', description: 'Defines gutter spacing between flex items without negative margins' },
        ],
      },
      {
        title: 'Child Item Properties',
        items: [
          { command: 'flex: 1 1 auto; /* grow shrink basis */', description: 'Shorthand for flex-grow, flex-shrink, and flex-basis' },
          { command: 'flex-grow: 1;', description: 'Defines ability for flex item to grow if extra space is available' },
          { command: 'flex-shrink: 0;', description: 'Prevents flex item from shrinking smaller than its intrinsic width' },
          { command: 'align-self: auto | flex-start | center | flex-end | baseline | stretch;', description: 'Allows individual flex item to override parent align-items' },
          { command: 'order: 2;', description: 'Controls visual display order of items without altering HTML source' },
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the most modern way to center a div both horizontally and vertically?',
        answer: 'On parent: `display: flex; justify-content: center; align-items: center;` or with CSS Grid: `display: grid; place-items: center;`.',
      },
    ],
  },
  {
    slug: 'css-grid-cheat-sheet',
    title: 'CSS Grid Layout Syntax & Template Cheat Sheet',
    category: 'css',
    description: 'Essential CSS Grid cheatsheet covering two-dimensional tracks, grid-template-columns, fr units, minmax, auto-fit, and gap.',
    sections: [
      {
        title: 'Grid Tracks & Columns',
        items: [
          { command: 'grid-template-columns: repeat(3, 1fr);', description: 'Create 3 equal-width flexible columns across available container width' },
          { command: 'grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));', description: 'The golden responsive grid rule: wraps cards automatically without media queries' },
          { command: 'grid-template-rows: auto 1fr auto;', description: 'Classic sticky-footer holy grail layout (header, flexible body, footer)' },
          { command: 'gap: 1.5rem;', description: 'Sets gutter spacing between both grid rows and grid columns' },
        ],
      },
      {
        title: 'Item Placement & Spanning',
        items: [
          { command: 'grid-column: span 2;', description: 'Span item across 2 column tracks' },
          { command: 'grid-column: 1 / -1;', description: 'Span item across the entire full width of all columns from edge to edge' },
          { command: 'place-items: center;', description: 'Shorthand to align-items: center and justify-items: center in one declaration' },
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the difference between auto-fit and auto-fill in CSS Grid?',
        answer: 'Auto-fill creates as many empty column tracks as can fit in the row, while auto-fit collapses empty tracks down to 0px and stretches active items to fill the entire remaining space.',
      },
    ],
  },
  {
    slug: 'nginx-configuration-cheat-sheet',
    title: 'Nginx Web Server & Reverse Proxy Configuration Cheat Sheet',
    category: 'devops',
    description: 'Nginx configuration reference for reverse proxying, SSL/TLS certificates, WebSocket upgrades, rate limiting, and gzip compression.',
    sections: [
      {
        title: 'Reverse Proxy & Node.js / Python Upstream',
        items: [
          { command: 'proxy_pass http://127.0.0.1:3000;', description: 'Forward HTTP requests to backend application service' },
          { command: 'proxy_set_header Host $host;', description: 'Preserve original client Host request header' },
          { command: 'proxy_set_header X-Real-IP $remote_addr;', description: 'Pass original client IP address through proxy layers' },
          { command: 'proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;', description: 'Append client IP to proxy chain header' },
          { command: 'proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection "upgrade";', description: 'Enable bidirectional WebSocket connection upgrades' },
        ],
      },
      {
        title: 'Security Headers & Gzip Compression',
        items: [
          { command: 'add_header X-Frame-Options "SAMEORIGIN" always;', description: 'Prevent clickjacking attacks by blocking unauthorized iframing' },
          { command: 'add_header X-Content-Type-Options "nosniff" always;', description: 'Prevent MIME-type sniffing by browsers' },
          { command: 'gzip on; gzip_types text/plain text/css application/json application/javascript text/xml;', description: 'Enable on-the-fly HTTP gzip compression for static assets' },
          { command: 'nginx -t', description: 'Test nginx configuration files for syntax errors without restarting service' },
          { command: 'nginx -s reload', description: 'Gracefully reload configuration without dropping active connections' },
        ],
      },
    ],
    faqs: [
      {
        question: 'How do I test my Nginx config before reloading?',
        answer: 'Always run `sudo nginx -t`. It validates the syntax of all included configuration files and reports the exact line number of any syntax error.',
      },
    ],
  },
  {
    slug: 'http-status-codes-cheat-sheet',
    title: 'HTTP Status Codes & REST API Response Codes Cheat Sheet',
    category: 'web',
    description: 'The complete HTTP status code reference guide for web developers and API designers. Covers 1xx, 2xx, 3xx, 4xx, and 5xx responses.',
    sections: [
      {
        title: '2xx Success Responses',
        items: [
          { command: '200 OK', description: 'Standard response for successful HTTP GET, PUT, or POST requests' },
          { command: '201 Created', description: 'Resource was successfully created (standard for POST resource creation)' },
          { command: '204 No Content', description: 'Request succeeded but server sends no response body (common for DELETE)' },
        ],
      },
      {
        title: '3xx Redirection Responses',
        items: [
          { command: '301 Moved Permanently', description: 'Resource permanently moved to new URL (passes SEO link equity)' },
          { command: '302 Found (Temporary)', description: 'Resource temporarily located at a different URL' },
          { command: '304 Not Modified', description: 'Client cached version is still fresh and valid (ETag / If-Modified-Since)' },
        ],
      },
      {
        title: '4xx Client Errors',
        items: [
          { command: '400 Bad Request', description: 'Server cannot process request due to client error (invalid JSON / malformed syntax)' },
          { command: '401 Unauthorized', description: 'Authentication is required and has either failed or not yet been provided' },
          { command: '403 Forbidden', description: 'Client identity is known, but server refuses authorization to access resource' },
          { command: '404 Not Found', description: 'Server cannot find the requested URL resource' },
          { command: '422 Unprocessable Entity', description: 'Semantic validation failed (correct JSON syntax, but invalid field values)' },
          { command: '429 Too Many Requests', description: 'Client has sent too many requests in given timeframe (Rate Limited)' },
        ],
      },
      {
        title: '5xx Server Errors',
        items: [
          { command: '500 Internal Server Error', description: 'Generic unhandled server crash or runtime exception' },
          { command: '502 Bad Gateway', description: 'Proxy or edge gateway received an invalid response from upstream server' },
          { command: '503 Service Unavailable', description: 'Server is currently unable to handle request due to overload or maintenance' },
          { command: '504 Gateway Timeout', description: 'Upstream server failed to respond to proxy within configured timeout limit' },
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the exact difference between 401 Unauthorized and 403 Forbidden?',
        answer: '401 means "Unauthenticated": the user is not logged in or token is invalid. 403 means "Forbidden": the user is logged in, but their account or role does not have permission to access that resource.',
      },
    ],
  },
];

export function getAllCheatSheets(): CheatSheetDefinition[] {
  return CHEATSHEETS;
}

export function getCheatSheetBySlug(slug: string): CheatSheetDefinition | null {
  return CHEATSHEETS.find((c) => c.slug === slug) || null;
}
