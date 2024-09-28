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

export type VideoFormInputs = Omit<Video, "id" | "categories" | "actors"> & {
  actorIds: number[];
  categoryIds: number[];
};

export interface VideoFormProps {
  video?: Omit<Video, "categories" | "actors"> & {
    actorIds: number[];
    categoryIds: number[];
  };
}
