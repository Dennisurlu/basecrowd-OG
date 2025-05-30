import firebase from 'firebase/app';
import 'firebase/functions';

//const SequentialPromisesChain = require('sequential-promises-chain')
import SequentialPromisesChain from 'sequential-promises-chain';

let currentPath = null;

const chunk = (arr, chunkSize, cache = []) => {
  console.log("chunk", arr.length, chunkSize, cache.length);
  const tmp = [...arr]
  while (tmp.length) cache.push(tmp.splice(0, chunkSize))
  return cache
}


export function updateCompleteCount(projectid){
    const db = firebase.firestore();
    const projectRef = db.collection('projects').doc(projectid);
    const collectionsRef = projectRef.collection('collections');

    ////////////////////////////////
    const collections = [];
    let totalCompleteDocuments = 0;

    return collectionsRef.get()
    .then(collectionsSnapshot => {
      console.log("COLLECTIONS LOADED");
      const promises = [];
      collectionsSnapshot.forEach(collection => {
        //console.log("***", collection.id, collection.ref);
        const documentsRef = collection.ref.collection('documents');
        collections.push(collection);
        promises.push(documentsRef.where("complete", "==", true).get());
      })
      return Promise.all(promises);

    }).then(promises => {

      const batch = db.batch();

      for (var i = 0; i < promises.length; i++) {
        console.log("collections[i]", collections[i].id, collections[i].data().complete_count);
        const collectionData = collections[i].data()
        const projectCompleteCount = collectionData.complete_count ? collectionData.complete_count : 0;
        console.log(i, promises[i].docs.length);
        const documentsCompleteCount = promises[i].docs.length;
        totalCompleteDocuments+=documentsCompleteCount;

        if(projectCompleteCount !== documentsCompleteCount){
          console.log("OUT OF SYNC -> UPDATE");
          const updateObj = {
            complete_count:documentsCompleteCount,

          }
          if(collectionData.complete_count >= collectionData.document_count){
            updateObj.complete = true;
          }

          batch.set(collections[i].ref,  updateObj, {merge:true});
        }
      }


      return batch.commit()
      .then(result => {
        // UPDATE PROJECT
        console.log("totalCompleteDocuments", totalCompleteDocuments);
        return db.runTransaction((transaction) => {
            return transaction.get(projectRef).then((projectDoc) => {
              console.log("PROJECT LOADED", );
              const data = projectDoc.data();
              const doc_count = data.document_count;
              const updateObj = {
                complete_count:totalCompleteDocuments,
                complete:totalCompleteDocuments >= doc_count
              }
              console.log("Updating project", updateObj);
              transaction.set(projectRef, updateObj, {merge:true});
            });
        }).then(() => {
            console.log("Transaction successfully committed!");
        }).catch((error) => {
            console.log("Transaction failed: ", error);
        });

      }).catch(error => {
        console.error(error);
        return error;
      })
    })
}

export function releaseBlockedDocuments(){
  var releaseBlockedDocuments = firebase.functions().httpsCallable('releaseBlockedDocuments');
  releaseBlockedDocuments({}).then((result) => {
    // Read result of the Cloud Function.
    //var sanitizedMessage = result.data.text;
    console.log("releaseBlockedDocuments", result);
  }).catch((error) => {
    // Getting the Error details.
    console.log("releaseBlockedDocuments error", error);
    /*
    var code = error.code;
    var message = error.message;
    var details = error.details;
    */
  });
}


export function loadUserData(uid) {
  console.log("loadUserData, uid", uid);
  return firebase.firestore().collection("users").doc(uid)
  .get()
  .then(doc => {
      console.log(" doc loaded", doc.exists);
      if (!doc.exists) {
        console.log("user entry didn't exist returning null ");
        return null;
      } else {
        return doc.data();
      }
    }).catch(err => {
      console.log('Error getting document', err);
    });
}


export function getFirstAvailDocumentInProject(projectid, uid) {
  console.log("getFirstAvailDocumentInProject");
  const projectRef = firebase.firestore().collection('projects').doc(projectid);

  // DOBBBELTCHECK OM PROJEKTET ER COMPLETEDreturn getDocument(projectRef)
  let collectionid;
  return getDocument(projectRef)
  .then(project => {
    if(project.complete){
      alert("Projektet er afsluttet. Vælg et andet projekt");
      return Promise.reject("Projektet er afsluttet. Vælg et andet projekt" + projectRef.path);
    }
    return project;
  }).then(project => {
    // GET FIRST AVAIL COLLECTION

    return getFirstAvailableCollection(projectRef, uid)
  }).then(collectionRef => {
    console.log("GOT collectionRef -> ", collectionRef);
    console.log("GOT collectionRef, path -> ", collectionRef.path);
    collectionid = collectionRef.id;
    return getFirstDocumentInCollection(collectionRef, uid)
  }).then(documentRef => {
      //console.log("First document loaded", documentRef.path);
      return "/projects/" + projectid  + "/" + collectionid + "/" + documentRef.id;
  }).catch(error => {
    return Promise.reject(error);

  })

}

function getFirstAvailableCollection(projectRef, uid){
  return projectRef.collection('collections')
  .where('complete', '==', false)
  .get()
  .then(querySnapshot => {
    //console.log(snapshot);
    // LOOP COLLECTIONS
    console.log("LOOP COLLECTIONS", querySnapshot.size);

    for (let doc of querySnapshot.docs) {
      //console.log(`Document found at path: ${collection.ref.path}`);
      const collection = doc.data();
      console.log("collection", collection);

      if(!collection.hasOwnProperty('userComplete') || !collection.userComplete.hasOwnProperty(uid) ){
        // userComplete er slet ikke oprettet
        // eller
        // userComplete indeholder ikke denn bruger
        console.log("USERS NOT IN userComplete (WORK FOR THE USER TO BE DONE) return collection", doc.ref.path);
        return doc.ref;

      } else {
        if(collection.userComplete[uid] === true){            // DO NOTHING USER HAS COMPLETED THIS COLLECTION
        } else if(collection.userComplete[uid] === false){    // BRUGEREN HAR ARBEJDET PÅ DENNE KASSE MEN DEN ER IKKE COMPLETED
          //console.log("BRUGEREN HAR ARBEJDET PÅ DENNE KASSE MEN DEN ER IKKE COMPLETED");
          return doc.ref;
        }
      }
    }

    return Promise.reject("Der er ikke flere tilgængelige kasser.<br/>Enten er du færdig med dette projekt eller der kan være sket en fejl.");
  })

}


function getFirstDocumentInCollection(collectionRef, uid){
  console.log("*********** getFirstDocumentInCollection");


  return collectionRef.collection('documents')
  .where('complete', '==', false)
  .where('currently_transcribing_blocked', '==', false)
  .get()
  .then(querySnapshot => {
    //console.log(snapshot);
    // LOOP COLLECTIONS
    console.log("LOOP DOCUMENTS", querySnapshot.size);
    for (let doc of querySnapshot.docs) {
      const document = doc.data();
      console.log("document", doc.id, document);

      if(!document.hasOwnProperty('userComplete') || !document.userComplete.hasOwnProperty(uid) ){
        // userComplete er slet ikke oprettet
        // eller
        // userComplete indeholder ikke denne bruger
        console.log("USERS NOT IN userComplete (WORK FOR THE USER TO BE DONE) return collection", doc.ref.path);
        return doc.ref;

      } else {
        if(document.userComplete[uid] === true){            // DO NOTHING USER HAS COMPLETED THIS DOCUMENT
        } else if(document.userComplete[uid] === false){    // BRUGEREN HAR ARBEJDET PÅ DETTE DOKUMENT MEN DEN ER IKKE COMPLETED
          //console.log("BRUGEREN HAR ARBEJDET PÅ DETTE DOKUMENT MEN DEN ER IKKE COMPLETED");
          return doc.ref;
        }
      }
    }

    return Promise.reject("Der er ikke flere tilgængelige dokumenter.<br/>Enten er du færdig med dette projekt eller der kan være sket en fejl");
  })



}





export function createUserOnProject(projectid, uid){
  const MAX_BATCH_SIZE = 450; //500

  const collectionsToUpdate = [];
  const documentsToUpdate = [];

  const db = firebase.firestore();
  const projectRef = db.collection('projects').doc(projectid);
  const collectionsRef = projectRef.collection('collections');
  return collectionsRef.get()
  .then(collectionsSnapshot => {
    console.log("COLLECTIONS LOADED");
    const promises = [];
    collectionsSnapshot.forEach(collection => {
      //console.log("***", collection.id, collection.ref);
      const documentsRef = collection.ref.collection('documents');
      if(!getUserExistsOnDocument(collection, uid)){
        collectionsToUpdate.push(collection);
      }
      promises.push(documentsRef.get());
    })
    return Promise.all(promises);

  }).then(promises => {
    console.log("DOCUMENTS LOADED");
    //console.log(promises);

    for (var i = 0; i < promises.length; i++) {
      console.log(i, promises[i].docs.length);
      for (var j = 0; j < promises[i].docs.length; j++) {
        const doc = promises[i].docs[j];
        if(!getUserExistsOnDocument(doc, uid)){
          documentsToUpdate.push(doc);
        }
      }
    }
    console.log("documentsToUpdate.length", documentsToUpdate.length);
    return true;
  }).then(reult => {
    console.log("collectionsToUpdate", collectionsToUpdate.length);
    console.log("documentsToUpdate", documentsToUpdate.length);
    const allDocs = collectionsToUpdate.concat(documentsToUpdate);
    console.log("allDocs", allDocs.length);

    // make promises

    const chunks = chunk(allDocs, MAX_BATCH_SIZE);
    //const batchPromises = [];



    const batches = chunks.map(dataRefs => {
      const writeBatch = db.batch();

      dataRefs.forEach(doc => {
        const userComplete = doc.data().userComplete ? doc.data().userComplete : {};
        userComplete[uid] = false;
        writeBatch.set(doc.ref,  {userComplete:userComplete}, {merge:true});
      });
       //return writeBatch.commit();
       return writeBatch;
    });

    const spc = new SequentialPromisesChain();

    const predicate = (writeBatch, index) => {
      return writeBatch.commit().then(() => {
        console.log("WRITEBATCH RESOLVED", index);
        return true;
      })
    }

    return spc.resolve(batches, predicate);

    //return Promise.all(batches);


    /*
    chunk(allDocs, MAX_BATCH_SIZE).map(dataRefs => {
            console.log("dataRefs.length", dataRefs.length);
            const batch = db.batch();
            dataRefs.forEach(doc => {
              console.log("update me? doc", doc.id);
              const userComplete = doc.data().userComplete ? doc.data().userComplete : {};
              userComplete[uid] = false;
              batch.set(doc.ref,  {userComplete:userComplete}, {merge:true});
            });
            batchPromises.push(batch)


            //return batch.commit().then(result => {
            //  console.log("THIS BATCH COMPLETE", result);
            //}).catch(error => {
            //  console.error(error);
            //})


        });
        */
        //console.log("batchPromises.length", batchPromises.length);
        //return Promise.all(batchPromises);
  }).then(result => {
      console.log(" - all sequential writebatches complete", result);
      const userComplete = {[uid]:false}
      return projectRef.set({userComplete:userComplete}, {merge:true})
  }).then(result => {
      console.log("userComplete set on project");
      //const { projects } = this.state.
      return true;

  }).catch(error => {
    console.error(error);
    return error;
  })

}

function getUserExistsOnDocument(doc, uid){
  //console.log("getUserExistsOnDocument", data, uid);
  const data = doc.data();
  if(!data.userComplete || !data.userComplete.hasOwnProperty(uid) ){
    console.log(" user didn't exist", doc.id);
    return false;
  } else {
    console.log(" user did exist", doc.id);
    return true;
  }
}


/*
function updateMergeDocument(ref, obj){
  console.log("updateMergeDocument", ref.path, obj);
  return ref.set(obj, {merge:true})
  .then(snap => {
    console.log("updateMergeDocument", snap);
    return snap;
  }).catch(error => {
    console.error(error);
  })
}
*/

/*
function getNextDocument(projectid, uid){
  alert("getNextDocument TO DO");
}
*/

/*
function userExistsOnProject(projectRef, uid){
  //console.log("userExistsOnProject");
  return getDocument(projectRef)
  .then(data => {
    if(!data.userComplete) {
      return false;
    }
    if(!data.userComplete.hasOwnProperty(uid)) {
      return false
    }

    return true;
  }).catch(error => {
    console.error("userExistsOnProject", error);
    alert(error)
    return error;
  })
}
*/

export function loadUiMessages(){
  const messagesQuery = firebase.firestore().collection('uiMessages').where('enabled', '==', true);//.limit(1)
  return getCollection(messagesQuery)
  .then(docs => {
    return docs;
  }).catch(error => {
    console.error("Error loading messages", error);
    return false;
  })

}

function getCollection(query){
  //return firebase.firestore().collection('uiMessages').where('enabled', '==', true).limit(1)
  return query
  .get()
  .then(querySnapshot => {
    return querySnapshot;
  })

}

function getDocument(ref){
  //console.log("getDocument", ref);
  return ref.get()
  .then(doc => {
    if(!doc.exists){
      return Promise.reject("Document didn't exist, path: " + ref.path);
    }
    return doc.data();
  })
}



export function setCurrentTranscriptionRef(uid, path, value) {
  //console.log("updateTranscriptionRef, uid", uid, "path", path, "value", value);
  if(currentPath === path){
    return Promise.resolve(true);
  }

  currentPath = path;
  return firebase.firestore().collection("users").doc(uid)
  .set(value, {merge:true})
  .then(snap => {
    //console.log("User transcribingref set to: ", path);
    return true;
  }).catch(reason => {
    //console.log("Error setting transcribingref", reason);
    return false;
  })

}


export function setUserProperty(uid, object) {
  console.log("setUserProperty, uid", uid, "object", object);
  return firebase.firestore().collection("users").doc(uid)
  .set(object, {merge:true})
  .then(snap => {
    console.log("... setUserProperty set to: ", object);
    return true;
  }).catch(reason => {
    console.log("Error setUserProperty", reason);
    return false;
  })

}



export function loadNextAvailableDocument(uid) {
  console.log("loadNextAvailableDocument", uid);

  let projectid;
  let collectionid;

  return firebase.firestore().collection('projects')
  .where('released_for_transcription', '==', true)
  .where('complete', '==', false)
  .where('userComplete.'+ uid, '==', false)
  .limit(1).get()
  .then(querySnapshot => {
    console.log("querySnapshot.size", querySnapshot.size);
    //console.log(querySnapshot);
    if(querySnapshot.size > 0){
      projectid = querySnapshot.docs[0].id;
      return projectid;
    } else {
      alert("Noget gik galt. Kunne ikke finde project for bruger: " + uid)
      return false;
    }
  }).then((projectid) => {
    return firebase.firestore().collection('projects').doc(projectid).collection('collections')
    .where('released_for_transcription', '==', true)
    .where('complete', '==', false)
    .where('userComplete.'+ uid, '==', false)
    .limit(1).get()
    .then(querySnapshot => {
      console.log("querySnapshot.size", querySnapshot.size);
      console.log(querySnapshot);
      if(querySnapshot.size > 0){
        collectionid = querySnapshot.docs[0].id;
        return collectionid;
      } else {
        alert("Noget gik galt. Kunne ikke finde samling i project: " + projectid)
        return false;
      }
    })
  }).then((collectionid) => {
    console.log("GOT COLLECTION NOW GET DOCUMENT");
    return firebase.firestore().collection('projects')
      .doc(projectid).collection('collections')
      .doc(collectionid).collection('documents')
      .where('complete', '==', false)
      .where('currently_transcribing_blocked', '==', false)
      .where('userComplete.'+ uid, '==', false)
      .limit(1).get()
      .then(querySnapshot => {
       if(querySnapshot.size > 0){
         const newDocId = querySnapshot.docs[0].id;
         return '/projects/' + projectid + "/" + collectionid + "/" +  newDocId;
       } else {
         const errMsg = "Fejl. Kunne ikke indlæse ledigt dokument i collection: " + projectid + ", " + collectionid;
         alert(errMsg);
         console.error(errMsg);
         return false;
       }
      })
  })

}

/*
export function loadUsersAndUpdateCurrentlyTransribing(){
  console.warn("loadUsersAndUpdateCurrentlyTransribing");
}
*/
