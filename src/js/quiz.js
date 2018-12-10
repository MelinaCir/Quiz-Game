class Quiz {
  constructor () {
    let thePrompt
    let quizStorage = window.sessionStorage
    let highScore = window.localStorage
    let nickName

    function userName () {
      thePrompt = document.querySelectorAll('p')[0]
      thePrompt.innerText = 'Pick a nickname:'
    }

    // creating button
    function createButton () {
      let submitBtn = document.createElement('button')
      submitBtn.innerText = 'Start quiz'
      document.querySelector('#quiz').appendChild(submitBtn)
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

    function startQuiz () {
      userName()
      createButton()
      createAnswerBox()

      let button = document.querySelector('#quiz button')

      button.addEventListener('click', function clickedButton (event) {
        let value = button.previousElementSibling.value
        if (value.length === 0) return
        nickName = button.previousElementSibling.value

        quizStorage.setItem('nickName', nickName)
        button.innerText = 'Answer!'

        let aBox = document.getElementById('answerBox')
        aBox.remove()

        server()

        button.removeEventListener('click', clickedButton)
      })
    }
    startQuiz()

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

    // Take the answer when button clicked and empty the answer options
    let result = {}

    function recieveAnswer () {
      let button = document.querySelector('#quiz button')

      button.addEventListener('click', function buttonClicked () {
        stopTimer()

        if (theQuestion.hasOwnProperty('alternatives')) {
          let buttons = document.getElementsByName('alter')

          for (let buttonKey in buttons) {
            let alternative = buttons[buttonKey]

            if (alternative.checked) {
              let value = alternative.parentNode.id
              result.answer = value
            }
          }
          let allButtonDivs = Array.from(document.querySelectorAll('.buttonDiv'))

          for (let buttonDiv in allButtonDivs) {
            allButtonDivs[buttonDiv].remove()
          }
        } else {
          let value = button.previousElementSibling.value

          if (value.length === 0) return

          result.answer = value
          let aBox = document.getElementById('answerBox')
          aBox.remove()
        }
        testWhat()

        button.removeEventListener('click', buttonClicked)
      })
    }

    // creating a post xmlrequest and sending answer
    let resultMessage

    async function sendAnswer () {
      let answ = await window.fetch(nextURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(result)
      })
      let resp = answ.JSON()
      return resp
    }

    // let answ = new window.XMLHttpRequest()

    // answ.open('POST', nextURL)
    // answ.setRequestHeader('Content-type', 'application/json')

    // answ.send(JSON.stringify(result))
    async function testWhat () {
      let answ = await sendAnswer()
      resultMessage = answ.responseText
      // answ.addEventListener('load', function () {
      resultMessage = JSON.parse(resultMessage)

      theQuestion.innerText = resultMessage.message
      nextURL = resultMessage.nextURL

      checkResult()
      // })
    }

    function checkResult () {
      thePrompt.innerText = resultMessage.message
      let nextBtn = document.querySelector('#quiz button')
      let gameOverText = document.createElement('h3')
      let quiz = document.querySelector('#quiz')

      if (resultMessage.message === 'Correct answer!') {
        if (resultMessage.hasOwnProperty('nextURL')) {
          nextBtn.innerText = 'Next Question'
          nextURL = resultMessage.nextURL

          nextBtn.addEventListener('click', function buttonClicked () {
            server()
            nextBtn.removeEventListener('click', buttonClicked)
          })
        } else {
          quiz.insertBefore(gameOverText, quiz.childNodes[0])

          gameOverText.innerText = 'Game done!'
          nextBtn.innerText = 'Get results!'

          nextBtn.addEventListener('click', function buttonClicked () {
            printResults()
            nextBtn.removeEventListener('click', buttonClicked)
          })
        }
      } else {
        gameOver()
      }
    }
    // Skriv ut resultat efter färdigt spel
    function printResults () {
      let button = document.querySelector('button')
      button.remove()

      let totalTime = 0

      for (let i = 1; i < quizStorage.length; i++) {
        let timeLeft = parseInt(quizStorage.getItem(quizStorage.key(i)))
        let timeTaken = 20 - timeLeft
        totalTime += timeTaken
      }
      let resultP = document.createElement('p')
      resultP.innerText = nickName + ' won!' + '\nTotal time taken: ' + totalTime + ' seconds'

      document.querySelector('#quiz').appendChild(resultP)

      highScore.setItem(nickName, totalTime)

      let highScoreList = []

      for (let playerName in highScore) {
        highScoreList.push([playerName, highScore[playerName]])
      }

      highScoreList.sort(function (a, b) {
        return a[1] - b[1]
      })
      let topFive = highScoreList.slice(0, 5)

      let printPretty = topFive.map(item => 'Player: ' + item[0] + 'Time: ' + item[1])
      createHighScore(printPretty)

      quizStorage.clear()
    }

    function createRadioBtn (value, key) {
      let radioDiv = document.createElement('div')
      radioDiv.setAttribute('id', key)
      radioDiv.setAttribute('class', 'buttonDiv')

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
    // va
    function createTimer () {
      let timerDiv = document.createElement('div')
      timerDiv.setAttribute('id', 'timerDiv')

      let timer = document.createElement('span')
      timer.setAttribute('id', 'time')

      timerDiv.appendChild(timer)
      let body = document.querySelector('body')
      body.appendChild(timerDiv)
    }

    let theTimer
    let counter = 0
    let seconds

    function startTimer () {
      let display = document.querySelector('#time')
      let timer = 20

      display.textContent = 'You have: 20 seconds'

      theTimer = setInterval(function () {
        seconds = parseInt(timer)

        display.textContent = 'You have: ' + seconds + ' seconds'

        if (--timer < 0) {
          thePrompt.innerText = 'Time up!'
          stopTimer()
        }
      }, 1000)
    }

    function stopTimer () {
      clearInterval(theTimer)
      counter++
      let timer = document.querySelector('#timerDiv')
      timer.remove()

      if (seconds > 0) {
        quizStorage.setItem('time' + counter, seconds)
      } else {
        gameOver()
      }
    }

    function createHighScore (arr) {
      let theList = document.createElement('ol')
      theList.setAttribute('id', 'HSlist')
      let listText = document.createTextNode('High scores')
      theList.appendChild(listText)

      for (let score in arr) {
        let li = document.createElement('li')
        let liNode = document.createTextNode(arr[score])
        li.setAttribute('class', 'list')
        li.appendChild(liNode)
        theList.appendChild(li)
      }

      document.getElementById('quiz').appendChild(theList)
    }

    function gameOver () {
      let questionAlt = document.getElementById('quiz')
      while (questionAlt.firstChild) {
        questionAlt.removeChild(questionAlt.firstChild)
      }

      createButton()
      let nextBtn = document.querySelector('#quiz button')
      let gameOverText = document.createElement('h3')
      let quiz = document.querySelector('#quiz')

      quiz.insertBefore(gameOverText, quiz.childNodes[0])

      gameOverText.innerText = 'Game over!'
      nextBtn.innerText = 'Start again'

      nextBtn.addEventListener('click', function buttonClicked () {
        quizStorage.clear()
        quizStorage.setItem('nickname', nickName)
        counter = 0

        let theText = document.querySelector('#quiz h3')
        theText.remove()
        nextURL = 'http://vhost3.lnu.se:20080/question/1'
        nextBtn.innerText = 'Answer!'

        server()

        nextBtn.removeEventListener('click', buttonClicked)
      })
    }
  }
}

export default {
  Quiz
}
