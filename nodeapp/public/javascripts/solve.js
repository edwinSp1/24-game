
document.getElementById('solve').addEventListener('click', function () {
  var nums = document.querySelectorAll('.num')
  var game = []
  for(var x of nums) game.push(Number(x.value))
  
  window.location.assign('/solutions/' + game.join(','))
})