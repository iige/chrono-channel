import { DateTime } from "luxon";
import React from "react";

export class Offset extends React.Component {
  render() {
    return (
      <>
        <div className="mt-8 text-center font-montserrat text-xs text-white">
          {DateTime.now().offsetNameShort}
        </div>
      </>
    );
  }
}
