const video = document.querySelector(".webcam");

const canvas = document.querySelector(".video").transferControlToOffscreen();
const ctx = canvas.getContext("2d");

const faceCanvas = document.querySelector(".face").transferControlToOffscreen();
const faceCtx = faceCanvas.getContext("2d");

canvas.width =  1366;
canvas.height = 720;
faceCanvas.width = 1366;
faceCanvas.height = 720;

const SIZE = 10;
const SCALE = 1.5;

const faceDetector = new FaceDetector();

const backgroundBlurRange = document.getElementById("backgroundBlur");
const borderBlurRange = document.getElementById("borderBlur");
const horizontalFlipCheckbox = document.getElementById("horizontalFlip");
const borderBlurValueBox = document.getElementById("borderBlurValue");
const backgroundBlurValueBox = document.getElementById("backgroundBlurValue");
const streamBlurButton = document.getElementById("blur");

// Blur parameters
let backgroundBlurAmount = 7;
let edgeBlurAmount = 5;
let flipHorizontal = true;
// Setting html elements' values
//backgroundBlurRange.value = backgroundBlurAmount;
backgroundBlurValueBox.innerHTML = backgroundBlurAmount;
borderBlurRange.value = edgeBlurAmount;
borderBlurValueBox.innerHTML = edgeBlurAmount;
horizontalFlipCheckbox.checked = flipHorizontal;

async function populateVideo() {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
    });
    video.srcObject = stream;

    await video.play();
}

function drawFace({boundingBox}) {
    const { width, height, top, left } = boundingBox;
    ctx.strokeStyle = "#ffc600";
    ctx.lineWidth = 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

async function detect() {
    const faces = await faceDetector.detect(video);
    faces.forEach(drawFace);
    requestAnimationFrame(detect);
    
}

populateVideo().then(detect);

const loadBodyPix = () => {
  bodyPix
    .load({
      multiplier: 0.75,
      stride: 32,
      quantBytes: 4,
    })
    .then((net) => perform(net))
    .catch((err) => console.log(err));
};

const perform = async (net) => {
  while (streamStartButton.disabled) {
    const segmentation = await net.segmentPersonParts(video);
    bodyPix.drawBokehEffect(
      canvas,
      video,
      segmentation,
      backgroundBlurAmount,
      edgeBlurAmount,
      flipHorizontal
    );
  }
};

streamBlurButton.addEventListener("click", () => {
  loadBodyPix();
  video.style.display = "none";
  canvas.hidden = false;
});
//Options Listeners
backgroundBlurRange.addEventListener("change", () => {
  backgroundBlurAmount = backgroundBlurRange.value;
  backgroundBlurValueBox.innerHTML = backgroundBlurAmount;
});
borderBlurRange.addEventListener("change", () => {
  edgeBlurAmount = borderBlurRange.value;
  borderBlurValueBox.innerHTML = edgeBlurAmount;
});
horizontalFlipCheckbox.addEventListener("click", () => {
  flipHorizontal = horizontalFlipCheckbox.checked;
});