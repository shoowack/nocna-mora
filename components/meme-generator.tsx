"use client";

import { useState } from "react";
import { ImageGallery } from "@/components/image-gallery";

export const MemeGenerator = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [memeUrl, setMemeUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImage) return alert("Please select an image");

    const response = await fetch("/api/generate-meme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl: selectedImage.url,
        imageId: selectedImage.id,
        topText,
        bottomText,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setMemeUrl(data.imageUrl);
    } else {
      alert(data.message);
    }
  };

  return (
    <>
      {!selectedImage ? (
        <ImageGallery onSelectImage={setSelectedImage} />
      ) : (
        <div>
          <button onClick={() => setSelectedImage(null)}>
            Back to Gallery
          </button>
          <img src={selectedImage.url} alt={selectedImage.title} />
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Top Text"
              value={topText}
              onChange={(e) => setTopText(e.target.value)}
            />
            <input
              type="text"
              placeholder="Bottom Text"
              value={bottomText}
              onChange={(e) => setBottomText(e.target.value)}
            />
            <button type="submit">Create Meme</button>
          </form>
        </div>
      )}
      {memeUrl && (
        <div>
          <h2>Your Meme:</h2>
          <img src={memeUrl} alt="Generated Meme" />
        </div>
      )}
    </>
  );
};
