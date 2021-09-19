require('dotenv').config(); // we just need to require it and config it
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
// const encrypt = require('mongoose-encryption');
// const md5 = require('md5');
const app = express();
const bcrypt = require('bcrypt');
const saltRounds = 10;

mongoose.connect('mongodb+srv://admin-saksham:' + process.env.DBPASSWORD + '@cluster0.dswqk.mongodb.net/userDB');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
   extended: true
}));

//schema
const userSchema = new mongoose.Schema({
   email: {
      type: String,
   },
   password: {
      type: String
   }
});

//adding encrypt plugin to userSchema
// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

//model
const User = mongoose.model('User', userSchema);

app.get('/', function(req, res) {
   res.render('home');
});

app.get('/register', function(req, res) {
   res.render('register');
});

app.get('/login', function(req, res) {
   res.render('login');
});

app.post('/register', function(req, res) {
   bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
      const newUser = new User({
         email: req.body.username,
         password: hash
      });

      newUser.save(function(err) {
         if (err) {
            console.log(err);
         } else {
            res.render('secrets');
         }
      });
   });
});

app.post('/login', function(req, res) {
   User.findOne({
      email: req.body.username
   }, function(err, foundUser) {
      if (err) {
         console.log(err);
      } else {
         if (foundUser) {
            bcrypt.compare(req.body.password, foundUser.password, function(err, result) {
               if (result === true) {
                  res.render('secrets');
               } else {
                  res.send('Password entered is wrong!');
               }
            });
         } else {
            res.send('User not found!');
         }
      }
   });
});


app.listen(3000, function() {
   console.log('server started successfully on port 3000');
});
