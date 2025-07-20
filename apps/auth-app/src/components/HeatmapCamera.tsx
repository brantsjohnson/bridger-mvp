import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Camera, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeatmapCameraProps {
  onCapture: (imageData: string) => void;
  capturedImage?: string | null;
}

export const HeatmapCamera = ({ onCapture, capturedImage }: HeatmapCameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    console.log('Attempting to start camera...');
    setError(null);
    
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Camera not supported in this browser');
      return;
    }

    try {
      console.log('Requesting camera access...');
      
      // Simple constraints first
      const constraints = {
        video: true,
        audio: false
      };
      
      console.log('getUserMedia constraints:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log('Camera stream obtained:', stream);
      console.log('Video tracks:', stream.getVideoTracks());
      console.log('Audio tracks:', stream.getAudioTracks());
      console.log('All tracks:', stream.getTracks());
      
      // Check if we actually got video tracks
      if (stream.getVideoTracks().length === 0) {
        throw new Error('No video tracks available in the stream');
      }
      
      console.log('Camera stream obtained:', stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Force video to load and play
        videoRef.current.onloadedmetadata = () => {
          console.log('Video metadata loaded');
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                console.log('Video playing - should see preview now');
                setIsStreaming(true);
                setError(null);
              })
              .catch((playError) => {
                console.error('Video play error:', playError);
                setError('Failed to start video playback');
              });
          }
        };
        
        // Immediately try to play in case metadata is already loaded
        if (videoRef.current.readyState >= 1) {
          console.log('Video ready immediately, playing now');
          videoRef.current.play()
            .then(() => {
              console.log('Video playing immediately');
              setIsStreaming(true);
              setError(null);
            })
            .catch((playError) => {
              console.error('Immediate play error:', playError);
            });
        }
      }
    } catch (err) {
      console.error('Camera error details:', err);
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Camera access denied. Please allow camera permissions.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera found on this device.');
        } else if (err.name === 'NotSupportedError') {
          setError('Camera not supported in this browser.');
        } else {
          setError(`Camera error: ${err.message}`);
        }
      } else {
        setError('Camera access denied or not available');
      }
    }
  }, []);

  const stopCamera = useCallback(() => {
    console.log('Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind);
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
  }, []);

  const applyHeatmapFilter = (ctx: CanvasRenderingContext2D, imageData: ImageData) => {
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Convert to grayscale intensity
      const intensity = (r * 0.299 + g * 0.587 + b * 0.114);
      
      // Apply heatmap color mapping (blue -> cyan -> green -> yellow -> red)
      if (intensity < 51) {
        // Dark blue to blue
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = Math.min(255, intensity * 5);
      } else if (intensity < 102) {
        // Blue to cyan
        data[i] = 0;
        data[i + 1] = (intensity - 51) * 5;
        data[i + 2] = 255;
      } else if (intensity < 153) {
        // Cyan to green
        data[i] = 0;
        data[i + 1] = 255;
        data[i + 2] = 255 - (intensity - 102) * 5;
      } else if (intensity < 204) {
        // Green to yellow
        data[i] = (intensity - 153) * 5;
        data[i + 1] = 255;
        data[i + 2] = 0;
      } else {
        // Yellow to red
        data[i] = 255;
        data[i + 1] = 255 - (intensity - 204) * 5;
        data[i + 2] = 0;
      }
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const capturePhoto = () => {
    console.log('Capturing photo...');
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video) {
      console.error('Video element not found');
      setError('Video not available for capture');
      return;
    }
    
    if (!canvas) {
      console.error('Canvas element not found');
      setError('Canvas not available for capture');
      return;
    }

    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      console.error('Video not ready for capture');
      setError('Video not ready. Please wait and try again.');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Canvas context not available');
      setError('Canvas context not available');
      return;
    }

    try {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      console.log('Drawing video to canvas:', canvas.width, 'x', canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      applyHeatmapFilter(ctx, frame);

      const dataUrl = canvas.toDataURL('image/png');
      console.log('Photo captured successfully, data URL length:', dataUrl.length);
      onCapture(dataUrl);
      stopCamera();
    } catch (err) {
      console.error('Error capturing photo:', err);
      setError('Failed to capture photo. Please try again.');
    }
  };

  const retakePhoto = () => {
    onCapture('');
    startCamera();
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  if (capturedImage) {
    return (
      <div className="text-center">
        <div className="mb-4">
          <div className="w-48 h-36 mx-auto border-2 border-[hsl(var(--win2k-border))] overflow-hidden bg-[hsl(var(--win2k-panel))]" style={{ borderStyle: 'inset' }}>
            <img
              src={capturedImage}
              alt="Captured thermal profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <Button
          type="button"
          onClick={retakePhoto}
          className="win2k-button font-mono flex items-center gap-2 mx-auto"
        >
          <RotateCcw className="w-4 h-4" />
          RETAKE_PHOTO
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mb-4">
        <div className="w-48 h-36 mx-auto border-2 border-[hsl(var(--win2k-border))] overflow-hidden bg-black relative" style={{ borderStyle: 'inset' }}>
          {isStreaming ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{
                backgroundColor: '#000',
                display: 'block'
              }}
              onError={(e) => {
                console.error('Video element error:', e);
                setError('Video playback error');
              }}
              onLoadedMetadata={() => {
                console.log('Video metadata loaded - video should be visible now');
              }}
              onPlay={() => {
                console.log('Video started playing - should see preview now');
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white bg-black">
              <Camera className="w-8 h-8" />
              <span className="ml-2 text-sm">Camera Ready</span>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="text-red-600 font-mono text-xs mb-4 p-2 bg-red-100 border border-red-300 rounded">
          {error}
        </div>
      )}
      
      {!isStreaming ? (
        <Button
          type="button"
          onClick={startCamera}
          className="win2k-button font-mono flex items-center gap-2 mx-auto"
        >
          <Camera className="w-4 h-4" />
          START_CAMERA
        </Button>
      ) : (
        <div className="space-y-2">
          <Button
            type="button"
            onClick={capturePhoto}
            className="win2k-button font-mono flex items-center gap-2 mx-auto"
          >
            <Camera className="w-4 h-4" />
            CAPTURE_THERMAL
          </Button>
          <Button
            type="button"
            onClick={stopCamera}
            variant="secondary"
            className="win2k-button font-mono text-xs mx-auto"
          >
            STOP_CAMERA
          </Button>
        </div>
      )}
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="text-[hsl(var(--hacker-green))] text-xs font-mono mt-4 p-2 bg-black border border-[hsl(var(--hacker-border))]">
        <div>{"> REQUIRED: Take thermal image for security verification"}</div>
        {isStreaming && (
          <div className="mt-1">{"> Camera active - Click CAPTURE_THERMAL when ready"}</div>
        )}
      </div>
    </div>
  );
};