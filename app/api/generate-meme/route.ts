import { NextResponse } from "next/server";
import { createCanvas, loadImage, registerFont } from "canvas";
import { uploadToS3 } from "@/lib/s3";
import prisma from "@/lib/prisma";
// import { getServerSession } from "next-auth/next";
import { auth } from "@/auth";

// If you need to register custom fonts
// registerFont('/path/to/Impact.ttf', { family: 'Impact' });

export async function POST(request) {
  const session = await auth();
  // const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { imageUrl, imageId, topText, bottomText } = await request.json();

    // Load the image from the URL
    const img = await loadImage(imageUrl);

    // Create a canvas
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext("2d");

    // Draw the image
    ctx.drawImage(img, 0, 0);

    // Add text
    ctx.font = "bold 48px Impact";
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.textAlign = "center";
    ctx.lineWidth = 2;

    // Top Text
    ctx.fillText(topText.toUpperCase(), img.width / 2, 60);
    ctx.strokeText(topText.toUpperCase(), img.width / 2, 60);

    // Bottom Text
    ctx.fillText(bottomText.toUpperCase(), img.width / 2, img.height - 20);
    ctx.strokeText(bottomText.toUpperCase(), img.width / 2, img.height - 20);

    // Convert canvas to buffer
    const buffer = canvas.toBuffer("image/png");

    // Upload to S3
    const fileName = `memes/${session.user.email}/${Date.now()}.png`;
    const memeUrl = await uploadToS3(buffer, fileName, "image/png");

    // Save meme metadata to the database
    const newMeme = await prisma.meme.create({
      data: {
        url: memeUrl,
        topText,
        bottomText,
        createdBy: { connect: { email: session.user.email } },
        sourceImage: { connect: { id: imageId } },
      },
    });

    return NextResponse.json(
      { imageUrl: memeUrl, meme: newMeme },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
