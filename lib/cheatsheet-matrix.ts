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
  category: 'git' | 'docker' | 'linux' | 'database' | 'web' | 'terminal';
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
];

export function getAllCheatSheets(): CheatSheetDefinition[] {
  return CHEATSHEETS;
}

export function getCheatSheetBySlug(slug: string): CheatSheetDefinition | null {
  return CHEATSHEETS.find((c) => c.slug === slug) || null;
}
