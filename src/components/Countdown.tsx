import React, { ReactNode } from "react";

export class Countdown extends React.Component<{}, { firstMount: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = { firstMount: true };
  }

  componentDidUpdate(
    prevProps: Readonly<{}>,
    prevState: Readonly<{ firstMount: boolean }>,
    snapshot?: any
  ): void {
    if (this.state.firstMount !== prevState.firstMount) {
      this.fetchData();
    }
  }

  async fetchData(): Promise<void> {
    console.log("fetching data");
    (window as any).Twitch.ext.onAuthorized(async function (auth: any) {
      console.log("The Helix JWT is ", auth.helixToken);
      console.log(auth);

      const response = await fetch(
        `https://api.twitch.tv/helix/schedule?broadcaster_id=${auth.channelId}`,
        {
          headers: {
            "Client-Id": `${auth.clientId}`,
            Authorization: `Extension ${auth.helixToken}`,
          },
        }
      );

      const responseJson = await response.json();
      console.log(responseJson);
    });
  }

  async componentDidMount(): Promise<void> {
    this.setState({ firstMount: false });
  }

  render(): ReactNode {
    return (
      <>
        <p style={{ color: "white" }}>
          This is where the countdown timer will be
        </p>
      </>
    );
  }
}
