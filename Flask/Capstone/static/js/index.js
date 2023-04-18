// Get the canvas element and its context
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
// Load the TensorFlow.js library
let check=-1;

var time=1;
var position=document.getElementById("position");
let images=[]
canvas.width=1500;
canvas.height=600;
let hours=1+Math.floor(12*Math.random());
let minutes=Math.floor(12*Math.random());
if(minutes<=1)
position.innerHTML="Draw the time "+hours+":0"+5*minutes+" on the clock";
else
position.innerHTML="Draw the time "+hours+":"+5*minutes+" on the clock";
ctx.lineWidth = 3;
ctx.beginPath();
ctx.arc(775, 300, 250, 0, 2 * Math.PI);
ctx.stroke();
ctx.beginPath();
ctx.arc(775, 300, 20, 0, 2 * Math.PI);
ctx.fill();
let last_x=775;
let last_y=300;
let drawn_hour=0;
let drawn_minute=0;
function checkHour()
{
  original=hours*30;
  choice1=Math.abs(original-drawn_minute);
  choice2=Math.abs(360.0+drawn_minute-original);
  return 360-Math.min(choice1,choice2);
}

function checkMinute()
{
  original=minutes*30;
  choice1=Math.abs(original-drawn_minute);
  choice2=Math.abs(360.0+drawn_minute-original);
  return 360-Math.min(choice1,choice2);
  
}

for(let i=0;i<12;i++)
{
  x=750+200*Math.cos(-(i)*Math.PI/6+Math.PI/3);
  y=275-200*Math.sin(-(i)*Math.PI/6+Math.PI/3);
  ctx.beginPath();
  ctx.rect(x,y,50,50);
  ctx.stroke();
}

clearButton=document.getElementById("clear");
clearButton.addEventListener("click",()=>
{
  ctx.clearRect(0,0,canvas.width,canvas.height); 
  position.innerHTML="";
  if(minutes<=1)
  position.innerHTML="Draw the time "+hours+":0"+5*minutes+" on the clock";
  else
  position.innerHTML="Draw the time "+hours+":"+5*minutes+" on the clock"; 
  ctx.beginPath();
  ctx.arc(775, 300, 250, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(775, 300, 20, 0, 2 * Math.PI);
  ctx.fill();
  for(let i=0;i<12;i++)
{
  x=750+200*Math.cos(-(i)*Math.PI/6+Math.PI/3);
  y=275-200*Math.sin(-(i)*Math.PI/6+Math.PI/3);
  ctx.clearRect(x,y,50,50);
  ctx.beginPath();
  ctx.rect(x,y,50,50);
  ctx.stroke();
}
}
);
/* function next()
{
  down();
  time+=1;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  if(time<=2)
  {
   position.innerHTML="Enter the number at position "+time;
  }
  else
  draw_circle();
} */


function draw_circle()
{
position.innerHTML="";
ctx.lineWidth = 2; 
canvas.width=1500;
canvas.height=2000;
ctx.beginPath();
ctx.arc(750, 500, 460, 0, 2 * Math.PI);
ctx.stroke();
let x=-1;
let y=-1;
console.log(images.length);
/* for(const image of images)
{
  x=750+400*Math.cos(-(images.indexOf(image))*Math.PI/6+Math.PI/3)-image.width/2;
  y=500-400*Math.sin(-(images.indexOf(image))*Math.PI/6+Math.PI/3)-image.height/2;
  ctx.drawImage(image,x,y,image.width,image.height);
} */
/* document.body.removeChild(document.getElementsByTagName("button")[0]);
document.body.removeChild(document.getElementsByTagName("button")[0]);
let isDrawing=false;
canvas.addEventListener("mousedown", function(e) {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
});

canvas.addEventListener("mousemove", function(e) {
  if (isDrawing) {
    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    ctx.stroke();
  }
});

canvas.addEventListener("mouseup", function(e) {
  isDrawing = false;
}); */

}
function done()
{
  
  for(let i=0;i<9;i++)
  { 
  x=750+200*Math.cos(-(i)*Math.PI/6+Math.PI/3);
  y=275-200*Math.sin(-(i)*Math.PI/6+Math.PI/3);
  img=ctx.getImageData(x,y,50,50).data;
  let xhttp=new XMLHttpRequest();
  xhttp.open("POST","/result.html",async=false);
  xhttp.onload=()=>{
   if(xhttp.status==200)
   console.log(xhttp.responseText);
   else
   console.log("Fail");
  };
  xhttp.send(JSON.stringify({"imageData":img,"hourHand":checkHour(),"minuteHand":checkMinute()}));
  }
  
}

function down()
{
  
  let image=new Image();
  image.width=150;
  image.height=100;
  image.src=canvas.toDataURL("image/png");
  images.push(image);
}

// Set a variable to keep track of whether the mouse button is pressed
var isDrawing = false;

// Add event listeners for when the mouse is pressed, moved, and released
canvas.addEventListener("mousedown", function(e) {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
  
});

canvas.addEventListener("mousemove", function(e) {
  if (isDrawing) {
    ctx.lineTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
    ctx.stroke();
    last_x=e.clientX - canvas.getBoundingClientRect().left;
    last_y=e.clientY - canvas.getBoundingClientRect().top;
  }
  if(last_x==775 && last_y==300)
  check=0;
});

canvas.addEventListener("mouseup", function(e) {
  isDrawing = false;
 
  if(check==0)
  {
  drawn_hour=(Math.atan2(last_y-300,last_x-775)*180/Math.PI+450)%360;
  console.log(drawn_hour);
  check=1;
  }
  else if(check==1)
  {
    drawn_minute=(Math.atan2(last_y-300,last_x-775)*180/Math.PI+450)%360;
    console.log(drawn_minute);
  }
}); 

