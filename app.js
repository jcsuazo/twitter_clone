import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import colors from 'colors';
import connectDB from './config/db.js';
import { requireLogin } from './middleware.js';
import loginRoute from './routes/loginRoutes.js';
import logout from './routes/logoutRoutes.js';
import registerRoutes from './routes/registerRoutes.js';
import postRoutes from './routes/api/postRoutes.js';
import session from 'express-session';

dotenv.config();

connectDB();

const app = express();
const port = 3003;
const server = app.listen(port, () =>
  console.log('Server listening on por ' + port),
);

app.set('view engine', 'pug');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: 'suazo key',
    resave: true,
    saveUninitialized: false,
  }),
);

//Statics Folders
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

// Routes
app.use('/login', loginRoute);
app.use('/logout', logout);
app.use('/register', registerRoutes);

//API ROUTES
app.use('/api/posts', postRoutes);

app.get('/', requireLogin, (req, res, next) => {
  let payload = {
    pageTitle: 'Home',
    userLoggedIn: req.session.user,
  };
  res.status(200).render('home', payload);
});
