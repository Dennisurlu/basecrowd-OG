const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp(functions.config().firebase);

//loadTemplate("b-01")
console.log("do nothing");

function loadTemplate(id){
  const ref = admin.firestore().collection("templates").doc(id);
  return ref.get()
  .then(doc => {
    if (!doc.exists) {
      console.log("Document", doc_id, "didn't exist");
      //return null
    } else {
      console.log('Document data:', doc.data());
      saveTemplate("B", doc.data())
      //return doc.data()
    }
    return true;

  })
}


function saveTemplate(id, data){
  const ref = admin.firestore().collection("templates").doc(id);
  ref.set(data, {merge:true})
    .then(() => {
      console.log("TEMPLATE DATA SAVED");
      return true;
    }).catch((err)=>{
      console.error(err);
      return err;
    })


}
