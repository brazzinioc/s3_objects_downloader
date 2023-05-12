
import File from './classes/File.js';

const remotePathFile = '';
const localPathFileDestination = '/tmp/';
const filesName = ["archivo1.txt", "archivo2.txt", "archivo3.txt", "archivo4.txt"];

async function index() {

  console.time('download_time');

  try {

    const filesToDownload = filesName.map( filename => new File(filename, localPathFileDestination, filename, remotePathFile));

    if (filesToDownload.length === 0) {
      console.log('Files to download doesn\'t exist');
    }

    console.log('Files de download');
    console.log(filesToDownload);

    console.log('..........................');

    const downloadPromises = filesToDownload.map( async fileToDownload => await fileToDownload.downloadFromS3());
    console.log(downloadPromises);

    const downloadResult = await Promise.all(downloadPromises);

    console.log('----- download downloadResult -------');
    console.log(downloadResult);

  } catch (e) {

    console.log('Error: ', e);

  }

  console.timeEnd('download_time');

}

index();


