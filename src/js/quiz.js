
function userName () {
  let userP = document.createElement('p')
  let theH2 = document.querySelectorAll('h1')[0]
  userP.innerText = 'Pick a nickname:'
  theH2.parentElement.insertBefore(userP, theH2.nextElementSibling)
}
userName()

function displayUserName () {
  let userDiv = document.createElement('div')
  userDiv.setAttribute('id', 'user')
  document.querySelector('body').appendChild(userDiv)

  let userBox = document.createElement('input')
  userBox.setAttribute('type', 'text')
  userBox.setAttribute('id', 'userBox')
  document.querySelector('#user').appendChild(userBox)
  // createButton()
}
displayUserName()

let req = new window.XMLHttpRequest()

req.addEventListener('load', function () {
  console.log(req.responseText)
})
req.open('GET', 'data.json')
req.send()

export default {
  displayQuestion
}
