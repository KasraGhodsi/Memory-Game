var playerIndex = 0;
var strictMode = false;
var timeout = true;
var buttonArr = [];
var compTimer;

$(document).ready(function(){
  $("#playButton").click(restart);
  $(".gameButton").click(playerTurn);
  $("#strictCheck").change(strictCheck);
  $("#redButton").hover(function(){if(!timeout)changeButtonsImg("red");},function(){if(!timeout)changeButtonsImg("original");});
  $("#blueButton").hover(function(){if(!timeout)changeButtonsImg("blue");},function(){if(!timeout)changeButtonsImg("original");});
  $("#greenButton").hover(function(){if(!timeout)changeButtonsImg("green");},function(){if(!timeout)changeButtonsImg("original");});
  $("#yellowButton").hover(function(){if(!timeout)changeButtonsImg("yellow");},function(){if(!timeout)changeButtonsImg("original");});
});

/* Displays sequence of button presses for player to then repeat.*/
function compTurn(){
  timeout = true; // Prevents player hover/click events from occuring while sequence is being displayed.
  var offset = 0; // Allows timeouts to be queued up consecutively.
  for(var i=0; i<buttonArr.length; i++){
    offset+=300;
    compTimer = setTimeout(function(color){
      playSound(color);
      changeButtonsImg(color);},offset,buttonArr[i]);
    offset+=300;
    compTimer = setTimeout(function(){changeButtonsImg("original");},offset); // Buttons flash off after 300ms.
  }
  setTimeout(function(){timeout=false;},offset+100); // Allows player input.
}

/* Handles player click sequence. */
function playerTurn(){
  if(!timeout){
    var clickedColor = this.id.slice(0,-6);
    if(clickedColor===buttonArr[playerIndex]){ // If player clicks correct button.
      playSound(clickedColor);
      if(playerIndex===buttonArr.length-1){ // If final button in sequence.
        timeout = true;
        setTimeout(function(){changeButtonsImg("original")},300);
        if(playerIndex===19){ // If final button in 20-long sequence, player wins.
          timer = setTimeout(function(){
            $("#levelDisplay").html("You Win!");
            playSound("victory");
          } ,700);
        } else {
          playerIndex=0;
          addToArray();
          setTimeout(function(){$("#levelDisplay").html("Level: "+(buttonArr.length));},600);
          setTimeout(function(){compTurn()},1000);
        }
      } else {
        playerIndex+=1;
      }
    } else { // If player clicks wrong button.
      playSound("error");
      playerIndex = 0;
      timeout = true;
      setTimeout(function(){changeButtonsImg("original")},300);
      if(strictMode){ // In strict mode, restart from level 1.
        setTimeout(function(){$("#levelDisplay").html("Level: 1");},400);
        setTimeout(function(){restart()},2000);
      } else { // In normal mode, replay current sequence.
        setTimeout(function(){compTurn()},2000);
      }
    }
  }
}

/* Highlights button that is being clicked or hovered over. */
function changeButtonsImg(image){
  if(image==="original")
    $("#gameButtonsImg").attr("src","https://image.ibb.co/fPzmWG/Buttons.png");
  else if(image==="red")
    $("#gameButtonsImg").attr("src","https://image.ibb.co/c2p9kb/Buttons_Red.png");
  else if(image==="blue")
    $("#gameButtonsImg").attr("src","https://image.ibb.co/ccyPJw/Buttons_Blue.png");
  else if(image==="green")
    $("#gameButtonsImg").attr("src","https://image.ibb.co/d4EWyw/Buttons_Green_2.png");
  else if(image==="yellow")
    $("#gameButtonsImg").attr("src","https://image.ibb.co/dxbByw/Buttons_Yellow_2.png");
}

/* Adds a button to the sequence. */
function addToArray(){
  var rand = Math.random()*4; // Random number in range [0,4).
  if(rand>=3)
    buttonArr.push("red"); // [3,4) is red.
  else if(rand>=2)
    buttonArr.push("blue"); // [2,3) is blue.
  else if(rand>=1)
    buttonArr.push("green"); // [1,2) is green.
  else
    buttonArr.push("yellow"); // [0,1) is yellow.
}

/* Plays a sound. */
function playSound(sound){
  var audio = document.createElement("audio");
  if(sound==="red")
    audio.src = "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3";
  else if(sound==="blue")
    audio.src = "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3";
  else if(sound==="green")
    audio.src = "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3";
  else if(sound==="yellow")
    audio.src = "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3";
  else if(sound==="error"){
    audio.volume = 0.2;
    audio.src = "https://freesound.org/data/previews/341/341732_5155959-lq.mp3";
  }
  else if(sound==="victory"){
    audio.volume = 0.1;
    audio.src = "http://freesound.org/data/previews/341/341985_6101353-lq.mp3";
  }
  audio.addEventListener("ended", function () {document.removeChild(this);}, false); // Removes audio element from document once it ends.
  audio.play();
}

/* Starts or restarts game from a sequence of 1. */
function restart(){
  while (compTimer--) // Stops sequence display when game is restarted.
    clearTimeout(compTimer);
  $("#strictText").html("");
  $("#playButton").html("Restart");
  if($("#strictCheck").is(":checked"))
   strictMode = true;
  else
    strictMode = false;
  $("#levelDisplay").html("Level: 1");
  playerIndex = 0;
  buttonArr = [];
  addToArray();
  setTimeout(function(){compTurn()},500);  
}

/* Displays warning text if strict mode checkbox hasn't been applied yet. */
function strictCheck(){
  if($("#playButton").html()==="Restart"){
    if(this.checked && !strictMode || !this.checked && strictMode)
      $("#strictText").html("Restart game to apply change.")
    else
      $("#strictText").html("")  
  }
}