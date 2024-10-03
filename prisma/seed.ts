import prisma from "@/lib/prisma";
import { generateSlug } from "../lib/slugify";
import { ActorType, VideoProvider } from "@prisma/client";

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
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: 'Željko Malnar is documentarist, TV author and writer. Educated at New Delhi University in mass communications. Made more then 100 documentary films about far east and tropical areas for which he has won awards. Co-author of the book U potrazi za staklenim gradom (In search for glass city). Author of TV series "Nightmare stage (OTV, 1992-1995) and series of interviews in Globus magazine.',
      gender: "Male",
      nickname: "Predsjednik",
      type: ActorType.MAIN,
    },
    {
      firstName: "Nediljko",
      lastName: "Alagušić",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Savjetnik za moral i ćudoređe Republike Pešćenice",
      gender: "Male",
      nickname: "Tarzan",
      type: ActorType.MAIN,
    },
    {
      firstName: "Zvonimir",
      lastName: "Levačić",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Ministar obrane Republike Pešćenice",
      gender: "Male",
      nickname: "Ševa",
      type: ActorType.MAIN,
    },
    {
      firstName: "Emir",
      lastName: "Ilijaš",
      nickname: "Emir",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Erotski pjesnik",
      gender: "male",
      type: ActorType.MAIN,
    },
    {
      firstName: "Sead",
      lastName: "Hasanović",
      nickname: "Braco - CroRom",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Zastupnik romske nacionalne manjine",
      gender: "male",
      type: ActorType.MAIN,
    },
    {
      firstName: "Darko",
      lastName: "Dijanović",
      nickname: "Darkec",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Hrvat koji želi postati Srbin",
      gender: "male",
      type: ActorType.MAIN,
    },
    {
      firstName: "Zoran",
      lastName: "Krivić",
      nickname: "",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Predstavlja TV Aukciju ukradenih slika u Noćnoj Mori.",
      gender: "male",
      type: ActorType.MAIN,
    },
    {
      firstName: "Darijan",
      lastName: "Mišak",
      nickname: "Galeb",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Najbolji izvođač pjesme 'Moj galebe' svih vremena",
      gender: "male",
      type: ActorType.MAIN,
    },
    {
      firstName: "Ivan",
      lastName: "Plehan",
      nickname: "Ivek",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Najbolji harmonikaš svih vremena. Bi bip!",
      gender: "male",
      type: ActorType.MAIN,
    },
    {
      firstName: "Vlado",
      lastName: "Matijević",
      nickname: "Jajan",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Obični novinar",
      gender: "male",
      type: ActorType.MAIN,
    },
    {
      firstName: "Remzo",
      lastName: "Krak",
      nickname: "Remzo",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Urednik vijesti i narodni pjesnik. Dobio otkaz u Krašu.",
      gender: "male",
      type: ActorType.MAIN,
    },
    {
      firstName: "Nenad",
      lastName: "Blatnik",
      nickname: "Cezar",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Pjevač i bivši boksački prvak",
      gender: "male",
      type: ActorType.MAIN,
    },
    {
      firstName: "Stanislav",
      lastName: "Hranović",
      nickname: "Stankec",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Narodni tribun Republike Pešćenice",
      gender: "male",
      type: ActorType.MAIN,
    },
    {
      firstName: "Bruno",
      lastName: "Tomašić",
      nickname: "Anđa",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Predsjednikovo sunce uneređeno",
      gender: "transgender",
      type: ActorType.MAIN,
    },
    {
      firstName: "Ivica",
      lastName: "Lako",
      nickname: "Laki",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Plesač i ovisnik o marihuani",
      gender: "male",
      type: ActorType.MAIN,
    },
    {
      firstName: "Siniša",
      lastName: "Polovina",
      nickname: "Gibo od Kutine",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Pjevač",
      gender: "male",
      type: ActorType.MAIN,
    },
    {
      firstName: "Darko",
      lastName: "Djugumović",
      nickname: "Darko",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Pjevač-imitator",
      gender: "male",
      type: ActorType.MAIN,
    },
    {
      firstName: "Krešimir",
      lastName: "Ricijaš",
      nickname: "Giovanni",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Podvojena ličnost, perač prozora koji misli da je pilot",
      gender: "male",
      type: ActorType.MAIN,
    },
    {
      firstName: "Slađana",
      lastName: "Petrušić",
      nickname: "Slađa",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "",
      gender: "female",
      type: ActorType.MAIN,
    },
    {
      firstName: "Vesna",
      lastName: "Klaić",
      nickname: "",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "",
      gender: "female",
      type: ActorType.MAIN,
    },
    {
      firstName: "Ljubomir",
      lastName: "Đomešić",
      nickname: "Ljubo",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Filozof i mudrac",
      gender: "male",
      type: ActorType.MAIN,
    },
    {
      firstName: "Ivo",
      lastName: "Ribar",
      nickname: "Ivo Ribar",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Ribar sa otoka Oliba, završio 3 fakulteta - ribarski, tesarski i soboslikarsaki.",
      gender: "male",
      type: ActorType.MAIN,
    },
    {
      firstName: "Ali",
      lastName: "Milai",
      nickname: "",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Trbušni plesač",
      gender: "transgender",
      type: ActorType.MAIN,
    },
    {
      firstName: "Baka",
      lastName: "Milica",
      nickname: "",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Prodavačica sa zagrebačkog placa",
      gender: "female",
      type: ActorType.MAIN,
    },
    {
      firstName: "Dubravka",
      lastName: "Carić",
      nickname: "",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Bivša Jaranova ljubav",
      gender: "female",
      type: ActorType.MAIN,
    },
    {
      firstName: "Husnija",
      lastName: "Hrustić",
      nickname: "",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Voditeljica vremenske prognoze",
      gender: "female",
      type: ActorType.MAIN,
    },
    {
      firstName: "Hasan",
      lastName: "Hrustić",
      nickname: "Draki",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Husnijin sin",
      gender: "male",
      type: ActorType.MAIN,
    },
    {
      firstName: "Sandra",
      lastName: "Dabo",
      nickname: "Kraljica Novalje",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Pjevačica i voditeljica 'Golih vijesti'",
      gender: "female",
      type: ActorType.GUEST,
    },
    {
      firstName: "Predrag",
      lastName: "Raos",
      nickname: "",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Književnik",
      gender: "male",
      type: ActorType.MAIN,
    },
    {
      firstName: "Stjepan",
      lastName: "Spajić",
      nickname: "Rođo",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Hrvatski poduzetnik i sportski djelatnik, predsjednik zagrebačkoga nogometnog kluba Hrvatski dragovoljac",
      gender: "male",
      type: ActorType.GUEST,
    },
    {
      firstName: "Milan",
      lastName: "Bandić",
      nickname: "",
      birthDate: new Date(1970, 1, 1),
      deathDate: new Date(2022, 1, 1),
      bio: "Dugogodišnji gradonačelnik grada Zagreba",
      gender: "male",
      type: ActorType.GUEST,
    },
  ];

  for (const actorData of actorsData) {
    const slug = generateSlug(`${actorData.firstName} ${actorData.lastName}`);

    await prisma.actor.upsert({
      where: { slug: slug },
      update: {
        firstName: actorData.firstName,
        lastName: actorData.lastName,
        birthDate: new Date(1970, 1, 1),
        deathDate: new Date(2022, 1, 1),
        bio: actorData.bio,
        gender: actorData.gender,
        nickname: actorData.nickname,
        type: actorData.type,
      },
      // TODO: Fix TS error
      // @ts-ignore
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
    console.log("🚨 No actors found.");
    return;
  }

  // Seed categories
  const categoriesData = [
    { title: "Dnevnik" },
    { title: "Tko želi biti milijunaš?", description: "Kviz" },
    { title: "Vatreno lice" },
    { title: "Dora Mora", description: "Glazbeno natjecanje" },
    { title: "Picolovka", description: "Kultna ljubavna emisija Picolovka" },
    { title: "Izleti", description: "Emisije sa raznih izleta" },
    {
      title: "Dokumentarci",
      description: "Dokumentarne emisije Željka Malnara",
    },
    {
      title: "Gosti",
      description: "Emisije sa raznim gostima",
    },
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

  if (categories.length === 0) {
    console.log("🚨 No categories found.");
    return;
  }

  // Seed videos
  const videosData = [
    {
      title: "Noćna mora, Malnar",
      videoId: "444785863",
      duration: 29,
      provider: VideoProvider.VIMEO,
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
      provider: VideoProvider.YOUTUBE,
      airedDate: new Date("2001-01-12"),
      actors: actors
        .filter((actor) =>
          ["zeljko-malnar", "milan-bandic", "sead-hasanovic"].includes(
            actor.slug
          )
        )
        .map((actor) => actor.id),
      categories: categories
        .filter((category) => ["gosti"].includes(category.slug))
        .map((category) => category.id),
    },
    {
      title: "Jaran,Bakica i Cigo",
      videoId: "PC0pzISCAQc",
      duration: 4571,
      provider: VideoProvider.YOUTUBE,
      actors: actors.slice(0, 5).map((actor) => actor.id),
      categories: categories
        .filter((category) => ["picolovka"].includes(category.slug))
        .map((category) => category.id),
    },
    {
      title: "Noćna Mora - 1/5 - Nenad Ivanković -19/20.11.2005",
      videoId: "xJ_-PjDDy_c",
      duration: 4121,
      provider: VideoProvider.YOUTUBE,
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
      provider: VideoProvider.DAILYMOTION,
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
      provider: VideoProvider.VIMEO,
      airedDate: new Date("2010-10-01"),
      actors: actors
        .filter((actor) =>
          ["zeljko-malnar", "milan-bandic", "sead-hasanovic"].includes(
            actor.slug
          )
        )
        .map((actor) => actor.id),
      categories: categories
        .filter((category) => ["gosti"].includes(category.slug))
        .map((category) => category.id),
    },
    {
      title: "Picolovka FULL VIDEO! Remzo, Jaran, Stankec na vrućoj stolici",
      videoId: "0_qYNvTlS34",
      duration: 2338,
      provider: VideoProvider.YOUTUBE,
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
      provider: VideoProvider.YOUTUBE,
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
    {
      title: "Noćna Mora - Picolovka - Ševa, Laki, Stankec",
      videoId: "naQJjcn7pBU",
      duration: 3453,
      provider: VideoProvider.YOUTUBE,
      airedDate: new Date("2010-10-01"),
      actors: actors
        .filter((actor) =>
          [
            "stanko-hranovic",
            "ivica-lako",
            "sead-hasanovic",
            "hasan-hrustic",
            "zvonimir-levacic",
          ].includes(actor.slug)
        )
        .map((actor) => actor.id),
      categories: categories
        .filter((category) => ["picolovka"].includes(category.slug))
        .map((category) => category.id),
    },
    {
      title:
        "Željko Malnar - Iskustva 'udarenih' motorista (cijeli dokumentarni/putopisni film)",
      videoId: "sbm4wqRCK_I",
      duration: 1800,
      provider: VideoProvider.YOUTUBE,
      airedDate: new Date("2010-10-01"),
      actors: actors
        .filter((actor) => ["zeljko-malnar"].includes(actor.slug))
        .map((actor) => actor.id),
      categories: categories
        .filter((category) => ["dokumentarci"].includes(category.slug))
        .map((category) => category.id),
    },
  ];

  for (const videoData of videosData) {
    await prisma.video.upsert({
      where: { videoId: videoData.videoId }, // Unique identifier
      update: {
        videoId: videoData.videoId,
        duration: videoData.duration,
        provider: videoData.provider,
        published: true,
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
        published: true,
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
