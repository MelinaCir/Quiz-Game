let theQuestion
// creating the p-element to display the question
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

function createButton () {
  let submitBtn = document.createElement('button')
  submitBtn.innerText = 'press'
  document.querySelector('#quiz').appendChild(submitBtn)
}
createButton()

function recieveAnswer () {
  let button = document.querySelector('#quiz button')

  button.addEventListener('click', event => {
    let value = button.previousElementSibling.value
    if (value.length === 0) return

    console.log(value)
  })
}

recieveAnswer()

// function getAnswer () {
//   let answOne = document.querySelectorAll('#answerBox input')

//   document.querySelector('#answerBox').addEventListener('blur', event => {
//     if (answOne !== undefined) {
//       answOne = answOne[0]
//       console.log(answOne)
//       let testing = answOne[0]
//       console.log(testing)
//     } else {
//       console.log('wrong')
//     }
//   }, true)
// }

// getAnswer()

let answ = new window.XMLHttpRequest()

answ.addEventListener()
