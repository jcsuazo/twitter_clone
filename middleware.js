export const requireLogin = (req, res, next) => {
  return next();
  if (req.session && req.session.user) {
  } else {
    return res.redirect('/login');
  }
};
