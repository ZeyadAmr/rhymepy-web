// variables
const url='https://api.datamuse.com/words?'
let rhymesStruct = {}
let poem = []
let rhymingWords = []
const colors = ["Gold", "MediumTurquoise", "LightCoral", "LightGreen", "LawnGreen", "LightPink", "LightSalmon", "LightSkyBlue", "Orange", "Violet", "Plum", "PaleTurquoise", "Bisque" ]


const fetchRhymes = async (word, option) => {
    let datamuseResponse = []
    let rhymesList = []

    if (option == 0) {
        await fetch(url + "rel_rhy=" + word)
            .then(response => {return response.json()})
            .then(data => datamuseResponse = data) 
    }

    else if (option == 1) {
        await fetch(url + "rel_nry=" + word)
            .then(response => {return response.json()})
            .then(data => datamuseResponse = data) 
    }

    else {
        await fetch(url + "rel_nry=" + word)
            .then(response => {return response.json()}).then(data => datamuseResponse = [...datamuseResponse, ...data])
        await fetch(url + "rel_rhy=" + word)
            .then(response => {return response.json()}).then(data => datamuseResponse = [...datamuseResponse, ...data])
    }

    for(const entry in datamuseResponse) {
        rhymesList.push(datamuseResponse[entry].word)
    }

    return rhymesList

    // TODO: implement progress bar
}


const generateRhymesStruct = async (inputText, option) => {

    poem = []
    rhymesStruct = []
    rhymingWords = []
    const poemLength = inputText.split(/\s+/).length
    let wordCounter = 0
    let percentage = 0 
    const lines = inputText.split(/\r?\n/)
    for (const line in lines) {
        poem.push(lines[line].split(' '))
    }

    // looks for a word in the rhymesStruct, and returns the key if it exists
    const exists = (word) => {
        for (let key in rhymesStruct) {
            if (rhymesStruct[key].includes(word)) {
                return {state: true, key: key}
            }
        }
        return {state: false}
    }

    let count = 0
    for (let testLine in poem) {
        for (let testWord in poem[testLine]) {

            if (poem[testLine] == [] || poem[testLine] == "") {break}

            testWord = poem[testLine][testWord].replace(/[^A-Za-z0-9_]/g,"").toLowerCase()
            let firstTestWordExistence = exists(testWord)

            if (!firstTestWordExistence.state) {

                await fetchRhymes(testWord, option).then(response => {

                    rhymingWords = response

                    for (let line in poem) {
                        for (let word in poem[line]) {

                            word = poem[line][word].replace(/[^A-Za-z0-9_]/g,"").toLowerCase()

                            if (rhymingWords.includes(word)) {

                                let testWordExistence = exists(testWord)
                                let wordExistence = exists(word)

                                // if both are already matched skip to the next word
                                if (testWordExistence.state && wordExistence.state) {continue}
                                else if (testWordExistence.state) {
                                    rhymesStruct[testWordExistence.key].push(word)
                                }
                                else if (wordExistence.state) {
                                    rhymesStruct[wordExistence.key].push(testWord)
                                } else {
                                    count += 1
                                    rhymesStruct[count] = []
                                    rhymesStruct[count].push(testWord)
                                    rhymesStruct[count].push(word)
                                }


                            }

                        }
                    }
                })

            }
            // progressbar
            wordCounter++
            percentage = (wordCounter * 100) / poemLength
            document.querySelector('#progressbarText').innerText = wordCounter + ' / ' + poemLength + ' words'
            document.querySelector('#progressbarPercentage').innerText = Math.round(percentage) + '%'
            document.querySelector('#progressbarInner').style.width = percentage + "%"
        }
    }

    return rhymesStruct
}

const matchRhymingWords = (rhymingMethod, lines) => {
    if (rhymingMethod == 0) {
        matchStanzas()
    } else if (rhymingMethod == 1) {
        if (lines == null || lines == "") {
            matchLines(4)
        } else {
            matchLines(lines)
        }
    } else {
        matchLines(poem.length)
    }
}

const matchLines = (lines) => {
    let colorIndex = 0
    let count = 0
    let linesBlock = []
    // remove trailing empty line in poem if it exists
    if (poem[poem.length -1] == "" || poem[poem.length -1] == []) {poem.pop()}

    for (let i = 0; i < poem.length; i++) {
        if (poem[i] != "" && poem[i].length != 0) {
            linesBlock = [...linesBlock, ...poem[i]]
            count += 1
        }
        else {
            continue
        }
        if (count == lines || i == poem.length - 1) {
            // strip all words' punctuation for proper matching
            for (let j = 0; j < linesBlock.length; j++) {
                linesBlock[j] = linesBlock[j].replace(/[^A-Za-z0-9_]/g,"").toLowerCase()
            }
            for (let key in rhymesStruct) {
                let matchingWords = rhymesStruct[key].filter(value => linesBlock.includes(value))
                if (matchingWords != [] && matchingWords != "" && matchingWords.length > 1) {
                    colorIndex += 1
                    colorizeWords(matchingWords, 0, i+2, colorIndex)
                }
            }
            count = 0
            linesBlock = []
        }
    }
}

const matchStanzas = () => {
    let colorIndex = 0
    let count = 0
    let linesBlock = []

    // add an empty line to the end of the poem to match the last stanza
    poem.push([])
    for (let i = 0; i < poem.length; i++) {

        if (poem[i] != "" && poem[i].length != 0) {
            linesBlock = [...linesBlock, ...poem[i]]
            count += 1
        } 
        else {
            for (let j = 0; j < linesBlock.length; j++) {
                linesBlock[j] = linesBlock[j].replace(/[^A-Za-z0-9_]/g,"").toLowerCase()
            }
            for (let key in rhymesStruct) {

                let matchingWords = rhymesStruct[key].filter(value => linesBlock.includes(value))

                if (matchingWords != [] && matchingWords != "" && matchingWords.length > 1) {
                    colorIndex += 1
                    colorizeWords(matchingWords, i-count, i+1, colorIndex)
                }

            }

            count = 0
            linesBlock = []

        }

    }

    // remove the added empty line
    poem.pop()

}

const colorizeWords = (matchingWordsList, lineStart, lineEnd, colorIndex) => {
    for (let i = lineStart; i < lineEnd - 1 ; i++) {
        for (let j = 0; j < poem[i].length; j++) {
            if (typeof poem[i][j] === 'string' && matchingWordsList.includes(poem[i][j].replace(/[^A-Za-z0-9_]/g,"").toLowerCase())) {
                poem[i][j] = {word: poem[i][j], color: colorizeIndex(colorIndex)}
            }
        }
    }
}

const colorizeIndex = (index) => {
    while (index >= colors.length) {
        index -= colors.length
    }
    return colors[index]
}

const returnPoem = () => {
    return poem
}

export {generateRhymesStruct, matchRhymingWords, matchLines, colors, returnPoem}
