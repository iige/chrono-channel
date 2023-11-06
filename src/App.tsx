import { ExtensionPanel } from "./components/ExtensionPanel/ExtensionPanel";
import { Settings } from "luxon";
import { useEffect } from "react";
import ReactGA from 'react-ga4';

Settings.throwOnInvalid = true; // Luxon will throw an error if it encounters an invalid date, which is useful for debugging and writing robust code

function App() {
  useEffect(() => {
    ReactGA.initialize("G-XJY9B5B8Q6");
  }, []);

  return (
    <div className="h-[100vh]">
      <ExtensionPanel />
    </div>
  );
}

export default App;
