
/// Parameters
// Audio player
var player = document.getElementById("player");
var playButton = document.getElementById("playButton");
var playImage = document.getElementById("playImage");
var audioPlayer = document.getElementById("audioPlayer");
var panel_1 = document.getElementById("panel-1");
var panel_2 = document.getElementById("panel-2");

var countTimer = 3;
var timer;
var level = 1;
var buttonDisabled = false;

//Questions
const questions = [{
    question: "接下來要撥放的歌曲是哪首歌？",
    options: ["女孩", "還是會", "初四阿北"],
    audio: "media/girl.mp3",
    currentTime: 6,
    answer: "A",
    answerCHT: "女孩"
},
{
    question: "接下來要撥放的歌曲是哪首歌？",
    options: ["慢慢等", "如果可以", "在你身邊"],
    audio: "media/red-scarf.mp3",
    currentTime: 51.5,
    answer: "B",
    answerCHT: "如果可以"
},
{
    question: "接下來要撥放的歌曲是哪首歌？",
    options: ["因為愛", "世界上最重要的人", "請妳嫁給我"],
    audio: "media/marry-me.mp3",
    currentTime: 0,
    answer: "C",
    answerCHT: "請妳嫁給我"
}
];
const totalLevels = questions.length;
const options = document.querySelectorAll('.option');

// Contents
var contentContainer = document.getElementById("contentContainer");
var content = document.getElementById("content");
var rows = ["恭喜你成功來到這裡", "這裡還有 1 個線索，必須破關後才能取得", "你必須依照你的智慧來通過下列 3 個關卡", "如果你準備好了，就按下面的CD圖示", "加油，勇敢的挑戰者"];
var rows_end = ["勇敢的挑戰者", "恭喜你成功完成了挑戰", "下一個線索就在抽屜裡", "找到它，並前往下一個階段"];
var currentRow = 0;
var currentRow_end = 0;

// Contents
function printContent() {
    let p = document.createElement("p");
    p.innerHTML = rows[currentRow];
    p.classList.add("animate__animated");
    p.classList.add("animate__fadeIn");
    contentContainer.append(p);

    currentRow++;
    if (currentRow < rows.length) {
        setTimeout(printContent, 2000);
    }
    else {
        buttonDisabled = false;
    }
}
function printContent_end() {
    let p = document.createElement("p");
    p.innerHTML = rows_end[currentRow_end];
    p.classList.add("animate__animated");
    p.classList.add("animate__fadeIn");
    contentContainer.append(p);

    currentRow_end++;
    if (currentRow_end < rows_end.length) {
        setTimeout(printContent_end, 2000);
    }
}

function printLevel(level) {
    console.log(level);
    let block = document.getElementById('level-' + level);
    let status = block.getElementsByClassName('status')[0];
    status.innerHTML = '《' + questions[level - 1].answerCHT + '》';
    status.classList.add('success');
}

// Audio player
// GO STEP
playButton.addEventListener("click", function () {
    if (!buttonDisabled) {
        // Start to print content.
        if (isHidden(panel_1) && isHidden(panel_2)) {
            console.log('panel 1 hidden');
            panel_1.style.display = 'block';
            player.classList.add('ready');
            printContent();
            buttonDisabled = true;
        }
        // finish print, go question.
        else if (!isHidden(panel_1) && isHidden(panel_2)) {
            panel_1.style.display = 'none';
            panel_2.style.display = 'block';
            runTimer();
        }
        // In answer question, play/pause audio.
        else if (isHidden(panel_1) && !isHidden(panel_2)) {
            panel_1.style.display = 'none';
            panel_2.style.display = 'block';

            if (audioPlayer.paused) {
                audioPlay();
            } else {
                audioPause();
            }
        }
    }
});

function audioPlay() {
    audioPlayer.play();
    playImage.classList.add("rotate");
    document.getElementById('count_num').style.display = 'none';
}
function audioPause() {
    audioPlayer.pause();
    playImage.classList.remove("rotate");
}
function changeAudio(file, currentTime) {
    audioPlayer.src = file;
    audioPlayer.currentTime = currentTime;
    audioPlayer.loop = true;
}
function isHidden(el) {
    return (el.offsetParent === null)
}
function endCountdown() {
    console.log('countdown, play audio');
    audioPlay();
}

function handleTimer() {
    if (countTimer <= 0) {
        clearInterval(timer);
        endCountdown();
        document.getElementById('count_num').style.display = 'none';
    } else {
        document.getElementById('count_num').innerHTML = countTimer;
        countTimer--;
    }
}
function runTimer() {
    countTimer = 3;
    document.getElementById('count_num').style.display = 'block';
    handleTimer(countTimer);
    timer = setInterval(function () { handleTimer(countTimer); }, 1000);
}

// Question
document.querySelector('.question').innerHTML = questions[level].question;
options.forEach((option, index) => {
    option.innerHTML = questions[level].options[index];
});

function checkAnswer(guess) {
    let success = false;
    if (level < totalLevels + 1) {
        console.log('guess this question');
        console.log(questions[level - 1]);
        if (guess === questions[level - 1].answer) {
            let result = document.querySelector('.result');
            result.innerHTML = '答對了！';
            success = true;
            printLevel(level);
            level++;
            displayQuestion();
        } else {
            document.querySelector('.result').innerHTML = '答錯了！';
        }
        console.log('level', level);

    }
    if (level >= totalLevels + 1) {
        //document.querySelector('.result').innerHTML = '恭喜你通過了所有關卡！';
        document.querySelector('.result').innerHTML = '';
        document.getElementById('player').style.display = 'none';
        panel_1.style.display = 'block';
        panel_2.style.display = 'none';
        document.getElementById('canvas-firework').style.display = 'block';
        contentContainer.innerHTML = '';
        contentContainer.classList.add('end');
        printContent_end();
    } else {
        if (success) {
            audioPause();
            runTimer();
        }
    }
}

function displayQuestion() {
    if (level >= totalLevels + 1) return;

    let question = questions[level - 1];
    let options = question.options;
    let form = "";

    form += "<div class='question'>" + question.question + "</div>";

    form += "<div class='options-block'>";
    for (let i = 0; i < options.length; i++) {
        form += "<div class='option' onclick='checkAnswer(\"" + String.fromCharCode(65 + i) + "\")'>" + options[i] + "</div>";
    }
    form += "</div>";

    form += "";
    document.getElementById("game").innerHTML = form;

    changeAudio(question.audio, question.currentTime);
}


displayQuestion();


// Start background Canvas
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
// End background Canvas


// Start canvas firework
window.addEventListener("resize", resizeCanvas, false);
window.addEventListener("DOMContentLoaded", onLoad, false);

window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };

var canvas_firework, ctx, w, h, particles = [], probability = 0.04,
    xPoint, yPoint;





function onLoad() {
    canvas_firework = document.getElementById("canvas-firework");
    ctx = canvas_firework.getContext("2d");
    resizeCanvas();

    window.requestAnimationFrame(updateWorld);
}

function resizeCanvas() {
    if (!!canvas_firework) {
        w = canvas_firework.width = window.innerWidth;
        h = canvas_firework.height = window.innerHeight;
    }
}

function updateWorld() {
    update();
    paint();
    window.requestAnimationFrame(updateWorld);
}

function update() {
    if (particles.length < 500 && Math.random() < probability) {
        createFirework();
    }
    var alive = [];
    for (var i = 0; i < particles.length; i++) {
        if (particles[i].move()) {
            alive.push(particles[i]);
        }
    }
    particles = alive;
}

function paint() {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < particles.length; i++) {
        particles[i].draw(ctx);
    }
}

function createFirework() {
    xPoint = Math.random() * (w - 200) + 100;
    yPoint = Math.random() * (h - 200) + 100;
    var nFire = Math.random() * 50 + 100;
    var c = "rgb(" + (~~(Math.random() * 200 + 55)) + ","
        + (~~(Math.random() * 200 + 55)) + "," + (~~(Math.random() * 200 + 55)) + ")";
    for (var i = 0; i < nFire; i++) {
        var particle = new Particle();
        particle.color = c;
        var vy = Math.sqrt(25 - particle.vx * particle.vx);
        if (Math.abs(particle.vy) > vy) {
            particle.vy = particle.vy > 0 ? vy : -vy;
        }
        particles.push(particle);
    }
}

function Particle() {
    this.w = this.h = Math.random() * 4 + 1;

    this.x = xPoint - this.w / 2;
    this.y = yPoint - this.h / 2;

    this.vx = (Math.random() - 0.5) * 10;
    this.vy = (Math.random() - 0.5) * 10;

    this.alpha = Math.random() * .5 + .5;

    this.color;
}

Particle.prototype = {
    gravity: 0.05,
    move: function () {
        this.x += this.vx;
        this.vy += this.gravity;
        this.y += this.vy;
        this.alpha -= 0.01;
        if (this.x <= -this.w || this.x >= screen.width ||
            this.y >= screen.height ||
            this.alpha <= 0) {
            return false;
        }
        return true;
    },
    draw: function (c) {
        c.save();
        c.beginPath();

        c.translate(this.x + this.w / 2, this.y + this.h / 2);
        c.arc(0, 0, this.w, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.globalAlpha = this.alpha;

        c.closePath();
        c.fill();
        c.restore();
    }
}
        // END canvas firework