'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { DefaultService } from '@/src/api';

type Strategy = {
  protocol: string;
  activity: string;
  token: string;
  allocation_percent: number;
  expected_apy: number;
  estimated_return: number;
  risk_level: string;
  why: string;
};

type ChatEntry = {
  role: 'user' | 'ai';
  message: string;
  strategy?: Strategy[];
};

type SidebarChatProps = {
  profile: {
    experience_level: string;
    investment_amount: number;
    investment_currency: string;
    investment_goals: string[];
    investment_horizon: string;
    preferred_activities: string[];
    risk_tolerance: string;
  };
  userId: string | null;
};

export default function SidebarChat({ profile, userId }: SidebarChatProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newUserMessage: ChatEntry = { role: 'user', message: input };
    setChatHistory((prev) => [...prev, newUserMessage]);
    setLoading(true);

    
    const userProfile = {
      user_id: userId,
      ...profile,
    };
    
    console.log("userProfile", userProfile);
    const res = await DefaultService.handleMessageAiAgentMessagePost({
      user_profile: userProfile,
      user_message: input,
    });

    const data = await res;

    const aiResponse: ChatEntry = {
      role: 'ai',
      message: data.message,
      strategy: data.new_strategy || undefined,
    };

    setChatHistory((prev) => [...prev, aiResponse]);
    setInput('');
    setLoading(false);
  };

  const renderStrategyCard = (strategy: Strategy) => (
    <div
      key={strategy.protocol + strategy.token}
      className="bg-zinc-800 p-4 rounded-md shadow-md text-sm space-y-2 border border-zinc-700"
    >
      <div className="text-lg font-semibold">{strategy.protocol}</div>
      <div className="text-zinc-400">{strategy.activity} — {strategy.token}</div>
      <div className="flex justify-between text-sm">
        <span>APY: <strong>{strategy.expected_apy}%</strong></span>
        <span>Risk: <strong>{strategy.risk_level}</strong></span>
      </div>
      <div className="text-sm">Est. Return: <strong>{strategy.estimated_return}</strong></div>
      <div className="text-xs text-zinc-300 italic">Why: {strategy.why}</div>
    </div>
  );

  return (
    <>
      <div className={clsx(
        "fixed right-0 top-0 h-full w-[420px] bg-zinc-900 text-white transform transition-transform duration-300 shadow-2xl z-40",
        open ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-4 border-b border-zinc-700 flex justify-between items-center">
          <h2 className="text-xl font-bold">DeFi AI Assistant</h2>
          <button onClick={() => setOpen(false)} className="text-lg">×</button>
        </div>

        <div className="p-4 flex flex-col space-y-4 h-[calc(100%-120px)] overflow-y-auto">
          {chatHistory.map((chat, index) => (
            <div key={index} className={clsx(
              "flex flex-col",
              chat.role === 'user' ? 'items-end' : 'items-start'
            )}>
              <div className={clsx(
                "max-w-xs px-4 py-2 rounded-lg",
                chat.role === 'user' ? 'bg-blue-600' : 'bg-zinc-800'
              )}>
                {chat.message}
              </div>

              {chat.strategy && (
                <div className="grid grid-cols-1 gap-3 mt-2 w-full">
                  {chat.strategy.map(renderStrategyCard)}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="text-zinc-500 text-sm animate-pulse">Thinking...</div>
          )}
        </div>

        <div className="p-4 border-t border-zinc-700 fixed bottom-0 w-[420px] bg-zinc-900">
          <input
            type="text"
            className="w-full p-2 bg-zinc-800 rounded-md mb-2"
            placeholder="Ask the AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition z-50 w-14 h-14 flex items-center justify-center"
      >
        {open ? '✕' : 'AI'}
      </button>
    </>
  );
}
