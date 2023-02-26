import React from "react";

type HeaderProps = {
  channelName: string;
};

export class Header extends React.Component<HeaderProps, {}> {
  componentDidMount() {
    this.setState({ ...this.state, firstMount: false });
  }

  render() {
    return (
      <div className="bg-twitchPurple">
        <h1 className="p-3 text-center uppercase text-white">
          {this.props.channelName}'s Next Stream
        </h1>
      </div>
    );
  }
}
