//Navigation
document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.querySelector(".start-btn button");
    const infoBox = document.querySelector(".info-box");
    const quizBox = document.querySelector(".quiz-box");
    const continueBtn = document.querySelector(".alternative");
    const quitBtn = document.querySelector(".quit");

    
    startBtn.addEventListener("click", () => {
        document.querySelector(".start-btn").style.display = "none";
        infoBox.style.display = "block";
    });

    
    continueBtn.addEventListener("click", () => {
        infoBox.style.display = "none";
        quizBox.style.display = "block";
    });

    
    quitBtn.addEventListener("click", () => {
        window.location.reload();  
    });
});

//Hämta frågorna från questions.js
let currentQuestionIndex = 0;  

function showQuestion(index) {
  const question = questions[index];  
  const questionText = document.querySelector(".que-text");  
  const optionList = document.querySelector(".option-list");  

  
  questionText.innerHTML = `<span>${question.question}</span>`;

  
  let optionsHTML = '';
  question.options.forEach((option, i) => {
    
    const inputType = question.type === 'multiple' ? 'checkbox' : 'radio';
    optionsHTML += `
      <div class="option">
        <input type="${inputType}" name="option" id="option${i}" value="${i}">
        <label for="option${i}">${option}</label>
      </div>
    `;
  });

  optionList.innerHTML = optionsHTML;  
}


showQuestion(currentQuestionIndex);
console.log("Questions array:", questions);
