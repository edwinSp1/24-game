

// All possible operations we can perform on two numbers.
function judgePoint24(cards) {
  var seen = [];
  
  let game24 = (list, ops) => {
    if (list.length == 1) {
      // Base Case: We have only one number left, check if it is approximately 24.
      if (Math.abs(list[0] - 24.0) <= 0.1) {
        var operations = [...ops].sort();
        var orig = [...ops]
        if (seen.every(arr => !isSame(operations, arr[1]))) {
          seen.push([orig, operations]) //we have to sort it so we can make sure [1, 2, 3] equals [1, 3, 2]
        }
        return true;
      }
      return false;
    }
    var found = false;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        // Create a new list with the remaining numbers and the new result.
        let newList = [];
        for (let k = 0; k < list.length; k++) {
          if (k != i && k != j) {
            newList.push(list[k]);
          }
        }

        // For any two numbers in our list,
        // we perform every operation one by one.
        let results = generatePossibleResults(list[i], list[j]);
        for(var [num, op] of results) {
          // Push the new result in the list
          newList.push(num);
          ops.push(op)
          // Check if using this new list we can obtain the result 24.
          if (game24(newList, ops)) {
            found = true;
          }
          // Backtrack: remove the result from the list.
          ops.pop()
          newList.pop();
        }
      }
    }
    return found;
  };
  game24(cards, []);
  if (seen.length === 0) {
    return {game:cards}
  }
  var data = {};
  seen = seen.map(arr => arr[0]) //get only the solutions in order
  
  data['solutions'] = {num: seen.length, operations: seen};
  data['game'] = cards
  return data
}

  let generatePossibleResults = (a, b) => {
    var res = [
      [b / a, `${b}/${a}`],
      [a / b, `${a}/${b}`]
    ];     //to make sure a+b == b+a (in terms of operations)
    if(b > a) { 
      res.push([b - a, `${b}-${a}`], [a + b, `${b}+${a}`], [a * b, `${b}*${a}`])
    } else {
      res.push([a - b, `${a}-${b}`],  [a + b, `${a}+${b}`], [a * b, `${a}*${b}`])
    }
    return res
  };
  function isSame(arr1, arr2) {
    return (
      arr1.length == arr2.length &&
      arr1.every(function (element, index) {
        return element === arr2[index];
      })
    );
  }
function rand(max) {
  return Math.floor(Math.random() * max + 1)
}
var randGame = () => [rand(13), rand(13), rand(13), rand(13)]
function generateRandomGame() { 
  var game = randGame()
  while(!judgePoint24(game).solutions) {
    game = randGame()
  }
  return game
}




//game loop

function delay(ms){
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

var paused = false
async function increment () {
  while(true) {
    await delay(1000)
    if(!paused) {
        timer.innerHTML = Number(timer.innerHTML) - 1
        if(timer.innerHTML <= 0) {
          var links = ''
          for(var game of games) {
            links += `<h1><a href='/solutions/${game}' target="_blank" >${game}</a></h1>`
          }
          var score = document.getElementById('count').innerHTML;
          var form = `
          <form action = '/beattheclock/redirect' method = 'POST'>
            <input value = '${score}' name = 'score' style='display:none'>
            Name: <input name = 'user' class = 'dark-input'>
            <input type = 'submit' class = 'dark-input'> 
          </form>
          `
          document.body.innerHTML = `
          <button onclick='window.location = window.location'>New Game</button> 
          <h1>Save your score to the leaderboards</h1>
          ${form}
            <div class ='align-center'>
              <h1>Out of time!</h1>
              <h1>Score: ${score}</h1>
              <h1>games: </h1>
              ${links}
            </div>
          `
        
          return
        }
    }
  }
}
// set operator buttons
const operators = ['+', '-', '*', '/']
var container = document.getElementById('operators')
for(var i = 0; i < operators.length; i++) {
  container.innerHTML += `
    <div class = 'dark-input num-container' onclick = 'document.getElementById("operation").value += "${operators[i]}"'>${operators[i]}</div>
  `
}
//pause functionality
var pauseButton = document.getElementById('pause')
var pausesLeft = 2
pauseButton.addEventListener('click', function () {
  if(pausesLeft == 0) return
  paused = !paused
  if(paused == false) pausesLeft--
  pauseButton.innerHTML = paused ? 'resume' : `pause (${pausesLeft} pause(s) left)`
})
//main

var curGame = document.getElementById('game')
function displayGame(game) {
  curGame.innerHTML = ''

  for(var i = 0; i < game.length; i++) {
    var val = String(game[i])
    if(i == game.length-1) {
      //we have less than 4 numbers
      if(i < 3) curGame.innerHTML += `<div style="color:red" class='dark-input num-container' onclick = 'document.getElementById("operation").value += ${val}'>${val}</div>` 
      else curGame.innerHTML += `<div class='dark-input num-container' onclick = 'document.getElementById("operation").value += ${val}'>${val}</div>`
    }
    else curGame.innerHTML += `<div class='dark-input num-container' onclick = 'document.getElementById("operation").value += ${val}'>${val} </div>`
  }
}
document.getElementById('delete').addEventListener('click', function() {
  var operation = document.getElementById('operation').value
  operation = operation.split('').slice(0, operation.length-1).join('')
  document.getElementById('operation').value = operation
})
var startGame = generateRandomGame()
var games = [startGame]
displayGame(startGame)
var timer = document.getElementById('timer')
var solveButton = document.getElementById("solve24")

var notifications = document.getElementById('notifications')

var gameStates = [] //store game states so we can go back
var timerIncCount = 20


var doOperation = function() {
  if(paused) return
  var operation = document.getElementById('operation').value
  if(operation.length == 0) return
  //get current game from element
  var elem = document.getElementById('game').textContent
  gameStates.push(elem.split(' '))
  console.log(gameStates)

  var mathButton = document.getElementById('twoNum')  
  notifications.innerHTML = '' //reset notifications



  document.getElementById('operation').value = '' //reset it
  var input = operation.trim().split('')
  var nums = []
  var curNum = ''
  
  var neg = 1
  if(input[0] == '-') return
  for(var i = 0; i < input.length; i++) {
    var n = input[i]
    if(n=='n') {
      neg = -1
      continue
    }
    if(n == '' || n == ' ') continue
    if(n*0 === 0 || n == '.') { //if n*0 == 0 it means that n must be a number
      curNum += n
    } else {
      if(curNum.length > 0) nums.push(curNum*neg)
      nums.push(n)
    
      neg = 1
      curNum = ''
    }
  }

  if(curNum.length > 0) nums.push(curNum*neg) //we havent pushed the last number yet
  
  if(nums.length < 2) {
    gameStates.pop()
    return
  }
  console.log(nums)
  try {
      eval(nums.join(''))
  } catch (e) {
      notifications.innerHTML = 'invalid input'
      gameStates.pop()
      return 
  }
  
  var game = [...gameStates[gameStates.length-1]] //get current game state
  for(var num of nums) {
    if(num == '') continue
    var idx = game.indexOf(String(num))
    if(idx == -1) {
      if(num * 0 == 0) { //if it's number
        notifications.innerHTML = 'you are using numbers that do not exist'
        
        gameStates.pop()
        return
      }
    } else {
      game.splice(idx, 1)
    }
  }
  try {
    //evaluate the expression and push to game
    var res = eval(nums.join(''))
    res = Math.trunc(res * 1000) / 1000;
    document.getElementById('operation').value = res < 0 ? 'n' + res*-1 : res
    game.push(String(res))
  } catch (e) {
    notifications.innerHTML = "invalid operator, valid operators are (+, -, /, *)"
    
    gameStates.pop()
    return 
  }

  var counter = document.getElementById('count')
  //win condition
  if(game.length == 1 && Math.abs(24-game[0]) <= 0.1) {
    var game = generateRandomGame()
    displayGame(game)
    games.push(game)
    gameStates = []

    timer.innerHTML = Number(timer.innerHTML) + timerIncCount
    
    if(timerIncCount > 3) timerIncCount--
    document.getElementById('operation').value = ''
    counter.innerHTML++
    return 
  }
  displayGame(game)
  
}

document.getElementById('skip').addEventListener('click', function() {
  timer.innerHTML = timer.innerHTML - 10
  var game = generateRandomGame()
  gameStates = []
  displayGame(game)
  games.push(game)
})

window.addEventListener('keyup', function (e) { //at the last input 
  if(e.keyCode === 13) {
    doOperation()
  }
})

var operationButton = document.getElementById('twoNum')
operationButton.addEventListener('click', doOperation)
var undoButton = document.getElementById('undo')
//undo
undo.addEventListener('click', function() {
  if(gameStates.length == 0) return
  var last = gameStates.pop()
  console.log(gameStates)   
  displayGame(last)
})

increment()