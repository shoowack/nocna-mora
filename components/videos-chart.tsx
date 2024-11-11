import prisma from "@/lib/prisma";
import { ClientCategoriesChart } from "@/components/charts/client-categories-chart";

export const ServerCategoriesChart = async () => {
  // Join this with the category name or any other info from the `Category` model
  const getVideoCountsByCategory = async () => {
    // Fetch all categories along with the count of videos in each category
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        title: true,
        _count: {
          select: {
            videos: true,
          },
        },
      },
    });

    return categories.map((category) => ({
      categoryName: category.title,
      videoCount: category._count.videos,
    }));
  };

  const categoryCounts = await getVideoCountsByCategory();

  return <ClientCategoriesChart data={categoryCounts} />;
};
