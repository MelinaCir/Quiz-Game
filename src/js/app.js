// creating the p-element to display the question
let theQuestion
function displayQuestion () {
  theQuestion = document.createElement('p')
  document.querySelector('#quiz').appendChild(theQuestion)
  theQuestion.innerText = 'Hello World'
}
displayQuestion()

// sending the request for the first question and displaying it in the p-element
let req = new window.XMLHttpRequest()

req.addEventListener('load', function () {
  console.log(req.responseText)
  let questionOne = req.responseText
  questionOne = JSON.parse(questionOne)
  console.log(questionOne)
  theQuestion.innerText = questionOne.question
  // let nextURL = questionOne.nextURL
})

req.open('GET', 'http://vhost3.lnu.se:20080/question/1')
req.send()

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

  answ.open('POST', 'http://vhost3.lnu.se:20080/answer/1')
  answ.setRequestHeader('Content-type', 'application/json')

  answ.send(JSON.stringify(result))
}

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
