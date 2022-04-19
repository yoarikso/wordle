'use strict';

import { WORDS } from "./words.js";

const NUM_LETTERS = 5;
const NUM_GUESSES = 6;
const yellowColor = '#ffb700cc';
const greenColor = '#5da72b';
const darkGreyColor = '#3a3a3c';

let numGuessesRemaining = NUM_GUESSES;
let currentGuess = [];
let nextLetter = 0;
let answer = WORDS[Math.floor(Math.random() * WORDS.length)];

console.log(answer);

// const annonymous function pointer
const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {

    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element;
    node.style.setProperty('--animate-duration', '1.5s');
    
    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});

// Keyboard event
document.addEventListener("keyup", (e) => {

    console.log('keyup ' + e.key);
    if (numGuessesRemaining === 0) {
        return;
    }

    let pressedKey = String(e.key);
    if (pressedKey === "Backspace" && nextLetter !== 0) {
        deleteLetter();
        return;
    }
    
    if (pressedKey === "Enter") {
        checkGuess();
        return;
    }

    let found = pressedKey.match(/[a-z]{1}$/gi);
    if (!found) {
        return
    } else {
        insertLetter(pressedKey);
    }
});

// button click event
document.getElementById("keyboard-container").addEventListener("click", (e) => {
    
    const target = e.target;
    if (!target.classList.contains("keyboard-button")) {
        return;
    }

    let key = target.textContent
    if (key === "Del") {
        key = "Backspace";
    }

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}));
});

function initGameBoard() {
    let gameBoard = document.getElementById("gameboard");

    for (let i = 0; i < NUM_GUESSES; i++) {
        let row = document.createElement("div");
        row.className = "letter-row";

        for (let j = 0; j < NUM_LETTERS; j++) {
            let box = document.createElement("div");
            box.className = "letter-box";
            row.appendChild(box);
        }

        gameBoard.appendChild(row);
    }
}

function insertLetter(pressedKey) {
    console.log(`pressedKey: ${pressedKey}`);
    if (nextLetter === NUM_LETTERS) {
        return;
    }
    pressedKey = pressedKey.toLowerCase();

    let row = document.getElementsByClassName("letter-row")[NUM_GUESSES - numGuessesRemaining];
    let box = row.children[nextLetter];
    animateCSS(box, "pulse");
    box.textContent = pressedKey;
    box.classList.add("filled-box");
    currentGuess.push(pressedKey);
    nextLetter += 1;
}

function deleteLetter() {
    let row = document.getElementsByClassName("letter-row")[NUM_GUESSES - numGuessesRemaining];
    let box = row.children[nextLetter - 1];
    box.textContent = "";
    box.classList.remove("filled-box");
    currentGuess.pop();
    nextLetter -= 1;
}

function checkGuess () {
    let row = document.getElementsByClassName("letter-row")[NUM_GUESSES - numGuessesRemaining];
    let guessString = '';
    let rightGuess = Array.from(answer);

    for (const val of currentGuess) {
        guessString += val;
    }

    if (guessString.length != NUM_LETTERS) {
        toastr.info("Not enough letters!");
        return;
    }

    if (!WORDS.includes(guessString)) {
        toastr.info("Word not in list!");
        return;
    }

    for (let i = 0; i < NUM_LETTERS; i++) {
        let letterColor = '';
        let box = row.children[i];
        let letter = currentGuess[i];

        let letterPosition = rightGuess.indexOf(currentGuess[i])
        // is letter in the correct guess
        if (letterPosition === -1) {
            letterColor =  darkGreyColor;
        } else {
            // now, letter is definitely in word
            // if letter index and right guess index are the same
            // letter is in the right position
            if (currentGuess[i] === rightGuess[i]) {
                // shade box green
                letterColor = greenColor;
            } else {
                // shade box yellow
                letterColor = yellowColor;
            }

            rightGuess[letterPosition] = "#";
        }

        let delay = 250 * i;
        setTimeout(()=> {

            //flip box
            animateCSS(box, 'flipInY');
            
            //shade box
            box.style.backgroundColor = letterColor;
            shadeKeyBoard(letter, letterColor);
        }, delay);
    }

    if (guessString === answer) {
        toastr.info("You guessed right! Game over!");
        numGuessesRemaining = 0;
        return;
    } else {
        numGuessesRemaining -= 1;
        currentGuess = [];
        nextLetter = 0;

        if (numGuessesRemaining === 0) {
            toastr.info(`You've run out of guesses. The right word was: ${answer}`);
        }
    }
}

function shadeKeyBoard(letter, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === letter) {
            let oldColor = elem.style.backgroundColor;
            if (oldColor === greenColor) {
                return;
            }

            if (oldColor === yellowColor && color !== greenColor) {
                return;
            }

            elem.style.backgroundColor = color;
            break;
        }
    }
}

// Start
initGameBoard();

