var fs = require('fs');

//const imageData = require("C:/Users/krist/Desktop/SDU mat/json/B_Aarhus_omegn.json");
//const imageData = require("C:/Users/krist/redia/node/spanish-flu-poc-react/functions/sdu/data/deathCertificates/DeathCertificatesAarhus.json");
//const imageData = require("C:/Users/krist/redia/node/spanish-flu-poc-react/functions/sdu/data/DeathCertificatesAarhus/DeathCertificatesAarhus.json");

//const imageData = require("C:/Users/krist/redia/node/spanish-flu-poc-react/functions/sdu/data/DeathCertificatesAarhus/DeathCertificatesAarhus.json");
const imageData = require("C:/Users/krist/redia/node/basecrowd-poc-react/functions/sdu/data/skattemandtalslister/Municipals_20181229.json");

splitJsonFile(imageData)

function splitJsonFile(imageData){
  console.log(imageData.length);
  //imageData = imageData.splice(0,600);
  console.log("*********************************");
  console.log("*********************************");
  console.log("*********************************");
  console.log("*********************************");
  console.log("*********************************");
  console.log("*********************************");
  console.log("*********************************");
  console.log("ALL", imageData.length);

  imageData = imageData.filter(val => val.processed === true);

  console.log("PROCESSED", imageData.length);

  //traceProperty(imageData, 'delivery_tag');

  //imageData.sort(dynamicSort('delivery_tag'));
  imageData.sort(sortOnSourceFolder());

  const dataByTag = {}
  const deliveryTags = [];
  const classifications = [];

  var i;
  for (i = 0; i < imageData.length; i++) {
    //console.log(i, imageData[i].delivery_tag)
    //const tag = imageData[i].delivery_tag;
    const tag = imageData[i].source.folder;
    //console.log("dataByTag[tag]", tag, dataByTag[tag] === undefined);

    if(dataByTag[tag] === undefined){
      dataByTag[tag] = [];
      deliveryTags.push(tag);
    }
    // add if not type b.
    const classification = imageData[i].document_type.classification;
    if(classifications.indexOf(classification) < 0){
      classifications.push(classification)
    }
    if(classification !== "B"){
      dataByTag[tag].push(imageData[i]);
    }

  }
  for (i = 0; i < deliveryTags.length; i++) {

    const tag = deliveryTags[i];
    const arr = dataByTag[tag]

    fs.writeFile('C:/Users/krist/redia/node/basecrowd-poc-react/functions/sdu/data/skattemandtalslister/'+tag+'.json', JSON.stringify(arr), function (err) {
        if (err) {
          console.error(err);
        } else {
          console.log("SUCCESS");
        }
      });

  }



  /*
  indexes.push(imageData.length);
  let minIndex = 0;
  for (var i = 0; i < indexes.length; i++) {
    const maxIndex = indexes[i];
    console.log(minIndex, maxIndex);

    const boxImages = imageData.slice(minIndex, maxIndex);
    //console.log(i, "segment");
    const collectionId = boxImages[0].delivery_tag;
    //console.log(boxImages[0].delivery_tag);
    //console.log(boxImages[boxImages.length-1].delivery_tag);

    //console.log(boxImages[0].delivery_tag);
    //document_type":{"classification
    console.log(i, "boxImages.length before", boxImages.length);
    for (var j = 0; j < boxImages.length; j++) {
      console.log("classification", boxImages[j].document_type.classification);
      const classification = boxImages[j].document_type.classification
      if(classification === "B"){
        boxImages.splice(j,1);
        i--;

      }
    }
    console.log(i, "boxImages.length after", boxImages.length);

    //fs.writeFile('./../sdu/data/deathCertificates/'+collectionId+'.json', JSON.stringify(boxImages), function (err) {
    fs.writeFile('C:/Users/krist/redia/node/spanish-flu-poc-react/functions/sdu/data/deathCertificates/'+collectionId+'.json', JSON.stringify(boxImages), function (err) {
        if (err) {
          console.error(err);
        } else {
          console.log("SUCCESS");
        }
      });
    minIndex = indexes[i]+1;
  }
  */
}

function sortOnSourceFolder() {
  /*
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    */
    return function (a,b) {
        var result = (a.source.folder < b.source.folder) ? -1 : (a.source.folder > b.source.folder) ? 1 : 0;
        return result;
    }
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

function traceProperty(arr, key){
  let currKey = arr[0][key];
  for (var i = 0; i < arr.length; i++) {
    //console.log(i, arr[i][key]);
    if(currKey !== arr[i][key]){
      //console.log("*************");
      //console.log("Key changed", currKey, arr[i][key]);
      //console.log(arr[i]);
      currKey = arr[i][key];
    }
  }
}


function getUniqueKeysIndexes(arr, key){
  let currKey = arr[0][key];
  const indexes = [];
  for (var i = 0; i < arr.length; i++) {
    //console.log(i, arr[i][key]);
    if(currKey !== arr[i][key]){
      //console.log("*************");
      //console.log("Key changed", currKey, arr[i][key]);
      //console.log(arr[i]);
      currKey = arr[i][key];
      indexes.push(i);
    }
  }
  return indexes;
}
