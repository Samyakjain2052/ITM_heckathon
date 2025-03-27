
import React, { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Volume2, VolumeX } from 'lucide-react';

interface VoiceGuidanceProps {
  hindiPrompt: string;
  englishPrompt: string;
  autoPlay?: boolean;
}

const VoiceGuidance: React.FC<VoiceGuidanceProps> = ({ 
  hindiPrompt, 
  englishPrompt, 
  autoPlay = true 
}) => {
  const { language } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [muted, setMuted] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // In a real implementation, this would use a proper TTS service
  const playVoicePrompt = () => {
    const prompt = language === 'hindi' ? hindiPrompt : englishPrompt;
    console.log(`Playing voice prompt: ${prompt}`);
    
    // In a real implementation:
    // 1. Convert text to speech using a service like Google TTS or Eleven Labs
    // 2. Play the returned audio
    
    if (audioRef.current && audioInitialized) {
      // Only play if user has interacted with the page
      audioRef.current.play().catch(error => {
        console.error("Audio playback failed:", error);
      });
    }
  };

  // Initialize audio after user interaction
  const initializeAudio = () => {
    if (!audioInitialized && audioRef.current) {
      // Create a short silent audio buffer for initialization
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      audioContext.resume().then(() => {
        setAudioInitialized(true);
        if (autoPlay) {
          playVoicePrompt();
        }
      }).catch(err => {
        console.error("Failed to initialize audio:", err);
      });
    }
  };

  const toggleMute = () => {
    setMuted(prev => !prev);
    if (audioRef.current) {
      audioRef.current.muted = !muted;
    }
  };

  useEffect(() => {
    // We need to wait for user interaction before playing audio
    // Add event listeners to detect user interaction
    const handleUserInteraction = () => {
      initializeAudio();
      // Remove event listeners after initialization
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    if (audioInitialized && autoPlay) {
      // Play voice guidance when language changes or component remounts
      playVoicePrompt();
    }
  }, [language, audioInitialized]);

  return (
    <div className="voice-guidance">
      {/* This audio element would play the TTS in a real implementation */}
      <audio ref={audioRef} className="hidden">
        <source src="data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAASAAAeMwAUFBQUFCIiIiIiIjAwMDAwMD4+Pj4+PkxMTExMTFpaWlpaWmhoaGhoaHZ2dnZ2doSEhISEhJKSkpKSkqCgoKCgoK6urq6urrKysrKysr6+vr6+vsbGxsbGxtLS0tLS0tra2tra2uLi4uLi4urq6urq6vLy8vLy8v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/pAAAABQdXhheWkAA8OePLi31XXjarrE9n7haBXAB//7cZAAOPAf4CQA/gXBzhv2H3c/+cP/82P/9P/33r/t5PqP12b6G8vd11tRdXt7d3t3d3e3t5PBHyQiEIRD0QiIQhEPT//7kmQRgAQ9NFV/YngIeIxn+9vAQ8xDVXdieCh6jGf728BDwAA8AeHkPJBH/oEP8nsUOQ9//2KG//Qzw4EWV37d7a12wQhEIQiIiIRAAAAAA8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PDw8PD//////////////////////////////////////////////////LQZAeAcudBVlULgBEIABpwoAABLMAUOUxOAEQAAGnAAAAA////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==" 
          type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      
      <button 
        onClick={muted ? toggleMute : playVoicePrompt}
        className="flex items-center justify-center p-3 rounded-full bg-kiosk-blue bg-opacity-10 hover:bg-opacity-20 transition-all"
        aria-label={language === 'hindi' ? "आवाज़ सुनें" : "Listen to voice prompt"}
      >
        {muted ? (
          <VolumeX size={32} />
        ) : (
          <Volume2 size={32} />
        )}
      </button>
    </div>
  );
};

export default VoiceGuidance;
