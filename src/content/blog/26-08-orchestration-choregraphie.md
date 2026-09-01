---
slug: "orchestration-ou-choregraphie"
title: "Orchestration ou chorégraphie"
description: "Dans une application event-driven, qui décide de la suite : un chef d'orchestre, ou les services eux-mêmes ? Les deux compromis, et comment trancher."
pubDate: "2026-09-01"
toc: true
readingTime: 4
related:
  - "cap-pacelc-system-design"
  - "developpement-assiste-par-ia"
---

En ce moment je travaille sur un projet en Event Driven Architecture (EDA) ; je caricature, mais grosso modo ça veut dire qu'on a plein de microservices qui se parlent entre eux de manière asynchrone via des topics Kafka. J'ai eu à implémenter une mécanique qui annule une action à travers tout le système. Chez nous c'est la chorégraphie qui prime entre tous ces services, et l'implémentation s'est révélée au final assez complexe ; je me suis dit qu'en orchestration ça aurait été beaucoup plus facile, et donc je me suis posé pour remettre sur papier le pour et le contre de chacune.

Une commande traverse cinq services : paiement, stock, facturation, expédition, notification. Le code de chacun est simple. Ce qui est difficile, c'est de répondre à ça : **qui décide de la suite ?**

Il y a deux réponses. Soit personne en particulier, chaque service écoute ce qui vient de se passer et en tire ses propres conclusions. Soit quelqu'un, un composant dont le seul métier est de connaître le process et de dire à chacun ce qu'il a à faire.

La première s'appelle la chorégraphie, la seconde l'orchestration.

## Deux façons de faire avancer un process

En **chorégraphie**, chaque service publie un fait accompli, `PaiementAccepté`, `StockRéservé`, et les autres s'y abonnent. Personne ne connaît le process complet ; chacun connaît sa part. Le process existe bel et bien, mais il n'est écrit nulle part : il est la somme des abonnements.

En **orchestration**, un composant gère le process. Il déclenche le paiement, attend, déclenche la réservation du stock, attend, et décide de la suite selon la réponse. Les participants ne se connaissent pas entre eux ; c'est l'orchestrateur qui les connaît.

<figure>
<svg class="svg-d1" role="img" aria-label="Schéma comparatif : à gauche, la chorégraphie — quatre services enchaînés, chacun réagissant à l'événement du précédent, sans composant central ; à droite, l'orchestration — un composant central appelle successivement les quatre mêmes services." viewBox="0 0 700 235" xmlns="http://www.w3.org/2000/svg" width="100%" style="max-width:700px;display:block;">
  <style>
    .svg-d1 { --stroke: #252525; --text: #252525; --sub: #6b6b6b; }
    .dark .svg-d1 { --stroke: #fafafa; --text: #fafafa; --sub: #9b9b9b; }
    .svg-d1 .node { fill: none; stroke: var(--stroke); stroke-width: 1.5; }
    .svg-d1 .edge { stroke: var(--stroke); stroke-width: 1.5; fill: none; marker-end: url(#arr-d1); opacity: 0.25; }
    .svg-d1 .divider { stroke: var(--sub); stroke-width: 1; stroke-dasharray: 4 4; }
    .svg-d1 .heading { font-family: var(--font-voice); font-weight: 700; font-size: 15px; fill: var(--text); }
    .svg-d1 .label { font-family: var(--font-notation); font-size: 12px; fill: var(--text); }
    .svg-d1 .sub { font-family: var(--font-notation); font-size: 12px; fill: var(--sub); }
    .svg-d1 .arr-fill { fill: var(--text); }
  </style>
  <defs>
    <marker id="arr-d1" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" class="arr-fill"/>
    </marker>
  </defs>
  <line class="divider" x1="350" y1="26" x2="350" y2="228"/>
  <text class="heading" x="175" y="20" text-anchor="middle">Chorégraphie</text>
  <text class="heading" x="525" y="20" text-anchor="middle">Orchestration</text>
  <line class="edge" x1="66" y1="91" x2="114" y2="135">
    <animate attributeName="opacity" values="0.25;1;0.25;0.25" keyTimes="0;0.08;0.25;1" dur="5s" repeatCount="indefinite"/>
  </line>
  <line class="edge" x1="144" y1="137" x2="192" y2="93">
    <animate attributeName="opacity" values="0.25;0.25;1;0.25;0.25" keyTimes="0;0.25;0.33;0.5;1" dur="5s" repeatCount="indefinite"/>
  </line>
  <line class="edge" x1="222" y1="91" x2="270" y2="135">
    <animate attributeName="opacity" values="0.25;0.25;1;0.25;0.25" keyTimes="0;0.5;0.58;0.75;1" dur="5s" repeatCount="indefinite"/>
  </line>
  <circle class="node" cx="52" cy="78" r="19"/>
  <circle class="node" cx="130" cy="150" r="19"/>
  <circle class="node" cx="208" cy="78" r="19"/>
  <circle class="node" cx="286" cy="150" r="19"/>
  <text class="label" x="52" y="83" text-anchor="middle">1</text>
  <text class="label" x="130" y="155" text-anchor="middle">2</text>
  <text class="label" x="208" y="83" text-anchor="middle">3</text>
  <text class="label" x="286" y="155" text-anchor="middle">4</text>
  <text class="sub" x="175" y="198" text-anchor="middle">chacun réagit à l'événement du précédent</text>
  <text class="sub" x="175" y="216" text-anchor="middle">personne ne connaît le tout</text>
  <rect class="node" x="458" y="42" width="134" height="34" rx="3"/>
  <text class="label" x="525" y="64" text-anchor="middle">orchestrateur</text>
  <line class="edge" x1="525" y1="76" x2="419" y2="139">
    <animate attributeName="opacity" values="0.25;1;0.25;0.25" keyTimes="0;0.06;0.2;1" dur="5s" repeatCount="indefinite"/>
  </line>
  <line class="edge" x1="525" y1="76" x2="494" y2="131">
    <animate attributeName="opacity" values="0.25;0.25;1;0.25;0.25" keyTimes="0;0.2;0.26;0.4;1" dur="5s" repeatCount="indefinite"/>
  </line>
  <line class="edge" x1="525" y1="76" x2="555" y2="131">
    <animate attributeName="opacity" values="0.25;0.25;1;0.25;0.25" keyTimes="0;0.4;0.46;0.6;1" dur="5s" repeatCount="indefinite"/>
  </line>
  <line class="edge" x1="525" y1="76" x2="630" y2="139">
    <animate attributeName="opacity" values="0.25;0.25;1;0.25;0.25" keyTimes="0;0.6;0.66;0.8;1" dur="5s" repeatCount="indefinite"/>
  </line>
  <circle class="node" cx="400" cy="150" r="19"/>
  <circle class="node" cx="483" cy="150" r="19"/>
  <circle class="node" cx="566" cy="150" r="19"/>
  <circle class="node" cx="649" cy="150" r="19"/>
  <text class="label" x="400" y="155" text-anchor="middle">1</text>
  <text class="label" x="483" y="155" text-anchor="middle">2</text>
  <text class="label" x="566" y="155" text-anchor="middle">3</text>
  <text class="label" x="649" y="155" text-anchor="middle">4</text>
  <text class="sub" x="525" y="198" text-anchor="middle">un composant appelle chacun à son tour</text>
  <text class="sub" x="525" y="216" text-anchor="middle">le process est écrit à un seul endroit</text>
</svg>
  <figcaption><span class="fig-num">Fig. 1</span> — Le même process, deux formes. À gauche une chaîne décentralisée, à droite un composant qui la gère entièrement.</figcaption>
</figure>

Ce ne sont pas de nouveaux concepts. La **saga**, une transaction longue découpée en étapes compensables, est décrite par Garcia-Molina et Salem [en 1987](https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf) déjà, pour un problème de verrous en base de données, bien avant qu'on parle de microservices. L'orchestrateur, lui, porte un nom depuis 2003 : Hohpe et Woolf l'appellent *Process Manager* dans [Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/patterns/messaging/ProcessManager.html) (une lecture importante pour toute personne travaillant sur des systèmes distribués).

Le catalogue EIP propose d'ailleurs un troisième terme qu'on oublie systématiquement : le [Routing Slip](https://www.enterpriseintegrationpatterns.com/patterns/messaging/RoutingTable.html), où la séquence des étapes voyage avec le message lui-même. Ni orchestrateur, ni abonnements : un itinéraire agrafé à la commande. Mais ça, personnellement, je ne l'ai jamais rencontré en production.

## Ce que chacune coûte vraiment

| Ce qu'on regarde | Chorégraphie | Orchestration |
| --- | --- | --- |
| **Ajouter une étape** | un abonnement de plus, sans toucher aux autres | modifier l'orchestrateur |
| **Lire le process** | nulle part, il faut le reconstituer | un seul fichier |
| **Débugger un cas précis** | corréler les traces de N services | une instance, un état |
| **Panne du coordinateur** | il n'y en a pas | tout s'arrête |
| **Compenser un échec** | chaque service doit savoir défaire et prévenir | piloté depuis le centre |
| **Ce qui grossit avec le temps** | les cascades d'événements | l'orchestrateur lui-même |

Le vrai coût de la chorégraphie n'est pas dans ce tableau, il est dans une phrase que Martin Fowler a écrite dès 2006 à propos de l'[Event Collaboration](https://martinfowler.com/eaaDev/EventCollaboration.html) : le flux de comportement devient **implicite**. Le système fait quelque chose que personne n'a écrit. Ça marche très bien jusqu'au jour où il faut expliquer pourquoi.

Le vrai coût de l'orchestration, lui, est plus simple : quelqu'un doit maintenir le chef d'orchestre, et il a tendance à absorber de la logique métier qui n'est pas la sienne.

<figure>
<svg class="svg-d2" role="img" aria-label="Schéma comparatif de la compensation après échec : à gauche, en chorégraphie, le retour arrière se propage de service en service ; à droite, en orchestration, il part du composant central vers chaque service déjà exécuté." viewBox="0 0 700 240" xmlns="http://www.w3.org/2000/svg" width="100%" style="max-width:700px;display:block;">
  <style>
    .svg-d2 { --stroke: #252525; --text: #252525; --sub: #6b6b6b; }
    .dark .svg-d2 { --stroke: #fafafa; --text: #fafafa; --sub: #9b9b9b; }
    .svg-d2 .box { fill: none; stroke: var(--stroke); stroke-width: 1.5; }
    .svg-d2 .fail { fill: none; stroke: var(--stroke); stroke-width: 1.5; stroke-dasharray: 4 4; }
    .svg-d2 .comp { stroke: var(--stroke); stroke-width: 1.5; fill: none; stroke-dasharray: 5 4; marker-end: url(#arr-d2); opacity: 0; }
    .svg-d2 .divider { stroke: var(--sub); stroke-width: 1; stroke-dasharray: 4 4; }
    .svg-d2 .heading { font-family: var(--font-voice); font-weight: 700; font-size: 15px; fill: var(--text); }
    .svg-d2 .label { font-family: var(--font-notation); font-size: 12px; fill: var(--text); }
    .svg-d2 .symbol { font-family: var(--font-notation); font-size: 15px; fill: var(--text); }
    .svg-d2 .sub { font-family: var(--font-notation); font-size: 12px; fill: var(--sub); }
    .svg-d2 .arr-fill { fill: var(--text); }
  </style>
  <defs>
    <marker id="arr-d2" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
      <polygon points="0 0, 8 3, 0 6" class="arr-fill"/>
    </marker>
  </defs>
  <line class="divider" x1="350" y1="26" x2="350" y2="232"/>
  <text class="heading" x="175" y="20" text-anchor="middle">Chorégraphie</text>
  <text class="heading" x="525" y="20" text-anchor="middle">Orchestration</text>
  <rect class="box" x="22" y="100" width="64" height="36" rx="3"/>
  <rect class="box" x="102" y="100" width="64" height="36" rx="3"/>
  <rect class="box" x="182" y="100" width="64" height="36" rx="3"/>
  <rect class="fail" x="262" y="100" width="64" height="36" rx="3"/>
  <text class="label" x="54" y="123" text-anchor="middle">1</text>
  <text class="label" x="134" y="123" text-anchor="middle">2</text>
  <text class="label" x="214" y="123" text-anchor="middle">3</text>
  <text class="symbol" x="294" y="124" text-anchor="middle">✕</text>
  <path class="comp" d="M 294 138 C 294 172, 214 172, 214 142">
    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.85;1" dur="5s" repeatCount="indefinite"/>
  </path>
  <path class="comp" d="M 214 138 C 214 172, 134 172, 134 142">
    <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.28;0.35;0.85;1" dur="5s" repeatCount="indefinite"/>
  </path>
  <path class="comp" d="M 134 138 C 134 172, 54 172, 54 142">
    <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.48;0.55;0.85;1" dur="5s" repeatCount="indefinite"/>
  </path>
  <text class="sub" x="175" y="204" text-anchor="middle">le retour arrière remonte la chaîne</text>
  <text class="sub" x="175" y="222" text-anchor="middle">chacun doit savoir défaire et qui prévenir</text>
  <rect class="box" x="458" y="34" width="134" height="32" rx="3"/>
  <text class="label" x="525" y="55" text-anchor="middle">orchestrateur</text>
  <rect class="box" x="372" y="100" width="64" height="36" rx="3"/>
  <rect class="box" x="452" y="100" width="64" height="36" rx="3"/>
  <rect class="box" x="532" y="100" width="64" height="36" rx="3"/>
  <rect class="fail" x="612" y="100" width="64" height="36" rx="3"/>
  <text class="label" x="404" y="123" text-anchor="middle">1</text>
  <text class="label" x="484" y="123" text-anchor="middle">2</text>
  <text class="label" x="564" y="123" text-anchor="middle">3</text>
  <text class="symbol" x="644" y="124" text-anchor="middle">✕</text>
  <line class="comp" x1="525" y1="68" x2="566" y2="96">
    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.85;1" dur="5s" repeatCount="indefinite"/>
  </line>
  <line class="comp" x1="521" y1="68" x2="488" y2="96">
    <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.22;0.28;0.85;1" dur="5s" repeatCount="indefinite"/>
  </line>
  <line class="comp" x1="517" y1="68" x2="410" y2="96">
    <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.32;0.38;0.85;1" dur="5s" repeatCount="indefinite"/>
  </line>
  <text class="sub" x="525" y="204" text-anchor="middle">le retour arrière part d'un seul endroit</text>
  <text class="sub" x="525" y="222" text-anchor="middle">les services n'ont qu'à savoir défaire</text>
</svg>
  <figcaption><span class="fig-num">Fig. 2</span> — L'étape 4 échoue. C'est au moment de défaire que le choix se paie, dans un sens comme dans l'autre.</figcaption>
</figure>

## Le malentendu sur le couplage

On présente presque toujours la chorégraphie comme « découplée » et l'orchestration comme « couplée ». C'est un mauvais raccourci.

En chorégraphie, le couplage est bien présent : il se déplace. Il quitte le code, où on le voyait, pour aller vivre dans les schémas d'événements et dans la carte des abonnements, c'est-à-dire dans un endroit que personne ne relit. 

Et il ne va pas dans le sens qu'on croit : un service qui publie doit savoir ce qu'on attend de son événement, sans quoi il ne peut plus jamais le faire évoluer. C'est l'argument que défend Bernd Rücker dans [« Why service collaboration needs choreography AND orchestration »](https://berndruecker.io/why-service-collaboration-needs-choreography-and-orchestrati/), et sa conclusion est vraiment intéressante :

> **Chorégraphie à l'échelle du système, orchestration à l'échelle de chaque service**. Ce n'est pas un choix global.

Dans le même esprit, *Software Architecture: The Hard Parts* refuse de traiter la coordination seule : elle est liée à deux autres forces, le mode de communication (synchrone ou asynchrone) et le niveau de cohérence exigé. 

On ne choisit pas l'une des trois sans déplacer les deux autres, exactement la logique des compromis dont je parlais dans [Comprendre PACELC](/blog/cap-pacelc-system-design).

## Comment choisir

Comme toujours, il n'y a pas de meilleure solution : c'est une histoire de compromis. La vraie question est celle-ci : **est-ce qu'il y a un process, ou juste des conséquences ?**

Quatre questions pour vous aider à trancher.

- **Est-ce que quelqu'un vous demandera un jour « où en est la commande 4712 ? »** Si oui, il vous faut un endroit capable de répondre. C'est un orchestrateur, même si vous l'appelez autrement.
- **Y a-t-il un retour arrière à piloter quand ça casse au milieu ?** Une compensation ordonnée se pilote mal en chorégraphie : chaque service doit connaître le chemin inverse, et ce chemin n'est écrit nulle part.
- **Les réactions sont-elles facultatives et indépendantes les unes des autres ?** Envoyer un mail, alimenter un cache, incrémenter un compteur : rien de tout ça n'a besoin d'un chef d'orchestre. La chorégraphie est faite pour ça.
- **La liste des réactions va-t-elle grandir sans que le process, lui, change ?** C'est le cas favorable à la chorégraphie : on ajoute un abonné, on ne touche à rien.

En pratique, la ligne de partage se dessine assez bien : **la chorégraphie pour les conséquences, l'orchestration pour les transactions.**

## En résumé

Il n'y a pas de camp. Il y a un process, ou il n'y en a pas.

Si vous pouvez le nommer, s'il a un début, une fin, et quelqu'un pour vous demander où il en est, écrivez-le quelque part. C'est ce qu'est un orchestrateur : le process rendu lisible.

Si vous ne pouvez pas le nommer, si ce ne sont que des conséquences qui se déclenchent chacune de leur côté, ne fabriquez pas un chef d'orchestre pour quelque chose qui n'a pas de partition.

Le vrai piège n'est ni l'un ni l'autre : c'est de choisir par défaut. La chorégraphie est le choix par défaut de beaucoup d'équipes, parce qu'elle ne demande aucune décision : on branche un abonnement de plus et ça part. Jusqu'au jour où plus personne ne sait ce qui se passe quand un paiement échoue.

## Sources

- Hector Garcia-Molina & Kenneth Salem, [Sagas](https://www.cs.cornell.edu/andru/cs711/2002fa/reading/sagas.pdf), ACM SIGMOD, 1987
- Gregor Hohpe & Bobby Woolf, [Process Manager](https://www.enterpriseintegrationpatterns.com/patterns/messaging/ProcessManager.html) et [Routing Slip](https://www.enterpriseintegrationpatterns.com/patterns/messaging/RoutingTable.html), *Enterprise Integration Patterns*, Addison-Wesley, 2003
- Chris Richardson, [Pattern: Saga](https://microservices.io/patterns/data/saga.html), microservices.io
- Martin Fowler, [Event Collaboration](https://martinfowler.com/eaaDev/EventCollaboration.html), 2006
- Martin Fowler, [What do you mean by « Event-Driven »?](https://martinfowler.com/articles/201701-event-driven.html), 2017
- Bernd Ruecker, [Why service collaboration needs choreography AND orchestration](https://berndruecker.io/why-service-collaboration-needs-choreography-and-orchestrati/), 2017
- Neal Ford, Mark Richards, Pramod Sadalage & Zhamak Dehghani, [Software Architecture: The Hard Parts](https://www.oreilly.com/library/view/software-architecture-the/9781492086888/), O'Reilly, 2021
- Sam Newman, [Building Microservices](https://samnewman.io/books/building_microservices_2nd_edition/), 2ᵉ édition, chapitre 6 « Workflow », O'Reilly, 2021
- Anas Nadeem & Muhammad Zubair Malik, [A Case for Microservices Orchestration Using Workflow Engines](https://arxiv.org/abs/2204.07210), arXiv:2204.07210, 2022
