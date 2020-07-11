// imports
import {generateRhymesStruct, matchStanzas, colors, returnPoem} from './logic.js'

// variables
const analyzeButton = document.querySelector('.analyze-button')
const logoText = document.querySelector('.logo-text')
const spinner = document.querySelector('.spinner')
const dot1 = document.querySelector('.dot1')
const dot2 = document.querySelector('.dot2')
let output = document.querySelector('.output')


// Set a random color from the colors list as the logo's background color
const randomColor = colors[Math.floor(Math.random()*colors.length)]
logoText.style.background = "linear-gradient(to top," + randomColor +" 30%, transparent 30%)"

// Set spinner's color to random color
dot1.style.backgroundColor = randomColor
dot2.style.backgroundColor = randomColor

// Start Rhymepy
analyzeButton.addEventListener("click", () => (async function() {
    spinner.classList.remove("hidden")
    await generateRhymesStruct()
    matchStanzas()
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
