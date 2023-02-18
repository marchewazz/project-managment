import { useParticipant } from "@videosdk.live/react-sdk";
import { useEffect, useRef, useState } from "react";

export default function ParticipantView(props: any) {
    const webcamRef: any = useRef(null);
    const micRef: any = useRef(null);
    const screenShareRef: any = useRef(null);

    const [ready, setReady] = useState(false);

    const { displayName, webcamStream, micStream, screenShareStream, webcamOn, micOn, isLocal, screenShareOn, participant, isActiveSpeaker } = useParticipant(props.participantId);  

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
        <div className={isActiveSpeaker ? "bg-red-400" : "" + "shadow-inner shadow-black"}
        key={props.participantId} >
          <audio ref={micRef} autoPlay muted={isLocal} />
          <div>
            <h2 className="text-center text-2xl font-semibold">
              {displayName}
            </h2>
            { webcamOn ? (
              <video
                height={"100%"}
                width={"100%"}
                ref={webcamRef}
                autoPlay
              />
            ) : (null)}
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
          <div className="flex justify-evenly">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill={micOn ? "#00FF00": "#FF0000"} 
              class="w-6 h-6">
                <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
                <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
              </svg>
            </span>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill={webcamOn ? "#00FF00": "#FF0000"}
              class="w-6 h-6">
                <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
              </svg>
            </span>
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill={screenShareOn ? "#00FF00": "#FF0000"} 
              class="w-6 h-6">
                <path fill-rule="evenodd" 
                d="M2.25 6a3 3 0 013-3h13.5a3 3 0 013 3v12a3 3 0 01-3 3H5.25a3 3 0 01-3-3V6zm18 3H3.75v9a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V9zm-15-3.75A.75.75 0 004.5 6v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V6a.75.75 0 00-.75-.75H5.25zm1.5.75a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V6zm3-.75A.75.75 0 009 6v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V6a.75.75 0 00-.75-.75H9.75z" 
                clip-rule="evenodd" 
                />
              </svg>
            </span>
          </div>
        </div>
      ) : (
        <p>
          Loading...
        </p>
      )}
      </>
    );
  }