import prisma from "@/lib/prisma";
import { generateSlug } from "../lib/slugify";
import { ParticipantType, VideoProvider } from "@prisma/client";

async function main() {
  // Create a default user to associate with participants
  const defaultUserEmail = "isuvak@gmail.com";

  const user = await prisma.user.findUnique({
    where: { email: defaultUserEmail },
  });

  // Seed data for participants
  const participantsData = [
    {
      firstName: "Željko",
      lastName: "Malnar",
      birthDate: new Date(1944, 4, 12),
      deathDate: new Date(2013, 7, 9),
      bio: 'Željko Malnar is documentarist, TV author and writer. Educated at New Delhi University in mass communications. Made more then 100 documentary films about far east and tropical areas for which he has won awards. Co-author of the book U potrazi za staklenim gradom (In search for glass city). Author of TV series "Nightmare stage (OTV, 1992-1995) and series of interviews in Globus magazine.',
      gender: "Male",
      nickname: "Predsjednik",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Nediljko",
      lastName: "Alagušić",
      birthDate: null,
      deathDate: new Date(2020, 11, 1),
      bio: "Savjetnik za moral i ćudoređe Republike Pešćenice",
      gender: "Male",
      nickname: "Tarzan",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Zvonimir",
      lastName: "Levačić",
      birthDate: new Date(1943, 12, 12),
      deathDate: new Date(2010, 5, 5),
      bio: "Ministar obrane Republike Pešćenice",
      gender: "Male",
      nickname: "Ševa",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Emir",
      lastName: "Ilijaš",
      nickname: "Emir",
      birthDate: null,
      deathDate: null,
      bio: "Erotski pjesnik",
      gender: "male",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Sead",
      lastName: "Hasanović",
      nickname: "Braco - CroRom",
      birthDate: new Date(1953, 8, 26),
      deathDate: null,
      bio: "Zastupnik romske nacionalne manjine",
      gender: "male",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Darko",
      lastName: "Dijanović",
      nickname: "Darkec",
      birthDate: null,
      deathDate: null,
      bio: "Hrvat koji želi postati Srbin",
      gender: "male",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Zoran",
      lastName: "Krivić",
      nickname: "",
      birthDate: null,
      deathDate: null,
      bio: "Predstavlja TV Aukciju ukradenih slika u Noćnoj Mori.",
      gender: "male",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Darijan",
      lastName: "Mišak",
      nickname: "Galeb",
      birthDate: new Date(1966, 12, 21),
      deathDate: null,
      bio: "Najbolji izvođač pjesme 'Moj galebe' svih vremena",
      gender: "male",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Ivan",
      lastName: "Plehan",
      nickname: "Ivek",
      birthDate: null,
      deathDate: null,
      bio: "Najbolji harmonikaš svih vremena. Bi bip!",
      gender: "male",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Vlado",
      lastName: "Matijević",
      nickname: "Jajan",
      birthDate: new Date(1961, 2, 23),
      deathDate: null,
      bio: "Obični novinar",
      gender: "male",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Remzo",
      lastName: "Krak",
      nickname: "Remzo",
      // TODO: Update to correct year, day and month are correct
      birthDate: new Date(2023, 4, 29),
      deathDate: null,
      bio: "Urednik vijesti i narodni pjesnik. Dobio otkaz u Krašu.",
      gender: "male",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Nenad",
      lastName: "Blatnik",
      nickname: "Cezar",
      // TODO: Update to correct year, day and month are correct
      birthDate: new Date(2023, 6, 11),
      deathDate: null,
      bio: "Pjevač i bivši boksački prvak",
      gender: "male",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Stanislav",
      lastName: "Hranović",
      nickname: "Stankec",
      birthDate: new Date(1950, 2, 28),
      deathDate: new Date(2018, 6, 17),
      bio: "Narodni tribun Republike Pešćenice",
      gender: "male",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Bruno",
      lastName: "Tomašić",
      nickname: "Anđa",
      birthDate: null,
      deathDate: null,
      bio: "Predsjednikovo sunce uneređeno",
      gender: "transgender",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Ivica",
      lastName: "Lako",
      nickname: "Laki",
      birthDate: null,
      deathDate: new Date(2021, 8, 31),
      bio: "Plesač i ovisnik o marihuani",
      gender: "male",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Siniša",
      lastName: "Polovina",
      nickname: "Gibo od Kutine",
      birthDate: null,
      deathDate: null,
      bio: "Pjevač",
      gender: "male",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Darko",
      lastName: "Djugumović",
      nickname: "Darko",
      birthDate: null,
      deathDate: null,
      bio: "Pjevač-imitator",
      gender: "male",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Krešimir",
      lastName: "Ricijaš",
      nickname: "Giovanni",
      birthDate: null,
      deathDate: null,
      bio: "Podvojena ličnost, perač prozora koji misli da je pilot",
      gender: "male",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Slađana",
      lastName: "Petrušić",
      nickname: "Slađa",
      birthDate: null,
      deathDate: null,
      bio: "",
      gender: "female",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Vesna",
      lastName: "Klaić",
      nickname: "",
      birthDate: null,
      deathDate: null,
      bio: "",
      gender: "female",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Ljubomir",
      lastName: "Đomešić",
      nickname: "Ljubo",
      birthDate: null,
      deathDate: null,
      bio: "Filozof i mudrac",
      gender: "male",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Ivo",
      lastName: "Ribar",
      nickname: "Ivo Ribar",
      birthDate: null,
      deathDate: null,
      bio: "Ribar sa otoka Oliba, završio 3 fakulteta - ribarski, tesarski i soboslikarsaki.",
      gender: "male",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Ali",
      lastName: "Milai",
      nickname: "",
      birthDate: null,
      deathDate: null,
      bio: "Trbušni plesač",
      gender: "transgender",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Baka",
      lastName: "Milica",
      nickname: "",
      birthDate: null,
      deathDate: null,
      bio: "Prodavačica sa zagrebačkog placa",
      gender: "female",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Dubravka",
      lastName: "Carić",
      nickname: "",
      birthDate: null,
      deathDate: new Date(2024, 2, 19),
      bio: "Bivša Jaranova ljubav",
      gender: "female",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Husnija",
      lastName: "Hrustić",
      nickname: "",
      birthDate: null,
      deathDate: null,
      bio: "Voditeljica vremenske prognoze",
      gender: "female",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Hasan",
      lastName: "Hrustić",
      nickname: "Draki",
      birthDate: null,
      deathDate: null,
      bio: "Husnijin sin",
      gender: "male",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Sandra",
      lastName: "Dabo",
      nickname: "Kraljica Novalje",
      birthDate: null,
      deathDate: null,
      bio: "Pjevačica i voditeljica 'Golih vijesti'",
      gender: "female",
      type: ParticipantType.GUEST,
    },
    {
      firstName: "Predrag",
      lastName: "Raos",
      nickname: "",
      birthDate: new Date(1951, 6, 23),
      deathDate: null,
      bio: "Književnik",
      gender: "male",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Stjepan",
      lastName: "Spajić",
      nickname: "Rođo",
      birthDate: new Date(1952, 4, 7),
      deathDate: new Date(2004, 8, 21),
      bio: "Hrvatski poduzetnik i sportski djelatnik, predsjednik zagrebačkoga nogometnog kluba Hrvatski dragovoljac",
      gender: "male",
      type: ParticipantType.GUEST,
    },
    {
      firstName: "Milan",
      lastName: "Bandić",
      nickname: "",
      birthDate: new Date(1955, 11, 22),
      deathDate: new Date(2021, 2, 28),
      bio: "Dugogodišnji gradonačelnik grada Zagreba",
      gender: "male",
      type: ParticipantType.GUEST,
    },
    {
      firstName: "Nedjeljko",
      lastName: "Badovinac",
      nickname: "Jumbo",
      birthDate: new Date(1953, 6, 1),
      deathDate: new Date(2022, 11, 4),
      bio: "Desna ruka Željka Malnara, dugogodišnji producent Noćne More i brojnih drugih televizijskih formata. Začetnik najduhovitijih trenutaka koje smo imali prilike gledati tijekom trajanja Noćne More",
      gender: "male",
      type: ParticipantType.MAIN,
    },
  ];

  for (const participantData of participantsData) {
    const slug = generateSlug(
      `${participantData.firstName} ${participantData.lastName}`
    );

    await prisma.participant.upsert({
      where: { slug: slug },
      update: {
        firstName: participantData.firstName,
        lastName: participantData.lastName,
        birthDate: participantData.birthDate,
        deathDate: participantData.deathDate,
        bio: participantData.bio,
        gender: participantData.gender,
        nickname: participantData.nickname,
        type: participantData.type,
      },
      // TODO: Fix TS error
      // @ts-ignore
      create: {
        ...participantData,
        slug: slug,
        userId: user?.id, // Associate with default user
      },
    });
  }

  console.log("🕺🏻 Participants seeded successfully.");

  // Fetch existing participants
  const participants = await prisma.participant.findMany();

  if (participants.length === 0) {
    console.log("🚨 No participants found.");
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
    {
      title: "Podcasts",
      description: "Podcastovi sa likovima Noćne more",
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
      participants: participants
        .slice(0, 5)
        .map((participant) => participant.id),
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
      participants: participants
        .filter((participant) =>
          ["zeljko-malnar", "milan-bandic", "sead-hasanovic"].includes(
            participant.slug
          )
        )
        .map((participant) => participant.id),
      categories: categories
        .filter((category) => ["gosti"].includes(category.slug))
        .map((category) => category.id),
    },
    {
      title: "Jaran,Bakica i Cigo",
      videoId: "PC0pzISCAQc",
      duration: 4571,
      provider: VideoProvider.YOUTUBE,
      participants: participants
        .slice(0, 5)
        .map((participant) => participant.id),
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
      participants: participants
        .slice(2, 9)
        .map((participant) => participant.id),
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
      participants: participants
        .slice(2, 9)
        .map((participant) => participant.id),
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
      participants: participants
        .filter((participant) =>
          ["zeljko-malnar", "milan-bandic", "sead-hasanovic"].includes(
            participant.slug
          )
        )
        .map((participant) => participant.id),
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
      participants: participants
        .filter((participant) =>
          [
            "vlado-matijevic",
            "remzo-krak",
            "stanko-hranovic",
            "sead-hasanovic",
          ].includes(participant.slug)
        )
        .map((participant) => participant.id),
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
      participants: participants
        .filter((participant) =>
          [
            "nediljko-alagusic",
            "ivica-lako",
            "sead-hasanovic",
            "husnija-hrustic",
            "zvonimir-levacic",
          ].includes(participant.slug)
        )
        .map((participant) => participant.id),
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
      participants: participants
        .filter((participant) =>
          [
            "stanko-hranovic",
            "ivica-lako",
            "sead-hasanovic",
            "hasan-hrustic",
            "zvonimir-levacic",
          ].includes(participant.slug)
        )
        .map((participant) => participant.id),
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
      participants: participants
        .filter((participant) => ["zeljko-malnar"].includes(participant.slug))
        .map((participant) => participant.id),
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
        participants: {
          set: videoData.participants.map((participantId) => ({
            id: participantId,
          })),
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
        participants: {
          connect: videoData.participants.map((participantId) => ({
            id: participantId,
          })),
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
