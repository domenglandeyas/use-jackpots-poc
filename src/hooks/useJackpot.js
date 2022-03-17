import { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { watchJackpots, unwatchJackpots } from "../store/actions";
import * as selectors from "../store/selectors";

let uniqueId = 0;
const getUniqueId = () => uniqueId++;

function useJackpot({ jackpotId }) {
  const jackpotInformation =
    useSelector((state) => selectors.jackpots(state)[jackpotId]) || null;

  const dispatch = useDispatch();
  const uid = useMemo(getUniqueId, []);

  useEffect(() => {
    /**
     * watch jackpot
     */
    dispatch(watchJackpots(jackpotId, uid));

    return () => {
      /**
       * unwatch jackpot
       */
      dispatch(unwatchJackpots(jackpotId, uid));
    };
  }, [jackpotId]);

  return jackpotInformation;
}

export default useJackpot;
