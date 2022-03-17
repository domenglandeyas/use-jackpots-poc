import {
    JACKPOTS_CANCEL,
    JACKPOTS_START,
    JACKPOTS_START_WATCHING,
    JACKPOTS_STOP_WATCHING,
    JACKPOTS_UPDATE
} from './types';

export const watchJackpots = (jackpotId, componentId) => {
    return {
        type: JACKPOTS_START_WATCHING,
        jackpotId,
        componentId
    }
}

export const unwatchJackpots = (componentId) => {
    return {
        type: JACKPOTS_STOP_WATCHING,
        componentId
    }
}


export const startJackpotTask = () => ({ type: JACKPOTS_START });

export const cancelJackpotTask = () => ({ type: JACKPOTS_CANCEL });

export const setJackpots = ({jackpots, jackpotId}) => {
  return {
    type: JACKPOTS_UPDATE,
    jackpotId,
    jackpots,
  };
};