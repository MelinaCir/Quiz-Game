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

let quizStorage = window.localStorage

function startQuiz () {
  createAnswerBox()
  let button = document.querySelector('#quiz button')

  button.addEventListener('click', function clickedButton (event) {
    createTimer()

    startTimer()

    console.log('you clicked!')
    let value = button.previousElementSibling.value
    if (value.length === 0) return
    let nickName = button.previousElementSibling.value

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
      recieveAnswer()
    } else {
      createAnswerBox()
      recieveAnswer()
    }
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
      console.log('dont be here')
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
  console.log('in sendanswer' + nextURL)

  answ.open('POST', nextURL)
  answ.setRequestHeader('Content-type', 'application/json')

  answ.send(JSON.stringify(result))

  answ.addEventListener('load', function () {
    resultMessage = answ.responseText
    resultMessage = JSON.parse(resultMessage)

    // theQuestion.innerText = resultMessage.message
    nextURL = resultMessage.nextURL
    console.log('in sendanswer2' + nextURL)

    checkResult()
  })
}

function checkResult () {
  if (resultMessage.message === 'Correct answer!') {
    thePrompt.innerText = resultMessage.message

    let nextBtn = document.querySelector('#quiz button')

    if (resultMessage.hasOwnProperty('nextURL')) {
      nextBtn.innerText = 'Next Question'
      nextURL = resultMessage.nextURL

      nextBtn.addEventListener('click', function buttonClicked () {
        server()
        nextBtn.removeEventListener('click', buttonClicked)
      })
    } else {
      let gameOverText = document.createElement('h3')
      gameOverText.innerText = 'Game done!'
      let quiz = document.querySelector('#quiz')
      quiz.insertBefore(gameOverText, quiz.childNodes[0])
      nextBtn.innerText = 'Get results!'

      nextBtn.addEventListener('click', function buttonClicked () {
        printResults()
        nextBtn.removeEventListener('click', buttonClicked)
      })
    }
  } else {
    thePrompt.innerText = resultMessage.message
    // theQuestion.innerText = 'Game Over'
    let startBtn = document.querySelector('#quiz button')
    startBtn.innerText = 'Start again'

    startBtn.addEventListener('click', function buttonClicked () {
      nextURL = 'http://vhost3.lnu.se:20080/question/1'
      startBtn.innerText = 'Answer!'

      displayQuestion()
      server()

      startBtn.removeEventListener('click', buttonClicked)
    })
  }
}

function printResults () {
  console.log('WINNER ' + quizStorage.getItem('nickName'))
}

async function nextQuestion () {
  let nextReq = new window.XMLHttpRequest()

  nextReq.addEventListener('load', function () {
    console.log(nextReq.responseText)
    let nextQ = nextReq.responseText
    nextQ = JSON.parse(nextQ)
    console.log(nextQ)
    thePrompt.innerText = nextQ.question
    // nextURL = nextQ.nextURL
  })

  console.log('in nxtq ' + nextURL)
  nextReq.open('GET', nextURL)
  nextReq.send()
  server()
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

  let timer = document.createElement('span')
  timer.setAttribute('id', 'time')
  timer.textContent = 'lalala'

  timerDiv.appendChild(timer)
  let quiz = document.querySelector('#quiz')
  quiz.appendChild(timerDiv)
}

function startTimer () {
  let display = document.querySelector('#time')
  let timer = 20
  let seconds

  setInterval(function () {
    seconds = parseInt(timer)

    display.textContent = 'You have: ' + seconds + ' seconds'

    if (--timer < 0) {
      display.textContent = 'Time up!'
    }
  }, 1000)
}
