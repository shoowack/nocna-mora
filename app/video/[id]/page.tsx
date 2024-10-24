import prisma from "@/lib/prisma";
import Link from "next/link";
import { TitleTemplate } from "@/components/title-template";
import { VideoDetail } from "@/components/video-detail";
import { Container } from "@/components/container";
import { AlertTriangle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "auth";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "@/components/comment-section";

export default async function VideoPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const session = await auth();

  if (session?.user) {
    // TODO: Look into https://react.dev/reference/react/experimental_taintObjectReference
    // filter out sensitive data before passing to client.
    session.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
      role: session.user.role,
    };
  }

  const isAdmin = session?.user?.role === "admin";

  const video = await prisma.video.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      videoId: true,
      provider: true,
      duration: true,
      airedDate: true,
      published: true,
      createdAt: true,
      userId: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          role: true,
        },
      },
      participants: true,
      categories: true,
      comments: {
        where: isAdmin
          ? {} // Admins see all comments, including deleted ones
          : session?.user
          ? {
              deletedAt: null, // Exclude deleted comments for non-admins
              OR: [
                { approved: true }, // Approved comments from others
                { approved: false, createdById: session?.user?.id }, // Their own unapproved comments
              ],
            }
          : {
              deletedAt: null, // Exclude deleted comments for non-admins
              approved: true, // Approved comments from others
            },
        select: {
          id: true,
          content: true,
          createdAt: true,
          updatedAt: true,
          approved: true,
          deletedAt: true,
          videoId: true,
          createdById: true,
          createdBy: {
            select: {
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const totalApprovedComments = await prisma.comment.count({
    where: {
      videoId: id,
      ...(isAdmin ? {} : { deletedAt: null, approved: true }), // Exclude deleted comments for non-admins
    },
  });

  const totalUnapprovedComments = await prisma.comment.count({
    where: {
      videoId: id,
      approved: false,
      deletedAt: null,
    },
  });

  const totalDeletedComments = await prisma.comment.count({
    where: {
      videoId: id,
      deletedAt: {
        not: null,
      },
    },
  });

  // Unpublished videos should be accessible for authenticated admin users only
  if (!video || (!video.published && !isAdmin)) {
    return (
      <Container className="text-center">
        <AlertTriangle className="mx-auto mb-5 size-8 stroke-yellow-500" />
        <h1 className="text-2xl font-bold">Video nije dostupan</h1>
        <p className="mt-5 text-balance">
          Nažalost, video koji tražite nije dostupan. Moguće je da je uklonjen
          ili da je došlo do greške u vezi. Molimo vas da provjerite URL ili
          pretražite druge videozapise klikom na gumb ispod.
        </p>
        {/*
        // TODO: Add link to /videos page once it becomes available
        <Link href="/videos" className="mt-10"> */}
        <Link href="/" className="mt-10">
          <Button className="mx-auto mt-10 flex items-center">
            <ChevronLeft className="mr-2 size-4" />
            Povratak na videozapise
          </Button>
        </Link>
      </Container>
    );
  }

  return (
    <TitleTemplate
      title={video.title}
      button={
        <Link href={`/video/${video?.id}/edit`}>
          <Button className="w-full">Ažuriraj video</Button>
        </Link>
      }
    >
      <VideoDetail video={video} singleVideo showCategories showActors />
      <Container className="md:py-0">
        <Separator />
        <CommentSection
          videoId={video.id}
          comments={video.comments}
          isAdmin={isAdmin}
          user={
            session?.user
              ? {
                  name: session.user.name ?? "",
                  email: session.user.email ?? "",
                  image: session.user.image ?? "",
                  role: session.user.role ?? "",
                }
              : undefined
          }
          totalApprovedComments={totalApprovedComments}
          totalUnapprovedComments={totalUnapprovedComments}
          totalDeletedComments={totalDeletedComments}
        />
      </Container>
    </TitleTemplate>
  );
}
