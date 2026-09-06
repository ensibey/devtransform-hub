export interface DockerRecipe {
  slug: string;
  title: string;
  shortTitle: string;
  category: 'Containers & Exec' | 'Cleanup & Prune' | 'Images & Build' | 'Volumes & Storage' | 'Networks & Ports' | 'Dockerfile Directives';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  riskLevel: 'Safe' | 'Reversible' | 'Destructive';
  summary: string;
  quickCommand: string;
  scenario: string;
  steps: {
    title: string;
    command: string;
    explanation: string;
  }[];
  alternatives?: {
    name: string;
    command: string;
    whenToUse: string;
  }[];
  pitfalls: string[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const DOCKER_RECIPES: DockerRecipe[] = [
  {
    slug: 'docker-exec-interactive-bash',
    title: 'How to Exec / SSH into a Running Docker Container with Bash',
    shortTitle: 'Exec into Container (Bash/Sh)',
    category: 'Containers & Exec',
    difficulty: 'Beginner',
    riskLevel: 'Safe',
    summary: 'Open an interactive terminal shell session inside a live running Docker container to inspect files, debug processes, or test network connectivity.',
    quickCommand: 'docker exec -it <container-name> /bin/bash',
    scenario: 'You need to inspect runtime environment variables, database connectivity, or investigate file permissions inside a live container without restarting it.',
    steps: [
      {
        title: 'Find container name or ID',
        command: 'docker ps',
        explanation: 'Lists all currently running containers with their IDs, names, status, and port mappings.',
      },
      {
        title: 'Launch interactive Bash session',
        command: 'docker exec -it <container-name> /bin/bash',
        explanation: '-i (interactive) and -t (pseudo-TTY) allocate a terminal shell. /bin/bash starts the Bash shell.',
      },
      {
        title: 'Fallback for Alpine Linux images (No Bash)',
        command: 'docker exec -it <container-name> /bin/sh',
        explanation: 'Alpine and minimal scratch images do not have Bash installed; use /bin/sh instead.',
      },
      {
        title: 'Exec as root user (Debugging permissions)',
        command: 'docker exec -u 0 -it <container-name> /bin/bash',
        explanation: '-u 0 (or --user root) forces root execution even if the container runs as a non-privileged user.',
      },
    ],
    alternatives: [
      {
        name: 'Docker Compose',
        command: 'docker compose exec <service-name> sh',
        whenToUse: 'When running multi-container stacks via docker-compose.yml.',
      },
    ],
    pitfalls: [
      'Changes made inside a container via exec are ephemeral; they will be lost when the container is recreated unless persisted in volumes.',
      'Type "exit" or press Ctrl+D to leave the container shell without stopping the container.',
    ],
    faqs: [
      {
        question: 'Why do I get "OCI runtime exec failed: exec: \\"/bin/bash\\": stat /bin/bash: no such file or directory"?',
        answer: 'The container base image (like Alpine or distroless) does not include Bash. Replace /bin/bash with /bin/sh.',
      },
      {
        question: 'How do I run a single command without opening an interactive shell?',
        answer: 'Omit the "-it" flags: e.g. "docker exec <container> ls -la /app" or "docker exec <container> cat /etc/hosts".',
      },
    ],
  },
  {
    slug: 'docker-system-prune-volumes',
    title: 'How to Clean Up Docker Disk Space (Prune Containers, Images & Volumes)',
    shortTitle: 'Clean Up Docker Disk Space',
    category: 'Cleanup & Prune',
    difficulty: 'Intermediate',
    riskLevel: 'Destructive',
    summary: 'Reclaim gigabytes of hard drive space by removing stopped containers, unused networks, dangling images, and build caches.',
    quickCommand: 'docker system prune -a --volumes',
    scenario: 'Your local machine or CI/CD runner is running out of disk space due to accumulated build layers, dangling images, and stopped containers.',
    steps: [
      {
        title: 'Check Docker disk space usage',
        command: 'docker system df',
        explanation: 'Displays a breakdown of disk space consumed by Images, Containers, Local Volumes, and Build Cache.',
      },
      {
        title: 'Safe cleanup (stopped containers, unused networks, dangling images)',
        command: 'docker system prune',
        explanation: 'Deletes stopped containers, networks not used by at least one container, and dangling images without tags.',
      },
      {
        title: 'Deep cleanup including all unused images',
        command: 'docker system prune -a',
        explanation: '-a removes all unreferenced images, not just dangling ones.',
      },
      {
        title: 'Maximum cleanup including volumes (Destructive)',
        command: 'docker system prune -a --volumes -f',
        explanation: 'WARNING: Permanently deletes all stopped containers, unused images, build caches, and unattached volumes (-f bypasses prompt).',
      },
    ],
    pitfalls: [
      'Using "--volumes" will permanently erase database data stored in Docker volumes not currently attached to a running container!',
      'Make sure required containers are actively running before executing system prune.',
    ],
    faqs: [
      {
        question: 'How do I clean Docker build cache specifically?',
        answer: 'Run "docker builder prune -a" to remove multi-stage build cache without touching your images or volumes.',
      },
    ],
  },
  {
    slug: 'docker-stop-all-containers',
    title: 'How to Stop and Remove All Running Docker Containers',
    shortTitle: 'Stop & Remove All Containers',
    category: 'Containers & Exec',
    difficulty: 'Beginner',
    riskLevel: 'Reversible',
    summary: 'Instantly stop all active containers and optionally remove them with a single command.',
    quickCommand: 'docker stop $(docker ps -q)',
    scenario: 'You have dozens of forgotten dev containers consuming CPU and RAM, and you want to cleanly shut down all background workloads.',
    steps: [
      {
        title: 'Stop all running containers gracefully',
        command: 'docker stop $(docker ps -q)',
        explanation: 'docker ps -q outputs only the IDs of running containers; docker stop sends SIGTERM to gracefully shut them down.',
      },
      {
        title: 'Force stop all containers immediately',
        command: 'docker kill $(docker ps -q)',
        explanation: 'Sends SIGKILL for immediate shutdown without waiting for graceful process termination.',
      },
      {
        title: 'Remove all stopped containers',
        command: 'docker rm $(docker ps -a -q)',
        explanation: 'Deletes all stopped container instances from disk.',
      },
      {
        title: 'Windows PowerShell syntax',
        command: 'docker stop $(docker ps -q); docker rm $(docker ps -a -q)',
        explanation: 'PowerShell equivalent for Windows developers.',
      },
    ],
    pitfalls: [
      'If no containers are running, "docker stop $(docker ps -q)" will return an argument error. In scripts, use "docker container prune -f" instead.',
    ],
    faqs: [
      {
        question: 'Does stopping a container delete its data?',
        answer: 'No. Stopping a container preserves its file system and volume mounts. Only "docker rm" deletes the container layer.',
      },
    ],
  },
  {
    slug: 'docker-cp-container-to-host',
    title: 'How to Copy Files Between a Docker Container and Host Machine',
    shortTitle: 'Copy Files (Container <-> Host)',
    category: 'Volumes & Storage',
    difficulty: 'Beginner',
    riskLevel: 'Safe',
    summary: 'Copy files or directories between a Docker container and your local host file system without creating a volume mount.',
    quickCommand: 'docker cp <container>:/path/in/container /path/on/host',
    scenario: 'You need to extract application logs, a database dump, or a generated build artifact from a container to your desktop.',
    steps: [
      {
        title: 'Copy file from container to local host',
        command: 'docker cp my-container:/var/log/nginx/access.log ./access.log',
        explanation: 'Downloads access.log from inside my-container to the current local working directory.',
      },
      {
        title: 'Copy directory from container to host',
        command: 'docker cp my-container:/app/dist ./dist_backup',
        explanation: 'Recursively copies the entire dist directory from container to local machine.',
      },
      {
        title: 'Copy local file into a running container',
        command: 'docker cp ./nginx.conf my-container:/etc/nginx/nginx.conf',
        explanation: 'Injects a local configuration file directly into the container filesystem.',
      },
    ],
    pitfalls: [
      'docker cp works even if the container is stopped, but cannot copy between two separate remote containers directly.',
    ],
    faqs: [
      {
        question: 'Does docker cp overwrite existing files without confirmation?',
        answer: 'Yes! If the destination file already exists on the host or container, docker cp overwrites it without prompting.',
      },
    ],
  },
  {
    slug: 'dockerfile-entrypoint-vs-cmd',
    title: 'ENTRYPOINT vs CMD in Dockerfile: Differences and Best Practices',
    shortTitle: 'ENTRYPOINT vs CMD Explained',
    category: 'Dockerfile Directives',
    difficulty: 'Intermediate',
    riskLevel: 'Safe',
    summary: 'Understand the fundamental differences between ENTRYPOINT and CMD directives and how to combine them for flexible container CLIs.',
    quickCommand: 'ENTRYPOINT ["node", "server.js"]\nCMD ["--port", "3000"]',
    scenario: 'You are writing a Dockerfile and need to know whether to use ENTRYPOINT or CMD to start your application.',
    steps: [
      {
        title: 'Exec Form (Always Recommended)',
        command: 'ENTRYPOINT ["executable", "param1", "param2"]',
        explanation: 'JSON array syntax does not invoke a shell wrapper, allowing the process to receive SIGTERM signals properly (PID 1).',
      },
      {
        title: 'Shell Form (Avoid if possible)',
        command: 'CMD executable param1 param2',
        explanation: 'Runs command as "/bin/sh -c executable", which prevents signals from reaching your app.',
      },
      {
        title: 'Recommended Combination Pattern',
        command: 'ENTRYPOINT ["python", "main.py"]\nCMD ["--serve"]',
        explanation: 'ENTRYPOINT defines the fixed executable, while CMD provides default arguments that users can override at "docker run".',
      },
    ],
    pitfalls: [
      'If you override CMD when running "docker run image:tag custom_arg", only CMD is replaced; ENTRYPOINT remains active.',
      'To completely override ENTRYPOINT, use "docker run --entrypoint /bin/sh image:tag".',
    ],
    faqs: [
      {
        question: 'Which one should I use for a web server?',
        answer: 'Use ENTRYPOINT ["node", "index.js"] or CMD ["node", "index.js"] in exec form (JSON array). Combining them allows passing default port or config flags.',
      },
    ],
  },
  {
    slug: 'docker-logs-follow',
    title: 'How to View and Follow Docker Container Logs in Real Time',
    shortTitle: 'View & Stream Container Logs',
    category: 'Containers & Exec',
    difficulty: 'Beginner',
    riskLevel: 'Safe',
    summary: 'Inspect stdout and stderr output from containers with timestamps, tail line limits, and live streaming.',
    quickCommand: 'docker logs -f --tail 100 <container-name>',
    scenario: 'Your container crashed or is behaving unexpectedly, and you need to monitor live incoming requests and stack traces.',
    steps: [
      {
        title: 'Stream live logs (Follow mode like tail -f)',
        command: 'docker logs -f <container-name>',
        explanation: 'Continuously outputs incoming log lines until you press Ctrl+C.',
      },
      {
        title: 'View last 100 lines and stream',
        command: 'docker logs -f --tail 100 <container-name>',
        explanation: 'Prevents terminal buffer flooding by displaying only the latest 100 entries before tailing.',
      },
      {
        title: 'Show timestamps with logs',
        command: 'docker logs -t --tail 50 <container-name>',
        explanation: 'Prepends each log line with an ISO 8601 UTC timestamp.',
      },
      {
        title: 'View logs since a specific time',
        command: 'docker logs --since 30m <container-name>',
        explanation: 'Filters logs produced within the last 30 minutes (supports 10m, 2h, or ISO dates).',
      },
    ],
    pitfalls: [
      'Containers logging directly to internal files instead of stdout/stderr will not appear in "docker logs".',
    ],
    faqs: [
      {
        question: 'Where does Docker store container logs on the host disk?',
        answer: 'By default, on Linux: /var/lib/docker/containers/<id>/<id>-json.log. Configure log rotation in daemon.json (max-size, max-file) to avoid filling disk.',
      },
    ],
  },
  {
    slug: 'dockerfile-copy-vs-add',
    title: 'COPY vs ADD in Dockerfile: Which Should You Use?',
    shortTitle: 'COPY vs ADD Differences',
    category: 'Dockerfile Directives',
    difficulty: 'Beginner',
    riskLevel: 'Safe',
    summary: 'Best practices for copying files into Docker images. Why COPY is almost always preferred over ADD.',
    quickCommand: 'COPY package.json package-lock.json ./',
    scenario: 'You are optimizing Dockerfile build caching and deciding whether to use COPY or ADD for your source code and archives.',
    steps: [
      {
        title: 'Standard file and directory copy (Preferred)',
        command: 'COPY src/ /app/src/',
        explanation: 'COPY only performs straightforward local file copying from host context into the image layer.',
      },
      {
        title: 'Automatic tar archive extraction with ADD',
        command: 'ADD archive.tar.gz /opt/',
        explanation: 'ADD automatically unpacks recognized compressed tar archives (gzip, bzip2, xz) into the destination directory.',
      },
      {
        title: 'Copy with ownership permissions',
        command: 'COPY --chown=node:node . /app',
        explanation: 'Sets file user and group ownership during copy without requiring a separate "RUN chown -R" layer.',
      },
    ],
    pitfalls: [
      'Do not use "ADD <remote-url>". It is better practice to use "RUN curl -fsSL <url> | tar -xz" to avoid leaving uncompressed cache files in image layers.',
    ],
    faqs: [
      {
        question: 'Why does official Docker documentation recommend COPY over ADD?',
        answer: 'COPY is transparent and predictable. ADD has implicit behaviors (tar extraction, remote URL fetching) that can introduce security risks and unexpected build errors.',
      },
    ],
  },
  {
    slug: 'docker-inspect-ip-address',
    title: 'How to Find a Docker Container IP Address and Network Info',
    shortTitle: 'Find Container IP Address',
    category: 'Networks & Ports',
    difficulty: 'Intermediate',
    riskLevel: 'Safe',
    summary: 'Extract the private bridge or overlay IP address of a running container using docker inspect formatting templates.',
    quickCommand: "docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container>",
    scenario: 'You need to connect directly to a containerized service (Postgres, Redis) from another container or debugging tool on the host network.',
    steps: [
      {
        title: 'Quick 1-line IP lookup (Go template)',
        command: "docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container>",
        explanation: 'Formats the JSON output to print only the container IPv4 address.',
      },
      {
        title: 'Alternative using grep',
        command: 'docker inspect <container> | grep "IPAddress"',
        explanation: 'Quick terminal grep through the container JSON configuration.',
      },
      {
        title: 'View all network details and gateway',
        command: 'docker inspect <container> --format=\'{{json .NetworkSettings.Networks}}\'',
        explanation: 'Outputs IP, Gateway, MacAddress, and Subnet in clean JSON format.',
      },
    ],
    pitfalls: [
      'Container IP addresses change on restart! For reliable inter-container communication, connect containers to a custom Docker bridge network and use container names as hostnames.',
    ],
    faqs: [
      {
        question: 'Why does my container IP address say empty ""?',
        answer: 'If the container is stopped or uses "--network host", it will not have a separate bridge IP address.',
      },
    ],
  },
  {
    slug: 'docker-volume-mount',
    title: 'How to Mount Volumes and Bind Mounts in Docker',
    shortTitle: 'Mount Volumes & Bind Mounts',
    category: 'Volumes & Storage',
    difficulty: 'Intermediate',
    riskLevel: 'Safe',
    summary: 'Persist database files and hot-reload local source code inside containers using named volumes and host bind mounts.',
    quickCommand: 'docker run -v my_volume:/var/lib/data -v $(pwd):/app -p 3000:3000 my-image',
    scenario: 'You want your database records to survive container restarts, and you want live code changes on your laptop to instantly reflect inside the container.',
    steps: [
      {
        title: 'Named Volume (Best for database persistence)',
        command: 'docker run -d --name db -v pg_data:/var/lib/postgresql/data postgres:16',
        explanation: 'Docker manages the pg_data volume lifecycle on the host, ensuring high I/O performance and data persistence.',
      },
      {
        title: 'Bind Mount (Best for local dev hot-reloading)',
        command: 'docker run -it -v $(pwd):/app -w /app node:20 npm run dev',
        explanation: 'Mounts the current host working directory into /app inside the container.',
      },
      {
        title: 'Read-only mount (Maximum security)',
        command: 'docker run -v $(pwd)/config:/app/config:ro my-app',
        explanation: ':ro flag prevents the container from modifying host files.',
      },
      {
        title: 'Modern --mount syntax (Recommended by Docker)',
        command: 'docker run --mount type=bind,source="$(pwd)",target=/app my-image',
        explanation: 'Explicit key-value syntax with clear error messages.',
      },
    ],
    pitfalls: [
      'On Windows WSL2, mounting files from /mnt/c/... is significantly slower than storing files inside the Linux WSL filesystem (~/project).',
    ],
    faqs: [
      {
        question: 'What is the difference between a Named Volume and a Bind Mount?',
        answer: 'Named Volumes are managed entirely by Docker in /var/lib/docker/volumes and are portable across environments. Bind Mounts link an exact directory on your host machine to the container.',
      },
    ],
  },
  {
    slug: 'docker-multi-stage-build',
    title: 'How to Create Docker Multi-Stage Builds to Reduce Image Size',
    shortTitle: 'Multi-Stage Build (Small Images)',
    category: 'Images & Build',
    difficulty: 'Advanced',
    riskLevel: 'Safe',
    summary: 'Shrink production Docker image sizes from 1.5GB down to 50MB by separating heavy build dependencies from the minimal production runtime.',
    quickCommand: 'FROM node:20-alpine AS builder\n...\nFROM node:20-alpine AS runner\nCOPY --from=builder /app/dist ./dist',
    scenario: 'Your production Docker image includes large compilers (gcc, python), devDependencies, and source code that bloated image size and pose security risks.',
    steps: [
      {
        title: 'Stage 1: Build & compile application',
        command: 'FROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build',
        explanation: 'Installs all dependencies (including devDependencies) and compiles TypeScript / Next.js assets.',
      },
      {
        title: 'Stage 2: Minimal production runner',
        command: 'FROM node:20-alpine AS runner\nWORKDIR /app\nENV NODE_ENV=production\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY --from=builder /app/dist ./dist\nCMD ["node", "dist/server.js"]',
        explanation: 'Only copies production dependencies and the compiled dist folder. Dev tools and compilers are discarded.',
      },
    ],
    pitfalls: [
      'Ensure "COPY package*.json ./" is run before "COPY . ." to leverage Docker layer caching when source code changes.',
    ],
    faqs: [
      {
        question: 'How much smaller do images become with multi-stage builds?',
        answer: 'Typically 70% to 95% smaller! A Go or Rust application can go from 1GB down to a 10MB scratch image containing only the compiled binary.',
      },
    ],
  },
];

export function getAllDockerRecipes(): DockerRecipe[] {
  return DOCKER_RECIPES;
}

export function getDockerRecipeBySlug(slug: string): DockerRecipe | undefined {
  return DOCKER_RECIPES.find((r) => r.slug === slug);
}
