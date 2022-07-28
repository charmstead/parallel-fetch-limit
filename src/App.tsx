import React, { useEffect, useState } from 'react';
import { runInParallel } from './Service/FetchParallel';


const urls = new Array(50).fill(1).map((v,i)=>`https://jsonplaceholder.typicode.com/todos/${i+1}`)


const App:React.FunctionComponent=():JSX.Element =>{

  const [state, setstate] = useState<string[]>([])

  useEffect(() => {
   runInParallel(urls,20).then(setstate)
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Nethermind Assignment
        </p>
      </header>
      <section>
       {state.map((val,i)=><div key={i}>
              {val}
        </div>)}
      </section>
    </div>
  );
}

export default App;
