
import passportExact from 'passport-exact';
import dotenv from 'dotenv';

dotenv.config();

const strategy = new passportExact.Strategy({
  clientID: process.env.EXACT_ONLINE_CLIENT_ID,
  clientSecret: process.env.EXACT_ONLINE_CLIENT_SECRET,
  callbackURL: '/login/callback',
}, (accessToken, refreshToken, profile, cb) => {
  cb(null, { accessToken, refreshToken, profile });
});

export { strategy };
export const get = (url, accessToken) => new Promise((resolve, reject) =>
  strategy._oauth2._request( // eslint-disable-line no-underscore-dangle
    'GET',
    url,
    {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
    '',
    null,
    (err, res) => {
      if (err) return reject(err);
      try {
        const json = JSON.parse(res);
        return resolve(json);
      } catch (error) {
        return reject(error);
      }
    }
  )
);

