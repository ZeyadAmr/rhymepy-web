// imports
import {generateRhymesStruct, matchStanzas, colors, returnPoem} from './logic.js'

// elements
const analyzeButton = document.querySelector('.analyze-button')
const logoText = document.querySelector('.logo-text')
let output = document.querySelector('.output')


// Set a random color from the colors list as the logo's background color
const randomColor = colors[Math.floor(Math.random()*colors.length)]
logoText.style.background = "linear-gradient(to top," + randomColor +" 30%, transparent 30%)"


analyzeButton.addEventListener("click", () => (async function() {
    await generateRhymesStruct()
    matchStanzas()
    displayPoem()
})()
)

const displayPoem = () => {
    const poem = returnPoem()
    let poemString = ""

    for (let line in poem) {
        for (let word in poem[line]) {
            poemString += poem[line][word] + " "
        }
        poemString += "\r\n"
    }
    output.textContent = poemString
    // console.log(poem)
}
