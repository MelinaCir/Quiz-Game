// creating the p-element to display the question
let theQuestion
function displayQuestion () {
  theQuestion = document.createElement('p')
  document.querySelector('#quiz').appendChild(theQuestion)
  theQuestion.innerText = ''
}
displayQuestion()

// sending the request for the first question and displaying it in the p-element
var nextURL = 'http://vhost3.lnu.se:20080/question/1'
async function server () {
  let req = new window.XMLHttpRequest()

  req.addEventListener('load', function () {
    console.log(req.responseText)
    let questionOne = req.responseText
    questionOne = JSON.parse(questionOne)
    console.log(questionOne)
    theQuestion.innerText = questionOne.question
    nextURL = questionOne.nextURL
  })

  req.open('GET', nextURL)
  req.send()
}
server()

// creating answer box
let theAnswer

function createAnswerBox () {
  theAnswer = document.createElement('input')
  theAnswer.setAttribute('type', 'text')
  theAnswer.setAttribute('id', 'answerBox')
  document.querySelector('#quiz').appendChild(theAnswer)
}
createAnswerBox()

// creating button
function createButton () {
  let submitBtn = document.createElement('button')
  submitBtn.innerText = 'press'
  document.querySelector('#quiz').appendChild(submitBtn)
}
createButton()
let result = {}

function recieveAnswer () {
  let button = document.querySelector('#quiz button')
  let answOne = document.querySelectorAll('#answerBox input')

  button.addEventListener('click', event => {
    let value = button.previousElementSibling.value
    if (value.length === 0) return

    result.answer = value
    // answer = JSON.stringify(answer)

    console.log(answOne)
    sendAnswer()
  })
}
recieveAnswer()

async function sendAnswer (answer) {
  let answ = new window.XMLHttpRequest()

  answ.open('POST', nextURL)
  answ.setRequestHeader('Content-type', 'application/json')

  answ.send(JSON.stringify(result))

  answ.addEventListener('load', function () {
    let resultMessage = answ.responseText
    resultMessage = JSON.parse(resultMessage)
    console.log(resultMessage)
    theQuestion.innerText = resultMessage.message
  })
  // nextQuestion()
}

async function nextQuestion () {
  let nextReq = new window.XMLHttpRequest()

  nextReq.addEventListener('load', function () {
    console.log(nextReq.responseText)
    let nextQ = nextReq.responseText
    nextQ = JSON.parse(nextQ)
    console.log(nextQ)
    theQuestion.innerText = nextQ.question
    // let nextURL = questionOne.nextURL
  })

  nextReq.open('GET', 'http://vhost3.lnu.se:20080/question/21')
  nextReq.send()
}

// async function printResult () {
//   let resultMsg = document.createElement('p')
//   document.querySelector('#quiz').appendChild(resultMsg)
//   resultMsg.innerText = 'Hello World'
// }

// async function sendingAnswer () {
//   let data = {
//     answer: 2
//   }

//   let res = await window.fetch('http://vhost3.lnu.se:20080/answer/1', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data)
//   })
// }
// sendingAnswer()

function createRadioBtn () {
  let radioDiv = document.createElement('div')
  radioDiv.setAttribute('id', 'radio')
  let radioBtn = document.createElement('input')

  radioBtn.setAttribute('type', 'radio')
  radioBtn.setAttribute('id', 'optionBtn')
  radioBtn.setAttribute('value', 'option one')
  document.querySelector('#quiz').appendChild(radioDiv).appendChild(radioBtn)

  let radioLabel = document.createElement('label')
  radioLabel.setAttribute('for', 'optionBtn')
  radioLabel.innerText = 'test'
  document.querySelector('#radio').appendChild(radioLabel)
}
createRadioBtn()
