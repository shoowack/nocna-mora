import { Actor } from "@/types/actor";
import { Categories } from "@/types/categories";

// export enum Provider {
//   YOUTUBE,
//   VIMEO,
//   DAILYMOTION,
// }

export enum Provider {
  YOUTUBE = "YOUTUBE",
  VIMEO = "VIMEO",
  DAILYMOTION = "DAILYMOTION",
}

export type Video = {
  id: string;
  title: string;
  videoId: string;
  airedDate: Date | null;
  duration: number;
  published: boolean;
  categories?: Categories[];
  actors?: Actor[];
  provider: Provider;
};
