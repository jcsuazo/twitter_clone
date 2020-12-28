import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/UserModel.js';
const app = express();
const router = express.Router();

app.set('view engine', 'pug');
app.set('views', 'views');

router.get('/', (req, res, next) => {
  let payload = {
    pageTitle: 'Login',
    ...req.body,
  };
  res.status(200).render('login', payload);
});

router.post('/', async (req, res, next) => {
  let payload = {
    pageTitle: 'Login',
  };
  const { logUserName, logPassword } = req.body;
  if (logUserName.trim() && logPassword.trim()) {
    try {
      let user = await User.findOne({
        $or: [{ username: logUserName }, { email: logUserName }],
      });
      if (user) {
        let result = await bcrypt.compare(logPassword, user.password);
        if (result) {
          req.session.user = user;
          return res.redirect('/');
        }
        payload.errorMessage = 'Password incorrect ';
        return res.status(200).render('login', payload);
      } else {
        payload.errorMessage = 'Username or email incorrect ';
        return res.status(200).render('login', payload);
      }
    } catch (error) {
      payload.errorMessage = 'Something went wrong try again later.';
      return res.status(200).render('login', payload);
    }
  }
  payload.errorMessage = 'Make sure each field has a valid value.';
  return res.status(200).render('login', payload);
});

export default router;
