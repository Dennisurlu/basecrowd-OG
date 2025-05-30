console.log("THIS FUNCTIONALITITY IS MOVED TO readJsonCollectionsUploadImagesAddDataToFirestore ...");
/*
const functions = require('firebase-functions');
const admin = require('firebase-admin');

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


//
//
//
//
//
function initDocumentDefaults(projectid, collectionid){
  // loop igennem alle dokumenter
  // opret fields+status til alle dokumenter

  let documents = {};

  const documentsRef = admin.firestore().collection('projects').doc(projectid).collection('collections').doc(collectionid).collection('documents');
  const pr1 = loadDocuments(documentsRef);

  pr1.then(documents => {
    const fieldsPromiseList = [];
    console.log("LOADED", documents.length);
    for (var i = 0; i < documents.length; i++) {
      const doc = documents[i].data();
      const key = documents[i].id;
      const regions = doc.regions;
      //console.log(doc);
      // new / update props
      let fieldsComplete = doc.fieldsComplete ? doc.fieldsComplete : {};
      let userComplete = doc.userComplete ? doc.userComplete : {};
      for (var fieldId in regions) {
        if (!fieldsComplete.hasOwnProperty(fieldId)) {
            fieldsComplete[fieldId] = false;
        }
      }
      const docRef = documentsRef.doc(key);
      const fieldPromise = saveCompletedFields(docRef, fieldsComplete, userComplete);
      fieldsPromiseList.push(fieldPromise);
    }

    return Promise.all(fieldsPromiseList).then(() => {
      console.log(" fieldsPromiseList fieldsPromiseList fieldsPromiseList fieldsPromiseList ");
      return Promise.all([])
    });

  }).catch((error) => {
    console.error("Error", error);
    return false;
  });


}


function loadDocuments (documentsRef) {
  const documentObjects = [];
  return documentsRef.get().then(querySnapshot => {
      querySnapshot.forEach(document => {
        documentObjects.push(document);
      });
      return documentObjects;
  })
}

function saveCompletedFields(docRef, fieldsComplete, userComplete) {
  return docRef.set({fieldsComplete:fieldsComplete, userComplete:userComplete}, { merge: true })
  .then((obj) => {
      console.log("Document successfully written!");
      return true;
  })
  .catch((error) => {
      console.error("Error writing document: ", error);
  });
}


const projectid = "doedsattester-aarhus-b";
const collectionid = "kasse_fra_fyn"
initDocumentDefaults(projectid, collectionid);
*/
