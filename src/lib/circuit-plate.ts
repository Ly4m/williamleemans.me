/**
 * LA GÉOMÉTRIE D'UNE PLAQUE, pour les deux surfaces qui en portent une.
 *
 * Extrait de `SideNav.astro` le 2026-08-24, quand le sommaire des articles a
 * eu besoin du même dessin. La fonction n'a pas changé d'un pixel : elle est
 * seulement passée d'un composant à un module, pour que le rail, le menu
 * mobile et le sommaire tirent leur tracé de la MÊME source. Trois copies du
 * même `M ... C ... L ...` auraient dérivé au premier ajustement, et la
 * dérive aurait été invisible — un fil qui rate son plot de deux pixels sur
 * une seule des trois plaques ne casse aucun test.
 *
 * Ce que ce module NE fait pas : l'encre, les états, les transitions. Chaque
 * plaque garde les siens, parce qu'ils ne sont pas les mêmes — le rail porte
 * un état (la page courante, en laiton) et une pièce en voyage, le sommaire
 * n'a ni l'un ni l'autre. Mutualiser ça aurait donné un bloc commun composé
 * surtout d'exceptions.
 */
export type TraceCfg = {
  busX: number;
  branchX: number;
  labelX: number;
  itemH: number;
  gap: number;
  headroom: number;
  tailroom: number;
  padR: number;
  padActiveR: number;
  spur: number;
  spurHover: number;
};

/* Une plaque retournée (le menu mobile) dessine à droite mais son repère SVG
   reste à origine gauche — c'est la seule chose qu'on ne peut pas retourner —
   donc les abscisses sont prises depuis le bord opposé. `busX`/`branchX` de la
   config restent, dans les deux cas, des distances au bord LE PLUS PROCHE :
   c'est ce qui permet aux mêmes variables CSS de servir toutes les plaques
   sans condition. */
export function trace(
  cfg: TraceCfg,
  n: number,
  withBus: boolean,
  mirror = false,
) {
  const busX = mirror ? cfg.labelX - cfg.busX : cfg.busX;
  const branchX = mirror ? cfg.labelX - cfg.branchX : cfg.branchX;
  const pitch = cfg.itemH + cfg.gap;
  const listH = n * cfg.itemH + Math.max(0, n - 1) * cfg.gap;
  const plateH = cfg.headroom + listH + cfg.tailroom;
  const nodeY = (i: number) => cfg.headroom + cfg.itemH / 2 + i * pitch;
  const first = nodeY(0);
  const last = nodeY(n - 1);
  /* La branche quitte le bus 42px au-dessus du premier plot et se redresse
     20px avant lui ; elle le rejoint en biais 40px sous le dernier. Les deux
     jonctions sont marquées d'un point, comme sur les plaques. */
  const junctionOut = first - 42;
  const straightFrom = first - 20;
  const straightTo = last + 18;
  const junctionIn = last + 40;
  const busTop = 6;
  const busBottom = plateH - 6;

  return {
    plateH,
    busX,
    branchX,
    nodes: Array.from({ length: n }, (_, i) => nodeY(i)),
    /* Le rail n'a pas de bus dans sa plaque : le sien traverse toute la
       hauteur de l'écran et vit dans l'<aside>, hors de cette boîte. Le menu
       mobile, lui, est un panneau qui va et vient — son bus s'arrête avec lui,
       et porte donc ses deux repères de fin. */
    busD: withBus ? `M ${busX} ${busTop} L ${busX} ${busBottom}` : null,
    tickTopD: withBus
      ? `M ${busX - 4} ${busTop} L ${busX + 4} ${busTop}`
      : null,
    tickBottomD: withBus
      ? `M ${busX - 4} ${busBottom} L ${busX + 4} ${busBottom}`
      : null,
    branchD: [
      `M ${busX} ${junctionOut}`,
      `C ${busX} ${junctionOut + 11}, ${branchX} ${straightFrom - 11}, ${branchX} ${straightFrom}`,
      `L ${branchX} ${straightTo}`,
      `L ${busX} ${junctionIn}`,
    ].join(" "),
    junctions: [junctionOut, junctionIn],
  };
}

/* Les constantes partent en variables CSS : une seule source pour le tracé
   (au-dessus) et pour les plots/amorces (les feuilles de style des plaques). */
export const plateVars = (cfg: TraceCfg, mirror = false) =>
  [
    `--branch-x:${cfg.branchX}px`,
    /* L'abscisse de la branche DANS LE SVG (origine toujours à gauche), et le
       sens dans lequel l'amorce pousse. Le script en a besoin pour poser la
       pièce en voyage : `--branch-x` lui, est une distance au bord proche, et
       ne suffirait pas sur une plaque retournée. */
    `--wire-x:${mirror ? cfg.labelX - cfg.branchX : cfg.branchX}px`,
    `--spur-dir:${mirror ? -1 : 1}`,
    `--label-x:${cfg.labelX}px`,
    `--item-h:${cfg.itemH}px`,
    `--gap:${cfg.gap}px`,
    `--headroom:${cfg.headroom}px`,
    `--pad-r:${cfg.padR}px`,
    `--pad-active-r:${cfg.padActiveR}px`,
    `--spur:${cfg.spur}px`,
    `--spur-hover:${cfg.spurHover}px`,
  ].join(";");
