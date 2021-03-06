/**
 * Module for the quiz.
 *
 * @module js/quiz
 * @author Melina Cirverius
 * @version 1.0
 */

// Declaring variables
let thePrompt
let quizStorage = window.sessionStorage
let highScore = window.localStorage
let nickName
let user

/**
 * Changing the value of the text to prompt the user to enter a name.
 */
function userName () {
  user = document.createElement('p')
  user.setAttribute('id', 'userName')
  user.innerText = 'Player '

  let body = document.querySelector('body')
  body.insertBefore(user, body.childNodes[2])

  thePrompt = document.querySelectorAll('p')[1]
  thePrompt.innerText = 'Pick a nickname:'
}

/**
 * Creating a html-element to display the button.
 */
function createButton () {
  let submitBtn = document.createElement('button')
  submitBtn.innerText = 'Start quiz'
  document.querySelector('#quiz').appendChild(submitBtn)
}

/**
 * Creating an input box in html for all inputs
 */
function createAnswerBox () {
  let theAnswer
  let quiz = document.getElementById('quiz')

  theAnswer = document.createElement('input')
  theAnswer.setAttribute('type', 'text')
  theAnswer.setAttribute('id', 'answerBox')
  theAnswer.setAttribute('value', '')
  quiz.insertBefore(theAnswer, quiz.childNodes[0])
}

/**
 * Sets up the quiz for the start, creating the users nickname and calls the first question.
 */
function startQuiz () {
  userName()
  createButton()
  createAnswerBox()

  let button = document.querySelector('#quiz button')

  button.addEventListener('click', function clickedButton (event) {
    let value = button.previousElementSibling.value
    if (value.length === 0) return
    nickName = 'Player ' + button.previousElementSibling.value
    user.innerText = nickName

    quizStorage.setItem('nickName', nickName)
    button.innerText = 'Answer!'

    let aBox = document.getElementById('answerBox')
    aBox.remove()

    getQuestion()

    button.removeEventListener('click', clickedButton)
  })
}

var nextURL = 'http://vhost3.lnu.se:20080/question/1'
let theQuestion
/**
 * Sends the request for the question and returns the response
 *
 * @returns response - The response from the server including the question.
 */
async function reqQuestion () {
  let request = await window.fetch(nextURL)
  let response = await request.json()
  return response
}

/**
 * When response have been recieved from server, checks if it is a question with alternatives
 * and creates alternatives or answer input box
 * And displays the question to the user
 */
async function getQuestion () {
  createTimer()
  startTimer()

  let req = await reqQuestion()

  theQuestion = req
  thePrompt.innerText = theQuestion.question

  let button = document.querySelector('#quiz button')
  button.innerText = 'Answer'

  if (theQuestion.hasOwnProperty('alternatives')) {
    let answerAlt = theQuestion.alternatives

    for (let alt in answerAlt) {
      let value = answerAlt[alt]
      createRadioBtn(value, alt)
    }
  } else {
    createAnswerBox()
  }
  recieveAnswer()

  nextURL = theQuestion.nextURL
}

let result = {}
/**
 * Takes the answer when button clicked and empty the answer options
 */
function recieveAnswer () {
  let button = document.querySelector('#quiz button')

  button.addEventListener('click', function buttonClicked () {
    if (theQuestion.hasOwnProperty('alternatives')) {
      stopTimer()

      let buttons = document.getElementsByName('alter')

      for (let buttonKey in buttons) {
        let alternative = buttons[buttonKey]

        if (alternative.checked) {
          let value = alternative.parentNode.id
          result.answer = value
        }
      }
      let allButtonDivs = Array.from(document.querySelectorAll('.buttonDiv'))

      for (let buttonDiv in allButtonDivs) {
        allButtonDivs[buttonDiv].remove()
      }
    } else {
      let value = button.previousElementSibling.value
      if (value.length === 0) return

      stopTimer()
      result.answer = value

      let aBox = document.getElementById('answerBox')
      aBox.remove()
    }
    getResponse()
    button.removeEventListener('click', buttonClicked)
  })
}

let resultMessage
/**
 * Creates a fetch request and sends the answer to the question
 */
async function sendAnswer () {
  let answer = await window.fetch(nextURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(result)
  })
  let resp = await answer.json()
  return resp
}

/**
 * Awaits the response from the server and then asigns the result message
 */
async function getResponse () {
  let answ = await sendAnswer()
  resultMessage = answ

  theQuestion.innerText = resultMessage.message
  nextURL = resultMessage.nextURL

  checkResult()
}

/**
 * Checks the result message from the server to see if correct answer or not
 * Also checks if there is another question to get or else quits the quiz.
 */
function checkResult () {
  thePrompt.innerText = resultMessage.message

  let nextBtn = document.querySelector('#quiz button')
  let gameOverText = document.createElement('h3')
  let quiz = document.querySelector('#quiz')

  if (resultMessage.message === 'Correct answer!') {
    if (resultMessage.hasOwnProperty('nextURL')) {
      nextBtn.innerText = 'Next Question'
      nextURL = resultMessage.nextURL

      nextBtn.addEventListener('click', function buttonClicked () {
        getQuestion()
        nextBtn.removeEventListener('click', buttonClicked)
      })
    } else {
      quiz.insertBefore(gameOverText, quiz.childNodes[0])

      gameOverText.innerText = 'Game done!'
      nextBtn.innerText = 'Get results!'

      nextBtn.addEventListener('click', function buttonClicked () {
        printResults()
        nextBtn.removeEventListener('click', buttonClicked)
      })
    }
  } else {
    gameOver()
  }
}

/**
 * Prints the result of the quiz with players nickname and total time
 * Also takes the top five results from the web storage to be able to create high score list
 */
function printResults () {
  let button = document.querySelector('button')
  button.remove()

  let totalTime = 0

  for (let i = 1; i < quizStorage.length; i++) {
    let timeLeft = parseInt(quizStorage.getItem(quizStorage.key(i)))
    let timeTaken = 20 - timeLeft
    totalTime += timeTaken
  }
  let resultP = document.createElement('p')
  resultP.innerText = nickName + ' won!' + '\nTotal time taken: ' + totalTime + ' seconds'

  document.querySelector('#quiz').appendChild(resultP)
  highScore.setItem(nickName, totalTime)

  let highScoreList = []

  for (let player in highScore) {
    if (player.startsWith('Player')) {
      highScoreList.push([player, highScore[player]])
    }
  }

  highScoreList.sort(function (a, b) {
    return a[1] - b[1]
  })

  let topFive = highScoreList.slice(0, 5)
  let printTopFive = topFive.map(item => item[0] + ',\t' + ' Total time: ' + item[1])
  createHighScore(printTopFive)

  quizStorage.clear()
}

/**
 * Creates radio buttons for each alternative in the current question
 * @param {string} value - the value of the alternative
 * @param {string} alt - the name and number of the alternative
 */
function createRadioBtn (value, alt) {
  let radioDiv = document.createElement('div')
  radioDiv.setAttribute('id', alt)
  radioDiv.setAttribute('class', 'buttonDiv')

  let radioBtn = document.createElement('input')
  radioBtn.setAttribute('type', 'radio')
  radioBtn.setAttribute('class', 'optionBtn')
  radioBtn.setAttribute('name', 'alter')

  let quiz = document.querySelector('#quiz')
  quiz.insertBefore(radioDiv, quiz.childNodes[0]).appendChild(radioBtn)

  let radioLabel = document.createElement('label')
  radioLabel.setAttribute('for', '.optionBtn')
  radioLabel.innerText = value

  document.querySelector('#' + alt).appendChild(radioLabel)
}

/**
 * Creates the elements for the timer
 */
function createTimer () {
  let timerDiv = document.createElement('div')
  timerDiv.setAttribute('id', 'timerDiv')

  let timer = document.createElement('span')
  timer.setAttribute('id', 'time')

  timerDiv.appendChild(timer)
  let body = document.querySelector('body')
  body.appendChild(timerDiv)
}

let theTimer
let counter = 0
let seconds
/**
 * Starts the timer to count down from 20 to 0 seconds
 */
function startTimer () {
  let display = document.querySelector('#time')
  let timer = 19

  display.textContent = 'You have: 20 seconds'

  theTimer = setInterval(function () {
    seconds = parseInt(timer)

    display.textContent = 'You have: ' + seconds + ' seconds'

    if (--timer < 0) {
      thePrompt.innerText = 'Time´s up!'
      stopTimer()
    }
  }, 1000)
}

/**
 * Stops the timer when it is done and either saves the result to web storage
 * or displays game over if time ran out
 */
function stopTimer () {
  clearInterval(theTimer)
  counter++
  let timer = document.querySelector('#timerDiv')
  timer.remove()

  if (seconds > 0) {
    quizStorage.setItem('time' + counter, seconds)
  } else {
    gameOver()
  }
}

/**
 * Creates the high score list by creating elements for each value of the top five scores
 * @param {Array} arr - The set of data to be used for creating high scores
 */
function createHighScore (arr) {
  let theList = document.createElement('ol')
  theList.setAttribute('id', 'HSlist')

  let listText = document.createTextNode('High scores')
  theList.appendChild(listText)

  for (let score in arr) {
    let li = document.createElement('li')
    let liNode = document.createTextNode(arr[score])
    li.setAttribute('class', 'list')

    li.appendChild(liNode)
    theList.appendChild(li)
  }

  document.getElementById('quiz').appendChild(theList)
}

/**
 * Removes elements from user interface and displays game over together with an option
 * for the player to start the quiz again
 */
function gameOver () {
  let questionAlt = document.getElementById('quiz')
  while (questionAlt.firstChild) {
    questionAlt.removeChild(questionAlt.firstChild)
  }

  createButton()
  let nextBtn = document.querySelector('#quiz button')
  let gameOverText = document.createElement('h3')
  let quiz = document.querySelector('#quiz')

  quiz.insertBefore(gameOverText, quiz.childNodes[0])

  gameOverText.innerText = 'Game over!'
  nextBtn.innerText = 'Start again'

  nextBtn.addEventListener('click', function buttonClicked () {
    quizStorage.clear()
    quizStorage.setItem('nickname', nickName)
    counter = 0

    let theText = document.querySelector('#quiz h3')
    theText.remove()
    nextURL = 'http://vhost3.lnu.se:20080/question/1'
    nextBtn.innerText = 'Answer!'

    getQuestion()

    nextBtn.removeEventListener('click', buttonClicked)
  })
}

// Exports
export default {
  userName,
  checkResult,
  createAnswerBox,
  createButton,
  gameOver,
  getQuestion,
  getResponse,
  createHighScore,
  createRadioBtn,
  createTimer,
  startTimer,
  stopTimer,
  printResults,
  recieveAnswer,
  sendAnswer,
  startQuiz
}
