import { Actor } from "@/types/actor";
import { Categories } from "@/types/categories";
import { VideoProvider } from "@prisma/client";

export type Video = {
  id: string;
  title: string;
  videoId: string;
  airedDate: Date | null;
  duration: number;
  published: boolean;
  provider: VideoProvider;
  actors?: Actor[];
  categories?: Categories[];
};

export type VideoFormInputs = Omit<Video, "id" | "categories" | "actors"> & {
  actors?: string[];
  categories?: string[];
};
