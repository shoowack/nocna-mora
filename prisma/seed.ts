import prisma from "@/lib/prisma";
import { generateSlug } from "@/lib/slugify";
import {
  ParticipantType,
  VideoProvider,
  ParticipantGender,
} from "@prisma/client";
import { faker } from "@faker-js/faker";

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
      birthDate: new Date(Date.parse("04 12 1944 00:00:00 GMT")),
      deathDate: new Date(Date.parse("07 09 2013 00:00:00 GMT")),
      bio: 'Željko Malnar is documentarist, TV author and writer. Educated at New Delhi University in mass communications. Made more then 100 documentary films about far east and tropical areas for which he has won awards. Co-author of the book U potrazi za staklenim gradom (In search for glass city). Author of TV series "Nightmare stage (OTV, 1992-1995) and series of interviews in Globus magazine.',
      gender: ParticipantGender.MALE,
      nickname: "Predsjednik",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Nediljko",
      lastName: "Alagušić",
      birthDate: null,
      deathDate: new Date(Date.parse("11 01 2020 00:00:00 GMT")),
      bio: "Savjetnik za moral i ćudoređe Republike Pešćenice",
      gender: ParticipantGender.MALE,
      nickname: "Tarzan",
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Zvonimir",
      lastName: "Levačić",
      birthDate: new Date(Date.parse("12 12 1943 00:00:00 GMT")),
      deathDate: new Date(Date.parse("05 05 2010 00:00:00 GMT")),
      bio: "Ministar obrane Republike Pešćenice",
      gender: ParticipantGender.MALE,
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
      gender: ParticipantGender.MALE,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Sead",
      lastName: "Hasanović",
      nickname: "Braco - CroRom",
      birthDate: new Date(Date.parse("08 26 1953 00:00:00 GMT")),
      deathDate: null,
      bio: "Zastupnik romske nacionalne manjine",
      gender: ParticipantGender.MALE,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Darko",
      lastName: "Dijanović",
      nickname: "Darkec",
      birthDate: null,
      deathDate: null,
      bio: "Hrvat koji želi postati Srbin",
      gender: ParticipantGender.MALE,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Zoran",
      lastName: "Krivić",
      nickname: null,
      birthDate: null,
      deathDate: null,
      bio: "Predstavlja TV Aukciju ukradenih slika u Noćnoj Mori.",
      gender: ParticipantGender.MALE,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Darijan",
      lastName: "Mišak",
      nickname: "Galeb",
      birthDate: new Date(Date.parse("12 21 1966 00:00:00 GMT")),
      deathDate: null,
      bio: "Najbolji izvođač pjesme 'Moj galebe' svih vremena",
      gender: ParticipantGender.MALE,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Ivan",
      lastName: "Plehan",
      nickname: "Ivek",
      birthDate: null,
      deathDate: null,
      bio: "Najbolji harmonikaš svih vremena. Bi bip!",
      gender: ParticipantGender.MALE,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Vlado",
      lastName: "Matijević",
      nickname: "Jajan",
      birthDate: new Date(Date.parse("02 23 1961 00:00:00 GMT")),
      deathDate: null,
      bio: "Obični novinar",
      gender: ParticipantGender.MALE,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Remzo",
      lastName: "Krak",
      nickname: "Remzo",
      // TODO: Update to correct year, day and month are correct
      birthDate: new Date(Date.parse("04 29 2024 00:00:00 GMT")),
      deathDate: null,
      bio: "Urednik vijesti i narodni pjesnik. Dobio otkaz u Krašu.",
      gender: ParticipantGender.MALE,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Nenad",
      lastName: "Blatnik",
      nickname: "Cezar",
      // TODO: Update to correct year, day and month are correct
      birthDate: new Date(Date.parse("06 11 2024 00:00:00 GMT")),
      deathDate: null,
      bio: "Pjevač i bivši boksački prvak",
      gender: ParticipantGender.MALE,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Stanislav",
      lastName: "Hranović",
      nickname: "Stankec",
      birthDate: new Date(Date.parse("02 28 1950 00:00:00 GMT")),
      deathDate: new Date(Date.parse("06 17 2018 00:00:00 GMT")),
      bio: "Narodni tribun Republike Pešćenice",
      gender: ParticipantGender.MALE,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Bruno",
      lastName: "Tomašić",
      nickname: "Anđa",
      birthDate: null,
      deathDate: null,
      bio: "Predsjednikovo sunce uneređeno",
      gender: ParticipantGender.TRANSGENDER,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Ivica",
      lastName: "Lako",
      nickname: "Laki",
      birthDate: null,
      deathDate: new Date(Date.parse("08 31 2021 00:00:00 GMT")),
      bio: "Plesač i ovisnik o marihuani",
      gender: ParticipantGender.MALE,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Siniša",
      lastName: "Polovina",
      nickname: "Gibo od Kutine",
      birthDate: null,
      deathDate: null,
      bio: "Pjevač",
      gender: ParticipantGender.MALE,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Dario",
      lastName: "Đugumović",
      nickname: null,
      birthDate: null,
      deathDate: null,
      bio: "Pjevač-imitator",
      gender: ParticipantGender.MALE,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Krešimir",
      lastName: "Ricijaš",
      nickname: "Giovanni",
      birthDate: null,
      deathDate: null,
      bio: "Podvojena ličnost, perač prozora koji misli da je pilot",
      gender: ParticipantGender.MALE,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Slađana",
      lastName: "Petrušić",
      nickname: "Slađa",
      birthDate: null,
      deathDate: null,
      bio: null,
      gender: ParticipantGender.FEMALE,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Vesna",
      lastName: "Klaić",
      nickname: null,
      birthDate: null,
      deathDate: null,
      bio: null,
      gender: ParticipantGender.FEMALE,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Ljubomir",
      lastName: "Đomešić",
      nickname: "Ljubo",
      birthDate: null,
      deathDate: null,
      bio: "Filozof i mudrac",
      gender: ParticipantGender.MALE,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Ivo",
      lastName: "Ribar",
      nickname: "Ivo Ribar",
      birthDate: null,
      deathDate: null,
      bio: "Ribar sa otoka Oliba, završio 3 fakulteta - ribarski, tesarski i soboslikarsaki.",
      gender: ParticipantGender.MALE,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Ali",
      lastName: "Milai",
      nickname: null,
      birthDate: null,
      deathDate: null,
      bio: "Trbušni plesač",
      gender: ParticipantGender.TRANSGENDER,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Baka",
      lastName: "Milica",
      nickname: null,
      birthDate: null,
      deathDate: null,
      bio: "Prodavačica sa zagrebačkog placa",
      gender: ParticipantGender.FEMALE,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Dubravka",
      lastName: "Carić",
      nickname: null,
      birthDate: null,
      deathDate: new Date(Date.parse("02 19 2024 00:00:00 GMT")),
      bio: "Bivša Jaranova ljubav",
      gender: ParticipantGender.FEMALE,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Husnija",
      lastName: "Hrustić",
      nickname: null,
      birthDate: null,
      deathDate: null,
      bio: "Voditeljica vremenske prognoze",
      gender: ParticipantGender.FEMALE,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Hasan",
      lastName: "Hrustić",
      nickname: "Draki",
      birthDate: null,
      deathDate: null,
      bio: "Husnijin sin",
      gender: ParticipantGender.MALE,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Sandra",
      lastName: "Dabo",
      nickname: "Kraljica Novalje",
      birthDate: null,
      deathDate: null,
      bio: "Pjevačica i voditeljica 'Golih vijesti'",
      gender: ParticipantGender.FEMALE,
      type: ParticipantType.GUEST,
    },
    {
      firstName: "Predrag",
      lastName: "Raos",
      nickname: null,
      birthDate: new Date(Date.parse("06 23 1951 00:00:00 GMT")),
      deathDate: null,
      bio: "Književnik",
      gender: ParticipantGender.MALE,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Stjepan",
      lastName: "Spajić",
      nickname: "Rođo",
      birthDate: new Date(Date.parse("04 07 1952 00:00:00 GMT")),
      deathDate: new Date(Date.parse("08 21 2004 00:00:00 GMT")),
      bio: "Hrvatski poduzetnik i sportski djelatnik, predsjednik zagrebačkoga nogometnog kluba Hrvatski dragovoljac",
      gender: ParticipantGender.MALE,
      type: ParticipantType.GUEST,
    },
    {
      firstName: "Milan",
      lastName: "Bandić",
      nickname: null,
      birthDate: new Date(Date.parse("11 22 1955 00:00:00 GMT")),
      deathDate: new Date(Date.parse("02 28 2021 00:00:00 GMT")),
      bio: "Dugogodišnji gradonačelnik grada Zagreba",
      gender: ParticipantGender.MALE,
      type: ParticipantType.GUEST,
    },
    {
      firstName: "Nedjeljko",
      lastName: "Badovinac",
      nickname: "Jumbo",
      birthDate: new Date(Date.parse("06 01 1953 00:00:00 GMT")),
      deathDate: new Date(Date.parse("11 04 2022 00:00:00 GMT")),
      bio: "Desna ruka Željka Malnara, dugogodišnji producent Noćne More i brojnih drugih televizijskih formata. Začetnik najduhovitijih trenutaka koje smo imali prilike gledati tijekom trajanja Noćne More",
      gender: ParticipantGender.MALE,
      type: ParticipantType.MAIN,
    },
    {
      firstName: "Mladen",
      lastName: "Schwartz",
      nickname: null,
      birthDate: new Date(Date.parse("04 17 1947 00:00:00 GMT")),
      deathDate: new Date(Date.parse("09 14 2017 00:00:00 GMT")),
      bio: null,
      gender: ParticipantGender.MALE,
      type: ParticipantType.GUEST,
    },
    {
      firstName: "Slaven",
      lastName: "Letica",
      nickname: "Ban Letica",
      birthDate: new Date(Date.parse("06 28 1947 00:00:00 GMT")),
      deathDate: new Date(Date.parse("10 25 2020 00:00:00 GMT")),
      bio: "Hrvatski sociolog, kolumnist, publicist, političar i sveučilišni profesor.",
      gender: ParticipantGender.MALE,
      type: ParticipantType.GUEST,
    },
    {
      firstName: "Davor",
      lastName: "Štern",
      nickname: null,
      birthDate: new Date(Date.parse("06 18 1947 00:00:00 GMT")),
      deathDate: null,
      bio: "Bivši hrvatski ministar gospodarstva, poduzetnik i trenutno zastupnik u gradskoj skupštini Grada Zagreba",
      gender: ParticipantGender.MALE,
      type: ParticipantType.GUEST,
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
    { title: "Misli 21. stoljeća" },
    { title: "Dabog da imao, pa nemao" },
    { title: "Ševa vicevi" },
    {
      title: "Jel to normalno?",
      description:
        "Rasprava o raznim događajima iz novina, što je normalno, a što nije.",
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
            "stanislav-hranovic",
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
            "stanislav-hranovic",
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
    {
      title: "PREDRAG RAOS - DOKUMENTARNI FILM (2024)",
      videoId: "trDjBr2SNmw",
      duration: 13113,
      provider: VideoProvider.YOUTUBE,
      airedDate: new Date("2024-03-01"),
      participants: participants
        .filter((participant) => ["predrag-raos"].includes(participant.slug))
        .map((participant) => participant.id),
      categories: categories
        .filter((category) => ["dokumentarci"].includes(category.slug))
        .map((category) => category.id),
    },
    {
      title:
        "Dalibor Trojak Show#133 Remzo Krak Sirotković Legenda Noćne More I Nemoguće Emisije",
      videoId: "7egdtOI0J2U",
      duration: 68,
      provider: VideoProvider.YOUTUBE,
      airedDate: null,
      participants: participants
        .filter((participant) => ["remzo-krak"].includes(participant.slug))
        .map((participant) => participant.id),
      categories: categories
        .filter((category) => ["podcasts"].includes(category.slug))
        .map((category) => category.id),
    },
    {
      title: "Jericho: Priča o Željku Malnaru (Trailer)",
      videoId: "253218248",
      duration: 96,
      provider: VideoProvider.VIMEO,
      airedDate: new Date("2018-01-29"),
      participants: participants
        // TODO: Add other participants
        .filter((participant) => ["zeljko-malnar"].includes(participant.slug))
        .map((participant) => participant.id),
      categories: categories
        .filter((category) => ["documentarci"].includes(category.slug))
        .map((category) => category.id),
    },
    {
      title: "Stankec i Davor Štern",
      videoId: "263530297042978/videos/2715845905223275",
      duration: 1844,
      provider: VideoProvider.FACEBOOK,
      airedDate: new Date("2006-02-18"),
      participants: participants
        .filter((participant) =>
          ["stanislav-hranovic", "davor-stern"].includes(participant.slug)
        )
        .map((participant) => participant.id),
      categories: categories
        .filter((category) => ["podcasts"].includes(category.slug))
        .map((category) => category.id),
    },
    {
      title: "Ševa - totalka!!! 2 od 2",
      videoId: "Gu_lg3iZhmE",
      duration: 440,
      provider: VideoProvider.YOUTUBE,
      airedDate: new Date("2008-02-23"),
      participants: participants
        .filter((participant) =>
          ["zeljko-malnar", "stanislav-hranovic", "zvonimir-levacic"].includes(
            participant.slug
          )
        )
        .map((participant) => participant.id),
      categories: categories
        .filter((category) => ["jel-to-normalno"].includes(category.slug))
        .map((category) => category.id),
    },
    {
      title: "Ševa - totalka!!! 1 od 2",
      videoId: "8CnBBraJ2-E",
      duration: 1228,
      provider: VideoProvider.YOUTUBE,
      airedDate: new Date("2008-02-23"),
      participants: participants
        .filter((participant) =>
          ["zeljko-malnar", "stanislav-hranovic", "zvonimir-levacic"].includes(
            participant.slug
          )
        )
        .map((participant) => participant.id),
      categories: categories
        .filter((category) => ["jel-to-normalno"].includes(category.slug))
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

  // Find a specific video to add comments to
  const video = await prisma.video.findFirst({
    where: { title: videosData[0].title }, // Video title of the video you want to seed comments for
  });

  if (!user || !video) {
    console.error("User or video not found");
    return;
  }

  // Generate 30 comments
  const numberOfCommentsToGenearate = 30;

  const commentsData = Array.from(
    { length: numberOfCommentsToGenearate },
    (_, index) => ({
      content: faker.lorem.sentence(faker.number.int({ min: 10, max: 30 })), // Generate comment content of random length,
      videoId: video.id,
      createdById: user.id,
      approved: index % 2 === 0, // Approve every second comment
    })
  );

  // Seed the comments
  await Promise.all(
    commentsData.map(async (commentData) => {
      await prisma.comment.create({
        data: commentData,
      });
    })
  );

  console.log("💬 Comments seeded successfully.");
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
