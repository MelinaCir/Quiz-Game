class ServerContact extends window.HTMLElement {
  constructor () {
    super()
    // sending the request for the first question and displaying it in the p-element
    var nextURL = 'http://vhost3.lnu.se:20080/question/1'
    let theQuestion

    async function server () {
      let req = new window.XMLHttpRequest()

      createTimer()
      startTimer()

      req.addEventListener('load', function getQuestion () {
        theQuestion = req.responseText
        theQuestion = JSON.parse(theQuestion)
        thePrompt.innerText = theQuestion.question

        if (theQuestion.hasOwnProperty('alternatives')) {
          let answerAlt = theQuestion.alternatives

          for (let key in answerAlt) {
            let value = answerAlt[key]
            createRadioBtn(value, key)
          }
        } else {
          createAnswerBox()
        }
        recieveAnswer()

        nextURL = theQuestion.nextURL
        req.removeEventListener('load', getQuestion)
      })

      req.open('GET', nextURL)
      req.send()
    }
    let resultMessage
    let result = {}

    async function sendAnswer () {
      let answ = new window.XMLHttpRequest()

      answ.open('POST', nextURL)
      answ.setRequestHeader('Content-type', 'application/json')

      answ.send(JSON.stringify(result))

      resultMessage = answ.responseText
      answ.addEventListener('load', function () {
        resultMessage = JSON.parse(resultMessage)

        theQuestion.innerText = resultMessage.message
        nextURL = resultMessage.nextURL

        checkResult()
      })
    }
  }

  // sending the request for the first question and displaying it in the p-element
}

export default {
  ServerContact
}
