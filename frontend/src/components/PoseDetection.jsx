import React, { useEffect, useRef, useState } from "react";
import * as poseDetection from "@tensorflow-models/pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs";
import Webcam from "./Webcam";

const PoseDetection = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCamOn, setIsCamOn] = useState(false);
  const [poseNet, setPoseNet] = useState(null);
  const [squatCount, setSquatCount] = useState(0);

  const keypointPairs = [
    [4, 2], // rightEar -> rightEye
    [2, 0], // rightEye -> nose
    [0, 1], // nose -> leftEye
    [1, 3], // leftEye -> leftEar
    [10, 8], // rightWrist -> rightElbow
    [8, 6], // rightElbow -> rightShoulder
    [6, 12], // rightShoulder -> rightHip
    [12, 14], // rightHip -> rightKnee
    [14, 16], // rightKnee -> rightAnkle
    [9, 7], // leftWrist -> leftElbow
    [7, 5], // leftElbow -> leftShoulder
    [5, 11], // leftShoulder -> leftHip
    [11, 13], // leftHip -> leftKnee
    [13, 15], // leftKnee -> leftAnkle
    [11, 12], // leftHip -> rightHip
    [5, 6], // leftShoulder -> rightShoulder
  ];

  useEffect(() => {
    const loadPoseNet = async () => {
      await tf.ready();

      const model = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER, // Use SINGLEPOSE_THUNDER or SINGLEPOSE_LIGHTNING
        }
      );

      // const model = await poseDetection.createDetector(
      //   poseDetection.SupportedModels.BlazePose,
      //   {
      //     runtime: "tfjs",
      //     modelType: "full",
      //   }
      // );
      setPoseNet(model);
    };
    loadPoseNet();
  }, []);

  useEffect(() => {
    const detectPose = async () => {
      if (webcamRef.current && isCamOn && poseNet) {
        const video = webcamRef.current.getWebcamElement();
        const poses = await poseNet.estimatePoses(video, {
          flipHorizontal: false,
        });
  
        if (poses.length > 0) {
          drawCanvas(poses[0].keypoints, video, canvasRef);
          const isCorrect = checkSquatPose(poses[0].keypoints);
          if (isCorrect) {
            setSquatCount(squatCount + 1);
          }
        }
      }
    };

    let interval = null;
    if (isCamOn) {
      interval = setInterval(() => {
        detectPose();
      }, 100);
    } else if (interval) {
      clearInterval(interval); // Clear the interval when webcam is off
    }

    return () => clearInterval(interval);
  }, [poseNet, squatCount, isCamOn]);

  const drawCanvas = (keypoints, video, canvas) => {
    const ctx = canvas.current.getContext("2d");
    canvas.current.width = video.videoWidth;
    canvas.current.height = video.videoHeight;

    // Clear canvas before each draw
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);

    // Draw keypoints
    keypoints.forEach((point) => {
      const { x, y, score } = point;
      if (score > 0.5) {
        // Only draw keypoints with confidence above a threshold
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
      }
    });

    // Draw lines (skeleton)
    keypointPairs.forEach(([startIdx, endIdx]) => {
      const start = keypoints[startIdx];
      const end = keypoints[endIdx];

      if (start.score > 0.5 && end.score > 0.5) {
        // Only draw lines for confident keypoints
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 4;
        ctx.stroke();
      }
    });
  };

  const getAngle = (a, b, c) => {
    const ab = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    const bc = Math.sqrt(Math.pow(b.x - c.x, 2) + Math.pow(b.y - c.y, 2));
    const ac = Math.sqrt(Math.pow(c.x - a.x, 2) + Math.pow(c.y - a.y, 2));
    return (
      Math.acos((ab * ab + bc * bc - ac * ac) / (2 * ab * bc)) * (180 / Math.PI)
    );
  };

  const checkSquatPose = (keypoints) => {
    const leftHip = keypoints[11];
    const leftKnee = keypoints[13];
    const leftAnkle = keypoints[15];

    const squatAngle = getAngle(leftHip, leftKnee, leftAnkle);
    return squatAngle > 70; // Return true if squat pose is correct
  };

  return (
    <div>
      <div>
        <div>Squat Count: {squatCount}</div>
        {isCamOn ? (
          <button
            onClick={() => {
              webcamRef.current.stopWebcam();
              setIsCamOn(false);
            }}
          >
            Stop Webcam
          </button>
        ) : (
          <button
            onClick={() => {
              webcamRef.current.startWebcam();
              setIsCamOn(true);
            }}
          >
            Start Webcam
          </button>
        )}
      </div>
      <div className="relative">
        <Webcam ref={webcamRef} isCamOn={ isCamOn } />
        <canvas ref={canvasRef} className="absolute left-0 top-0" />
      </div>
    </div>
  );
};

export default PoseDetection;
