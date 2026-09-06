export interface GitRecipe {
  slug: string;
  title: string;
  shortTitle: string;
  category: 'Undo & History' | 'Branches & Tags' | 'Remote & Sync' | 'Stash & Clean' | 'Conflicts & Merge';
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

export const GIT_RECIPES: GitRecipe[] = [
  {
    slug: 'undo-last-commit',
    title: 'How to Undo the Last Commit in Git',
    shortTitle: 'Undo Last Commit',
    category: 'Undo & History',
    difficulty: 'Beginner',
    riskLevel: 'Safe',
    summary: 'Undo your most recent Git commit while keeping all your edited files staged or unstaged in your working directory.',
    quickCommand: 'git reset --soft HEAD~1',
    scenario: 'You just committed changes, but realized you forgot to include a file, made a typo in code, or need to tweak the commit message before pushing.',
    steps: [
      {
        title: 'Keep changes staged (Soft Reset)',
        command: 'git reset --soft HEAD~1',
        explanation: 'Removes the commit from history but keeps all your modified files in the staging area ready to re-commit.',
      },
      {
        title: 'Keep changes unstaged (Mixed Reset - Default)',
        command: 'git reset HEAD~1',
        explanation: 'Undoes the commit and unstages changes, keeping files modified in your working tree.',
      },
      {
        title: 'Permanently discard commit and all changes (Hard Reset)',
        command: 'git reset --hard HEAD~1',
        explanation: 'WARNING: Permanently deletes the commit and all file modifications made in it.',
      },
    ],
    alternatives: [
      {
        name: 'If already pushed to remote',
        command: 'git revert HEAD',
        whenToUse: 'Creates a new commit that inverts the previous commit, preserving shared branch history safely.',
      },
    ],
    pitfalls: [
      'Never use "git reset --hard" if you have uncommitted work you want to save.',
      'If you have already pushed to GitHub/GitLab, rewriting history with "git reset" requires force pushing (git push --force-with-lease), which can disrupt teammates.',
    ],
    faqs: [
      {
        question: 'What is the difference between git reset --soft and git reset --hard?',
        answer: 'git reset --soft HEAD~1 only moves the HEAD pointer back, leaving your working files and staging area intact. git reset --hard destroys both the commit and any uncommitted modifications in your working directory.',
      },
      {
        question: 'How do I undo a commit that was already pushed to remote origin?',
        answer: 'Use "git revert HEAD" instead of reset. This creates a clean inverse commit that undoes the changes without rewriting Git history.',
      },
    ],
  },
  {
    slug: 'discard-local-changes',
    title: 'How to Discard All Local Changes in Git',
    shortTitle: 'Discard All Local Changes',
    category: 'Undo & History',
    difficulty: 'Beginner',
    riskLevel: 'Destructive',
    summary: 'Discard all unstaged and uncommitted file modifications and restore your working tree to the latest commit.',
    quickCommand: 'git restore .',
    scenario: 'You experimented with code that didn\'t work out and want to cleanly discard all changes since your last commit.',
    steps: [
      {
        title: 'Discard unstaged changes in all tracked files',
        command: 'git restore .',
        explanation: 'Reverts all modified tracked files in the current repository back to their clean commit state.',
      },
      {
        title: 'Discard staged files',
        command: 'git restore --staged .',
        explanation: 'Unstages all files added with "git add .", restoring them to unstaged modified status.',
      },
      {
        title: 'Remove untracked files and directories',
        command: 'git clean -fd',
        explanation: 'Deletes any new untracked files (-f) and untracked directories (-d) created during your experiments.',
      },
    ],
    pitfalls: [
      '"git restore ." and "git clean -fd" cannot be undone! Once discarded, unstaged work is permanently erased.',
      'Consider running "git stash" instead if you might need these experiments later.',
    ],
    faqs: [
      {
        question: 'What is the modern replacement for "git checkout -- ."?',
        answer: 'Git 2.23+ introduced "git restore .", which is the recommended, safer syntax for discarding working tree modifications.',
      },
    ],
  },
  {
    slug: 'rename-branch',
    title: 'How to Rename a Local and Remote Git Branch',
    shortTitle: 'Rename Branch',
    category: 'Branches & Tags',
    difficulty: 'Beginner',
    riskLevel: 'Safe',
    summary: 'Rename your current local branch and update the upstream remote tracking branch on GitHub or GitLab.',
    quickCommand: 'git branch -m <old-name> <new-name>',
    scenario: 'You made a typo in a feature branch name or want to change your branch naming convention to match Jira/ticket standards.',
    steps: [
      {
        title: 'Rename local branch while on it',
        command: 'git branch -m new-branch-name',
        explanation: 'Renames your currently checked-out branch to the new name.',
      },
      {
        title: 'Delete old branch on remote',
        command: 'git push origin --delete old-branch-name',
        explanation: 'Removes the old branch from GitHub/GitLab to avoid stale branch clutter.',
      },
      {
        title: 'Push new branch and set upstream tracking',
        command: 'git push origin -u new-branch-name',
        explanation: 'Pushes the renamed branch and links your local branch to track origin/new-branch-name.',
      },
    ],
    pitfalls: [
      'If you have open Pull Requests on GitHub for the old branch, changing the branch name will automatically close or update the PR branch target.',
    ],
    faqs: [
      {
        question: 'How do I rename the master branch to main?',
        answer: 'Run "git branch -m master main", push with "git push -u origin main", then change the default branch setting in GitHub Repository Settings.',
      },
    ],
  },
  {
    slug: 'delete-remote-branch',
    title: 'How to Delete a Remote Branch in Git',
    shortTitle: 'Delete Remote Branch',
    category: 'Branches & Tags',
    difficulty: 'Beginner',
    riskLevel: 'Reversible',
    summary: 'Delete a branch from remote origin (GitHub, GitLab, Bitbucket) after a pull request has been merged.',
    quickCommand: 'git push origin --delete <branch-name>',
    scenario: 'A feature branch was merged into main and you want to clean up remote branches to keep the repository tidy.',
    steps: [
      {
        title: 'Delete remote branch',
        command: 'git push origin --delete feature-branch',
        explanation: 'Sends a delete command to remote origin for the specified branch.',
      },
      {
        title: 'Delete local branch',
        command: 'git branch -d feature-branch',
        explanation: 'Safely deletes the local branch if it has already been merged.',
      },
      {
        title: 'Force delete unmerged local branch',
        command: 'git branch -D feature-branch',
        explanation: 'Forces deletion of local branch even if not fully merged into current branch.',
      },
      {
        title: 'Prune stale remote-tracking branches',
        command: 'git fetch --prune',
        explanation: 'Removes local references to remote branches that were deleted by other team members.',
      },
    ],
    pitfalls: [
      'Cannot delete the remote branch if it is set as the repository\'s Default Branch on GitHub/GitLab.',
    ],
    faqs: [
      {
        question: 'Why does a deleted remote branch still show up in "git branch -a"?',
        answer: 'Git keeps cached references locally. Run "git remote prune origin" or "git fetch --prune" to synchronize and clean them.',
      },
    ],
  },
  {
    slug: 'change-commit-message',
    title: 'How to Change the Most Recent Git Commit Message',
    shortTitle: 'Change Commit Message',
    category: 'Undo & History',
    difficulty: 'Beginner',
    riskLevel: 'Safe',
    summary: 'Amend the commit message of your latest commit before or after pushing.',
    quickCommand: 'git commit --amend -m "new message"',
    scenario: 'You noticed a spelling mistake, omitted a ticket ID, or formatted the commit message incorrectly.',
    steps: [
      {
        title: 'Change message without opening text editor',
        command: 'git commit --amend -m "New descriptive commit message"',
        explanation: 'Overwrites the latest commit message immediately with the new string.',
      },
      {
        title: 'Change message in default editor (Vim / Nano / VS Code)',
        command: 'git commit --amend',
        explanation: 'Opens your configured core.editor to edit the multiline commit message.',
      },
      {
        title: 'If already pushed: Force push safely',
        command: 'git push --force-with-lease origin <branch-name>',
        explanation: 'Safely updates the remote branch commit history without clobbering unseen coworker commits.',
      },
    ],
    pitfalls: [
      'Never use plain "git push -f" on shared main/master branches. Always prefer "--force-with-lease".',
    ],
    faqs: [
      {
        question: 'Can I add forgotten files to the amended commit?',
        answer: 'Yes! Run "git add <forgotten-file>" first, then run "git commit --amend --no-edit" to fold the file into the latest commit.',
      },
    ],
  },
  {
    slug: 'unstage-files',
    title: 'How to Unstage Files from Git (Undo git add)',
    shortTitle: 'Unstage Files (Undo git add)',
    category: 'Undo & History',
    difficulty: 'Beginner',
    riskLevel: 'Safe',
    summary: 'Remove files from the Git staging area (index) without losing any of your local changes.',
    quickCommand: 'git restore --staged <file>',
    scenario: 'You accidentally ran "git add ." and included sensitive files (like .env or large build binaries) you didn\'t intend to commit.',
    steps: [
      {
        title: 'Unstage a single specific file',
        command: 'git restore --staged <file-path>',
        explanation: 'Removes the file from index; your changes remain safe in your working directory.',
      },
      {
        title: 'Unstage all staged files at once',
        command: 'git restore --staged .',
        explanation: 'Clears the entire staging area back to unstaged modified state.',
      },
    ],
    pitfalls: [
      'Do NOT confuse "git restore --staged <file>" with "git restore <file>". Omitting "--staged" will permanently wipe your changes!',
    ],
    faqs: [
      {
        question: 'What is the legacy command for unstaging files?',
        answer: 'Older Git versions used "git reset HEAD <file>". Both achieve the same result, but "git restore --staged" is the clearer modern syntax.',
      },
    ],
  },
  {
    slug: 'git-stash-untracked',
    title: 'How to Stash Untracked and Modified Files in Git',
    shortTitle: 'Stash Untracked Files',
    category: 'Stash & Clean',
    difficulty: 'Beginner',
    riskLevel: 'Safe',
    summary: 'Temporarily shelve both modified and newly created untracked files to switch branches with a clean working copy.',
    quickCommand: 'git stash -u',
    scenario: 'You are midway through developing a feature when an urgent production bug needs fixing on another branch.',
    steps: [
      {
        title: 'Stash modified & newly created untracked files',
        command: 'git stash -u',
        explanation: '-u (or --include-untracked) ensures newly created files that have not yet been added are also stashed.',
      },
      {
        title: 'Stash with a memorable name',
        command: 'git stash save "wip: auth login form refactor"',
        explanation: 'Gives the stash a clear description in your stash list.',
      },
      {
        title: 'List all current stashes',
        command: 'git stash list',
        explanation: 'Displays all stashed entries with indices like stash@{0}, stash@{1}.',
      },
      {
        title: 'Re-apply and remove the latest stash',
        command: 'git stash pop',
        explanation: 'Applies the changes back to your working copy and removes it from the stash stack.',
      },
    ],
    pitfalls: [
      'Plain "git stash" ignores untracked files! Always use "-u" if you created new files.',
    ],
    faqs: [
      {
        question: 'What is the difference between git stash pop and git stash apply?',
        answer: '"git stash pop" applies the changes and removes the stash from the list. "git stash apply" restores the changes but keeps the stash in the list.',
      },
    ],
  },
  {
    slug: 'force-pull-overwrite-local',
    title: 'How to Force Git Pull to Overwrite Local Files',
    shortTitle: 'Force Pull (Overwrite Local)',
    category: 'Remote & Sync',
    difficulty: 'Intermediate',
    riskLevel: 'Destructive',
    summary: 'Completely overwrite your local repository with the exact state of the remote branch.',
    quickCommand: 'git fetch origin && git reset --hard origin/main',
    scenario: 'Your local branch is out of sync or broken, and you want to discard local discrepancies and mirror remote origin exactly.',
    steps: [
      {
        title: 'Fetch latest commits from remote origin',
        command: 'git fetch origin',
        explanation: 'Downloads all remote branch updates and metadata without touching working files.',
      },
      {
        title: 'Hard reset local branch to remote branch',
        command: 'git reset --hard origin/<branch-name>',
        explanation: 'Forces local HEAD, index, and working tree to match origin/<branch-name> exactly.',
      },
      {
        title: 'Clean untracked files (Optional)',
        command: 'git clean -fd',
        explanation: 'Deletes any remaining untracked files and directories not present in remote.',
      },
    ],
    pitfalls: [
      'All local commits and uncommitted changes not pushed to remote will be permanently destroyed.',
    ],
    faqs: [
      {
        question: 'Why doesn\'t "git pull --force" overwrite local files?',
        answer: 'The "--force" flag on git pull only applies to fetch refspecs, not the working tree merge. To overwrite local changes, you must use "git fetch" followed by "git reset --hard".',
      },
    ],
  },
  {
    slug: 'cherry-pick-commit',
    title: 'How to Cherry-Pick a Commit to Another Branch',
    shortTitle: 'Cherry-Pick a Commit',
    category: 'Branches & Tags',
    difficulty: 'Intermediate',
    riskLevel: 'Safe',
    summary: 'Apply a specific commit from one branch onto your current branch without merging the entire branch.',
    quickCommand: 'git cherry-pick <commit-hash>',
    scenario: 'A bug fix was committed to a feature branch or dev branch, and you need that single fix immediately on production/main.',
    steps: [
      {
        title: 'Switch to target branch',
        command: 'git checkout main',
        explanation: 'Make sure you are on the destination branch that should receive the commit.',
      },
      {
        title: 'Cherry pick the commit',
        command: 'git cherry-pick a1b2c3d',
        explanation: 'Applies the changes from commit a1b2c3d onto your current branch and creates a new commit.',
      },
      {
        title: 'Cherry pick without automatically committing',
        command: 'git cherry-pick -n a1b2c3d',
        explanation: '-n (or --no-commit) stages the changes in your working tree so you can inspect or modify them first.',
      },
    ],
    pitfalls: [
      'If the cherry-picked commit depends on code changes from earlier commits, merge conflicts may occur.',
    ],
    faqs: [
      {
        question: 'How do I cherry-pick a range of commits?',
        answer: 'Run "git cherry-pick A..B" (applies commits after A up to B) or "git cherry-pick A^..B" (includes commit A).',
      },
    ],
  },
  {
    slug: 'untrack-file-keep-local',
    title: 'How to Stop Tracking a File in Git Without Deleting It',
    shortTitle: 'Untrack File (Keep Local)',
    category: 'Undo & History',
    difficulty: 'Beginner',
    riskLevel: 'Safe',
    summary: 'Remove a committed file (such as .env or local config) from Git tracking while preserving the file on your local disk.',
    quickCommand: 'git rm --cached <file-path>',
    scenario: 'You accidentally committed a credentials file or IDE config (.vscode, .idea) and want to remove it from Git and add it to .gitignore.',
    steps: [
      {
        title: 'Remove file from Git index only',
        command: 'git rm --cached <file-path>',
        explanation: 'Deletes the file from Git\'s index (staging area) while leaving the physical file untouched on disk.',
      },
      {
        title: 'Remove entire folder from Git index',
        command: 'git rm -r --cached <folder-path>',
        explanation: 'Recursively untracks all files inside the folder while keeping them on disk.',
      },
      {
        title: 'Add pattern to .gitignore',
        command: 'echo "<file-path>" >> .gitignore',
        explanation: 'Prevents Git from detecting the untracked file as modified in future commits.',
      },
      {
        title: 'Commit the removal',
        command: 'git commit -m "chore: stop tracking <file-path>"',
        explanation: 'Finalizes the untracking in Git history.',
      },
    ],
    pitfalls: [
      'Never omit "--cached"! Running "git rm <file>" will delete the physical file from your hard drive.',
    ],
    faqs: [
      {
        question: 'Will this delete the file for coworkers when they pull?',
        answer: 'Yes! When teammates pull this commit, Git will remove the file from their working directory. Make sure to share a .env.example template.',
      },
    ],
  },
  {
    slug: 'squash-commits-rebase',
    title: 'How to Squash Multiple Commits into One with Git Rebase',
    shortTitle: 'Squash Commits (Rebase)',
    category: 'Undo & History',
    difficulty: 'Intermediate',
    riskLevel: 'Reversible',
    summary: 'Combine multiple messy "wip" or "fix typo" commits into a single clean, atomic commit.',
    quickCommand: 'git rebase -i HEAD~N',
    scenario: 'You have 5 commits on your feature branch like "fix typo", "oops", "wip test" and want to clean up your PR history before merging.',
    steps: [
      {
        title: 'Start interactive rebase for last N commits',
        command: 'git rebase -i HEAD~3',
        explanation: 'Opens your editor displaying the last 3 commits with "pick" next to each.',
      },
      {
        title: 'Change "pick" to "squash" or "s"',
        command: '# pick a1b2c3d First commit\n# s d4e5f6a Second commit\n# s g7h8i9j Third commit',
        explanation: 'Keep the first commit as "pick", and change subsequent commits to "squash" (or "s") to merge them into the first.',
      },
      {
        title: 'Save and write a consolidated commit message',
        command: ':wq',
        explanation: 'Git prompts you to enter a single unified commit message for all squashed changes.',
      },
    ],
    pitfalls: [
      'Do not squash commits that have already been merged into a shared production branch.',
    ],
    faqs: [
      {
        question: 'How do I abort an interactive rebase if something goes wrong?',
        answer: 'Run "git rebase --abort". Your repository will return to the exact state it was in before starting the rebase.',
      },
    ],
  },
  {
    slug: 'resolve-merge-conflict-ours-theirs',
    title: 'How to Resolve Git Merge Conflicts Accepting Ours or Theirs',
    shortTitle: 'Accept Ours / Theirs in Merge',
    category: 'Conflicts & Merge',
    difficulty: 'Intermediate',
    riskLevel: 'Reversible',
    summary: 'Quickly resolve merge conflicts across files by accepting all changes from your branch (--ours) or the incoming branch (--theirs).',
    quickCommand: 'git checkout --ours <file> OR git checkout --theirs <file>',
    scenario: 'A generated file (like package-lock.json or schema.rb) has 100 conflict lines and you want to completely accept one version.',
    steps: [
      {
        title: 'Accept your current branch version (Ours)',
        command: 'git checkout --ours <file-path>',
        explanation: 'Replaces the conflicted file with the version from the branch you are currently on.',
      },
      {
        title: 'Accept incoming branch version (Theirs)',
        command: 'git checkout --theirs <file-path>',
        explanation: 'Replaces the conflicted file with the incoming version from the branch being merged.',
      },
      {
        title: 'Stage the resolved file and commit',
        command: 'git add <file-path> && git commit -m "fix: resolve conflict using theirs"',
        explanation: 'Marks the conflict as resolved and finalizes the merge.',
      },
    ],
    pitfalls: [
      'During a "git rebase", the meanings of "ours" and "theirs" are swapped because rebase replays your commits onto upstream.',
    ],
    faqs: [
      {
        question: 'How do I accept "theirs" for all conflicted files at once?',
        answer: 'Run "git checkout --theirs ." followed by "git add ." to accept incoming changes across the entire workspace.',
      },
    ],
  },
  {
    slug: 'git-log-graph',
    title: 'How to View Git Commit History as a Beautiful One-Line Graph',
    shortTitle: 'Git Log Pretty Graph',
    category: 'Undo & History',
    difficulty: 'Beginner',
    riskLevel: 'Safe',
    summary: 'Format git log into an easy-to-read ASCII branch graph with short hashes, relative dates, author, and branch labels.',
    quickCommand: 'git log --oneline --graph --decorate --all',
    scenario: 'You want a visual branch overview of merges, branches, and commits directly in your terminal without opening a GUI app.',
    steps: [
      {
        title: 'Standard compact one-line graph',
        command: 'git log --graph --oneline --decorate --all',
        explanation: 'Displays a color-coded ASCII graph of all branches, tags, and commits in chronological order.',
      },
      {
        title: 'Create a permanent alias "git lg"',
        command: 'git config --global alias.lg "log --color --graph --pretty=format:\'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset\' --abbrev-commit"',
        explanation: 'Allows you to simply type "git lg" anytime to view a beautifully formatted terminal log.',
      },
    ],
    pitfalls: [
      'Press "q" in your terminal to exit the git log pager view.',
    ],
    faqs: [
      {
        question: 'How do I limit the output to the last 10 commits?',
        answer: 'Add "-n 10" to the command (e.g. "git log --oneline --graph -n 10").',
      },
    ],
  },
  {
    slug: 'revert-merge-commit',
    title: 'How to Revert a Merged Pull Request in Git',
    shortTitle: 'Revert a Merge Commit',
    category: 'Conflicts & Merge',
    difficulty: 'Advanced',
    riskLevel: 'Safe',
    summary: 'Safely revert an accidentally merged Pull Request or merge commit using git revert with parent specification.',
    quickCommand: 'git revert -m 1 <merge-commit-hash>',
    scenario: 'A PR was merged into production/main that caused severe regressions, and you need to immediately roll it back.',
    steps: [
      {
        title: 'Find the merge commit hash',
        command: 'git log --oneline -n 5',
        explanation: 'Look for the commit that says "Merge pull request #..." and copy its hash.',
      },
      {
        title: 'Revert the merge commit specifying parent 1',
        command: 'git revert -m 1 <merge-hash>',
        explanation: '-m 1 tells Git that parent 1 (the main branch you merged into) should be preserved as the mainline.',
      },
      {
        title: 'Push the revert to production',
        command: 'git push origin main',
        explanation: 'Deploys the rollback commit cleanly without rewriting shared branch history.',
      },
    ],
    pitfalls: [
      'If you later want to re-merge the reverted branch, you must first revert the revert commit, otherwise Git considers those changes already incorporated.',
    ],
    faqs: [
      {
        question: 'Why does "git revert" fail on a merge commit without "-m"?',
        answer: 'A merge commit has two parents. Git needs to know which parent branch to keep as the baseline, which is specified by "-m 1".',
      },
    ],
  },
  {
    slug: 'git-reflog-recover-lost-commits',
    title: 'How to Recover Deleted Commits or Branches with Git Reflog',
    shortTitle: 'Recover Lost Commits (Reflog)',
    category: 'Undo & History',
    difficulty: 'Advanced',
    riskLevel: 'Safe',
    summary: 'Find and restore commits or branches that were accidentally lost after a hard reset, bad rebase, or branch deletion.',
    quickCommand: 'git reflog',
    scenario: 'You accidentally ran "git reset --hard" or deleted a branch before pushing, and thought your code was gone forever.',
    steps: [
      {
        title: 'View all recent HEAD movements',
        command: 'git reflog',
        explanation: 'Shows a chronological log of every HEAD change (commits, checkouts, resets) with identifiers like HEAD@{2}.',
      },
      {
        title: 'Find the commit right before the accident',
        command: 'git reflog show --date=relative',
        explanation: 'Helps identify which point in time contained your lost work.',
      },
      {
        title: 'Restore to a new recovery branch',
        command: 'git checkout -b recovery-branch HEAD@{2}',
        explanation: 'Creates a brand new branch pointing directly to the recovered commit state.',
      },
    ],
    pitfalls: [
      'Reflog entries expire after 30 to 90 days depending on git gc settings.',
    ],
    faqs: [
      {
        question: 'Does git reflog track files that were never committed?',
        answer: 'No. Git reflog only records commits. Unstaged, uncommitted files discarded with "git restore" cannot be recovered via reflog.',
      },
    ],
  },
];

export function getAllGitRecipes(): GitRecipe[] {
  return GIT_RECIPES;
}

export function getGitRecipeBySlug(slug: string): GitRecipe | undefined {
  return GIT_RECIPES.find((r) => r.slug === slug);
}
