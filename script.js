// script.js

const img = new Image(); // used to load image from <input> and draw to canvas

const canvas = document.getElementById('user-image');
const context = canvas.getContext('2d');

const imageInput = document.getElementById('image-input');

const clear = document.querySelector("[type='reset']");
const read = document.querySelector("[type='button']");
const submit = document.querySelector("[type='submit']");

const submitBtn = document.getElementById('generate-meme');

const textTop = document.getElementById('text-top');
const textBottom = document.getElementById('text-bottom');


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
  
});

clear.addEventListener('click', event => {
  event.preventDefault();

  context.clearRect(0, 0, canvas.width, canvas.height);

  //toggle buttons
  submit.disabled = false;
  clear.disabled = true;
  read.disabled = true;
  
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


