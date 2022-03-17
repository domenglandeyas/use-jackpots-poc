import useJackpot from '../hooks/useJackpot';

function JackpotRow({ jackpotId, onDelete }) {
    const jackpot = useJackpot({ jackpotId });

    return <div className={'jackpot-row'}>
        <p>{`Jackpot: ${jackpotId} : #${jackpot}`}</p>
        <button onClick={onDelete}>{'Delete'}</button>
    </div>
}

export default JackpotRow;
