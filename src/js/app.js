let theQuestion

function displayQuestion () {
  theQuestion = document.createElement('p')
  document.querySelector('#quiz').appendChild(theQuestion)
  theQuestion.innerText = 'Hello World'
}
displayQuestion()

let req = new window.XMLHttpRequest()

req.addEventListener('load', function () {
  console.log(req.responseText)
  let answer = req.responseText
  answer = JSON.parse(answer)
  console.log(answer)
  theQuestion.innerText = answer.question
})

req.open('GET', 'http://vhost3.lnu.se:20080/question/1')
req.send()

let theAnswer

function createAnswerBox () {
  theAnswer = document.createElement('input')
  theAnswer.setAttribute('type', 'text')
  theAnswer.setAttribute('id', 'answerBox')
  document.querySelector('#quiz').appendChild(theAnswer)
}
createAnswerBox()

function getAnswer () {
  let answOne = document.querySelectorAll('#answerBox input')[0]
  console.log(answOne)

  document.querySelector('#answerBox').addEventListener('blur', event => {
    if (answOne !== undefined) {
      console.log(answOne.toString())
    }
  }, true)
}

getAnswer()

let answ = new window.XMLHttpRequest()

answ.addEventListener()
