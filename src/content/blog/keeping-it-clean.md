---
slug: "garder-un-historique-git-propre"
title: "Garder un historique Git propre"
description: "Comment garder un historique Git propre, écrire de bons commits et utiliser rebase efficacement."
pubDate: "2025-10-15"
readingTime: 4
howTo:
  name: "Comment garder un historique Git propre"
  steps:
    - name: "Écrire de bons messages de commit"
      text: "Choisir une convention et s'y tenir — les Conventional Commits dans 99 % des cas — et inclure l'ID du ticket (Jira, Linear, GitHub Issues) dans la description."
    - name: "Corriger le dernier commit avec amend"
      text: "Stager les changements avec git add puis lancer git commit --amend : Git remplace le commit précédent par une version corrigée."
    - name: "Rebaser sa branche sur main"
      text: "Lancer git rebase main pour déplacer ses commits au-dessus des derniers changements de main, sans commit de merge, et garder un historique linéaire."
    - name: "Fusionner des commits avec le rebase interactif"
      text: "Lancer git rebase -i main, puis dans la todo list remplacer pick par squash pour fusionner un commit avec le précédent, ou reword pour renommer un message."
    - name: "Corriger un ancien commit avec fixup"
      text: "Créer un commit ciblé avec git commit --fixup <hash>, puis lancer git rebase -i --autosquash main : Git fusionne automatiquement la correction dans le bon commit."
---

La première chose que je fais quand j’arrive sur un nouveau projet, c’est de regarder l’historique Git.  
Un simple coup d’œil en dit déjà long sur l’équipe.

Je me concentre toujours sur deux éléments :

1. comment les messages de commit sont écrits
2. comment l’historique est structuré

## Comment écrire un bon message de commit ?

Un bon message de commit décrit le changement et son intention, pas juste "fix". Le plus important, c’est de choisir une convention et de s’y tenir : dans 99 % des cas, je recommande les Conventional Commits. Et si vous utilisez Jira ou Linear, ajoutez l’ID du ticket : votre futur vous vous remerciera.

Imaginez que vous utilisez `git blame` pour comprendre pourquoi une ligne de code a été écrite. Ou que vous essayez de générer des release notes, ou d’identifier quand un bug a été ajouté dans le code.

Quel message vous semble le plus utile ?

```
fix(ui): prevent modal from getting stuck open
```

ou

```
ui bug fix
```

La clé, c’est de choisir une convention et de s’y tenir.  
Dans 99 % des cas, je recommande d’utiliser les [Conventional Commits](https://www.conventionalcommits.org/fr/v1.0.0/).  

C’est largement utilisé, bien documenté, et de nombreux outils le supportent.

Pour mes projets perso, j’aime aussi utiliser [gitmoji](https://gitmoji.dev/), qui rend le type de changement facilement identifiable.

Si vous utilisez un outil de ticketing comme Jira, Linear ou GitHub Issues, une bonne pratique que j’encourage fortement est d’inclure l’ID du ticket dans la description du commit. Votre futur vous vous remerciera.

Une fois que vos commits sont clairs, l’étape suivante est de les organiser dans un historique propre et linéaire.

## Comment garder un historique Git propre ?

Un historique propre, c’est un historique linéaire, sans branches emmêlées ni commits de merge inutiles. Comme un jardin : si vous laissez pousser sans entretenir, tout devient vite illisible. Git fournit heureusement les outils pour tailler tout ça — amend, rebase et fixup — et ce sont ceux que j’utilise au quotidien.

J’aime l'analogie du jardin.  
Si vous laissez les branches pousser sans vous en occuper, tout devient vite un amas emmêlé et difficile à comprendre.

Heureusement, Git nous donne plein d’outils pour entretenir tout ça.  

Voici ceux que j’utilise au quotidien :

### Comment corriger son dernier commit avec amend ?

Pour corriger votre dernier commit, stagez vos changements avec `git add` puis lancez `git commit --amend` : Git écrase le commit précédent et le remplace par une version corrigée, comme si l’erreur n’avait jamais existé. C’est aussi le moyen le plus rapide de reformuler un message, avec `git commit --amend -m`.

Besoin de corriger votre dernier commit, d’en modifier le message ou d’y ajouter des changements ?  
C’est exactement ce que permet l'option `--amend`.

Vous venez de faire un commit, vous poussez votre branche… et vous remarquez une faute dans la doc ou une ligne oubliée.

Au lieu de créer un nouveau commit juste pour ça, vous pouvez intégrer la correction au précédent :

```bash
git add README.md # ou les autres fichiers modifiés
git commit --amend
```

Git écrase le commit précédent et le remplace par une version corrigée.
C’est comme si l’erreur n’avait jamais existé dans l’historique.

Je l’utilise souvent pour agréger mes changements dans un seul commit WIP.

Et pour modifier uniquement le message :

```bash
git commit --amend -m "docs: fix typos in README"
```

### C'est quoi git rebase ?

Rebase déplace vos commits au-dessus d’un point donné, comme un couper-coller sur une nouvelle base. Ça peut faire peur au début, mais c’est l’un des outils les plus puissants de Git, et mon préféré. Par exemple, vous pouvez mettre à jour votre branche avec les derniers changements de main sans créer de commit de merge.

Voici l’historique avant le rebase :

![Avant le rebase : la branche new-feature part du commit B avec les commits C et D, tandis que main a avancé jusqu’au commit E](images/3/rebase-1.svg)

```bash
git rebase main
```

Git déplace vos commits au-dessus de main, gardant l’historique propre et linéaire :

![Après le rebase : les commits C et D de new-feature sont déplacés au-dessus du commit E, dernier commit de main, pour un historique linéaire](images/3/rebase-2.svg)

Mais ce n’est que le début. On peut aller beaucoup plus loin avec rebase.

### Comment fusionner des commits avec git rebase interactif ?

Le rebase interactif (`git rebase -i main`) ouvre une todo list de vos commits dans l’éditeur. Pour fusionner deux commits, placez-les l’un sous l’autre et remplacez `pick` par `squash` sur le second ; `reword` permet de renommer un message. À la sauvegarde, Git réécrit l’historique.

Imaginons que je viens de terminer une feature de scaffolding UI, et qu’elle est prête à être mergée dans main.
Sauf qu’elle est divisée en deux commits, et qu’un commit lié à la documentation a besoin d’être renommé.

![Avant le rebase interactif : la branche ui-scaffolding contient trois commits — feat: ui part 1 (C), add doc (D) et feat: ui part 2 (E) — tandis que main a avancé jusqu’au commit F](images/3/interactive-1.svg)

Je veux faire trois choses :

1. fusionner les deux commits de la feature (C & E)
2. renommer le commit “add doc” (D)
3. rebaser la branche sur main

**Étape 1 : démarrer le rebase interactif**

J’utilise la commande rebase avec l’option -i (ou --interactive) pour démarrer le rebase en mode interactif.

```bash
git rebase -i main
```

**Étape 2 : afficher la todo list**

Git ouvre alors une todo list dans votre éditeur :

```bash
pick C # feat: ui part 1
pick D # add doc
pick E # feat: ui part 2
```

Le premier mot (pick, squash, etc.) indique à Git quoi faire, et l’ordre des lignes définit l’ordre final des commits.

**Étape 3 : modifier la liste**

Pour cet exemple, voici ce que je ferais :

```bash
pick C # feat: ui part 1
squash E # feat: ui part 2
reword D # add doc
```

1. Je garde le premier commit avec "pick"
2. Je place “ui part 2” juste en dessous
3. Je le “squash” pour le fusionner avec le premier
4. J'utilise “reword” sur le commit de documentation


Une fois le fichier sauvegardé, Git applique les modifications sur l’historique.

![Après le rebase interactif : ui-scaffolding, rebasée sur le commit F de main, ne contient plus que deux commits — feat: scaffolds UI et docs: adds UI screenshots](images/3/interactive-2.svg)

Et voilà, un historique propre et une branche à jour avec main!

> À tout moment, si vous réalisez que vous vous êtes trompé, vous pouvez annuler le rebase :
>
> ```bash
> git rebase --abort
> ```

**Étape 4 : pousser le nouvel historique**

Comme rebase réécrit l’historique, vous devrez sans doute forcer le push :

```bash
git push --force
```

> Attention : git push --force peut écraser le travail des autres.
> Utilisez plutôt --force-with-lease pour éviter les mauvaises surprises.

### Comment corriger un ancien commit avec git fixup ?

Pour corriger un commit plus ancien que le dernier, créez un commit ciblé avec `git commit --fixup <hash>`, puis lancez `git rebase -i --autosquash main`. Git déplace automatiquement le commit fixup à côté de sa cible et les fusionne. Résultat : la correction est intégrée directement dans le bon commit, sans todo à éditer.

Disons que vous avez plusieurs commits sur votre branche et que vous devez en corriger un en particulier.

![La branche new-feature contient deux commits — feat: scaffolds UI (C) et docs: adds UI screenshots (D) — et c’est le commit C qu’il faut corriger](images/3/fixup-1.svg)

Pour corriger le commit D, vous pourriez utiliser --amend.

Mais pour le commit C, c’est plus compliqué : il faudrait créer un nouveau commit, lancer un rebase interactif, éditer la todo… bref, un peu lourd.

Heureusement, il existe mieux : --fixup, qui crée un commit ciblant directement celui à corriger.

```bash
git commit --fixup C
git rebase -i --autosquash main
```

Avec --autosquash, Git déplace automatiquement les commits “fixup” à côté de leurs commits cibles, puis les fusionne.

```bash
pick C # feat: scaffolds UI
pick E # fixup
pick D # docs: adds UI screenshots"
```

Résultat : un historique propre, et la correction bien intégrée dans le commit C :

![Après le fixup et l’autosquash : la correction est fusionnée dans le commit C, devenu feat: scaffolds UI with the fix, et l'historique reste propre avec deux commits](images/3/fixup-2.svg)

---

On peut toujours aller plus loin avec Git, mais avec ces quelques commandes, vous avez déjà 90 % de ce dont vous avez besoin au quotidien.
