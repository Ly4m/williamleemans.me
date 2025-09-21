---
slug: "new-machine-day"
title: "New Machine Day"
lang: "en"
description: "Why I switched from a 16″ to a 14″ MacBook Pro, rebuilt my dev setup from scratch, and added a cozy Gruvbox vibe for autumn."
pubDate: "2025-09-21"
readingTime: 4
---

There’s something strangely exciting about setting up a new machine.

## Why I Switched to 14″

For the past few years I’ve been using a 16" MacBook Pro. But as I’ve started moving more between home, a client’s office, and JetDev’s office, the 14" spare sitting there intrigued me.
Trading some screen space for portability felt appealing, so I decided to give it a try.

> But why a MacBook, you ask?

Over the years I’ve found macOS to be the right balance between Unix features and great desktop apps.
And even though I find it overpriced, the hardware feels good to use and durable.

## My setup

As a craftsman, I believe you should take care of your tools and refine them over time.
For us as software engineers, we’re lucky. Our tools aren’t just functional, they can also be aesthetic and fun to use.

That’s why I never just clone everything over with [Time Machine](https://support.apple.com/en-us/104984).
Some people see setting up a new machine as a chore. I see it as an opportunity: a clean slate, a chance to get rid of clutter and rethink how I work.

Of course, I don’t start completely from scratch each time. Over the years, I’ve built a small repository that serves as my setup checklist, so I can go from zero to fully operational in under an hour.


### System tweaks

macOS isn’t the most customizable OS, but a few small changes make a big difference.
I keep a checklist of tweaks to maximize screen space, improve input responsiveness, and make Finder more usable.

### Desktop Apps

I’ve tried going full terminal, but I still rely on some desktop apps, especially the Jetbrains IDEs.

For Git, I use the terminal for things like fixups and interactive rebases, but GitKraken is faster for many tasks and integrates nicely with GitHub and GitLab.

Other must-haves:
* Raycast instead of Spotlight, for its speed and plugin ecosystem.
* Rectangle to manage windows (I find Yabai and Aerospace powerful but a bit too hacky).
* Ghostty as my terminal emulator of choice.
* Obsidian for note-taking.

### Terminal utilities & Dotfiles

When I'm not in the IDE, I'm in a terminal window.

I use Zsh (the macOS default) with Starship for the prompt, and I replace commands like `ls`, `cd`, `find`, and `grep` with modern alternatives.

The repository documents each utility and stores all my dotfiles, so I always have my shell, aliases, and configs synced to my preferences.

> Dotfiles are hidden configuration files on Unix-like systems that define how your tools and environment behave.

### Scripts

The repo also includes Brewfiles and shell scripts to bootstrap everything quickly on a new Mac.

You can check it out here: [Ly4m/macOS-setup](https://github.com/Ly4m/macOS-setup).
Each time I set up a new machine, I refine the repo a bit more, removing what I no longer need, adding small improvements.

## Aesthetics

Beyond efficiency, I also care about aesthetics.
Since I spend most of my day in front of this machine, the look and feel of my environment matters.

For this autumn I’ve gone with Gruvbox, a retro yet cozy color scheme that makes my terminal feel warm and inviting (I blame the new Alien series for the retro vibe).

It may sound like a small detail, but the right theme makes the hours spent coding more enjoyable.

![My Gruvbox themed desktops.](images/screenshot.jpg)

## Closing thoughts

As for the smaller laptop: moving between offices feels noticeably lighter, and since I almost always work with an external monitor, the reduced screen space isn’t a problem.

A smaller laptop, a cleaner setup, and a cozier theme.
Back from holiday, I feel fresh and ready to build, and with this portable setup, I’m set for the months ahead.

If you’re curious about my setup, or thinking about building your own setup repository, feel free to reach out. I’m always happy to share what worked for me, help debug a script, or give ideas on how to structure things.

Good tools are personal, and half the fun is assembling your setup yourself, the other half is enjoying the work you get to do with it.
