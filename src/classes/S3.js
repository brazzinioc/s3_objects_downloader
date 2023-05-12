import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import environments from '../config/environments.js';
const { AWS_S3 } = environments;

export default class S3 {

  #s3Client;
  #region =  AWS_S3.BUCKET_REGION;
  #accessKeyId = AWS_S3.ACCESS_KEY_ID;
  #secretAccessKey = AWS_S3.SECRET_ACCESS_KEY;
  #bucketName = AWS_S3.BUCKET_NAME;

  constructor() {
    this.#s3Client = new S3Client({
      region: this.#region,
      credentials: {
        accessKeyId: this.#accessKeyId,
        secretAccessKey: this.#secretAccessKey,
      }
    });
  }

  streamToString(stream) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("error", (error) => reject(error));
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    });
  }

  async downloadObject(remoteFileName, remotePathFile, localFileName, localPathFile) {

    const params = {
      Bucket: this.#bucketName,
      Key: `${remotePathFile}${remoteFileName}`
    }

    const command = new GetObjectCommand(params);

    try {

      console.log(`Downloading: ${remoteFileName} from S3`);

      const s3Response = await this.#s3Client.send(command);
      const fileContent = await this.streamToString(s3Response.Body);

      const localFinalFile = `${localPathFile}${localFileName}`;

      //fs.writeFileSync(localFinalFile, fileContent);
      await fs.promises.writeFile(localFinalFile, fileContent);

      console.log(`File ${localFinalFile} downloaded.`);

      return localFinalFile;

    } catch (error) {

      console.error(`Error at download ${remotePathFile}/${remoteFileName}:`, error);

      throw error;
    }
  }
}
