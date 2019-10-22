var $mainHeaderSection = $("#header-row-main");
var $questionsSection = $("#header-row-questions");
var $scoreSection = $("#header-row-score");
var $highScoreSection = $("#header-row-high-score");
var $timePerQuestion = $(".time-per-q");
var timePerQuestion = 15;
var $pointsPerQuestion = $(".points-per-q");
var pointsPerQuestion = 0;
var questionsList = [];
var $numOfQuestions = $(".num-of-q");
var randomQuestion = [];
var currentTimer = 0;
var currentScore = 0;
var numCorrect = 0;
var timerInterval = 0;
var $questionText = $("#question");
var $answerSection = $("#answer-col");
var $timerText = $("#timer-text");
var $currentQuestionNum = $("#current-q-num");
var correctAnswer = "";
var $totalNumOfQuestions = $("#total-q-num");
var $answerImage = $("#answerImage");
var modal = document.getElementById("myModal");
var lHighScores = JSON.parse(localStorage.getItem("high-scores"));
var $hrDivider = $("#hr-divider-score");
var $highScoreAchived = $("#high-score-achived");
var $highScoreInput = $("#enter-name");
var $submitHighScoreButton = $("#submit-high-score-btn");
var $firstPlaceName = $("#first-place-name");
var $firstPlaceScore = $("#first-place-score");
var $secondPlaceName = $("#second-place-name");
var $secondPlaceScore = $("#second-place-score");
var $thirdPlaceName = $("#third-place-name");
var $thirdPlaceScore = $("#third-place-score");
var newHighScore = 0;
var newHighScorePos = 0;

function setupMainPage() {
    //SHOWING MY MAIN PAGE DIVS
    $mainHeaderSection.removeClass("d-none");
    //HIDING EVERYTHING ELSE
    $questionsSection.addClass("d-none");
    $scoreSection.addClass("d-none");
    $highScoreSection.addClass("d-none");
    whichQuiz = $("#question-selector")[0].checked;
    if (whichQuiz) {
        //LONG QUIZ
        questionList = questions;
    } else {
        //Short Quiz
        questionList = questionsShort;
    }
    $timePerQuestion.text(timePerQuestion);
    pointsPerQuestion = (100 / questionList.length);
    $pointsPerQuestion.text(Math.round(pointsPerQuestion));
    $numOfQuestions.text(questionList.length);
}

function setupQuestionsPage() {
    //SHOWING MY QUESTIONS DIVS
    $questionsSection.removeClass("d-none");
    //HIDING EVERYTHING ELSE
    $mainHeaderSection.addClass("d-none");
    $scoreSection.addClass("d-none");
    $highScoreSection.addClass("d-none");

    //CREATING A NUMBER ARRAY TO KEEP KNOW WHAT QUESTIONS WERE USED
    //WHEN I USE A QUESTION NUMBER IT IS REMOVED FROM THIS ARRAY
    //AND CAN NOT BE USED AGAIN
    for (i = 0; i < questionList.length; i++) {
        randomQuestion[i] = i;
    }

    //INITIALIZING MY INTERVAL AND MY COUNTDOWN TIMER
    currentTimer = timePerQuestion * questionList.length;
    $timerText.text(fmtMSS(currentTimer));
    timerInterval = setInterval(function () {
        currentTimer--;
        $timerText.text(fmtMSS(currentTimer));
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
    $questionText.text(questionList[currentQuestion].title);
    //CLEAR PREVIOUS BUTTONS START WITH A CLEAN SLATE
    $answerSection.text("");
    //LOOP OVER EACH ANSWER AND BUILD ITS BUTTON AND PUT IT ON THE PAGE
    for (i = 0; i < questionList[currentQuestion].choices.length; i++) {
        var thisChoice = questionList[currentQuestion].choices[i];
        $answerSection.append(
            $("<div>").attr("class", "row").append(
                $("<div>").attr("class", "col").append(
                    $("<button>").attr("class", "btn").attr("id", "answer" + i).attr("value", thisChoice).text(thisChoice)
                )
            )
        );
    }

    $currentQuestionNum.text(questionList.length - randomQuestion.length);
    correctAnswer = questionList[currentQuestion].answer;
    $totalNumOfQuestions.text(questionList.length);
}

function checkAnswer(selectedAnswer) {
    modal.style.display = "block";
    //CHECK THE ANSWER
    if (selectedAnswer === correctAnswer) {
        $answerImage.attr("src", "assets/images/checkmark.png");
        currentScore = currentScore + pointsPerQuestion;
        numCorrect++;
    } else {
        //IF THEY GET IT WRONG APPLY 15 SEC PENALTY TO THE ACTIVE TIME
        currentTimer = currentTimer - timePerQuestion;

        $answerImage.attr("src", "assets/images/xmark.png");
    }

    //2 SECOND PAUSE TO SHOW THE CHECK OR X
    setTimeout(function () {
        //HIDE THE MODAL
        modal.style.display = "none";
        //ADD THE 2 SECOND WAIT BACK ON TO THE TIMER
        currentTimer = currentTimer + 2;
        //SEE IF I HAVE RUN OUT OF QUESTIONS
        if (randomQuestion.length > 0 && currentTimer > 0) {
            runQuestion();
        } else {
            clearInterval(timerInterval);
            endQuiz();
        }
    }, 2000);
}

function endQuiz() {
    //SHOW MY ENDING SCORE SCREEN
    $scoreSection.removeClass("d-none");
    //HIDING EVERYTHING ELSE
    $questionsSection.addClass("d-none");
    $mainHeaderSection.addClass("d-none");
    $highScoreSection.addClass("d-none");
    $hrDivider.addClass("d-none");
    $highScoreAchived.addClass("d-none");

    //REFINE THE NUMBERS A BIT
    currentScore = Math.round(currentScore);
    var finalScore = currentScore + currentTimer;
    if (finalScore < 0) { finalScore = 0 }
    //SEND THE STATS TO THE MAIN PAGE
    $("#quiz-score").text(finalScore);
    $("#num-correct").text(numCorrect);
    $("#points-earned").text(currentScore);
    $("#time-bonus").text(currentTimer);
    $("#elapsed-time").text(fmtMSS((timePerQuestion * questionList.length) - currentTimer));

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
        $hrDivider.removeClass("d-none");
        $highScoreAchived.removeClass("d-none disabled");
        $answerSection.text("");
        $highScoreInput.prop("disabled", false);
        $submitHighScoreButton.prop("disabled", false);
        $highScoreInput.val("");
        //PASSING THE SCORE AND THE POSITION TO HIDDEN FIELDS SO WE DON'T HAVE TO GRAB AGAIN
        //I COULD HAVE USED GLOBAL VARS FOR THIS BUT I WANTED TO TRY HIDDEN FIELDS
        
        newHighScore = finalScore;
        newHighScorePos = i;
    }

    //RESET THE TRACKING VARS SO THEY DON'T KEEP BUILDING INTO THE NEXT QUIZ SESS
    numCorrect = 0;
    currentScore = 0;
    currentTimer = 0;
}

function processHighScore() {
    $highScoreInput.prop("disabled", true);
    $submitHighScoreButton.prop("disabled", true);
    $highScoreAchived.addClass("disabled");
    //USE SPLICE TO INSERT THE SCORE WHERE IT GOES
    if (lHighScores) {
        //SPLICE OUR NEW SCORE IN
        lHighScores.splice(newHighScorePos, 0, { name: $highScoreInput.val(), score: newHighScore});
    } else {
        //IF THIS IS THE FIRST TIME THEN INITIALIZE THE ARRAY AND POPULATE
        lHighScores = [];
        lHighScores[0] = { name: $highScoreInput.val(), score: newHighScore};
    }
    //I ONLY WANT TO KEEP 3 SCORES SO WE TRIM OFF THE LOWEST
    while (lHighScores.length > 3) { lHighScores.pop() }
    localStorage.setItem("high-scores", JSON.stringify(lHighScores));
}

function setupHighScorePage() {
    //SHOWING ALL OF THE HIGH SCORE DIVS
    $highScoreSection.removeClass("d-none");
    //HIDING EVERYTHING ELSE
    $scoreSection.addClass("d-none");
    $questionsSection.addClass("d-none");
    $mainHeaderSection.addClass("d-none");;
    if (lHighScores && lHighScores[0]) {
        $firstPlaceName.text(lHighScores[0].name);
        $firstPlaceScore.text(lHighScores[0].score);
    }
    if (lHighScores && lHighScores[1]) {
        $secondPlaceName.text(lHighScores[1].name);
        $secondPlaceScore.text(lHighScores[1].score);
    }
    if (lHighScores && lHighScores[2]) {
        $thirdPlaceName.text(lHighScores[2].name);
        $thirdPlaceScore.text(lHighScores[2].score);
    }
}

//Event Listeners
window.addEventListener("DOMContentLoaded", setupMainPage);
$("#start-btn").on("click", setupQuestionsPage);
$("#main-page-btn").on("click", setupMainPage);
$("#main-page-btn2").on("click", setupMainPage);
$("#high-score-btn").on("click", setupHighScorePage);
$("#high-score-btn2").on("click", setupHighScorePage);
$("#question-selector").on("click", setupMainPage);
$answerSection.on("click", function (evt) {
    if (evt.target.matches("button")) {
        checkAnswer(evt.target.value);
    }
});
$("#high-score-form").submit(function (event) {
    event.preventDefault();
    var highScoreFormText = $highScoreInput.val().trim();
    // Return from function early if submitted todoText is blank
    if (highScoreFormText === "") {
        return;
    }
    processHighScore();
});

$("#clear-scores-btn").on("click", function () {
    lHighScores = [];
    localStorage.removeItem("high-scores");
    $firstPlaceName.text("Your name here?");
    $firstPlaceScore.text("Are you the best?");
    $secondPlaceName.text("Whats your name?");
    $secondPlaceScore.text("Points for this place?");
    $thirdPlaceName.text("New Game");
    $thirdPlaceScore.text("Who dis?");
    setupHighScorePage();
});

//Yes I borrowed this from Google. s is the seconds passed in
//Divide those seconds by 60 and subtract from the original seconds passed in
//divide all of that by 60 to get the minutes. The remainins seconds are then added to the end
//It adds : unless the seconds are less that 9, the it adds :0
function fmtMSS(s) { return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s }