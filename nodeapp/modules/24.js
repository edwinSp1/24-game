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
  data['sampleSolution'] = seen[0].join(", ")
  data['game'] = cards
  data['difficultyScore'] = calcDifficultyScore(data)
  return data
}
function calcDifficultyScore (game) {
  if(!game.solutions) return "Impossible"
  var ops = [0, 0, 0, 0] //add, sub, mult, div
  for(var op of game.sampleSolution) {
    switch(op) {
      case '/':
        ops[3]++
        break
      case '*':
        ops[2]++
        break
      case '-':
        ops[1]++
        break
      case '+':
        ops[0]++
        break
    }
  }
  var score = 0
  var uniqueOps = 0
  for(var i = 0; i < ops.length; i++) {
    if(ops[i] == 0) continue
    score += ops[i] * i //division is harder to understand than addition
    uniqueOps++
  }
  return 10 - game.solutions.num/10 + uniqueOps + score
}
function generate24Games(limit, numGames) {
  var res = []
  for(var i = 0; i < numGames; i++) {
    var game = []
    for(var j = 0; j < 4; j++) {
      var num = Math.ceil(Math.random() * limit) //because there are two variations: 1-13 and 1-9
      game.push(num)
    }
    res.push(game)
  }
  return res
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
  function calculateAverage(array) {
      var total = 0;
      var count = 0;
  
      array.forEach(function(item, index) {
          total += item;
          count++;
      });
  
      return Math.floor(total / count);
  }
  function isSame(arr1, arr2) {
    return (
      arr1.length == arr2.length &&
      arr1.every(function (element, index) {
        return element === arr2[index];
      })
    );
  }
exports.generate24Data = function (numLimit, numGames) {
  
  
  var questionsPossible = []
  var questionsImpossible = []
  for(var game of generate24Games(numLimit, numGames)) {   
    var ans = judgePoint24(game)
    if(ans.solutions) questionsPossible.push(ans)
    else questionsImpossible.push(ans)
  }
  
  function judgeWeights (game1, game2) {
    //we want to judge on 3 factors:
    /*
    1. the number of solutions
    2. the number of unique operations
    3. the number of odd numbers(24 is even so odd numbers make it difficult)
    */
    return game1.difficultyScore - game2.difficultyScore    
  }
  questionsPossible.sort(judgeWeights)
  return [questionsPossible, questionsImpossible]
}

exports.solve = function(game) {
  return judgePoint24(game).sampleSolution
}
exports.analyzeGame = function (game) {
  return judgePoint24(game)
}
exports.generateRandomGame = function(mustBePossible) {
  function generate(mustBePossible) { 
    var game = generate24Games(13, 1)[0]
    if(mustBePossible) {
      while(!judgePoint24(game).solutions) {
        game = generate24Games(13, 1)[0]
      }
    }
    return game
  }
  return generate(true)
}
