# Git commands
# Advanced and useful git commands that are hard to remember

# Git status overview
git-status:
	git status -s

# Git log with pretty format
git-log:
	git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit

# Git bisect helpers
git-bisect-start:
	@echo "Starting git bisect..."
	@echo "Usage: make git-bisect-good or make git-bisect-bad after testing"
	git bisect start

git-bisect-good:
	git bisect good

git-bisect-bad:
	git bisect bad

git-bisect-reset:
	git bisect reset

# Git stash operations
git-stash-save:
	@read -p "Enter stash message: " message; \
	git stash push -m "$$message"

git-stash-list:
	git stash list

git-stash-pop:
	git stash pop

git-stash-apply:
	@read -p "Enter stash number (e.g., 0): " number; \
	git stash apply stash@{$$number}

# Git branch operations
git-branch-create:
	@read -p "Enter new branch name: " branch; \
	git checkout -b $$branch

git-branch-delete:
	@read -p "Enter branch to delete: " branch; \
	git branch -D $$branch

git-branch-list:
	git branch -a

# Git cleanup operations
git-prune:
	git remote prune origin

git-cleanup:
	git fetch -p && git branch -vv | grep ': gone]' | awk '{print $$1}' | xargs -r git branch -D

# Git reflog (useful for recovering lost commits)
git-reflog:
	git reflog

# Git find in history
git-find-in-history:
	@read -p "Enter text to find in git history: " text; \
	git log -p -S "$$text"

# Git blame with date
git-blame:
	@read -p "Enter file to blame: " file; \
	git blame --date=short $$file

# Git cherry-pick
git-cherry-pick:
	@read -p "Enter commit hash to cherry-pick: " commit; \
	git cherry-pick $$commit

# Git rebase interactive
git-rebase-interactive:
	@read -p "Enter number of commits to rebase: " commits; \
	git rebase -i HEAD~$$commits

# Git worktree (manage multiple working directories)
git-worktree-list:
	git worktree list

git-worktree-add:
	@read -p "Enter branch name: " branch; \
	@read -p "Enter path for worktree: " path; \
	git worktree add $$path $$branch

git-worktree-remove:
	@read -p "Enter path of worktree to remove: " path; \
	git worktree remove $$path

# Git submodule operations
git-submodule-add:
	@read -p "Enter repository URL: " repo; \
	@read -p "Enter path to add submodule (leave empty for default): " path; \
	if [ -z "$$path" ]; then \
		git submodule add $$repo; \
	else \
		git submodule add $$repo $$path; \
	fi; \
	git submodule init; \
	@echo "Submodule added successfully. Don't forget to commit the changes."

git-submodule-update:
	git submodule update --init --recursive

git-submodule-pull-all:
	git pull && git submodule foreach git pull origin main

git-submodule-status:
	git submodule status

git-submodule-remove:
	@read -p "Enter submodule path to remove: " path; \
	git submodule deinit -f $$path; \
	git rm -f $$path; \
	rm -rf .git/modules/$$path; \
	@echo "Submodule removed. Don't forget to commit the changes."

# Git hooks management
git-hooks-list:
	ls -la .git/hooks/

# Git diff with external tool
git-difftool:
	@read -p "Enter file to diff: " file; \
	git difftool $$file

# Git show file at specific commit
git-show-file:
	@read -p "Enter commit hash: " commit; \
	@read -p "Enter file path: " file; \
	git show $$commit:$$file
