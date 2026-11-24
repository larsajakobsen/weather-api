export type RainViewerFrame = {
  time: number;
  path: string;
};

export type RainViewerMaps = {
  host: string;
  radar: {
    past: RainViewerFrame[];
  };
};

export type RadarFrame = {
  time: number;
  /** Contains the placeholders {z}, {x} and {y}. */
  tileUrlTemplate: string;
};
