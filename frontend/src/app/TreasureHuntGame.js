"use client";
import React, { useEffect, useState, useRef } from "react";
import { Camera } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const TreasureHuntGame = (props) => {
  const [currentRiddle, setCurrentRiddle] = useState({});
  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [riddles, setRiddles] = useState([]);
  const imageUploadRef = useRef(null);

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
      handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file) => {
    setUploadStatus("Uploading...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Replace with your actual upload endpoint
      const response = await fetch(
        "http://192.168.43.132:8000/validateimage/" +
          riddles[currentRiddleIndex].answer,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        setUploadStatus("Image uploaded successfully!");
        // Move to next riddle after successful upload
        const answer = await response.json();
        console.log(answer);
        if (answer.is_valid) {
          alert("Correct Answer");
          setTimeout(() => {
            moveToNextRiddle();
          }, 1500);
        } else {
          alert("Incorrect Answer");
        }
      } else {
        setUploadStatus("Upload failed. Please try again.");
      }
    } catch (error) {
      setUploadStatus("Error uploading image: " + error.message);
    }
  };

  const showNextHint = () => {
    if (riddles.length > 0) {
      if (currentHintIndex < riddles[currentRiddleIndex].hints.length - 1) {
        setCurrentHintIndex(currentHintIndex + 1);
      }
      setShowHint(true);
    }
  };

  const moveToNextRiddle = () => {
    if (currentRiddleIndex < riddles.length - 1) {
      setCurrentRiddleIndex(currentRiddleIndex + 1);
      setCurrentRiddle(riddles[currentRiddleIndex + 1]);
      setShowHint(false);
      setCurrentHintIndex(0);
      setSelectedImage(null);
      setUploadStatus("");
    }
  };

  useEffect(() => {
    console.log(props["riddles"]);
    setRiddles(props["riddles"]);
    console.log(riddles);
    setCurrentRiddle(riddles[0]);
  }, [riddles]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-purple-800">
            Riddle {currentRiddleIndex + 1} of {riddles.length}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="whitespace-pre-line">{currentRiddle?.clue ?? ""}</p>
          </div>

          {showHint && (
            <Alert className="bg-blue-50">
              <AlertDescription>
                Hint {currentHintIndex + 1}:{" "}
                {currentRiddle?.hints?.[currentHintIndex]}
              </AlertDescription>
            </Alert>
          )}

          {uploadStatus && (
            <Alert
              className={
                uploadStatus.includes("successfully")
                  ? "bg-green-50"
                  : "bg-yellow-50"
              }
            >
              <AlertDescription>{uploadStatus}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4">
          <div className="flex space-x-4 w-full">
            <Button
              onClick={showNextHint}
              disabled={
                showHint && currentHintIndex >= currentRiddle.hints.length - 1
              }
              className="flex-1 bg-blue-500 hover:bg-blue-600"
            >
              {showHint ? "Next Hint" : "Need a Hint?"}
            </Button>

            <div className="flex-1">
              <input
                ref={imageUploadRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                {
                  <Button
                    className="w-full bg-green-500 hover:bg-green-600"
                    onClick={
                      () => {
                        console.log(imageUploadRef.current);
                        imageUploadRef.current.click();
                      }
                      // document.getElementById("image-upload").click()
                    }
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Upload Photo
                  </Button>
                }
              </label>
            </div>
          </div>

          {currentRiddleIndex < riddles.length - 1 && (
            <Button
              onClick={moveToNextRiddle}
              className="w-full bg-purple-500 hover:bg-purple-600"
            >
              Skip to Next Riddle
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default TreasureHuntGame;
