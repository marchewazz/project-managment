import { useParticipant } from "@videosdk.live/react-sdk";
import { useEffect, useRef, useState } from "react";

export default function ParticipantView(props: any) {
    const webcamRef: any = useRef(null);
    const micRef: any = useRef(null);
    const screenShareRef: any = useRef(null);

    const [ready, setReady] = useState(false);

    const { displayName, webcamStream, micStream, screenShareStream, webcamOn, micOn, isLocal, screenShareOn, participant } = useParticipant(props.participantId);  

    useEffect(() => {
      if (webcamRef.current) {
        if (webcamOn) {
          
          const mediaStream = new MediaStream();
          if (webcamStream) {
            mediaStream.addTrack(webcamStream.track);
          }
          
          webcamRef.current.srcObject = mediaStream;
          webcamRef.current
            .play()
            .catch((error: any) =>
              console.error("videoElem.current.play() failed", error)
            );
        } else {
          webcamRef.current.srcObject = null;
        }
      }
    }, [webcamStream, webcamOn]);
    
    useEffect(() => {  
      if (participant) setReady(true)
    }, [participant])
    
  
    useEffect(() => {
      console.log(micOn);
      
      if (micRef.current) {
        if (micOn) {
          const mediaStream = new MediaStream();  
          console.log(typeof(micStream), micStream);
          if (micStream) {
            mediaStream.addTrack(micStream.track);
          }
          console.log(mediaStream.getAudioTracks(), "mediaStream");
          
          micRef.current.srcObject = mediaStream;
          console.log(micRef.current.srcObject);
          
          micRef.current
            .play()
            .catch((error: any) =>
              console.error("micElem.current.play() failed", error)
            );
            console.log(micRef);
            
        } else {
          micRef.current.srcObject = null;
        }
      }
    }, [micStream, micOn]);
  
    useEffect(() => {
      if (screenShareRef.current) {
        if (screenShareOn) {
          console.log(screenShareStream);
          
          const mediaStream = new MediaStream();
          if (screenShareStream) {
            mediaStream.addTrack(screenShareStream.track);
          }
        
          screenShareRef.current.srcObject = mediaStream;
          screenShareRef.current
            .play()
            .catch((error: any) =>
              console.error("screenElem.current.play() failed", error)
            );
        } else {
          screenShareRef.current.srcObject = null;
        }
      }
    }, [screenShareStream, screenShareOn]);
  
  
    return (
      <>
      { ready ? (
        <div key={props.participantId} >
          <audio ref={micRef} autoPlay muted={isLocal} />
          <div>
            <h2>{displayName}</h2>
            <video
              height={"100%"}
              width={"100%"}
              ref={webcamRef}
              autoPlay
            />
          </div>
          {screenShareOn ? (
            <div>
              <h2>Screen Shared</h2>
              <video
                height={"100%"}
                width={"100%"}
                ref={screenShareRef}
                autoPlay
              />
            </div>
          ) : (null)}
          <span>Mic: {micOn ? "Yes": "No"}, Camera: {webcamOn ? "Yes" : "No"}, Screen Share: {screenShareOn ? "Yes" : "No"}</span>
        </div>
      ) : (
        <p>
          Loading...
        </p>
      )}
      </>
    );
  }