import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadToS3 = async (fileContent, fileName) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
    ContentType: "image/png",
    ACL: "public-read", // Optional: makes the file publicly readable
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location; // The URL of the uploaded file
  } catch (err) {
    console.error(err);
    throw err;
  }
};
