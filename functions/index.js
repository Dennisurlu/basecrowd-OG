const functions = require('firebase-functions');
const admin = require('firebase-admin');
const Firestore = require('@google-cloud/firestore');


var path = require('path');
/*
var serviceAccount = require("C:/Users/krist/redia/node/spanish-flu-poc-react/functions/serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://den-spanske-syge.firebaseio.com'
});
*/

const cors = require('cors')({origin: true});

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

const firestore = new Firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);
//admin.initializeApp();



const CURRENTLY_TRANSCRIBING_TIMESTAMP = "currently_transcribing_timestamp";
const CURRENTLY_TRANSCRIBING_COUNT_BY_TIMESTAMP = "currently_transcribing_count_by_timestamp";

//const CURRENTLY_TRANSCRIBING_COUNT = "currently_transcribing_count";
const CURRENTLY_TRANSCRIBING_BLOCKED = "currently_transcribing_blocked";
const MILISECONDSINADAY = 86400000;
const MAX_CURRENT_TRANSCRIBING = 3;
const LAST_USER_WRITE = "last_user_write";

/*
loop gennem projekter der ikke er complete
loop gennem collections der ikke er complete
loop gennem documenter der er blocked
test om de stadig skal være blocked
  - hvis ikke, så unblock
*/
exports.releaseBlockedDocuments = functions.https.onCall((data, context) => {
  console.log("exports.releaseBlockedDocuments");
  const projectsRef = admin.firestore().collection('projects');
  return projectsRef.where("complete", "==", false)
  .get()
  .then(querySnapshot => {
    const collectionPromises = [];
    querySnapshot.forEach(project => {
        // doc.data() is never undefined for query doc snapshots
        console.log("project", project.id);
        const collectionsRef = project.ref.collection('collections');
        collectionPromises.push(collectionsRef.where("complete", "==", false).get());
    });
    return Promise.all(collectionPromises);

  }).then(collectionPromises => {
    console.log("collectionPromises collectionPromises collectionPromises");
    console.log(collectionPromises.length);
    const documentPromises = [];
    for (var i = 0; i < collectionPromises.length; i++) {

      for (var j = 0; j < collectionPromises[i].docs.length; j++) {
        const collection = collectionPromises[i].docs[j];
        //console.log(i, j, collection.id, collection.ref);
        const docsRef = collection.ref.collection('documents');
        documentPromises.push(docsRef.where("complete", "==", false).where("currently_transcribing_blocked", "==", true).get());
      }
    }
    return Promise.all(documentPromises);
  }).then(documentPromises => {
    console.log("documentPromises documentPromises documentPromises documentPromises ");
    console.log(documentPromises.length);
    let blockedDocumentsCount = 0;
    let releasedDocumentsCount = 0;
    var batch =  admin.firestore().batch();
    for (var i = 0; i < documentPromises.length; i++) {
      //console.log(documentPromises[i]);
      documentPromises[i].forEach(doc => {
           // doc.data() is never undefined for query doc snapshots
           console.log(doc.id);
           const transBlocked = getTranscriptionBlockedObject(doc.data()[CURRENTLY_TRANSCRIBING_TIMESTAMP]);
           console.log("transBlocked.[CURRENTLY_TRANSCRIBING_BLOCKED]", transBlocked[CURRENTLY_TRANSCRIBING_BLOCKED]);
           console.log(transBlocked);
           if(transBlocked[CURRENTLY_TRANSCRIBING_BLOCKED] === false){
             console.log("UPDATING", doc.id);
             batch.update(doc.ref, transBlocked, {merge:true});
             releasedDocumentsCount++;
           }
           //console.log(doc.id, " => ", doc.data());
           blockedDocumentsCount++;
       });
    }

    const returnObject = {
      result:"operation complete",
      method:"updateBlockedDocuments",
      prevBlockedCount:blockedDocumentsCount,
      releasedDocumentsCount:releasedDocumentsCount,
    };
    if(releasedDocumentsCount > 0){
      return batch.commit().then((result) => {
        console.log("update batch complete", result);
        return returnObject;
      });
    } else {
      return returnObject;
    }
  })
  .catch(error => {
      console.log("Error in function releaseBlockedDocuments() ");
      /*
      return error;
      */
      //throw new functions.https.HttpsError("unknown", error.message)
      console.error(error);
      return new functions.https.HttpsError("unknown", "check server log for fejl");
      //throw new functions.https.HttpsError(error.code, error.message)
  });
  return new functions.https.HttpsError("internal", "tester om det virker nu")


});



/*
SÆT userComplete PÅ ALLE DOKUMENTER I ET PROJEKT
UDEN AT OVERSKRIVE userComplete[uid] hvis den er true
*/
applyUserCompleteToDocuments = (userIds, projectid ) => {
  //console.log("applyUserCompleteToDocuments", userIds.length, projectid);
  //console.log("her skal vi loope igennem users og tilføje dem til documents.usersComplete[uid]:false");

  // load collectionRefs
  const collectionsRef = admin.firestore().collection('projects').doc(projectid).collection('collections');

  console.warn("MANGLER set userComplete[userId] på project");


  return collectionsRef.get()
    .then(snapshot => {
      const collectionRefs = [];
      snapshot.forEach(coll => {
        //console.log(coll.id, '=>', coll.data());
        //console.log(coll.ref);
        collectionRefs.push(coll.ref);
      });
      return collectionRefs;
    }).then((collectionRefs) => {
      return applyUserCompleteToCollections(userIds, collectionRefs);
    }).then(() => {
      //console.log("applyUserCompleteToDocuments SUCCESS");
      return true;
    }).catch(err => {
      console.error('Error getting collection', err);
      return error;
    });
};

function applyUserCompleteToCollections(userIds, arrRef){
  //console.log("applyUserCompleteToCollections", userIds.length, arrRef.length);

  return arrRef.reduce((promise, ref) => {
    return promise
      .then((result) => {
        //console.log("##################################");
        return applyUserCompleteToCollection(userIds, ref);
      }).then((result) => {
        //console.log("REMEMBER TO APPLY TO DUCUMENTS");
        return applyUserCompleteToCollectionDocuments(userIds, ref);
      }).catch((error) => {
        //console.log("SOMETHING FAILED", error);
        return error;
      })
    }, Promise.resolve());
}

function applyUserCompleteToCollection(userIds, collectionRef){
  //console.log("applyUserCompleteToCollection");

  // read previous userComplete
  return collectionRef.get()
  .then(doc => {
      let data;
      if (doc.exists) { // tilføj til eksisterende
        //console.log("fieldstatus exists data:", doc.data());
        data = doc.data();
      } else { // opret ny fieldstatus
          data = {};
          //console.log("No such fieldstatus! - creating new");
      }

      const userComplete = data.userComplete ? data.userComplete : {};

      // if doc.userComplete[uid] === undefined -> set it to false
      for (var j = 0; j < userIds.length; j++) {
        if (!userComplete.hasOwnProperty(userIds[j])) {
          userComplete[userIds[j]] = false;
        }
      }
      //console.log("userComplete", userComplete);
      return userComplete;
    }).then((userComplete) => {
      // save userComplete

      return collectionRef.set({userComplete:userComplete}, { merge: true })
    }).then((obj) => {
        return true;
    }).catch((error) => {
        return false;
    });

    //})

}

function applyUserCompleteToCollectionDocuments(userIds, collectionRef){
  //console.log("applyUserCompleteToCollectionDocuments", userIds.length);

  const documentsRef = collectionRef.collection('documents');


  const pr1 = loadDocumentObjects(documentsRef);

  const promiseList = [];
  return pr1.then(documentObjects => {
    for (var i = 0; i < documentObjects.length; i++) {
      const docData = documentObjects[i].data();
      const userComplete = docData.userComplete ? docData.userComplete : {};

      // if doc.userComplete[uid] === undefined -> set it to false
      for (var j = 0; j < userIds.length; j++) {
        if (!userComplete.hasOwnProperty(userIds[j])) {
          userComplete[userIds[j]] = false;
        }
      }

      const fieldPromise = saveCompletedFields(documentObjects[i].ref, userComplete);
      promiseList.push(fieldPromise);
    }
    return promiseList
  }).then((list) => {
    return Promise.all(promiseList)
  }).then(() => {
      //console.log("ALL FIELDS INITTED WITH USER(S), count: ", userIds.length);
      return true;
  }).catch((error) => {
    //console.error("Error applyUserCompleteToDocuments", error);
    return false;
  });

}

function saveCompletedFields(docRef, userComplete) {
  return docRef.set({userComplete:userComplete}, { merge: true })
  .then((obj) => {
      //console.log("Document successfully written!");
      return true;
  })
  .catch((error) => {
      //console.error("Error writing document: ", error);
  });
}

// LOADER ALLE DOKUMENTER I projectId.documents
loadDocumentObjects = (documentsRef) => {
  const documentObjects = [];
  return documentsRef.get().then(querySnapshot => {
      querySnapshot.forEach(document => {
        documentObjects.push(document);
      });
      return documentObjects;
  })
};

getTranscriptionBlockedObject = (currUsers) => {
  console.log("getTranscriptionBlockedObject", currUsers);
  currUsers = currUsers ? currUsers : {};
  let now = Date.now();

  let numTranscribingToday = 0;
  for (var key in currUsers) {
    if (currUsers.hasOwnProperty(key)) {
      const userTime = Number(currUsers[key]);
      console.log("USER", key, userTime);
      if(userTime > 0){
        console.log("BIGGER THAN ZERO");
        console.log(" NOW", now);
        console.log(" userTime", userTime);
        const timeDiff = now - userTime;
        console.log("     TIMEDIFF", timeDiff);
        if(timeDiff > MILISECONDSINADAY){
          currUsers[key] = 0;
        } else {
          numTranscribingToday++;
        }
      }
    }
  }

  const updateObj = {
    [CURRENTLY_TRANSCRIBING_TIMESTAMP]:currUsers,
    [CURRENTLY_TRANSCRIBING_COUNT_BY_TIMESTAMP]:numTranscribingToday,
    [CURRENTLY_TRANSCRIBING_BLOCKED]:numTranscribingToday >= MAX_CURRENT_TRANSCRIBING,
    [LAST_USER_WRITE]:now
  }
  return updateObj;
}

/*
LOAD TEMPLATES og deres fields
LOAD ALLE DOCUMENTS
ved match på templateId init document.fields properties
*/

// pre 2018-04-16

// LOAD ALLE DOKUMENTER
// OG RETURNER dict[key] = document
loadDocuments = (documentsRef) => {
  const documents = {};
  return documentsRef.get().then(querySnapshot => {
      querySnapshot.forEach(document => {
        //console.log("REF", document.ref);
        var key = document.id;
        //console.log("key", key);
        documents[key] = document.data()
      });
      //console.log("loadDocuments.return");
      return documents;
  })
};

// LOAD ALLE TEMPLATES
// OG RETURNER dict[key] = template
loadTemplates = (ref => {
  return ref.get().then(querySnapshot => {
    let templates = {};
    querySnapshot.forEach(template => {
      templates[template.id] = template.data();
    });
    return templates;
  })
});

// LOAD TEMPLATE.fields
// OG RETURNER dict[key] = field
loadTemplateFields = ((templateRef, templateId) => {
  return templateRef.doc(templateId).collection('fields').get().then(fieldQuerySnapshot => {
      let fields = {};
      fieldQuerySnapshot.forEach(field => {
          fields[field.id] = field.data();
      });
      return fields;
  })
});


updateDocumentCounter = (change, context, counter_name) => {
  console.log("updateDocumentCounter");
  const after = change.after.data();
  if(after && after.hasOwnProperty('complete')){
    //console.log("onWrite did have property 'complete'");

    let completeBefore;
    const beforeExists = change.before.exists; // returns true/false
    const before = change.before.data();
    if(beforeExists && before.hasOwnProperty('complete')){
      completeBefore = before.complete === true;
    } else {
      completeBefore = false;
    }
    const completeAfter = after.complete;
    //console.log("complete before/after:", completeAfter, completeBefore);

    // COMPLETE STATE HAS CHANGED -> UPDATE COUNT
    if(completeBefore !== completeAfter){
      // get a reference to
      const docRef = change.after.ref;
      const parentRef = docRef.parent.parent;

      //const rootRef = change.after.ref.firestore;
      //console.log(admin.firestore().runTransaction);
      return admin.firestore().runTransaction(transaction => {
        return transaction.get(parentRef).then(snap => {
          const data = snap.data();
          const prevCompleteCount = data.complete_count;
          const documentCount = data[counter_name];
          const newCompleteCount = completeAfter ? prevCompleteCount+1 : prevCompleteCount-1;
          const collectionComplete = newCompleteCount >= documentCount;
          //console.log("prevCompleteCount", prevCompleteCount, "newCompleteCount", newCompleteCount, "collectionComplete", collectionComplete);
          return transaction.update(parentRef, {
            complete_count: newCompleteCount,
            complete: collectionComplete
          })

        });
      });

    }

  } else {
    //console.log("onWrite did not contain property complete");
  }

  return true;

}

// COUNTER FOR COMPLETED DOCUMENTS ON COLLECTION
// SETS COMPLETE TRUE WHEN ALL DOCUMENTS ARE COMPLETE
exports.fsUpdateDocumentComplete = functions.firestore.document('projects/{projectid}/collections/{collectionid}/documents/{documentid}')
.onWrite((change, context) => {
  return updateDocumentCounter(change, context, 'document_count');
})

exports.fsUpdateCollectionDocumentsComplete = functions.firestore.document('projects/{projectid}/collections/{collectionid}')
console.log("exports.fsUpdateCollectionDocumentsComplete");
.onWrite((change, context) => {
  return updateDocumentCounter(change, context, 'document_count');
})


// Saves a message to the Firebase Realtime Database but sanitizes the text by removing swearwords.

/*
// COUNTER FOR COMPLETED COLLECTIONS ON PROJECT
// SETS COMPLETE TRUE WHEN ALL COLLECTIONS ARE COMPLETE
exports.fsUpdateCollectionComplete = functions.firestore.document('projects/{projectid}/collections/{collectionid}')
.onWrite((change, context) => {
  return updateDocumentCounter(change, context, 'collection_count');
})
*/

// NÅR EN TRANSCRIPTION OPRETTES / OPDATERES KALD fsEvaluateDocumentStatus
exports.fsUpdateTranscription = functions.firestore
  .document('projects/{projectid}/collections/{collectionid}/documents/{documentid}/users/{userid}/fields/{fieldid}')
  .onWrite((change, context) => {
    return fsEvaluateFieldTranscriptions(change, context);
  });

exports.fsUserCurrentTranscriptionWrite = functions.firestore.document('users/{userid}')
.onWrite((change, context) => {
  const { userid  } = context.params;
  const data = change.after.data();

  let beforeRef = null;
  let afterRef = null;

  const before = change.before.data();
  if(before && before.hasOwnProperty('transcribingref')){
    beforeRef = before.transcribingref;
  }

  //console.log("before.data", before.data);
  //console.log("new.data", data);
  if(data.hasOwnProperty('transcribingref')){
    afterRef = data.transcribingref;
  }

  const PromisesPrevAndCurr = [];

  if(beforeRef){
    PromisesPrevAndCurr.push(updateDocumentTranscribingCount(beforeRef, userid, false))
  }
  if(afterRef){
    PromisesPrevAndCurr.push(updateDocumentTranscribingCount(afterRef, userid, true))
  }

  return Promise.all(PromisesPrevAndCurr)
  .then((updates) => {
    /*
    for (var i = 0; i < updates.length; i++) {
      console.log(i, "updates[i]", updates[i]);
    }
    */
    return true;

  }).catch(err =>{
    //console.log("Error occurred in fsUserCurrentTranscriptionWrite");
    console.error(err);
    return err
  })
});



updateDocumentTranscribingCount = (docPath, userid, add) => {

  //console.log("update doc trans count (path,uid, add)", docPath, userid, add );
  if(!docPath){
    //console.log("docPath is null -> do nothing");
    return true;
  } else {

    const docRef = admin.firestore().doc(docPath);
    return docRef.get()
    .then(doc => {
      let data;
      let currUsers = {};

      if (doc.exists) {
        const data = doc.data();
        /*
        if(data.hasOwnProperty(CURRENTLY_TRANSCRIBING)) currUsers = data[CURRENTLY_TRANSCRIBING];
        */
        if(data.hasOwnProperty(CURRENTLY_TRANSCRIBING_TIMESTAMP)) {
          currUsers = data[CURRENTLY_TRANSCRIBING_TIMESTAMP];
        } else {
          currUsers = {};

        }

      }


      //console.log('now=', now);
      let now = Date.now();
      if(add){
        currUsers[userid] = now;
        //currUsers[userid] = true;
      } else {
        currUsers[userid] = 0;
      }

      return currUsers;
    }).then(currUsers => {

      console.log("************** add", add);
      console.log("CURR USERS", currUsers);
      const updateObj = getTranscriptionBlockedObject(currUsers);
      console.log("updateObj");
      console.log(updateObj);


      return docRef.update(updateObj, {merge:true})
    }).then(result => {
      //console.log("DOC CURRENTLY_TRANSCRIBING_COUNT UPDATED, result", result);
      return true;
    }).catch(err =>{
      //console.log("Error occurred in updateDocumentTranscribingCount");
      //console.error(err);
      return err;
    })

  }

}

// EVALUÈR EN BRUGER-TRANSCRIPTION
// RETURNER true hvis feltet er udfyldt, ulæseligt eller tomt
transcriptionComplete = (transcription) => {
  //console.log("transcriptionComplete", transcription);
  const complete = Boolean(transcription.unreadable || transcription.empty || transcription.value !== "");
  return complete;
}

// NÅR EN BRUGER OPRETTER / OPDATERER EN TRANSCRIPTION
// LOAD ALLE TRANSCRIPTION for FELTET
// EVALUER OM FELTET ER complete
// OPDATER document.fieldstatus
// LOAD ALLE BRUGERENS TRANSCRIPTIONS FOR DETTE DOCUMENT
// EVALUER OM BRUGEREN ER FÆRDIG MED ALLE DOKUMENTETS TRANSCRIPTIONS
// SÆT / OPDATER document.userComplete
fsEvaluateFieldTranscriptions = (change, context) => {
  const { projectid, collectionid, documentid, userid, fieldid  } = context.params;
  console.log("fsEvaluateFieldTranscriptions", projectid, collectionid, userid, fieldid);
  /*
  console.log('fsEvaluateFieldTranscriptions');
  console.log("context.params");
  console.log(context.params);
  console.log("projectid", projectid);
  console.log("collectionid", collectionid);
  console.log("documentid",documentid);
  console.log("userid",userid);
  console.log("fieldid",fieldid);
  */


  const data = change.after.data();
  const rootRef = change.after.ref.firestore;
  // ARE FIELDS COMPLETE???
  // UPDATE THE TRANSCRIPTION WITH COMPLETE STATUS (true/false)
  const userFieldComplete = transcriptionComplete(data);
  const transcription = data;
  transcription.complete = userFieldComplete;
  if(fieldid){
    change.after.ref.set(transcription)
  }


  const documentRef = rootRef.collection('projects').doc(projectid)
                .collection('collections').doc(collectionid)
                .collection('documents').doc(documentid);

  const usersRef = documentRef.collection('users')
  const fieldstatusRef = documentRef.collection('fieldstatus').doc(fieldid);
  let newFieldStatus = {}

  const allUserIds = [];
  // LOAD ALL USERS
  return usersRef.get().then((querySnapshot) => {
    querySnapshot.forEach((user) => {
        //console.log(user.id, " => ", user.data());
        allUserIds.push(user.id);
    });
    return allUserIds
  }).then((allUserIds) => {
    //console.log("allUserIds LOADED", allUserIds);
    if(allUserIds.length === 0){
      console.warn("no userIds");
    }

    const userFieldPromises = [];
    for (var i = 0; i < allUserIds.length; i++) {
      const ref = usersRef.doc(allUserIds[i]).collection('fields').doc(fieldid).get();
      userFieldPromises.push(ref);
    }

    return Promise.all(userFieldPromises)
    }).then((values) => {

      var transcriptions = [];
      for (var i = 0; i < values.length; i++) {
        if(values[i].exists){
          transcriptions.push(values[i].data())
        }
      }
      //return Promise.all([templates])
      return transcriptions;
    }).then((transcriptions) => {

      const numKeys = transcriptions.size;
      const userValues = {};
      const values = [];
      const userComplete = {};
      let unreadable = 0;
      let empty = 0;

      const fieldsComplete = {};
      const userTranscriptions = {};

      for (var i = 0; i < transcriptions.length; i++) {
        const userId = allUserIds[i];
        //console.log("T", i, userid);
        const trans = transcriptions[i];
        if(trans.unreadable) unreadable++;
        if(trans.empty) empty++;
        userValues[userId] = trans.value;
        if(trans.value !== "") values.push(trans.value);
        userComplete[userId] = transcriptionComplete(trans);
      }

      const numValues = Object.keys(values).length;

      let maxSimilarity = numValues < 2 ? 0 : getMaxSimilarity(values.slice(0));
      let complete = (transcriptions.length > 1) && ( maxSimilarity > 0.85 || unreadable >= 10 || empty >= 2 || numValues >= 4);

      // save the status in document.fieldstatus
      newFieldStatus = {
        complete:complete,
        maxSimilarity:maxSimilarity,
        unreadable:unreadable,
        empty:empty,
        userValues:userValues,
        userComplete:userComplete
      }

      //console.log("newFieldStatus newFieldStatus newFieldStatus newFieldStatus ");
      //console.log(newFieldStatus);

      return newFieldStatus;


    }).then((newFieldStatus)=>{
      //const fieldstatusRef = documentRef.collection('fieldstatus').doc(fieldid);

      return fieldstatusRef.get()
    }).then(doc => {
          return fieldstatusRef.set(newFieldStatus, {merge:false})
      }).then((result) => {
        //console.log("FIELDS STATUS SAVED");
        return newFieldStatus.complete;
      }).then((fieldComplete)=> {

        var docStatus = {
          fieldsComplete:{
            [fieldid]:fieldComplete
          }
        };

        return documentRef.set(docStatus, {merge:true})
      /*
      }).then((result) => {
          //console.log("document successfully updated!", userid);
          return setUserDocumentComplete(documentRef, userid);
      */
      }).then((result) => {
        //console.log("setUserDocumentComplete result: ", result);
        return true;
      }).then((result) => {
        //console.log("LOAD FIELDS WHERE INCOMPLETE == false");
        return documentRef.collection('fieldstatus')
          .where('complete', '==', false)
          .limit(1)
          .get()
      }).then((querySnapshot) => {
        //console.log("INCOMPLETE FIELDS RESULT", querySnapshot.size);
        return querySnapshot.size === 0;
      }).then((allComplete) => {
        // OPDATER documentRef.complete
        return documentRef.set({complete:allComplete}, {merge:true})
      }).then((docUpdated) => {
        //console.log("ALL FUNCTIONS COMPLETE", docUpdated );
        return true;
      }).then((result) => {
        return testSetUserCollectionComplete(userid, projectid, collectionid);
      }).catch((error) => {
        //console.log("ERROR OCCURED");
        console.error(error);
        return false;
      })


}


testSetUserCollectionComplete = (userid, projectid, collectionid ) => {
  console.log("setUserCollectionsComplete", userid, projectid);


  const projectRef = admin.firestore().collection('projects').doc(projectid)

  const collectionRef = projectRef.collection('collections').doc(collectionid);

  const availDocsRef = collectionRef.collection('documents')
      .where('complete', '==', false)
      .where('userComplete.'+ userid, '==', false)
      .limit(1);

  return availDocsRef.get()
    .then(querySnapshot => {
     console.log("doc loaded");
     console.log("querySnapshot.size", querySnapshot.size);
     const documentsCompleteForUser = querySnapshot.size === 0;
     return documentsCompleteForUser;
   }).then(documentsCompleteForUser => {
     console.log("UPDATE collection.userComplete[userid]", documentsCompleteForUser);
     const userComplete = {
       [userid]:documentsCompleteForUser
     }
     const collection = {
        userComplete:userComplete
     }
     return collectionRef.set(collection, {merge:true})
   }).then(updateCollectionSucces => {
     console.log("updateSucces", updateCollectionSucces);
     const availCollectionsRef = projectRef.collection('collections')
           .where('complete', '==', false)
           .where('userComplete.'+ userid, '==', false)
           .limit(1);
     return availCollectionsRef.get()
     .then(querySnapshot => {
       const collectionsCompleteForUser = querySnapshot.size === 0;
       console.log("collectionsCompleteForUser", collectionsCompleteForUser);
       return collectionsCompleteForUser;
     })
    }).then(collectionsCompleteForUser => {
      console.log("save collectionsCompleteForUser", collectionsCompleteForUser);
      const userComplete = {
        [userid]:collectionsCompleteForUser
      }
      const project = {
         userComplete:userComplete
      }
      return projectRef.set(project, {merge:true})
    }).then(updateProjectUSerCompleteSucces => {
      console.log("updateProjectUSerCompleteSucces", updateProjectUSerCompleteSucces);
      return true;
    }).catch((error) => {
     console.error("testSetUserCollectionComplete error", error);
     return false;
   });

};



getUserTranscription = (key, documentRef, userId) => {
  var tRef = documentRef.collection('users').doc(userId).collection('fields').doc(key);
  return tRef.get()
  .then((doc)=>{
    return doc
  }).catch((error) => {
    return false;
  });
};

// EVALUERER ET ARRAY AF STRING
// SAMMENLIGNER STRENGENE PARVIST
// RETURNERER MAX SIMILARITY
function getMaxSimilarity(arr){
  var maxSim = 0;

  while (arr.length > 1) {
    const val = arr.pop();
    for(var i = 0;i<arr.length;i++){
      var sim = similarity(val, arr[i]);
      maxSim = Math.max(maxSim, sim);
    }
  }
  return maxSim;
}

// SAMMENLIGNER TO STRENGE
// RETURNER SIMILARITY (0 til 1)
function similarity(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  var longer = s1;
  var shorter = s2;
  let sim;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength === 0) {
    sim = 1.0;
  }
    sim = (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
    return sim;
  }

  editDistance = (s1, s2) => {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i === 0)
          costs[j] = j;
        else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
            costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
    if (i > 0)
      costs[s2.length] = lastValue;
    }
  return costs[s2.length];
}
