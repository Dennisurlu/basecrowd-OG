console.log("this document is no longer in use.");
console.log("Use readJsonCollectionsUploadImagesAddDataToFirestore instead");

/*
const UUID = require("uuid-v4");
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const chunk = require('chunk')
var fs = require('fs');
var path = require('path');
var storage = require('@google-cloud/storage');
//var fileType = require('file-type');
var mime = require('mime-types')

const cors = require('cors')({
    origin: true,
});


admin.initializeApp(functions.config().firebase);

const APP_ID = "den-spanske-syge";

var gcs = storage({
    projectId: APP_ID,
    keyFilename: 'secrets/service_acount_key.json'
  });



//var targetDir = "C:/Users/krist/Desktop/SDU mat/2/";

const bucket = gcs.bucket(APP_ID + '.appspot.com');
const projectId = "doedsattester_aarhus";
const projectRef = admin.firestore().collection("projects").doc(projectId);

//const collectionName = "kasse_265_aarhus_antslgk_1916"
//const sourceDir = "Z:/projects/Den Spanske Syge/04 - råmateriale/doedsattester/1_kasse_265_aarhus_antslgk_1916";
//const collectionName = "kasse_fra_fyn"
//const sourceDir = "C:/Users/krist/Desktop/SDU mat/kasse_fra_fyn";
const collectionName = "Aarhus_kasse2_omegn"
const sourceDir = "Z:/projects/Den Spanske Syge/04 - råmateriale/doedsattester/Aarhus_kasse2_omegn";

// 1 UPLOAD IMAGES
uploadFilesInFolder(sourceDir, bucket, projectId, collectionName);

// 2 IMPORT DATA
//const imageData = require("./sdu/data/images.json");
//const imageData = require("C:/Users/krist/Desktop/SDU mat/json/B_Aarhus_omegn_smaller.json");

const imageData = require("C:/Users/krist/Desktop/SDU mat/json/B_Aarhus_omegn.json");
//saveAllImageDataToFirestore(imageData);


function uploadFilesInFolder(sourceFolder, bucket, projectId, collectionId){

  let collectionRef;
  let uploadCount = 0;
  console.log("0 CREATE COLLECTION");
  createCollection(projectRef, collectionId)
  .then((ref) => {
    console.log("1 COLLECTION CREATED");
    collectionRef = ref;
    return true
  }).then(()=>{
    console.log("2 READ FILES");
    const filesPromise = getFilesInDir(sourceFolder);
    return filesPromise.then((files)=>{
      return files;
    }).catch((error) => {
      console.log("error getting files", error);
    })
  }).then((allFiles)=>{
    console.log("3 FILES READ COUNT: ", allFiles.length);
    const files = allFiles.concat();
    //const files = allFiles.splice(0,2)

    const promises = [];
    const targetFolderName = projectId + "/" + collectionName;

    let final = [];
    return files.reduce((promise, file) => {
        return promise
          .then((result) => {
            return uploadFileToStorage(file, bucket, targetFolderName)
            .then((filePath) => {
              const fileName = filePath.substring(filePath.lastIndexOf('/')+1 );
              const fileId = fileName.substring(0, fileName.lastIndexOf('.') );
              return saveDownloadUrl(filePath, fileId, collectionRef ).then((saved) => {
                console.log("     FILE UPLOADED AND REFERENCE SAVED", filePath);
                uploadCount++;
                final.push(filePath);
                return true;
              });
            })
          }).catch((error) => {
          console.log("SOMETHING FAILED", error);
        })
      }, Promise.resolve());

  }).then((result)=>{
    console.log("4 getCollectionDocumentCount");
    return getCollectionDocumentCount(collectionRef)
    .then((count) => {
      console.log("count", count);
      return updateFirestoreDocument({document_count:count}, collectionRef)
    })
  }).then((result)=>{
    console.log("COLLECTION COUNT READ AND SAVED");
    return true;
  }).catch((error) => {
    console.log("SOMETHING FAILED", error);
    return error;
  })

}

function getCollectionDocumentCount(colRef){
  return colRef.collection('documents')
    .get()
    .then((querySnapshot) => {
      return querySnapshot.size;
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
}





function createCollection(projectRef, collectionId){
  //const path = "projects/" + projectId + "/collections/" + collectionId;
  const collectionRef = admin.firestore().collection("projects").doc(projectId).collection('collections').doc(collectionId);
  return collectionRef
  .set({}, {merge:true})
  .then(snap => { //console.log("Collections created on project.", projectId, collectionId);
    return collectionRef;
  }).catch(reason => { //console.log("Error creating collection on project", reason);
    return false;
  })
}


function getFilesInDir(dir) {
  const arr = [];

  return new Promise((resolve, reject) =>  {
    fs.readdir( dir, ( err, files ) => {
    if( err ) {
      console.error( "  Could not list the directory.", err );
      process.exit( 1 );
    }
      files.forEach(( file, index ) => {
        const fileMime = mime.lookup(file);
        if(fileMime) {
          const type = fileMime.substring(0, fileMime.indexOf('/'));
          if(type === "image"){
            arr.push(dir + "/" + file)
          } else {
            console.log(" Not image dont upload ", file);
          }

        } else {
            console.log(" Not image dont upload ", file);
        }
      });
      resolve(arr);
    });
  });
}



function uploadFileToStorage(sourcePath, bucket, destination){
  //console.log(" uploadFile.destination", destination);
  const fileName = path.basename(sourcePath)
  let uuid = UUID();
  const dest = destination + "/" + fileName;
  return bucket.upload(sourcePath, {
    destination: dest,
    uploadType: "media",
    metadata: {
      contentType: 'image/jpeg',
      metadata: {
        firebaseStorageDownloadTokens: uuid
      }
    }
  }).then((data) => {
      let file = data[0];
      return file.name;
    }).catch((error) => {
      console.error("Error saving", error);
      return error;
    });
}


const saveDownloadUrl = ((url, fileId, collectionRef) => {
  //console.log("saveDownloadUrl");
  //console.log("url:", url);
  //console.log("fileId:", fileId);

  const docRef = collectionRef.collection('documents').doc(fileId)

  const data = {
    filePath:url,
    collectionName:collectionName
  }
  return updateFirestoreDocument(data, docRef);

});


function saveAllImageDataToFirestore(images){

  // create collections if it doesn't exist

  let collectionRef;
  let uploadCount = 0;
  console.log("saveAllImageDataToFirestore", images.length);



  // looop through images
  let count = images.length;
  //count = 10;

  const allPromises = [];


  for (var i = 0; i < count; i++) {
    const processed = images[i].processed;

    if(images[i].processed === true){
        const imageData = getImageData(images[i]);
        const doc_id = imageData.image_id;
        const collectionId = imageData.delivery_tag;

        allPromises.push(new Promise((resolve, reject)=>{
            var batch = admin.firestore().batch();
            const collectionRef = admin.firestore().collection("projects").doc(projectId).collection('collections').doc(collectionId);
            batch.set(collectionRef, {}, {merge:true});
            const docRef = collectionRef.collection('documents').doc(doc_id);
            batch.set(docRef, imageData, {merge:true})
            return batch.commit().then((result) => {
                console.log("DOCUMENT UPDATED");
                setTimeout(() => {
                   console.log("  timeout");
                   resolve();
               }, 100);

                //return true;
            }).catch(error => {
                console.log("ERROR", error);
                reject();
                //return false;

            });
        }));


    } else {
      console.warn("processed === false", images[i].image_id);
    }
  }

  Promise.all(allPromises)
  .then((result)=>{
    console.log("all resolved");
  }).catch((error)=>{
    console.error("ERROR", error);
  })

  console.log("COMMITING BATCH ... hang on ");
  //console.log(batch);

}




function getImageData(imageData, collectionRef, collectionName){
  const { image_id, regions, processed, transform, inverse_transform, shape } = imageData;
  const transformObj = getTransformObject(transform);
  const regionsObj = getRegionsObject(regions);
  const image_id_no_ext = image_id.substring(0, image_id.lastIndexOf('.'));

  const docData = {
    template_id:imageData.document_type.classification,
    delivery_tag:imageData.delivery_tag,
    image_id:image_id_no_ext,
    transform: transformObj,
    processed:processed,
    shape:shape,
    regions:regionsObj,
  };

  return docData;


}

function updateFirestoreDocument(data, docRef){
  return docRef.set(data, { merge: true }).then(() => {
    return true;
  }).catch(error => {
    console.log("ERROR", error);
  });
}



function getRegionsObject(regions) {
  const obj = {};
  for (var key in regions) {
    const arrPoints = regions[key];
    const points = {}
    for (var i = 0; i < arrPoints.length; i++) {
      points[i] = arrPoints[i];
    }
    obj[key] = points;
  }
  return obj;
}

function getTransformObject(transform) {
  const matrix = {}
  for (var i = 0; i < transform.matrix.length; i++) {
    matrix[i] = transform.matrix[i];
  }

  const transformObj = {
    scale: transform.scale,
    translation: transform.translation,
    rotation: transform.rotation,
    matrix:matrix,
  }
  return transformObj;
}

*/
