function isLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    // User is logged in, redirect to the dashboard or any other authorized page
    return res.redirect("/dashboard");
  }
  // User is not logged in, continue to the next middleware or route
  next();
}
module.exports = isLoggedIn;
