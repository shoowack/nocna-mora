import { useEffect, useState } from "react";

export const ImageGallery = ({ onSelectImage }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch("/api/images")
      .then((res) => res.json())
      .then((data) => setImages(data.images));
  }, []);

  return (
    <div className="image-gallery">
      {images.map((image) => (
        <div key={image.id} onClick={() => onSelectImage(image)}>
          <img src={image.url} alt={image.title} />
          <p>{image.title}</p>
          <p>Uploaded by: {image.uploadedBy.name || image.uploadedBy.email}</p>
        </div>
      ))}
    </div>
  );
};
