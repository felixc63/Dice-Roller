//Javascript
const body = document.querySelector("body");
const dice = document.getElementById("dice");
const rollInput = document.getElementById("number-of-rolls");
const speedCheckBox = document.getElementById("speed");
const coloredText = document.getElementById("coloredText");
const settings = document.getElementById("settings");
const tinyDots = document.getElementsByClassName("tiny-dot");
const dotContainer = document.getElementById("dot-container");
const statsWindow = document.getElementById("stats-window");
const closeBtn = document.getElementById("close");
const info = document.getElementById("info");

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
    if(rollInput.value < 1){
        alert("Please input 1 or more rolls");
        return;
    }
    generatedNums = [];
    frequencyOfNums = [0, 0, 0, 0, 0, 0];
    probabilities = [0, 0, 0, 0, 0, 0];
    dotContainer.style.width = "400px";
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
    //Actual Calculations
    statisticsCalculation();
    //Show all statistics on the statistics window
    info.innerHTML = ""; //Clear
    let meanStat = document.createElement("p"), medianStat = document.createElement("p"), modeStat = document.createElement("p"), standardDeviationStat = document.createElement("p"), probabilitiesStat = document.createElement("p");
    meanStat.innerText = `Mean: ${mean}`; 
    info.appendChild(meanStat);
    medianStat.innerText = `Median: ${median}`;
    info.appendChild(medianStat);
    modeStat.innerText = `Mode: ${mode}`;
    info.appendChild(modeStat);
    standardDeviationStat.innerText = `Standard Deviation: ${standardDeviation}`;
    info.appendChild(standardDeviationStat);
    probabilitiesStat.innerText = `Probabilities: \n1. ${probabilities[0]}%\n2. ${probabilities[1]}%\n3. ${probabilities[2]}%\n4. ${probabilities[3]}%\n5. ${probabilities[4]}%\n6. ${probabilities[5]}%`;
    info.appendChild(probabilitiesStat);

    //Draw Graphs
    await drawGraphs();

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
    await delay(100);
    statsWindow.style.visibility = "visible";
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

function statisticsCalculation(){
    let totalVal = 0;
    for(let i = 0; i < frequencyOfNums.length; i++){
        totalVal += frequencyOfNums[i]*(i+1);
    }


    //Mean
    mean = (Math.round((totalVal/rollInput.value)*100))/100;


    //Median
    let sorted = generatedNums.slice().sort((a, b) => a - b);
    let length = sorted.length;
    // If the length is odd, return the middle element
    if(length % 2 !== 0) {
        median = sorted[Math.floor(length / 2)];
    }else{
        // If the length is even, return the average of the two middle elements
        const middle1 = sorted[length / 2 - 1];
        const middle2 = sorted[length / 2];
        median = (middle1 + middle2) / 2;
    }


    //Mode
    let largest = frequencyOfNums[0];
    mode = [1];
    for (let i = 1; i < frequencyOfNums.length; i++) {
        if (frequencyOfNums[i] > largest) {
            largest = frequencyOfNums[i];
            mode = [i + 1];
        } else if (frequencyOfNums[i] == largest) {
            mode.push(i + 1);
        }
    }


    //Standard Deviation
    const squaredDeviations = generatedNums.map(num => Math.pow(num - mean, 2));
    const meanSquaredDeviations = squaredDeviations.reduce((sum, squaredDeviation) => sum + squaredDeviation, 0)/generatedNums.length;
    standardDeviation = (Math.round(Math.sqrt(meanSquaredDeviations)*100))/100;


    //Probabilities
    for(let i = 0; i < frequencyOfNums.length; i++){
        probabilities[i] = (Math.round((frequencyOfNums[i]/rollInput.value)*10000)/100);
    }
}

function checkSpeedBox(){
    if(speedCheckBox.checked == true){//2x speed
        dice.style.transition = "0.5s";
        timeToRoll = 500;
    }else{//Revert
        dice.style.transition = "1s";
        timeToRoll = 1000;
    }
}

let barGraph;
let pieChart;

async function drawGraphs(){
    const bar = document.getElementById("bar-graph");
    const pie = document.getElementById("pie-chart");

    Chart.defaults.backgroundColor = "white";
    Chart.defaults.borderColor = "#F8EEEC";
    Chart.defaults.color = "white";

    barGraph = new Chart(bar, {
        type: "bar",
        color: "white",
        data: {
            labels: [1, 2, 3, 4, 5, 6],
            datasets: [{
                label: "Frequency",
                data: [frequencyOfNums[0], frequencyOfNums[1], frequencyOfNums[2], frequencyOfNums[3], frequencyOfNums[4], frequencyOfNums[5]],
                backgroundColor: [
                    "rgb(54, 162, 235)",
                    "rgb(255, 99, 132)",
                    "rgb(255, 159, 64)",
                    "rgb(255, 205, 86",
                    "rgb(75, 192, 192)",
                    "rgb(153, 102, 255)"
                ]
            }]
        }
    });

    

    pieChart = new Chart(pie, {
        type: "pie",
        data: {
            labels: [1, 2, 3, 4, 5, 6],
            datasets: [{
                label: "Frequency",
                data: [frequencyOfNums[0], frequencyOfNums[1], frequencyOfNums[2], frequencyOfNums[3], frequencyOfNums[4], frequencyOfNums[5]]
            }]
        }
    })
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

closeBtn.onclick = function(event){
    event.preventDefault();
    statsWindow.style.visibility = "hidden";
    barGraph.destroy();
    pieChart.destroy();
}