import { put, call, takeEvery, all, take } from "redux-saga/effects";
import { JACKPOTS_START_WATCHING, JACKPOTS_STOP_WATCHING } from "./types";
import { setJackpots } from "./actions";
import { eventChannel, END } from "redux-saga";

export default function* jackpotsSaga() {
  yield all([
    takeEvery([JACKPOTS_START_WATCHING, JACKPOTS_STOP_WATCHING], jobWatcher),
  ]);
}

const jackpotIdJobsMap = {};
const SECS = 5000;

const getJackpotData = (jackpotId) => {
  if (!jackpotIdJobsMap[jackpotId])
    jackpotIdJobsMap[jackpotId] = {
      componentsSubscription: {},
      job: null,
    };
  return jackpotIdJobsMap[jackpotId];
};
function jackPotJobs({ jackpotId }) {
  const activeJackpotData = jackpotIdJobsMap[jackpotId];
  console.log(jackpotIdJobsMap);
  if (!activeJackpotData.job)
    activeJackpotData.job = createJackpotUpdaterChanel(activeJackpotData, jackpotId);

  return activeJackpotData.job;
}

const createJackpotUpdaterChanel = (activeJackpotData, jackpotId) =>
  eventChannel((emitter) => {
    const intervalId = setInterval(() => {
      const subscriptions = Object.keys(
        activeJackpotData.componentsSubscription
      );
      if (!subscriptions.length) {
        emitter(END);
      } else {
        emitter({
          jackpotId,
          jackpots: Math.floor(Math.random() * 1000),
        });
      }
    }, SECS);
    return () => clearInterval(intervalId);
  });

export function* jobWatcher(action) {
  const { type, jackpotId, componentId } = action;
  const jackpotIdItems = getJackpotData(jackpotId);
  switch (type) {
    case JACKPOTS_START_WATCHING:
      jackpotIdItems.componentsSubscription[componentId] = true;
      const chan = yield call(jackPotJobs, {
        jackpotId,
        type,
        componentId,
      });
      try {
        while (true) {
          const { jackpots, jackpotId } = yield take(chan);
          console.log(jackpots, jackpotId);
          yield put(setJackpots({ jackpotId, jackpots }));
        }
      } finally {
        console.log("chanel terminated");
        break;
      }

    case JACKPOTS_STOP_WATCHING:
      delete jackpotIdItems.componentsSubscription[componentId];
      break;
    default:
      return;
  }
}
