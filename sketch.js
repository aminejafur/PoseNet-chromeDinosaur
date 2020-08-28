// ml5.js: Pose Estimation with PoseNet
// Controlling chrom dinosor / Amine jafur
// https://github.com/aminejafur/PoseNet-chromDinosaur
let video;
let poseNet;
let pose;
let slider;
let lines_space = 50;
let radio;
let point_y;
let y1 = 0;
let y2 = 0;


function setup() {
    let cnv = createCanvas(640, 480);
    cnv.position(0, 0, 2);
    video = createCapture(VIDEO);
    filter(DILATE);
    video.hide();
    poseNet = ml5.poseNet(video, modelLoaded);
    poseNet.on('pose', gotPoses);

    // lines space slider
    slider = createSlider(0, lines_space * 4, lines_space);
    slider.position(0, 45);
    slider.style('width', '80px');
    slider.style('background-color', 'red');

    // Tracking methodes
    radio = createRadio();
    radio.option('eyes');
    radio.option('shoulders');
    radio.selected('eyes') //select eyes
    radio.position(0, 10);
}

function gotPoses(poses) {
    //console.log(poses); 
    if (poses.length > 0) {
        pose = poses[0].pose;
        skeleton = poses[0].skeleton;
    }

}


function modelLoaded() {
    console.log('poseNet ready');
    select('#loading').html('Model Loaded,now jump to start');
}

function draw() {
    lines_space = slider.value();
    tint(255, 126);
    image(video, 0, 0);
    // filter(GRAY);
    strokeWeight(2);
    stroke(255);
    // dimensions lines
    line(0, lines_space, width, lines_space);
    line(0, height - lines_space, width, height - lines_space);


    // check for pose
    if (pose) {

        // hide face for video recording
        // fill(255, 0, 0);
        // let eyeR = pose.rightEye;
        // let eyeL = pose.leftEye;
        // ellipse(eyeR.x, eyeR.y, 72);
        // ellipse(eyeL.x, eyeL.y, 72);

        // fill(255, 0, 0);
        // let nose = pose.nose;
        // ellipse(nose.x, nose.y+50, 150);

        let methode_val = radio.value();
        if (methode_val == "shoulders") {

            let shoulderR = pose.rightShoulder;
            let shoulderL = pose.leftShoulder;
            let d = dist(shoulderR.x, shoulderR.y, shoulderL.x, shoulderL.y);
            const middle = d / 2;


            if (shoulderR.y > shoulderL.y) {
                point_y = ((shoulderR.y - shoulderL.y) / 2) + shoulderL.y;

                // console.log(point_y+ ' '+ shoulderR.y);
            } else if (shoulderL.y > shoulderR.y) {
                point_y = ((shoulderL.y - shoulderR.y) / 2) + shoulderR.y;

                // console.log(point_y+ ' '+ eyeL.y);
            } else {
                point_y = shoulderR.y;
            }

            fill(255, 255, 0);
            ellipse(shoulderR.x + middle, point_y, 32);

            startPlay();
        } else {

            let eyeR = pose.rightEye;
            let eyeL = pose.leftEye;
            let d = round(dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y));
            const middle = d / 2;


            if (eyeR.y > eyeL.y) {
                point_y = round(((eyeR.y - eyeL.y) / 2) + eyeL.y);

            } else if (eyeL.y > eyeR.y) {
                point_y = round(((eyeL.y - eyeR.y) / 2) + eyeR.y);

            } else {
                point_y = eyeR.y;
            }



            fill(255, 255, 0);
            ellipse(eyeR.x + middle, point_y, 32);

            startPlay();
        }
    }
}

// simulate keyboard clicks
function simulateKeydown(keycode) {
    var e = new KeyboardEvent("keydown", {
        bubbles: true,
        cancelable: true,
        char: String.fromCharCode(keycode),
        key: String.fromCharCode(keycode)
    });
    Object.defineProperty(e, 'keyCode', {
        get: function() {
            return this.keyCodeVal;
        }
    });
    e.keyCodeVal = keycode;
    document.dispatchEvent(e);
}

function startPlay() {
    if (point_y <= lines_space) {
        console.log('up');
        simulateKeydown(32);
    } else if (point_y >= height - lines_space) {
        console.log('down');
        simulateKeydown(40);
    } else {
        console.log('noramle');
    }
    // ....still working
}