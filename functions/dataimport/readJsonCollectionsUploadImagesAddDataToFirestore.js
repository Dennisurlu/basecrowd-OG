const admin = require('firebase-admin');
var path = require('path');
var storage = require('@google-cloud/storage');
const Firestore = require('@google-cloud/firestore');
var mime = require('mime-types')
const UUID = require("uuid-v4");
var fs = require('fs-then');


const APP_ID = "den-spanske-syge";
const keyPath = '../secrets/service_acount_key.json';

const firestore = new Firestore();
const settings = {
  projectId: APP_ID,
  keyFilename: keyPath,
  timestampsInSnapshots: true
};
firestore.settings(settings);



const keyPathStorage = './secrets/service_acount_key.json';
var gcs = storage({
    projectId: APP_ID,
    keyFilename: keyPathStorage
  });

const bucket = gcs.bucket(APP_ID + '.appspot.com');
var serviceAccount = require(keyPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

/*
// BEGRAVELSESPROTOKOLLER
const projectId = "begravelsesprotokol-aarhus-1916-1921";
const collectionName = '16-0500_DK-82_Death-Records-4-1-Jan-1915-31-Dec-1916';
const jsonPath = './../sdu/data/DeathRecords/DeathRecords_v2.json';
const imageFolder = "Z:/projects/den_spanske_syge/04-materiale/Begravelsesprotokol/" + collectionName
*/


//const projectId = "doedsattester-aarhus-b";
//const projectId = "doedsattester-aarhus-andre";
//const projectId = "skattemandtalslister-test";

// TEST KASSER
/*
const projectId = "doedsattester-test";
const collectionName = 'Aarhus_kasse6_omegn';
const jsonPath = './../sdu/data/DeathCertificatesAarhus/'+collectionName +'.json';
const imageFolder = "Z:/projects/den_spanske_syge/04-materiale/doedsattester/" + collectionName + "/converted";
*/

// TEST KASSER
const projectId = "skattemandtalslister-aarhus-1918";

//const collectionName = '16-0500_DK-82_Municipal-Censuses-1243-Jan-Dec-1918';

var folderNames = [];
folderNames.push('16-0500_DK-82_Municipal-Censuses-1243-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1244-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1245-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1246-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1247-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1248-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1249-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1250-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1251-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1252-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1253-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1254-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1255-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1256-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1257-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1258-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1259-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1260-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1261-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1262-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1263-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1264-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1265-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1266-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1267-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1268-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1269-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1270-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1271-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1272-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1273-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1274-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1275-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1276-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1277-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1278-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1279-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1280-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1281-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1282-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1283-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1284-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1285-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1286-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1287-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1288-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1289-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1290-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1291-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1292-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1293-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1294-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1295-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1296-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1297-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1298-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1299-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1300-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1301-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1302-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1303-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1304-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1305-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1306-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1307-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1308-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1309-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1310-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1311-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1312-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1313-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1314-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1315-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1316-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1317-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1318-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1319-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1320-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1321-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1322-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1323-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1324-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1325-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1326-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1327-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1328-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1329-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1330-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1331-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1332-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1333-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1334-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1335-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1336-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1337-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1338-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1339-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1340-Jan-Dec-1918');
folderNames.push('16-0500_DK-82_Municipal-Censuses-1341-Jan-Dec-1918');


const projectRef = admin.firestore().collection("projects").doc(projectId);



//data = data.splice(0,2);    //MINDRE DATASÆT

let imageFolder;
let createCount;

function uploadAllInArray(arr){
  console.log("uploadAllInArray", arr.length);
  if(arr.length > 0) {
    createCount = 0;
    let collectionName = arr.shift();
    const jsonPath = './../sdu/data/skattemandtalslister/'+collectionName +'.json';
    //const imageFolder = "Z:/projects/den_spanske_syge/Aarhus 1918 - Skattemandtalslister/" + collectionName + "/converted";
    imageFolder = "Z:/projects/den_spanske_syge/04-materiale/Aarhus 1918 - Skattemandtalslister/" + collectionName;
    let data = require(jsonPath);

    return uploadCollectionDataFunction(data, projectRef, collectionName, createCount)
    .then(result => {
      console.log("SUCCESS SUCCESS SUCCESS");
      console.log("SUCCESS SUCCESS SUCCESS");
      console.log("SUCCESS SUCCESS SUCCESS");
      uploadAllInArray(arr);
    }).catch(error => {
      console.log("uploadAllInArray error");
      console.error(error);
    });
  }
}


uploadAllInArray(folderNames);

//uploadCollectionDataFunction(data, projectRef, collectionName);


function uploadCollectionDataFunction(data, projectRef, collectionName, createCount){
  console.log("uploadCollectionDataFunction");
  return uploadCollectionData(data, projectRef, collectionName, createCount)
  .then(result => {
    return updateDocumentCountOnProject(projectRef)
    .then(result => {
      return result;
    })
  }).then(result => {
    console.log("uploadCollectionDataFunction", result);
  }).catch(error => {
    console.log("ERROR");
    console.error(error);
  });

}





function updateDocumentCountOnProject(projectRef){
  console.log("updateDocumentCountOnProject");
  let document_count = 0;
  let complete_count = 0;
  return projectRef.collection('collections')
  .get()
  .then(snapshot => {
    console.log("snapshot .size", snapshot .size);
    snapshot.forEach(doc => {
      document_count += doc.data().document_count;
      complete_count += doc.data().complete_count;
      console.log(doc.id, '=>', doc.data().document_count, doc.data().complete_count);
    });
    console.log("document_count", document_count);
    console.log("complete_count", complete_count);
    const obj = {
      document_count:document_count,
      complete_count:complete_count,
      complete:document_count === complete_count
    }
    return updateFirestoreDocument(obj, projectRef)
    .then(result => {
      console.log("PROJECT UPDATED", obj);
      return result;
    })
  }).catch(error => {
    console.log("ERROR");
    console.error(error);
  })
}

function uploadImageAndUpdateData(images, collectionRef, collectionName, numCreated){

  if(images.length === 0){
    console.log("uploadImageAndUpdateData:  ALL DONE", numCreated);
    return setCollectionCountAndUserStatus(collectionRef, numCreated);
  } else {
    console.log("uploadImageAndUpdateData:  ",numCreated, "CREATED - TO GO", images.length);
    const nextData = images.shift();

    return uploadImageAndSaveData(nextData, collectionName, collectionRef)
    .then((filePath)=>{
        //console.log("image uploaded", filePath);
        const imageData = getImageData(nextData);


        const doc_id = imageData.image_id;
        //const collectionId = imageData.delivery_tag;
        const collectionId = imageData.delivery_tag;
        imageData.filePath = filePath;
        // load the documents in case it already exists
        return collectionRef.collection('documents').doc(doc_id).get()
            .then(doc => {
              if (!doc.exists) {
                console.log("Document", doc_id, "didn't exist");
                return null
              } else {
                //console.log('Document data:', doc.data());
                return doc.data()
              }
            }).then((existingDoc)=>{

              /*
              console.log("loop igennem imageData.regions");
              console.log("hvis ikke den findes i existingDoc -> op/ret [key]:false");
              console.log("imageData.regions");
              console.log(imageData.regions);
              console.log("existingDoc.fieldsComplete");
              console.log(existingDoc.fieldsComplete);
              */

              const keys = Object.keys(imageData.regions);
              console.log("keys", keys.length);

              var i;
              if(existingDoc){

                for (i = 0; i < keys.length; i++) {
                  //console.log(i, "existingDoc.fieldsComplete[keys[i]]", existingDoc.fieldsComplete[keys[i]]);
                  // key didnt exist

                  if(existingDoc.fieldsComplete[keys[i]] === undefined){
                    // create complete: false
                    existingDoc.fieldsComplete[keys[i]] = false;
                  }
                }
              }



              let fieldsComplete = (existingDoc && existingDoc.fieldsComplete) ? existingDoc.fieldsComplete : {};
              let userComplete = (existingDoc && existingDoc.userComplete ) ? existingDoc.userComplete : {};
              let complete = (existingDoc && existingDoc.complete ) ? existingDoc.complete : false;
              //
              let currently_transcribing_count_by_timestamp = (existingDoc && existingDoc.currently_transcribing_count_by_timestamp ) ? existingDoc.currently_transcribing_count_by_timestamp : 0;
              let currently_transcribing_timestamp = (existingDoc && existingDoc.currently_transcribing_timestamp ) ? existingDoc.currently_transcribing_timestamp : {};
              let currently_transcribing_blocked = (existingDoc && existingDoc.currently_transcribing_blocked ) ? existingDoc.currently_transcribing_blocked : false;

              const { regions } = imageData;
              for (var fieldId in regions) {
                if (!fieldsComplete.hasOwnProperty(fieldId)) {
                    fieldsComplete[fieldId] = false;
                }
              }
              imageData.fieldsComplete = fieldsComplete;
              imageData.userComplete = userComplete;
              //imageData.numUsers = Object.keys(userComplete).length;
              imageData.index = numCreated;
              imageData.complete = complete;
              imageData.currently_transcribing_count_by_timestamp = currently_transcribing_count_by_timestamp;
              imageData.currently_transcribing_timestamp = currently_transcribing_timestamp;
              imageData.currently_transcribing_blocked = currently_transcribing_blocked;

              return imageData;
            }).then((imageData)=>{
              console.log("imageData FAIL????");
              console.log(imageData);

                return collectionRef.collection('documents').doc(doc_id)
                .set(imageData, {merge:true})
                .then(() => {
                  //console.log("IMAGE DATA SAVED");
                  numCreated++;
                  return uploadImageAndUpdateData(images, collectionRef, collectionName, numCreated);
                }).catch((err)=>{
                  console.error(err);
                  return err;
                })
            })
            .catch(err => {
              console.log('Error getting document', err);
            });

      })

  }

}


function setCollectionCountAndUserStatus(collectionRef, count){

  // læs collection
  return collectionRef.get()
  .then(existingDoc => {
    let doc = {}
    if (!existingDoc.exists) {
      console.log("Document", doc_id, "didn't exist");
      return null
    } else {
      doc = existingDoc.data();
      let complete = (doc && doc.complete ) ? doc.complete : false;
      let complete_count = (doc && doc.complete_count ) ? doc.complete_count : 0;
      let released_for_transcription = (doc && doc.released_for_transcription ) ? doc.released_for_transcription : true;
      let userComplete = (doc && doc.userComplete ) ? doc.userComplete : {};


      doc.complete = complete;
      doc.complete_count = complete_count;
      doc.document_count = count;
      doc.released_for_transcription = released_for_transcription;
      doc.userComplete = userComplete;
      //doc.numUsers = Object.keys(userComplete).length;

      console.log("AFTER");
      console.log(userComplete);
      return doc;

    }
  }).then((doc)=>{
    return updateFirestoreDocument(doc, collectionRef )
  }).then((result)=>{
      console.log("DOCUMENT COUNT SAVED", result);
      return true;
    }).catch((err)=>{
      console.error(err);
      return err;
    })

  // gem collection
  /*
  return updateFirestoreDocument({document_count:count}, collectionRef )
  .then((result)=>{
    console.log("DOCUMENT COUNT SAVED", result);
    return true;
  }).catch((err)=>{
    console.error(err);
    return err;
  })
  */
}


function uploadCollectionData(images, projectRef, collectionName, createCount){

  //console.log(images);
  // sorter efter image_id
  images.sort(dynamicSort('image_id'));

  // opret collection
  const collectionId = images[0].source.folder;

  //images = images.slice(0,2);

  return createCollection(projectRef, collectionId)
  .then(collectionRef => {
    console.log("COLLECTION CREATED ON PROJECT", projectId, collectionId);
    //loop igennem data
    return uploadImageAndUpdateData(images, collectionRef, collectionName, createCount);
  }).then(result => {
      console.log("ALL OK");
      return true;
  }).catch(reason => {
    console.log("Error creating collection on project", reason);
    return false;
  })

}


function uploadImageAndSaveData(data, collectionName, collectionRef){
  const imagePath = imageFolder + "/" + data.image_id;



  const targetFolderName = projectId + "/" + collectionName;

  return uploadFileToStorage(imagePath, bucket, targetFolderName)
      .then((filePath) => {
          const fileName = filePath.substring(filePath.lastIndexOf('/')+1 );
          const fileId = fileName.substring(0, fileName.lastIndexOf('.') );
          //console.log("file uploaded to storage", fileName, fileId);
          //console.log(filePath);
          return filePath
      }).catch(err => {
        console.error("########################## #");
        console.log(err);
        return err;
      })

}

function createCollection(projectRef, collectionId){
  //const path = "projects/" + projectId + "/collections/" + collectionId;
  const collectionRef = projectRef.collection('collections').doc(collectionId);
  return collectionRef
  .set({}, {merge:true})
  .then(snap => { //console.log("Collections created on project.", projectId, collectionId);
    return collectionRef;
  }).catch(reason => {
    console.log("Error creating collection on project", reason);
    return false;
  })
}


function updateFirestoreDocument(data, docRef){
  return docRef.set(data, { merge: true }).then(() => {
    return true;
  }).catch(error => {
    console.log("ERROR", error);
  });
}

function getImageData(imageData, collectionRef, collectionName){
  const { image_id, regions, processed, transform, inverse_transform, shape } = imageData;
  const transformObj = getTransformObject(transform);
  const inverse_transformObj = getTransformObject(inverse_transform);
  const regionsObj = getRegionsObject(regions);
  const image_id_no_ext = image_id.substring(0, image_id.lastIndexOf('.'));
  console.log(inverse_transformObj);
  const docData = {
    template_id:imageData.document_type.classification,
    delivery_tag:imageData.source.folder,
    image_id:image_id_no_ext,
    transform: transformObj,
    inverse_transform: inverse_transformObj,
    processed:processed,
    shape:shape,
    regions:regionsObj,
  };

  return docData;


}

function getTransformObject(transform) {
  const matrix = {}
  for (var i = 0; i < transform.matrix.length; i++) {
    matrix[i] = transform.matrix[i];
  }

  const transformObj = {
    //scale: transform.scale,
    //translation: transform.translation,
    //rotation: transform.rotation,
    matrix:matrix,
  }
  return transformObj;
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


function uploadFileToStorage(sourcePath, bucket, destination){
  //console.log(" uploadFile.destination", destination);
  console.log("uploadFileToStorage");
  console.log("sourcePath:", sourcePath);
  console.log("destination:", destination);
  const fileName = path.basename(sourcePath)
  let uuid = UUID();
  const dest = destination + "/" + fileName;

  var file = bucket.file(dest); //this exists!
  return new Promise((resolve, reject)=> {

    file.exists((err, exists) => {
      console.log("FILE ALREADY UPLOADED RETURN ", dest);
      if (err) {
       reject(err)
      } else if(exists){
        resolve(dest);
      } else {
        bucket.upload(sourcePath, {
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
            resolve(file.name);
            return file.name;
          }).catch((error) => {
            console.error("Error saving", error);
            reject(error);
            return error;
          });
      }
    });

  })




  /*
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
    */
}



function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
