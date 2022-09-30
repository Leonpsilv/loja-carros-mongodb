const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
require('dotenv').config();
const { AWS_USER_ACCESS_KEY_ID, AWS_USER_SECRET_KEY, AWS_DEFAULT_REGION, AWS_BUCKET_NAME } = process.env;

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
        s3: new aws.S3({
            accessKeyId: AWS_USER_ACCESS_KEY_ID,
            secretAccessKey: AWS_USER_SECRET_KEY,
            Bucket: AWS_BUCKET_NAME
        }),
        //bucket: AWS_BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            crypto.randomBytes(10, (err, hash) => {
                if (err){ cb(err) };
                const originalName = file.originalname;
                const fileName = `${hash.toString('hex')}-${originalName}`;

                cb(null, fileName);
            });
        },
    }),
}

module.exports = {
    dest : path.resolve(__dirname, '..', '..', 'tmp', 'upload'),
    storage : storageTypes.s3,
    limits : {
        filseSize: 10 * 1024 * 1024,
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
};