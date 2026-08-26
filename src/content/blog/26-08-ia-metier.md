---
slug: "developpement-assiste-par-ia"
title: "Cette fois, je suis dans la hype"
description: "Développement assisté par IA : pourquoi celui qui a fait un talk contre la hype est hypé cette fois, et comment je vois le métier changer."
pubDate: "2026-08-12"
readingTime: 8
toc: true
related:
  - "cap-pacelc-system-design"
  - "garder-un-historique-git-propre"
---

En février 2024, j'ai donné un talk qui s'appelait *Hype Driven Development*. En juin de la même année, j'en ai remis une couche au Devfest Lille avec *[Maîtriser la Hype : Passion versus Raison](/talks)*. Un message simple : choisis tes technos avec la raison, pas avec la hype.

Depuis deux ans je suis plongé dans le développement augmenté par IA, tous les jours, et je kiffe ça.

Est-ce que je n'ai pas respecté mon propre talk et je suis tombé sous le joug de la hype ou bien y a-t-il vraiment un shift sérieux qui se passe dans notre métier ? J'ai pris le temps de me poser la question honnêtement. Voilà où j'en suis.

## Ce qui ne me hype pas : aller plus vite

Autant commencer par là, parce que c'est l'argument qu'on entend partout et c'est pas le meilleur.

C'est aussi celui où les chiffres sont les moins flatteurs. En 2025, METR a mesuré des développeurs open source expérimentés sur leur propre code, avec et sans IA, en tirant au sort. Résultat : [19 % plus lents avec les outils](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/). Et le meilleur dans tout ça : les mêmes développeurs estimaient après coup avoir été 20 % plus rapides.

C'est l'étude qu'on me sort systématiquement quand je dis que je suis hypé. Sauf que si on la lit vraiment, elle est plus intéressante que ça.

METR est revenu dessus en février 2026 pour annoncer qu'ils changeaient de protocole. Leur constat est clair : une part croissante des développeurs ne veut plus travailler sans IA, même payée 50 $/heure, et 30 à 50 % d'entre eux disent avoir renoncé à soumettre certaines tâches parce qu'ils ne voulaient pas les faire sans assistance. Autrement dit, l'expérience se vidait toute seule des cas où ça marche. Ils écrivent noir sur blanc que [le vrai gain pourrait être bien plus élevé sur les tâches qui sortent de l'échantillon](https://metr.org/blog/2026-02-24-uplift-update/).

> Une étude honnête qui dit « notre méthode ne mesure plus ce qu'on croyait » vaut mieux qu'un chiffre rond qu'on affiche sur LinkedIn.

Mais tout ce débat se focus sur la mauvaise chose.

Taper du code n'a jamais été mon goulot d'étranglement. Si mon métier se résumait à produire des lignes, ça ferait quinze ans que je m'ennuie.

## Le vrai changement : le travail est remonté d'un cran

Ce qui me hype, c'est que la partie intéressante du métier a pris de la place.

Avant, une journée typique, c'était : réfléchir vingt minutes, puis passer une heure à transcrire cette réflexion en code. La réflexion était le petit bout. La transcription était le gros (en termes de temps).

Aujourd'hui, la transcription est accélérée. Ce qui reste, c'est formuler l'intention : qu'est-ce qu'on construit, dans quel ordre, avec quels compromis, et qu'est-ce qu'on refuse de faire. C'est exactement le travail que je préfère, et c'est celui qui remplit mes journées maintenant.

<figure>
<svg class="svg-ia1" viewBox="0 0 600 195" xmlns="http://www.w3.org/2000/svg" width="100%" style="max-width:600px;display:block;" role="img" aria-label="Deux axes comparant où se concentre mon temps de travail. Avant : surtout sur l'écriture du code. Maintenant : surtout sur l'intention, la conception et la relecture.">
  <style>
    .svg-ia1 { --stroke: #252525; --text: #252525; --sub: #6b6b6b; }
    .dark .svg-ia1 { --stroke: #fafafa; --text: #fafafa; --sub: #9b9b9b; }
    .svg-ia1 .axis  { stroke: var(--stroke); stroke-width: 1.5; }
    .svg-ia1 .guide { stroke: var(--sub); stroke-width: 1; stroke-dasharray: 4 4; }
    .svg-ia1 .dot   { fill: var(--stroke); }
    .svg-ia1 .row   { font-family: var(--font-voice); font-size: 12px; font-weight: 600; fill: var(--text); }
    .svg-ia1 .step  { font-family: var(--font-notation); font-size: 11px; fill: var(--sub); }
  </style>
  <line class="guide" x1="135" y1="30" x2="135" y2="145"/>
  <line class="guide" x1="265" y1="30" x2="265" y2="145"/>
  <line class="guide" x1="395" y1="30" x2="395" y2="145"/>
  <line class="guide" x1="525" y1="30" x2="525" y2="145"/>
  <line class="axis" x1="100" y1="55" x2="560" y2="55"/>
  <line class="axis" x1="100" y1="120" x2="560" y2="120"/>
  <text class="row" x="88" y="59" text-anchor="end">avant</text>
  <text class="row" x="88" y="124" text-anchor="end">maintenant</text>
  <circle class="dot" cx="135" cy="55" r="4"/>
  <circle class="dot" cx="265" cy="55" r="7"/>
  <circle class="dot" cx="395" cy="55" r="14"/>
  <circle class="dot" cx="525" cy="55" r="7"/>
  <circle class="dot" cx="135" cy="120" r="10"/>
  <circle class="dot" cx="265" cy="120" r="13"/>
  <circle class="dot" cx="395" cy="120" r="4"/>
  <circle class="dot" cx="525" cy="120" r="13"/>
  <text class="step" x="135" y="168" text-anchor="middle">intention</text>
  <text class="step" x="265" y="168" text-anchor="middle">conception</text>
  <text class="step" x="395" y="168" text-anchor="middle">écriture</text>
  <text class="step" x="525" y="168" text-anchor="middle">relecture</text>
</svg>
  <figcaption><span class="fig-num">Fig. 1</span> — Ce n'est pas le travail qui a disparu, c'est sa répartition qui s'est déplacée.</figcaption>
</figure>

Ce diagramme n'a pas d'échelle, et c'est volontaire : je n'ai pas chronométré mes journées. Mais le principe est là.

Ce déplacement a un effet secondaire que je n'avais pas vu venir : il rend les bonnes questions d'architecture beaucoup plus rentables. Quand écrire trois variantes coûtait trois jours, on choisissait sur intuition et on assumait. Quand ça coûte un après-midi, on peut réellement aller voir. Les [compromis dont je parlais dans mon article sur PACELC](/blog/cap-pacelc-system-design) ne sont plus des débats autour de la théorie : on peut les prototyper, les tester.

## Il n'y a pas que l'écriture du code qui est augmentée

C'est sur l'écriture du code que le changement est le plus visible, mais ce n'est pas le plus important. Mon pari, c'est que l'IA me rende meilleur, pas seulement plus rapide.

### Le cadrage

J'ai toujours préféré bien poser ma réflexion avant d'attaquer le code. Aujourd'hui, j'utilise des agents pour me challenger sur ma conception, vérifier rapidement mes hypothèses dans le code et prototyper (ça, j'adore). Et ça tombe bien : pour qu'une équipe d'agents soit efficace, il faut lui fournir un contexte aux petits oignons.

Par exemple, j'ai toujours essayé de faire attention à l'accessibilité, sans jamais être excellent sur le sujet. La navigation au clavier, typiquement : je savais qu'il fallait la vérifier, et je la vérifiais quand j'y pensais. Aujourd'hui, mon agent de cadrage ne me lâche pas tant qu'elle n'est pas traitée.

Ce n'est pas l'agent qui est bon en accessibilité. C'est que j'ai été obligé d'écrire noir sur blanc ce que je n'avais jamais formalisé, et que quelque chose me le relit maintenant à chaque fois. Je n'ai pas délégué la compétence : je l'ai enfin mise par écrit.

### Les tests

Quand on fait du développement augmenté, il est indispensable d'avoir des mécaniques de vérification automatisées : c'est ce qui permet aux agents de converger vers une solution. Et c'est cette contrainte qui fait que mon code n'a jamais été aussi bien testé. Le TDD n'a jamais été aussi omniprésent dans ma pratique.

Ce qui a changé, ce n'est pas ma discipline, c'est l'intérêt. Pendant quinze ans, écrire les tests d'abord était un effort que je payais pour moi-dans-six-mois, et c'est toujours la première chose qu'on lâche sous pression. Là, c'est ce qui fait tourner ma boucle cet après-midi.

Concrètement, je relis les tests avant que l'implémentation commence. C'est là que je valide le contrat, et c'est le seul moment où ça veut vraiment dire quelque chose : un test relu après coup, sur du code qui passe déjà, ne prouve pas grand-chose. Il a été écrit en connaissant la réponse.

### La qualité

Là, on arrive sur ma nouvelle bataille. J'ai toujours eu tendance à faire de la sur-qualité, et je l'ai longtemps pris pour un défaut. C'est en train de devenir ma compétence la plus utile.

Parce que je vois de plus en plus d'AI slop sur le terrain, et qu'une codebase qui commence à dégénérer se détériore beaucoup plus vite quand ce sont des agents qui écrivent le code. Un agent ne ralentit pas devant un truc mal foutu : il s'aligne dessus.

Rédiger des ADR, expliciter les contraintes et les normes du projet, choisir la bonne architecture, poser un ubiquitous language : tout ça était déjà fortement recommandé, ça devient obligatoire. Sur un projet, un ADR qui décrivait exactement notre manière d'implémenter une architecture hexagonale a suffi à ce que les agents gardent la structure propre. Le document ne servait plus seulement à expliquer la décision à l'humain qui arrive : il la fait tenir.

## La code review devient une compétence critique

C'est le changement le plus concret dans mon quotidien, et celui dont on parle le moins.

Une revue de code classique cherche des erreurs : un cas non géré, une variable mal nommée, une requête dans une boucle. On lit du code écrit par quelqu'un dont on connaît les habitudes, et on sait où regarder.

Relire du code généré, ce n'est pas ça. Le code est souvent propre, cohérent, bien nommé, et il passe les tests. Tests qu'il a parfois écrits lui-même, d'ailleurs. L'erreur n'est presque jamais dans la syntaxe.

Elle est dans l'intention qui vient du corpus et que personne n'a demandée.

Un retry ajouté « par sécurité » sur un appel qui n'est pas idempotent. Un cache dont personne n'a décidé la durée de vie. Un `catch` qui avale une erreur que quelqu'un, quelque part, avait besoin de voir. Rien de tout ça n'est un bug au sens strict. Ce sont des décisions prises par défaut, par un truc qui n'avait aucun moyen de savoir qu'il en prenait une.

Repérer ça demande une compétence différente de celle que j'ai passé quinze ans à construire. Il faut lire du code en se demandant non pas « est-ce que c'est faux ? » mais « qui a décidé ça, et est-ce que quelqu'un l'a décidé ? ».

Je trouve ça passionnant. Et je ne connais personne qui ait une méthode propre pour le faire. C'est très exactement le genre d'inconnu qui me fait aimer ce métier.

Certains ne relisent même plus le code et font entièrement confiance au filet de sécurité qu'ils construisent avec leurs tests (par exemple le célèbre Uncle Bob, qui a [fait pas mal de remous sur les réseaux](https://x.com/unclebobmartin/status/2080257779395154409) avec ça cet été).

Pour ma part, j'ai pris le parti que l'IA ne bosserait pas à ma place mais pour moi. Je continue donc de progresser en programmation, et ça passe par relire le code produit, qui parfois m'apprend des choses et me permet de m'améliorer.

## Le métier dans cinq ans, d'après moi

Quelques paris. Je les écris pour pouvoir me relire et avoir tort en public.

**Le coût d'une idée va s'effondrer, et ça va être la meilleure partie.** J'ai un fichier de notes plein de projets que je n'ai jamais lancés parce que la marche d'entrée était trop haute pour mes soirées. Cette marche est en train de descendre. On va voir arriver une vague de logiciels bizarres, spécifiques, faits par une seule personne pour trois cents utilisateurs. Le genre de chose qui n'a jamais eu de modèle économique mais qui rend la vie meilleure. C'est ce qui me hype le plus, très loin devant les gains de productivité en entreprise.

**La valeur va se déplacer vers le jugement.** Savoir quoi ne pas construire, sentir qu'une abstraction va coûter cher dans six mois, dire non à une fonctionnalité. Ça ne s'automatise pas, parce que ça ne se formule pas sous forme de tâche.

**Écrire du code va redevenir un choix.** Pas une corvée disparue, un choix. Il y a des morceaux que je continuerai à écrire à la main parce qu'ils sont le cœur du truc, ou parce que j'ai envie. Comme [l'animation de particules](/blog/animation-de-particules) de ce site à l'époque : personne n'avait besoin que je la fasse moi-même, et c'était tout l'intérêt.

**Et l'entrée dans le métier va se durcir.** C'est le point qui me préoccupe vraiment. Les tâches sur lesquelles j'ai appris, le CRUD un peu bête, le bug de niveau deux, la petite feature isolée, sont précisément celles qu'on délègue le plus facilement. Si on supprime le terrain d'entraînement, on récolte ce qu'on mérite dans dix ans. Je n'ai pas de solution propre. Je pense juste que c'est la vraie question du métier en ce moment, et qu'elle est nettement moins discutée que le classement des modèles.

**Enfin, le monde des ESN va bouger.** Fini les grandes équipes de 40 devs à aligner sur un projet : je suis persuadé que le futur, ce sont des équipes de 2 à 3 personnes augmentées par l'IA, et que le modèle va s'orienter encore plus vers de la production au forfait ou à l'unité d'œuvre que vers de la prestation en régie comme on la connaît. Je dis ça depuis la place du cofondateur, et c'est ce qui rend le pari inconfortable : la régie facture du temps, et c'est précisément le temps qui se compresse. Un modèle qui vend des jours-homme n'a aucun intérêt à ce que ses équipes aillent trois fois plus vite. Un modèle qui vend un résultat, si.

## Ce que je surveille quand même

Je suis enthousiaste, pas naïf. Deux choses me font douter.

La première, c'est le code que plus personne dans l'équipe ne comprend. Pas du code illisible : du code que personne n'a eu besoin de comprendre pour le livrer. Ça se paye toujours, et ça se paye au pire moment.

La seconde, c'est ma propre perception. L'écart entre les 19 % mesurés et les 20 % ressentis dans l'étude METR ne parle pas des outils : il parle de nous. Je ne suis pas un bon juge de ma propre productivité, et je ne vois pas pourquoi je ferais exception.

J'y vais à fond quand même. Mon instinct me dit que le dev augmenté est le bon pari, même si je sais que mon instinct n'est pas une mesure.

## Au final

Mon talk de 2024 ne disait pas « méfie-toi de tout ». Il disait : sache pourquoi tu y vas.

La hype n'a jamais été le problème. Le problème, c'est la hype sans raisons : adopter un truc parce qu'il est partout, puis reconstruire dix-huit mois plus tard. Là, j'ai des raisons, elles sont dans cet article, et elles sont falsifiables : si dans deux ans je passe toujours mes journées à corriger du code que je n'ai pas écrit sans que la partie conception ait grossi, c'est que je me suis trompé.

Je préfère largement écrire ça maintenant que le découvrir tranquillement dans mon coin.

Si vous vivez la même chose ou l'inverse, ce qui m'intéresse encore plus, écrivez-moi à [william@lmns.fr](mailto:william@lmns.fr) ou passez me dire bonjour sur [LinkedIn](https://www.linkedin.com/in/wleemans). C'est typiquement le genre de sujet où je préfère les contre-arguments aux approbations.

## Sources

- METR, [Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/), juillet 2025 ([papier](https://arxiv.org/abs/2507.09089))
- METR, [We are Changing our Developer Productivity Experiment Design](https://metr.org/blog/2026-02-24-uplift-update/), février 2026
