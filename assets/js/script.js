var $mainContainer = document.getElementById("main-container");
var $headerRow = document.getElementById("header-row");
var $headerCol = document.getElementById("header-col");
var $answerRow = document.getElementById("answer-row");
var $answerCol = document.getElementById("answer-col");
var $timerDiv = document.getElementById("timerDiv");
var $mainHeading = document.getElementById("main-heading");
var $question = document.getElementById("question");
var $startButton = document.getElementById("start-btn");
var $highScoreButton = document.getElementById("high-score-btn");
var $instructions = document.getElementById("instructions");
var $hrDivider = document.getElementById("hr-divider");
var questionCounter;
var currentTimer;
var randomQuestion = [];

function setupMainPage() {
    $headerRow.setAttribute("class", "row header-row-m align-items-center");
    $timerDiv.setAttribute("class", "timerDiv d-none");
    $hrDivider.setAttribute("class", "d-none");
    $answerRow.setAttribute("class", "d-none");
    $headerCol.appendChild($mainHeading);
    $headerCol.appendChild($instructions);
    $headerCol.appendChild($startButton);
    $headerCol.appendChild($highScoreButton);
    $question.parentNode.removeChild($question);
    $answerCol.innerHTML = '';
}

function setupQuestionsPage() {
    $headerRow.setAttribute("class", "row header-row-q align-items-center");
    $timerDiv.setAttribute("class", "timerDiv");
    $hrDivider.setAttribute("class", "row");
    $answerRow.setAttribute("class", "row  answer-row");
    $headerCol.appendChild($question);
    $mainHeading.parentNode.removeChild($mainHeading);
    $instructions.parentNode.removeChild($instructions);
    $startButton.parentNode.removeChild($startButton);
    $highScoreButton.parentNode.removeChild($highScoreButton);
    questionCounter = questions.length;
    for (i = 0; i < questionCounter; i++) {
        randomQuestion[i] = i;
    }
    currentTimer = 15 * questionCounter;
    $timerDiv.children[0].innerHTML = currentTimer;
    var timerInterval = setInterval(function() {
        currentTimer--;
        $timerDiv.children[0].innerHTML = currentTimer;
    
        if(currentTimer == 0) {
          clearInterval(timerInterval);
        }
    
      }, 1000);
    
    runQuestion();
}

function runQuestion() {
    var currentQuestion = randomQuestion.splice(Math.floor(Math.random() * randomQuestion.length), 1);
    $question.innerHTML = questions[currentQuestion].title;
    for (i = 0; i < 4; i++) {
        var answerRow = document.createElement('div');
        var answerCol = document.createElement('div');
        answerRow.appendChild(answerCol);
        var answerBtn = document.createElement('button');
        answerBtn.setAttribute("type", "button");
        answerBtn.setAttribute("class", "btn");
        answerBtn.setAttribute("id", "answer" + i);
        answerBtn.innerText = questions[currentQuestion].choices[i];
        answerCol.appendChild(answerBtn);
        $answerCol.appendChild(answerRow);
        document.getElementById("answer" + i).addEventListener("click", setupMainPage);
    }
}

function checkAnswer(){
    //do something
}

function endQuiz(){
    //do something
}

//Event Listeners
window.addEventListener("DOMContentLoaded", setupMainPage);
$startButton.addEventListener("click", setupQuestionsPage);