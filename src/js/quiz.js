function displayQuestion () {
  let question = document.createElement('p')
  document.querySelector('#quiz').appendChild(question)
}

let req = new window.XMLHttpRequest()

req.addEventListener('load', function () {
  console.log(req.responseText)
})
req.open('GET', 'data.json')
req.send()

export default {
  displayQuestion
}
