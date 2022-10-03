const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const { S3Client } = require('@aws-sdk/client-s3');

const multerS3 = require('multer-s3');
require('dotenv').config();
const { AVATAR_STORAGE, AWS_USER_ACCESS_KEY_ID, AWS_USER_SECRET_KEY, AWS_DEFAULT_REGION, AWS_BUCKET_NAME } = process.env;

const s3 = new S3Client({
    region: AWS_DEFAULT_REGION,
    credentials: {
      accessKeyId: AWS_USER_ACCESS_KEY_ID,
      secretAccessKey: AWS_USER_SECRET_KEY,
    },
    sslEnabled: false,
    s3ForcePathStyle: true,
    signatureVersion: 'v4',
  });

const storageTypes = {
    local: multer.diskStorage({
        destination : (req, file, cb) => {
            cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'upload'));
        },
        filename : (req, file, cb) => {
            crypto.randomBytes(10, (err, hash) => {
                if (err){ cb(err) };
                const originalName = file.originalname;
                file.key = `${hash.toString('hex')}-${originalName}`;

                cb(null, file.key);
            });
        },
    }), // to storage the images in local disk

    s3: multerS3({
        s3: s3,
        bucket: AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        metadata: function (req, file, cb) {
          cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            crypto.randomBytes(10, (err, hash) => {
                if (err){ cb(err) };
                const originalName = file.originalname;
                const fileName = `${hash.toString('hex')}-${originalName}`;

                cb(null, fileName);
            });
        },
      }), // to storage in aws s3
}

module.exports = {
    dest : path.resolve(__dirname, '..', '..', 'tmp', 'upload'),
    storage : storageTypes[AVATAR_STORAGE],
    limits : {
        filseSize: 4 * 1024 * 1024,
    },
    fileFilter : (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
        ];

        if(allowedMimes.includes(file.mimetype)) {
           cb(null, true);
        }else {
            cb(new Error('Invalid file type.'));
        };
    },
}