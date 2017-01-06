function generateWinningNumber(){
  var winningNum = Math.round(Math.random() * 100);
  if(winningNum == 0){
    winningNum = 1;
  }
  return winningNum;
}

function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

  // Pick a remaining element…
  i = Math.floor(Math.random() * m--);

  // And swap it with the current element.
  t = array[m];
  array[m] = array[i];
  array[i] = t;
  }

  return array;
}

function Game(){
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
  return Math.abs(this.playersGuess - this.winningNumber);
}

//returns true if the playersGuess is lower than winningNumber, and false if not

Game.prototype.isLower = function(){
  return (this.playersGuess < this.winningNumber);
}

//
Game.prototype.playersGuessSubmission = function(num){
  //throws an error if the number is invalid (less than 1, greater than 100, or not a number
  if(num < 1 || num >100 || isNaN(num)) {
    throw "That is an invalid guess.";
  }
  return this.checkGuess(num);
}

/* this = ??? */
Game.prototype.checkGuess = function(guess){
  this.playersGuess = guess;
  // If player guessed the right number, they won.
  if(this.playersGuess == this.winningNumber){
    $('.lead').html('To play again, click the Reset button');
    $("#submitBtn").prop("disabled",true);
    $("#hint").prop("disabled",true);
    return "You Win!"
  }
  
  // Not the right number. Check if number was tried before.
  if(this.pastGuesses.indexOf(this.playersGuess) > -1){
    return "You have already guessed that number.";
  }
  
  // This is a new guess.
  this.pastGuesses.push(this.playersGuess);
  $('.previousGuesses li:nth-child('+ this.pastGuesses.length +')').html(this.playersGuess);
  
  // Too many wrong guesses?
  if(this.pastGuesses.length == 5){
    $('.lead').html('To play again, click the Reset button');
    $("#submitBtn").prop("disabled",true);
    $("#hint").prop("disabled",true);
    return "You loose.";
  }
  
  // If player is close, tell them.
  var diff = this.difference();
  if (this.isLower()){
    $('.lead').html("Guess Higher!");
  } else {
    $('.lead').html("Guess Lower!");
  }
  
  
  if(diff < 10){
    return "You're burning up!";
  }
  if(diff < 25) {
    return "You're lukewarm.";
  }
  if(diff < 50) {
    return "You're a bit chilly.";
  }
  return "You're ice cold!";
}

function newGame(){
  return game = new Game();
}

/*something's not working*/
Game.prototype.provideHint = function(){
  var hintArray = [];
  hintArray.push(this.winningNumber);
  hintArray.push(generateWinningNumber());
  hintArray.push(generateWinningNumber());
  shuffle(hintArray);
  return hintArray;
}

//JQuery

function makeAGuess(game) {
  var guess = $('#userInput').val();
  $('#userInput').val("");
  var output = game.playersGuessSubmission(parseInt(guess,10));
  console.log(output);
  $('.cover-heading').html(output);
}

$(document).ready(function() {
  console.log('DOM is loaded!');
  var game = new Game();
  //user submiting number - clicking btn
  $('#submitBtn').on('click', function(e) {
    makeAGuess(game);
  });
  //user submiting number - tapping enter on input field
  $('#userInput').keypress(function(event) {
    if ( event.which == 13 ) {
       makeAGuess(game);
    }
  })
  //reset btn
  $("#refresh").on('click', function(e) {
    //create a new game instance
    game = newGame();
    //Reset the #title and #subtitle, and .guess list values
    $('.lead').html("Guess a number between 1-100!");
    $('.cover-heading').html("The Guessing Game");
    $(".previousGuesses li").html("&nbsp;");
    //#submit and #hint buttons aren't disabled
    $("#submitBtn").prop("disabled",false);
    $("#hint").prop("disabled",false);
  });
  
  //hint btn
  $("#hint").on('click', function(e){
    var hints = game.provideHint();
    $('.cover-heading').html("The winning number is " + hints[0] + ", " + hints[1] + ", or "+ hints[2]);
  })
});