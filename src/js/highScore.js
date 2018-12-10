let quizStorage = window.sessionStorage
let highScore = window.localStorage
let nickName

function printResults () {
  //
  // TODO: Vi har tänkt fel om tiden. Total time left är det vi har, inte taken.
  //
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

  console.log('hello there' + highScoreList.slice(0, 5))

  quizStorage.clear()
}
