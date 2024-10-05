import { useRef, useImperativeHandle, forwardRef } from "react";

const Webcam = ({ height = 480, width = 640 }, ref) => {
  const webcamRef = useRef(null);
  const mediaStreamRef = useRef(null); // To hold the media stream

  useImperativeHandle(
    ref,
    () => ({
      startWebcam() {
        const webcamElement = webcamRef.current;
        if (webcamElement) {
          webcamElement.width = width;
          webcamElement.height = height;

          navigator.mediaDevices
            .getUserMedia({
              video: { width, height },
            })
            .then((stream) => {
              mediaStreamRef.current = stream; // Save the stream
              webcamElement.srcObject = stream;
            });
        }
      },
      stopWebcam() {
        const stream = mediaStreamRef.current;
        if (stream) {
          // Stop all tracks in the stream
          stream.getTracks().forEach(track => track.stop());
          mediaStreamRef.current = null; // Clear the stream reference
          const webcamElement = webcamRef.current;
          if (webcamElement) {
            webcamElement.srcObject = null; // Clear the video source
          }
        }
      },
      getWebcamElement() {
        return webcamRef.current;
      },
    }),
    [height, width]
  );

  return <video ref={webcamRef} autoPlay className="absolute left-0 top-0" />;
};

export default forwardRef(Webcam);
