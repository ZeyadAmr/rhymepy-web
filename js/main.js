// imports
import {generateRhymesStruct, matchStanzas, colors, returnPoem} from './logic.js'

// variables
const analyzeButton = document.querySelector('.analyze-button')
const logoText = document.querySelector('.logo-text')
const spinner = document.querySelector('.spinner')
const rectangles = spinner.querySelectorAll("div") 
let output = document.querySelector('.output')


// Set a random color from the colors list as the logo's background color
const randomColor = colors[Math.floor(Math.random()*colors.length)]
logoText.style.background = "linear-gradient(to top," + randomColor +" 30%, transparent 30%)"

// Set spinner's color to random color
rectangles.forEach(rect => rect.style.backgroundColor = randomColor)

// Start Rhymepy
analyzeButton.addEventListener("click", () => (async function() {
    let rhymingOption = document.querySelector('input[name="rhyming-options"]:checked').value 
    output.innerHTML = ""
    spinner.classList.remove("hidden")
    await generateRhymesStruct(rhymingOption)
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
