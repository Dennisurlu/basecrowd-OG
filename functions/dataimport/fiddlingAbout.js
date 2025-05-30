const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

function createUserOnDocument(pid, cid, did, uid){
  console.log("createUserOnDocument");
  const docRef = admin.firestore().collection("projects").doc(pid).collection('collections').doc(cid).collection('documents').doc(did);

  const obj = {
    userComplete:{
      [uid]:false
    }
  }

  docRef.set(obj, {merge:true})
  .then(result => {
    console.log("result", result);
  })
}

createUserOnDocument('doedsattester-test', 'Aarhus_kasse6_omegn', '8011330211-00044', 'bCG8rH9YcEXO4AQeklfTRokw2512');
//updateDocumentsComplete('begravelsesprotokol-aarhus-1916-1921');
//updateDocumentsComplete('doedsattester-aarhus-andre');
//updateDocumentsComplete('doedsattester-aarhus-b');
//updateDocumentsComplete('doedsattester-test');
//updateDocumentsComplete('skattemandtalslister-test');
