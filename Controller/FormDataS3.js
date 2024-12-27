const aws = require("@aws-sdk/client-s3");

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_BUCKET_NAME;

const s3Client = new aws.S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const savingFileToS3 = async(file,fileName) => {
  try {
    const uploadParams = {
      Bucket: bucketName,
      Body: file.buffer,
      Key: fileName,
      ContentType: file.mimetype,
    };

    const result = await s3Client.send(new aws.PutObjectCommand(uploadParams));
    const response = {
      status:"success",
      result,
      download_url:`https://career-connect-bkt.s3.ap-south-1.amazonaws.com/${fileName}`
    }
    return response
  } catch (error) {
    const response = {
      status:"fail",
      error
    }  
    return response
  }
};
module.exports = {
  savingFileToS3,
};
