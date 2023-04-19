// Select Elements
let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer =document.querySelector(".bullets .spans")
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
//Set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;
function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText);
            let questionsCount = questionsObject.length;
            // Create Bullets + Set Questions Count
            createBullets(questionsCount);
            // Add Question Data
            addQuestionData(questionsObject[currentIndex], questionsCount);
            //Start CountDown
            countdown(120, questionsCount);
            //Click on Submit
            submitButton.onclick = () => {
                //Get Right Answer
                let theRightAnswer = questionsObject[currentIndex].right_answer;
                //Increase Index 
                currentIndex++;
                // Check The Answer
                checkAnswer(theRightAnswer, questionsCount);
                // Remove Previous Questions 
                quizArea.innerHTML = "";
                answersArea.innerHTML = "";
                 // Add Question Data
                addQuestionData(questionsObject[currentIndex], questionsCount)
                //Handle Bullets Class
                handleBullets();
                // Start CountDown
                clearInterval(countdownInterval);
                countdown(150,questionsCount)
                 // Show Results
                showResults(questionsCount);

            };
        };
    };
    myRequest.open("GET", "html_questions.json",true);
    myRequest.send("");
}
getQuestions();
function createBullets(num) {
    countSpan.innerHTML = num;
    //create spans
    for (let i = 0; i < num; i++){
    //Create Bullet
        let theBullet = document.createElement("span");
        // Check If Its First Span
        if (i === 0) {
            theBullet.className = "on";
        }
        // Append Bullets To Main Bullet Container
        bulletsSpanContainer.append(theBullet);
    }
}

function addQuestionData(obj, count) {
    if (currentIndex < count) {
//Create H2 Question Title
    let questionTitle = document.createElement("h2")
//Create Question Text
    let questionText = document.createTextNode(obj["title"]);
        // Append Text To H2
    questionTitle.appendChild(questionText);
    // Append The H2 To The Quiz Area
    quizArea.appendChild(questionTitle);
    //Create The Answer
    for (let i = 1; i <= 4;i++){
        let mainDiv = document.createElement("div");
        mainDiv.className = "answer";
    //Create Radio Input 
        let radioInput = document.createElement("input");
        radioInput.name = "question";
        radioInput.type = "radio";
        radioInput.id = `answer_${i}`
        radioInput.dataset.answer = obj[`answer_${i}`];
    //Make First Option Selected
        if (i===1) {
        radioInput.checked=true
        }
    //Create Label
        let theLabel = document.createElement("label");
    //Add For Attribute
        theLabel.htmlFor = `answer_${i}`;
    //Create Label Text
        let theLabelText = document.createTextNode(obj[`answer_${i}`]);
 // Add The Text To Label
        theLabel.appendChild(theLabelText);
// Add Input + Label To Main Div
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);

    //Append All Divs To Answers Area
        answersArea.appendChild(mainDiv);
        }
    }
}
function checkAnswer(rAnswer,count) {
    let answers = document.getElementsByName("question")
    let theChosenAnswer;
    for (let i = 0; i < answers.length;i++){
        if (answers[i].checked) {
            theChosenAnswer = answers[i].dataset.answer;
        }
    }
    if (rAnswer===theChosenAnswer) {
        rightAnswers++;
    }

}
function handleBullets() {
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpans);
    arrayOfSpans.forEach((span,index) => {
        if (currentIndex===index) {
            span.className = "on";
        }
    })
}
function showResults(count) {
    let theResults;
    if (currentIndex === count) {
        quizArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();
        if (rightAnswers > count / 2 && rightAnswers < count ) {
            theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
        } else if(rightAnswers===count){
            theResults = `<span class ="prefect">Prefect</span> All Answer Is Good`;
        } else {
            theResults = `<span class ="bad">Bad</span>, ${rightAnswers} From ${count}`;
        }
        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = "10px";
        resultsContainer.style.background = "white"
        resultsContainer.style.marginTop = "10px";
    }
}
function countdown(duration,count) {
if (currentIndex<count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
        minutes = parseInt(duration / 60);
        seconds = parseInt(duration % 60);
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;
        countdownElement.innerHTML = `${minutes}: ${seconds}`;
        if (--duration<0) {
            clearInterval(countdownInterval);
            submitButton.onclick();
        }
    },1000)
}
}








































































































































