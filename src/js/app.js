function userName () {
  let userP = document.querySelectorAll('p')[0]
  userP.innerText = 'Pick a nickname:'
}
userName()

createAnswerBox()
// creating button
function createButton () {
  let submitBtn = document.createElement('button')
  submitBtn.innerText = 'Start quiz'
  document.querySelector('#quiz').appendChild(submitBtn)
}
createButton()

function startQuiz () {
  let button = document.querySelector('#quiz button')

  button.addEventListener('click', function clickedButton (event) {
    console.log('you clicked!')
    let nickName = button.previousElementSibling.value
    document.getElementById('answerBox').value = ''
    button.innerText = 'Answer!'
    console.log(nickName)
    displayQuestion()
    server()
    button.removeEventListener('click', clickedButton)
  })
}
startQuiz()

// creating the p-element to display the question
let theQuestion
function displayQuestion () {
  theQuestion = document.querySelectorAll('p')[0]
  // document.querySelector('#quiz').appendChild(theQuestion)
  theQuestion.innerText = ''
}
// displayQuestion()

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

async function server () {
  let req = new window.XMLHttpRequest()

  req.addEventListener('load', function () {
    let questionOne = req.responseText
    questionOne = JSON.parse(questionOne)
    theQuestion.innerText = questionOne.question

    if (questionOne.hasOwnProperty('alternatives')) {
      console.log('alternatives')
      answerAlt = questionOne.alternatives
      console.log(Object.keys(answerAlt))

      for (let i in answerAlt) {
        console.log(answerAlt[i])
        createRadioBtn(answerAlt[i])
      }
      recieveAnswer()
    } else {
      console.log('textbox')
      recieveAnswer()
    }
    nextURL = questionOne.nextURL
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
    let value = button.previousElementSibling.value
    if (value.length === 0) return

    result.answer = value
    let aBox = document.getElementById('answerBox')
    console.log(aBox)
    aBox.remove()

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
    // theQuestion.innerText = resultMessage.message
    nextURL = resultMessage.nextURL
    server()
  } else {
    theQuestion.innerText = resultMessage.message
    // theQuestion.innerText = 'Game Over'
    let startBtn = document.querySelector('#quiz button')
    startBtn.innerText = 'Start again?'

    // startBtn.addEventListener('click', event => {
    // resetGame() - tex
    //   // Game over - print results - play again?
    // })
  }
}
let answerAlt = {}
function checkQuestionType () {
  if (questionOne.hasOwnProperty('alternatives')) {
    for (let i = 0; i < answerAlt.length; i++) {
      answerAlt.alt =
      createRadioBtn(answerAlt.value)
    }
  }
}

async function nextQuestion () {
  let nextReq = new window.XMLHttpRequest()

  nextReq.addEventListener('load', function () {
    console.log(nextReq.responseText)
    let nextQ = nextReq.responseText
    nextQ = JSON.parse(nextQ)
    console.log(nextQ)
    theQuestion.innerText = nextQ.question
    // nextURL = nextQ.nextURL
  })

  console.log('in nxtq ' + nextURL)
  nextReq.open('GET', nextURL)
  nextReq.send()
  server()
}

function createRadioBtn (text) {
  let radioDiv = document.createElement('div')
  radioDiv.setAttribute('id', 'alt' + text)
  let radioBtn = document.createElement('input')

  radioBtn.setAttribute('type', 'radio')
  radioBtn.setAttribute('id', 'option' + text)
  radioBtn.setAttribute('name', 'alter')
  let quiz = document.querySelector('#quiz')
  quiz.insertBefore(radioDiv, quiz.childNodes[0]).appendChild(radioBtn)

  let radioLabel = document.createElement('label')
  radioLabel.setAttribute('for', 'optionBtn')
  radioLabel.innerText = text
  document.querySelector('#alt' + text).appendChild(radioLabel)
}
