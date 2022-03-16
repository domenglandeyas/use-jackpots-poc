import { put, call, delay, takeEvery, all, take, race, select } from 'redux-saga/effects';
import {
    JACKPOTS_START_WATCHING,
    JACKPOTS_STOP_WATCHING,
    JACKPOTS_START,
    JACKPOTS_CANCEL
} from './types';
import {
    setJackpots,
    startJackpotTask,
    cancelJackpotTask
} from './actions';
import * as selectors from './selectors';

const JACKPOTS_LOOP_DELAY = 5000;

/**
 * There's probably a better way to keep references to what components are watching...
 */
let componentSubscriptions = [];

/**
 * Watches for when useJackpots hook is used and destroyed. Starts and stops background task as necessary
 */
function *watchComponentSubscriptions(action) {
    console.log('watchComponentSubscriptions:', action);
    const { type, jackpotId, componentId } = action;

    switch (type) {
        case JACKPOTS_START_WATCHING:
            const jackpots = yield select(selectors.jackpots);
            const newJackpotWillBeAdded = !jackpots.find(entry => entry.jackpotId === jackpotId);

            componentSubscriptions.push({ jackpotId, componentId });

            if (newJackpotWillBeAdded) {
                // Restart process to include new jackpot
                yield put(cancelJackpotTask());
                yield put(startJackpotTask());
            }
            break;

        case JACKPOTS_STOP_WATCHING:
            componentSubscriptions = componentSubscriptions.filter(
                record => record.componentId !== componentId
            );

            if (componentSubscriptions.length === 0) {
                // Cancel
                yield put(cancelJackpotTask());
            }
            break;
    }
}

/**
 * Task to fetch updated jackpots then wait till it should next update
 */
function *jackpotsTask() {
    while (true) {
        const jackpotIds = componentSubscriptions
            .map(({ jackpotId }) => jackpotId)
            .reduce((uniqueIds, jackpotId) => {
                if (!uniqueIds.includes(jackpotId)) {
                    uniqueIds.push(jackpotId);
                }

                return uniqueIds;
            }, []);

        /**
         * Run your api calls to fetch the refreshed data
         */
        console.log('jackpotsTask: running for jackpot ids', jackpotIds);

        /**
         * Fake some values or testing purposes
         */
        const jackpots = jackpotIds.map(jackpotId => ({
            jackpotId,
            currentValue: Math.floor(Math.random() * 100)
        }));

        /**
         * Update new values to the store
         */
        yield put(setJackpots(jackpots));

        yield delay(JACKPOTS_LOOP_DELAY);
    }
}

/**
 * Watches for when the background task should start and stop.
 */
function *watchForBackgroundTask() {
    while (true) {
        yield take(JACKPOTS_START);
        yield race({
            task: call(jackpotsTask),
            cancel: take(JACKPOTS_CANCEL)
        });
    }
}

export default function *jackpotsSaga() {
    yield all([
        takeEvery([ JACKPOTS_START_WATCHING, JACKPOTS_STOP_WATCHING ], watchComponentSubscriptions),
        watchForBackgroundTask()
    ]);
}
