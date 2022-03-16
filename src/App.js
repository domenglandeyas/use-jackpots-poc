import './App.css';
import { useState, useRef } from 'react';
import { Provider } from 'react-redux';

import store from './store';
import JackpotRow from './components/JackpotRow';

function App() {
  const [ jackpotComponents, setJackpotComponents ] = useState([]);
  const formRef = useRef();
  const onDelete = itemToRemove => e => {
      e.preventDefault();
      setJackpotComponents(jackpotComponents.filter(entry => entry !== itemToRemove))
  };
  const fakeKey = item => {
      const similarItems = jackpotComponents.filter(({ jackpotId }) => jackpotId === item.jackpotId);
      return `${item.jackpotId}-${similarItems.indexOf(item)}`
  };

  return (
      <Provider store={store}>
        <div className="App">
          <div className={'jackpots'}>
              {jackpotComponents.map(props => <JackpotRow {...props} onDelete={onDelete(props)} key={fakeKey(props)} />)}
              <div className={'jackpot-row'}>
                  <form onSubmit={e => {
                      e.preventDefault();
                      const val = formRef.current?.value;
                      if (val) {
                          setJackpotComponents([...jackpotComponents, {
                              jackpotId: val
                          }]);

                          formRef.current.value = '';
                      }
                  }}>
                      <input ref={formRef} />
                      <button type={"submit"}>Add Jackpot</button>
                  </form>
              </div>
          </div>
        </div>
      </Provider>
  );
}

export default App;
