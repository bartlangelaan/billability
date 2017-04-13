/* eslint-disable no-console */
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import express from 'express';
import compression from 'compression';
import path from 'path';
import api from './api';
import { strategy } from './ExactOnline';

const port = parseInt(process.env.PORT || KYT.SERVER_PORT, 10);
const app = express();

app.enable('trust proxy');

// Compress (gzip) assets in production.
app.use(compression());

// Setup the public directory so that we can server static assets.
app.use(express.static(path.join(process.cwd(), KYT.PUBLIC_DIR)));

app.use(bodyParser.json());

app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(strategy);

passport.serializeUser((user, done) => {
  done(null, JSON.stringify(user));
});

passport.deserializeUser((user, done) => {
  done(null, JSON.parse(user));
});

app.get('/login', passport.authenticate('exact'));
app.get(
  '/login/callback',
  passport.authenticate('exact', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.use('/api', api);

// On development, proxy the client-only code.
if (KYT.PUBLIC_PATH !== '/') {
  const proxy = require('http-proxy-middleware'); // eslint-disable-line global-require

  app.use('*', proxy(KYT.PUBLIC_PATH));
}

app.listen(port, () => {
  console.log(`✅  server started on port: ${port}`);
});
