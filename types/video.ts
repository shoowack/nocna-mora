import { Actor } from "@/types/actor";
import { Categories } from "@/types/categories";

export enum Provider {
  YOUTUBE,
  VIMEO,
  DAILYMOTION,
}

export type Video = {
  id: string;
  title: string;
  videoId: string;
  airedDate: Date | null;
  categories?: Categories[];
  actors?: Actor[];
  provider: Provider;
};
