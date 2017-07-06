'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3({
  signatureVersion: 'v4',
});
const Sharp = require('sharp');

const WIDTH = 450;
const HEIGHT = 450;

exports.handler = function(event, context, callback) {
  const key = event.Records[0].s3.object.key;
  const bucket = event.Records[0].s3.bucket.name;

  S3.getObject({Bucket: bucket, Key: key}).promise()
    .then((data) => {

      Sharp(data.Body)
        .resize(WIDTH, HEIGHT)
        .toBuffer()
        .then((buffer) => {

          return S3.putObject({
            Body: buffer,
            Bucket: bucket,
            ContentType: data.ContentType,
            Key: `450x450/${key}`
          }).promise();
        });
    })
    .then(() => callback(null, `successfully resized ${key}`))
    .catch(err => callback(err))
}
