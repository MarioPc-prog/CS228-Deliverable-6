var trainingCompleted = false;
var numSamples = 2;
var testingSampleIndex = 0;
var predictedClassLabels = nj.zeros(2);
const knnClassifier = ml5.KNNClassifier();

function Train(){
    trainingCompleted = true;
    for (var i = 0; i < train7.shape[3]; i++) {   
        var features = train7.pick(null, null, null, i).reshape(1,120);
        knnClassifier.addExample(features.tolist(),7);
        features = train9.pick(null, null, null, i).reshape(1,120);
        knnClassifier.addExample(features.tolist(),9);
  }
}

function Test(){
      var currentFeatures =  test.pick(null,null,null,testingSampleIndex).reshape(1,120);
      knnClassifier.classify(currentFeatures.tolist(),GotResults);
      
}
function GotResults(err, result){
      predictedClassLabels.set(testingSampleIndex, parseInt(result.label));
      console.log(testingSampleIndex + ": " + predictedClassLabels.get(testingSampleIndex));
      testingSampleIndex += 1;
      if (testingSampleIndex >=100){
          testingSampleIndex = 0;
      }
}
function draw(){
    clear();
     if (trainingCompleted === false){
         Train();    
    }
    Test();
 } 
