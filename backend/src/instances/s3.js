const {S3Client} = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    ...(process.env.AWS_S3_ENDPOINT && { 
        endpoint: process.env.AWS_S3_ENDPOINT,
        forcePathStyle: true,
    }),
});
module.exports = { s3 };