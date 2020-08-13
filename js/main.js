// imports
import {generateRhymesStruct, matchRhymingWords, colors, returnPoem} from './logic.js'

// variables
const analyzeButton = document.querySelector('.analyze-button')
const logoText = document.querySelector('.logo-text')
const spinner = document.querySelector('#spinner')
const progressbar = document.querySelector('#progressbar')
const rectangles = spinner.querySelectorAll("div") 
const btns = document.querySelectorAll('.btn')
const randomColor = colors[Math.floor(Math.random()*colors.length)]
const textarea = document.querySelector('#text')
const outputContainer = document.querySelector('.output-container')
let output = document.querySelector('.output')
const resetButton = document.querySelector('#reset-button')
const textReset = document.querySelector('#text-reset')


// Set a random color from the colors list as the logo's background color
logoText.style.background = "linear-gradient(to top," + randomColor +" 30%, transparent 30%)"
// Set a random color from the colors list as the progressbar's color
progressbarInner.style.backgroundColor = randomColor
// Set a random color from the colors list as loading spinner's color
rectangles.forEach(rect => rect.style.backgroundColor = randomColor)
// Set a random color from the colors list as .btn background color
btns.forEach(btn => btn.style.backgroundColor = randomColor)
// Change textarea's height to match content height
textarea.addEventListener("input", () => {
    textarea.style.height = ""
    textarea.style.height = textarea.scrollHeight + "px"
})
// Run on load to get right textarea height when page is refreshed
textarea.style.height = ""
textarea.style.height = textarea.scrollHeight + 3 + "px"


// Start Rhymepy
analyzeButton.addEventListener("click", () => (async function() {
    const textValue = textarea.value
    const rhymingOption = document.querySelector('input[name="rhyming-options"]:checked').value 
    const rhymingMethod = document.querySelector('input[name="rhyming-methods"]:checked').value
    const lines = document.querySelector('input[name="lines-value"]').value
    
    // hide output and show input box
    outputContainer.classList.add("hidden")
    textarea.classList.remove("hidden")


    // check if textarea is not empty
    if (textValue.trim().length !== 0) {
        analyzeButton.disabled = true
        output.innerHTML = ""
        spinner.classList.remove("hidden")
        progressbar.classList.remove("hidden")
        await generateRhymesStruct(textValue, rhymingOption)
        matchRhymingWords(rhymingMethod, lines)
        displayPoem()
        spinner.classList.add("hidden")
        progressbar.classList.add("hidden")
        analyzeButton.disabled = false
        progressbarInner.style.width = "1%"
    }
})()

)

// Reset button
resetButton.addEventListener("click", () => {
    outputContainer.classList.add("hidden")
    textarea.classList.remove("hidden")
})

// Text reset
textReset.addEventListener("click", () => {
    // Reset textarea height
    textarea.value = ""
    textarea.style.height = ""
    textarea.style.height = textarea.scrollHeight + 3 + "px"

    outputContainer.classList.add("hidden")
    textarea.classList.remove("hidden")
})

const displayPoem = () => {
    const poem = returnPoem()

    for (let line in poem) {
        for (let word in poem[line]) {

            const wordSpan = document.createElement('span')
            const emptySpan = document.createElement('span')
            emptySpan.textContent = ' '
            output.appendChild(wordSpan)
            output.appendChild(emptySpan)

            if (typeof poem[line][word] === 'string') {
                wordSpan.textContent = poem[line][word] 
            }
            else {
                wordSpan.setAttribute('style', 'background-color:' + poem[line][word].color)
                wordSpan.textContent = poem[line][word].word 
            }

        }

        output.appendChild(document.createElement('br'))
    }
    outputContainer.classList.remove("hidden")
    textarea.classList.add("hidden")
}
