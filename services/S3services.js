const AWS = require("aws-sdk");

const uploadToS3=(data,filename)=>{
    //get credentials, login to AWS and upload the file.

const BUCKET_NAME = "fullstack-expensetracker";
const IAM_USER_KEY = process.env.IAM_USER_KEY;
const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

let s3bucket = new AWS.S3({
accessKeyId: IAM_USER_KEY,
secretAccessKey: IAM_USER_SECRET,
// bucket:  BUCKET_NAME
})

     //params Bucket, Key, Body as required by AWS S3
     const params = {                               
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
      }
  
  

      // return promise instead direct return as uploading is an asynchronous task
return new Promise((resolve, reject)=>{
  s3bucket.upload(params, async (err, s3response)=>{
    try{
      if(err) {
        console.log("Error uploading file", err);
        reject(err);
      }else{
        console.log('File uploaded successfully', s3response)
        resolve(s3response.Location);
      }
    }catch(err){
      console.log("Waiting to login in AWS for upload", err)
    }

  })
})
}


module.exports ={
    uploadToS3
}
