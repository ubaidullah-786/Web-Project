const express = require('express');
const morgan = require('morgan');
const ejsLayouts = require('express-ejs-layouts');
const session = require('express-session');
const app = express();
const mongoStore = require('connect-mongo');
const flash = require('connect-flash');
const initializeLocals = require('./middlewares/localsInitialization');
const defaultRouter = require('./routes/defaultRoutes');
const cartRouter = require('./routes/cartRoutes');

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('public'));
app.use(ejsLayouts);
app.use(express.urlencoded({ extended: false }));
app.use(flash());

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({
      mongoUrl: process.env.DATABASE_LOCAL,
    }),
  })
);

app.use(initializeLocals.initLocals);
app.use(defaultRouter);
app.use('/cart', cartRouter);

module.exports = app;
