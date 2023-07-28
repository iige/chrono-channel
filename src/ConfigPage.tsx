import { useEffect, useState } from "react";
import { TwitchApiClient } from "./util/TwitchApiClient";


function ConfigPage() {
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    (window as any).Twitch.ext.onAuthorized(async function (auth: any) {
      const apiClient = new TwitchApiClient(auth);
      apiClient.getUserInfo(auth.channelId).then((userInfo) => {
        if (userInfo?.data[0]) {
          setChannelName(userInfo.data[0].display_name.toLowerCase());
        }
      }
      );
    });
  }, []);



  return (
    <div className="font-montserrat h-[100vh] p-4 bg-black">
      <h1 className="text-white py-2">Configuration</h1>
      <p className="text-white">This extension automatically loads information from your schedule.</p>
      {channelName && <a href={`https://twitch.tv/${channelName}/schedule`} target="_blank" rel="noreferrer"><button className="text-white rounded-md bg-twitchPurple py-2 mt-2 px-4">Edit Schedule</button></a>}
    </div>
  );
}

export default ConfigPage;
