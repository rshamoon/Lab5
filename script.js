// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

const canvas = document.getElementById('user-image');
const context = canvas.getContext('2d');

const imageInput = document.getElementById('image-input');

const clear = document.querySelector("[type='reset']");
const read = document.querySelector("[type='button']");
const submit = document.querySelector("[type='submit']");
const voices = document.getElementById("voice-selection"); 

const submitBtn = document.getElementById('generate-meme');

const volumeSlider = document.querySelector("[type='range']");
const volumeGroup = document.getElementById("volume-group");
const volumePic = document.querySelector('#volume-group img');

const textTop = document.getElementById('text-top');
const textBottom = document.getElementById('text-bottom');

//gets rid of filler default value
voices.remove(0);

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {

  //clear current canvas context
  context.clearRect(0, 0, canvas.width, canvas.height);

  //toggle buttons
  submit.disabled = false;
  clear.disabled = true;
  read.disabled = true;
 
  //fill canvas to add black borders
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  //draw the uploaded image
  let newDimension = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  context.drawImage(img, newDimension.startX, newDimension.startY, newDimension.width, newDimension.height);

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected
});

imageInput.addEventListener('change', () => {

  const objectURL = URL.createObjectURL(imageInput.files[0]);

  //load file into source
  img.src = objectURL;

  //set alt
  let fileIndex = objectURL.lastIndexOf("/") + 1;
  let fileName = objectURL.substr(fileIndex);
  img.alt = fileName;

});

submitBtn.addEventListener('submit', event => {
  event.preventDefault();

  //style and color
  context.font = "30px Arial";
  context.fillStyle = 'white';
  
  //positioning 
  context.textAlign = 'center'; 

  //draws top
  context.textBaseline = 'top';
  context.fillText(textTop.value, canvas.width/2, 0);
  context.strokeText(textTop.value, canvas.width/2, 0);

  //draws bottom
  context.textBaseline = 'bottom';
  context.fillText(textBottom.value, canvas.width/2, canvas.height);
  context.strokeText(textBottom.value, canvas.width/2, canvas.height);

  //toggle buttons
  submit.disabled = true;
  clear.disabled = false;
  read.disabled = false;
  voices.disabled = false;

  //populate voice options
  populateVoices();
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices;
  }
});

clear.addEventListener('click', event => {
  event.preventDefault();

  context.clearRect(0, 0, canvas.width, canvas.height);

  //toggle buttons
  submit.disabled = false;
  clear.disabled = true;
  read.disabled = true;
  voices.disabled = true;
  
});

read.addEventListener('click', event => {
  event.preventDefault();

  let synth = window.speechSynthesis;

  //gets things to say
  let topUtterance = new SpeechSynthesisUtterance(textTop.value);
  let bottomUtterance = new SpeechSynthesisUtterance(textBottom.value);
  let availableVoices = synth.getVoices();

  //sets the selected data
  let selectedOption = voices.selectedOptions[0].getAttribute('data-name');

  //attaches audio to thing to say
  for(let i = 0; i < availableVoices.length ; i++) {
    if(availableVoices[i].name === selectedOption) {
      topUtterance.voice = availableVoices[i];
      bottomUtterance.voice = availableVoices[i];
    }
  }

  //sets volume
  topUtterance.volume = (volumeSlider.value/100);
  bottomUtterance.volume = (volumeSlider.value/100);

  window.speechSynthesis.cancel();
  
  //says it
  synth.speak(topUtterance);
  synth.speak(bottomUtterance);
});

function populateVoices(){
  
  let synth = window.speechSynthesis;
  let availableVoices = synth.getVoices();

  //fill available voices
  for(let i = 0; i < availableVoices.length ; i++) {
    let option = document.createElement('option'); 
    option.textContent = availableVoices[i].name + ' (' + availableVoices[i].lang + ')';

    if(availableVoices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', availableVoices[i].lang);
    option.setAttribute('data-name', availableVoices[i].name);
    voices.appendChild(option);
  }
}

volumeGroup.addEventListener('input', event => {
  event.preventDefault();
  
  if((volumeSlider.value/100) >= .67){
    volumePic.src = 'icons/volume-level-3.svg';
    volumePic.alt = 'Volume Level 3';
  }
  else if((volumeSlider.value/100) >= .34){
    volumePic.src = 'icons/volume-level-2.svg';
    volumePic.alt = 'Volume Level 2';
  }
  else if((volumeSlider.value/100) >= .01){
    volumePic.src = 'icons/volume-level-1.svg'; 
    volumePic.alt = 'Volume Level 1';
  }
  else{
    volumePic.src = 'icons/volume-level-0.svg';
    volumePic.alt = 'Volume Level 0';
  }
  
  });

  
/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}


