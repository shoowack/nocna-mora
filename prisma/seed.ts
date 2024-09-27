import prisma from "@/lib/prisma";
import { generateSlug } from "../lib/slugify";

async function main() {
  // Create a default user to associate with actors
  const defaultUserEmail = "isuvak@gmail.com";

  const user = await prisma.user.findUnique({
    where: { email: defaultUserEmail },
  });

  // Seed data for actors
  const actorsData = [
    {
      firstName: "Željko",
      lastName: "Malnar",
      age: 69,
      bio: 'Željko Malnar is documentarist, TV author and writer. Educated at New Delhi University in mass communications. Made more then 100 documentary films about far east and tropical areas for which he has won awards. Co-author of the book U potrazi za staklenim gradom (In search for glass city). Author of TV series "Nightmare stage (OTV, 1992-1995) and series of interviews in Globus magazine.',
      gender: "Male",
      nickname: "Predsjednik",
    },
    {
      firstName: "Nediljko",
      lastName: "Alagušić",
      age: 71,
      bio: "Savjetnik za moral i ćudoređe Republike Pešćenice",
      gender: "Male",
      nickname: "Tarzan",
    },
    {
      firstName: "Zvonimir",
      lastName: "Levačić",
      age: 67,
      bio: "Ministar obrane Republike Pešćenice",
      gender: "Male",
      nickname: "Ševa",
    },
    {
      firstName: "Emir",
      lastName: "Ilijaš",
      nickname: "Emir",
      age: 123,
      bio: "",
      gender: "male",
    },
    {
      firstName: "Sead",
      lastName: "Hasanović",
      nickname: "Braco",
      age: 123,
      bio: "",
      gender: "male",
    },
    {
      firstName: "Darko",
      lastName: "Dijanović",
      nickname: "Darkec",
      age: 123,
      bio: "",
      gender: "male",
    },
    {
      firstName: "Zoran",
      lastName: "Krivić",
      nickname: "",
      age: 123,
      bio: "",
      gender: "male",
    },
    {
      firstName: "Darijan",
      lastName: "Mišak",
      nickname: "Galeb",
      age: 123,
      bio: "",
      gender: "male",
    },
    {
      firstName: "Ivan",
      lastName: "Plehan",
      nickname: "Ivek",
      age: 123,
      bio: "",
      gender: "male",
    },
    {
      firstName: "Vlado",
      lastName: "Matijević",
      nickname: "Jajan",
      age: 123,
      bio: "",
      gender: "male",
    },
    {
      firstName: "Remzo",
      lastName: "Krak",
      nickname: "Remzo",
      age: 123,
      bio: "",
      gender: "male",
    },
    {
      firstName: "Nenad",
      lastName: "Blatnik",
      nickname: "Cezar",
      age: 123,
      bio: "",
      gender: "male",
    },
    {
      firstName: "Stanko",
      lastName: "Hranović",
      nickname: "Stankec",
      age: 123,
      bio: "",
      gender: "male",
    },
    {
      firstName: "Bruno",
      lastName: "Tomašić",
      nickname: "Anđa",
      age: 123,
      bio: "",
      gender: "transgender",
    },
    {
      firstName: "Ivica",
      lastName: "Lako",
      nickname: "Laki",
      age: 123,
      bio: "",
      gender: "male",
    },
    {
      firstName: "Siniša",
      lastName: "Polovina",
      nickname: "Gibo od Kutine",
      age: 123,
      bio: "",
      gender: "male",
    },
    {
      firstName: "Darko",
      lastName: "Djugumović",
      nickname: "Darko",
      age: 123,
      bio: "",
      gender: "male",
    },
    {
      firstName: "Krešimir",
      lastName: "Ricijaš",
      nickname: "Giovanni",
      age: 123,
      bio: "",
      gender: "male",
    },
    {
      firstName: "Slađana",
      lastName: "Petrušić",
      nickname: "Slađa",
      age: 123,
      bio: "",
      gender: "female",
    },
    {
      firstName: "Vesna",
      lastName: "Klaić",
      nickname: "",
      age: 1,
      bio: "",
      gender: "female",
    },
  ];

  for (const actorData of actorsData) {
    const slug = generateSlug(`${actorData.firstName} ${actorData.lastName}`);

    await prisma.actor.upsert({
      where: { slug: slug },
      update: {
        firstName: actorData.firstName,
        lastName: actorData.lastName,
        age: actorData.age,
        bio: actorData.bio,
        gender: actorData.gender,
        nickname: actorData.nickname,
      },
      create: {
        ...actorData,
        slug: slug,
        userId: user?.id, // Associate with default user
      },
    });
  }

  console.log("🕺🏻 Actors seeded successfully.");

  // Fetch existing actors
  const actors = await prisma.actor.findMany();

  if (actors.length === 0) {
    console.log("No actors found.");
    return;
  }

  // Seed categories
  const categoriesData = [
    { title: "Milijunas" },
    { title: "Vatreno lice" },
    { title: "Dora Mora" },
    { title: "Picolovka" },
  ];

  for (const categoryData of categoriesData) {
    const slug = generateSlug(categoryData.title);

    await prisma.category.upsert({
      where: { title: categoryData.title },
      update: {},
      create: {
        title: categoryData.title,
        slug,
        createdBy: {
          connect: { id: user?.id },
        },
      },
    });
  }

  console.log("🗄️ Categories seeded successfully.");

  // Seed videos
  const videosData = [
    {
      title: "Noćna mora, Malnar",
      videoId: "444785863",
      duration: 29,
      provider: "VIMEO",
      airedDate: new Date("2001-01-12"),
      actors: actors.slice(0, 5).map((actor) => actor.id),
    },
    {
      title: "Noćna mora - Cijela emisija 12.01.2001.",
      videoId: "lTgvOOErUYg",
      duration: 22340,
      provider: "YOUTUBE",
      airedDate: new Date("2001-01-12"),
      actors: actors.slice(0, 5).map((actor) => actor.id),
    },
    {
      title: "Jaran,Bakica i Cigo",
      videoId: "PC0pzISCAQc",
      duration: 4571,
      provider: "YOUTUBE",
      actors: actors.slice(0, 5).map((actor) => actor.id),
    },
    {
      title: "Noćna Mora - 1/5 - Nenad Ivanković -19/20.11.2005",
      videoId: "xJ_-PjDDy_c",
      duration: 4121,
      provider: "YOUTUBE",
      airedDate: new Date("2005-11-20"),
      actors: actors.slice(2, 9).map((actor) => actor.id),
    },
    {
      title: "Nocna - Mora - Zatvoreno - 2",
      videoId: "x32xkww",
      duration: 4121,
      provider: "DAILYMOTION",
      airedDate: new Date("2005-11-20"),
      actors: actors.slice(2, 9).map((actor) => actor.id),
    },
    {
      title: "Noćna Mora - 02.01.10",
      videoId: "8531666",
      duration: 2158,
      provider: "VIMEO",
      airedDate: new Date("2010-10-01"),
      actors: actors.slice(2, 9).map((actor) => actor.id),
    },
  ];

  const categories = await prisma.category.findMany();
  console.log("categories:", categories);

  for (const videoData of videosData) {
    await prisma.video.upsert({
      where: { videoId: videoData.videoId }, // Unique identifier
      update: {
        videoId: videoData.videoId,
        duration: videoData.duration,
        provider: videoData.provider,
        airedDate: videoData.airedDate,
        actors: {
          set: videoData.actors.map((actorId) => ({ id: actorId })),
        },
        categories: {
          set: categories.map((category) => ({ id: category.id })),
        },
      },
      create: {
        title: videoData.title,
        videoId: videoData.videoId,
        duration: videoData.duration,
        provider: videoData.provider,
        airedDate: videoData.airedDate,
        createdBy: {
          connect: { id: user?.id },
        },
        actors: {
          connect: videoData.actors.map((actorId) => ({ id: actorId })),
        },
        categories: {
          connect: categories.map((category) => ({ id: category.id })),
        },
      },
    });
  }

  console.log("🎥 Videos seeded successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error("Error seeding data:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
