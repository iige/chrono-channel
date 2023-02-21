import "./App.css";
import { Countdown } from "./components/Countdown";

function App() {
  return (
    <div className="App">
      <p style={{ color: "white" }}>
        Hello, world! This is a test
        <Countdown />
      </p>
    </div>
  );
}

export default App;
