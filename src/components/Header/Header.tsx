import React from "react";
import ReactGA from "react-ga4";

type HeaderProps = {
  channelName: string;
};

export class Header extends React.Component<HeaderProps, {}> {

  render() {
    let headerText = "Next Stream";
    if (this.props.channelName) {
      headerText = `${this.props.channelName}'s Next Stream`;
    }
    return (
      <div className="bg-twitchPurple">
        <h1 className="p-3 text-center uppercase text-white">{headerText}</h1>
      </div>
    );
  }
}
