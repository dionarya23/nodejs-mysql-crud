const express      = require('express');
const bodyParser   = require('body-parser');
const CookieParser = require('cookie-parser');
const app          = express();
const port         = 9000;
const path         = require('path');
const mysql        = require('mysql');


const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : null,
  database : 'cl_mahasiswa'
});

connection.connect();


//SetUp My NodeJs App
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
//End ->----

app.get('/', (req, res) => {
  let  sql = "SELECT * FROM mahasiswa";
  connection.query(sql, (err, result, fields) => {
    res.render('index', {data : result, title: "Home", title2: "Testing Mysql in NodeJs"});
  });
});

app.get('/tambah', (req, res) => {
  res.render('add', {title:"Tambah Data", title2:"Tambah Data"});
});

app.post('/tambah', (req, res) => {
    let nim = req.body.nim,
        nama = req.body.nama,
        sql = `INSERT INTO mahasiswa(NIM, Nama) VALUES("${nim}", "${nama}")`;
        connection.query(sql,  (err, result, fields) => {
          if(err) res.send(err);
          res.redirect('/');
        });
});

app.get('/hapus/:nim', (req, res) => {
  let nim = req.params.nim,
      sql = `DELETE FROM mahasiswa WHERE NIM="${nim}"`;
      connection.query(sql, (err, result, fields) =>{
        if(err) res.send(err);
        res.redirect('/');
      });
});

app.post('/edit', (req, res) => {

    let nim = req.body.nim,
        nimBefore = req.body.nimBefore;
        nama = req.body.nama,
        sql = `UPDATE mahasiswa SET Nama="${nama}" WHERE NIM="${nimBefore}"`;

        connection.query(sql, (err, result, fields) => {
          if (err) res.send(err);
          res.redirect('/');
        });
});

app.get('/edit/:nim', (req, res) =>{
  let nim = req.params.nim,
      // sql = "SELECT * FROM mahasiswa WHERE Nim"+nim;
      sql = `SELECT * FROM mahasiswa WHERE NIM=${nim}`;
  connection.query(sql, (err, result, fields) => {
    let nama = result[0].Nama;
    res.render('edit', {
                        data  :   result,
                        title : `Edit ${nama}`,
                        title2:`Edit Si ${nama}`
          });
  });

});



app.listen(port, ()=>{
  console.log("Runing On Port "+ port);
});
