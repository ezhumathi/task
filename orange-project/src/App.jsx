import React from "react";
import Greeting from "./Greeting";

function App() {
  return (
    <div>
      <h1>Props Example</h1>
      {/* Passing props to the Greeting component */}
      <Greeting name="Alice" age={25} />
      <Greeting name="Bob" age={30} />
      <Greeting name="Charlie" age={35} />
    </div>
  );
}

export default App;
