const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

//loadTemplate("b-01")
console.log("updateProjectDocumentCompleteCount");

function updateDocumentsComplete(pid){
  console.log("updateDocumentsComplete", pid);

  let documentsTotal = 0;
  let documentsComplete = 0;

  const collectionsRef = admin.firestore().collection("projects").doc(pid).collection('collections');
  const allCollections = collectionsRef.get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      //console.log(doc.id, '=>', doc.data());
      documentsTotal += doc.data().document_count;
      documentsComplete += doc.data().complete_count;

    });
    return {total:documentsTotal, complete:documentsComplete};
  }).then(status => {
    console.log("documentsCompleteStatus:", status);
    return updateCompleteCount(pid, status);
  }).catch(err => {
    console.log('Error getting documents', err);
  });
}

function updateCompleteCount(pid, status){
  console.log("updateCompleteCount", pid, status);
  const obj = {
    complete_count:status.complete,
    document_count:status.total,
  }
  const projectRef = admin.firestore().collection("projects").doc(pid);
  projectRef.update(obj, {merge:true})
  .then(result => {
    console.log("result", result);
    return result;
  }).catch(err => {
    return false;
    console.log('Error in updateCompleteCount', pid, count, err);
  });
}

//updateDocumentsComplete('begravelsesprotokol-aarhus-1916-1921');
//updateDocumentsComplete('doedsattester-aarhus-andre');
//updateDocumentsComplete('doedsattester-aarhus-b');
//updateDocumentsComplete('doedsattester-test');
//updateDocumentsComplete('skattemandtalslister-test');
