//Javascript
const body = document.querySelector("body");
const dice = document.getElementById("dice");
const rollInput = document.getElementById("number-of-rolls");
const speedCheckBox = document.getElementById("speed");
const barCheckBox = document.getElementById("bar");
const pieCheckBox = document.getElementById("pie");
const coloredText = document.getElementById("coloredText");
const settings = document.getElementById("settings");
const tinyDots = document.getElementsByClassName("tiny-dot");
const dotContainer = document.getElementById("dot-container");


let generatedNums = [];
let frequencyOfNums = [0, 0, 0, 0, 0, 0];
let mean = 0;
let median = 0;
let mode = [];
let standardDeviation = 0;
let probabilities = [0, 0, 0, 0, 0, 0];


let timeToRoll = 1000;
let rotated360 = false;
let previous = 0;


let hourGlass = document.createElement("img");
hourGlass.style.width = "450px";
hourGlass.src = "images/hourglass.png";
dice.appendChild(hourGlass);


async function rollDice(){
    dotContainer.style.width = "400px";
    if(rollInput.value < 1){
        alert("Please input 1 or more rolls");
        return;
    }
    generatedNums = [];
    frequencyOfNums = [0, 0, 0, 0, 0, 0];
    probabilities = [0, 0, 0, 0, 0, 0];
    dice.onclick = null; //To prevent spamming of the dice, disables clicks until the end of the function
    rollInput.readOnly = true;
    dice.style.backgroundColor = "red";
    dice.classList.add("shadow");
    body.style.backgroundColor = "black";
    coloredText.classList.remove("color");
    settings.classList.add("color");
    for(let i = 0; i < tinyDots.length; i++){
        tinyDots[i].style.backgroundColor = "black";
    }


    rollAnimationCounter = 1;
    if(rollInput.value > 500){
        rollAnimationCounter = 10;
    }else if(rollInput.value > 50){
        rollAnimationCounter = 5;
    }else if(rollInput.value > 20){
        rollAnimationCounter = 3;
    }else if(rollInput.value > 5){
        rollAnimationCounter = 2;
    }else{
        rollAnimationCounter = 1;
    }


    if(dice.contains(hourGlass)){
        dice.removeChild(hourGlass);
    }


    checkSpeedBox();
    for(let i = 0; i < rollAnimationCounter; i++){ //Number of roll animations based on inputted rolls
        rotateDice();
        await delay(timeToRoll);
    }
   
    for(let i = 0; i < rollInput.value; i++){
        let rand = diceCalculation();
        generatedNums.push(rand);
        frequencyOfNums[rand-1]++;
    }
    dice.onclick = function(event){ //Sets the click function back
        event.preventDefault();
        rollDice();
    }
    rollInput.readOnly = false;
    dice.style.backgroundColor = "white";
    dice.classList.remove("shadow");
    body.style.backgroundColor = "#80c4ac";
    coloredText.classList.add("color");
    settings.classList.remove("color");
    for(let i = 0; i < tinyDots.length; i++){
        tinyDots[i].style.backgroundColor = "red";
    }
}


async function rotateDice(){
    if(rotated360){
        dice.style.transform = "rotate(0deg)";
        rotated360 = false;
    }else{
        dice.style.transform = "rotate(360deg)";
        rotated360 = true;
    }
    for(let i = 0; i < 3; i++){
        dotContainer.className = "";
        dotContainer.innerHTML = "";
        let rand = diceCalculation();
        while(previous == rand){ //Prevent back to back duplicate randoms
            rand = diceCalculation();
        }
        previous = rand;
        if(rand == 1){
            dotContainer.classList.add("one-sided");
        }else if(rand == 2){
            dotContainer.classList.add("two-sided");
        }else if(rand == 3){
            dotContainer.classList.add("three-sided");
        }else if(rand == 4){
            dotContainer.classList.add("four-sided");
        }else if(rand == 5){
            dotContainer.classList.add("five-sided");
        }else if(rand == 6){
            dotContainer.classList.add("six-sided");
        }
        console.log(`Rand: ${rand}`);
        for(let j = 0; j < rand; j++){
            let dot = document.createElement("div");
            dot.classList.add("dot");
            dotContainer.appendChild(dot);
        }
        await delay(300);
    }
}  


function diceCalculation(){
    return Math.floor(Math.random()*6)+1;
}


function checkSpeedBox(){
    if(speedCheckBox.checked == true){//2x speed
        console.log('hello');
        dice.style.transition = "0.5s";
        timeToRoll = 500;
    }else{//Revert
        dice.style.transition = "1s";
        timeToRoll = 1000;
    }
}


//Delay function from https://www.sitepoint.com/delay-sleep-pause-wait/
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


dice.onclick = function(event){
    event.preventDefault();
    rollDice();
}


rollInput.oninput = function(event){
    event.preventDefault();
    if(rollInput.value.length > 3){
        rollInput.value = rollInput.value.slice(0,4);
    }
}


speedCheckBox.onchange = function(event){
    event.preventDefault();
    checkSpeedBox();
}
