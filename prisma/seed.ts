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
      bio: "Erotski pjesnik",
      gender: "male",
    },
    {
      firstName: "Sead",
      lastName: "Hasanović",
      nickname: "Braco - CroRom",
      age: 123,
      bio: "Zastupnik romske nacionalne manjine",
      gender: "male",
    },
    {
      firstName: "Darko",
      lastName: "Dijanović",
      nickname: "Darkec",
      age: 123,
      bio: "Hrvat koji želi postati Srbin",
      gender: "male",
    },
    {
      firstName: "Zoran",
      lastName: "Krivić",
      nickname: "",
      age: 123,
      bio: "Predstavlja TV Aukciju ukradenih slika u Noćnoj Mori.",
      gender: "male",
    },
    {
      firstName: "Darijan",
      lastName: "Mišak",
      nickname: "Galeb",
      age: 123,
      bio: "Najbolji izvođač pjesme 'Moj galebe' svih vremena",
      gender: "male",
    },
    {
      firstName: "Ivan",
      lastName: "Plehan",
      nickname: "Ivek",
      age: 123,
      bio: "Najbolji harmonikaš svih vremena. Bi bip!",
      gender: "male",
    },
    {
      firstName: "Vlado",
      lastName: "Matijević",
      nickname: "Jajan",
      age: 123,
      bio: "Obični novinar",
      gender: "male",
    },
    {
      firstName: "Remzo",
      lastName: "Krak",
      nickname: "Remzo",
      age: 123,
      bio: "Urednik vijesti i narodni pjesnik. Dobio otkaz u Krašu.",
      gender: "male",
    },
    {
      firstName: "Nenad",
      lastName: "Blatnik",
      nickname: "Cezar",
      age: 123,
      bio: "Pjevač i bivši boksački prvak",
      gender: "male",
    },
    {
      firstName: "Stanislav",
      lastName: "Hranović",
      nickname: "Stankec",
      age: 123,
      bio: "Narodni tribun Republike Pešćenice",
      gender: "male",
    },
    {
      firstName: "Bruno",
      lastName: "Tomašić",
      nickname: "Anđa",
      age: 123,
      bio: "Predsjednikovo sunce uneređeno",
      gender: "transgender",
    },
    {
      firstName: "Ivica",
      lastName: "Lako",
      nickname: "Laki",
      age: 123,
      bio: "Plesač i ovisnik o marihuani",
      gender: "male",
    },
    {
      firstName: "Siniša",
      lastName: "Polovina",
      nickname: "Gibo od Kutine",
      age: 123,
      bio: "Pjevač",
      gender: "male",
    },
    {
      firstName: "Darko",
      lastName: "Djugumović",
      nickname: "Darko",
      age: 123,
      bio: "Pjevač-imitator",
      gender: "male",
    },
    {
      firstName: "Krešimir",
      lastName: "Ricijaš",
      nickname: "Giovanni",
      age: 123,
      bio: "Podvojena ličnost, perač prozora koji misli da je pilot",
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
    {
      firstName: "Ljubomir",
      lastName: "Đomešić",
      nickname: "Ljubo",
      age: 99,
      bio: "Filozof i mudrac",
      gender: "male",
    },
    {
      firstName: "Ivo",
      lastName: "Ribar",
      nickname: "Ivo Ribar",
      age: 99,
      bio: "Ribar sa otoka Oliba, završio 3 fakulteta - ribarski, tesarski i soboslikarsaki.",
      gender: "male",
    },
    {
      firstName: "Ali",
      lastName: "Milai",
      nickname: "",
      age: 99,
      bio: "Trbušni plesač",
      gender: "transgender",
    },
    {
      firstName: "Baka",
      lastName: "Milica",
      nickname: "",
      age: 99,
      bio: "Prodavačica sa zagrebačkog placa",
      gender: "female",
    },
    {
      firstName: "Dubravka",
      lastName: "Carić",
      nickname: "",
      age: 99,
      bio: "bivša Jaranova ljubav",
      gender: "female",
    },
    {
      firstName: "Husnija",
      lastName: "Hrustić",
      nickname: "",
      age: 99,
      bio: "Voditeljica vremenske prognoze",
      gender: "female",
    },
    {
      firstName: "Hasan",
      lastName: "Hrustić",
      nickname: "Draki",
      age: 99,
      bio: "Husnijin sin",
      gender: "male",
    },
    {
      firstName: "Sandra",
      lastName: "Dabo",
      nickname: "Kraljica Novalje",
      age: 99,
      bio: "Pjevačica i voditeljica 'Golih vijesti'",
      gender: "female",
    },
    {
      firstName: "Predrag",
      lastName: "Raos",
      nickname: "",
      age: 99,
      bio: "Književnik",
      gender: "male",
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
    { title: "Dnevnik" },
    { title: "Tko želi biti milijunaš?", description: "Kviz" },
    { title: "Vatreno lice" },
    { title: "Dora Mora", description: "Glazbeno natjecanje" },
    { title: "Picolovka", description: "Kultna ljubavna emisija Picolovka" },
    { title: "Izlet", description: "Emisije sa raznih izleta" },
  ];

  for (const categoryData of categoriesData) {
    const slug = generateSlug(categoryData.title);

    await prisma.category.upsert({
      where: { title: categoryData.title },
      update: {
        title: categoryData.title,
        description: categoryData.description,
      },
      create: {
        title: categoryData.title,
        description: categoryData.description,
        slug,
        createdBy: {
          connect: { id: user?.id },
        },
      },
    });
  }

  console.log("🗄️ Categories seeded successfully.");

  const categories = await prisma.category.findMany();

  // Seed videos
  const videosData = [
    {
      title: "Noćna mora, Malnar",
      videoId: "444785863",
      duration: 29,
      provider: "VIMEO",
      airedDate: new Date("2001-01-12"),
      actors: actors.slice(0, 5).map((actor) => actor.id),
      categories: categories
        .filter((category) => ["picolovka"].includes(category.slug))
        .map((category) => category.id),
    },
    {
      title: "Noćna mora - Cijela emisija 12.01.2001.",
      videoId: "lTgvOOErUYg",
      duration: 22340,
      provider: "YOUTUBE",
      airedDate: new Date("2001-01-12"),
      actors: actors.slice(0, 5).map((actor) => actor.id),
      categories: categories
        .filter((category) => ["picolovka"].includes(category.slug))
        .map((category) => category.id),
    },
    {
      title: "Jaran,Bakica i Cigo",
      videoId: "PC0pzISCAQc",
      duration: 4571,
      provider: "YOUTUBE",
      actors: actors.slice(0, 5).map((actor) => actor.id),
      categories: categories
        .filter((category) => ["picolovka"].includes(category.slug))
        .map((category) => category.id),
    },
    {
      title: "Noćna Mora - 1/5 - Nenad Ivanković -19/20.11.2005",
      videoId: "xJ_-PjDDy_c",
      duration: 4121,
      provider: "YOUTUBE",
      airedDate: new Date("2005-11-20"),
      actors: actors.slice(2, 9).map((actor) => actor.id),
      categories: categories
        .filter((category) => ["picolovka"].includes(category.slug))
        .map((category) => category.id),
    },
    {
      title: "Nocna - Mora - Zatvoreno - 2",
      videoId: "x32xkww",
      duration: 4121,
      provider: "DAILYMOTION",
      airedDate: new Date("2005-11-20"),
      actors: actors.slice(2, 9).map((actor) => actor.id),
      categories: categories
        .filter((category) => ["picolovka"].includes(category.slug))
        .map((category) => category.id),
    },
    {
      title: "Noćna Mora - 02.01.10",
      videoId: "8531666",
      duration: 2158,
      provider: "VIMEO",
      airedDate: new Date("2010-10-01"),
      actors: actors
        .filter(
          (actor) =>
            actor.slug === "zeljko-malnar" || actor.slug === "sead-hasanovic"
        )
        .map((actor) => actor.id),
      categories: categories
        .filter((category) => ["picolovka"].includes(category.slug))
        .map((category) => category.id),
    },
    {
      title: "Picolovka FULL VIDEO! Remzo, Jaran, Stankec na vrućoj stolici",
      videoId: "0_qYNvTlS34",
      duration: 2338,
      provider: "YOUTUBE",
      airedDate: new Date("2010-10-01"),
      actors: actors
        .filter((actor) =>
          [
            "vlado-matijevic",
            "remzo-krak",
            "stanko-hranovic",
            "sead-hasanovic",
          ].includes(actor.slug)
        )
        .map((actor) => actor.id),
      categories: categories
        .filter((category) => ["picolovka"].includes(category.slug))
        .map((category) => category.id),
    },
    {
      title: "Picolovka",
      videoId: "weLWhh9dXpg",
      duration: 3504,
      provider: "YOUTUBE",
      airedDate: new Date("2010-10-01"),
      actors: actors
        .filter((actor) =>
          [
            "nediljko-alagusic",
            "ivica-lako",
            "sead-hasanovic",
            "husnija-hrustic",
            "zvonimir-levacic",
          ].includes(actor.slug)
        )
        .map((actor) => actor.id),
      categories: categories
        .filter((category) => ["picolovka"].includes(category.slug))
        .map((category) => category.id),
    },
  ];

  for (const videoData of videosData) {
    console.log("videoData:", videoData);
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
          set: videoData.categories.map((category) => ({ id: category })),
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
          connect: videoData.categories.map((category) => ({
            id: category,
          })),
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
