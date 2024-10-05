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
    [11, 13], // leftHip -> leftKnee
    [13, 15], // leftKnee -> leftAnkle
    [12, 14], // rightHip -> rightKnee
    [14, 16], // rightKnee -> rightAnkle
    [11, 12], // leftHip -> rightHip
    [5, 7], // leftShoulder -> leftElbow
    [7, 9], // leftElbow -> leftWrist
    [6, 8], // rightShoulder -> rightElbow
    [8, 10], // rightElbow -> rightWrist
    [5, 6], // leftShoulder -> rightShoulder
    [5, 11], // leftShoulder -> leftHip
    [6, 12], // rightShoulder -> rightHip
  ];

  useEffect(() => {
    const loadPoseNet = async () => {
      await tf.ready();

      // const model = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
      //   modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER, // Use SINGLEPOSE_THUNDER or SINGLEPOSE_LIGHTNING
      // });

      const model = await poseDetection.createDetector(
        poseDetection.SupportedModels.BlazePose,
        {
          runtime: "tfjs",
          modelType: "full",
        }
      );
      setPoseNet(model);
    };
    loadPoseNet();
  }, []);

  useEffect(() => {
    const detectPose = async () => {
      if (webcamRef.current && poseNet) {
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

    const interval = setInterval(() => {
      detectPose();
    }, 100);

    return () => clearInterval(interval);
  }, [poseNet, squatCount]);

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
        <Webcam ref={webcamRef} />
        <canvas ref={canvasRef} className="absolute left-0 top-0" />
      </div>
    </div>
  );
};

export default PoseDetection;
