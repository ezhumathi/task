import React, { useState } from "react";

function App() {
  
  const [value, setValue] = useState(0);

  
  const incrementValue = () => {
    setValue(value + 1); 
  };

  return (
    <div>
      <h1>Value: {value}</h1>
      <button onClick={incrementValue}>Increment</button>
    </div>
  );
}

export default App;
