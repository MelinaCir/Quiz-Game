class ServerContact {
  constructor () {
    let testing = 'hello'
    console.log(testing)
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
  }

  // sending the request for the first question and displaying it in the p-element
}

export default {
  ServerContact
}
