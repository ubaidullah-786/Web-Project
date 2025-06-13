const express = require('express');
const morgan = require('morgan');
const ejsLayouts = require('express-ejs-layouts');
const app = express();

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));
app.use(ejsLayouts);

module.exports = app;

app.get('/', (req, res) => {
  res.render('homePage');
});

app.get('/contact-us', (req, res) => {
  res.render('contactUs');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/forgot-password', (req, res) => {
  res.render('forgotPassword');
});
