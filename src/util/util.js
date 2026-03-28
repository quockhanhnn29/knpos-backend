require('dotenv').config()
const { createWriteStream, unlink } = require('fs')
const fs = require('fs')
const pathlib = require('path')
const shortid = require('shortid')
const mkdirp = require('mkdirp')
const nodemailer = require('nodemailer');
const axios = require("axios");
const cheerio = require("cheerio");
const lodash = require('lodash')

// Ensure upload directory exists.
mkdirp.sync(process.env.TEMP_DIR)
mkdirp.sync(process.env.UPLOAD_DIR)
mkdirp.sync(process.env.DOWNLOAD_DIR)

const storeUpload = async (upload, dir) => {
  var { createReadStream, filename, mimetype } = await upload
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  const stream = createReadStream()
  const id = shortid.generate()
  dir = dir != '' ? dir : process.env.TEMP_DIR
  filename = pathlib.parse(filename).name + '_' + Math.floor(Date.now() / 1000) + pathlib.parse(filename).ext;
  const path = dir == process.env.TEMP_DIR ? `${dir}/${id}-${filename}` : `${dir}/${filename}`
  const file = { id, filename, mimetype, path }

  // Store the file in the filesystem.
  await new Promise((resolve, reject) => {
    // Create a stream to which the upload will be written.
    const writeStream = createWriteStream(path)

    // When the upload is fully written, resolve the promise.
    writeStream.on('finish', resolve)

    // If there's an error writing the file, remove the partially written file
    // and reject the promise.
    writeStream.on('error', error => {
      unlink(path, () => {
        reject(error)
      })
    })

    // In node <= 13, errors are not automatically propagated between piped
    // streams. If there is an error receiving the upload, destroy the write
    // stream with the corresponding error.
    stream.on('error', error => writeStream.destroy(error))

    // Pipe the upload into the write stream.
    stream.pipe(writeStream)
  })

  return file
}

const saveBase64ToImage = (path, filename, base64Data, file_ext = 'png') => {
  let output = ''
  try {
    if (!fs.existsSync(path)){
      fs.mkdirSync(path);
    }
    if (file_ext == 'png') {
      base64Data = base64Data.replace(/^data:image\/png;base64,/, "");
    } else if (file_ext == 'jpg') {
      base64Data = base64Data.replace(/^data:image\/jpeg;base64,/, "");
    }
    base64Data += base64Data.replace('+', ' ');
    let binaryData = Buffer.from(base64Data, 'base64').toString('binary');

    fs.writeFileSync(pathlib.join(path, filename), binaryData, "binary");
  } catch (error) {
    console.log(error);
  }
  return output
} 

const storeDownload = async (csv, filename, mimetype, domain) => {
  const id = shortid.generate()
  const path = pathlib(domain, process.env.DOWNLOAD_DIR, `${id}-${filename}`)
  fs.writeFile(pathlib.join(process.env.DOWNLOAD_DIR, `${id}-${filename}`), csv, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
  })
  const file = { id, filename, mimetype, path }
  return file
}

const addToObject = function (obj, key, value, index) {
  var temp = {};
  var i = 0;

  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (i === index && key && value) {
        temp[key] = value;
      }
      temp[prop] = obj[prop];
      i++;
    }
  }
  if (!index && key && value) {
    temp[key] = value;
  }

  return temp;
};

const sendMail = function(email, subject, content) {
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'tuanvu09042017@gmail.com',
          pass: 'Tuantin@123'
      }
  });
  var mailOptions = {
      from: 'tuanvu09042017@gmail.com',
      to: email,
      subject: subject,
      html: content
  };

  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
  });
}

const fetchImageFromUrl = async (url, filename, path) => {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const filePath = pathlib.join(path, filename)
  fs.writeFile(filePath, response.data, (err) => {
    if (err) throw err;
    console.log('Image downloaded successfully!');
  });
  return filePath
}

const convertToVNTime = function (date, tzString = 'Asia/Bangkok') {
  return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}

const parseVNDate = (text) => {
  if (text && typeof text == 'string' && text.includes('/')) {
    const [day, month, year] = text.split("/");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  } else {
    return new Date(text)
  }
}

const ExcelDateToJSDate = (serial) => {
  let utc_days  = Math.floor(serial - 25569);
  let utc_value = utc_days * 86400;                                        
  let date_info = new Date(utc_value * 1000);
  return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
}

// Defines the type
module.exports = {
    isProduction: () => process.env.NODE_ENV === 'production',
    date_format: (format) => format === "short" ? "DD-MM-YYYY" : "DD-MM-YYYY HH:mm:ss",
    storeUpload: storeUpload,
    storeDownload: storeDownload,
    addToObject: addToObject,
    sendMail: sendMail,
    saveBase64ToImage: saveBase64ToImage,
    fetchImageFromUrl,
    convertToVNTime,
    parseVNDate,
    ExcelDateToJSDate
}