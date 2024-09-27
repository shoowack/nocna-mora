import { Actor } from "@/types/actor";
import { Categories } from "@/types/categories";

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
  categories: Categories[];
  actors: Actor[];
  provider: Provider;
};
