"use client";
import React, { useState } from "react";
import VideoUpload from "./VideoUpload";

export default function Home() {
  return (
    <div className="min-h-screen  p-8">
      <h1 className="text-3xl  font-bold text-center mb-8">CLUEQUEST</h1>

      <VideoUpload onSuccess={() => setVideoUploaded(true)} />
    </div>
  );
}
