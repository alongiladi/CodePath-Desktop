import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MentorMessage, MentorMode } from '../../types';
import { INITIAL_MENTOR_MESSAGES } from '../../data/mockData';
import { 
  Sparkles, 
  X, 
  Send, 
  RotateCcw, 
  Lightbulb, 
  BookOpen, 
  Bot, 
  User, 
  HelpCircle,
  Copy,
  Check
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
  currentCodeContext,
}) => {
  const [messages, setMessages] = useState<MentorMessage[]>(INITIAL_MENTOR_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [mode, setMode] = useState<MentorMode>('hint');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested quick prompts
  const suggestedPrompts = [
    { label: 'Indentation rules', text: 'Why is indentation so strict in Python?' },
    { label: 'Avoid infinite loops', text: 'How do I make sure my while loop terminates?' },
    { label: 'Small hint on my loop', text: 'Can you give me a small hint for the countdown exercise?' },
    { label: 'Real-world analogy', text: 'Give me a real-world analogy for conditional loops' },
    { label: '= vs == difference', text: 'Why does if x = 5 give a syntax error?' },
  ];

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isTyping]);

  // Handle incoming initial prompt
  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    soundFx.playClick();
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  const handleResetChat = () => {
    soundFx.playClick();
    setMessages(INITIAL_MENTOR_MESSAGES);
  };

  const generateMentorResponse = (query: string, currentMode: MentorMode): { text: string; codeSnippet?: string } => {
    const q = query.toLowerCase();

    // Mode-specific tone adjustments
    const isHint = currentMode === 'hint';

    if (q.includes('countdown') || q.includes('exercise') || q.includes('practice')) {
      if (isHint) {
        return {
          text: "Here is your gentle nudge:\n1. Look closely at your starting number (`seconds = 5`).\n2. In a countdown, should the number get bigger or smaller each turn?\n3. What operation reduces a variable by 1? Try to make sure it's the very last line inside your loop.",
        };
      } else {
        return {
          text: "Here is a detailed breakdown of a countdown loop:\nA while loop checks a test condition before each run. When `seconds = 5`, `while seconds > 0:` evaluates to True.\nInside, you print the message, and then subtract 1 using `seconds -= 1`. On the 5th iteration, `seconds` reaches 0, which makes `0 > 0` False, safely ending the loop and moving to the code below it!",
          codeSnippet: `seconds = 5
while seconds > 0:
    print(f"T-minus {seconds}")
    seconds -= 1  # Decrements by 1 every step
print("Blast off!")`,
        };
      }
    }

    if (q.includes('indent') || q.includes('space') || q.includes('tab')) {
      if (isHint) {
        return {
          text: "Guiding tip: In Python, whitespace isn't just decoration! Every line that belongs inside a loop must be pushed 4 spaces to the right. When you return to the left margin, Python knows the loop has ended.",
        };
      } else {
        return {
          text: "Detailed explanation: Unlike C++, Java, or JavaScript which use curly braces `{ }` to define code blocks, Python uses indentation. Standard convention is exactly 4 spaces per block. If you mix tabs and spaces or forget to indent after a colon `:`, Python raises an `IndentationError`.",
          codeSnippet: `# Correct indentation:
while count < 3:
    print("Inside loop")   # 4 spaces
print("Outside loop")      # 0 spaces`,
        };
      }
    }

    if (q.includes('infinite') || q.includes('freeze') || q.includes('never stop')) {
      if (isHint) {
        return {
          text: "To fix an infinite loop, ask yourself: *'What variable does my loop check?'* and *'Does any line inside the loop push that variable closer to the stopping point?'*",
        };
      } else {
        return {
          text: "An infinite loop occurs when the loop condition evaluates to True on every cycle forever. To ensure it terminates:\n1. Ensure the loop condition variable is modified inside the block.\n2. Ensure the change moves towards the exit threshold (e.g. `count += 1` if checking `count < 10`).\n3. You can also use a safeguard `break` statement if an unexpected state occurs.",
          codeSnippet: `# Safe loop that terminates after 3 cycles:
count = 0
while count < 3:
    print(count)
    count += 1  # Crucial: drives count toward 3`,
        };
      }
    }

    if (q.includes('analogy') || q.includes('real world') || q.includes('like')) {
      return {
        text: "Here is an everyday analogy: Imagine doing push-ups at the gym. Your personal trainer says:\n*'While your reps are under 10, do another push-up, and count up by one.'*\n\nEach time you finish a push-up, your rep count increases. When you reach 10, the trainer says 'Done!' and you move to the next workout. That's a `while` loop!",
      };
    }

    if (q.includes('=') && (q.includes('==') || q.includes('syntax'))) {
      if (isHint) {
        return {
          text: "Quick hint: A single `=` sets a value (`x = 5`), while a double `==` tests whether values are equal (`x == 5`). Which one belongs in an `if` or `while` statement?",
        };
      } else {
        return {
          text: "The difference between `=` and `==` is one of the most common beginner gotchas:\n- `=` is the **Assignment Operator**: It places the value on the right into the variable on the left.\n- `==` is the **Equality Comparison Operator**: It inspects both sides and returns `True` if equal or `False` if not.\n\nInside `if` and `while` conditions, you always want `==`, `<`, `>`, or `!=`.",
          codeSnippet: `# Setting value:
speed = 50

# Testing value:
if speed == 50:
    print("Cruising at optimal speed!")`,
        };
      }
    }

    // Default beginner-friendly guidance
    if (isHint) {
      return {
        text: `I hear you! When thinking about this in ${activeLanguage}: try breaking the problem into the smallest possible step. What is the very first thing your code needs to remember or test? What should change on each step?`,
      };
    } else {
      return {
        text: `Here is a foundational way to approach this: Programming is just giving a recipe to the computer. For any condition or loop, identify:\n1. **Starting State** (variables initialized before the block)\n2. **The Test** (what must be True to continue?)\n3. **The Action** (what work happens inside?)\n4. **The Transition** (how does the state change so it eventually finishes?)`,
      };
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content) return;

    soundFx.playClick();
    const userMsg: MentorMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Simulate natural AI thinking delay
    setTimeout(() => {
      const response = generateMentorResponse(content, mode);
      const mentorMsg: MentorMessage = {
        id: 'msg-m-' + Date.now(),
        sender: 'mentor',
        text: response.text,
        codeSnippet: response.codeSnippet,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode,
      };

      setMessages((prev) => [...prev, mentorMsg]);
      setIsTyping(false);
      soundFx.playClick();
    }, 750);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="code-mentor-overlay" className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            aria-hidden="true"
          />

          {/* Slide-over panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            id="code-mentor-panel"
            className="relative w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full z-10"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Code Mentor</h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      Active Guide
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Gentle hints & beginner-friendly explanations
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  id="reset-mentor-chat-btn"
                  onClick={handleResetChat}
                  title="Reset conversation"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  id="close-mentor-panel-btn"
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Close Code Mentor"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Assistance Mode Toggle Bar */}
            <div className="px-4 py-2.5 bg-slate-100/70 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-600 dark:text-slate-400">Guidance Mode:</span>
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                <button
                  id="mentor-mode-hint"
                  onClick={() => {
                    soundFx.playClick();
                    setMode('hint');
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all ${
                    mode === 'hint'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Small Hint</span>
                </button>
                <button
                  id="mentor-mode-explanation"
                  onClick={() => {
                    soundFx.playClick();
                    setMode('explanation');
                  }}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-all ${
                    mode === 'explanation'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Deep Dive</span>
                </button>
              </div>
            </div>

            {/* Chat Message Stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isUser && (
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                        isUser
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700/80'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>

                      {/* Code Snippet if provided */}
                      {msg.codeSnippet && (
                        <div className="mt-2.5 rounded-lg bg-slate-950 text-slate-100 border border-slate-800 overflow-hidden font-mono text-xs">
                          <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-900/90 border-b border-slate-800 text-[10px] text-slate-400">
                            <span>Python example</span>
                            <button
                              onClick={() => handleCopyCode(msg.id, msg.codeSnippet!)}
                              className="flex items-center gap-1 hover:text-white transition-colors"
                            >
                              {copiedSnippetId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-400" />
                                  <span className="text-emerald-400">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <pre className="p-2.5 overflow-x-auto text-emerald-300">
                            <code>{msg.codeSnippet}</code>
                          </pre>
                        </div>
                      )}

                      <div
                        className={`text-[10px] mt-1.5 text-right font-medium ${
                          isUser ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>

                    {isUser && (
                      <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex gap-3 items-center text-xs text-slate-400">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex gap-1 items-center bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Pills */}
            <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Suggested topics:</span>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {suggestedPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(p.text)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-indigo-400 dark:hover:border-indigo-500 text-xs font-medium transition-colors shrink-0 shadow-2xs"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  id="mentor-input-field"
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Ask a question in ${mode === 'hint' ? 'Hint' : 'Explanation'} mode...`}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                />
                <button
                  id="mentor-send-btn"
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white transition-all shrink-0 shadow-sm"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
