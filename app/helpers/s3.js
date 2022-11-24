const AWS = require('aws-sdk');
const fs = require('fs');

// Enter copied or downloaded access ID and secret key here
const ID = process.env.AWS_ACCESS_KEY;
const SECRET = process.env.AWS_SECRET_KEY;

// The name of the bucket that you have created
const BUCKET_NAME = process.env.S3_BUCKET_NAME;


const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

const params = {
    Bucket: BUCKET_NAME,
    CreateBucketConfiguration: {
        // Set your region here
        LocationConstraint: "eu-west-1"
    }
};

exports.uploadFile = (fileName) => {
    // Read content from the file
    const fileContent = fs.readFileSync(fileName);

    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: '', // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function (err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};