var $headerRow = document.getElementById("header-row");
var $mainHeaderCol = document.getElementById("main-header-col");
var $quizHeaderCol = document.getElementById("quiz-header-col");
var $highScoreHeaderCol = document.getElementById("high-score-header-col");
var $endScoreHeaderCol = document.getElementById("end-score-header-col");
var $answerRow = document.getElementById("answer-row");
var $answerCol = document.getElementById("answer-col");
var $timerDiv = document.getElementById("timerDiv");
var $question = document.getElementById("question");
var $startButton = document.getElementById("start-btn");
var $highScoreButton = document.getElementById("high-score-btn");
var $mainPageButton = document.getElementById("main-page-btn");
var $mainPageButton2 = document.getElementById("main-page-btn2");
var $highScoreButton2 = document.getElementById("high-score-btn2");
var $hrDivider = document.getElementById("hr-divider");
var $currentScore = document.getElementById("current-score");
var $highScoreAchived = document.getElementById("high-score-achived");
var questionCounter;
var timePerQuestion = 15;
var timerInterval;
var currentTimer;
var randomQuestion = [];
var correctAnswer;
var numCorrect;
var currentScore;
var pointsPerQuestion = (100/questions.length);

function setupMainPage() {
    $headerRow.setAttribute("class", "row header-row-m align-items-center");
    $mainHeaderCol.setAttribute("class", "col");
    $quizHeaderCol.setAttribute("class", "col d-none");
    $highScoreHeaderCol.setAttribute("class", "col d-none");
    $endScoreHeaderCol.setAttribute("class", "col d-none");
    $timerDiv.setAttribute("class", "timerDiv d-none");
    $hrDivider.setAttribute("class", "d-none");
    $answerRow.setAttribute("class", "d-none");
}

function setupHighScorePage() {
    $headerRow.setAttribute("class", "row header-row-m align-items-center");
    $mainHeaderCol.setAttribute("class", "col d-none");
    $quizHeaderCol.setAttribute("class", "col d-none");
    $highScoreHeaderCol.setAttribute("class", "col");
    $endScoreHeaderCol.setAttribute("class", "col d-none");
    $timerDiv.setAttribute("class", "timerDiv d-none");
    $hrDivider.setAttribute("class", "d-none");
    $answerRow.setAttribute("class", "row d-none");
    $currentScore.setAttribute("class", "row d-none");
    $highScoreAchived.setAttribute("class", "row d-none");  
}

function setupQuestionsPage() {
    $headerRow.setAttribute("class", "row header-row-q align-items-center");
    $mainHeaderCol.setAttribute("class", "col d-none");
    $quizHeaderCol.setAttribute("class", "col");
    $highScoreHeaderCol.setAttribute("class", "col d-none");
    $endScoreHeaderCol.setAttribute("class", "col d-none");
    $timerDiv.setAttribute("class", "timerDiv");
    $hrDivider.setAttribute("class", "row");
    $answerRow.setAttribute("class", "row  answer-row");
    questions.length;
    for (i = 0; i < questions.length; i++) {
        randomQuestion[i] = i;
    }
    currentTimer = timePerQuestion * questions.length;
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
    if(!numCorrect){numCorrect = 0}
    if(!currentScore){currentScore = 0}
    if(selectedAnswer === correctAnswer){
        currentScore = currentScore + pointsPerQuestion;
        numCorrect++;
    }else{
        currentTimer = currentTimer - timePerQuestion;
    }
    if(randomQuestion.length > 0 && currentTimer > 0){
        runQuestion();
    }else{
        clearInterval(timerInterval);
        endQuiz();
    }
}

function endQuiz(){
    
var $quizScore = document.getElementById("quiz-score");
    currentScore = Math.round(currentScore);
    var finalScore = currentScore + currentTimer;
    if(finalScore < 0){finalScore = 0}
    $headerRow.setAttribute("class", "row header-row-m align-items-center");
    $mainHeaderCol.setAttribute("class", "col d-none");
    $quizHeaderCol.setAttribute("class", "col d-none");
    $highScoreHeaderCol.setAttribute("class", "col d-none");
    $endScoreHeaderCol.setAttribute("class", "col");
    $timerDiv.setAttribute("class", "timerDiv d-none");
    $hrDivider.setAttribute("class", "d-none");
    $answerRow.setAttribute("class", "row d-none");
    $currentScore.setAttribute("class", "row");
    $highScoreAchived.setAttribute("class", "row d-none");
    document.getElementById("quiz-score").innerHTML = finalScore;
    document.getElementById("num-correct").innerHTML = numCorrect;
    document.getElementById("points-earned").innerHTML = currentScore;
    document.getElementById("time-bonus").innerHTML = currentTimer;
    document.getElementById("elapsed-time").innerHTML = (timePerQuestion * questions.length) - currentTimer;
}

//Event Listeners
window.addEventListener("DOMContentLoaded", setupMainPage);
$startButton.addEventListener("click", setupQuestionsPage);
$highScoreButton.addEventListener("click", setupHighScorePage);
$mainPageButton.addEventListener("click", setupMainPage);
$mainPageButton2.addEventListener("click", setupMainPage);
$highScoreButton2.addEventListener("click", setupHighScorePage);
$answerCol.addEventListener("click", function(evt){
    if(evt.target.matches("button")){
        checkAnswer(evt.target.value);
    }
});