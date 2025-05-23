export interface VoiceRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  language?: string;
}

let recognition: any = null;

export function isVoiceRecognitionSupported(): boolean {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

export function startVoiceRecognition(
  onResult: (transcript: string) => void,
  onError?: (error: string) => void,
  options: VoiceRecognitionOptions = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!isVoiceRecognitionSupported()) {
      const error = 'Speech recognition not supported in this browser';
      onError?.(error);
      reject(new Error(error));
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    recognition = new SpeechRecognition();

    recognition.continuous = options.continuous ?? false;
    recognition.interimResults = options.interimResults ?? false;
    recognition.lang = options.language ?? 'en-US';

    recognition.onstart = () => {
      console.log('Voice recognition started');
      resolve();
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      console.log('Voice recognition result:', transcript);
      onResult(transcript.trim());
    };

    recognition.onerror = (event: any) => {
      const error = `Voice recognition error: ${event.error}`;
      console.error(error);
      onError?.(error);
      reject(new Error(error));
    };

    recognition.onend = () => {
      console.log('Voice recognition ended');
      recognition = null;
    };

    try {
      recognition.start();
    } catch (error) {
      const errorMessage = 'Failed to start voice recognition';
      onError?.(errorMessage);
      reject(new Error(errorMessage));
    }
  });
}

export function stopVoiceRecognition(): void {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
}

export function textToSpeech(
  text: string,
  options: {
    rate?: number;
    pitch?: number;
    volume?: number;
    voice?: string;
  } = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Text-to-speech not supported in this browser'));
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    utterance.rate = options.rate ?? 0.8;
    utterance.pitch = options.pitch ?? 1;
    utterance.volume = options.volume ?? 1;

    if (options.voice) {
      const voices = speechSynthesis.getVoices();
      const selectedVoice = voices.find(voice => voice.name === options.voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onend = () => {
      console.log('Text-to-speech finished');
      resolve();
    };

    utterance.onerror = (event) => {
      console.error('Text-to-speech error:', event.error);
      reject(new Error(`Text-to-speech error: ${event.error}`));
    };

    speechSynthesis.speak(utterance);
  });
}

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  if (!('speechSynthesis' in window)) {
    return [];
  }
  return speechSynthesis.getVoices();
}

export function isSpeechSynthesisSupported(): boolean {
  return 'speechSynthesis' in window;
}

// Voice commands for navigation
export const VOICE_COMMANDS = {
  HOME: ['home', 'go home', 'home page', 'dashboard'],
  SUBJECTS: ['subjects', 'subject', 'lessons', 'courses'],
  AI_TUTOR: ['ai tutor', 'tutor', 'chat', 'ask professor', 'talk to tutor'],
  PROGRESS: ['progress', 'stats', 'statistics', 'my progress'],
  PROFILE: ['profile', 'settings', 'account', 'my profile'],
  HELP: ['help', 'what can you do', 'commands', 'voice commands'],
};

export function matchVoiceCommand(transcript: string): string | null {
  const lowerTranscript = transcript.toLowerCase();
  
  for (const [command, phrases] of Object.entries(VOICE_COMMANDS)) {
    if (phrases.some(phrase => lowerTranscript.includes(phrase))) {
      return command;
    }
  }
  
  return null;
}

// Accessibility helpers
export function announceToScreenReader(text: string): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = text;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

export function enableVoiceAccessibility(): void {
  // Add keyboard shortcuts for voice activation
  document.addEventListener('keydown', (event) => {
    // Ctrl/Cmd + Shift + V to activate voice assistant
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'V') {
      event.preventDefault();
      // Trigger voice assistant activation
      const voiceButton = document.querySelector('[data-voice-assistant]') as HTMLButtonElement;
      if (voiceButton) {
        voiceButton.click();
      }
    }
  });
}

// Initialize voice accessibility features
if (typeof window !== 'undefined') {
  enableVoiceAccessibility();
}
