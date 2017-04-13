/* eslint-disable no-console */
import express from 'express';
import mongoose from 'mongoose';
import calculate from './calculate';
import Data from './models/Data';
import TimeException from './models/TimeException';
import { REFRESH_STEPS } from '../../components/const';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/billability');
mongoose.Promise = Promise;

const router = express.Router(); // eslint-disable-line new-cap

function protect(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  return res.redirect('/login');
}

router.get('/refresh', protect, calculate);

router.get('/data', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.json({
      state: REFRESH_STEPS.NOT_AUTHENTICATED,
    });
  }
  const profileId = req.user.profile.id;
  const data = await Data.findOne({ profileId }).exec();
  const timeExceptions = await TimeException.find().exec();

  if (!data) {
    // Need to create data
    return res.redirect('/refresh');
  }

  return res.json({
    timeExceptions: timeExceptions.map(e => e.toObject()),
    ...data.toObject(),
  });
});

router.post('/data/timeExceptions', protect, async (req, res) => {
  const profileId = req.user.profile.id;
  const employee = req.body.employee;
  await TimeException.remove({ profileId, employee }).exec();
  await Promise.all(req.body.exceptions.map((timeException) => {
    if (!timeException.from && !timeException.to) return Promise.resolve();
    const te = new TimeException({ profileId, employee, ...timeException });
    return te.save().catch(console.error);
  }));
  res.sendStatus(200);
});

export default router;
