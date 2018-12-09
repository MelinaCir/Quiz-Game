function userName () {
  let userP = document.querySelectorAll('p')[0]
  userP.innerText = 'Pick a nickname:'
}
userName()

// creating button
function createButton () {
  let submitBtn = document.createElement('button')
  submitBtn.innerText = 'Start quiz'
  document.querySelector('#quiz').appendChild(submitBtn)
}
createButton()

let quizStorage = window.sessionStorage
let highScore = window.localStorage
let nickName

function startQuiz () {
  createAnswerBox()
  let button = document.querySelector('#quiz button')

  button.addEventListener('click', function clickedButton (event) {
    console.log('you clicked!')
    let value = button.previousElementSibling.value
    if (value.length === 0) return
    nickName = button.previousElementSibling.value

    quizStorage.setItem('nickName', nickName)
    // document.getElementById('answerBox').value = ''
    button.innerText = 'Answer!'
    console.log(quizStorage)

    let aBox = document.getElementById('answerBox')
    aBox.remove()

    displayQuestion()
    server()

    button.removeEventListener('click', clickedButton)
  })
}
startQuiz()

// creating the p-element to display the question
let thePrompt
function displayQuestion () {
  thePrompt = document.querySelectorAll('p')[0]
  thePrompt.innerText = ''
}

// creating answer box

function createAnswerBox () {
  let theAnswer
  let quiz = document.getElementById('quiz')
  theAnswer = document.createElement('input')
  theAnswer.setAttribute('type', 'text')
  theAnswer.setAttribute('id', 'answerBox')
  theAnswer.setAttribute('value', '')
  quiz.insertBefore(theAnswer, quiz.childNodes[0])
}

// sending the request for the first question and displaying it in the p-element
var nextURL = 'http://vhost3.lnu.se:20080/question/1'
let theQuestion

async function server () {
  let req = new window.XMLHttpRequest()

  createTimer()
  startTimer()
  req.addEventListener('load', function getQuestion () {
    theQuestion = req.responseText
    theQuestion = JSON.parse(theQuestion)
    thePrompt.innerText = theQuestion.question

    if (theQuestion.hasOwnProperty('alternatives')) {
      let answerAlt = theQuestion.alternatives
      console.log(Object.keys(answerAlt))

      for (let key in answerAlt) {
        let value = answerAlt[key]
        console.log(key)
        createRadioBtn(value, key)
      }
      // recieveAnswer()
    } else {
      createAnswerBox()
      // recieveAnswer()
    }
    recieveAnswer()

    nextURL = theQuestion.nextURL
    req.removeEventListener('load', getQuestion)
  })

  console.log('in server' + nextURL)
  req.open('GET', nextURL)
  req.send()
}
// server()

// Take the answer when button clicked and empty the answer options
let result = {}

function recieveAnswer () {
  let button = document.querySelector('#quiz button')

  button.addEventListener('click', function buttonClicked () {
    stopTimer()
    console.log(quizStorage)

    if (theQuestion.hasOwnProperty('alternatives')) {
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

      result.answer = value
      let aBox = document.getElementById('answerBox')
      aBox.remove()
    }
    sendAnswer()

    button.removeEventListener('click', buttonClicked)
  })
}

// creating a post xmlrequest and sending answer
let resultMessage

async function sendAnswer () {
  let answ = new window.XMLHttpRequest()

  answ.open('POST', nextURL)
  answ.setRequestHeader('Content-type', 'application/json')

  answ.send(JSON.stringify(result))

  answ.addEventListener('load', function () {
    resultMessage = answ.responseText
    resultMessage = JSON.parse(resultMessage)

    // theQuestion.innerText = resultMessage.message
    nextURL = resultMessage.nextURL

    checkResult()
  })
}

function checkResult () {
  thePrompt.innerText = resultMessage.message
  let nextBtn = document.querySelector('#quiz button')

  if (resultMessage.message === 'Correct answer!') {
    if (resultMessage.hasOwnProperty('nextURL')) {
      nextBtn.innerText = 'Next Question'
      nextURL = resultMessage.nextURL

      nextBtn.addEventListener('click', function buttonClicked () {
        server()
        nextBtn.removeEventListener('click', buttonClicked)
      })
    } else {
      let gameOverText = document.createElement('h3')
      let quiz = document.querySelector('#quiz')
      quiz.insertBefore(gameOverText, quiz.childNodes[0])

      gameOverText.innerText = 'Game done!'
      nextBtn.innerText = 'Get results!'

      nextBtn.addEventListener('click', function buttonClicked () {
        printResults()
        nextBtn.removeEventListener('click', buttonClicked)
      })
    }
  } else {
    quizStorage.clear()
    quizStorage.setItem('nickname', nickName)
    counter = 0
    nextBtn.innerText = 'Start again'

    nextBtn.addEventListener('click', function buttonClicked () {
      nextURL = 'http://vhost3.lnu.se:20080/question/1'
      nextBtn.innerText = 'Answer!'

      displayQuestion()
      server()

      nextBtn.removeEventListener('click', buttonClicked)
    })
  }
}

function printResults () {
  //
  // TODO: Vi har tänkt fel om tiden. Total time left är det vi har, inte taken.
  //
  let totalTime = 0

  for (let i = 1; i < quizStorage.length; i++) {
    let timeLeft = parseInt(quizStorage.getItem(quizStorage.key(i)))
    let timeTaken = 20 - timeLeft
    totalTime += timeTaken
    console.log(timeTaken)
  }
  let resultP = document.createElement('p')
  resultP.innerText = nickName + ' won!' + '\nTotal time taken: ' + totalTime + ' seconds'

  document.querySelector('#quiz').appendChild(resultP)

  highScore.setItem(nickName, totalTime)
  console.log('HIGHSCORE' + highScore)

  for (let playerName in highScore) {
    console.log('PLAYER ' + playerName)
    let playerTime = highScore[playerName]

    console.log('Time ' + playerTime)
  }

  quizStorage.clear()
}

function createRadioBtn (value, key) {
  let radioDiv = document.createElement('div')
  radioDiv.setAttribute('id', key)
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

  document.querySelector('#' + key).appendChild(radioLabel)
}

// va
function createTimer () {
  let timerDiv = document.createElement('div')
  timerDiv.setAttribute('id', 'timerDiv')

  let timer = document.createElement('span')
  timer.setAttribute('id', 'time')

  timerDiv.appendChild(timer)
  let quiz = document.querySelector('#quiz')
  quiz.appendChild(timerDiv)
}

let theTimer
let counter = 0
let seconds

function startTimer () {
  let display = document.querySelector('#time')
  let timer = 19

  display.textContent = 'You have: 20 seconds'

  theTimer = setInterval(function () {
    seconds = parseInt(timer)

    display.textContent = 'You have: ' + seconds + ' seconds'

    if (--timer < 0) {
      display.textContent = 'Time up!'
    }
  }, 1000)
}

function stopTimer () {
  clearInterval(theTimer)
  counter++

  quizStorage.setItem('time' + counter, seconds)
  let timer = document.querySelector('#timerDiv')

  timer.remove()
}
