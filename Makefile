# Modular Makefile for Astro-Tanstack-Router project
.PHONY: default dev start build preview sync test install clean format lint check check-all \
        upgrade upgrade-patch upgrade-minor upgrade-major upgrade-latest outdated dedupe prune audit \
        unit-test test-coverage test-watch test-report partykit-dev partykit-deploy partykit-login partykit-logout dev-all kill-all \
        git-status git-log git-bisect-start git-bisect-good git-bisect-bad git-bisect-reset git-stash-save git-stash-list \
        git-stash-pop git-stash-apply git-branch-create git-branch-delete git-branch-list git-prune git-cleanup git-reflog \
        git-find-in-history git-blame git-cherry-pick git-rebase-interactive git-worktree-list git-worktree-add git-worktree-remove \
        git-submodule-add git-submodule-update git-submodule-pull-all git-submodule-status git-submodule-remove \
        git-hooks-list git-difftool git-show-file

# Include all partial makefiles
include .make/help.mk
include .make/build.mk
include .make/dependencies.mk
include .make/testing.mk
include .make/quality.mk
include .make/partykit.mk
include .make/git.mk
