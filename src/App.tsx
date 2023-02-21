import "./App.css";
import { Countdown } from "./components/Countdown";

function App() {
  return (
    <div className="App">
      <p className="text-white">
        Hello, world! This is a test
        <Countdown />
      </p>
    </div>
  );
}

export default App;
