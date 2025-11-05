---
slug: "keeping-it-clean"
title: "Keeping the git history clean"
lang: "en"
description: "How to keep your Git history clean, write meaningful commits, and use rebase effectively."
pubDate: "2025-10-15"
readingTime: 4
---

The first thing I do when I join a new project is check the Git history.
A quick look already tells me a lot about the team.

There are two things I always look for:
1. How the commit messages are written
2. How the history is structured

## Writing good commit messages

Imagine you’re using git blame to understand why a line of code was written the way it was.
Or maybe you want to generate release notes or find where a bug was introduced.

Which commit message would be more useful to you?

```
fix(ui): prevent modal from getting stuck open
```
or
```
ui bug fix
```

The key is to pick a convention for the project and stick to it.
In 99% of cases, I recommend using [Conventional Commits](https://www.conventionalcommits.org/fr/v1.0.0/).
It’s widely used, well-documented, and supported by plenty of tools.

For personal projects, I also like using [gitmoji](https://gitmoji.dev/) as it makes it easy to identify the type of change.

If you use a ticketing tool like Jira, Linear, or GitHub Issues, a good practice that I advocate for is to always include
the ticket ID in the commit description. Future you will thank you.

Once your commits are meaningful, the next step is to organize them into a clean, linear history.

## Keeping the Git history clean

I like the analogy of a garden. If you leave the branches unattended, it quickly becomes a tangled, overgrown mess.

Luckily, Git gives us plenty of ways to clean things up. Here are the ones I use all the time:

### Amend: fix, reword, or add more changes to the last commit

You need to fix the latest commit, reword its message, or add more changes to it?
That’s exactly what --amend is for.

Imagine you just noticed a typo in the README.md file that you changed in your last commit.

Instead of creating a new commit with the fix, you can integrate your changes into the last commit like so: 

```bash
git add README.md # or whatever files you changed
git commit --amend 
```

I often use it to aggregate my changes in a single WIP commit.

And to reword the last commit message:

```bash 
git commit --amend -m "docs: fix typos in README"
```

### Rebase: Cut and paste a branch

Rebase can look scary at first, but it’s one of Git’s most powerful tools and my favorite.

It moves your commits onto another branch, like cutting and pasting them on top of a new base.

For example, you can update your branch with the latest changes from main without adding a merge commit.

Here’s what the history looks like before rebasing:

![rebase-1](images/3/rebase-1.svg)

```bash
git rebase main
```

Git moves your commits so they sit on top of main, keeping the history clean and linear:

![rebase-2](images/3/rebase-2.svg)

But this is just the tip of the iceberg, you can do a lot more with rebase.

#### Interactive rebase

Imagine I’ve just finished my UI scaffolding feature, and I’m ready to merge it into main.
But, my feature is split into two commits, and I have a commit about docs that needs to be reworded.

![interactive-1](images/3/interactive-1.svg)

There are three things I want to do:
1. Squash the two feature commits (C & E) into one
2. Rename the "add doc" (D) commit with a proper message
3. Rebase the branch on top of main

**Step 1: Start the interactive rebase**

I use the rebase command with the -i (or --interactive) option to start the rebase in interactive mode.
```bash
git rebase -i main
```

**Step 2: View the rebase todo list**

The rebase will open a todo list in your editor with a list of commits, like so :

```bash
pick C # feat: ui part 1
pick D # add doc
pick E # feat: ui part 2
```
The first word ('pick', 'squash', etc.) tells Git what to do with that commit, and the order of the lines decides the order of the commits.

**Step 3: Edit the todo list**

For our example, here is what I would do :

```bash
pick C # feat: ui part 1
squash E # feat: ui part 2
reword D # add doc
```

1. I 'pick' the first commit, which I want to keep
2. I move the "ui part 2" (E) commit in the second position
3. I use 'squash' to merge it into the first one
4. I use 'reword' on the third commit, to change the message

When saving the file, Git will automatically apply the changes to the history.

![interactive-2](images/3/interactive-2.svg)

And there it is, the history is clean, and the branch is up to date with main!

> At any point, if you realize you made a mistake, you can abort the rebase and come back to the original state with:
> ```bash
> git rebase --abort
> ```

**Step 4: Push the new history to the remote**


As rebasing creates new commits, you may need to add the force option to your push command.
```bash
git push --force 
```

### Fixup: quickly fix a specific commit

Let's say you already have multiple commits on your branch and want to fix one of them.

![fixup-1](images/3/fixup-1.svg)

If you want to fix something in commit D, you could simply use the --amend option we saw earlier.

But if you need to fix something in commit C, it would take more work, you’d have to create a new commit, start an interactive rebase, and edit the todo list manually.

Luckily, there’s a better way. You can use the --fixup option to create a new commit that targets directly the one you want to fix.

```bash
git commit --fixup C 
git rebase -i --autosquash main 
```

When you run an interactive rebase with --autosquash, Git automatically moves all fixup commits next to the commits they modify and squashes them for you.

```bash
pick C # feat: scaffolds UI
pick E # fixup
pick D # docs: adds UI screenshots"
```

Now your history is clean, and the fix is properly included in commit C:

![fixup-2](images/3/fixup-2.svg)
    
---

There’s always more to learn about Git, but with these few commands, you’re already most of the way there.

