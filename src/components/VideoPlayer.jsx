import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';

const VideoPlayer = ({ video, onProgressUpdate }) => {
  const playerRef = useRef(null);
  const [watchedIntervals, setWatchedIntervals] = useState([]);
  const [progress, setProgress] = useState(0);
  const [lastPosition, setLastPosition] = useState(0);

  const userId = 'user123';
  const videoId = video.id;

  const handleProgress = (state) => {
    const { playedSeconds } = state;
    const start = Math.floor(playedSeconds) - 1;
    const end = Math.floor(playedSeconds);

    if (start >= 0 && end > start) {
      const newInterval = [start, end];
      const updated = mergeIntervals([...watchedIntervals, newInterval]);
      setWatchedIntervals(updated);
      setLastPosition(playedSeconds);

      const duration = playerRef.current?.getDuration() || 1;
      const unique = updated.reduce((sum, [s, e]) => sum + (e - s), 0);
      const newProgress = (unique / duration) * 100;
      setProgress(newProgress);

      // Update parent component with progress
      onProgressUpdate(videoId, newProgress);
    }
  };

  const mergeIntervals = (intervals) => {
    if (intervals.length <= 1) return intervals;
    const sorted = intervals.sort((a, b) => a[0] - b[0]);
    const merged = [sorted[0]];
    for (let i = 1; i < sorted.length; i++) {
      const [s, e] = sorted[i];
      const last = merged[merged.length - 1];
      if (s <= last[1]) {
        last[1] = Math.max(last[1], e);
      } else {
        merged.push([s, e]);
      }
    }
    return merged;
  };

  const saveProgress = async () => {
    try {
      await axios.post('http://localhost:5000/api/progress/save', {
        userId,
        videoId,
        watchedIntervals,
        lastPosition,
        progress,
      });
    } catch (err) {
      console.error('❌ Save error:', err.message);
    }
  };

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/progress/${userId}/${videoId}`);
        if (res.data) {
          setWatchedIntervals(res.data.watchedIntervals || []);
          setLastPosition(res.data.lastPosition || 0);
          setProgress(res.data.progress || 0);
          if (playerRef.current) {
            playerRef.current.seekTo(res.data.lastPosition || 0);
          }
        }
      } catch {
        console.warn('⚠️ No saved progress found.');
      }
    };

    fetchProgress();
    const interval = setInterval(saveProgress, 10000);
    window.addEventListener('beforeunload', saveProgress);
    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', saveProgress);
    };
  }, [videoId]);

  return (
    <div style={{ padding: '1rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ marginBottom: '1rem', color: '#1e293b', fontSize: '1.5rem' }}>{video.title}</h2>
      <ReactPlayer
        ref={playerRef}
        url={video.url}
        controls
        width="100%"
        height="420px"
        onProgress={handleProgress}
        style={{ borderRadius: '8px', overflow: 'hidden' }}
      />

      {/* Progress Display */}
      <div style={{ marginTop: '1rem' }}>
        <strong style={{ color: '#1e293b' }}>Progress: </strong>
        <span style={{ color: '#3b82f6' }}>{progress.toFixed(2)}%</span>
        <div
          style={{
            marginTop: '0.5rem',
            height: '12px',
            backgroundColor: '#e5e7eb',
            borderRadius: '6px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: '#3b82f6',
              transition: 'width 0.4s ease-in-out',
            }}
          />
        </div>
      </div>

      {/* Watched Intervals Table */}
      <div style={{ marginTop: '2rem' }}>
        <h4 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Watched Intervals (Debug)</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ backgroundColor: '#3b82f6', color: '#fff' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Start</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>End</th>
            </tr>
          </thead>
          <tbody>
            {watchedIntervals.map(([start, end], i) => (
              <tr key={i}>
                <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', color: '#1e293b' }}>{start}s</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #e5e7eb', color: '#1e293b' }}>{end}s</td>
              </tr>
            ))}
            {watchedIntervals.length === 0 && (
              <tr>
                <td colSpan="2" style={{ padding: '10px', textAlign: 'center', color: '#6b7280' }}>
                  No activity yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VideoPlayer;