'use client';

import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import { DefaultService } from '@/src/api';

import { Strategy as ApiStrategy } from '@/src/api/models/Strategy';

type Strategy = {
  protocol: string;
  activity: ApiStrategy['activity']; // Use the type from the API
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
  const [profileChanged, setProfileChanged] = useState(false); // New state for profile change
  const [updatedProfile, setUpdatedProfile] = useState(null); // State to store updated profile
  const [newStrategy, setNewStrategy] = useState<Strategy[] | null>(null); // State to store new strategy
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newUserMessage: ChatEntry = { role: 'user', message: input };
    setChatHistory((prev) => [...prev, newUserMessage]);
    setInput(''); // Clear the input field immediately after adding the message to the chat history
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

    console.log("AI data: ", data.new_strategy);
    console.log("AI updated profile: ", data.updated_profile);
    console.log("profile changed: ", data.profile_changed);

    if (data.profile_changed) {
      setProfileChanged(true); // Set profileChanged to true if profile has changed
      setUpdatedProfile(data.updated_profile); // Store updated profile
      setNewStrategy(data.new_strategy || null); // Store new strategy
      console.log("Please click the button to accept the changes.");

    }

    const aiResponse: ChatEntry = {
      role: 'ai',
      message: data.message,
      strategy: data.new_strategy || undefined,
    };

    setChatHistory((prev) => [...prev, aiResponse]);
    setLoading(false);
  };

  const handleAcceptProfileChanges = async () => {
    if (!updatedProfile || !newStrategy) {
      console.error('Invalid data:', { updatedProfile, newStrategy });
      alert('Updated profile or strategy is missing.');
      return;
    }
  
    // Validate and structure the payload
    const payload = {
      updated_profile: updatedProfile, // Ensure this matches the UserProfile schema
      new_strategy: newStrategy, // Ensure this is an array of Strategy objects
      user_confirmed: profileChanged, // Boolean value
    };
  
    console.log('Payload being sent:', payload);
  
    try {
      const res = await DefaultService.updateProfileAiAgentUpdateProfilePatch(payload);
      setProfileChanged(false); // Reset profileChanged state
      console.log('Profile updated successfully:', res);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [chatHistory]);

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

        <div
          ref={chatContainerRef}
          className="p-4 flex flex-col space-y-4 h-[calc(100%-120px)] overflow-y-auto scroll-smooth pb-20" // Added pb-20 for padding
        >
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
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition mb-2"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>

          {profileChanged && (
            <button
              onClick={handleAcceptProfileChanges}
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
            >
              Accept Profile Changes
            </button>
          )}
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
