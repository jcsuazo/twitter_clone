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
    pageTitle: 'Register',
  };
  res.status(200).render('register', payload);
});

export default router;
