var isOneInput = false 

var inputSwitchButton = document.getElementById('switch-input-style')
inputSwitchButton.addEventListener('click', function () {
  isOneInput = !isOneInput //true -> false, false -> true
  var inputStyleOne = document.querySelectorAll('.input1')
  for(var ele of inputStyleOne) {
    ele.style.display = isOneInput ? 'none' : 'block'
  }
  var inputStyleTwo = document.querySelectorAll('.input2')
  for(var ele of inputStyleTwo) {
    ele.style.display = isOneInput ? 'block' : 'none'
  }
 
})
var solveButton = document.getElementById("solve24")

var gameStates = [] //store game states so we can go back

var doOperation = function() {
  
  var notifications = document.getElementById('notifications')
  var mathButton = document.getElementById('twoNum')  
  notifications.innerHTML = '' //reset notifications
  
  var f1 = document.querySelector("[name='num1']")
  var f2 = document.querySelector("[name='operator']")
  var f3 = document.querySelector("[name='num2']")
  
  var n1;
  var operator;
  var n2;

  if(isOneInput) {
    var operation = document.getElementById('operation').value
    if(operation.length == 0) return
    document.getElementById('operation').value = '' //reset it
    var input = operation.split('')
    var nums = []
    var curNum = ''
    for(var i = 0; i < input.length; i++) {
      var n = input[i]
      if(n == ' ') continue
      if(n*0 === 0) { //if n*0 == 0 it means that n must be a number
        curNum += n
      } else {
        nums.push(curNum)
        nums.push(n)
        curNum = ''
      }
    }
    nums.push(curNum) //we havent pushed the last number yet\
    try {
      eval(nums.join(''))
    } catch (e) {
      notifications.innerHTML = 'invalid input'
      return 
    }
    n1 = nums[0]
    operator = nums[1]
    n2 = nums[2]

  } else {
    n1 = f1.value
    operator = f2.value
    n2 = f3.value 
  }
  var elem = document.getElementById('game').innerHTML
  
  gameStates.push(elem.slice(14, elem.length).split(","))

  var game = gameStates[gameStates.length-1] //get current game state
 
  //reset values
  f1.value = ""
  f2.value = ""
  f3.value = ""

  var idx1 = game.indexOf(n1)
  var idx2 = -1
  //prevent idx1 == idx2
  
  for(var i = 0; i < game.length; i++) {
    if(idx1 != i && n2 == game[i]) {
      idx2 = i 
      break
    }
  }

  if(idx1 == -1 || idx2 == -1) {
    notifications.innerHTML = 'you are using numbers that do not exist'
    gameStates.pop()
    return
  }
  console.log(game)
  var newGame = []
  for(var i = 0; i < game.length; i++) {
    if(i != idx1 && i != idx2) newGame.push(game[i])
  }
  try {
    var res = eval(n1+operator+n2)
    newGame.push(res)
  } catch (e) {
    notifications.innerHTML = "invalid operator, valid operators are (+, -, /, *)"
    gameStates.pop()
    return 
  }
  
  console.log(newGame)
  if(newGame.length == 1 && newGame[0] == 24) {
    document.getElementById('game').innerHTML = "you win! nice job!"
    return 
  }

  document.getElementById('game').innerHTML = `Current game: ${newGame}`
}

solveButton.addEventListener("click", function() {
  document.getElementById("solution").innerHTML = solveButton.getAttribute('solution')
}) 

document.querySelector("[name='num2']").addEventListener('keyup', function (e) { //at the last input
  if(e.keyCode === 13) {
    doOperation()
  }
})
document.getElementById('operation').addEventListener('keyup', function (e) { //at the last input
  if(e.keyCode === 13) {
    doOperation()
  }
})
var operationButton = document.getElementById('twoNum')
operationButton.addEventListener('click', doOperation)
var undoButton = document.getElementById('undo')

undo.addEventListener('click', function() {
  if(gameStates.length == 0) return
  document.getElementById('game').innerHTML = 'current game: '+ gameStates.pop()
})
