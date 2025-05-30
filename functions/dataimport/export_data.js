/*
const admin = require('firebase-admin');
const functions = require('firebase-functions');
var path = require('path');
var storage = require('@google-cloud/storage');
var mime = require('mime-types')
const UUID = require("uuid-v4");
var fs = require('fs-then');
var fileSystem = require("fs");

const APP_ID = "den-spanske-syge";

var gcs = storage({
    projectId: APP_ID,
    keyFilename: './secrets/service_acount_key.json'
  });

const bucket = gcs.bucket(APP_ID + '.appspot.com');

let defaultAppConfig = {
    credential: admin.credential.cert(
      {
        "type": "service_account",
        "project_id": "den-spanske-syge",
        "private_key_id": "c4e05829cc696804ed82aeb0daf4a82a131691af",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCwIBgKd8VtpStV\nf5p67Qv+qYt/90pbeRAVkftBUB1evlWoiph4dhrEOkorytOUgnBgIEJEWvmLy0sv\nly6TwRYgUWgzm2gD+MhPi/TbS4xC0anFzzrKxlEmCHzhW/hJWHoV8XF9w9XW+vSU\nj8TUIzf0X+SzyShYPsIOru5XwEDJlXvLhC4LpXaDVdHNa3bF00i1Z3f8ncULPYca\ntPTwwcXqBUr0paIO9hAf3DnbjR3yhSwnBaXYizAVpq0/ys9S8VpEEcmQtpTOzzeO\nGvYNRvlLN8IaCUWeac3dry/zpELW0tmsAUEqskUYWS9HV+EUYZUb6Uq2xlj6iUd8\nm4MRd5ThAgMBAAECggEABUTIg1Om58tHmxSooeHCeJlIz4itxEPAW+zUh9UmM8Xc\n2SBgREZAMbuOqXW1U519UBrW8KWKDokD1EYhAhGGIGxfAiA1gdzo3RxSNFczuHH+\nMqkq2JMLLWiWl8VBDaykZlClNP5tQLOcKm+Mk04EZ/6QYGJ1nwItmvPXtG9PYNhX\nllZRWBbCs4ALCtz2CyiPdOsd/NlqRuLv1IHmSjMqN5Yx48tktsy/jNlt+7oSbmtV\n1zG0qlmfWl2qYcUXk3BHBYFA1SqtzVlykSXwb4RCMXOFylkW/XbySABiGjWdvIVS\ntm/4iUnF/gsI9NrH9nDWi1vrUWisAWvlvysyXcnwGQKBgQD2KW8WfNZ7mbmFUiXz\n804QkcszEUqDCZ/uS6djNdkUDESnI7Fot/IU6u0/n7orpdQAbRzBTBG7DaTJRxT6\ny6Mr0bVBPJu6W5OFLaDg3r7xy1y0Pge+zyqNPlUmkV1iM3+EcLSzaJyN3zaGDcHW\n7GBDJLw5w1FqfS7ufaJ9C4c3/QKBgQC3Khe+xr93+R4WsfvPt7z2Ilw7hZ3uuQ0V\nQf9ti/jET27V1E/jp6coxB2uaYT4X2U0iVQNFhEp0b/ZusEDy0p3E7icpN3PzeM9\nj77jC5N+KxTvMLO5ApKpBvHSM8MhYyNhRrNjWfkVEW+SdA3vW85ECHuFYnM+yJQ8\nyER+WoOrtQKBgBJ+snYCEyteNW4q6ecWVLsx+Q5xMiP+SSHiVUVC+nhjI5VbPS0d\nBPdFX2X0XkyBPRh7Gjn7uSlQsRzeVlkxi6TzMKciIqEx2DedYgUDN117Zg+0yWgw\nsIXENSmcqmOCcwZEYY9JQNn392TDC9lWETV6QRol7qwNk8Ufc2Hpx9MRAoGASV9e\nRbj+CERN7k98DPiQhJS9F8btvix49jQK60ov7AvZ3WSAYDTPvH/bV/vDHW+xbfs5\nJUjatULltIWgPjHYcZz/zhgpFs5mIkoL8I25lsgRScPbqthCAd3bTxYXK6+4A4a7\n46euJOdoJ2XAE0tWdGBlgsguXE8jOroK3gbKSiUCgYBg7AV6Jg0eDmZ/MhrjDAek\nJN5PNYwioGfJhc/LfTF3eNBPBUHP/Q78cth3Y/HLGq33cQb/S14iXbgBNgQH7b+c\nuKY60//QCIxLe1MdYxkjMv+SvFp5MZyA5NwXEmagQoLsiUkB/bA7KNPN7cW9GLcp\nOeRt+fJZU3Uw67lEUhvmxg==\n-----END PRIVATE KEY-----\n",
        "client_email": "den-spanske-syge@appspot.gserviceaccount.com",
        "client_id": "110762062408665996876",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://accounts.google.com/o/oauth2/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/den-spanske-syge%40appspot.gserviceaccount.com"
      }
),
    databaseURL: 'https://projectxxx.firebaseio.com/'
}

admin.initializeApp(defaultAppConfig);



const projectId = "doedsattester-aarhus-b";
const projectRef = admin.firestore().collection("projects").doc(projectId);
//const collectionName = 'kasse_test';
const collectionName = 'Aarhus_kasse1_omegn';

//const jsonPath = './../sdu/data/'+collectionName +'.json';
//let data = require(jsonPath);
//data = data.splice(0,2);    //MINDRE DATASÆT

//const ref = projectRef.collection(collectionName);
const ref = admin.firestore().collection("/projects/doedsattester-aarhus-b/collections/" + collectionName + "/documents");

getDocumentObjs(ref)
.then(documentObjs => {
  console.log("documentObjs.length", documentObjs.length);

  var promises = documentObjs.map((ref) => {
      return loadDocumentsFieldObjs(ref);
  });
  return Promise.all(promises)

}).then((result) => {
  console.log("QQQQQQQQQQQQQQQQQQQQQ");
  console.log(JSON.stringify(result));
    //console.log("COMPLETE", fieldStatus, complete);
    //return true;
    //}).then((complete)=>{
    saveFile(collectionName, JSON.stringify(result));

})

function saveFile(collectionName, fileContent){
  fileSystem.writeFile("./export_" + collectionName + ".txt", fileContent, (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log("File has been created");
});

}




function loadDocumentsFieldObjs(doc){
  console.log("loadDocumentsFieldObjs");
  const ref = doc.ref.collection("fieldstatus")
  const fieldStatusObjs = [];
  return ref.get()
  .then((querySnapshot) => {
      querySnapshot.forEach((fs) => {
          //console.log("************************");
          //console.log(doc.id, " => ", doc.data());
          //console.log(doc.ref);
          fieldStatusObjs.push({documentId:doc.id, id:fs.id, ref:fs.ref});
      });
      return fieldStatusObjs;
  }).then(fieldStatuss => {
    var promises = fieldStatuss.map((obj) => {
        return loadFieldStatus(obj);
    });
    return Promise.all(promises)
  }).then(promises => {
    //console.log("PS", doc.id);
    //console.log(promises);
    const obj = {
      documentId:doc.id,
      fields:promises
    }
    return obj;
  })
  .catch(function(error) {
      console.log("Error getting documents: ", error);
  })

}


function loadFieldStatus(obj){
  return obj.ref.get()
  .then(result => {
    //console.log("#¤#¤#¤#¤#¤#¤#¤#¤#¤#¤#¤#¤#¤#¤#¤#¤#¤#¤#¤#¤#¤#");

    const data = result.data();

    const keys = Object.keys(data.userValues);
    const values = [];
    for (var i = 0; i < keys.length; i++) {
      const val = data.userValues[keys[i]];
      //console.log(i, "val", val);
      values.push(val);
    }

    //console.log("values", values);

    const field = {
      //doc_id:obj.documentId,
      field_id:result.id,
      empty:data.empty,
      unreadable:data.unreadable,
      maxSimilarity:data.maxSimilarity,
      values:values,
      numUsers:Object.keys(data.userComplete).length
    }

    //console.log(field);

    return field;


  })
}

function getDocumentObjs(ref){
    const documentObjs = [];
    return ref.get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots

            //console.log("************************");
            //console.log(doc.id, " => ", doc.data());
            //console.log(doc.id);
            //console.log(doc.ref);

            documentObjs.push({ref:doc.ref, id:doc.id});
        });
        return documentObjs;
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    })
}
*/
