import { NextResponse } from "next/server";
import { generateSlug } from "@/lib/slugify";
import { auth } from "auth";
import prisma from "@/lib/prisma";

export const POST = auth(async (request: Request) => {
  if (!request.auth) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const data = await request.json();

    const slug = generateSlug(`${data.firstName} ${data.lastName}`);

    const newActor = await prisma.actor.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        nickname: data.nickname,
        bio: data.bio,
        gender: data.gender,
        age: data.age,
        userId: data.userId,
        slug: slug,
      },
    });

    return NextResponse.json({ actor: newActor }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
});

// export const GET = auth(async (request: Request) => {
//   try {
//     const actors = await prisma.actor.findMany({
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json({ actors }, { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { message: "Internal server error" },
//       { status: 500 }
//     );
//   }
// });
