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
