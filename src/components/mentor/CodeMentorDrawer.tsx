import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MentorMessage, MentorMode } from '../../types';
import { INITIAL_MENTOR_MESSAGES } from '../../data/mockData';
import { CodeBlock } from '../code/CodeBlock';
import { CoseMascot } from '../common/CoseMascot';
import { 
  Sparkles, 
  X, 
  Send, 
  RotateCcw, 
  Lightbulb, 
  BookOpen
} from 'lucide-react';
import { soundFx } from '../../utils/sound';

interface CodeMentorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string | null;
  activeLanguage?: string;
  currentCodeContext?: string;
}

export const CodeMentorDrawer: React.FC<CodeMentorDrawerProps> = ({
  isOpen,
  onClose,
  initialPrompt,
  activeLanguage = 'python',
}) => {
  const [messages, setMessages] = useState<MentorMessage[]>(INITIAL_MENTOR_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState<MentorMode>('hint');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    { label: 'Indentation rules', text: 'Why is indentation so strict in Python?' },
    { label: 'Avoid infinite loops', text: 'How do I make sure my while loop terminates?' },
    { label: 'Small hint on my loop', text: 'Can you give me a small hint for the countdown exercise?' },
    { label: 'Real-world analogy', text: 'Give me a real-world analogy for conditional loops' },
    { label: '= vs == difference', text: 'Why does if x = 5 give a syntax error?' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    soundFx.playClick();
    const userMsg: MentorMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const q = query.toLowerCase();
      let responseText = "Great question! Remember that every programming concept clicks with practice. Let's break this down step-by-step.";
      let codeSnippet: string | undefined = undefined;

      if (q.includes('countdown') || q.includes('exercise') || q.includes('practice')) {
        responseText = "Here is your gentle nudge:\n1. Look closely at your starting number (`seconds = 5`).\n2. In a countdown, should the number get bigger or smaller each turn?\n3. What operation reduces a variable by 1? Make sure it's the last line inside your loop.";
      } else if (q.includes('indent') || q.includes('space') || q.includes('tab')) {
        responseText = "In Python, indentation defines which lines belong inside a code block. Always use 4 spaces consistently!";
        codeSnippet = `while count < 3:
    print("Inside loop")   # 4 spaces
print("Outside loop")      # 0 spaces`;
      } else if (q.includes('infinite') || q.includes('freeze')) {
        responseText = "To fix an infinite loop, ensure your loop variable is modified inside the block towards the exit condition!";
        codeSnippet = `count = 0
while count < 3:
    print(count)
    count += 1  # Crucial: moves count towards 3`;
      }

      const botMsg: MentorMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'mentor',
        text: responseText,
        codeSnippet,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      soundFx.playSuccess();
    }, 600);
  };

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="relative w-full max-w-md bg-white border-l-2 border-[#E5E5E5] h-full flex flex-col shadow-2xl z-10 select-none"
          >
            {/* Header */}
            <div className="p-4 border-b-2 border-[#E5E5E5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CoseMascot mood="happy" size="sm" />
                <div>
                  <h3 className="font-extrabold text-base text-[#3C3C3C]">
                    AI Code Mentor
                  </h3>
                  <p className="text-[11px] text-[#58A700] font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#58CC02] animate-pulse" />
                    Friendly Guidance
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMessages(INITIAL_MENTOR_MESSAGES)}
                  title="Reset Chat"
                  className="p-2 rounded-[12px] text-[#777777] hover:bg-[#F7F7F7] hover:text-[#3C3C3C] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-[12px] text-[#777777] hover:bg-[#F7F7F7] hover:text-[#3C3C3C] transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="p-3 bg-[#F7F7F7] border-b-2 border-[#E5E5E5] flex gap-2">
              <button
                onClick={() => setMode('hint')}
                className={`flex-1 py-1.5 px-3 rounded-[12px] text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'hint'
                    ? 'bg-[#DBF8C5] border-2 border-[#58CC02] text-[#58A700]'
                    : 'bg-white border-2 border-[#E5E5E5] text-[#777777]'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Nudge & Hints</span>
              </button>
              <button
                onClick={() => setMode('explanation')}
                className={`flex-1 py-1.5 px-3 rounded-[12px] text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  mode === 'explanation'
                    ? 'bg-[#EBF8FF] border-2 border-[#1CB0F6] text-[#1CB0F6]'
                    : 'bg-white border-2 border-[#E5E5E5] text-[#777777]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Deep Dive</span>
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isMentor = msg.sender === 'mentor';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMentor ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-[16px] text-xs sm:text-sm font-semibold leading-relaxed ${
                        isMentor
                          ? 'bg-[#F7F7F7] border-2 border-[#E5E5E5] text-[#3C3C3C]'
                          : 'bg-[#58CC02] text-white border-b-4 border-[#58A700]'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      {msg.codeSnippet && (
                        <div className="mt-2.5">
                          <CodeBlock
                            code={msg.codeSnippet}
                            language={activeLanguage}
                            showLineNumbers={false}
                          />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-[#AFAFAF] mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs font-bold text-[#1CB0F6] italic p-2 bg-[#F7F7F7] rounded-[12px] border border-[#E5E5E5] w-fit">
                  <span className="animate-spin">✦</span>
                  <span>Mentor is formulating a hint...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Quick Prompts */}
            <div className="p-2.5 bg-[#F7F7F7] border-t-2 border-[#E5E5E5] flex gap-1.5 overflow-x-auto scrollbar-none">
              {suggestedPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(p.text)}
                  className="px-2.5 py-1 rounded-full bg-white border border-[#E5E5E5] text-[11px] font-bold text-[#777777] hover:text-[#3C3C3C] hover:border-[#AFAFAF] whitespace-nowrap cursor-pointer shrink-0"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t-2 border-[#E5E5E5] bg-white flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask your mentor a question..."
                className="cose-input flex-1 text-xs sm:text-sm !py-2.5"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className="btn-primary !p-2.5 !rounded-[12px] disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
