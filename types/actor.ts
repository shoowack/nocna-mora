import { ActorType } from "@prisma/client";

export type Actor = {
  id: string;
  firstName: string;
  lastName: string;
  nickname: string;
  age: number;
  bio: string;
  slug: string;
  gender: string;
  type: ActorType;
};
