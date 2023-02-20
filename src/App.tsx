import "./App.css";
import React, { useEffect } from "react";
function App() {
  const [apiResponseData, setData] = React.useState<any>(null);
  const [upcomingDate, setUpcomingDate] = React.useState<Date | null>(null);

  useEffect(() => {
    (window as any).Twitch.ext.onAuthorized(function (auth: any) {
      console.log("The Helix JWT is ", auth.helixToken);
      console.log(auth);

      const dataFetch = async () => {
        const response = await fetch(
          `https://api.twitch.tv/helix/schedule?broadcaster_id=${auth.channelId}`,
          {
            headers: {
              "Client-Id": `${auth.clientId}`,
              Authorization: `Extension ${auth.helixToken}`,
            },
          }
        );
        console.log(response);
        const jsonData = await response.json();
        setData(jsonData);
        setUpcomingDate(new Date(jsonData?.data.segments[0].start_time));
        console.log(jsonData);
        return jsonData;
      };

      dataFetch().catch((err) => {
        console.log(err);
      });
    });
  }, []);

  return (
    <div className="App">
      <p style={{ color: "white" }}>
        Hello, world! I am starting to understand
      </p>
      <p style={{ color: "white" }}>
        {upcomingDate
          ? `Loaded: Next Stream Will Start at ${upcomingDate}`
          : "Loading"}
      </p>
    </div>
  );
}

export default App;
