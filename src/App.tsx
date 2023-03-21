import { ExtensionPanel } from "./components/ExtensionPanel/ExtensionPanel";
import { Settings } from "luxon";

Settings.throwOnInvalid = true;

function App() {
  return (
    <div className="h-[100vh]">
      <ExtensionPanel />
    </div>
  );
}

export default App;
