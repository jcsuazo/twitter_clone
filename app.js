import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';

import { requireLogin } from './middleware.js';
import loginRoute from './routes/loginRoutes.js';
import registerRoutes from './routes/registerRoutes.js';

const app = express();
const port = 3003;
const server = app.listen(port, () =>
  console.log('Server listening on por ' + port),
);

app.set('view engine', 'pug');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));

//Statics Folders
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/login', loginRoute);
app.use('/register', registerRoutes);

app.get('/', requireLogin, (req, res, next) => {
  let payload = {
    pageTitle: 'Home',
  };
  res.status(200).render('home', payload);
});
