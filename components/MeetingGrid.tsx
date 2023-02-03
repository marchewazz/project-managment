import { useMeeting } from "@videosdk.live/react-sdk";
import { useEffect, useState } from "react";

import ParticipantView from "./ParticipantView";



export default function MeetingGrid(props: any) {

  const [joined, setJoined] = useState(false);
  const [inProgress, setInProgress] = useState(false);

  const { participants, join, leave, toggleMic, toggleWebcam, toggleScreenShare } = useMeeting({ 
    onMeetingJoined() {
      setJoined(true);
      setInProgress(false);
    },
    onMeetingLeft() {
      setJoined(false);
      setInProgress(false)
    },
  });

  function generateParticipants() {
    let elements: any[] = [];  
    participants.forEach((participant: any) => {
      elements.push(<ParticipantView key={participant.id} participantId={participant.id} />)
    })
    return elements;
  }

  function leaveMeeting () {
    setInProgress(true);
    leave()
  }

  const joinMeeting = () => {
    setInProgress(true);
    join()
  }
  
  return (
    <>
      <div>
      {joined ? 
      (
        <div>
          <div className="grid grid-flow-col">
            <button onClick={leaveMeeting}>
              Leave
            </button>
            <button onClick={toggleMic}>
              toggleMic
            </button>
            <button onClick={toggleWebcam}>
              toggleWebcam
            </button>
            <button onClick={toggleScreenShare}>
              toggleScreenShare
            </button> 
          </div>
          <div className="wrapper">
            <div className="flex">
              { generateParticipants() }
            </div>
          </div>
        </div>
      ) 
      : (<button onClick={joinMeeting}
        disabled={inProgress}>
        { inProgress ? (
          <>
            Joining...
          </>
        ) : (
          <>
            Join
          </>
        )}
      </button>)}
      </div>  
    </>
    
  )
}