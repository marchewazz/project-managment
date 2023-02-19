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
    <>
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