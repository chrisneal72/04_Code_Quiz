var $mainContainer = document.getElementById("main-container");
var $headerRow = document.getElementById("header-row");
var $mainHeaderCol = document.getElementById("main-header-col");
var $quizHeaderCol = document.getElementById("quiz-header-col");
var $answerRow = document.getElementById("answer-row");
var $answerCol = document.getElementById("answer-col");
var $timerDiv = document.getElementById("timerDiv");
var $question = document.getElementById("question");
var $startButton = document.getElementById("start-btn");
var $highScoreButton = document.getElementById("high-score-btn");
var $hrDivider = document.getElementById("hr-divider");
var questionCounter;
var timerInterval;
var currentTimer;
var randomQuestion = [];
// var currentAnswer;
var correctAnswer;

function setupMainPage() {
    $headerRow.setAttribute("class", "row header-row-m align-items-center");
    $mainHeaderCol.setAttribute("class", "col");
    $quizHeaderCol.setAttribute("class", "col d-none");
    $timerDiv.setAttribute("class", "timerDiv d-none");
    $hrDivider.setAttribute("class", "d-none");
    $answerRow.setAttribute("class", "d-none");
}

function setupQuestionsPage() {
    $headerRow.setAttribute("class", "row header-row-q align-items-center");
    $mainHeaderCol.setAttribute("class", "col d-none");
    $quizHeaderCol.setAttribute("class", "col");
    $timerDiv.setAttribute("class", "timerDiv");
    $hrDivider.setAttribute("class", "row");
    $answerRow.setAttribute("class", "row  answer-row");
    questions.length;
    for (i = 0; i < questions.length; i++) {
        randomQuestion[i] = i;
    }
    currentTimer = 15 * questions.length;
    $timerDiv.children[0].innerHTML = currentTimer;
    timerInterval = setInterval(function() {
        currentTimer--;
        $timerDiv.children[0].innerHTML = currentTimer;
    
        if(currentTimer < 1) {
          clearInterval(timerInterval);
          endQuiz();
        }
    
      }, 1000);
    
    runQuestion();
}

function runQuestion() {
    var currentQuestion = randomQuestion.splice(Math.floor(Math.random() * randomQuestion.length), 1);
    $question.innerHTML = questions[currentQuestion].title;
    $answerCol.innerHTML = '';
    for (i = 0; i < questions[currentQuestion].choices.length; i++) {
        var answerRow = document.createElement('div');
        answerRow.setAttribute("class", "row");
        var answerCol = document.createElement('div');
        answerCol.setAttribute("class", "col");
        var answerBtn = document.createElement('button');
        var thisChoice = questions[currentQuestion].choices[i];
        correctAnswer = questions[currentQuestion].answer;
        answerBtn.setAttribute("type", "button");
        answerBtn.setAttribute("class", "btn");
        answerBtn.setAttribute("id", "answer" + i);
        answerBtn.setAttribute("value", thisChoice);
        answerBtn.innerText = thisChoice;
        $answerCol.appendChild(answerRow);
        answerRow.appendChild(answerCol);
        answerCol.appendChild(answerBtn);
    }
}

function checkAnswer(selectedAnswer){
    console.log(selectedAnswer + " : " + correctAnswer)
    if(randomQuestion.length > 0){
        runQuestion();
    }else{
        clearInterval(timerInterval);
        console.log(currentTimer);
        endQuiz();
    }
}

function endQuiz(){
    console.log("End Quiz");
    setupMainPage();
}

//Event Listeners
window.addEventListener("DOMContentLoaded", setupMainPage);
$startButton.addEventListener("click", setupQuestionsPage);
$answerCol.addEventListener("click", function(evt){
    checkAnswer(evt.target.value);
});