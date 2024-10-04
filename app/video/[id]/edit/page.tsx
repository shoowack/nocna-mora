import prisma from "@/lib/prisma";
import { auth } from "auth";
import { VideoForm } from "@/components/video-form";
import { TitleTemplate } from "@/components/title-template";
import { redirect } from "next/navigation";

export default async function EditVideoPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (session?.user) {
    // TODO: Look into https://react.dev/reference/react/experimental_taintObjectReference
    // filter out sensitive data before passing to client.
    session.user = {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      role: session.user.role,
    };
  }

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const isAdmin = session?.user?.role === "admin";

  if (!isAdmin) {
    redirect("/");
  }

  const video = await prisma.video.findUnique({
    where: { id: params.id },
    include: {
      categories: true,
      participants: true,
      createdBy: true,
    },
  });

  if (!video) {
    return <div>Video not found</div>;
  }

  return (
    <TitleTemplate title={`Edit video ${video.title}`} contained>
      <VideoForm video={video} />
    </TitleTemplate>
  );
}
