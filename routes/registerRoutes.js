import express from 'express';
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
router.post('/', (req, res, next) => {
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
    res.status(200).render('register', payload);
  } else {
    payload.errorMessage = 'Make sure each field has a valid value.';
    res.status(200).render('register', payload);
  }
  console.log(req.body);
});

export default router;
