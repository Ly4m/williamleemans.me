/**
 * The talks I've given.
 *
 * Not a content collection on purpose: a talk has no body. Its canonical
 * artifact is the video, which lives on YouTube; what's left here is pure
 * structured data, and a `.md` file with nothing under the frontmatter would be
 * ceremony for its own sake.
 *
 * The unit is the TALK, not the performance. A talk given at three conferences
 * is one entry with three occurrences — the same shape antfu.me/talks uses, and
 * the reason the page never repeats a title.
 *
 * This is an archive and nothing else. There is deliberately no "topics I can
 * speak about" list and no availability flag: the site is not a sales surface
 * (see CLAUDE.md). If a talk can be given again, the closing line of the page
 * says so in prose — the data doesn't model it.
 */

export type Occurrence = {
  /** Conference or meetup name, as it should read on the page. */
  event: string;
  eventUrl?: string;
  /** ISO date, YYYY-MM-DD. The year span in the header decoration is derived from these. */
  date: string;
  /** YouTube URL. Absent when the talk wasn't recorded. */
  video?: string;
};

export type Talk = {
  title: string;
  /** One or two sentences. Without it the page is a list of titles, half of them opaque out of context. */
  pitch: string;
  occurrences: Occurrence[];
};

/*
 * ⚠️ PLACEHOLDER DATA — every string below is invented and needs replacing.
 * Kept structurally realistic so the page renders every state it can reach:
 *   - a talk given more than once (multiple occurrences)
 *   - a talk given but not recorded (no video)
 */
export const talks: Talk[] = [
  {
    title: "Rust en 20 minutes chrono",
    pitch:
      "Lors de cette présentation, je ne ferai pas de vous des développeurs Rust, mais je vais tenter de vous expliquer par quelles mécaniques ce langage parvient à tenir ses promesses et quels sont les éléments qui le rendent aussi agréable à utiliser.",
    occurrences: [
      {
        event: "JetTalk",
        date: "2023-08-10",
        video: "https://www.youtube.com/watch?v=TwVFfcncgcM",
      },
    ],
  },
  {
    title: "C4 Model",
    pitch: "Découvrez le C4 Model, une approche visuelle simplifiant la communication autour des architectures logicielles. ",
    occurrences: [
      {
        event: "JetTalk",
        date: "2023-09-15",
        video: "https://www.youtube.com/watch?v=gJzTCsMUcpA",
      },
    ],
  },
  {
    title: "Hype Driven Development : The Good, the bad and the Ugly",
    pitch: "De nouvelles technologies émergent à un rythme effréné dans le monde du développement logiciel. Dans ce talk, William aborde les bons et mauvais côtés de la Hype. À travers son expérience, il nous offre des outils et conseils pour mieux tirer parti des tendances, sans en subir les revers.",
    occurrences: [
      {
        event: "JetTalk",
        date: "2024-02-28",
        video: "https://www.youtube.com/watch?v=8b92SJVqUHk",
      },
    ],
  },
  {
    title: "Maîtriser la Hype : Passion versus Raison.",
    pitch: "Ce talk est une invitation à prendre du recul, à réfléchir de manière critique et à faire des choix technologiques qui servent réellement vos objectifs à long terme.",
    occurrences: [
      {
        event: "Devfest Lille",
        eventUrl: "https://devlille.fr/",
        date: "2024-06-14",
        video: "https://www.youtube.com/watch?v=TPhRprV2L24",
      },
    ],
  },
];

/** Most recent occurrence of a talk — what the list sorts on. */
const lastGiven = (talk: Talk): string =>
  talk.occurrences
    .map((o) => o.date)
    .sort()
    .at(-1)!;

/** One list, reverse-chronological on each talk's most recent outing. */
export const sortedTalks: Talk[] = [...talks].sort((a, b) =>
  lastGiven(b).localeCompare(lastGiven(a)),
);

/** The decoration's left label. */
export const talkCount = talks.length;

/** Span of years across every occurrence — the decoration's right label. */
export const yearSpan = (() => {
  const years = talks
    .flatMap((t) => t.occurrences)
    .map((o) => Number(o.date.slice(0, 4)));
  if (!years.length) return "";
  const oldest = Math.min(...years);
  const newest = Math.max(...years);
  return oldest === newest ? String(newest) : `${oldest}–${newest}`;
})();

/**
 * Noon rather than midnight: `new Date("2025-06-12")` parses as UTC midnight and
 * slips to the previous day in any negative-offset build environment.
 */
export const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
  }).format(new Date(`${iso}T12:00:00`));
