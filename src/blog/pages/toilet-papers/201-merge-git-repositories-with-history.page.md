---
tags: ["Git", "Mono Repository", "Toilet Paper"]
title: "Merging Git Repositories Including Their Histories"
description: >
  Some of you know the problem: You want to merge multiple repositories into a single mono-repo. But how can you do that without losing the history of one of them? The solution is actually quite simple!
created: "2025-03-23"
---

## Defining The Target Repository

First, we need to define the **source repositories** and the **target repository**. You can either use an existing repo as target or create a completely new one. Chose whatever fits your needs.

## Keeping Things Simple

For simplicity, assume the following:
- My example **source repo** is named `foo`. It will receive the `_foo` suffix. Change it to whatever your source is.
- The main deveopment branch of my **source repositories** is `develop`. Adjust that as well if your setup is different.
- We create **a new target repository**. If you decide to use an existing repo as target, look further below for adjusted instructions.
- **All of the changes are performed locally** and when you're done, you can push the final branch to your remote.

## Preparing The Source Repository

For every **source repository**, do the following:

- Create a remote entry in the local **target repository**:\
  `git remote add --fetch source_repo_foo <old repository URL>`
- Check out the **source branch** as a new branch, for example `source_migration_foo`:\
  `git checkout -b source_migration_foo source_repo_foo/develop`
- In this **new** branch, prepare your folder structure, so that you won't get conflicts when merging them.
- It is important to do as **few content changes** as possible here, as otherwise Git might lose the link in history.
- If you need content changes, try to do multiple commits **without squashing** them. For example:
  - Move the files without changing the content. Create a commit.
  - Undo the move, now use the refactoring utils of your IDE to do the same thing. Create a commit.
- If you have [pre-commit hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) setup, you may need to use `--no-verify` or disable the hooks during the migration altogether.

## Merging Everything

At this point, you should have prepared all branches in the new folder structure, and there are **no file-paths** that might **conflict** during merge.
This doesn't have to work yet and it doesn't have to be pretty.

Now you can checkout the **target branch** and merge the prepared branches:

- **If you would** perform a normal merge, Git would complain that it doesn't find any common ground between the two branches.
- **You need to tell it** that it's okay:\
  `git merge source_migration_foo --allow-unrelated-histories`

## Final Changes

- Finally, you can remove the **remote entries** we created during preparation:\
  `git remote remove source_repo_foo`
- Any you can also remove the **migration branches**:\
  `git branch -D source_migration_foo`
- Now, create commits to make the mono-repo work as intended (for example, mono-repo tooling, etc.).

## Differences For an Existing Target Repository

If you decided, that your **target repository** is going to be an existing one, there are a few changes to the above steps:

- Obviously, no need to add the **target repository** as a remote, as you already have it.
- When merging everything, **don't merge** it on the **final branch** (like `main` or `develop`), but instead create a new branch.
- You can merge the new branch into the **final branch** when you are sure everything works as intended.

## Things to Consider

The above **only** works for the **files and their histories**. Tags, open branches, PRs, GitHub issues and so on will not be migrated like this.
Depending on the amount of work for that, you might want to either do it manually or create scripts to help you along the way.

## Further Aspects

- Source material: https://stackoverflow.com/questions/13040958/merge-two-git-repositories-without-breaking-file-history
- Might be helpful for migrating Git tags: https://phoenixnap.com/kb/git-rename-tag
- Refactoring without losing history: https://vjeko.com/2020/11/24/understanding-renaming-moving-files-with-git/
- An alternative approach: https://gfscott.com/blog/merge-git-repos-and-keep-commit-history/
