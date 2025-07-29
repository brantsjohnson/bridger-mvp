import { useState } from 'react';
import QuizFlow from '@/components/QuizFlow';
import { LightLeakBackground } from '@/components/LightLeakBackground';
import '@/components/RetroStyles.css';

const Index = () => {
  return (
    <div className="min-h-screen retro-background relative overflow-hidden">
      <LightLeakBackground />
      <QuizFlow />
    </div>
  );
};

export default Index;
