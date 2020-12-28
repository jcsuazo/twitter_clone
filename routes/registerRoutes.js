import express from 'express';
import User from '../models/UserModel.js';
const app = express();
const router = express.Router();

app.set('view engine', 'pug');
app.set('views', 'views');

router.get('/', (req, res, next) => {
  let payload = {
    pageTitle: 'Register',
  };
  res.status(200).render('register', payload);
});
router.post('/', async (req, res, next) => {
  let payload = {
    ...req.body,
    pageTitle: 'Register',
  };
  const {
    firstName,
    lastName,
    username,
    email,
    password,
    passwordConf,
  } = req.body;

  if (
    firstName.trim() &&
    lastName.trim() &&
    username.trim() &&
    email.trim() &&
    password.trim() &&
    passwordConf.trim()
  ) {
    try {
      let user = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (user === null) {
        const newUser = await User.create({
          firstName,
          lastName,
          username,
          email,
          password,
        });
        req.session.user = newUser;
        return res.redirect('/');
      } else {
        if (email === user.email) {
          payload.errorMessage = 'Email already in use';
        } else {
          payload.errorMessage = 'Username already in use';
        }
        res.status(200).render('register', payload);
      }
    } catch (error) {
      payload.errorMessage = 'Something went wrong try again later.';
      res.status(200).render('register', payload);
    }
    res.status(200).render('register', payload);
  } else {
    payload.errorMessage = 'Make sure each field has a valid value.';
    res.status(200).render('register', payload);
  }
});

export default router;
