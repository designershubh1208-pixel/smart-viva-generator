'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Send } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { API_URL } from '@/config';

interface VivaMessage {
  id: string;
  role: 'SYSTEM' | 'EXAMINER' | 'STUDENT';
  content: string;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
}

export function VivaChat({ userId, subjectId }: { userId: string; subjectId?: string }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<VivaMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const recognitionRef = useRef<any>(null);
  const thinkingStartTime = useRef<number>(Date.now());

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(prev => {
          // A bit hacky, but avoids overwriting manual input completely if needed
          // Realistically, you want to manage interim vs final results better.
          return transcript; 
        });
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInput('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      // Try to find a good English voice
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.includes('en-US') && v.name.includes('Google')) || voices[0];
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startSession = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/viva/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, subjectId })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to start session');
      }
      setSessionId(data.id);
      
      // Get the first question
      await sendMessage(data.id, ''); 
    } catch (error) {
      console.error('Failed to start session', error);
    }
    setLoading(false);
  };

  const sendMessage = async (currentSessionId: string, message: string) => {
    setLoading(true);
    const thinkingTimeMs = Date.now() - thinkingStartTime.current;
    
    // Optimistic UI for user message
    if (message) {
      setMessages(prev => [...prev, { id: 'temp', role: 'STUDENT', content: message }]);
    }
    setInput('');

    try {
      const res = await fetch(`${API_URL}/viva/${currentSessionId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, thinkingTimeMs })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to process message');
      }
      
      setMessages(data.session.messages);
      setIsCompleted(data.isComplete);
      
      // Speak the latest EXAMINER message
      const latestMessage = data.latestMessage;
      if (latestMessage && latestMessage.role === 'EXAMINER') {
        speakText(latestMessage.content);
      }
      
      thinkingStartTime.current = Date.now(); // Reset thinking time
    } catch (error) {
      console.error('Error sending message', error);
    }
    setLoading(false);
  };

  if (!sessionId) {
    return (
      <div className="flex justify-center items-center h-64">
        <Button onClick={startSession} size="lg">Start AI Examiner Mode</Button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl">
      <CardHeader className="bg-primary/5 border-b">
        <CardTitle className="flex justify-between items-center">
          <span>AI Examiner</span>
          {isCompleted && <Badge variant="default">Completed</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto pr-2">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'STUDENT' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-xl ${
                m.role === 'STUDENT' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted border'
              }`}>
                {m.role === 'EXAMINER' && m.difficulty && (
                  <Badge variant="outline" className="mb-2 text-xs font-semibold">
                    {m.difficulty}
                  </Badge>
                )}
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted p-4 rounded-xl animate-pulse">Examiner is typing...</div>
            </div>
          )}
        </div>

        {!isCompleted && (
          <div className="flex gap-2 items-end">
            <Button 
              type="button" 
              variant={isListening ? 'destructive' : 'secondary'} 
              size="icon"
              className="h-[52px] w-[52px] shrink-0 rounded-full"
              onClick={toggleListening}
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            
            <Textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your answer or use voice..."
              className="min-h-[52px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim()) sendMessage(sessionId, input);
                }
              }}
            />
            
            <Button 
              disabled={!input.trim() || loading} 
              onClick={() => sendMessage(sessionId, input)}
              size="icon"
              className="h-[52px] w-[52px] shrink-0 rounded-full"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
