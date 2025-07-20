import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '../../../../shared/lib/authContext';

interface LoginScreenProps {
  onSwitchToSignup: () => void;
  onSkip: () => void;
}

export const LoginScreen = ({ onSwitchToSignup, onSkip }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const { toast } = useToast();
  const { signIn } = useAuth();

  // Check if user just confirmed their email
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = urlParams.get('access_token');
    
    if (accessToken) {
      setEmailConfirmed(true);
      toast({
        title: "Email Confirmed!",
        description: "Your email has been confirmed. You can now log in.",
      });
    }
  }, [toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    console.log('Attempting login with:', { email, password: '***' });
    
    try {
      const user = await signIn(email, password);
      console.log('Login successful, user:', user);
      
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      
      // Send message to parent to navigate to core app with user data
      if (window.parent && window.parent !== window) {
        const userData = {
          id: user?.id,
          email: user?.email,
          name: user?.user_metadata?.full_name || user?.email
        };
        console.log('Sending user data to parent:', userData);
        window.parent.postMessage({ 
          type: 'NAVIGATE_TO_CORE_WITH_USER',
          userData
        }, '*');
      }
      
      // Fallback to demo mode if message doesn't work
      setTimeout(() => {
        onSkip();
      }, 1000);
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
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
      `}</style>
      <div 
        className="h-screen flex items-center justify-center relative overflow-hidden"
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

      {/* Login Window */}
      <div className="win2k-window p-0 w-full max-w-md mx-4 relative z-10">
        {/* Title Bar */}
        <div className="bg-[hsl(var(--win2k-blue))] text-white px-2 py-1 text-sm font-bold">
          <span>BRIDGER_LOGIN_v2.0</span>
        </div>

        {/* Window Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <img 
              src="/lovable-uploads/a20ad01f-e9b2-470e-8d19-deee95fb9923.png" 
              alt="Bridger" 
              className="mx-auto mb-2 max-w-full h-auto"
            />
            <p className="text-[hsl(var(--win2k-text))] font-bold text-lg" style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}>
              Welcome! Let's fix society.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-[hsl(var(--win2k-text))] font-bold">
                EMAIL_ADDRESS:
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="win2k-input mt-1"
                placeholder="user@domain.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-[hsl(var(--win2k-text))] font-bold">
                PASSWORD:
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="win2k-input mt-1"
                placeholder="Enter password..."
                required
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                type="submit" 
                className="win2k-button flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!email.trim() || !password.trim() || loading}
              >
                {loading ? "CONNECTING..." : "CONNECT"}
              </Button>
            </div>
          </form>

          <div className="text-center mt-4 space-y-2">
            <button
              onClick={onSwitchToSignup}
              className="text-[hsl(var(--win2k-blue))] hover:underline text-sm block w-full"
              style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              New? Create an account
            </button>
            <button
              onClick={onSkip}
              className="text-[hsl(var(--hacker-green))] hover:underline text-sm block w-full"
              style={{ fontFamily: 'Impact, Arial Black, sans-serif' }}
            >
              Skip Authentication (Demo Mode)
            </button>
          </div>

          {/* Terminal footer */}
          <div className="text-center mt-6 pt-4 border-t border-[hsl(var(--win2k-border))]">
            <div className="text-[hsl(var(--hacker-green))] font-mono text-xs p-1 bg-black border border-[hsl(var(--hacker-border))]">
              BRIDGER_SYSTEM_v2.0 © 2000 - SECURE_LOGIN_READY
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};