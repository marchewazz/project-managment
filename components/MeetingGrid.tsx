import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import { useEffect, useState } from "react";
import MeetingMediaButton from "./MeetingMediaButtons";

import ParticipantView from "./ParticipantView";

export default function MeetingGrid(props: any) {

  const [joined, setJoined] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [highlightedUser, setHighlightedUser]: any = useState();

  const { participants, join, leave, activeSpeakerId, presenterId, localParticipant } = useMeeting({ 
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
      if (participant.id != highlightedUser) elements.push(<ParticipantView key={participant.id} participantId={participant.id} />)
    })
    return elements;
  }

  useEffect(() => {
    if (participants.size > 0) {
      if (!highlightedUser) setHighlightedUser(participants.entries().next().value[1].id)
      if (!participants.has(highlightedUser)) setHighlightedUser(participants.entries().next().value[1].id)
    }
  }, [participants])

  useEffect(() => {
    if (activeSpeakerId && !presenterId) setHighlightedUser(activeSpeakerId)
  }, [activeSpeakerId])

  useEffect(() => {
    if (presenterId) setHighlightedUser(presenterId)
  }, [presenterId])

  function leaveMeeting () {
    setInProgress(true);
    leave()
  }

  const joinMeeting = () => {
    setInProgress(true);
    join()
  }
  
  return (
    <div>
      {joined ? 
      (
        <div>
          <div className="grid grid-flow-row">
            <div>
              <ParticipantView key={highlightedUser} participantId={highlightedUser} />
            </div>
            <div className="grid grid-flow-col">
              { generateParticipants() }
            </div>
          </div>
          <MeetingMediaButton participantId={localParticipant.id} leaveMeeting={leaveMeeting} />
        </div>
      ) 
      : 
      (
        <div className="grid place-items-center grid-flow-col">
          <button onClick={joinMeeting}
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
          </button>
          <button onClick={props.switchMic}>
            <svg xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill={props.micOn ? "#00FF00": "#FF0000"} 
            class="w-6 h-6">
              <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
              <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
            </svg>
          </button>
          <button onClick={props.switchWebcam}>
              <svg xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill={props.webcamOn ? "#00FF00": "#FF0000"}
                class="w-6 h-6">
                  <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
              </svg>
          </button>
        </div> 
      )}
    </div>
  )
}