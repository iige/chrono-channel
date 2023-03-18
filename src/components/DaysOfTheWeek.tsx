import React from "react";

export class DaysOfTheWeek extends React.Component {
  render() {
    return (
      <>
        <div className="col-auto mt-9 grid grid-cols-7 grid-rows-1 px-2 text-center font-montserrat text-xs text-white">
          <span>SUN</span>
          <span className="glow">
            MON <br />5 PM
          </span>
          <span>TUE</span>
          <span>WED</span>
          <span className="glow">
            THU <br />8 PM
          </span>
          <span>FRI</span>
          <span>SAT</span>
        </div>
      </>
    );
  }
}
