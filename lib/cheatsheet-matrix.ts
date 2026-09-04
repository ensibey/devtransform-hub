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
  {
    slug: 'vim-editor-cheat-sheet',
    title: 'Vim & Neovim Commands Cheat Sheet',
    category: 'terminal',
    description: 'Comprehensive keyboard shortcut and command reference for Vim and Neovim. Modes, navigation, editing, search/replace, and buffers.',
    sections: [
      {
        title: 'Exiting & Saving',
        items: [
          { command: ':w', description: 'Write (save) current file without quitting' },
          { command: ':q', description: 'Quit Vim (fails if unsaved changes exist)' },
          { command: ':wq or :x or ZZ', description: 'Write changes and quit Vim' },
          { command: ':q!', description: 'Quit immediately and discard all unsaved changes' },
        ],
      },
      {
        title: 'Navigation & Cursor Movement',
        items: [
          { command: 'h / j / k / l', description: 'Move left, down, up, right' },
          { command: 'w / b', description: 'Jump forward / backward to start of next word' },
          { command: 'e / ge', description: 'Jump to end of next / previous word' },
          { command: '0 / $', description: 'Jump to absolute beginning / end of line' },
          { command: '^', description: 'Jump to first non-blank character of line' },
          { command: 'gg / G', description: 'Jump to very first / very last line of file' },
          { command: ':<number> or <number>G', description: 'Jump directly to line number' },
        ],
      },
      {
        title: 'Editing & Manipulating Text',
        items: [
          { command: 'i / a', description: 'Insert mode before cursor / append mode after cursor' },
          { command: 'o / O', description: 'Open new line below / above and enter insert mode' },
          { command: 'x', description: 'Delete character under cursor' },
          { command: 'dd / <number>dd', description: 'Delete (cut) current line / multiple lines' },
          { command: 'yy / <number>yy', description: 'Yank (copy) current line / multiple lines' },
          { command: 'p / P', description: 'Paste after / before cursor' },
          { command: 'u / Ctrl+r', description: 'Undo last change / redo change' },
          { command: 'cw', description: 'Change word (deletes word and enters insert mode)' },
        ],
      },
      {
        title: 'Search & Replace',
        items: [
          { command: '/pattern', description: 'Search forward for pattern' },
          { command: '?pattern', description: 'Search backward for pattern' },
          { command: 'n / N', description: 'Repeat search in same / opposite direction' },
          { command: ':%s/old/new/g', description: 'Substitute all occurrences of old with new across entire file' },
          { command: ':%s/old/new/gc', description: 'Substitute with interactive confirmation prompt for each occurrence' },
        ],
      },
    ],
    faqs: [
      {
        question: 'How do I safely exit Vim without saving broken edits?',
        answer: 'Press `Esc` multiple times to ensure you are in Normal mode, then type `:q!` and press `Enter` to force quit without saving.',
      },
    ],
  },
  {
    slug: 'mongodb-queries-cheat-sheet',
    title: 'MongoDB Query & Aggregation Pipeline Cheat Sheet',
    category: 'database',
    description: 'Essential MongoDB syntax reference for developers. Covers CRUD operations, query filters, projection, indexing, and aggregation pipelines.',
    sections: [
      {
        title: 'Read & Filter Operations',
        items: [
          { command: 'db.collection.find()', description: 'Find all documents in collection' },
          { command: 'db.collection.find({ status: "active" })', description: 'Filter documents by exact field value' },
          { command: 'db.collection.find({ age: { $gte: 18, $lte: 65 } })', description: 'Filter with comparison operators ($gte, $lte, $ne, $in)' },
          { command: 'db.collection.find({ tags: { $all: ["react", "node"] } })', description: 'Filter array field matching all specified elements' },
          { command: 'db.collection.find({}, { name: 1, email: 1, _id: 0 })', description: 'Projection: include name and email, exclude _id' },
          { command: 'db.collection.find().sort({ createdAt: -1 }).limit(10)', description: 'Sort descending (-1) or ascending (1) with pagination limit' },
        ],
      },
      {
        title: 'Create & Update Operations',
        items: [
          { command: 'db.collection.insertOne({ ... })', description: 'Insert single JSON document into collection' },
          { command: 'db.collection.insertMany([{ ... }, { ... }])', description: 'Insert batch array of documents' },
          { command: 'db.collection.updateOne({ _id }, { $set: { status: "verified" } })', description: 'Update specific field without overwriting document' },
          { command: 'db.collection.updateMany({}, { $inc: { views: 1 } })', description: 'Atomically increment numerical field on matching records' },
          { command: 'db.collection.updateOne({ email }, { $set: { lastLogin: new Date() } }, { upsert: true })', description: 'Update document if found, or insert if does not exist' },
        ],
      },
      {
        title: 'Aggregation Pipeline',
        items: [
          { command: '$match: { status: "paid" }', description: 'Filter stream documents before grouping or projection' },
          { command: '$group: { _id: "$userId", total: { $sum: "$amount" } }', description: 'Group documents and calculate aggregate sums, averages, or counts' },
          { command: '$sort: { total: -1 }', description: 'Sort grouped stream results' },
          { command: '$lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" }', description: 'Perform left outer join with another collection' },
          { command: '$unwind: "$tags"', description: 'Deconstruct array field into separate document for each element' },
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the performance difference between $set and replacing a document in MongoDB?',
        answer: '`$set` only modifies the specified fields in place without transferring the entire document over the network or touching unmodified fields, dramatically reducing network IO and write locks.',
      },
    ],
  },
  {
    slug: 'regex-patterns-cheat-sheet',
    title: 'Regular Expressions (Regex) Syntax & Patterns Cheat Sheet',
    category: 'web',
    description: 'Quick reference guide for Regular Expressions. Character classes, quantifiers, anchors, capture groups, lookarounds, and common developer patterns.',
    sections: [
      {
        title: 'Character Classes & Quantifiers',
        items: [
          { command: '.', description: 'Matches any single character except newline' },
          { command: '\\d / \\D', description: 'Matches any digit (0-9) / non-digit' },
          { command: '\\w / \\W', description: 'Matches word character (alphanumeric + underscore) / non-word character' },
          { command: '\\s / \\S', description: 'Matches whitespace (space, tab, newline) / non-whitespace' },
          { command: '[a-z0-9]', description: 'Matches any character within specified character set' },
          { command: '[^a-z]', description: 'Negated character set: matches any character NOT in set' },
          { command: '* / + / ?', description: 'Match 0 or more / 1 or more / 0 or 1 occurrence' },
          { command: '{n,m}', description: 'Match between n and m occurrences' },
        ],
      },
      {
        title: 'Anchors & Assertions',
        items: [
          { command: '^ / $', description: 'Start of string / end of string anchor' },
          { command: '\\b / \\B', description: 'Word boundary / non-word boundary' },
          { command: '(?=abc)', description: 'Positive lookahead: asserts abc follows' },
          { command: '(?!abc)', description: 'Negative lookahead: asserts abc does not follow' },
          { command: '(?<=abc)', description: 'Positive lookbehind: asserts preceded by abc' },
          { command: '(?<!abc)', description: 'Negative lookbehind: asserts not preceded by abc' },
        ],
      },
      {
        title: 'Common Production Regex Patterns',
        items: [
          { command: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$', description: 'Standard Email Address validator' },
          { command: '^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$', description: 'Web URL with optional HTTP/HTTPS scheme' },
          { command: '^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$', description: 'Strong password (minimum 8 chars, 1 letter, 1 number, 1 special)' },
          { command: '^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$', description: 'Hex Color code (#fff or #4f46e5)' },
          { command: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$', description: 'ISO 8601 Date (YYYY-MM-DD)' },
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the difference between greedy and lazy quantifiers in regex?',
        answer: 'Greedy quantifiers (like `.*`) match as many characters as possible before stopping, while lazy quantifiers (like `.*?`) match as few characters as needed to satisfy the match condition.',
      },
    ],
  },
  {
    slug: 'curl-commands-cheat-sheet',
    title: 'cURL Command Line HTTP Request Cheat Sheet',
    category: 'terminal',
    description: 'The definitive cURL CLI cheat sheet for testing APIs and microservices. Headers, JSON payloads, file uploads, authentication, and debug tracing.',
    sections: [
      {
        title: 'Basic HTTP Methods',
        items: [
          { command: 'curl https://api.example.com/items', description: 'Standard HTTP GET request and print response to stdout' },
          { command: 'curl -I https://example.com', description: 'Fetch HTTP response headers only (HEAD request)' },
          { command: 'curl -X POST https://api.example.com/items -d "name=Test"', description: 'HTTP POST request with url-encoded form body' },
          { command: 'curl -X PUT https://api.example.com/items/1 -d "name=Updated"', description: 'HTTP PUT request' },
          { command: 'curl -X DELETE https://api.example.com/items/1', description: 'HTTP DELETE request' },
        ],
      },
      {
        title: 'JSON API Requests & Headers',
        items: [
          { command: 'curl -X POST https://api.example.com/users -H "Content-Type: application/json" -d \'{"name":"Ada"}\'', description: 'POST JSON payload with Content-Type header' },
          { command: 'curl -H "Authorization: Bearer <token>" https://api.example.com/secure', description: 'Authenticated request using Bearer token header' },
          { command: 'curl -u username:password https://api.example.com', description: 'Basic HTTP Authentication' },
          { command: 'curl -H "Accept: application/json" https://api.example.com', description: 'Specify Accept header for API response format' },
        ],
      },
      {
        title: 'Files, Redirects & Debugging',
        items: [
          { command: 'curl -L https://example.com/redirect', description: 'Follow HTTP 301/302 redirects automatically' },
          { command: 'curl -o filename.zip https://example.com/archive.zip', description: 'Download remote file and save to local disk' },
          { command: 'curl -F "file=@/path/to/image.png" https://api.example.com/upload', description: 'Upload file via multipart/form-data' },
          { command: 'curl -v https://api.example.com', description: 'Verbose mode showing TLS handshake, request and response headers' },
          { command: 'curl -sS https://api.example.com', description: 'Silent mode but still show errors if connection fails' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Why does curl not follow redirects by default?',
        answer: 'By default, curl only fetches the requested URL. You must provide the `-L` (or `--location`) flag to instruct curl to follow 3xx redirect headers to the target endpoint.',
      },
    ],
  },
  {
    slug: 'linux-systemctl-systemd-cheat-sheet',
    title: 'Linux systemctl & journalctl (systemd) Cheat Sheet',
    category: 'linux',
    description: 'Essential systemd command reference for Linux server administrators. Managing services, units, boot targets, timers, and streaming system logs.',
    sections: [
      {
        title: 'Service Lifecycle Management',
        items: [
          { command: 'sudo systemctl start <service>', description: 'Start a stopped system service immediately' },
          { command: 'sudo systemctl stop <service>', description: 'Stop a running system service immediately' },
          { command: 'sudo systemctl restart <service>', description: 'Stop and restart service' },
          { command: 'sudo systemctl reload <service>', description: 'Reload configuration without dropping active connections' },
          { command: 'sudo systemctl status <service>', description: 'View service state, PID, memory, and recent log messages' },
        ],
      },
      {
        title: 'Enabling on Boot & Daemon Reload',
        items: [
          { command: 'sudo systemctl enable <service>', description: 'Configure service to automatically launch on system boot' },
          { command: 'sudo systemctl disable <service>', description: 'Prevent service from launching on system boot' },
          { command: 'sudo systemctl daemon-reload', description: 'Reload all systemd unit configuration files after editing' },
          { command: 'systemctl is-active <service>', description: 'Returns 0 if service is currently running (script friendly)' },
          { command: 'systemctl is-enabled <service>', description: 'Check if service is configured to launch on boot' },
        ],
      },
      {
        title: 'Streaming Logs with journalctl',
        items: [
          { command: 'journalctl -u <service> -f', description: 'Follow live streaming log output for a specific service' },
          { command: 'journalctl -u <service> -n 100', description: 'Show the last 100 log lines for a specific service' },
          { command: 'journalctl -u <service> --since "1 hour ago"', description: 'Filter logs generated within the last hour' },
          { command: 'journalctl -p err -b', description: 'Show all error-level logs from current boot session' },
          { command: 'sudo journalctl --vacuum-time=3d', description: 'Clean up journal logs older than 3 days to free disk space' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Why do I need to run systemctl daemon-reload?',
        answer: 'systemd caches unit files in memory. If you edit, create, or delete a `.service` file under `/etc/systemd/system/`, you must execute `systemctl daemon-reload` so systemd re-reads the updated configuration.',
      },
    ],
  },
  {
    slug: 'postgresql-psql-cheat-sheet',
    title: 'PostgreSQL & psql CLI Meta-Commands Cheat Sheet',
    category: 'database',
    description: 'The complete reference for PostgreSQL developers and DBAs. Essential psql slash commands, table inspection, roles, databases, and backup tools.',
    sections: [
      {
        title: 'Connecting & Navigation Meta-Commands',
        items: [
          { command: 'psql -U username -d dbname -h localhost', description: 'Connect to PostgreSQL server from terminal' },
          { command: '\\l or \\l+', description: 'List all databases with owner, encoding, and size' },
          { command: '\\c <database>', description: 'Connect / switch to a different database' },
          { command: '\\dt or \\dt+', description: 'List all tables in current schema with disk sizes' },
          { command: '\\d <table_name>', description: 'Describe table columns, types, indexes, and constraints' },
          { command: '\\dn', description: 'List all schemas in database' },
          { command: '\\du', description: 'List all database users, roles, and assigned permissions' },
          { command: '\\x', description: 'Toggle expanded display mode (ideal for wide tables)' },
          { command: '\\q', description: 'Quit psql terminal interface' },
        ],
      },
      {
        title: 'Performance & Diagnostic Queries',
        items: [
          { command: 'EXPLAIN ANALYZE SELECT ...;', description: 'Execute query and show actual execution plan and node timings' },
          { command: 'SELECT pg_size_pretty(pg_database_size(\'db\'));', description: 'Get human-readable total database size on disk' },
          { command: 'SELECT * FROM pg_stat_activity WHERE state != \'idle\';', description: 'View all currently active executing queries and connections' },
          { command: 'SELECT pg_cancel_backend(pid);', description: 'Safely cancel a slow running query by process ID' },
          { command: 'VACUUM (VERBOSE, ANALYZE);', description: 'Reclaim dead tuple storage and update query planner statistics' },
        ],
      },
      {
        title: 'Backup & Restore Utilities',
        items: [
          { command: 'pg_dump -U user -d dbname -F c -f backup.dump', description: 'Export compressed custom-format binary database backup' },
          { command: 'pg_restore -U user -d dbname -v backup.dump', description: 'Restore custom-format backup file into database' },
          { command: 'pg_dumpall -U postgres > full_cluster.sql', description: 'Dump entire PostgreSQL cluster including global roles' },
        ],
      },
    ],
    faqs: [
      {
        question: 'What is the benefit of EXPLAIN ANALYZE over plain EXPLAIN in PostgreSQL?',
        answer: 'Plain `EXPLAIN` only shows the optimizer\'s theoretical cost estimate without running the query, whereas `EXPLAIN ANALYZE` actually executes the SQL query, measuring real wall-clock runtime, index scans, and row counts.',
      },
    ],
  },
  {
    slug: 'redis-cli-commands-cheat-sheet',
    title: 'Redis CLI Commands & In-Memory Data Structures Cheat Sheet',
    category: 'database',
    description: 'Comprehensive Redis command reference for developers. Keys, Strings, Hashes, Lists, Sets, Sorted Sets, Pub/Sub, and Server Monitoring.',
    sections: [
      {
        title: 'Key Expiration & Strings',
        items: [
          { command: 'SET key "value" EX 3600', description: 'Set string key with automatic 1-hour expiration (TTL)' },
          { command: 'GET key', description: 'Retrieve value stored at key' },
          { command: 'INCR key / INCRBY key 5', description: 'Atomically increment numerical value by 1 or specified amount' },
          { command: 'TTL key', description: 'Check remaining time-to-live in seconds (-1 = infinite, -2 = expired)' },
          { command: 'EXPIRE key 60', description: 'Set key timeout to 60 seconds' },
          { command: 'DEL key1 key2', description: 'Delete one or more keys' },
          { command: 'EXISTS key', description: 'Check if key exists (returns 1 or 0)' },
        ],
      },
      {
        title: 'Hashes & Lists',
        items: [
          { command: 'HSET user:1 name "Ada" role "Lead"', description: 'Store multiple field-value pairs inside a Redis hash' },
          { command: 'HGET user:1 name', description: 'Retrieve specific field from hash' },
          { command: 'HGETALL user:1', description: 'Retrieve all fields and values from hash' },
          { command: 'LPUSH queue "job_1"', description: 'Prepend item to head of list (queue producer)' },
          { command: 'RPOP queue', description: 'Remove and return item from tail of list (FIFO worker)' },
          { command: 'BRPOP queue 30', description: 'Blocking pop: waits up to 30 seconds for an item to arrive' },
        ],
      },
      {
        title: 'Sorted Sets (ZSET) & Realtime Ranking',
        items: [
          { command: 'ZADD leaderboard 1500 "user_a"', description: 'Add member with floating-point numerical score' },
          { command: 'ZREVRANGE leaderboard 0 9 WITHSCORES', description: 'Get Top 10 highest-scoring leaderboard entries' },
          { command: 'ZINCRBY leaderboard 50 "user_a"', description: 'Increment player score by 50 points' },
          { command: 'ZREVRANK leaderboard "user_a"', description: 'Get 0-indexed ranking of player based on highest score' },
        ],
      },
      {
        title: 'Monitoring & Administration',
        items: [
          { command: 'INFO memory', description: 'Display memory usage, fragmentation ratio, and peak RAM' },
          { command: 'MONITOR', description: 'Stream all incoming Redis commands processed by server in real time' },
          { command: 'SLOWLOG GET 10', description: 'Inspect the 10 most recent queries that exceeded slow threshold' },
          { command: 'FLUSHDB / FLUSHALL', description: 'Delete all keys in current database / all databases (caution)' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Why should KEYS * never be run in production Redis?',
        answer: 'Redis is single-threaded. `KEYS *` scans the entire keyspace synchronously, blocking all other application requests and queries until it finishes. Use `SCAN` instead for non-blocking iteration.',
      },
    ],
  },
  {
    slug: 'tmux-shortcuts-cheat-sheet',
    title: 'tmux Terminal Multiplexer Shortcuts Cheat Sheet',
    category: 'terminal',
    description: 'Essential keyboard shortcuts and commands for tmux. Sessions, windows, vertical/horizontal splits, pane resizing, and detach/attach.',
    sections: [
      {
        title: 'Session Management',
        items: [
          { command: 'tmux new -s <name>', description: 'Start a brand new named tmux session' },
          { command: 'tmux attach -t <name>', description: 'Reattach to an existing background tmux session' },
          { command: 'tmux ls', description: 'List all running background tmux sessions' },
          { command: 'Ctrl+b d', description: 'Detach cleanly from active session (leaves processes running)' },
          { command: 'tmux kill-session -t <name>', description: 'Terminate specified session and kill its processes' },
        ],
      },
      {
        title: 'Pane Splits & Navigation (Prefix: Ctrl+b)',
        items: [
          { command: 'Ctrl+b %', description: 'Split current pane vertically into left and right' },
          { command: 'Ctrl+b "', description: 'Split current pane horizontally into top and bottom' },
          { command: 'Ctrl+b <arrow>', description: 'Move focus to pane in direction of arrow key' },
          { command: 'Ctrl+b z', description: 'Toggle zoom / fullscreen for active pane' },
          { command: 'Ctrl+b x', description: 'Close / kill active pane (with confirmation)' },
          { command: 'Ctrl+b { or }', description: 'Swap current pane position with adjacent pane' },
        ],
      },
      {
        title: 'Windows & Tabs',
        items: [
          { command: 'Ctrl+b c', description: 'Create a new window (tab)' },
          { command: 'Ctrl+b n / p', description: 'Switch to next / previous window' },
          { command: 'Ctrl+b <0-9>', description: 'Jump directly to window by number' },
          { command: 'Ctrl+b ,', description: 'Rename the current window tab' },
          { command: 'Ctrl+b w', description: 'Open interactive visual list of all sessions and windows' },
        ],
      },
    ],
    faqs: [
      {
        question: 'How do I scroll up in a tmux pane?',
        answer: 'Press `Ctrl+b [` to enter Copy/Scroll mode, use the arrow keys or `PageUp`/`PageDown` to scroll, and press `q` to return to normal terminal input.',
      },
    ],
  },
  {
    slug: 'markdown-syntax-cheat-sheet',
    title: 'Markdown & GitHub Flavored Markdown (GFM) Cheat Sheet',
    category: 'web',
    description: 'The ultimate Markdown cheat sheet for README files, technical blogs, and documentation. Headings, code blocks, tables, task lists, and alerts.',
    sections: [
      {
        title: 'Text Formatting & Headings',
        items: [
          { command: '# H1 to ###### H6', description: 'Headings level 1 through level 6' },
          { command: '**bold** or __bold__', description: 'Bold text emphasis' },
          { command: '*italic* or _italic_', description: 'Italic text emphasis' },
          { command: '~~strikethrough~~', description: 'Strikethrough text (GFM)' },
          { command: '`inline code`', description: 'Inline code snippet or identifier' },
          { command: '> Blockquote', description: 'Blockquote callout section' },
        ],
      },
      {
        title: 'Tables & Code Blocks',
        items: [
          { command: '```lang ... ```', description: 'Fenced code block with syntax highlighting' },
          { command: '| Col1 | Col2 |\\n|---|---|\\n| Val1 | Val2 |', description: 'GFM table with pipe delimiters' },
          { command: '| :--- | :---: | ---: |', description: 'Table column alignment (left, center, right)' },
        ],
      },
      {
        title: 'Lists, Links & Task Checkboxes',
        items: [
          { command: '- [x] Completed item', description: 'GFM Interactive task checklist item (checked)' },
          { command: '- [ ] Pending item', description: 'GFM Interactive task checklist item (unchecked)' },
          { command: '[Link Title](https://example.com)', description: 'Hyperlink to external URL' },
          { command: '![Alt text](/path/to/image.png)', description: 'Embedded image with alternate text' },
          { command: '1. Ordered item', description: 'Numbered ordered list' },
          { command: '---', description: 'Horizontal dividing rule' },
        ],
      },
    ],
    faqs: [
      {
        question: 'What is GitHub Flavored Markdown (GFM)?',
        answer: 'GFM is an extension of standard CommonMark created by GitHub, adding support for tables, task checklist items (`[x]`), strikethrough (`~~`), autolinks, and GitHub callout alerts.',
      },
    ],
  },
  {
    slug: 'npm-pnpm-yarn-cheat-sheet',
    title: 'NPM, PNPM & Yarn Commands Cheat Sheet',
    category: 'web',
    description: 'Side-by-side command reference for Node.js package managers: npm, pnpm, and yarn. Covers installing, scripts, auditing, lockfiles, and workspaces.',
    sections: [
      {
        title: 'Package Installation & Dependencies',
        items: [
          { command: 'npm i <pkg> | pnpm add <pkg> | yarn add <pkg>', description: 'Install package as a runtime production dependency' },
          { command: 'npm i -D <pkg> | pnpm add -D <pkg> | yarn add -D <pkg>', description: 'Install package as devDependency' },
          { command: 'npm i -g <pkg> | pnpm add -g <pkg> | yarn global add <pkg>', description: 'Install package globally on machine' },
          { command: 'npm ci | pnpm install --frozen-lockfile | yarn --immutable', description: 'Deterministic clean CI install from lockfile' },
          { command: 'npm rm <pkg> | pnpm rm <pkg> | yarn remove <pkg>', description: 'Uninstall package from dependencies and node_modules' },
        ],
      },
      {
        title: 'Running Scripts & Executables',
        items: [
          { command: 'npm run <script> | pnpm <script> | yarn <script>', description: 'Execute lifecycle script defined in package.json' },
          { command: 'npx <bin> | pnpm dlx <bin> | yarn dlx <bin>', description: 'Download and execute CLI tool without global installation' },
          { command: 'npm audit | pnpm audit | yarn npm audit', description: 'Scan dependencies for known security CVE vulnerabilities' },
          { command: 'npm outdated | pnpm outdated | yarn outdated', description: 'List packages that have newer versions available' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Why is pnpm faster and more disk-efficient than npm?',
        answer: 'pnpm uses a hard-linked, content-addressable global store, preventing duplicate packages across projects on your disk.',
      },
    ],
  },
  {
    slug: 'linux-ssh-scp-cheat-sheet',
    title: 'SSH & SCP Remote Server Commands Cheat Sheet',
    category: 'linux',
    description: 'Essential SSH keys, secure shell logins, remote port tunneling, and scp / rsync secure file transfer command reference.',
    sections: [
      {
        title: 'Key Generation & Remote Login',
        items: [
          { command: 'ssh-keygen -t ed25519 -C "email@domain.com"', description: 'Generate modern, secure Ed25519 SSH keypair' },
          { command: 'ssh-copy-id -i ~/.ssh/id_ed25519.pub user@host', description: 'Copy public key to remote server ~/.ssh/authorized_keys' },
          { command: 'ssh -i ~/.ssh/key.pem user@hostname', description: 'Connect to remote server using private key file' },
          { command: 'ssh -p 2222 user@hostname', description: 'Connect to SSH server running on non-standard port' },
        ],
      },
      {
        title: 'SCP & Rsync File Transfers',
        items: [
          { command: 'scp file.txt user@host:/remote/path/', description: 'Copy local file to remote server directory' },
          { command: 'scp -r user@host:/remote/dir/ ./local/', description: 'Recursively copy directory from remote server to local' },
          { command: 'rsync -avzP ./src/ user@host:/dest/', description: 'Fast incremental sync with archive mode, compression, and progress bar' },
          { command: 'ssh -L 8080:localhost:3000 user@host', description: 'Local port forwarding: access remote 3000 on local 8080' },
        ],
      },
    ],
    faqs: [
      {
        question: 'Why is Ed25519 preferred over RSA for SSH keys?',
        answer: 'Ed25519 offers better security with faster signing and smaller 256-bit keys compared to legacy 2048/4096-bit RSA keys.',
      },
    ],
  },
  {
    slug: 'sqlite3-cli-cheat-sheet',
    title: 'SQLite3 CLI & Dot-Commands Cheat Sheet',
    category: 'database',
    description: 'Comprehensive SQLite command-line reference. Covers dot-commands, table inspection, CSV import/export, index analysis, and backups.',
    sections: [
      {
        title: 'Dot Commands & Meta-Information',
        items: [
          { command: 'sqlite3 app.db', description: 'Open or create a SQLite database file' },
          { command: '.tables', description: 'List all tables in the active database' },
          { command: '.schema <table_name>', description: 'Display the CREATE TABLE schema and indexes for a table' },
          { command: '.mode column | .headers on', description: 'Format SELECT query output as readable aligned columns with headers' },
          { command: '.quit / .exit', description: 'Exit the sqlite3 interactive shell' },
        ],
      },
      {
        title: 'Import, Export & Backups',
        items: [
          { command: '.mode csv\n.import data.csv target_table', description: 'Import CSV file into a SQLite table' },
          { command: '.mode csv\n.output data.csv\nSELECT * FROM target;\n.output stdout', description: 'Export query results directly to CSV file' },
          { command: '.dump > backup.sql', description: 'Dump entire database as SQL statements' },
          { command: '.backup backup.db', description: 'Create live binary database snapshot without locking' },
          { command: 'VACUUM;', description: 'Reclaim unused disk space and defragment database file' },
        ],
      },
    ],
    faqs: [
      {
        question: 'What is WAL mode in SQLite?',
        answer: 'Write-Ahead Logging (WAL) enables concurrent readers and writers (`PRAGMA journal_mode=WAL;`), significantly boosting performance.',
      },
    ],
  },
  {
    slug: 'tar-gzip-compression-cheat-sheet',
    title: 'Tar, Gzip & Linux Compression Cheat Sheet',
    category: 'linux',
    description: 'Quick reference for tar, tar.gz, tar.bz2, zip, and unzip commands on Linux, macOS, and WSL.',
    sections: [
      {
        title: 'Tar.gz Creating & Extracting',
        items: [
          { command: 'tar -czvf archive.tar.gz /path/to/folder', description: 'Create a gzipped tar archive with verbose output' },
          { command: 'tar -xzvf archive.tar.gz', description: 'Extract a gzipped tar archive into current directory' },
          { command: 'tar -xzvf archive.tar.gz -C /target/dir', description: 'Extract archive into specific target directory' },
          { command: 'tar -tzvf archive.tar.gz', description: 'List archive contents without extracting files to disk' },
        ],
      },
      {
        title: 'Zip, Bzip2 & Gzip Standalone',
        items: [
          { command: 'zip -r archive.zip folder/', description: 'Create a standard .zip archive of a directory' },
          { command: 'unzip archive.zip -d /target/dir', description: 'Extract .zip archive into target directory' },
          { command: 'gzip file.txt', description: 'Compress single file to file.txt.gz (removes original)' },
          { command: 'gzip -d file.txt.gz', description: 'Decompress gzipped file back to file.txt' },
        ],
      },
    ],
    faqs: [
      {
        question: 'What do the -czvf flags stand for in tar?',
        answer: '-c = create archive, -z = gzip compression, -v = verbose output, -f = specify archive filename.',
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
