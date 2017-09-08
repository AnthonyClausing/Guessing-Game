function Game(){
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber()
}

Game.prototype.difference = function(){
return Math.abs(this.winningNumber - this.playersGuess)
}

Game.prototype.isLower = function(){
return this.playersGuess < this.winningNumber;
}
Game.prototype.checkGuess = function() {
if(this.playersGuess===this.winningNumber) {
    $('#hint, #submit').prop("disabled",true);
    $('#subtitle').text("Congrats, but what did you really win?")
    $("<audio></audio>").attr({
        'src':'Audio/YaY.mp3',
        'volume':0.1,
        'autoplay':'autoplay'
    }).appendTo("body");
    return 'You Win!'
}
else {
    if(this.pastGuesses.indexOf(this.playersGuess) !== -1) {
        $('#subtitle').text("You already guessed that number. It's literally right there in bright yellow. Are you an idiot?")
        return 'You have already guessed that number.';
    }
    else {
        this.pastGuesses.push(this.playersGuess);
        $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
        if(this.pastGuesses.length === 5) {
            $('#hint, #submit').prop("disabled",true);
            $("<audio></audio>").attr({
                'src':'Audio/Failure.mp3',
                'volume':0.2,
                'autoplay':'autoplay'
            }).appendTo("body");
            $('#subtitle').text("You've failed!")
            return 'You Lose.';
        }
        else {
            var diff = this.difference();
            if(this.isLower()) {
                $('#subtitle').text("Guess Higher!")
            } else {
                $('#subtitle').text("Guess Lower!")
            }
            if(diff < 10) return'You\'re burning up!';
            else if(diff < 25) return'You\'re lukewarm.';
            else if(diff < 50) return'You\'re a bit chilly.';
            else return'You\'re ice cold!';
        }
    }
}
}
Game.prototype.playersGuessSubmission = function(guess) {
if(typeof guess !== 'number' || guess < 1 || guess > 100) {
    throw "That is an invalid guess.";
}
this.playersGuess = guess;
return this.checkGuess();
}
Game.prototype.provideHint = function(){
let hintArray = new Array(generateWinningNumber(),this.winningNumber, generateWinningNumber())
return shuffle(hintArray);
}
function generateWinningNumber(){
return Math.floor(Math.random()*100)+1
}
function newGame(){
$('#subtitle').text('Guess a number between 1-100!')
return new Game();
};



function shuffle(arr){
for(var i = arr.length-1; i > 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var temp = arr[i];
    arr[i] = arr[randomIndex];
    arr[randomIndex] = temp;
 }
 return arr;
}
function makeAGuess(game){
var guess = $('#player-input').val()
$('#player-input').val("")
var output = game.playersGuessSubmission(parseInt(guess,10))
console.log(output);
}

$(document).ready(function(){
 var game = new Game();
 $('#submit').on('click',function(){
    makeAGuess(game)
 })
 $('#player-input').keypress(function(event){
     if(event.which == 13){
         makeAGuess(game);
     }
 })
 $('#hint').click(function() {
    var hints = game.provideHint();
    $('#title').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2] + '. What part of \"Guess\" do you not understand?');
});

$('#reset').click(function() {
    game = newGame();
    $('#title').text('Let\'s play a game!');
    $('#subtitle').text('Guess a number between 1-100!')
    $('.guess').text('-');
    $('#hint, #submit').prop("disabled",false);
})
})