---
slug: "signer-ses-commits"
title: "Signer ses commits"
description: "Author et Committer sont deux champs de texte libre, et le badge de GitHub ne dit pas ce qu'on croit. Comment je suis passé de GPG à une clé SSH qui ne quitte jamais ma machine."
pubDate: "2026-09-20"
readingTime: 5
toc: true
related:
  - "garder-un-historique-git-propre"
  - "nouvelle-machine"
---

Ouvrez un terminal dans n'importe quel repository où vous avez le droit de pousser, et tapez ça :

```bash
git commit --author="Prénom Nom <adresse@de-votre-collegue.fr>" \
  -m "chore: bump dependency"
```

Poussez. 

Le commit apparaît sur GitHub au nom de votre collègue, avec son avatar si l'adresse correspond à son compte. Aucune vérification, aucun avertissement ne s'affiche, et l'interface ne distingue ce commit d'aucun autre. Ce n'est pas une faille mais le fonctionnement prévu de Git.

Reste que quelque chose, en aval, lit cet historique : la CI déploie ce qui arrive sur `main`, la revue fait confiance à un nom connu, et l'enquête d'après-incident n'a que ces lignes-là pour dire qui a fait quoi. Personne ne relit un `chore: bump dependency` poussé par quelqu'un de l'équipe.

## Author et Committer sont deux champs de texte libre

Un commit est un petit fichier texte. Il contient une référence à l'arbre des fichiers, une ou plusieurs références aux commits parents, un message, et deux lignes d'identité : 

* `author` : celui qui a écrit le changement 
* `committer` : celui qui l'a poussé dans l'historique

Ces deux lignes ne sont pas des identifiants. Ce sont des chaînes de caractères, remplies par le client Git au moment du commit, à partir de valeurs que vous avez vous-même écrites dans votre `.gitconfig`.

<figure>
<svg class="svg-sig" role="img" aria-label="Anatomie d'un objet commit : les champs tree, parent, author, committer, gpgsig et le message. Une accolade désigne les lignes author et committer comme du texte libre que rien ne vérifie." viewBox="0 0 700 250" xmlns="http://www.w3.org/2000/svg" width="100%" style="max-width:700px;display:block;">
  <style>
    .svg-sig { --stroke: #252525; --text: #252525; --sub: #6b6b6b; }
    .dark .svg-sig { --stroke: #fafafa; --text: #fafafa; --sub: #9b9b9b; }
    .svg-sig .node { fill: none; stroke: var(--stroke); stroke-width: 1.5; }
    .svg-sig .brace { fill: none; stroke: var(--stroke); stroke-width: 1.5; }
    .svg-sig .key { font-family: var(--font-notation); font-size: 12px; fill: var(--sub); }
    .svg-sig .val { font-family: var(--font-notation); font-size: 12px; fill: var(--text); }
    .svg-sig .note { font-family: var(--font-notation); font-size: 12px; fill: var(--sub); }
    .svg-sig .rule { stroke: var(--sub); stroke-width: 1; opacity: 0.35; }
  </style>
  <rect class="node" x="28" y="18" width="404" height="214" rx="2"/>
  <text class="key" x="44" y="46">tree</text>
  <text class="val" x="140" y="46">a1b2c3d</text>
  <text class="key" x="44" y="70">parent</text>
  <text class="val" x="140" y="70">9f8e7d6</text>
  <text class="key" x="44" y="102">author</text>
  <text class="val" x="140" y="102">Prénom Nom &lt;…&gt;</text>
  <text class="key" x="44" y="126">committer</text>
  <text class="val" x="140" y="126">Prénom Nom &lt;…&gt;</text>
  <line class="rule" x1="44" y1="146" x2="416" y2="146"/>
  <text class="key" x="44" y="172">gpgsig</text>
  <text class="val" x="140" y="172">BEGIN SSH SIGNATURE</text>
  <text class="val" x="140" y="190">AAAAB3NzaC1lZDI1…</text>
  <text class="val" x="44" y="218">feat: ajoute une dépendance</text>
  <path class="brace" d="M 444 88 L 452 88 L 452 132 L 444 132"/>
  <path class="brace" d="M 452 110 L 460 110"/>
  <text class="note" x="470" y="106">texte libre,</text>
  <text class="note" x="470" y="124">rien ne le vérifie</text>
</svg>
<figcaption><span class="fig-num">Fig. 1</span> — Deux lignes déclarent qui a fait le travail, la troisième le prouve.</figcaption>
</figure>

C'est ce qui rend `git commit --author` possible, et c'est aussi ce qui rend `git rebase` possible : quand vous rejouez les commits de quelqu'un d'autre au-dessus de `main`, comme je le décris dans [garder un historique Git propre](/blog/garder-un-historique-git-propre), Git conserve son `author` et vous inscrit comme `committer`. La séparation des deux champs existe pour ça. Elle n'a jamais eu pour rôle d'authentifier qui que ce soit.

La signature est la troisième ligne. Elle est calculée sur tout le reste de l'objet (l'arbre, les parents, les deux lignes d'identité, le message) avec une clé privée que vous seul possédez. Changez une virgule au message, la signature tombe.

## Ce que « Verified » signifie

Le badge vert de GitHub ne nous dit pas « c'est bien lui ». Il dit :

> ce commit porte une signature valide, produite par une clé déclarée par ce compte. 

La différence est importante : ce n'est pas le champ `author` qu'on doit croire mais la liste de clés d'un compte, et cette liste, c'est GitHub qui la détient, pas vous.

Un commit non signé n'affiche rien du tout. Pas de badge rouge, pas d'avertissement : rien. 
Tant qu'on n'a pas activé « require signed commits » sur la branche protégée, le badge est une décoration.

Mais surtout, la vérification est déléguée. 
Si vous voulez savoir, hors de GitHub, qui a signé quoi, il faut configurer votre poste vous-même. 

## Plusieurs méthodes : GPG et SSH

Le 3 septembre, pour un nouveau projet client, j'ai généré une clé RSA 4096 dans GPG et j'ai mis `commit.gpgsign = true` dans ma config globale. 
Une semaine plus tard, en écrivant cet article, j'ai jeté un œil à l'historique de ce projet :

```bash
git log --format='%G?' | sort | uniq -c
      85 E
     162 G
     201 N
```

`G`, une signature valide, que ma machine sait vérifier. `N`, aucune signature. `E`, une signature que ma machine n'arrive pas à vérifier, faute de posséder la clé publique correspondante. Sur 448 commits, 162 seulement prouvent quelque chose ; 286 ne prouvent rien. 201 ne sont pas signés du tout, et 85 sont signés par le moi d'avant, sur une machine que je n'ai plus, avec une clé dont j'ai perdu la trace en changeant de machine. C'est très exactement le scénario que j'avais en tête en écrivant [nouvelle machine](/blog/nouvelle-machine) sans jamais résoudre le problème.

GPG a résolu le problème de l'e-mail chiffré entre inconnus, et il le résout avec un réseau de confiance, des serveurs de clés, des sous-clés, des dates d'expiration et un agent qui se met en travers. 

Pour signer des commits, tout ça c'est inutile. Ma clé expire en 2028, ce qui veut dire qu'un jour de 2028 mes commits cesseront de passer sans que je comprenne immédiatement pourquoi.

Il se trouve que je prouve déjà mon identité à GitHub des centaines de fois par jour, avec une clé SSH. Depuis le 23 août 2022, GitHub accepte qu'on signe ses commits avec une clé SSH ([GitHub Changelog](https://github.blog/changelog/2022-08-23-ssh-commit-verification-now-supported/), 2022).

Et pour switcher c'est très simple. On génère une clé qui ne servira qu'à ça (le pourquoi arrive juste après) et on la déclare :

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_signing -C "signature git"
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519_signing.pub
git config --global commit.gpgsign true
git config --global tag.gpgsign true
```

Puis on colle le contenu du `.pub` dans les réglages GitHub, en choisissant cette fois **Signing Key** et non Authentication Key. 

> Rien ne vous empêche d'utiliser la même clé pour vous authentifier et pour signer vos commits, mais je vous conseille d'en utiliser deux différentes.

Trois raisons :
* La clé d'authentification parle à des machines distantes, et avec un `ForwardAgent` qui traîne elle est présentée à des serveurs que vous ne contrôlez pas ; la clé de signature n'a aucune raison de quitter le poste. 
* Elles ne tournent pas au même rythme non plus : l'une se régénère un mardi matin sans conséquence, l'autre laisse une trace définitive dans l'historique et une ligne de plus à garder dans `allowed_signers`. 
* Et surtout, c'est ce qui rend la prochaine section utilisable : une clé enfermée dans du matériel réclame une confirmation physique à chaque usage. Touch ID à chaque commit, très bien ; à chaque `git fetch`, impossible.

## Que la clé ne quitte jamais la machine

Un détail important : `~/.ssh/id_ed25519_signing` est un fichier. Il est lisible par tout ce qui tourne sous mon utilisateur. 
La passphrase protège le fichier au repos, mais l'agent garde la clé déchiffrée en mémoire toute la journée, ce qui est précisément le confort qu'on lui demande.

Quand une clé ne sert qu'à pousser, le risque est borné : on révoque, on régénère, et le pire est passé. 
Une clé de signature a une autre propriété, c'est qu'elle laisse une trace durable dans l'historique.

D'où la vraie réponse : une clé que le logiciel ne peut pas lire. Sur un Mac, [Secretive](https://github.com/maxgoedjen/secretive) génère la clé dans la Secure Enclave et expose un agent SSH ; la partie privée n'existe nulle part sous forme de fichier, et chaque signature demande Touch ID. 

Une [YubiKey](https://developers.yubico.com/SSH/) fait la même chose en plus portable, l'[agent SSH de 1Password](https://www.1password.dev/ssh/git-commit-signing/) en plus intégré au reste. Le principe est identique dans les trois cas : la clé ne sort jamais du matériel, elle répond à des demandes de signature.

> Personnellement, c'est 1Password que j'utilise pour la qualité de l'intégration dans mon workflow.

## Vérifier sans demander à GitHub

Il reste une partie que j'avais laissée en plan pendant des mois sans le savoir. Ma config globale contenait déjà cette ligne :

```ini
gpg.ssh.allowedsignersfile=
```

Déclarée, vide. Elle ne pointait sur rien, et sans elle Git est incapable de vérifier quoi que ce soit en local : il sait produire une signature, il ne sait pas à qui la comparer. 

Le fichier `allowed_signers` est cette liste :

```bash
git config --global gpg.ssh.allowedSignersFile ~/.ssh/allowed_signers
echo "william@lmns.fr namespaces=\"git\" $(cat ~/.ssh/id_ed25519_signing.pub)" \
  >> ~/.ssh/allowed_signers
```

À partir de là, `git log --show-signature` répond vraiment, et `%G?` devient exploitable : 
- `G` pour une signature valide d'un signataire connu
- `U` pour valide mais non listé
- `B` pour cassée
- `N` pour rien. 

Sur un repository d'équipe, ce fichier se versionne et se pointe avec un `allowedSignersFile` relatif au repository. 
C'est un peu de maintenance, mais c'est exactement le travail que le badge vert nous dispense de faire.

## Ce qu'une signature prouve, et ce qu'elle ne prouve pas

Une signature répond à une seule question : 

> cet objet sort-il bien de la machine dont il porte le nom ?

Quand une bonne partie de mes commits est rédigée par des agents et posée par un `git commit` que je n'ai pas tapé moi-même, le champ `author` devient une convention d'équipe plutôt qu'un fait. 

La signature, elle, ne bouge pas : elle atteste que la machine était la mienne et que j'étais devant. 
C'est peu : dans un historique non signé je ne peux pas prouver que je n'ai *pas* écrit un commit qui porte mon nom. 
La seule défense contre celui-là, c'est que tous les autres soient signés et que lui ne le soit pas. 
D'où le `commit.gpgsign` global plus haut, qui ne vaut que si tout le reste est signé, et d'où le « require signed commits » sur la branche protégée, qui fait enfin du badge une règle.

Elle ne dit rien, en revanche, de la qualité de ce que le commit contient. Ça n'empêche personne de pousser du code faux, et ça n'a jamais arrêté une dépendance compromise.

Mon historique n'est pas encore propre pour autant. 286 commits ne porteront jamais de signature, et je ne vais pas réécrire neuf mois d'historique pour un badge. Ce qui commence à partir d'aujourd'hui sera signé, avec une clé qui ne quitte pas ma machine, et vérifiable sans passer par GitHub. Le reste, c'est de l'archéologie.

Plus philosophique que technique : quand je pose mon doigt sur le lecteur pour autoriser la signature, ça me rappelle que c'est moi qui signe, et moi qui en prends la responsabilité, même si ces commits ont été rédigés par mes agents.

## Sources

- GitHub, [*SSH commit verification now supported*](https://github.blog/changelog/2022-08-23-ssh-commit-verification-now-supported/), GitHub Changelog, 23 août 2022
- Git, [*git-config — gpg.format, gpg.ssh.allowedSignersFile*](https://git-scm.com/docs/git-config#Documentation/git-config.txt-gpgformat), documentation officielle, consultée le 20 septembre 2026
- Max Goedjen, [*Secretive*](https://github.com/maxgoedjen/secretive), dépôt GitHub, consulté le 20 septembre 2026
- Yubico, [*Securing SSH with the YubiKey*](https://developers.yubico.com/SSH/), documentation développeur, consultée le 20 septembre 2026
- AgileBits, [*Sign Git commits with SSH*](https://www.1password.dev/ssh/git-commit-signing/), documentation 1Password, consultée le 20 septembre 2026
