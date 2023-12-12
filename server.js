let multer = require('multer');
const mongoclient = require("mongodb").MongoClient;
const ObjId = require('mongodb').ObjectId;
const url =
  'mongodb+srv://jdo999:jdo3033413!@cluster0.lxvgugl.mongodb.net/?retryWrites=true&w=majority';
let user_id = 'user1';
let friend_id = 'user2';

mongoclient
  .connect(url)
  .then((client) => {

    mydb = client.db('myboard');

    app.listen(8086, function () {
      console.log("포트 8086으로 서버 대기중 ... ");
    });
  })
  .catch((err) => {
    console.log(err);
  });

const express = require("express");
const app = express();

app.use(express.static('public'));
//body-parser 라이브러리 추가
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));

let storage = multer.diskStorage({
  destination : function(req, file, done){
    done(null, './public/image')
  },
  filename : function(req, file, done){
    done(null, file.originalname)
  }
})
let upload = multer({ storage : storage });

app.get("/", function (req, res) {
  res.render('index.ejs');
});

app.get("/fri", function (req, res) {
  res.render('friend.ejs');
});

app.get("/list", function (req, res) {
  mydb.collection(user_id).find().toArray().then(result => {
    console.log(result);
    res.render('list_mongo.ejs', { data: result });
  })
});

app.get("/frlist", function (req, res) {
  mydb.collection(friend_id).find().toArray().then(result => {
    console.log(result);
    res.render('list_fr.ejs', { data: result });
  })
});

//'/enter' 요청에 대한 처리 루틴
app.get('/ente', function (req, res) {
  res.sendFile(__dirname + '/enter.html');
});
app.get('/enter', function (req, res) {
  res.render('enter.ejs');
});

app.get('/input', function (req, res) {
  res.render('input.ejs');
});

app.get("/content/:id", function (req, res) {
  console.log(req.params.id);
  let new_id = new ObjId(req.params.id);

  mydb.collection(user_id).findOne({ _id: new_id })
    .then(result => {
      console.log(result);
      res.render('content.ejs', { data: result });
    }).catch(err => {
      console.log(err);
      res.status(500).send();
    });
});

app.get("/frcontent/:id", function (req, res) {
  console.log(req.params.id);
  let new_id = new ObjId(req.params.id);

  mydb.collection(friend_id).findOne({ _id: new_id })
    .then(result => {
      console.log(result);
      res.render('frcontent.ejs', { data: result });
    }).catch(err => {
      console.log(err);
      res.status(500).send();
    });
});

app.get("/edit/:id", function (req, res) {
  console.log(req.params.id);
  let new_id = new ObjId(req.params.id);

  mydb.collection(user_id).findOne({ _id: new_id })
    .then(result => {
      console.log(result);
      res.render('edit.ejs', { data: result });
    }).catch(err => {
      console.log(err);
      res.status(500).send();
    });
});

//'/save' 요청에 대한 post 방식의 처리 루틴
app.post('/save', function (req, res) {
  console.log(req.body.title);
  console.log(req.body.content);
  console.log(req.body.someDate);

  let sql = "insert into post (title, content, created) values(?, ?, ?)";
  let params = [req.body.title, req.body.content, req.body.someDate];
  conn.query(sql, params, function (err, result) {
    if (err) throw err;
    console.log('데이터 추가 성공');
  });
  res.send('데이터 추가 성공');
});

app.post('/savemongo', function (req, res) {
  console.log(req.body.title);
  console.log(req.body.content);
  mydb.collection(user_id).insertOne(
    { title: req.body.title, content: req.body.content, date: req.body.someDate })
    .then(result => {
      console.log(result);
      console.log('데이터 추가 성공');
    });
  res.redirect('/list');
});

app.post('/login', function (req, res) {
  user_id = req.body.id;
  if (user_id == 'user1' || user_id == 'user2' || user_id == 'user3') {
    res.redirect('/list');
  }
  else {
    res.redirect('/');
  }
});

app.post('/friend', function (req, res) {
  friend_id = req.body.fid;
  if (friend_id == 'user1' || friend_id == 'user2' || friend_id == 'user3') {
    if (friend_id != user_id){
      res.redirect('/frlist');
    }
    else{
      res.redirect('/list');
    }
  }
  else {
    res.redirect('/list');
  }
});

app.post("/delete", function (req, res) {
  console.log(req.body);
  req.body._id = new ObjId(req.body._id);
  mydb.collection(user_id).deleteOne(req.body)
    .then(result => {
      console.log('삭제완료');
      res.status(200).send();
    })
    .catch(err => {
      console.log(err);
      res.status(500).send();
    });
});

app.post('/edit', function (req, res) {
  console.log(req.body.title);
  console.log(req.body.content);
  let new_id = new ObjId(req.body.id);
  mydb.collection(user_id).updateOne({ _id: new_id },
    { $set: { title: req.body.title, content: req.body.content, date: req.body.someDate } })
    .then(result => {
      console.log('데이터 수정 성공');
      res.redirect('/list');
    });
});


