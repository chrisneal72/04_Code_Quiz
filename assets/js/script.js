var $headerRow = document.getElementById("header-row");
var $mainHeaderCol = document.getElementById("main-header-col");
var $quizHeaderCol = document.getElementById("quiz-header-col");
var $highScoreHeaderCol = document.getElementById("high-score-header-col");
var $endScoreHeaderCol = document.getElementById("end-score-header-col");
var $timePerQuestion = document.querySelector(".time-per-q");
var $pointsPerQuestion = document.querySelector(".points-per-q");
var $numOfQuestions = document.querySelector(".num-of-q");
var $answerRow = document.getElementById("answer-row");
var $answerCol = document.getElementById("answer-col");
var $timerDiv = document.getElementById("timerDiv");
var $qTrackerDiv = document.getElementById("qTrackerDiv");
var $question = document.getElementById("question");
var $startButton = document.getElementById("start-btn");
var $highScoreButton = document.getElementById("high-score-btn");
var $mainPageButton = document.getElementById("main-page-btn");
var $mainPageButton2 = document.getElementById("main-page-btn2");
var $highScoreButton2 = document.getElementById("high-score-btn2");
var $submitHighScoreButton = document.getElementById("submit-high-score-btn");
var $hrDivider = document.getElementById("hr-divider");
var $currentScore = document.getElementById("current-score");
var $highScoreAchived = document.getElementById("high-score-achived");
var $highScoreForm = document.getElementById("high-score-form");
var $highScoreInput = document.getElementById("enter-name");
var $newHighScore = document.getElementById("new-high-score");
var $newHighScorePos = document.getElementById("new-high-score-position");
var $firstPlaceName = document.getElementById("first-place-name");
var $firstPlaceScore = document.getElementById("first-place-score");
var $secondPlaceName = document.getElementById("second-place-name");
var $secondPlaceScore = document.getElementById("second-place-score");
var $thirdPlaceName = document.getElementById("third-place-name");
var $thirdPlaceScore = document.getElementById("third-place-score");
var questionCounter;
var timePerQuestion = 15;
var timerInterval;
var currentTimer = 0;
var randomQuestion = [];
var correctAnswer;
var numCorrect = 0;
var currentScore = 0;
var pointsPerQuestion = (100 / questions.length);
var lHighScores = JSON.parse(localStorage.getItem("high-scores"));
console.log(lHighScores);

function setupMainPage() {
    //SHOWING MY MAIN PAGE DIVS
    $headerRow.setAttribute("class", "row header-row-m align-items-center");
    $mainHeaderCol.setAttribute("class", "col");
    //HIDING EVERYTHING ELSE
    $quizHeaderCol.setAttribute("class", "col d-none");
    $highScoreHeaderCol.setAttribute("class", "col d-none");
    $endScoreHeaderCol.setAttribute("class", "col d-none");
    $timerDiv.setAttribute("class", "timerDiv d-none");
    $qTrackerDiv.setAttribute("class", "qTrackerDiv d-none");
    $hrDivider.setAttribute("class", "d-none");
    $answerRow.setAttribute("class", "d-none");
    //IF I CHANGE THE QUESTIONS (ADD OR SUBTRACT THESE NUMBERS WILL UPDATE
    $timePerQuestion.innerHTML = timePerQuestion;
    $pointsPerQuestion.innerHTML = Math.round(pointsPerQuestion);
    $numOfQuestions.innerHTML = questions.length;
}

function setupHighScorePage() {
    //SHOWING ALL OF THE HIGH SCORE DIVS
    $headerRow.setAttribute("class", "row header-row-m align-items-center");
    $highScoreHeaderCol.setAttribute("class", "col");
    //HIDING EVERYTHING ELSE
    $mainHeaderCol.setAttribute("class", "col d-none");
    $quizHeaderCol.setAttribute("class", "col d-none");
    $endScoreHeaderCol.setAttribute("class", "col d-none");
    $timerDiv.setAttribute("class", "timerDiv d-none");
    $qTrackerDiv.setAttribute("class", "qTrackerDiv d-none");
    $hrDivider.setAttribute("class", "d-none");
    $answerRow.setAttribute("class", "row d-none");
    $currentScore.setAttribute("class", "row d-none");
    $highScoreAchived.setAttribute("class", "row d-none");
    if (lHighScores[0]) {
        $firstPlaceName.innerHTML = lHighScores[0].name;
        $firstPlaceScore.innerHTML = lHighScores[0].score;
    }
    if (lHighScores[1]) {
        $secondPlaceName.innerHTML = lHighScores[1].name;
        $secondPlaceScore.innerHTML = lHighScores[1].score;
    }
    if (lHighScores[2]) {
        $thirdPlaceName.innerHTML = lHighScores[2].name;
        $thirdPlaceScore.innerHTML = lHighScores[2].score;
    }
}

function setupQuestionsPage() {
    //SHOWING THE REQUIRED QUESTION DIVS
    $headerRow.setAttribute("class", "row header-row-q align-items-center");
    $quizHeaderCol.setAttribute("class", "col");
    $timerDiv.setAttribute("class", "timerDiv");
    $qTrackerDiv.setAttribute("class", "qTrackerDiv");
    $hrDivider.setAttribute("class", "row");
    $answerRow.setAttribute("class", "row  answer-row");
    //HIDING EVERTHING ELSE
    $mainHeaderCol.setAttribute("class", "col d-none");
    $highScoreHeaderCol.setAttribute("class", "col d-none");
    $endScoreHeaderCol.setAttribute("class", "col d-none");
    $highScoreAchived.setAttribute("class", "row d-none");

    //CREATING A NUMBER ARRAY TO KEEP KNOW WHAT QUESTIONS WERE USED
    //WHEN I USE A QUESTION NUMBER IT IS REMOVED FROM THIS ARRAY
    //AND CAN NOT BE USED AGAIN
    for (i = 0; i < questions.length; i++) {
        randomQuestion[i] = i;
    }

    //INITIALIZING MY INTERVAL AND MY COUNTDOWN TIMER
    currentTimer = timePerQuestion * questions.length;
    $timerDiv.children[0].innerHTML = currentTimer;
    timerInterval = setInterval(function () {
        currentTimer--;
        $timerDiv.children[0].innerHTML = currentTimer;

        if (currentTimer < 1) {
            clearInterval(timerInterval);
            endQuiz();
        }

    }, 1000);

    //TIME TO START ASKING QUESTIONS
    runQuestion();
}

function runQuestion() {
    //THIS TAKES OUT A RANDOM NUMBER FROM THE ARRAY
    //THE LENGTH OF THE ARRAY GETS SHORTER BUT 
    //I'M USING THE VALUES TO MATCH TO THE QUESTION ARRAY'S INDEX
    //SO IF THE VALUE 3 IS MISSING, I CAN NOT GRAB THAT INDEX AGAIN
    var currentQuestion = randomQuestion.splice(Math.floor(Math.random() * randomQuestion.length), 1);
    //POPULATE THE QUESTION IN THE QUESTION DIV
    $question.innerHTML = questions[currentQuestion].title;
    //CLEAR PREVIOUS BUTTONS START WITH A CLEAN SLATE
    $answerCol.innerHTML = '';
    //LOOP OVER EACH ANSWER AND BUILD ITS BUTTON AND PUT IT ON THE PAGE
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
    
    $qTrackerDiv.children[0].innerHTML = questions.length - randomQuestion.length;
    $qTrackerDiv.children[1].innerHTML = questions.length;
}

function checkAnswer(selectedAnswer) {
    //CHECK THE ANSWER
    if (selectedAnswer === correctAnswer) {
        currentScore = currentScore + pointsPerQuestion;
        numCorrect++;
    } else {
        //IF THEY GET IT WRONG APPLY 15 SEC PENALTY TO THE ACTIVE TIME
        currentTimer = currentTimer - timePerQuestion;
    }
    //SEE IF I HAVE RUN OUT OF QUESTIONS
    if (randomQuestion.length > 0 && currentTimer > 0) {
        runQuestion();
    } else {
        clearInterval(timerInterval);
        endQuiz();
    }
}

function endQuiz() {
    //SHOW MY ENDING SCORE SCREEN
    $headerRow.setAttribute("class", "row header-row-m align-items-center");
    $endScoreHeaderCol.setAttribute("class", "col");
    $currentScore.setAttribute("class", "row");
    var $quizScore = document.getElementById("quiz-score");
    //HODE EVERTHING ELSE
    $mainHeaderCol.setAttribute("class", "col d-none");
    $quizHeaderCol.setAttribute("class", "col d-none");
    $highScoreHeaderCol.setAttribute("class", "col d-none");
    $timerDiv.setAttribute("class", "timerDiv d-none");
    $qTrackerDiv.setAttribute("class", "qTrackerDiv d-none");
    $hrDivider.setAttribute("class", "d-none");
    $answerRow.setAttribute("class", "row d-none");
    $highScoreAchived.setAttribute("class", "row d-none");

    //REFINE THE NUMBERS A BIT
    currentScore = Math.round(currentScore);
    var finalScore = currentScore + currentTimer;
    if (finalScore < 0) { finalScore = 0 }
    //SEND THE STATS TO THE MAIN PAGE
    document.getElementById("quiz-score").innerHTML = finalScore;
    document.getElementById("num-correct").innerHTML = numCorrect;
    document.getElementById("points-earned").innerHTML = currentScore;
    document.getElementById("time-bonus").innerHTML = currentTimer;
    document.getElementById("elapsed-time").innerHTML = (timePerQuestion * questions.length) - currentTimer;

    //CHECK CURRENT FINAL SCORE TO THE HIGH SCORES STORED IN LOCAL-STORAGE
    var isGreater = false;
    var i = 0;
    if (finalScore > 5 && lHighScores) {
        while (i < lHighScores.length && !isGreater) {
            if (finalScore > lHighScores[i].score) {
                isGreater = true;
            } else {
                i++;
            }
        }
    }
    //IF THIS QUALIFIES AS A NEW HIGH SCORE WE WILL PRESENT THAT ABILITY TO SAVE
    if ((finalScore > 5 && !lHighScores) || (finalScore > 5 && lHighScores.length < 3) || isGreater) {
        //PRESENT HIGH SCORE DIVS   
        $headerRow.setAttribute("class", "row header-row-f align-items-center");
        $highScoreAchived.setAttribute("class", "row");
        $hrDivider.setAttribute("class", "row");
        $answerRow.setAttribute("class", "row  answer-row-f");
        $answerCol.innerHTML = '';
        $highScoreInput.disabled = false;
        $submitHighScoreButton.disabled = false;
        $highScoreInput.value = ''
        //PASSING THE SCORE AND THE POSITION TO HIDDEN FIELDS SO WE DON'T HAVE TO GRAB AGAIN
        //I COULD HAVE USED GLOBAL VARS FOR THIS BUT I WANTED TO TRY HIDDEN FIELDS
        $newHighScore.value = finalScore;
        $newHighScorePos.value = i;
    }

    //RESET THE TRACKING VARS SO THEY DON'T KEEP BUILDING INTO THE NEXT QUIZ SESS
    numCorrect = 0;
    currentScore = 0;
    currentTimer = 0;
}

function processHighScore() {
    $highScoreInput.disabled = true;
    $submitHighScoreButton.disabled = true;
    $highScoreAchived.setAttribute("class", "row disabled");
    //USE SPLICE TO INSERT THE SCORE WHERE IT GOES
    if (lHighScores) {
        //SPLICE OUR NEW SCORE IN
        lHighScores.splice($newHighScorePos.value, 0, { name: $highScoreInput.value, score: $newHighScore.value });
    } else {
        //IF THIS IS THE FIRST TIME THEN INITIALIZE THE ARRAY AND POPULATE
        lHighScores = [];
        lHighScores[0] = { name: $highScoreInput.value, score: $newHighScore.value };
    }
    //I ONLY WANT TO KEEP 3 SCORES SO WE TRIM OFF THE LOWEST
    while (lHighScores.length > 3) { lHighScores.pop() }
    localStorage.setItem("high-scores", JSON.stringify(lHighScores));
}

//Event Listeners
window.addEventListener("DOMContentLoaded", setupMainPage);
$startButton.addEventListener("click", setupQuestionsPage);
$highScoreButton.addEventListener("click", setupHighScorePage);
$mainPageButton.addEventListener("click", setupMainPage);
$mainPageButton2.addEventListener("click", setupMainPage);
$highScoreButton2.addEventListener("click", setupHighScorePage);
$answerCol.addEventListener("click", function (evt) {
    if (evt.target.matches("button")) {
        checkAnswer(evt.target.value);
    }
});
$highScoreForm.addEventListener("submit", function (event) {
    event.preventDefault();
    var highScoreFormText = $highScoreInput.value.trim();
    // Return from function early if submitted todoText is blank
    if (highScoreFormText === "") {
        return;
    }
    processHighScore();
});