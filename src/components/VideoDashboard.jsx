import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer';

const videoList = [
  { id: 'video_1', title: 'Apna College Lecture', url: '/videoplayback (1).mp4' },
  { id: 'video_2', title: 'Before Doing Engineering', url: '/lecture2.mp4' },
  { id: 'video_3', title: 'Gopi Project Explanation', url: '/lecture.mp4' },
  { id: 'video_4', title: 'Shradda', url: '/videoplayback (1).mp4' },
  { id: 'video_5', title: 'Indian Education System', url: 'https://www.youtube.com/watch?v=xPftLsZeKSg' },
];  

const VideoDashboard = () => {
  const [selectedVideo, setSelectedVideo] = useState(videoList[0]);
  const [progressData, setProgressData] = useState({});

  // Update progress for each video
  const handleProgressUpdate = (videoId, progress) => {
    setProgressData((prev) => ({ ...prev, [videoId]: progress }));
  };

  // Navigate to previous/next video
  const currentIndex = videoList.findIndex((video) => video.id === selectedVideo.id);
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSelectedVideo(videoList[currentIndex - 1]);
    }
  };
  const handleNext = () => {
    if (currentIndex < videoList.length - 1) {
      setSelectedVideo(videoList[currentIndex + 1]);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f0f4f9' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', background: '#1e293b', color: '#fff', padding: '1rem', height: '100vh', overflowY: 'auto' }}>
        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #fff', paddingBottom: '0.5rem' }}>
          🎬 List of Videos
        </h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {videoList.map((video) => (
            <li
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              style={{
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: selectedVideo.id === video.id ? '#3b82f6' : '#334155',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{video.title}</span>
                <span style={{ fontSize: '0.8rem', color: '#a0aec0' }}>
                  {progressData[video.id] ? `${progressData[video.id].toFixed(2)}%` : '0%'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: currentIndex === 0 ? '#e5e7eb' : '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            &lt; Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === videoList.length - 1}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: currentIndex === videoList.length - 1 ? '#e5e7eb' : '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: currentIndex === videoList.length - 1 ? 'not-allowed' : 'pointer',
            }}
          >
            Next &gt;
          </button>
        </div>
        <VideoPlayer video={selectedVideo} onProgressUpdate={handleProgressUpdate} />
      </div>
    </div>
  );
};

export default VideoDashboard;