import React from "react";
import sleepyFace from "../assets/sleepyFace.svg";

export class NoUpcoming extends React.Component {
  render() {
    return (
      <div className="flex flex-col items-center">
        <h1 className="mt-6 text-center font-montserrat text-2xl text-white">
          Nothing Scheduled
        </h1>
        <img
          src={sleepyFace}
          className="mt-6 w-1/4"
          alt="A cartoon sleepy face"
        ></img>
      </div>
    );
  }
}
