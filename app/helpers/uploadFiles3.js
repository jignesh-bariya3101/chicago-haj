const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new S3Client();
const AWS = require('aws-sdk');
const fs = require('fs');
const formidable = require('formidable');

const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
})

const uploadFile = (bucketName) => {
  multer({
    storage: multerS3({
      s3: s3,
      bucket: bucketName,
      metadata: function (req, file, cb) {
        cb(null, { fieldName: file.fieldname });
      },
      key: function (req, file, cb) {
        let newFileName = Date.now().toString() + "_" + file.originalname;
        var fullPath = "movies/" + newFileName;
        cb(null, fullPath);
      },
    }),
  });
}

const uploadOnS3 = async (req) => {
  try {
    return new Promise((resolve, reject) => {
      var form = new formidable.IncomingForm();
      form.parse(req, async (err, fields, files) => {
        console.log('files.movieFile.originalFilename :>> ', files.movieFile.name);
        if (err) {
          console.log('req :>> ', err);
          return reject({ error: false, data: null, message: err.message });
        }
        const imagePath = files.movieFile.path
        const blob = fs.readFileSync(imagePath)

        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: files.movieFile.name,
          Body: blob
        }

        const uploadedImage = await S3.upload(params).promise()
        console.log('data.Location :>> ', uploadedImage, uploadedImage.Location);
        return resolve({ error: false, data: uploadedImage.Location, message: "File Uploaded Successfully" });
      });

      form.on("error", function (err) {
        console.log("err", err);
        return { error: true, data: null, message: err.message };
      });
    });
  } catch (err) {
    return reject({ error: true, data: null, message: err.message });
  }
  new Promise((resolve, reject) => {
  })
}
module.exports = { uploadFile, uploadOnS3 };
