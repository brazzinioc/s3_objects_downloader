import S3 from './S3.js';

export default class File extends S3{
  #localFileName;
  #localPathFile;
  #remoteFileName;
  #remotePathFile;
  #size;

  constructor(localFileName, localPathFile, remoteFileName, remotePathFile) {

    super();

    this.#localFileName = localFileName;
    this.#localPathFile = localPathFile;
    this.#remoteFileName = remoteFileName;
    this.#remotePathFile = remotePathFile;

  }

  async downloadFromS3() {
    await this.downloadObject(this.#remoteFileName, this.#remotePathFile, this.#localFileName, this.#localPathFile)
  }
}
