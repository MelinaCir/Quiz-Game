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

function startQuiz () {
  createAnswerBox()
  let button = document.querySelector('#quiz button')

  button.addEventListener('click', function clickedButton (event) {
    console.log('you clicked!')
    let nickName = button.previousElementSibling.value
    // document.getElementById('answerBox').value = ''
    button.innerText = 'Answer!'
    console.log(nickName)

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

  req.addEventListener('load', function () {
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
      console.log('alternatives')
      let buttons = document.getElementsByName('alter')
      console.log(buttons)

      for (let buttonKey in buttons) {
        console.log(buttons[buttonKey].checked)
      }
      // if (document.getElementById('optionBtn').checked) {

      //   let value = button.previousElementSibling.getAttribute('id')
      //   result.answer = value

      //   console.log('here!' + value)
      // }
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
    nextBtn.innerText = 'Next Question'
    nextURL = resultMessage.nextURL

    nextBtn.addEventListener('click', function buttonClicked () {
      server()
    })
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
