//1:17:10
//select elements
let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let bullets = document.querySelector(".bullets");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answer-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");


//set Options
let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval = 0;

function getQuestions() {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questionObject = JSON.parse(this.responseText);
            let questionsCount = questionObject.length;

            // Create bullets + set questions count
            createBullets(questionsCount);

            //Add question Data
            addQuestionData(questionObject[currentIndex], questionsCount);

            //Countdown Intrval
            countDown(5, questionsCount);

            //click on submit
            submitButton.onclick = () => {
                //get right answer
                let theRightAnswer = questionObject[currentIndex].right_answer;
                console.log(theRightAnswer);

                //Increase Index
                currentIndex++;

                //check the answer
                checkAnswer(theRightAnswer, questionsCount);

                //remove previous question
                quizArea.innerHTML = '';
                answerArea.innerHTML = '';

                //Add Next question Data
                addQuestionData(questionObject[currentIndex], questionsCount);


                //handel Bullets class
                handleBullets();

                //Countdown Intrval
                countDown(5, questionsCount);

                //Show Results
                showResults(questionsCount);

            };

        }
    };

    myRequest.open("GET", "js/html_questions.json", true);

    myRequest.send();
}

getQuestions();

function createBullets(num) {
    countSpan.innerHTML = num;

    //create spans
    for (let i = 0; i < num; i++) {
        //create Bullet
        let theBullet = document.createElement("span");

        // check if its first span
        if (i === 0) {
            theBullet.className = "on";
        }

        //Append Bullets to main bullet container
        bulletsSpanContainer.appendChild(theBullet);
    }
}

function addQuestionData(obj, count) {

    if (currentIndex < count) {

        //creat h2 question title
        let questionTitle = document.createElement("h2");

        //create question text
        let questionText = document.createTextNode(obj['title']);

        //Append Text to heading
        questionTitle.appendChild(questionText);

        //Append question Title to quiz area
        quizArea.appendChild(questionTitle);

        //Create The Answer 
        for (let i = 1; i <= 4; i++) {
            //create Main Answer div
            let mainDiv = document.createElement("div");
            mainDiv.className = "answer";

            //create Radio input
            let radioInput = document.createElement("input");

            //Add type + name + id +data-attribute
            radioInput.name = "question";
            radioInput.type = "radio";
            radioInput.id = `answer_${i}`;
            radioInput.dataset.answer = obj[`answer_${i}`];

            // craeteLable
            let theLabel = document.createElement("label");

            //Add for attribute
            theLabel.htmlFor = `answer_${i}`;

            //create label text
            let theLableText = document.createTextNode(obj[`answer_${i}`]);

            //Add the text to thelable
            theLabel.appendChild(theLableText);

            //Add the radio + the label to main div
            mainDiv.appendChild(radioInput);
            mainDiv.appendChild(theLabel);

            //Add answers to Answer Area
            answerArea.appendChild(mainDiv);
        }
    }

}

function checkAnswer(right, count) {

    let answers = document.getElementsByName("question");
    let theChoosenAnswer;

    for (let i = 0; i < answers.length; i++) {
        if (answers[i].checked) {
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }

    if (right === theChoosenAnswer) {
        rightAnswers++;
    }
}

function handleBullets() {

    let bulletsSpan = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletsSpan);

    arrayOfSpans.forEach((span, index) => {

        if (currentIndex === index) {
            span.className = "on";
        }
    });
}

function showResults(count) {

    let theResults;
    if (currentIndex === count) {
        quizArea.remove();
        answerArea.remove();
        submitButton.remove();
        bullets.remove();

        if (rightAnswers > (count / 2) && rightAnswers < count) {
            theResults = `<span class= "good">Good</span> , ${rightAnswers} from ${count} `;
        } else if (rightAnswers === count) {
            theResults = `<span class= "perfect">Perfect </span> , All Answers Right `;
        } else {
            theResults = `<span class= "bad">Try Again </span> , ${rightAnswers} from ${count}  `;
        }
        resultsContainer.innerHTML = theResults;
        resultsContainer.style.padding = '10px';
        resultsContainer.style.marginTop = '10px';
        resultsContainer.style.backgroundColor = 'white';
    }
}

function countDown(duration, count) {
    if ( currentIndex < count ) {
        let minutes, seconds;
        countdownInterval  = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}`: minutes;
            seconds = seconds < 10 ? `0${seconds}`: seconds;

            countdownElement.innerHTML = `${minutes} : ${seconds}`;

            if( --duration < 0 ) {
                clearInterval(countdownInterval);
                console.log("finished");
                submitButton.click();
            }
        }, 1000)
    }
}