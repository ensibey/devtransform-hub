export interface K8sRecipe {
  slug: string;
  title: string;
  shortTitle: string;
  category: 'Networking & Access' | 'Debug & Inspection' | 'Troubleshooting' | 'Deployments & Workloads' | 'Monitoring & Resources' | 'Config & Secrets' | 'Cluster & Nodes';
  riskLevel: 'safe' | 'caution' | 'destructive';
  command: string;
  summary: string;
  description: string;
  prerequisites: string[];
  parameters: { flag: string; purpose: string; defaultValue?: string }[];
  yamlSnippet?: string;
  steps: { title: string; instruction: string; command?: string }[];
  troubleshootingTips: string[];
  faqs: { question: string; answer: string }[];
}

export const K8S_RECIPES: K8sRecipe[] = [
  {
    slug: 'kubectl-port-forward-service-pod',
    title: 'How to Port-Forward a Kubernetes Pod or Service to Localhost',
    shortTitle: 'Port-Forward Pod or Service',
    category: 'Networking & Access',
    riskLevel: 'safe',
    command: 'kubectl port-forward svc/my-service 8080:80 -n default',
    summary: 'Forward local workstation TCP ports directly to a Kubernetes Service or Pod without exposing it via Ingress or LoadBalancer.',
    description: 'The `kubectl port-forward` command establishes an encrypted tunnel between your local workstation and a target Pod or Service inside the cluster. It allows developers to test internal microservices, databases (Postgres, Redis), or private APIs locally.',
    prerequisites: [
      'Active kubeconfig context connected to the cluster.',
      'Read/get permissions for pods and services in the target namespace.',
    ],
    parameters: [
      { flag: 'svc/<service-name>', purpose: 'Target service to forward traffic to (or pod/<pod-name>)', defaultValue: 'svc/my-service' },
      { flag: '8080:80', purpose: '<local-port>:<remote-cluster-port>', defaultValue: '8080:80' },
      { flag: '-n <namespace>', purpose: 'Kubernetes namespace where service resides', defaultValue: '-n default' },
      { flag: '--address 0.0.0.0', purpose: 'Optional: Listen on all network interfaces instead of localhost only' },
    ],
    steps: [
      {
        title: 'Identify target service and cluster port',
        instruction: 'Find the service name and its internal targetPort:',
        command: 'kubectl get svc -n default',
      },
      {
        title: 'Initiate the port-forward tunnel',
        instruction: 'Run the command to bind local port 8080 to cluster port 80:',
        command: 'kubectl port-forward svc/my-service 8080:80 -n default',
      },
      {
        title: 'Test connection in another terminal or browser',
        instruction: 'Send an HTTP request or open in your browser at http://localhost:8080:',
        command: 'curl http://localhost:8080/healthz',
      },
    ],
    troubleshootingTips: [
      'If you get "bind: address already in use", check if another process is using port 8080 (e.g. `lsof -i :8080` or `netstat -ano`).',
      'Port-forward connections drop automatically if the target pod restarts or during rolling deployments.',
    ],
    faqs: [
      {
        question: 'Can I port-forward to a Kubernetes Deployment instead of a Service?',
        answer: 'Yes, running `kubectl port-forward deployment/my-app 8080:80` will automatically route to one of the active replica pods managed by that deployment.'
      },
      {
        question: 'How do I expose port-forward to other machines on my local LAN?',
        answer: 'Add `--address 0.0.0.0` to the command: `kubectl port-forward --address 0.0.0.0 svc/my-service 8080:80`.'
      }
    ]
  },
  {
    slug: 'kubectl-exec-interactive-bash',
    title: 'How to Exec into a Kubernetes Pod with an Interactive Bash Shell',
    shortTitle: 'Exec Interactive Bash in Pod',
    category: 'Debug & Inspection',
    riskLevel: 'caution',
    command: 'kubectl exec -it my-pod -n default -- /bin/bash',
    summary: 'Open an interactive terminal shell directly inside a running Kubernetes container for inspection, debugging, and testing.',
    description: '`kubectl exec -it` attaches your standard input (stdin) and allocates a pseudo-TTY to a running container. This enables live inspection of container files, environment variables, DNS resolution, and internal processes.',
    prerequisites: [
      'Pod status must be Running (not Pending or CrashLoopBackOff).',
      'Container must have a shell installed (/bin/bash or /bin/sh).',
    ],
    parameters: [
      { flag: '-i', purpose: 'Keep standard input open (interactive)' },
      { flag: '-t', purpose: 'Allocate a pseudo-terminal (TTY)' },
      { flag: '-c <container-name>', purpose: 'Required if the pod has multiple containers' },
      { flag: '-- /bin/sh', purpose: 'Fallback shell if /bin/bash is not installed (e.g. Alpine Linux)' },
    ],
    steps: [
      {
        title: 'Verify the pod is running',
        instruction: 'Check that the pod is in Running state before attempting to exec:',
        command: 'kubectl get pods -n default',
      },
      {
        title: 'Exec with bash',
        instruction: 'Run interactive exec into the primary container:',
        command: 'kubectl exec -it my-pod -n default -- /bin/bash',
      },
      {
        title: 'Alpine fallback if bash is not found',
        instruction: 'If the container returns "OCI runtime exec failed: /bin/bash: not found", use /bin/sh:',
        command: 'kubectl exec -it my-pod -n default -- /bin/sh',
      },
    ],
    troubleshootingTips: [
      'In multi-container pods, specify `-c <container-name>` or kubectl will default to the first container defined in the spec.',
      'Production distroless or scratch images do not include shells. For those, use ephemeral debug containers: `kubectl debug -it <pod> --image=busybox`.',
    ],
    faqs: [
      {
        question: 'Why do I get "exec: /bin/bash: stat /bin/bash: no such file or directory"?',
        answer: 'Many lightweight container images (like Alpine Linux or slim Debian) do not install bash by default. Replace `/bin/bash` with `/bin/sh`.'
      },
      {
        question: 'How do I run a single command without entering an interactive shell?',
        answer: 'Omit `-it` and specify the command directly: `kubectl exec my-pod -n default -- env`.'
      }
    ]
  },
  {
    slug: 'kubectl-debug-crashloopbackoff',
    title: 'How to Debug and Fix CrashLoopBackOff Pods in Kubernetes',
    shortTitle: 'Debug CrashLoopBackOff',
    category: 'Troubleshooting',
    riskLevel: 'safe',
    command: 'kubectl logs my-pod -n default --previous && kubectl describe pod my-pod -n default',
    summary: 'Systematic diagnosis workflow to inspect exit codes, crash logs, OOMKilled events, and liveness probe failures in failing pods.',
    description: 'A `CrashLoopBackOff` indicates that a container started, crashed, and Kubernetes is waiting through exponential backoff before restarting it. The root cause is almost always an unhandled application exception, missing environment variable, failed DB migration, or out-of-memory (OOM) termination.',
    prerequisites: [
      'kubectl access with describe and logs permissions.',
    ],
    parameters: [
      { flag: '--previous', purpose: 'Fetch logs from the crashed container instance before the restart', defaultValue: '--previous' },
      { flag: '-c <container>', purpose: 'Specify container name if multiple exist in pod' },
    ],
    steps: [
      {
        title: 'Check the previous crash logs',
        instruction: 'Fetch the stdout/stderr log output from the container immediately before it died:',
        command: 'kubectl logs my-pod -n default --previous',
      },
      {
        title: 'Describe pod events and exit code',
        instruction: 'Look at the "Last State" section to find the Exit Code and termination reason:',
        command: 'kubectl describe pod my-pod -n default',
      },
      {
        title: 'Check for Out Of Memory (OOMKilled)',
        instruction: 'Exit Code 137 indicates the container exceeded its memory limit and was killed by the Linux kernel OOM killer.',
      },
    ],
    troubleshootingTips: [
      'Exit Code 137: Pod was killed due to Out Of Memory (OOM). Increase `resources.limits.memory`.',
      'Exit Code 1: Application threw an uncaught error (e.g. missing DB connection string or secrets).',
      'Exit Code 143: Graceful SIGTERM received (usually pod eviction or liveness probe failure).',
      'Check if livenessProbe `initialDelaySeconds` is too low, causing Kubelet to kill the app before it finishes booting.',
    ],
    faqs: [
      {
        question: 'What does CrashLoopBackOff actually mean?',
        answer: 'It means the pod repeatedly exits with an error status, and Kubelet delays successive restarts by 10s, 20s, 40s, up to 5 minutes to avoid burning CPU cycles.'
      },
      {
        question: 'How do I stop a pod from crashing repeatedly so I can debug inside it?',
        answer: 'Temporarily override the container command in the manifest with `command: ["sleep", "3600"]` to keep the container running indefinitely.'
      }
    ]
  },
  {
    slug: 'kubectl-force-delete-terminating-pod',
    title: 'How to Force Delete a Kubernetes Pod Stuck in Terminating State',
    shortTitle: 'Force Delete Terminating Pod',
    category: 'Troubleshooting',
    riskLevel: 'destructive',
    command: 'kubectl delete pod my-pod -n default --grace-period=0 --force',
    summary: 'Forcefully remove an unkillable pod stuck in Terminating status due to dead nodes, NFS volume locks, or hanging finalizers.',
    description: 'When a pod is deleted, Kubernetes sends SIGTERM and waits for the grace period (default 30s). If the host node crashed or a volume detachment is blocked, the pod stays in `Terminating`. Using `--grace-period=0 --force` immediately purges the pod record from the etcd control plane.',
    prerequisites: [
      'Cluster admin or namespace delete permissions.',
    ],
    parameters: [
      { flag: '--grace-period=0', purpose: 'Bypasses the 30-second graceful shutdown wait time' },
      { flag: '--force', purpose: 'Forces immediate deletion from the Kubernetes API server' },
    ],
    steps: [
      {
        title: 'Attempt normal deletion first',
        instruction: 'Always give the application a chance to clean up gracefully:',
        command: 'kubectl delete pod my-pod -n default',
      },
      {
        title: 'Force purge if stuck in Terminating',
        instruction: 'If the pod remains stuck after several minutes, issue force deletion:',
        command: 'kubectl delete pod my-pod -n default --grace-period=0 --force',
      },
      {
        title: 'Patch finalizers if still refusing to delete',
        instruction: 'If finalizers are blocking deletion, strip the finalizers array:',
        command: 'kubectl patch pod my-pod -n default -p \'{"metadata":{"finalizers":null}}\'',
      },
    ],
    troubleshootingTips: [
      'Warning: If the node hosting the pod is still alive and running processes, force deleting can cause two pods to run simultaneously (split-brain).',
      'For StatefulSets with persistent volumes, ensure the underlying storage volume is released before forcing deletion.',
    ],
    faqs: [
      {
        question: 'Why do Kubernetes pods get stuck in Terminating?',
        answer: 'Common causes include unreachable worker nodes (NotReady), hanging persistent volume detachments, or custom finalizers waiting on external resources.'
      }
    ]
  },
  {
    slug: 'kubectl-rollout-restart-deployment',
    title: 'How to Restart a Kubernetes Deployment with Zero Downtime',
    shortTitle: 'Restart Deployment Zero Downtime',
    category: 'Deployments & Workloads',
    riskLevel: 'safe',
    command: 'kubectl rollout restart deployment/my-app -n default',
    summary: 'Trigger a clean rolling restart across all replica pods of a deployment without changing image tags or experiencing service downtime.',
    description: '`kubectl rollout restart` injects a new restart timestamp annotation (`kubectl.kubernetes.io/restartedAt`) into the Deployment PodTemplateSpec. This triggers a standard rolling update: new pods start and pass readiness probes before old pods receive SIGTERM.',
    prerequisites: [
      'Deployment must have replicas >= 2 for zero downtime.',
      'Deployment must define working readinessProbe checks.',
    ],
    parameters: [
      { flag: 'deployment/<name>', purpose: 'Deployment resource to trigger rolling restart on' },
      { flag: '-n <namespace>', purpose: 'Namespace where deployment resides' },
    ],
    steps: [
      {
        title: 'Trigger rolling restart',
        instruction: 'Initiate the rolling restart without changing configuration:',
        command: 'kubectl rollout restart deployment/my-app -n default',
      },
      {
        title: 'Watch the rollout progress',
        instruction: 'Stream live status until all new replica pods are ready:',
        command: 'kubectl rollout status deployment/my-app -n default',
      },
      {
        title: 'Rollback if errors arise',
        instruction: 'If the newly spawned pods fail, instantly undo the restart:',
        command: 'kubectl rollout undo deployment/my-app -n default',
      },
    ],
    troubleshootingTips: [
      'Ensure `readinessProbe` is configured so traffic is not routed to starting pods prematurely.',
      'If you updated a ConfigMap or Secret mounted as environment variables, running `rollout restart` will reload the new values.',
    ],
    faqs: [
      {
        question: 'Does rollout restart cause downtime?',
        answer: 'No, provided your deployment uses the default RollingUpdate strategy with maxSurge/maxUnavailable and has working readiness probes.'
      }
    ]
  },
  {
    slug: 'kubectl-top-pods-nodes',
    title: 'How to Check CPU and Memory Resource Usage of Pods and Nodes',
    shortTitle: 'Check CPU & Memory (top)',
    category: 'Monitoring & Resources',
    riskLevel: 'safe',
    command: 'kubectl top pods -A --sort-by=memory',
    summary: 'Monitor live CPU and RAM consumption across all pods and cluster nodes using the Kubernetes metrics-server API.',
    description: '`kubectl top` retrieves real-time CPU and memory metrics reported by cAdvisor and metrics-server. It is the fastest way to identify memory leaks, resource hogging pods, and unallocated capacity across cluster worker nodes.',
    prerequisites: [
      'Metrics Server must be installed and active in the cluster (`kube-system`).',
    ],
    parameters: [
      { flag: '-A, --all-namespaces', purpose: 'Show pods across every namespace' },
      { flag: '--sort-by=memory', purpose: 'Sort results by memory usage descending (or --sort-by=cpu)' },
      { flag: '--containers', purpose: 'Break down memory/CPU per individual container inside pods' },
    ],
    steps: [
      {
        title: 'Find highest memory pods in current namespace',
        instruction: 'List pods sorted by RAM consumption:',
        command: 'kubectl top pods -n default --sort-by=memory',
      },
      {
        title: 'Find cluster-wide top CPU pods',
        instruction: 'Check across all namespaces for CPU spikes:',
        command: 'kubectl top pods -A --sort-by=cpu',
      },
      {
        title: 'Inspect cluster worker node utilization',
        instruction: 'Check memory and CPU pressure on physical/virtual nodes:',
        command: 'kubectl top nodes',
      },
    ],
    troubleshootingTips: [
      'If you receive "error: Metrics API not available", install Kubernetes Metrics Server: `kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml`.',
      'CPU is reported in millicores (e.g. 250m = 0.25 CPU cores), and memory in MiB (e.g. 512Mi).',
    ],
    faqs: [
      {
        question: 'What does 100m CPU mean in kubectl top?',
        answer: '100m represents 100 millicores, which is equivalent to 10% (0.10) of a single CPU core.'
      }
    ]
  },
  {
    slug: 'kubectl-create-secret-generic',
    title: 'How to Create a Kubernetes Generic Secret from an .env File',
    shortTitle: 'Create Secret from .env File',
    category: 'Config & Secrets',
    riskLevel: 'safe',
    command: 'kubectl create secret generic app-secrets --from-env-file=.env -n default',
    summary: 'Directly import local environment variable files (.env) into encrypted Kubernetes Secret objects without manual base64 encoding.',
    description: '`kubectl create secret generic` reads key-value pairs from standard `.env` configuration files, encodes each value in base64, and creates a Kubernetes Secret resource ready to be mounted or injected via `envFrom` into Pods.',
    prerequisites: [
      'Valid local .env file with KEY=VALUE syntax.',
      'Permission to create secrets in the target namespace.',
    ],
    parameters: [
      { flag: 'generic <secret-name>', purpose: 'Name of the Secret to generate' },
      { flag: '--from-env-file=<path>', purpose: 'Path to local .env file containing secrets' },
      { flag: '--dry-run=client -o yaml', purpose: 'Generate YAML manifest output without applying to cluster' },
    ],
    steps: [
      {
        title: 'Prepare .env file',
        instruction: 'Ensure secret values are defined in KEY=VALUE pairs:',
      },
      {
        title: 'Create secret in cluster',
        instruction: 'Execute the creation command:',
        command: 'kubectl create secret generic app-secrets --from-env-file=.env -n default',
      },
      {
        title: 'Generate YAML manifest for GitOps',
        instruction: 'Use dry-run mode to export clean YAML for version control (remember to encrypt with SealedSecrets or SOPS!):',
        command: 'kubectl create secret generic app-secrets --from-env-file=.env --dry-run=client -o yaml > secret.yaml',
      },
    ],
    troubleshootingTips: [
      'Never commit unencrypted secret YAML files to public git repositories.',
      'If updating an existing secret, delete the old secret first or pipe with `kubectl create secret ... --dry-run=client -o yaml | kubectl apply -f -`.',
    ],
    faqs: [
      {
        question: 'How do I mount all keys from this secret into a Deployment?',
        answer: 'Add `envFrom: [ { secretRef: { name: "app-secrets" } } ]` under the container spec.'
      }
    ]
  },
  {
    slug: 'kubectl-drain-node-maintenance',
    title: 'How to Safely Drain a Kubernetes Node for Maintenance',
    shortTitle: 'Safely Drain Node',
    category: 'Cluster & Nodes',
    riskLevel: 'destructive',
    command: 'kubectl drain node-1 --ignore-daemonsets --delete-emptydir-data --force',
    summary: 'Evict all workloads from a worker node in an orderly fashion before rebooting, upgrading the kernel, or resizing VM capacity.',
    description: '`kubectl drain` cordons the specified node (marking it unschedulable) and evicts running pods respecting PodDisruptionBudgets (PDBs). Evicted pods are rescheduled onto other healthy worker nodes in the cluster.',
    prerequisites: [
      'Cluster admin access.',
      'Sufficient compute capacity on remaining nodes to absorb workloads.',
    ],
    parameters: [
      { flag: '--ignore-daemonsets', purpose: 'Skip DaemonSet-managed pods (monitoring, networking, logging)' },
      { flag: '--delete-emptydir-data', purpose: 'Allow eviction even if pods use emptyDir ephemeral storage' },
      { flag: '--grace-period=<sec>', purpose: 'Override default grace period for pod termination' },
    ],
    steps: [
      {
        title: 'Drain the node',
        instruction: 'Safely cordon and evict workloads:',
        command: 'kubectl drain node-1 --ignore-daemonsets --delete-emptydir-data',
      },
      {
        title: 'Perform maintenance',
        instruction: 'Perform OS upgrades, kernel updates, or hardware replacement.',
      },
      {
        title: 'Uncordon node after maintenance',
        instruction: 'Mark the node schedulable again so it can accept new pods:',
        command: 'kubectl uncordon node-1',
      },
    ],
    troubleshootingTips: [
      'If pods are stuck evicting, check if a PodDisruptionBudget (PDB) is preventing minimum available replicas from dropping.',
      'Do not forget to run `kubectl uncordon <node>` once maintenance is complete.',
    ],
    faqs: [
      {
        question: 'What is the difference between kubectl cordon and kubectl drain?',
        answer: '`cordon` merely prevents new pods from being scheduled on the node. `drain` cordons the node AND actively evicts all existing pods to other nodes.'
      }
    ]
  },
  {
    slug: 'kubectl-switch-context-namespace',
    title: 'How to Switch Kubernetes Context and Default Namespace',
    shortTitle: 'Switch Context & Namespace',
    category: 'Cluster & Nodes',
    riskLevel: 'safe',
    command: 'kubectl config use-context prod-cluster && kubectl config set-context --current --namespace=my-namespace',
    summary: 'Quickly switch between Kubernetes clusters (contexts) and change your default active namespace without typing -n every time.',
    description: '`kubectl config` commands modify your local kubeconfig file (`~/.kube/config`). Setting the active context switches cluster credentials, while setting the current namespace eliminates the need to pass `-n <namespace>` on every command.',
    prerequisites: [
      'Configured ~/.kube/config file with valid clusters and users.',
    ],
    parameters: [
      { flag: 'use-context <name>', purpose: 'Switch active cluster credentials and API endpoint' },
      { flag: 'set-context --current --namespace=<name>', purpose: 'Sets default namespace for future commands' },
    ],
    steps: [
      {
        title: 'List available contexts',
        instruction: 'View all configured cluster contexts:',
        command: 'kubectl config get-contexts',
      },
      {
        title: 'Switch to another cluster context',
        instruction: 'Change active cluster to staging or prod:',
        command: 'kubectl config use-context my-cluster-context',
      },
      {
        title: 'Set default working namespace',
        instruction: 'Avoid having to type -n on every single query:',
        command: 'kubectl config set-context --current --namespace=production',
      },
    ],
    troubleshootingTips: [
      'Use CLI tools like `kubectx` and `kubens` for interactive fuzzy-search switching between contexts and namespaces.',
      'Check current context at any time with `kubectl config current-context`.',
    ],
    faqs: [
      {
        question: 'Where is the active Kubernetes context stored?',
        answer: 'It is stored in the `current-context` field inside `~/.kube/config` on Linux/macOS or `%USERPROFILE%\\.kube\\config` on Windows.'
      }
    ]
  },
  {
    slug: 'kubectl-view-pod-logs-multi-container',
    title: 'How to Stream Live Logs from Kubernetes Pods and Deployments',
    shortTitle: 'Stream Live Pod Logs',
    category: 'Debug & Inspection',
    riskLevel: 'safe',
    command: 'kubectl logs -f -l app=my-app -n default --max-log-requests=10 --tail=100',
    summary: 'Stream, tail, and aggregate real-time stdout/stderr log output across multiple pod replicas matching a label selector.',
    description: '`kubectl logs` streams log lines directly from the container runtime (containerd/CRI-O). Using label selectors (`-l app=my-app`) aggregates log streams from all running pod replicas simultaneously.',
    prerequisites: [
      'Pods must have published logs to stdout or stderr.',
    ],
    parameters: [
      { flag: '-f, --follow', purpose: 'Stream logs continuously in real-time (like tail -f)' },
      { flag: '-l <label-selector>', purpose: 'Stream logs from all pods matching the selector' },
      { flag: '--tail=<n>', purpose: 'Number of recent lines to display (default: all)' },
      { flag: '--timestamps', purpose: 'Prefix each log line with an RFC3339 timestamp' },
    ],
    steps: [
      {
        title: 'Follow single pod logs',
        instruction: 'Stream logs from a specific pod:',
        command: 'kubectl logs -f my-pod -n default',
      },
      {
        title: 'Stream logs across all deployment replicas',
        instruction: 'Follow logs from every pod matching app label:',
        command: 'kubectl logs -f -l app=my-app -n default --tail=100',
      },
      {
        title: 'Add timestamps to diagnose latency',
        instruction: 'Include exact timestamps with each log line:',
        command: 'kubectl logs my-pod -n default --timestamps --tail=50',
      },
    ],
    troubleshootingTips: [
      'If using `-l` across many pods, set `--max-log-requests=10` or more if some pods are omitted.',
      'For complex multi-pod log filtering with regex and color coding, tools like `stern` are highly recommended.',
    ],
    faqs: [
      {
        question: 'How do I log a specific container in a multi-container pod?',
        answer: 'Add `-c <container-name>`: `kubectl logs -f my-pod -c api-gateway -n default`.'
      }
    ]
  }
];

export function getAllK8sRecipes(): K8sRecipe[] {
  return K8S_RECIPES;
}

export function getK8sRecipeBySlug(slug: string): K8sRecipe | undefined {
  return K8S_RECIPES.find((r) => r.slug === slug);
}
