import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, ArrowRight, Camera, X, Check } from 'lucide-react';
import { useAuth } from '../../../../shared/lib/authContext';
import AccountCreatedTerminal from './AccountCreatedTerminal';

interface SignupScreenProps {
  onSwitchToLogin: () => void;
  onSkip: () => void;
}

type Step = 'credentials' | 'profile' | 'terminal';

export const SignupScreen = ({ onSwitchToLogin, onSkip }: SignupScreenProps) => {
  const [step, setStep] = useState<Step>('credentials');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoConfirmed, setPhotoConfirmed] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showRetakeDialog, setShowRetakeDialog] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const { signUp } = useAuth();

  // Ensure video element is properly initialized
  useEffect(() => {
    console.log('SignupScreen mounted, videoRef:', videoRef.current);
  }, []);

  // Debug current state
  useEffect(() => {
    console.log('Current step:', step, 'photoTaken:', photoTaken, 'showCamera:', showCamera, 'loading:', loading);
  }, [step, photoTaken, showCamera, loading]);

  // Cleanup camera when component unmounts
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    return '';
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Validate password when it changes
    if (field === 'password') {
      const error = validatePassword(value);
      setPasswordError(error);
    }
  };

  const handleNext = () => {
    if (step === 'credentials') setStep('profile');
  };

  const handleBack = () => {
    if (step === 'profile') setStep('credentials');
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('SignupScreen: Starting signup process...');
    console.log('SignupScreen: Form data:', {
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      hasPhoto: !!photoUrl
    });
    
    try {
      // Create user account
      const user = await signUp(
        formData.email,
        formData.password,
        `${formData.firstName} ${formData.lastName}`.trim(),
        photoUrl
      );
      
      console.log('SignupScreen: Signup successful, user:', user);
      
      setStep('terminal');
    } catch (error: any) {
      console.error('SignupScreen: Signup error:', error);
      
      let errorMessage = "Failed to create account";
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.error_description) {
        errorMessage = error.error_description;
      }
      
      toast({
        title: "Signup Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'credentials': return 'SECURITY_PROTOCOL';
      case 'profile': return 'TAKE_PROFILE_PIC';
      case 'terminal': return 'ACCOUNT_CREATED';
      default: return 'SYSTEM_ACCESS';
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 'credentials':
        return formData.email.trim() && 
               formData.password.trim() && 
               formData.confirmPassword.trim() && 
               formData.password === formData.confirmPassword &&
               formData.password.length >= 6;
      case 'profile':
        return formData.firstName.trim() && 
               formData.lastName.trim() && 
               photoConfirmed; // Photo must be confirmed to proceed
      default:
        return false;
    }
  };

  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      setLoading(true);
      
      // First, check if we have permissions
      const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
      console.log('Camera permission status:', permissions.state);
      
      if (permissions.state === 'denied') {
        throw new Error('Camera permission denied. Please allow camera access in your browser settings.');
      }
      
      // Get available video devices to find front-facing camera
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      console.log('Available video devices:', videoDevices);
      
      // Find front-facing camera (usually has 'user' or 'front' in the label)
      const frontCamera = videoDevices.find(device => 
        device.label.toLowerCase().includes('front') || 
        device.label.toLowerCase().includes('user') ||
        device.label.toLowerCase().includes('face')
      );
      
      const constraints = {
        video: {
          width: { ideal: 640, min: 320 },
          height: { ideal: 480, min: 240 },
          facingMode: 'user',
          // If we found a specific front camera, use its deviceId
          ...(frontCamera && { deviceId: { exact: frontCamera.deviceId } })
        }
      };
      
      console.log('Camera constraints:', constraints);
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera stream obtained:', stream);
      
      // Wait for video element to be available
      let attempts = 0;
      const maxAttempts = 20; // Increased attempts
      
      const trySetVideo = () => {
        console.log(`Checking video element, attempt ${attempts + 1}/${maxAttempts}, videoRef:`, videoRef.current);
        
        if (videoRef.current) {
          console.log('Video element found, setting srcObject');
          videoRef.current.srcObject = stream;
          
          videoRef.current.onloadedmetadata = () => {
            console.log('Video metadata loaded, dimensions:', videoRef.current?.videoWidth, 'x', videoRef.current?.videoHeight);
            setShowCamera(true);
            setLoading(false);
          };
          
          videoRef.current.oncanplay = () => {
            console.log('Video can play');
          };
          
          videoRef.current.onerror = (e) => {
            console.error('Video error:', e);
            setLoading(false);
          };
          
          return true;
        } else {
          console.log(`Video element not ready, attempt ${attempts + 1}/${maxAttempts}`);
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(trySetVideo, 200); // Increased delay
          } else {
            console.error('Video element never became available');
            stream.getTracks().forEach(track => track.stop());
            setLoading(false);
            throw new Error('Could not initialize video element');
          }
        }
      };
      
      // Start trying to set the video
      trySetVideo();
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      setLoading(false);
      
      let errorMessage = "Could not access camera. Please check permissions.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
  };

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

  const takePhoto = () => {
    console.log('takePhoto called');
    console.log('videoRef.current:', videoRef.current);
    console.log('canvasRef.current:', canvasRef.current);
    
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      console.log('Canvas context:', context);
      console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight);
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Mirror the canvas context to match the video
        context.scale(-1, 1);
        context.translate(-canvas.width, 0);
        
        context.drawImage(video, 0, 0);
        
        console.log('Image drawn to canvas (mirrored)');
        
        // Reset transform for heatmap filter
        context.setTransform(1, 0, 0, 1, 0, 0);
        
        // Apply heatmap filter
        const frame = context.getImageData(0, 0, canvas.width, canvas.height);
        applyHeatmapFilter(context, frame);
        
        console.log('Heatmap filter applied');
        
        // Convert canvas to data URL for storage
        const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        console.log('Photo data URL length:', photoDataUrl.length);
        
        setPhotoUrl(photoDataUrl);
        setPhotoTaken(true);
        stopCamera();
        
        console.log('Photo taken, photoTaken set to true');
        

      } else {
        console.error('Could not get canvas context');
      }
    } else {
      console.error('Video or canvas ref is null');
      console.log('videoRef.current:', videoRef.current);
      console.log('canvasRef.current:', canvasRef.current);
    }
  };

  const confirmPhoto = async () => {
    try {
      setLoading(true);
      
      // Here you would typically upload the photo to Supabase storage
      // For now, we'll just log it and proceed
      console.log('Photo confirmed and ready for upload:', photoUrl);
      

      
      setPhotoConfirmed(true);
      
      // The photoUrl is already saved and will be passed to signUp function
      // when the user clicks CREATE_ACCOUNT
      
    } catch (error) {
      console.error('Error confirming photo:', error);
      toast({
        title: "Error",
        description: "Failed to save photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRetakeClick = () => {
    setShowRetakeDialog(true);
  };

  const handleRetakeConfirm = () => {
    setShowRetakeDialog(false);
    setPhotoConfirmed(false);
    setPhotoTaken(false);
    setShowCamera(false);
  };

  const handleRetakeCancel = () => {
    setShowRetakeDialog(false);
  };

  // Apply heatmap filter to live video
  const applyLiveHeatmap = () => {
    if (videoRef.current && showCamera) {
      const video = videoRef.current;
      const overlay = document.getElementById('heatmapOverlay') as HTMLCanvasElement;
      
      if (overlay) {
        const ctx = overlay.getContext('2d');
        if (ctx) {
          // Set canvas size to match the display container (300x300)
          overlay.width = 300;
          overlay.height = 300;
          
          // Calculate scaling to maintain aspect ratio
          const videoAspect = video.videoWidth / video.videoHeight;
          const containerAspect = 1; // 300x300 is 1:1
          
          let drawWidth, drawHeight, offsetX, offsetY;
          
          if (videoAspect > containerAspect) {
            // Video is wider than container
            drawHeight = 300;
            drawWidth = 300 * videoAspect;
            offsetX = (drawWidth - 300) / 2;
            offsetY = 0;
          } else {
            // Video is taller than container
            drawWidth = 300;
            drawHeight = 300 / videoAspect;
            offsetX = 0;
            offsetY = (drawHeight - 300) / 2;
          }
          
          // Draw video frame to overlay with proper scaling
          ctx.drawImage(video, -offsetX, -offsetY, drawWidth, drawHeight);
          
          // Apply heatmap filter
          const imageData = ctx.getImageData(0, 0, overlay.width, overlay.height);
          applyHeatmapFilter(ctx, imageData);
        }
      }
    }
  };

  // Start live heatmap when camera is ready
  useEffect(() => {
    if (showCamera && videoRef.current) {
      const interval = setInterval(applyLiveHeatmap, 100); // Update every 100ms
      return () => clearInterval(interval);
    }
  }, [showCamera]);

  // Show terminal screen after account creation
  if (step === 'terminal') {
    return <AccountCreatedTerminal onComplete={onSkip} />;
  }

  // Add custom CSS for glowing effect and electricity
  const glowStyle = `
    @keyframes glowPulse {
      0%, 100% { 
        box-shadow: 0 0 20px rgba(34, 197, 94, 0.6), 0 0 40px rgba(34, 197, 94, 0.3);
      }
      50% { 
        box-shadow: 0 0 30px rgba(34, 197, 94, 0.8), 0 0 60px rgba(34, 197, 94, 0.5);
      }
    }
    
    @keyframes electricity {
      0%, 100% { 
        opacity: 0.4;
        box-shadow: 0 0 4px rgba(34, 197, 94, 0.6), 0 0 8px rgba(34, 197, 94, 0.4);
      }
      50% { 
        opacity: 1;
        box-shadow: 0 0 12px rgba(34, 197, 94, 1), 0 0 24px rgba(34, 197, 94, 0.8), 0 0 36px rgba(34, 197, 94, 0.6);
      }
    }
    
    @keyframes electricityShimmer {
      0% { 
        transform: translateX(-100%);
        opacity: 0;
      }
      50% { 
        opacity: 1;
      }
      100% { 
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    @keyframes electricPulse {
      0%, 100% { 
        opacity: 0.3;
        transform: scale(1);
      }
      50% { 
        opacity: 1;
        transform: scale(1.05);
      }
    }
  `;

  return (
    <>
      <style>{glowStyle}</style>
      <div 
        className="h-screen relative flex items-center justify-center p-4 overflow-hidden"
        style={{
          backgroundImage: `url(/lovable-uploads/e15ff961-d54d-4ce1-b3ec-bfd8be0cea9e.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#000000'
        }}
      >
      {/* CRT scanlines overlay with enhanced electricity */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--hacker-green))] to-transparent animate-pulse opacity-5"></div>
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-[hsl(var(--hacker-green))] opacity-15"
            style={{ 
              top: `${i * 1.5}%`,
              animation: `electricity ${3 + (i % 2)}s linear infinite`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
        {/* Electricity shimmer effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(34, 197, 94, 0.3) 50%, transparent 100%)`,
            animation: 'electricityShimmer 4s ease-in-out infinite',
            transform: 'translateX(-100%)'
          }}
        />
        {/* Additional electricity effects */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(0, 255, 0, 0.2) 50%, transparent 100%)`,
            animation: 'electricityShimmer 3s ease-in-out infinite',
            animationDelay: '1s',
            transform: 'translateX(-100%)'
          }}
        />
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(34, 197, 94, 0.4) 50%, transparent 100%)`,
            animation: 'electricityShimmer 5s ease-in-out infinite',
            animationDelay: '2s',
            transform: 'translateX(-100%)'
          }}
        />
      </div>
      
      <div className="win2k-window p-0 w-full max-w-md mx-auto relative z-10">
        {/* Terminal style title bar */}
        <div className="bg-black text-[hsl(var(--hacker-green))] px-4 py-2 text-sm font-mono flex items-center justify-between border-b border-[hsl(var(--hacker-border))]">
          <span className="font-bold">BRIDGER_REGISTRATION_v2.0</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-[hsl(var(--hacker-green))] animate-pulse"></div>
            <div className="w-2 h-2 bg-[hsl(var(--hacker-green-dim))]"></div>
          </div>
        </div>

        {/* Windows content area with hacker terminal styling */}
        <div className="p-6 bg-[hsl(var(--win2k-panel))]">

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 'credentials' && (
              <>
                <div>
                  <Label className="text-[hsl(var(--win2k-text))] font-mono text-sm font-bold">EMAIL_ADDRESS:</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="win2k-input mt-1 font-mono"
                    placeholder="user@domain.com"
                    required
                  />
                </div>
                <div>
                  <Label className="text-[hsl(var(--win2k-text))] font-mono text-sm font-bold">PASSWORD:</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="win2k-input mt-1 font-mono"
                    placeholder="Enter password..."
                    required
                  />
                  {passwordError && (
                    <p className="text-red-500 text-xs mt-1 font-mono">{passwordError}</p>
                  )}
                  <p className="text-gray-700 text-xs mt-1 font-mono">
                    Min of 6 characters
                  </p>
                </div>
                <div>
                  <Label className="text-[hsl(var(--win2k-text))] font-mono text-sm font-bold">CONFIRM_PASSWORD:</Label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="win2k-input mt-1 font-mono"
                    placeholder="Confirm password..."
                    required
                  />
                </div>
              </>
            )}

            {step === 'profile' && (
              <div className="text-center space-y-4">
                {!photoTaken ? (
                  <>
                    <div className="text-[hsl(var(--win2k-text))] font-bold mb-4" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
                      Take Your Profile Picture
                    </div>
                    
                    <div className="space-y-4">
                      <div className="relative bg-black border border-[hsl(var(--hacker-border))] rounded overflow-hidden" style={{ width: '300px', height: '300px', margin: '0 auto' }}>
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                          style={{ 
                            backgroundColor: '#000',
                            display: showCamera ? 'block' : 'none',
                            transform: 'scaleX(-1)', // Mirror the video
                            objectFit: 'cover' // Maintain aspect ratio
                          }}
                          onCanPlay={() => console.log('Video can play')}
                          onLoadStart={() => console.log('Video load started')}
                          onLoadedData={() => console.log('Video data loaded')}
                        />
                        {/* Heatmap filter overlay */}
                        {showCamera && (
                          <canvas
                            id="heatmapOverlay"
                            className="absolute inset-0 w-full h-full"
                            style={{ 
                              transform: 'scaleX(-1)', // Mirror the overlay to match video
                              pointerEvents: 'none' // Don't block video interactions
                            }}
                          />
                        )}
                        {!showCamera && (
                          <div className="absolute inset-0 flex items-center justify-center text-white">
                            <div className="text-center flex flex-col items-center">
                              {!loading ? (
                                <Button
                                  type="button"
                                  onClick={startCamera}
                                  className="win2k-button font-mono flex items-center gap-2 px-6 py-3"
                                >
                                  <Camera className="w-5 h-5" />
                                  TAKE_PICTURE
                                </Button>
                              ) : (
                                <>
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                                  <p className="text-sm">Initializing camera...</p>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      {showCamera && !photoTaken && (
                        <div className="flex justify-center mt-4">
                          <Button
                            type="button"
                            onClick={() => {
                              console.log('CAPTURE button clicked');
                              takePhoto();
                            }}
                            className="win2k-button font-mono flex items-center gap-2 px-6 py-3"
                          >
                            <Camera className="w-5 h-5" />
                            CAPTURE
                          </Button>
                        </div>
                      )}
                      {/* Always visible hottie message */}
                      <div className="text-[hsl(var(--hacker-green))] text-xs font-mono p-4 bg-black border border-[hsl(var(--hacker-border))] mt-4">
                        <div>{"> CAUTION: You are 100% a hottie"}</div>
                      </div>

                      {photoTaken && (
                        <div className="flex justify-center gap-3 mt-4">
                          <Button
                            type="button"
                            onClick={() => {
                              setPhotoTaken(false);
                              setShowCamera(false);
                            }}
                            className="win2k-button font-mono flex items-center gap-2 px-4 py-2"
                          >
                            <X className="w-4 h-4" />
                            RETAKE
                          </Button>
                          <Button
                            type="button"
                            onClick={confirmPhoto}
                            className="win2k-button font-mono flex items-center gap-2 px-4 py-2"
                          >
                            <Check className="w-4 h-4" />
                            CONFIRM
                          </Button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-center relative">
                      <img 
                        src={photoUrl} 
                        alt="Captured photo"
                        className="border border-[hsl(var(--hacker-border))] rounded"
                        style={{ width: '300px', height: '300px', objectFit: 'cover' }}
                      />
                      {photoConfirmed && (
                        <button
                          onClick={handleRetakeClick}
                          className="absolute bottom-2 right-2 bg-black bg-opacity-75 hover:bg-opacity-90 text-white p-2 rounded-full border border-white"
                          title="Retake photo"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    {!photoConfirmed && (
                      <div className="flex justify-center gap-3 mt-4">
                        <Button
                          type="button"
                          onClick={() => {
                            setPhotoTaken(false);
                            setShowCamera(false);
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white font-mono flex items-center gap-2 px-4 py-2 border border-red-700"
                          style={{ borderStyle: 'outset' }}
                        >
                          <X className="w-4 h-4" />
                          RETAKE
                        </Button>
                        <Button
                          type="button"
                          onClick={confirmPhoto}
                          className="bg-green-600 hover:bg-green-700 text-white font-mono flex items-center gap-2 px-4 py-2 border border-green-700"
                          style={{ borderStyle: 'outset' }}
                        >
                          <Check className="w-4 h-4" />
                          CONFIRM
                        </Button>
                      </div>
                    )}
                  </>
                )}
                
                {/* Hidden canvas for photo capture - always available */}
                <canvas
                  ref={canvasRef}
                  style={{ display: 'none' }}
                />
                
                {/* First and Last Name fields below camera */}
                <div className="space-y-4 mt-6">
                  <div>
                    <Label className="text-[hsl(var(--win2k-text))] font-mono text-sm font-bold">FIRST_NAME:</Label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="win2k-input mt-1 font-mono"
                      placeholder="Enter first name..."
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-[hsl(var(--win2k-text))] font-mono text-sm font-bold">LAST_NAME:</Label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="win2k-input mt-1 font-mono"
                      placeholder="Enter last name..."
                      required
                    />
                  </div>
                </div>
              </div>
            )}


            <div className="flex gap-3 pt-6">
              {step !== 'credentials' && (
                <Button
                  type="button"
                  onClick={handleBack}
                  className="win2k-button font-mono flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  BACK
                </Button>
              )}
              
              {step !== 'profile' ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="win2k-button font-mono flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  NEXT
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!isStepValid()}
                  className={`font-mono flex-1 transition-all duration-300 ${
                    isStepValid() 
                      ? 'bg-green-600 hover:bg-green-700 text-white border border-green-500' 
                      : 'win2k-button disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
                  style={isStepValid() ? {
                    borderStyle: 'outset',
                    animation: 'glowPulse 2s infinite'
                  } : {}}
                >
                  CREATE_ACCOUNT
                </Button>
              )}
            </div>

            {/* Login link and skip option */}
            <div className="text-center mt-4 space-y-2">
              <button
                onClick={onSwitchToLogin}
                className="text-[hsl(var(--win2k-blue))] hover:underline text-sm font-bold bg-[hsl(var(--win2k-panel))] px-4 py-2 border border-[hsl(var(--win2k-border))] block w-full"
                style={{ borderStyle: 'outset' }}
              >
                Already have an account? Login here
              </button>
              <button
                onClick={onSkip}
                className="text-[hsl(var(--hacker-green))] hover:underline text-sm block w-full"
                style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
              >
                Skip Authentication (Demo Mode)
              </button>
            </div>

            {/* Retake confirmation dialog */}
            {showRetakeDialog && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-[hsl(var(--win2k-panel))] border border-[hsl(var(--hacker-border))] p-6 rounded max-w-sm mx-4">
                  <h3 className="text-[hsl(var(--win2k-text))] font-mono font-bold mb-4">
                    Retake Photo?
                  </h3>
                  <p className="text-[hsl(var(--win2k-text))] text-sm mb-6">
                    Are you sure you want to retake your profile picture? This will replace your current photo.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleRetakeCancel}
                      className="win2k-button font-mono flex-1"
                    >
                      CANCEL
                    </Button>
                    <Button
                      onClick={handleRetakeConfirm}
                      className="bg-red-600 hover:bg-red-700 text-white font-mono flex-1 border border-red-700"
                      style={{ borderStyle: 'outset' }}
                    >
                      RETAKE
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </form>

        </div>
      </div>

    </div>
    </>
  );
};