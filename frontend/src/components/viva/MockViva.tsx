"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, ChevronRight, ChevronLeft, Flag, CheckCircle2, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  text: string;
  expectedAnswer: string;
  difficulty: string;
}

interface QuestionSet {
  id: string;
  title: string;
  questions: Question[];
}

interface AnswerState {
  text: string;
  isCorrect?: boolean;
  feedback?: string;
  isEvaluating?: boolean;
}

export function MockViva({ setId }: { setId: string }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes total
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({});
  const [questionSet, setQuestionSet] = useState<QuestionSet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:3001/viva/${setId}`)
      .then(res => res.json())
      .then(data => {
        setQuestionSet(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [setId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Stop speaking when unmounting
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (isLoading) return <div className="p-8 text-center">Loading Viva Session...</div>;
  if (!questionSet || !questionSet.questions.length) return <div className="p-8 text-center">Failed to load questions.</div>;

  const questions = questionSet.questions;
  const currentQuestion = questions[currentIdx];
  const currentAnswer = answers[currentQuestion.id] || { text: "" };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleFlag = () => {
    setFlagged(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id);
      } else {
        newSet.add(currentQuestion.id);
      }
      return newSet;
    });
  };

  const speakQuestion = () => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentQuestion.text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: {
        ...prev[currentQuestion.id],
        text: e.target.value
      }
    }));
  };

  const handleSubmit = async () => {
    if (!currentAnswer.text.trim()) return;

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: { ...prev[currentQuestion.id], isEvaluating: true }
    }));

    try {
      const res = await fetch("http://localhost:3001/viva/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: currentQuestion.id,
          studentAnswer: currentAnswer.text
        })
      });
      const data = await res.json();
      
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: {
          ...prev[currentQuestion.id],
          isEvaluating: false,
          isCorrect: data.isCorrect,
          feedback: data.feedback
        }
      }));
    } catch (err) {
      console.error(err);
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: {
          ...prev[currentQuestion.id],
          isEvaluating: false,
          feedback: "Failed to evaluate. Please try again."
        }
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Live Viva Practice</h2>
          <p className="text-muted-foreground">{questionSet.title}</p>
        </div>
        <div className="flex items-center space-x-4 bg-card px-4 py-2 rounded-full border border-border/50 shadow-sm">
          <span className="font-mono text-xl font-medium tracking-wider text-primary">
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-6">
          <Card className="flex flex-col relative overflow-hidden border-primary/20">
            <div className="absolute top-0 left-0 w-full h-1 bg-muted">
              <div 
                className="h-full bg-primary transition-all duration-300" 
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>
            
            <CardContent className="flex-1 p-8 flex flex-col items-center text-center">
              <span className="absolute top-4 right-4 text-xs font-medium px-2.5 py-0.5 rounded-full bg-secondary/20 text-secondary">
                {currentQuestion.difficulty}
              </span>
              <p className="text-sm text-muted-foreground mb-4 font-medium uppercase tracking-wider mt-4">Question {currentIdx + 1} of {questions.length}</p>
              <h3 className="text-2xl md:text-3xl font-semibold leading-relaxed mb-6">
                {currentQuestion.text}
              </h3>
              
              <div className="w-full text-left space-y-4">
                <textarea 
                  className="w-full min-h-[150px] p-4 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:outline-none resize-none"
                  placeholder="Type your answer here..."
                  value={currentAnswer.text}
                  onChange={handleTextChange}
                  disabled={currentAnswer.isEvaluating || currentAnswer.feedback !== undefined}
                />
                
                {!currentAnswer.feedback && (
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handleSubmit} 
                    disabled={!currentAnswer.text.trim() || currentAnswer.isEvaluating}
                  >
                    {currentAnswer.isEvaluating ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Evaluating...</>
                    ) : (
                      <><Send className="mr-2 h-4 w-4" /> Submit Answer</>
                    )}
                  </Button>
                )}
                
                {currentAnswer.feedback && (
                  <div className={cn(
                    "p-4 rounded-xl border",
                    currentAnswer.isCorrect ? "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400" : "bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-400"
                  )}>
                    <div className="flex items-center mb-2">
                      <CheckCircle2 className="w-5 h-5 mr-2" />
                      <span className="font-semibold">{currentAnswer.isCorrect ? "Correct!" : "Needs Improvement"}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{currentAnswer.feedback}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center bg-card p-4 rounded-xl border border-border/50 shadow-sm">
            <Button variant="outline" onClick={handlePrev} disabled={currentIdx === 0}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button variant="outline" onClick={handleNext} disabled={currentIdx === questions.length - 1}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 text-primary" />
                Progress
              </h4>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, i) => {
                  const qAns = answers[q.id];
                  const isDone = qAns && qAns.feedback !== undefined;
                  
                  return (
                    <button 
                      key={q.id}
                      onClick={() => setCurrentIdx(i)}
                      className={cn(
                        "w-full aspect-square flex items-center justify-center rounded-md text-sm font-medium transition-colors border relative",
                        i === currentIdx ? "bg-primary text-primary-foreground border-primary" :
                        isDone ? (qAns.isCorrect ? "bg-green-500/20 border-green-500/30 text-green-500" : "bg-red-500/20 border-red-500/30 text-red-500") :
                        flagged.has(q.id) ? "bg-orange-500/20 border-orange-500/30 text-orange-500" :
                        "bg-muted/50 border-transparent hover:border-border text-muted-foreground"
                      )}
                    >
                      {i + 1}
                      {flagged.has(q.id) && !isDone && i !== currentIdx && (
                        <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-orange-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-4">
               <Button 
                 variant="secondary" 
                 className="w-full justify-start"
                 onClick={speakQuestion}
               >
                 <Volume2 className={cn("w-4 h-4 mr-2", isSpeaking && "text-primary animate-pulse")} />
                 {isSpeaking ? "Speaking..." : "Hear Question"}
               </Button>
               <Button 
                 variant="outline" 
                 className={cn("w-full justify-start", flagged.has(currentQuestion.id) ? "text-orange-500 border-orange-200 bg-orange-500/10" : "text-muted-foreground")}
                 onClick={toggleFlag}
               >
                 <Flag className={cn("w-4 h-4 mr-2", flagged.has(currentQuestion.id) && "fill-orange-500")} />
                 {flagged.has(currentQuestion.id) ? "Flagged" : "Flag for Review"}
               </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
