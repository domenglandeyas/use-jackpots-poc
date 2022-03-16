import { JACKPOTS_UPDATE } from './types';
import * as selectors from './selectors';

const DEFAULT_STATE = {
    [selectors.JACKPOTS]: []
};

function jackpotsReducer(state = DEFAULT_STATE, action) {
    switch (action.type) {
        case JACKPOTS_UPDATE:
            return {
                ...state,
                [selectors.JACKPOTS]: action.jackpots
            };

        default:
            return state;
    }
}

export default jackpotsReducer;