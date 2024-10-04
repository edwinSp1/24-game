var express = require('express');
var router = express.Router();
const game24 = require('../modules/24.js')
const uri = 'mongodb+srv://admin:bedumble3@cluster0.dcug42s.mongodb.net/?retryWrites=true&w=majority'
const {MongoClient} = require('mongodb')

const client = new MongoClient(uri)

async function insertDB (db, coll, doc) {
  await client.connect()
  try {
    coll = client.db(db).collection(coll)
    var prev = await coll.findOne({user: doc.user});
    var res;
    if(!prev) {
      res = await coll.insertOne(doc)
    } else if(prev.score < doc.score) {

      console.log(doc.user, prev.score)
      res = await coll.updateOne({user: doc.user}, {$set: {'score': doc.score}}, {upsert: true})  
    }
    return res
  } catch (e) {
    return 'operation failed:' + e
  } finally {
    await client.close()
  }
}
async function getData (db, coll, query) {
  await client.connect()
  try {
    coll = client.db(db).collection(coll)
    var cursor = await coll.find(query).sort({score:-1}).limit(100)
    var res = []
    for await (const x of cursor) {
      res.push(x)
    }
    return res
  } catch (e) {
    return 'operation failed:' + e
  } finally {
    await client.close()
  }
}
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

router.get("/solutions/:game", function(req, res, next) {
  var game = req.params.game.split(',')
  for(var i in game) {
    game[i] = Number(game[i])
  }
  res.render('allanswers', {
    game: game24.analyzeGame(game)
  })
  
})

router.get('/beattheclock', function(req, res, next) {
  res.render('beatTheClock', {game24: game24})
})

router.get('/beattheclock/leaderboard', function(req, res, next) {
  var leaderboard = getData('24game', 'users', {})
  leaderboard.then((val) => res.render('leaderboard', {leaderboard: val}))
})
router.post('/beattheclock/redirect', function(req, res, next) {
  var form = req.body 
  var score = Number(form.score)
  var user = form.user
  user = user.toUpperCase()
  insertDB('24game', 'users', {user:user, score: score}).then((val) => {
    res.render('redirect')
  })
})
router.get("/difficultyScore", function(req, res, next) {
  res.render('difficultyScore')
}) 

router.get('/solve', function(req, res, next) {
  res.render('solve')
})

router.get('/rules', function(req, res, next) {
  res.render('rules')
})

module.exports = router;