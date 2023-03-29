import { ExtensionPanel } from "./components/ExtensionPanel/ExtensionPanel";
import { Settings } from "luxon";

Settings.throwOnInvalid = true; // Luxon will throw an error if it encounters an invalid date, which is useful for debugging and writing robust code

function App() {
  return (
    <div className="h-[100vh]">
      <ExtensionPanel />
    </div>
  );
}

export default App;
