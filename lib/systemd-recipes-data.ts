export interface SystemdRecipe {
  slug: string;
  title: string;
  shortTitle: string;
  category: 'Web Apps & APIs' | 'Background Workers & Daemons' | 'Timers & Automation' | 'Infrastructure & Tunnels';
  description: string;
  summary: string;
  unitFileName: string;
  unitFileContent: string;
  timerUnitName?: string;
  timerUnitContent?: string;
  defaultUser: string;
  defaultWorkingDir: string;
  defaultExecStart: string;
  lifecycleCommands: { command: string; explanation: string }[];
  troubleshootingTips: string[];
  faqs: { question: string; answer: string }[];
}

export const SYSTEMD_RECIPES: SystemdRecipe[] = [
  {
    slug: 'nodejs-express-nextjs-systemd-service',
    title: 'How to Create a Systemd Service for Node.js (Express, NestJS, Next.js)',
    shortTitle: 'Node.js Systemd Service',
    category: 'Web Apps & APIs',
    summary: 'Production-ready systemd unit file for Node.js apps with auto-restart on crash, non-root execution, and graceful SIGINT handling.',
    description: 'Running Node.js directly with node server.js in production is risky if the process crashes. Configuring a systemd service guarantees that your Node.js application starts automatically on server boot, restarts upon unhandled exceptions, and streams logs cleanly to journalctl.',
    unitFileName: 'node-app.service',
    defaultUser: 'www-data',
    defaultWorkingDir: '/var/www/my-node-app',
    defaultExecStart: '/usr/bin/node server.js',
    unitFileContent: `[Unit]
Description=Node.js Production Application
Documentation=https://nodejs.org
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/my-node-app
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=node-app
Environment=NODE_ENV=production PORT=3000
# Allow binding to privileged ports (<1024) if needed:
# AmbientCapabilities=CAP_NET_BIND_SERVICE

[Install]
WantedBy=multi-user.target`,
    lifecycleCommands: [
      { command: 'sudo systemctl daemon-reload', explanation: 'Reload systemd manager configuration after adding or editing unit file' },
      { command: 'sudo systemctl enable --now node-app', explanation: 'Enable service to start on boot AND start it immediately' },
      { command: 'sudo systemctl status node-app', explanation: 'Inspect active state, PID, memory consumption, and recent logs' },
      { command: 'sudo journalctl -u node-app -f', explanation: 'Stream real-time live application stdout/stderr logs' },
    ],
    troubleshootingTips: [
      'Always use absolute paths for both ExecStart and WorkingDirectory (e.g. `/usr/bin/node`, not just `node`). Find path with `which node`.',
      'If using NVM (Node Version Manager), `node` is not in standard paths. Either install Node globally via NodeSource or symlink: `sudo ln -s $(which node) /usr/local/bin/node`.',
      'For Next.js standalone servers, set WorkingDirectory to the standalone root and ExecStart to `/usr/bin/node server.js`.',
    ],
    faqs: [
      {
        question: 'Why should I run Node.js with systemd instead of PM2?',
        answer: 'Systemd is the native Linux init system baked into the kernel space. It has zero additional memory overhead, boots before any user session, manages OS cgroups directly, and cannot crash like a userspace daemon.'
      },
      {
        question: 'How do I pass an external .env file into the systemd service?',
        answer: 'Add `EnvironmentFile=/var/www/my-node-app/.env` under the `[Service]` block.'
      }
    ]
  },
  {
    slug: 'python-fastapi-gunicorn-uvicorn-systemd-service',
    title: 'How to Create a Systemd Service for Python (FastAPI, Flask, Gunicorn, Uvicorn)',
    shortTitle: 'Python FastAPI/Flask Service',
    category: 'Web Apps & APIs',
    summary: 'Robust systemd unit file for Python WSGI/ASGI apps utilizing virtualenv binaries, Uvicorn workers, and auto-restart.',
    description: 'Deploying Python web APIs (FastAPI, Django, Flask) in production requires a WSGI/ASGI server like Gunicorn or Uvicorn managed by systemd. This service ensures workers restart if memory limits are exceeded or unhandled exceptions occur.',
    unitFileName: 'python-app.service',
    defaultUser: 'www-data',
    defaultWorkingDir: '/var/www/my-python-app',
    defaultExecStart: '/var/www/my-python-app/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 --workers 4',
    unitFileContent: `[Unit]
Description=FastAPI / Uvicorn Production Web Service
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/my-python-app
ExecStart=/var/www/my-python-app/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8000 --workers 4
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal
SyslogIdentifier=python-app
Environment=PYTHONUNBUFFERED=1
EnvironmentFile=/var/www/my-python-app/.env

[Install]
WantedBy=multi-user.target`,
    lifecycleCommands: [
      { command: 'sudo systemctl daemon-reload', explanation: 'Register new unit file with systemd' },
      { command: 'sudo systemctl enable --now python-app', explanation: 'Start service now and enable on boot' },
      { command: 'sudo systemctl restart python-app', explanation: 'Restart Python processes after a code git pull' },
      { command: 'sudo journalctl -u python-app -n 50 --no-pager', explanation: 'Print last 50 log lines without entering pagination' },
    ],
    troubleshootingTips: [
      'Set `PYTHONUNBUFFERED=1` in the Environment block so print statements and logger outputs appear instantly in journalctl without buffer delay.',
      'Always point `ExecStart` to the Python or Uvicorn binary inside your virtualenv (`/path/to/venv/bin/uvicorn`). Do not activate the virtualenv in bash.',
    ],
    faqs: [
      {
        question: 'How do I calculate how many Uvicorn workers to spawn?',
        answer: 'The recommended formula is `(2 x $NUM_CORES) + 1`. On a 2-core VPS, 4 or 5 workers maximize CPU concurrency.'
      }
    ]
  },
  {
    slug: 'golang-compiled-binary-systemd-service',
    title: 'How to Create a Systemd Service for Go (Golang) Compiled Binary',
    shortTitle: 'Go Binary Systemd Service',
    category: 'Web Apps & APIs',
    summary: 'Minimal, secure systemd unit file for statically compiled Go backend binaries with sandboxing flags.',
    description: 'Go compiles into standalone, self-contained ELF binaries with no external runtime dependencies. Systemd is the ideal companion to run Go binaries as lightweight background microservices with Linux security isolation directives.',
    unitFileName: 'go-service.service',
    defaultUser: 'appuser',
    defaultWorkingDir: '/opt/go-service',
    defaultExecStart: '/opt/go-service/bin/server',
    unitFileContent: `[Unit]
Description=Go Production Microservice
After=network.target

[Service]
Type=exec
User=appuser
Group=appuser
WorkingDirectory=/opt/go-service
ExecStart=/opt/go-service/bin/server
Restart=on-failure
RestartSec=3
StandardOutput=journal
StandardError=journal
SyslogIdentifier=go-service
# Linux Security Sandboxing
ProtectSystem=full
ProtectHome=true
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target`,
    lifecycleCommands: [
      { command: 'sudo systemctl daemon-reload', explanation: 'Notify systemd of changes' },
      { command: 'sudo systemctl enable --now go-service', explanation: 'Start Go binary and enable persistence' },
      { command: 'sudo systemctl status go-service', explanation: 'Confirm service status and memory usage' },
    ],
    troubleshootingTips: [
      'Use `Type=exec` for Go binaries. Systemd will consider the service started only when the binary has successfully executed the binary header.',
      'Ensure the binary has executable permissions: `chmod +x /opt/go-service/bin/server`.',
    ],
    faqs: [
      {
        question: 'What do ProtectSystem=full and NoNewPrivileges=true do?',
        answer: 'They enforce Linux kernel security: ProtectSystem makes `/usr`, `/boot`, and `/etc` read-only for the process, while NoNewPrivileges prevents privilege escalation exploits.'
      }
    ]
  },
  {
    slug: 'background-worker-queue-systemd-service',
    title: 'How to Run Background Workers (Celery, BullMQ, Sidekiq) with Systemd',
    shortTitle: 'Background Queue Worker Service',
    category: 'Background Workers & Daemons',
    summary: 'High-reliability systemd unit file for queue consumers and asynchronous job processors that must never stay down.',
    description: 'Background workers consuming Redis, RabbitMQ, or SQS queues (like Celery, BullMQ, Sidekiq, or Laravel Queue) require aggressive auto-recovery. This service provides memory limits, restart backoff, and graceful termination.',
    unitFileName: 'queue-worker.service',
    defaultUser: 'worker',
    defaultWorkingDir: '/var/www/app',
    defaultExecStart: '/usr/bin/node worker.js',
    unitFileContent: `[Unit]
Description=Asynchronous Background Queue Consumer
After=network.target redis.service
Requires=redis.service

[Service]
Type=simple
User=worker
Group=worker
WorkingDirectory=/var/www/app
ExecStart=/usr/bin/node worker.js
Restart=always
RestartSec=10
TimeoutStopSec=60
KillMode=mixed
KillSignal=SIGTERM
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target`,
    lifecycleCommands: [
      { command: 'sudo systemctl daemon-reload', explanation: 'Update systemd configurations' },
      { command: 'sudo systemctl enable --now queue-worker', explanation: 'Start worker daemon' },
      { command: 'sudo systemctl stop queue-worker', explanation: 'Gracefully stop worker (waits TimeoutStopSec for in-flight jobs to finish)' },
    ],
    troubleshootingTips: [
      '`TimeoutStopSec=60` ensures that when you restart or stop the service, systemd gives the worker 60 seconds to finish processing in-flight jobs before sending SIGKILL.',
      'Use `Requires=redis.service` so the worker will not attempt to start if Redis is down.',
    ],
    faqs: [
      {
        question: 'What does KillMode=mixed do in systemd?',
        answer: 'It sends SIGTERM to the main process, waits for the stop timeout, and if child worker processes are still lingering, forcefully kills them with SIGKILL.'
      }
    ]
  },
  {
    slug: 'systemd-timer-cron-replacement',
    title: 'How to Create a Systemd Timer to Replace Cron Jobs',
    shortTitle: 'Systemd Timer (Cron Alternative)',
    category: 'Timers & Automation',
    summary: 'Modern Linux cron replacement with millisecond precision, monotonic timers, and unified journalctl logging.',
    description: 'Systemd timers supersede legacy crontab. They provide unified logging in journalctl, can trigger on relative intervals (`OnBootSec`, `OnUnitActiveSec`) or calendar events (`OnCalendar`), and support randomized delays to prevent thundering herd problems.',
    unitFileName: 'backup-task.service',
    timerUnitName: 'backup-task.timer',
    defaultUser: 'root',
    defaultWorkingDir: '/opt/scripts',
    defaultExecStart: '/opt/scripts/backup.sh',
    unitFileContent: `[Unit]
Description=Database Backup Script
After=network.target

[Service]
Type=oneshot
User=root
WorkingDirectory=/opt/scripts
ExecStart=/opt/scripts/backup.sh
StandardOutput=journal
StandardError=journal`,
    timerUnitContent: `[Unit]
Description=Run Database Backup Daily at 3:00 AM
Requires=backup-task.service

[Timer]
OnCalendar=*-*-* 03:00:00
RandomizedDelaySec=300
Persistent=true

[Install]
WantedBy=timers.target`,
    lifecycleCommands: [
      { command: 'sudo systemctl daemon-reload', explanation: 'Load both .service and .timer units' },
      { command: 'sudo systemctl enable --now backup-task.timer', explanation: 'Enable and activate the timer schedule' },
      { command: 'sudo systemctl list-timers', explanation: 'List all active timers with next run time and remaining countdown' },
      { command: 'sudo systemctl start backup-task.service', explanation: 'Manually trigger a test execution without waiting for timer' },
    ],
    troubleshootingTips: [
      'Enable the `.timer` unit, NOT the `.service` unit! The timer automatically activates the service when triggered.',
      '`Persistent=true` ensures that if the server was powered off when the timer was scheduled to fire, it will execute immediately on the next boot.',
    ],
    faqs: [
      {
        question: 'Why are systemd timers better than cron?',
        answer: 'Timers log every execution cleanly to journalctl, handle missed runs during server downtime (`Persistent=true`), and support randomized delays to avoid server load spikes.'
      }
    ]
  },
  {
    slug: 'docker-compose-systemd-service',
    title: 'How to Run Docker Compose as a Systemd Service',
    shortTitle: 'Docker Compose Systemd Service',
    category: 'Infrastructure & Tunnels',
    summary: 'Manage multi-container Docker Compose stacks with systemd for automatic container booting and graceful shutdown.',
    description: 'Running Docker Compose as a systemd service guarantees that your multi-container stack boots automatically when the Docker daemon is ready, and issues `docker compose down` gracefully during host reboot.',
    unitFileName: 'docker-compose-app.service',
    defaultUser: 'root',
    defaultWorkingDir: '/opt/my-stack',
    defaultExecStart: '/usr/bin/docker compose up -d --remove-orphans',
    unitFileContent: `[Unit]
Description=Docker Compose Multi-Container Stack
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/my-stack
ExecStart=/usr/bin/docker compose up -d --remove-orphans
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target`,
    lifecycleCommands: [
      { command: 'sudo systemctl daemon-reload', explanation: 'Register compose service' },
      { command: 'sudo systemctl enable --now docker-compose-app', explanation: 'Start docker compose stack and persist on boot' },
      { command: 'sudo systemctl stop docker-compose-app', explanation: 'Gracefully run docker compose down' },
    ],
    troubleshootingTips: [
      '`RemainAfterExit=yes` is essential for `Type=oneshot` services; it tells systemd to treat the service as active even after the initial `up -d` command completes.',
      'Ensure `Requires=docker.service` so systemd does not attempt to launch before the Docker daemon socket is initialized.',
    ],
    faqs: [
      {
        question: 'Why use systemd for Docker Compose when restart: always exists in compose.yaml?',
        answer: 'Systemd integrates compose with OS-level shutdown sequences, ensures clean volume flushing, and allows standard `systemctl` monitoring alongside other host services.'
      }
    ]
  },
  {
    slug: 'reverse-ssh-tunnel-systemd-service',
    title: 'How to Keep Reverse SSH Tunnel Persistent with Autossh & Systemd',
    shortTitle: 'Persistent Reverse SSH Tunnel',
    category: 'Infrastructure & Tunnels',
    summary: 'Create an unkillable reverse SSH tunnel to access home servers or NAT-restricted devices from the public internet.',
    description: 'A reverse SSH tunnel forwards a local port on an inaccessible private network to a public cloud VPS. Wrapping `autossh` in a systemd service monitors connection drops and reconnects automatically within seconds.',
    unitFileName: 'reverse-tunnel.service',
    defaultUser: 'ubuntu',
    defaultWorkingDir: '/home/ubuntu',
    defaultExecStart: '/usr/bin/autossh -M 0 -N -o "ServerAliveInterval 30" -o "ServerAliveCountMax 3" -R 2222:localhost:22 remote-user@my-vps.com -i /home/ubuntu/.ssh/id_rsa',
    unitFileContent: `[Unit]
Description=Auto-Healing Reverse SSH Tunnel
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=ubuntu
ExecStart=/usr/bin/autossh -M 0 -N -o "ServerAliveInterval 30" -o "ServerAliveCountMax 3" -o "ExitOnForwardFailure yes" -R 2222:localhost:22 remote-user@my-vps.com -i /home/ubuntu/.ssh/id_rsa
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target`,
    lifecycleCommands: [
      { command: 'sudo systemctl daemon-reload', explanation: 'Load unit file' },
      { command: 'sudo systemctl enable --now reverse-tunnel', explanation: 'Establish persistent tunnel' },
      { command: 'sudo journalctl -u reverse-tunnel -f', explanation: 'Check connection logs' },
    ],
    troubleshootingTips: [
      'Use `Wants=network-online.target` and `After=network-online.target` so autossh does not attempt to connect before WiFi or Ethernet has obtained an IP address.',
      'Always test passwordless SSH key authentication manually before starting the systemd service.',
    ],
    faqs: [
      {
        question: 'What does -M 0 do in autossh?',
        answer: '`-M 0` disables autossh\'s legacy monitoring port and relies on OpenSSH\'s built-in `ServerAliveInterval` probes instead.'
      }
    ]
  },
  {
    slug: 'java-spring-boot-jar-systemd-service',
    title: 'How to Create a Systemd Service for Java Spring Boot JAR',
    shortTitle: 'Java Spring Boot Service',
    category: 'Web Apps & APIs',
    summary: 'Enterprise systemd unit file for Java JAR executables with JVM heap tuning and non-root execution.',
    description: 'Spring Boot packages applications into executable fat JARs. Running Spring Boot under systemd allows you to configure JVM memory limits (`-Xmx`, `-Xms`), log redirection, and automated restarts.',
    unitFileName: 'spring-app.service',
    defaultUser: 'spring',
    defaultWorkingDir: '/opt/spring-app',
    defaultExecStart: '/usr/bin/java -Xms512m -Xmx2048m -jar app.jar --spring.profiles.active=prod',
    unitFileContent: `[Unit]
Description=Spring Boot Enterprise Service
After=syslog.target network.target

[Service]
Type=simple
User=spring
Group=spring
WorkingDirectory=/opt/spring-app
ExecStart=/usr/bin/java -Xms512m -Xmx2048m -jar app.jar --spring.profiles.active=prod
SuccessExitStatus=143
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target`,
    lifecycleCommands: [
      { command: 'sudo systemctl daemon-reload', explanation: 'Register service' },
      { command: 'sudo systemctl enable --now spring-app', explanation: 'Start Spring Boot JAR and enable on boot' },
      { command: 'sudo journalctl -u spring-app -f', explanation: 'Watch live Spring Boot startup banner and logs' },
    ],
    troubleshootingTips: [
      '`SuccessExitStatus=143` tells systemd that Exit Code 143 (SIGTERM graceful shutdown in Java) is a planned success, not a service failure.',
    ],
    faqs: [
      {
        question: 'Where should I place the application.properties or application.yml file?',
        answer: 'Placing `application.properties` inside the `WorkingDirectory` (`/opt/spring-app/`) will cause Spring Boot to automatically load it with higher priority over internal JAR properties.'
      }
    ]
  }
];

export function getAllSystemdRecipes(): SystemdRecipe[] {
  return SYSTEMD_RECIPES;
}

export function getSystemdRecipeBySlug(slug: string): SystemdRecipe | undefined {
  return SYSTEMD_RECIPES.find((r) => r.slug === slug);
}
