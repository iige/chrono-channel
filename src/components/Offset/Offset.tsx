import { DateTime } from "luxon";
import React from "react";

/* 
  This component displays the current timezone offset e.g. "PDT" so the user is more clear about when a stream should start
*/
export class Offset extends React.Component {
  render() {
    return (
      <>
        <div className="mt-4 text-center font-montserrat text-xs text-white">
          {DateTime.now().offsetNameShort}
        </div>
      </>
    );
  }
}
