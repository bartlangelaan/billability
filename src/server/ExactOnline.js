
import passportExact from 'passport-exact';
import dotenv from 'dotenv';

dotenv.config();

const strategy = new passportExact.Strategy({
  clientID: process.env.EXACT_ONLINE_CLIENT_ID,
  clientSecret: process.env.EXACT_ONLINE_CLIENT_SECRET,
  callbackURL: "/login/callback"
}, function(accessToken, refreshToken, profile, cb) {
  cb(null, {accessToken, refreshToken, profile});
});

// strategy._oauth2.useAuthorizationHeaderforGET(true);
// strategy._oauth2._customHeaders = {};

export { strategy };
// function(url, access_token, callback) {
export const get = (url, access_token) => {
  return new Promise((resolve, reject) =>
    strategy._oauth2._request('GET', url, {Authorization: 'Bearer '+access_token, Accept: 'application/json'}, "", null, (err, res) => {
      if(err) return reject(err);
      try{
        const json = JSON.parse(res);
        return resolve(json);
      }
      catch(error) {
        return reject(error);
      }
    })
  );
}

