var controllerOptions = {};
var trainingCompleted = false;
var previousNumHands = 0
var currentNumHands = 0;
var numSamples = 2;
var testingSampleIndex = 0;
var predictedClassLabels = nj.zeros(2);
var FramesOfData = nj.zeros([5,4,6]);
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
function Handleframe(frame){
        var interactionBox = frame.interactionBox;
	if(frame.hands.length===1 || frame.hands.length===2){    
                
                var hand = frame.hands[0];
                //console.log(hand);
		HandleHand(hand,interactionBox);
                previousNumHands = currentNumHands;
	}
}
function HandleBone(bone,thick,stroke,fingerIndex,interactionBox){
    //the distal end of the bone closest to the finger tip .nextJoint
    var normalizedPrevJoint = interactionBox.normalizePoint(bone.prevJoint, true);
    var normalizedNextJoint = interactionBox.normalizePoint(bone.nextJoint, true);
    //create new varaibles x , y , z , x1, y1, z1 , set to the nextJoint and PrevJoint 
      x = normalizedPrevJoint[0];
      y = normalizedPrevJoint[1];
      z = normalizedPrevJoint[2];
      x1 = normalizedNextJoint[0];
      y1 = normalizedNextJoint[1];
      z1 = normalizedNextJoint[2];
     
      FramesOfData.set(fingerIndex.type,bone.type,0,x);
      FramesOfData.set(fingerIndex.type,bone.type,1,y);
      FramesOfData.set(fingerIndex.type,bone.type,2,z);
      FramesOfData.set(fingerIndex.type,bone.type,3,x1);
      FramesOfData.set(fingerIndex.type,bone.type,4,y1);
      FramesOfData.set(fingerIndex.type,bone.type,5,z1);
    //expanding the canvas and apply new scaling 
    var canvasX = window.innerWidth * normalizedPrevJoint[0];
    var canvasY = window.innerHeight * (1 - normalizedPrevJoint[1]);
    var canvasX1 = window.innerWidth * normalizedNextJoint[0];
    var canvasY1 = window.innerHeight * (1 - normalizedNextJoint[1]);
    //sum of cords noramized 
    //var Sum = (x + x1 + y + y1 + z + z1);
    //call line p5 method 
    thick;
    stroke;
    //create a hand variable and and draw only green if only one hand is detected 
    if (previousNumHands === 1){
         line(canvasX,canvasY,canvasX1,canvasY1);
    }
    else{
        line(canvasX,canvasY,canvasX1,canvasY1);
    }
}
function HandleHand(hand,interactionBox){
        var width = 3;
        var fingers = hand.fingers;
        for (var i = 0;i < fingers.length; i++){
            //console.log(fingers);
            var thick = strokeWeight(2);
             var finger = fingers[i];
             //console.log(finger);
             var bones = finger.bones;
             //console.log(bones);
            for (var x = 0; x <bones.length; x++){
                var bone = bones[x];
                //console.log(bone);
                if(bones[x].type === 0){
                    var thick = strokeWeight(6*width);
                    var bone = bones[x];
                    stroke(210);
                    HandleBone(bone,thick,stroke,finger,interactionBox);
                }
                if(bones[x].type === 1){
                    var thick = strokeWeight(4*width);
                    var bone = bones[x];
                    stroke(150);
                    HandleBone(bone,thick,stroke,finger,interactionBox);
                }
                if(bones[x].type === 2){
                    var thick = strokeWeight(2*width);
                    var bone = bones[x];
                    stroke(50);
                    HandleBone(bone,thick,stroke,finger,interactionBox);
                }
                strokeWeight(1*width);
                HandleBone(bone,thick,stroke,finger,interactionBox);
                
         
            }
            
        }
    }
Leap.loop(controllerOptions,function(frame){
    clear();
     if (trainingCompleted === false){
         Train();    
    }
    Handleframe(frame);
    console.log(FramesOfData);
    Test();
});
