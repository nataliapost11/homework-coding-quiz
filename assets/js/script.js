// JSON data array holding list of questions, options and correct answers 
var questions = [{
        text: "Commonly used data types DO NOT include:",
        options: ["strings", "booleans", "alerts", "numbers"],
        answer: "alerts"
    },
    {
        text: "The condition in an if / else statement is enclosed within ______.",
        options: ["quotes", "curly brackets", "parantheses", "square brackets"],
        answer: "parantheses"
    },
    {
        text: "Arrays in JavaScript can be used to store _______.",
        options: ["numbers and strings", "other arrays", "booleans", "all of the above"],
        answer: "all of the above"
    }
];



//Common variables/constants used in the app
var timerHandler = null;
const durationPerQuestion = 30;
const penalizedScoreTime = 10;


var timerEl = document.querySelector("#timer");
var questionOptionsEl = document.querySelector("#questionOptions");
var initialsEl = document.querySelector("#txtInitials");

//The quizApp object holds all common data and related functions used for the quiz 
var quizApp = {
    timerValue: 0, //The current timer value
    score: 0, //The current score
    currentQnIndex: -1, //The current question index (default set as -1 as its incremented in showQueston function)

    //Show only the specified section with id as sectionid parameter
    showSection: function (sectionId) {
        //Hide all sections
        var allSections = document.querySelectorAll("main > section");
        for (var i = 0; i < allSections.length; i++) {
            allSections[i].setAttribute("style", "display:none");
        }
        //Show selected section
        var sectionEl = document.querySelector("#" + sectionId);
        sectionEl.setAttribute("style", "display:block;");
    },

};

//Count down the allowed score time
function countDownTime() {
    quizApp.timerValue--;

    if (quizApp.timerValue < 0) quizApp.timerValue = 0;
    timerEl.innerHTML = quizApp.timerValue;

    if (quizApp.timerValue <= 0 || quizApp.currentQnIndex >= questions.length) {
        clearInterval(timerHandler);
        showResult();
    }
}

//Starts the Quiz Mode
function startQuiz() {
    //Allocate total time based on time per questions
    quizApp.score = 0;
    quizApp.currentQnIndex = -1;
    quizApp.timerValue = questions.length * durationPerQuestion;
    timerHandler = setInterval(countDownTime, 1000);
    showQuestion();
}

//Display the current question and the available options
function showQuestion() {
    quizApp.currentQnIndex++;
    if (quizApp.timerValue <= 0 || quizApp.currentQnIndex >= questions.length) {
        clearInterval(timerHandler);
        showResult();
        return;
    }

    quizApp.showSection("questionSection");
    var questionTextEl = document.querySelector("#questionText");
    var questionOptionsEl = document.querySelector("#questionOptions");

    //Get the current question object
    var questionItem = questions[quizApp.currentQnIndex];

    //Clear all options elements
    while (questionOptionsEl.children.length) {
        questionOptionsEl.removeChild(questionOptionsEl.children[questionOptionsEl.children.length - 1]);
    }

    //Display current question text
    questionTextEl.innerHTML = questionItem.text;
    for (var i = 0; i < questionItem.options.length; i++) {
        var optionItemEl = document.createElement("li");
        optionItemEl.innerHTML = (i + 1) + ". " + questionItem.options[i];
        optionItemEl.setAttribute("data-text", questionItem.options[i]);
        questionOptionsEl.appendChild(optionItemEl);
    }
}

//Display the results section with final score
function showResult() {
    //Hide all non-applicable sections
    quizApp.showSection("resultSection");
    var finalScoreEl = document.querySelector("#finalScore");
    finalScoreEl.textContent = quizApp.score;
    quizApp.timerValue = 0;
    timerEl.innerHTML = quizApp.timerValue;
    initialsEl.value = "";
}

//Display the Highscores section
function showHighScores() {
    quizApp.showSection("highScores");

    var highScoresListJson = localStorage.getItem("high-scores");
    console.log(highScoresListJson);
    var highScoresList = [];

    if (highScoresListJson != null) highScoresList = JSON.parse(highScoresListJson);

    var highScoresListEl = document.querySelector("#highScoresList");

    //Clear all options elements
    while (highScoresListEl.children.length) {
        highScoresListEl.removeChild(highScoresListEl.children[highScoresListEl.children.length - 1]);
    }

    for (var i = 0; i < highScoresList.length; i++) {
        var scoreItemEl = document.createElement("div");
        scoreItemEl.innerHTML = (i + 1) + ". " + highScoresList[i].initial + " - " + highScoresList[i].score;
        highScoresListEl.appendChild(scoreItemEl);
    }
}

//Validate the user selected answer against the correct answer for the question
function validateAnswer(event) {

    var questionOptionsEl = document.querySelector("#questionOptions");
    var selectedOptionEl = event.target;
    if (questionOptionsEl == event.target) return; //Clicked on any space between the option items do no action

    selectedOptionEl.className = "selected-option";
    var selectedAnswer = selectedOptionEl.dataset.text;
    var resultTextEl = document.querySelector("#resultText");

    //Get the current question object
    var questionItem = questions[quizApp.currentQnIndex];

    if (selectedAnswer == questionItem.answer) {
        resultTextEl.innerHTML = "Correct!";
        quizApp.score++;
    } else {
        resultTextEl.innerHTML = "Wrong!";
        quizApp.timerValue -= penalizedScoreTime;
    }

    //Give 1 second to display the selected answer
    setTimeout(showQuestion, 1000);
}

//Save the results to the local storage
function submitResult() {
    
    var highScoreObj = {
        initial: initialsEl.value,
        score: quizApp.score
    };

    var highScoresListJson = localStorage.getItem("high-scores");
    var highScoresList = [];

    if (highScoresListJson != null) highScoresList = JSON.parse(highScoresListJson);
    highScoresList.push(highScoreObj);
    localStorage.setItem("high-scores", JSON.stringify(highScoresList));
    showHighScores();
}

function clearHighScores() {
    localStorage.removeItem("high-scores");
    showHighScores();
}

//Display the first section which is the instructions for the user
function showInstructions() {
    quizApp.showSection("instructionSection");
}

function initialize() {

    var startButton = document.querySelector("#btnStart");
    var submitResultButton = document.querySelector("#btnSubmitResult");
    var viewHighscoresButton = document.querySelector("#btnViewHighscores");
    var clearHighscoresButton = document.querySelector("#btnClearHighscores");
    var goBackButton = document.querySelector("#btnGoBack");

    startButton.addEventListener("click", startQuiz);

    questionOptions.addEventListener("click", validateAnswer);

    submitResultButton.addEventListener("click", submitResult);

    viewHighscoresButton.addEventListener("click", showHighScores);

    clearHighscoresButton.addEventListener("click", clearHighScores);

    goBackButton.addEventListener("click", showInstructions);

    quizApp.showSection("instructionSection");
}

initialize();