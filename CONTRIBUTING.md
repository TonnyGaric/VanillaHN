# VanillaHN Contributor Guidelines
First off, thanks for taking time to contribute! 🎉 👍

The following is a set of guidelines for contributing to VainillaHN. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a [new GitHub Issue](https://github.com/TonnyGaric/VanillaHN/issues/new).

## Code of Conduct
This project and everyone contributing to it is governed by the [VanillaHN Code of Conduct](https://github.com/TonnyGaric/VanillaHN/blob/master/CODE_OF_CONDUCT.md). By contributing, you are expected to uphold this code.

## Prerequisites
Before making a contribution, it is important to make sure that the change you wish to make and the approach you wish to take will likely be accepted, otherwise you may end up doing a lot of work for nothing.  If the change is only small, for example, if it's a documentation change or a simple bugfix, then it's likely to be accepted with no prior discussion.  However, new features, or bigger refactorings should first be discussed in a [GitHub issue](https://github.com/TonnyGaric/VanillaHN/issues).

## Procedure
1. Ensure that your contribution meets the following guidelines:
    1. Live up to the current code standard:
        - not violate [DRY](https://97-things-every-x-should-know.gitbooks.io/97-things-every-programmer-should-know/content/en/thing_30/index.html);
        - [Boy Scout Rule](https://97-things-every-x-should-know.gitbooks.io/97-things-every-programmer-should-know/content/en/thing_08/index.html) needs to have been applied.
    2. New code must be:
        * well documented;
        * reformatted;
        * cleaned up.
    4. Implementation-wise, the following things should be avoided as much as possible:
        * inline styles/scripts;
        * race condition.
2. Ensure that your commits are squashed.  See [Squashing Commits](#squashing-commits) for more information.
3. Submit a pull request.

If the pull request does not meet the above requirements then the code should **not** be merged into master, or even reviewed - regardless of how good or important it is. No exceptions. In this case, go read [97 Things Every Programmer Should Know](https://97-things-every-x-should-know.gitbooks.io/97-things-every-programmer-should-know/content/en/).

## Squashing Commits
We prefer that all pull requests be a single commit. There are a few reasons for this:
- It’s much easier and less error prone to backport single commits to stable branches than backport groups of commits. If the change is just in one commit, then there is no opportunity for error, either the whole change is cherry picked, or it isn’t.
- We aim to have our master branch to always be releasable, not just now, but also for all points in history. If we need to back something out, we want to be confident that the commit before that is stable.
- It’s much easier to get a complete picture of what happened in history when changes are self contained in one commit.

Of course, there are some situations where it’s not appropriate to squash commits, this will be decided on a case by case basis, but examples of when we won’t require commits to be squashed include:

- When the pull request contains commits by more than one person. In this case, we’d prefer, where it makes sense, to squash contiguous commits by the same person.
- When the pull request is coming from a fork or branch that has been shared among the community, where rewriting history will cause issues for people that have pull changes from that fork or branch.
- Where the pull request is a very large amount of work, and the commit log is useful in understanding the evolution of that work.

However, for the general case, if your pull request contains more than one commit, then you will need to squash it. To do this, or if you already have submitted a pull request and we ask you to squash it, then you should follow these steps:

1. Ensure that you have all the changes from the core master branch in your repo:
```
git fetch origin
```
2. Start an interactive rebase
```
git rebase -i origin/master
```
3. This will open up a screen in your editor, allowing you to say what should be done with each commit. If the commit message for the first commit is suitable for describing all of the commits, then leave it as is, otherwise, change the command for it from `pick` to `reword`.
4. For each remaining commit, change the command from `pick` to `fixup`. This tells git to merge that commit into the previous commit, using the commit message from the previous commit.
5. Save the file and exit your editor. Git will now start the rebase. If you told it to reword the first commit, it will prompt you in a new editor for the wording for that commit. If all goes well, then you’re done, but it may be the case that there were conflicts when applying your changes to the most recent master branch. If that’s the case, fix the conflicts, stage the fixes, and then run:
```
git rebase --continue
```
This may need to be repeated if there are more changes that have conflicts.
6. Now that you’ve rebased you can push your changes. If you’ve already pushed this branch before (including if you’ve already created the pull request), then you will have to do a force push. This can be done like so:
```
git push yourremote yourbranch --force
```

## Attribution
These Contributor Guidelines is adapted from [Play Framework](https://www.playframework.com/), available at https://github.com/playframework/playframework/blob/master/CONTRIBUTING.md
