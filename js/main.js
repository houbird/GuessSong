
/// Parameters
// Audio player
var playButton = document.getElementById("playButton");
var playImage = document.getElementById("playImage");
var audioPlayer = document.getElementById("audioPlayer");


//Questions
let level = 1;
const questions = [{
    question: "什麼東西拿起來沉，放下卻輕？",
    options: ["氣球", "棉花", "石頭"],
    audio: "media/sample-9s.mp3",
    answer: "A"
},
{
    question: "什麼東西不能吃？",
    options: ["蘋果", "椅子", "香蕉"],
    audio: "media/sample-9s.mp3",
    answer: "A"
},
{
    question: "什麼東西不會哭？",
    options: ["孩子", "貓咪", "風車"],
    audio: "media/sample-9s.mp3",
    answer: "A"
}
];
const totalLevels = questions.length;
const options = document.querySelectorAll('.option');

// Contents
var contentContainer = document.getElementById("contentContainer");
var content = document.getElementById("content");
var rows = ["Row 1", "Row 2", "Row 3", "Row 4"];
var rows_end = ["Congratulations!!", "Row 2", "Row 3", "Row 4"];
var currentRow = 0;

// Contents
function printContent() {
    let p = document.createElement("p");
    p.innerHTML = rows[currentRow];
    p.classList.add("animate__animated");
    p.classList.add("animate__fadeIn");
    contentContainer.append(p);

    //content.innerHTML = rows[currentRow];
    //contentContainer.classList.add("fade-in");
    currentRow++;
    if (currentRow < rows.length) {
        setTimeout(printContent, 2000);
    }
}

printContent();

// Audio player
playButton.addEventListener("click", function () {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playImage.classList.add("rotate");
    } else {
        audioPlayer.pause();
        playImage.classList.remove("rotate");
    }
});


// Question
document.querySelector('.question').innerHTML = questions[level].question;
options.forEach((option, index) => {
    option.innerHTML = questions[level].options[index];
});


function checkAnswer(guess) {
    if (level < totalLevels + 1) {
        console.log('guess this question');
        console.log(questions[level - 1]);
        if (guess === questions[level - 1].answer) {
            document.querySelector('.result').innerHTML = '答對了！';
            level++;
            displayQuestion();
        } else {
            document.querySelector('.result').innerHTML = '答錯了！';
        }
        console.log('level', level);
        if (level >= totalLevels + 1) {
            document.querySelector('.result').innerHTML = '恭喜你通過了所有關卡！';
        } else {
            //level++;
        }

    }
}

function displayQuestion() {
    if (level >= totalLevels + 1) return;

    let question = questions[level - 1];
    let options = question.options;
    let form = "";

    form += "<div class='question'>" + question.question + "</div>";

    form += "<div class='options'>";
    for (let i = 0; i < options.length; i++) {
        form += "<div class='option' onclick='checkAnswer(\"" + String.fromCharCode(65 + i) + "\")'>" + options[i] + "</div>";
    }
    form += "</div>";

    form += "";
    document.getElementById("game").innerHTML = form;
}
function changeAudio(file) {
    audioPlayer.src = file;
}


displayQuestion();


// Start Canvas
function startAnimation() {
    const CANVAS_WIDTH = window.innerWidth;
    const CANVAS_HEIGHT = window.innerHeight;
    const MIN = 0;
    const MAX = CANVAS_WIDTH;

    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    function clamp(number, min = MIN, max = MAX) {
        return Math.max(min, Math.min(number, max));
    }

    function random(factor) {
        return clamp(Math.floor(Math.random() * factor));
    }

    function degreeToRadian(deg) {
        return deg * (Math.PI / 180);
    }

    // All the properties for Circle
    class Circle {
        xi = CANVAS_WIDTH / 2;
        yi = CANVAS_HEIGHT / 2;
        x = CANVAS_WIDTH / 2;
        y = CANVAS_HEIGHT / 2;
        width = 25;
        r = random(CANVAS_WIDTH);
        deg = 0;
        bgColor = this.randomColor;

        constructor(ctx) {
            this.ctx = ctx;
            this.deg = clamp(Math.floor(Math.random() * 360));
        }

        draw() {
            this.ctx.beginPath();
            this.ctx.fillStyle = this.bgColor;
            this.ctx.arc(this.x, this.y, this.width, 0, 2 * Math.PI);
            this.ctx.fill();
        }

        get randomColor() {
            const r = random(255);
            const g = random(255);
            const b = random(255);
            const rgba = `rgba(${r},${g},${b}, 0.4)`;
            return rgba;
        }
    }

    // Array for storing all the generated circles
    let circles = [];

    // Generate circles
    for (let i = 0; i < 50; i++) {
        circles.push(new Circle(ctx));
    }

    // Clear canvas
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // start and end cordinates of canvas
    let canvasOffset = {
        x0: ctx.canvas.offsetLeft,
        y0: ctx.canvas.offsetTop,
        x1: ctx.canvas.offsetLeft + ctx.canvas.width,
        y1: ctx.canvas.offsetTop + ctx.canvas.height
    };

    function animate() {
        clearCanvas();

        circles.forEach((e) => {
            // reset the circle if it collides on border
            if (
                e.x <= canvasOffset.x0 ||
                e.x >= canvasOffset.x1 ||
                e.y <= canvasOffset.y0 ||
                e.y >= canvasOffset.y1
            ) {
                e.xi = e.x > ctx.canvas.width / 2 ? e.x - 1 : e.x + 1;
                e.yi = e.y > ctx.canvas.height / 2 ? e.y - 1 : e.y + 1;
                e.x = 0;
                e.y = 0;
                e.deg = (e.deg + 60) % 360;
                e.r = 0;
            }

            // Drawing path using polar cordinates
            e.x = e.xi + e.r * Math.cos(degreeToRadian(e.deg));
            e.y = e.yi + e.r * Math.sin(degreeToRadian(e.deg));
            e.r = e.r + 1;
            e.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}
startAnimation();
window.addEventListener("resize", startAnimation);
        // End Canvas
