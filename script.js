// Fireworks Setup
const canvas = document.getElementById("fireworks");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];

function createFirework(x, y) {
  for (let i = 0; i < 50; i++) {
    fireworks.push({
      x: x,
      y: y,
      angle: Math.random() * 2 * Math.PI,
      speed: Math.random() * 7 + 3,
      radius: Math.random() * 4 + 2,
      alpha: 1
    });
  }
}

function updateFireworks() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  fireworks.forEach((f, i) => {
    const vx = Math.cos(f.angle) * f.speed;
    const vy = Math.sin(f.angle) * f.speed;
    f.x += vx;
    f.y += vy;
    f.alpha -= 0.015;
    if (f.alpha <= 0) fireworks.splice(i, 1);
    else {
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,0,${f.alpha})`;
      ctx.fill();
    }
  });
  requestAnimationFrame(updateFireworks);
}
updateFireworks();

particlesJS("particles-js", {
  particles: {
    number: { value: 70 },
    color: { value: "#00c9ff" },
    shape: { type: "circle" },
    opacity: { value: 0.5 },
    size: { value: 3 },
    line_linked: {
      enable: true,
      distance: 120,
      color: "#ffffff",
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      random: false,
      straight: false,
      out_mode: "out"
    }
  }
});

const quizData = [
  {
    question: "Which of the following is a compiled language?",
    options: ["Python", "Java", "JavaScript", "HTML"],
    answer: "Java",
    explanation: "Java is compiled to bytecode that runs on the JVM."
  },
  {
    question: "Which symbol is used for comments in Python?",
    options: ["//", "#", "/* */", "<!-- -->"],
    answer: "#",
    explanation: "Python uses `#` for single-line comments."
  },
  {
    question: "What does HTML stand for?",
    options: ["Hyper Type Markup Language", "Hyper Text Makeup Language", "Hyper Text Markup Language", "HighText Machine Language"],
    answer: "Hyper Text Markup Language",
    explanation: "HTML stands for Hyper Text Markup Language."
  },
  {
    question: "Which language is used to style web pages?",
    options: ["HTML", "JQuery", "CSS", "XML"],
    answer: "CSS",
    explanation: "CSS stands for Cascading Style Sheets."
  },
  {
    question: "What does SQL stand for?",
    options: ["Structured Question Language", "Structured Query Language", "Simple Query Language", "Standard Query List"],
    answer: "Structured Query Language",
    explanation: "SQL is used to manage data in databases."
  },
  {
    question: "Which of the following is a loop structure in C?",
    options: ["foreach", "loop", "repeat", "while"],
    answer: "while",
    explanation: "`while` is a loop used in C and many other languages."
  },
  {
    question: "Which function is used to get input from the user in Python?",
    options: ["scanf()", "input()", "get()", "cin>>"],
    answer: "input()",
    explanation: "`input()` takes user input as a string in Python."
  },
  {
    question: "Which of these is not a data type in C?",
    options: ["int", "float", "string", "char"],
    answer: "string",
    explanation: "`string` is not a primitive data type in C."
  },
  {
    question: "What is the default port for HTTP?",
    options: ["21", "80", "443", "25"],
    answer: "80",
    explanation: "HTTP uses port 80 by default."
  },
  {
    question: "Which of the following is used to define a function in C++?",
    options: ["def", "func", "function", "void"],
    answer: "void",
    explanation: "`void` is used as the return type for functions in C++."
  }
];

let currentQuestion = 0;
let score = 0;
let timer; // For countdown timer
let timeLeft = 15; // 15 seconds timer per question

const questionEl = document.getElementById("question");
const questionNumEl = document.getElementById("question-number");
const optionsEl = document.getElementById("options");
const feedbackEl = document.getElementById("feedback");
const explanationEl = document.getElementById("explanation");
const nextBtn = document.getElementById("nextBtn");
const endBtn = document.getElementById("endBtn");
const resultEl = document.getElementById("result");
const finalMsgEl = document.getElementById("final-message");
const submitBtn = document.getElementById("submitBtn");

// New: Timer display element
let timerEl = document.createElement("div");
timerEl.style.fontSize = "20px";
timerEl.style.marginTop = "10px";
timerEl.style.fontWeight = "bold";
timerEl.style.color = "#00ffe1";
document.querySelector(".quiz-box").insertBefore(timerEl, feedbackEl);

function startTimer() {
  timeLeft = 15;
  timerEl.innerText = `Time left: ${timeLeft}s`;
  
  timer = setInterval(() => {
    timeLeft--;
    timerEl.innerText = `Time left: ${timeLeft}s`;
    
    if (timeLeft <= 0) {
      clearInterval(timer);
      timerEl.innerText = "Time's up!";
      disableOptions();
      feedbackEl.innerText = "Time's up! Moving to next question...";
      explanationEl.innerText = "";
      nextBtn.disabled = false;

      if (currentQuestion === quizData.length - 1) {
        nextBtn.style.display = "none";
        endBtn.style.display = "inline-block";
      }
      
      // Automatically go to next question after 2 seconds
      setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < quizData.length) {
          loadQuestion();
        } else {
          showResults();
        }
      }, 2000);
    }
  }, 1000);
}

function disableOptions() {
  const allBtns = document.querySelectorAll(".option-btn");
  allBtns.forEach(b => b.disabled = true);
}

function loadQuestion() {
  clearInterval(timer); // Clear any existing timer
  const q = quizData[currentQuestion];
  questionNumEl.innerText = `Question ${currentQuestion + 1} of ${quizData.length}`;
  questionEl.innerText = q.question;
  optionsEl.innerHTML = "";
  feedbackEl.innerText = "";
  explanationEl.innerText = "";
  nextBtn.disabled = true;
  nextBtn.style.display = "inline-block";
  resultEl.innerText = "";
  finalMsgEl.innerText = "";
  submitBtn.style.display = "none";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.classList.add("option-btn");
    btn.onclick = () => {
      clearInterval(timer);
      checkAnswer(btn, q);
    };
    optionsEl.appendChild(btn);
  });

  startTimer(); // Start timer for each question
}

function checkAnswer(btn, question) {
  const allBtns = document.querySelectorAll(".option-btn");
  allBtns.forEach(b => b.disabled = true);

  if (btn.innerText === question.answer) {
    btn.classList.add("correct");
    feedbackEl.innerText = "Correct!";
    score++;
    createFirework(window.innerWidth / 2, window.innerHeight / 2);
  } else {
    btn.classList.add("wrong");
    allBtns.forEach(b => {
      if (b.innerText === question.answer) {
        b.classList.add("correct");
      }
    });
    feedbackEl.innerText = "Wrong!";
  }

  explanationEl.innerText = "Explanation: " + question.explanation;
  nextBtn.disabled = false;

  if (currentQuestion === quizData.length - 1) {
    nextBtn.style.display = "none";
    endBtn.style.display = "inline-block";
  }
}

nextBtn.addEventListener("click", () => {
  currentQuestion++;
  loadQuestion();
});

endBtn.addEventListener("click", showResults);

function showResults() {
  clearInterval(timer);
  resultEl.innerText = `You scored ${score} out of ${quizData.length}`;
  finalMsgEl.innerText = getFinalMessage(score);
  submitBtn.style.display = "inline-block";
  endBtn.style.display = "none";
  nextBtn.style.display = "none";
  timerEl.innerText = "";
}

function getFinalMessage(score) {
  if (score === 10) return "🏆 Perfect score! You're a code wizard!";
  if (score >= 7) return "🎉 Great job! Keep coding strong!";
  if (score >= 4) return "👍 Not bad! Practice makes perfect!";
  return "💪 Keep learning! You're on your way!";
}

submitBtn.addEventListener("click", () => {
  alert("Results submitted! Restarting quiz...");
  currentQuestion = 0;
  score = 0;
  nextBtn.style.display = "inline-block";
  endBtn.style.display = "none";
  submitBtn.style.display = "none";
  loadQuestion();
});

loadQuestion();
