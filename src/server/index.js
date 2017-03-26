
import express from 'express';
import compression from 'compression';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import RouterContext from 'react-router/lib/RouterContext';
import createMemoryHistory from 'react-router/lib/createMemoryHistory';
import match from 'react-router/lib/match';
import template from './template';
import routes from '../routes';
import api from './api';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import { strategy } from './ExactOnline';

const clientAssets = require(KYT.ASSETS_MANIFEST); // eslint-disable-line import/no-dynamic-require
const port = parseInt(KYT.SERVER_PORT, 10);
const app = express();

// Compress (gzip) assets in production.
app.use(compression());

// Setup the public directory so that we can server static assets.
app.use(express.static(path.join(process.cwd(), KYT.PUBLIC_DIR)));

app.use(bodyParser.json());

app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(strategy);

passport.serializeUser(function(user, done) {
  done(null, JSON.stringify(user));
});

passport.deserializeUser(function(user, done) {
  done(null, JSON.parse(user));
});

app.get('/login', passport.authenticate('exact'));
app.get(
  '/login/callback',
  passport.authenticate('exact', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

app.use((req, res, next) => {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
});

app.get('/user', (req, res) => {
  res.json(req.user);
})

app.use('/api', api);

// Setup server side routing.
app.get('*', (request, response) => {
  const history = createMemoryHistory(request.originalUrl);

  match({ routes, history }, (error, redirectLocation, renderProps) => {
    if (error) {
      response.status(500).send(error.message);
    } else if (redirectLocation) {
      response.redirect(302, `${redirectLocation.pathname}${redirectLocation.search}`);
    } else if (renderProps) {
      let string;
      try {
        string = renderToString(<RouterContext {...renderProps} />)
      }
      catch(error) {
        console.error(error);
        string = '';
      }
      // When a React Router route is matched then we render
      // the components and assets into the template.
      response.status(200).send(template({
        root: string,
        jsBundle: clientAssets.main.js,
        cssBundle: clientAssets.main.css,
      }));
    } else {
      response.status(404).send('Not found');
    }
  });
});

app.listen(port, () => {
  console.log(`✅  server started on port: ${port}`);
});
