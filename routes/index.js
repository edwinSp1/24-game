var express = require('express');
var router = express.Router();
const game24 = require('../modules/24.js')
/* GET home page. */
var curData = null
router.get('/', function(req, res, next) {
  var [possible, impossible] =  game24.generate24Data(13, 100, true)
  curData = possible
  res.render('index', 
  { 
    title: '24 games', 
    possible24: possible,
    impossible24: impossible
  });
});
router.get('/answers/:id', function(req, res, next) {
  try {
    var params = req.params
    var data = curData[req.params.id]
  } catch (e){
    res.send("go to the main site first to generate some data!")
  }
  res.render("allanswers", 
  {
    game:data
  })
}) 
router.get("/challenge", function(req, res, next) {
  var game = game24.generateRandomGame(true)
  challenge = game
  res.render('challenge', {
    challenge: game,
    game24: game24
  })
})

router.post("/game/solutions", function(req, res, next) {
  try {
    var data = JSON.parse(req.body.solutions)
    res.render('allanswers', {
      game: data
    })
  } catch(e) {
    res.send(req.body)
  }
  
})

router.get("/difficultyScore", function(req, res, next) {
  res.render('difficultyScore')
}) 

router.get('/solve', function(req, res, next) {
  res.render('solve')
})


module.exports = router;