---
slug: "developpement-augmente-charge-mentale"
title: "Meilleur, pas plus facile"
description: "Le développement augmenté ne rend pas le métier plus facile ni plus rapide. Il le rend meilleur, et beaucoup plus dense. Ce que ça m'a coûté, et les règles que je me donne depuis."
pubDate: "2026-08-21"
readingTime: 8
related: ["developpement-assiste-par-ia"]
---

J'ai toujours été autant passionné par les outils et la DX que par le développement lui-même. Parfois plus. [Monter une nouvelle machine](/blog/nouvelle-machine) est un plaisir et pas une corvée, et je peux perdre une soirée entière sur un alias, un hook de pré-commit ou un thème de terminal en considérant la soirée bien remplie.

Alors le développement augmenté, pour moi, c'est Noël tous les jours.

Il y a un setup entier à construire autour du travail : le harness, les agents spécialisés, les commandes, les garde-fous, la boucle de vérification, tout le SDLC. C'est un terrain de jeu sans fond, et j'y passe des heures.

[Il y a une dizaine de jours, j'écrivais ici que j'étais hypé](/blog/developpement-assiste-par-ia). Je le suis toujours.

Mais il y avait une partie que je n'avais pas écrite, parce que je n'avais pas fini de la comprendre. La voilà : ce n'est pas plus facile, et ce n'est pas plus rapide. Ca me rend meilleur mais c'est nettement plus dur mentalement.

Et ça a failli me cramer.

## Trois teams, et un goulot d'étranglement

Le dérappage se fait tout seul, et il se fait vite.

On lance une team d'agents sur une tâche. Elle part pour vingt minutes. Vingt minutes, c'est long. Plutôt que d'attendre, on ouvre un deuxième projet et on lance une deuxième team. Elle pose ses questions de cadrage, on répond, elle part. La première n'a toujours pas fini. Hop une troisième team.

Sur le papier, c'est du parallélisme gratuit : trois fois plus de travail en cours pour le même temps calendaire.

Sauf que tout revient. Et tout revient en même temps.

Or ce qui revient n'est jamais du travail délégable. C'est un arbitrage, une spécification ambiguë, une décision d'architecture, un « est-ce qu'on garde ce comportement ou pas ». On a parallélisé exactement ce qui se parallélise, et on a concentré tout le reste sur la seule ressource qui n'a pas changé d'échelle : soi.

On devient le goulot d'étranglement de sa propre chaîne.

Ce n'est pas une découverte de 2026. En 1983, la psychologue cognitive Lisanne Bainbridge publiait dans *Automatica* cinq pages intitulées [*Ironies of Automation*](https://ckrybus.com/static/papers/Bainbridge_1983_Automatica.pdf). Elle parlait de salles de contrôle industrielles. Sa deuxième ironie tient en une phrase (je traduis) :

> le concepteur qui essaie d'éliminer l'opérateur lui laisse quand même les tâches qu'il n'a pas su automatiser

Quarante-trois ans avant que je lance ma troisième team de la matinée. Le texte est court, il n'a pas pris une ride, et je le recommande à toute personne qui adore automatiser ou construit un harness aujourd'hui.

Il y a un second coût, plus sournois, que je ne voyais pas du tout. Trois teams en cours, ce sont trois tâches inachevées dans ma tête. Sophie Leroy a mis un nom là-dessus en 2009 : le [résidu attentionnel](https://doi.org/10.1016/j.obhdp.2009.04.002). Quand on passe d'une tâche à une autre, une partie de l'attention reste accrochée à la précédente, et elle y reste d'autant plus que celle-ci n'est pas terminée.

Le modèle « je lance et je passe à autre chose » produit des tâches inachevées en permanence. Je ne subissait pas le parallélisme en temps. Je le subissait en qualité d'attention, sur les trois à la fois.

## Le temps mort qui a disparu

Avant, une tâche ressemblait à ça : on réfléchit vingt minutes, puis on passe une heure à écrire le code.

Cette heure n'est pas du temps mort au sens strict. Écrire du code demande de la réflexion, et la conception se corrige souvent pendant qu'on la tape. Mais elle contient des creux. Des moments de frappe presque mécanique, de refacto, de mise en forme, où le cerveau tourne au ralenti et où l'esprit se balade.

C'est dans ces creux que les idées arrivent. Pas les idées sur la tâche en cours : les autres. La cause du bug d'hier. Le fait que l'abstraction qu'on est en train d'écrire va coûter cher dans six mois. Le nom qu'on cherchait depuis deux jours.

Ces creux ont un nom en psychologie cognitive : [l'incubation](https://gwern.net/doc/psychology/writing/2009-sio.pdf). Et elle a une condition : que la pause reste peu exigeante. Plus on la remplit par une tâche à forte charge cognitive, moins l'effet est net.

Cadrer une deuxième team d'agents est une tâche à très forte charge cognitive.

Autrement dit, je ne me contentais pas de perdre mes temps morts. Je les remplissais méthodiquement par la pire chose possible, et j'appelais ça de la productivité.

<svg class="svg-cm1" viewBox="0 0 600 198" xmlns="http://www.w3.org/2000/svg" width="100%" style="max-width:600px;display:block;margin:2.5rem auto;" role="img" aria-label="Deux régimes de travail comparés sur une même durée. Avant : une seule piste, la mienne, alternant des blocs d'attention pleine et des creux de temps mort. Maintenant : trois teams d'agents qui tournent en parallèle et se chevauchent, et en dessous ma propre piste, pleine du début à la fin, sans aucun creux.">
  <style>
    .svg-cm1 { --stroke: #252525; --text: #252525; --sub: #6b6b6b; }
    .dark .svg-cm1 { --stroke: #fafafa; --text: #fafafa; --sub: #9b9b9b; }
    .svg-cm1 .full  { fill: var(--stroke); }
    .svg-cm1 .idle  { fill: none; stroke: var(--sub); stroke-width: 1; stroke-dasharray: 3 3; }
    .svg-cm1 .agent { fill: none; stroke: var(--sub); stroke-width: 1; }
    .svg-cm1 .row   { font-family: var(--font-voice); font-size: 12px; font-weight: 600; fill: var(--text); }
    .svg-cm1 .cap   { font-family: var(--font-notation); font-size: 11px; fill: var(--sub); }
    .svg-cm1 .lbl   { font-family: var(--font-notation); font-size: 10px; fill: var(--sub); }
  </style>
  <text class="cap" x="18" y="36">avant</text>
  <text class="row" x="138" y="36" text-anchor="end">moi</text>
  <rect class="full" x="150" y="24" width="56"  height="16" rx="2"/>
  <rect class="idle" x="206.5" y="24.5" width="85" height="15" rx="2"/>
  <rect class="full" x="292" y="24" width="44"  height="16" rx="2"/>
  <rect class="idle" x="336.5" y="24.5" width="91" height="15" rx="2"/>
  <rect class="full" x="428" y="24" width="42"  height="16" rx="2"/>
  <rect class="idle" x="470.5" y="24.5" width="89" height="15" rx="2"/>
  <text class="cap" x="18" y="110">maintenant</text>
  <text class="lbl" x="138" y="81"  text-anchor="end">team 1</text>
  <text class="lbl" x="138" y="97"  text-anchor="end">team 2</text>
  <text class="lbl" x="138" y="113" text-anchor="end">team 3</text>
  <rect class="agent" x="150.5" y="72.5" width="267" height="10" rx="2"/>
  <rect class="agent" x="232.5" y="88.5" width="291" height="10" rx="2"/>
  <rect class="agent" x="330.5" y="104.5" width="229" height="10" rx="2"/>
  <text class="row" x="138" y="141" text-anchor="end">moi</text>
  <rect class="full" x="150" y="129" width="410" height="16" rx="2"/>
  <rect class="full"  x="145" y="178" width="18" height="10" rx="2"/>
  <text class="lbl"   x="170" y="187">attention requise</text>
  <rect class="idle"  x="305.5" y="178.5" width="17" height="9" rx="2"/>
  <text class="lbl"   x="330" y="187">temps mort</text>
  <rect class="agent" x="418.5" y="178.5" width="17" height="9" rx="2"/>
  <text class="lbl"   x="443" y="187">agents au travail</text>
</svg>

Comme le diagramme de l'article précédent, celui-ci n'a pas d'échelle : je n'ai chronométré personne. Ce qui compte, c'est la ligne du bas.

## Quatre heures, des dizaines d'agents

Quand on est aussi emballé que moi, il n'y a jamais de raison de s'arrêter.

Il y a toujours quelque chose de plus à lancer et c'est devenu cheap d'en lancer une nouvelle. Et trois pressions s'ajoutent : 

La première, c'est que les agents attendent. Le rapport s'est inversé : pendant vingt ans, c'est moi qui attendais la compilation, la CI, le déploiement. Maintenant c'est l'outil qui attend ma réponse, et un curseur qui clignote sur une question de cadrage est une forme de pression, même si personne ne l'a voulue.

La seconde, c'est le compteur. Voir qu'il reste des tokens dans l'abonnement est devenu, honnêtement, une raison de continuer. Un compteur qui se vide est une très mauvaise raison de travailler, et pourtant elle fonctionne remarquablement bien sur moi.

La troisième, c'est la peur d'être en retard. L'écosystème bouge toutes les semaines : un nouveau modèle, une nouvelle manière d'orchestrer des agents, un thread qui explique que la méthode adoptée le mois dernier est déjà périmée. Et comme j'adore ça, je n'oppose aucune résistance : j'ouvre, j'essaie, je réoutille. Le harness n'est jamais fini, parce que le sol bouge sous lui.

Celle-là, je la prends personnellement : [j'ai donné un talk en 2024](/talks) pour dire de choisir ses technos avec la raison plutôt qu'avec la hype. Je m'étais blindé à l'étage des frameworks, et je me suis fait avoir à celui de l'outillage, où le même mécanisme opère sans jamais laisser de trace dans le code.

Résultat : des sessions de quatre heures d'affilée, des dizaines d'agents, et la sensation très concrète d'être rincé à la fin. En vingt ans de programmation, je n'avais jamais subi un rythme pareil (et pourtant j'en ai fait des crunch pour des clients).

Ce qui m'a le plus surpris, c'est la nature de cette fatigue. Ce n'est pas celle d'avoir beaucoup écrit. C'est celle d'avoir décidé sans arrêt. Une décision toutes les trente secondes pendant quatre heures, sans échauffement et sans redescente.

Bainbridge, encore, rappelle les études de vigilance de Mackworth (Oui j'aime flex en citant des sources) : il est impossible, même très motivé, de maintenir une attention visuelle efficace au-delà d'une demi-heure environ sur une source où il ne se passe presque rien. Relire du code généré est le problème inverse : il s'y passe énormément de choses, en continu, et tout a l'air correct. Dans un cas comme dans l'autre, quatre heures n'est pas une durée humaine.

## L'autre bord de la route

Pendant que je me cramais par excès d'engagement, j'ai croisé l'inverse.

Je les appelle les vibecoders zombies, et la distinction tient en un mot : ils laissent l'IA travailler *à leur place* plutôt que *pour eux*.

Il y a celui qui donne une tâche avec le minimum d'informations, part se chercher un café, revient, constate que ça ne marche pas ou que ce n'est pas ce qu'il voulait, relance la même tâche à peine reformulée, et recommence. J'ai mal à ma consommation de tokens rien que d'y penser.

Il y a celui qui, quand l'agent entre en phase de clarification, répond « ok » à chaque question. C'est pourtant le moment le plus rentable de toute la session : celui qui décide si on obtient un résultat exploitable ou trois heures perdues. Il le traite comme une bannière de cookies.

Et il y a le plus inquiétant : celui qui ne regarde plus le code du tout. Pas par choix assumé, comme ceux qui font entièrement confiance au filet de sécurité de leurs tests. Par renoncement. Et qui devient, chaque jour, un peu moins capable de juger ce que l'IA produit.

Bainbridge, toujours en 1983, à propos des opérateurs chargés de surveiller un processus automatisé (je traduis) :

> un opérateur autrefois expérimenté, qui a passé son temps à surveiller un processus automatisé, peut désormais être un opérateur inexpérimenté

Elle décrivait une salle de contrôle. Elle décrit un développeur en août 2026.

Ces deux dérives ont l'air opposées. L'une sature, l'autre abdique. Elles partent pourtant de la même erreur : croire que l'outil est là pour rendre le travail plus facile.

Le zombie encaisse la facilité tout de suite, et la paie en compétence. Moi j'ai refusé la facilité, et je l'ai payée en attention. Ni l'un ni l'autre n'a obtenu « plus facile ».

## Le mois d'arrêt

Ça a failli me cramer plus d'une fois, et je n'ai pas le mérite de m'être arrêté tout seul : mon fils est né, et ça m'a imposé un mois loin de la machine.

Ce mois-là a fait ce qu'aucune bonne résolution n'avait réussi à faire. Revenir de zéro oblige à choisir par quoi on recommence, et à ce moment précis on voit très bien ce qui relevait de l'envie et ce qui relevait de l'emballement.

Je ne vais pas prétendre en être sorti sage. La tentation de relancer une team après le biberon de trois heures du matin est parfaitement réelle, et j'y ai cédé. Mais je suis reparti sur des bases nettement plus saines.

## Les règles que je me donne

**Deux projets en parallèle au maximum**, dès que je lance des tâches longues. Pas trois. Le troisième ne coûte rien à lancer, et c'est très exactement ce qui le rend dangereux.

**Des pauses forcées, façon pomodoro.** De vraies pauses : pas « je lance une team pendant la pause », qui est ma pente naturelle et qui annule toute la pause.

**Le temps d'attente fait partie du travail.** C'est la règle la plus contre-intuitive, et probablement la plus rentable. Quand une team tourne, ne rien lancer est une option légitime, et souvent la bonne. C'est là que je vois les problèmes que je n'aurais pas vus.

**Le quota n'est pas un objectif.** Il reste des tokens ? Tant mieux. Ce n'est pas une commande.

**Un seul chantier d'outillage à la fois, et jamais pendant un projet.** La veille continue de tourner, mais elle atterrit dans une liste au lieu de partir en session. Ce qui sort cette semaine sera encore là dans quinze jours, et aura souvent perdu la moitié de ses promesses entre-temps.

**Je relis le code.** Pas par méfiance envers l'outil, mais pour rester capable de le juger. C'est la seule défense contre l'ironie de Bainbridge, et elle ne se maintient que par l'usage.

C'est frustrant. Régulièrement, je vois très bien ce que je pourrais être en train de lancer, et je ne le lance pas. Et pourtant, sur le résultat, je suis nettement plus efficace qu'à l'époque des sessions de quatre heures. Ce qui devrait me vexer, et ce qui a surtout fini de me convaincre.

## Au final

Le développement augmenté n'a pas rendu mon travail plus facile.

Il l'a rendu meilleur : je passe mes journées sur la partie que je préfère, celle où l'on décide ce qu'on construit et ce qu'on refuse de construire. C'est ce que j'écrivais dans l'article précédent, et je le maintiens.

Et il l'a rendu plus dense, parce qu'il a retiré le remplissage. Le problème, c'est que le remplissage servait à quelque chose.

La bonne question n'est plus « combien de tâches je peux lancer en parallèle ». C'est « combien je peux vraiment en juger ». Le second chiffre est beaucoup plus petit que le premier, et surtout il n'augmente pas quand on change d'abonnement.

Si vous vous reconnaissez dans l'une ou l'autre de ces deux dérives, ou si vous avez trouvé un rythme qui tient, écrivez-moi à [william@lmns.fr](mailto:william@lmns.fr). Sur ce sujet-là, les retours d'expérience valent tous les benchmarks.

## Sources

- Lisanne Bainbridge, [*Ironies of Automation*](https://ckrybus.com/static/papers/Bainbridge_1983_Automatica.pdf), *Automatica*, vol. 19, n° 6, 1983, p. 775-779
- Sophie Leroy, [*Why is it so hard to do my work? The challenge of attention residue when switching between work tasks*](https://doi.org/10.1016/j.obhdp.2009.04.002), *Organizational Behavior and Human Decision Processes*, vol. 109, n° 2, 2009, p. 168-181
- Ut Na Sio et Thomas C. Ormerod, [*Does incubation enhance problem solving? A meta-analytic review*](https://gwern.net/doc/psychology/writing/2009-sio.pdf), *Psychological Bulletin*, vol. 135, n° 1, 2009, p. 94-120
