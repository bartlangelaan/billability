
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
export const get = (url, accessToken) => new Promise((resolve, reject) => {
  let numTry = 0;

  const tryIt = () => strategy._oauth2._request( // eslint-disable-line no-underscore-dangle
    'GET',
    url,
    {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
    '',
    null,
    (err, res) => {
      try {
        if (err) throw new Error(err);
        const json = JSON.parse(res);
        resolve(json);
      } catch (error) {
        console.log('Failed getting data from ', url, 'in try', numTry);
        console.log(error);

        // If we already tried 5 times, just reject. We failed.
        if (numTry >= 5) {
          reject(error);
        } else {
          // If we didn't try enough times yet, we should retry in 1, 8, 27 or 64 seconds.
          numTry += 1;
          setTimeout(tryIt, (numTry ** 3) * 1000);
        }
      }
    }
  );

  tryIt();
});

