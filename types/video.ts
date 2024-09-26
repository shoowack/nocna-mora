import { Actor } from "@/types/actor";

export type Provider = {
  YOUTUBE: "YOUTUBE";
  VIMEO: "VIMEO";
  DAILYMOTION: "DAILYMOTION";
};

export type Video = {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoId: string;
  airedDate: string;
  category: string[];
  actors: Actor[];
  provider: Provider;
};
