// Hämta element från HTML
const startButton = document.querySelector('.start-btn button');
const infoBox = document.querySelector('.info-box');
const quizBox = document.querySelector('.quiz-box');
const questionText = document.querySelector('.que-text');
const optionList = document.querySelector('.option-list');
const resultBox = document.querySelector('.result-box');
const timerSec = document.querySelector('.timer-sec');
const infoBoxContinueBtn = document.querySelector('.info-box .alternative');
const infoBoxExitBtn = document.querySelector('.info-box .quit');
const nextButton = document.querySelector('.next-btn .next');
const replayButton = document.querySelector('.result-box .alternative');
const quitButton = document.querySelector('.result-box .quit');
const themeToggleBtn = document.getElementById('themeToggle');

let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = 0;
let timer;
let timeLeft = 15;

// Utility funktions :)
function switchDisplay(elementToShow, elementToHide) {
    elementToShow.style.display = 'block';
    elementToHide.style.display = 'none';
}
function addButtonListener(button, action) {
    button.addEventListener('click', action);
}
function resetGame() {
    const resultList = resultBox.querySelector('ul');
    if (resultList) {
        resultList.remove();
    }
    resultBox.querySelector('.score-text').textContent = '';
    resultBox.querySelector('.complete-text').textContent = '';
    clearInterval(timer); 
    resetTimer();
    currentQuestionIndex = 0;
    score = 0;
    answersStatus = [];
    userAnswers = [];
}

//All of the buttons funktion :)
addButtonListener(startButton, () => {
    switchDisplay(infoBox, startButton.parentElement);
});

addButtonListener(infoBoxExitBtn, () => {
    switchDisplay(startButton.closest('.start-btn'), infoBox);
});

addButtonListener(infoBoxContinueBtn, () => {
    switchDisplay(quizBox, infoBox);
    loadQuestion(); 
});

addButtonListener(nextButton, () => {
    nextQuestion(); 
});

addButtonListener(replayButton, () => {
    resetGame();
    loadQuestion(); 
    switchDisplay(quizBox, resultBox);
});

addButtonListener(quitButton, (event) => {
    event.preventDefault();
    resetGame();
    switchDisplay(startButton.parentElement, resultBox);
});

addButtonListener(themeToggleBtn, () => {
    document.body.classList.toggle('dark-mode');
});

// Timer :)
function resetTimer() {
    clearInterval(timer);
    timeLeft = 15;
    timerSec.textContent = timeLeft;
}

function startTimer() {
    resetTimer();
    timer = setInterval(() => {
        timeLeft--;
        timerSec.textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer); 
            nextQuestion(); 
        }
    }, 1000);
}

// Management of answers and questions :)
let answersStatus = []; 
let userAnswers = [];   

function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    questionText.textContent = currentQuestion.question;
    optionList.innerHTML = ''; 
    clearInterval(timer);
    startTimer(); 
    createQuestionOptions(currentQuestion);
}

function saveAnswer(questionIndex, selectedAnswer) {
    userAnswers[questionIndex] = selectedAnswer;
    const correctAnswer = questions[questionIndex].correctAnswer;
    if (selectedAnswer === correctAnswer) {
        answersStatus[questionIndex] = true; 
        score++; 
    } else {
        answersStatus[questionIndex] = false; 
    }
}

// Radiobuttons management :)
function createOption(option, optionIndex) {
    let optionElement = document.createElement('div');
    optionElement.classList.add('option');
    
    let input = document.createElement('input');
    let optionText = document.createElement('span');
    optionText.textContent = option;

    input.type = 'radio'; 
    input.name = `question-${currentQuestionIndex}`; 
    input.value = optionIndex;

    input.addEventListener('change', () => {
        saveAnswer(currentQuestionIndex, optionIndex); 
    });

    optionElement.appendChild(input);
    optionElement.appendChild(optionText);
    optionList.appendChild(optionElement);
}

function createQuestionOptions(question) {
    const options = question.type === "boolean" ? ["Sant", "Falskt"] : question.options;

    options.forEach((option, optionIndex) => {
        createOption(option, optionIndex); 
    });
}

// Results :)
function createResultList() {
    let resultList = document.createElement('ul');
    questions.forEach((question, index) => {
        let listItem = document.createElement('li');
        let answerStatus = answersStatus[index] ? 'Rätt' : 'Fel';
        listItem.innerHTML = `
        <strong>${question.question}</strong><br>
        <span style="color: ${answersStatus[index] ? 'green' : 'red'};">
            Du svarade: ${answersStatus[index] ? question.options[userAnswers[index]] : question.options[userAnswers[index]] || "Inget svar"} (${answerStatus})
        </span><br>
        ${!answersStatus[index] ? `<span style="color: green;">Rätt svar: ${question.options[question.correctAnswer]}</span>` : ''}
    `;
        if (answersStatus[index]) {
            listItem.classList.add('Rätt'); 
        } else {
            listItem.classList.add('Fel'); 
        }
        resultList.appendChild(listItem);
    });
    resultBox.appendChild(resultList); 
}

function displayResults() {
    quizBox.style.display = 'none';
    resultBox.style.display = 'block';
    resultBox.querySelector('.score-text').textContent = `Du fick ${score} poäng!`;
    createResultList();

    // Count score :)
    let percentage = (score / questions.length) * 100;
    let resultText = '';
    let resultColor = '';

    if (percentage < 50) {
        resultText = 'Underkänt 😭';
        resultColor = 'red'; 
    } else if (percentage >= 50 && percentage < 75) {
        resultText = 'Bra 😊';
        resultColor = 'orange'; 
    } else {
        resultText = 'Riktigt bra jobbat 🫡';
        resultColor = 'green'; 
    }

    resultBox.querySelector('.complete-text').textContent = resultText;
    resultBox.querySelector('.complete-text').style.color = resultColor;
}

function nextQuestion() {
    clearInterval(timer); 
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion(); 
    } else {
        displayResults(); 
    }
}
