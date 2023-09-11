let intro = document.getElementsByClassName('intro')[0]
let game = document.getElementsByClassName('game')[0]
let results = document.getElementsByClassName('results')[0]
let message = document.getElementsByClassName('message')[0];
let answers = document.getElementsByClassName('answers')[0];
let displayingCountry = document.querySelector('.display-country-name')
let trueAnswer = document.getElementsByClassName('true-answers')[0];
let falseAnswer = document.getElementsByClassName('false-answers')[0];
let points = document.getElementsByClassName('points')[0];
let levels = document.getElementsByClassName('levels')[0];
let correctAnswers = 0
let wrongAnswers = 0
let randomCountryIndex;
let level = 1;
let tickIcon = "images/accept.png"
let xIcon = "images/remove.png"
const countryCapitals = []
const countryName = []


const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 8;
const ALERT_THRESHOLD = 4;
const TIME_LIMIT = 15;
const COLOR_CODES = {
    info: {
        color: "green"
    },
    warning: {
        color: "orange",
        threshold: WARNING_THRESHOLD
    },
    alert: {
        color: "red",
        threshold: ALERT_THRESHOLD
    }
};
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;



//start game function
const startGame = () => {
    console.log("Working startgame");
    intro.style.display = 'none';
    game.style.display = 'block';
    results.style.display = 'none';
    correctAnswers = 0;
    wrongAnswers = 0;
    level = 1;


    console.log(axios);
    axios
        .get(`https://restcountries.com/v3.1/all`)
        .then((response) => {
            const country = response.data

            // separating capitals and country names
            country.map((country) => {
                countryName.push(country.name.common)
                countryCapitals.push(country.capital);
            })

            randomCountryCapitalGenerator();
        })
        .catch((err) => {
            console.log(err);

        });




}


// exit from game when button is clicked
const exit = document.getElementById('exit').addEventListener('click', () => {
    exitGame();
});

// exit game function
function exitGame() {
    game.style.display = 'none';
    results.style.display = 'block';
    trueAnswer.innerHTML = '';
    falseAnswer.innerHTML = '';
    trueAnswer.innerHTML = correctAnswers
    falseAnswer.innerHTML = wrongAnswers
    points.innerHTML = `${correctAnswers} points`
    if(correctAnswers <=3) {
        message.innerHTML = "Try harder next time"
    }else if(correctAnswers<=6){
        message.innerHTML = "You can do better"
    }else{
        message.innerHTML = "You are a genius"
    }
}


const playAgain = document.getElementById('play-again').addEventListener('click', () => {
    gameIntro();
});

// play again
const gameIntro = () => {
    results.style.display = 'none';
    intro.style.display = 'block';
}

// start game command
document.getElementById('start').addEventListener('click', () => {
    results.style.display = 'none';
    startGame();
})


// check answer whether answer is correct or not
function checkAnswer(index) {
    clearInterval(timerInterval);
    document.getElementById('exit').style.display = 'none';
    document.getElementById('next').style.display = 'block';
    for (let i = 0; i < 4; i++) {
        document.querySelectorAll('img')[i].classList.remove('not-displaying')
    }
    document.getElementsByClassName('true-answer')[0].classList.remove('button')
    document.getElementsByClassName('true-answer')[0].classList.add('true-button')

    for (let i = 0; i < 3; i++) {
        document.getElementsByClassName('false-answer')[i].classList.remove('button');
        document.getElementsByClassName('false-answer')[i].classList.add('wrong-button');
    }
    if (index === randomCountryIndex) {
        correctAnswers++;
    }
    else {
        wrongAnswers++;
    }
}


// next button after choose answer
const next = () => {randomCountryCapitalGenerator() };


// random country capital generator
function randomCountryCapitalGenerator() {
    clearInterval(timerInterval);
    countDown();
    answers.innerHTML = '';
    randomCountryIndex = Math.floor(Math.random() * 250 + 1)
    let orderNumber = Math.floor(Math.random() * 4 + 1)
    displayingCountry.innerHTML = countryName[randomCountryIndex];
    let randomCapitalIndex;
    document.getElementById('exit').style.display = 'block';
    document.getElementById('next').style.display = 'none';

    for (let i = 1; i <= 4; i++) {
        randomCapitalIndex = Math.floor(Math.random() * 250 + 1)
        if (countryCapitals[randomCapitalIndex] === undefined) {
            randomCapitalIndex = Math.floor(Math.random() * 250 + 1)
        } else if (countryCapitals[randomCountryIndex] === undefined) {
            randomCountryIndex = Math.floor(Math.random() * 250 + 1)
        }
        if (orderNumber === i) {
            answers.innerHTML += `
            <div>
                <input type="button" onclick="checkAnswer(${randomCountryIndex})" class="button true-answer" value="${countryCapitals[randomCountryIndex][0]}">
                <img class="not-displaying " src="${tickIcon}" alt="Tick">
            </div>
            `
        } else {
            answers.innerHTML += `
            <div>
                <input type="button" onclick="checkAnswer(${randomCapitalIndex})" class="button false-answer" value="${countryCapitals[randomCapitalIndex][0]}">
                <img class="not-displaying" src="${xIcon}" alt="X">
            </div>
            `
        }
    }
    if (level === 11) {
        exitGame();
    }
    levels.innerHTML = `${level}/10`
    level++;
}

// countdown
function countDown() {
    timePassed = 0;
    timeLeft = TIME_LIMIT;
    document.getElementById("app").innerHTML = `
        <div class="base-timer">
        <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g class="base-timer__circle">
            <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
            <path
                id="base-timer-path-remaining"
                stroke-dasharray="283"
                class="base-timer__path-remaining ${remainingPathColor}"
                d="
                M 50, 50
                m -45, 0
                a 45,45 0 1,0 90,0
                a 45,45 0 1,0 -90,0
                "
            ></path>
            </g>
        </svg>
        <span id="base-timer-label" class="base-timer__label">${formatTime(timeLeft)}</span>
        </div>
`;

    startTimer();

    function onTimesUp() {
        next();
        wrongAnswers++;
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            timePassed = timePassed += 1;
            timeLeft = TIME_LIMIT - timePassed;
            document.getElementById("base-timer-label").innerHTML = formatTime(timeLeft);

            setCircleDasharray();
            setRemainingPathColor(timeLeft);

            if (timeLeft === 0) {
                onTimesUp();
            }
        }, 1000);
    }

    function formatTime(time) {
        let seconds = time % 60;
        if (seconds < 10) {
            seconds = `0${seconds}`;
        }

        return `${seconds}`;
    }

    function setRemainingPathColor(timeLeft) {
        const { alert, warning, info } = COLOR_CODES;
        if (timeLeft <= alert.threshold) {
            document
                .getElementById("base-timer-path-remaining")
                .classList.remove(warning.color);
            document
                .getElementById("base-timer-path-remaining")
                .classList.add(alert.color);
        } else if (timeLeft <= warning.threshold) {
            document
                .getElementById("base-timer-path-remaining")
                .classList.remove(info.color);
            document
                .getElementById("base-timer-path-remaining")
                .classList.add(warning.color);
        }
    }

    function calculateTimeFraction() {
        const rawTimeFraction = timeLeft / TIME_LIMIT;
        return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
    }

    function setCircleDasharray() {
        const circleDasharray = `${(
            calculateTimeFraction() * FULL_DASH_ARRAY
        ).toFixed(0)} 283`;
        document
            .getElementById("base-timer-path-remaining")
            .setAttribute("stroke-dasharray", circleDasharray);
    }

}