"use client";
import React, { useState } from "react";
import TreasureHuntGame from "./TreasureHuntGame";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const VideoUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [showRiddle, setShowRiddle] = useState(false);
  const [riddles, setRiddles] = useState([]);
  const [difficulty, setDifficulty] = useState("easy");

  const handleFileSelect = (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith("video/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadStatus("File selected: " + file.name);
    } else {
      setUploadStatus("Please select a valid video file");
    }
  };

  const handleDifficultyChange = (value) => {
    setDifficulty(value);
    setShowHint(false);
    setCurrentHintIndex(0);
    setSelectedImage(null);
    setUploadStatus("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file first");
      return;
    }

    setUploadStatus("Uploading...");

    // Create FormData object to send file
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Replace with your actual API endpoint
      const response = await fetch(
        "http://192.168.43.132:8000/uploadvideo/" + difficulty,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        setUploadStatus("Upload successful!");
        setShowRiddle(true);
        const data = await response.json();
        setRiddles(data.treasure_hunt.riddles);
      } else {
        setUploadStatus("Upload failed. Please try again.");
      }
    } catch (error) {
      setUploadStatus("Error uploading file: " + error.message);
    }
  };

  return showRiddle == false ? (
    <div className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-md">
      {/* File Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Difficulty Level
        </label>
        <Select onValueChange={handleDifficultyChange} value={difficulty}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="easy">Easy</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="hard">Hard</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="hidden"
        id="video-input"
      />

      {/* Custom Upload Button */}
      <label
        htmlFor="video-input"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600 transition-colors"
      >
        Select Video File
      </label>

      {/* Upload Status */}
      {uploadStatus && (
        <div className="text-sm text-gray-600">{uploadStatus}</div>
      )}

      {/* Video Preview */}
      {previewUrl && (
        <div className="mt-4">
          <video width="320" height="240" controls className="rounded-lg">
            <source src={previewUrl} type={selectedFile.type} />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Upload Button */}
      {selectedFile && (
        <button
          onClick={handleUpload}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Upload Video
        </button>
      )}
    </div>
  ) : (
    <TreasureHuntGame riddles={riddles} />
  );
};

export default VideoUpload;
