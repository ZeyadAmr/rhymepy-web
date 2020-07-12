// imports
import {generateRhymesStruct, matchRhymingWords, colors, returnPoem} from './logic.js'

// variables
const analyzeButton = document.querySelector('.analyze-button')
const logoText = document.querySelector('.logo-text')
const spinner = document.querySelector('.spinner')
const rectangles = spinner.querySelectorAll("div") 
const btns = document.querySelectorAll('.btn')
const randomColor = colors[Math.floor(Math.random()*colors.length)]
const textarea = document.querySelector('#text')
let output = document.querySelector('.output')


// Set a random color from the colors list as the logo's background color
logoText.style.background = "linear-gradient(to top," + randomColor +" 30%, transparent 30%)"
// Set a random color from the colors list as loading spinner's color
rectangles.forEach(rect => rect.style.backgroundColor = randomColor)
// Set a random color from the colors list as .btn background color
btns.forEach(btn => btn.style.backgroundColor = randomColor)
// Change textarea's height to match content height
// textarea.style.maxHeight = 650 + "px"
textarea.addEventListener("input", () => {
    textarea.style.height = ""
    textarea.style.height = textarea.scrollHeight + "px"
})

// Start Rhymepy
analyzeButton.addEventListener("click", () => (async function() {
    const textValue = textarea.value
    const rhymingOption = document.querySelector('input[name="rhyming-options"]:checked').value 
    const rhymingMethod = document.querySelector('input[name="rhyming-methods"]:checked').value
    const lines = document.querySelector('input[name="lines-value"]').value

    output.innerHTML = ""
    spinner.classList.remove("hidden")
    await generateRhymesStruct(textValue, rhymingOption)
    matchRhymingWords(rhymingMethod, lines)
    displayPoem()
    spinner.classList.add("hidden")
})()
)


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
}
