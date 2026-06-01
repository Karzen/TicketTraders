import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Users, Send, MessageCircle, Sparkles, CheckCheck, Smile } from 'lucide-react';
import { BottomSheet } from '../components/BottomSheet';
import { Ripple } from '../components/Ripple';

export const Community: React.FC = () => {
  const { feedActivities, messages, users, currentUser, sendMessage, navigate } = useApp();

  
  // Track active chat friend and sheet state
  const [chatFriendId, setChatFriendId] = useState<number | null>(null);
  const [typedMessage, setTypedMessage] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const activeFriend = users.find(u => u.id === chatFriendId);

  // Get active user's friends list
  const userFriends = useMemo(() => {
    if (!currentUser) return [];
    return users.filter(u => currentUser.friendIds.includes(u.id));
  }, [users, currentUser]);

  // Messages between active user and selected friend
  const activeChatMessages = useMemo(() => {
    if (!currentUser || !chatFriendId) return [];
    return messages
      .filter(m => 
        (m.senderId === currentUser.id && m.recipientId === chatFriendId) ||
        (m.senderId === chatFriendId && m.recipientId === currentUser.id)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messages, currentUser, chatFriendId]);

  // Scroll chat drawer to bottom on new messages
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [activeChatMessages, chatFriendId]);

  const handleSend = () => {
    if (!typedMessage.trim() || !currentUser || !chatFriendId) return;
    
    // 1. Send the user's message
    sendMessage(chatFriendId, typedMessage);
    const sentText = typedMessage;
    setTypedMessage('');

    // 2. Queue an automatic smart response from the friend to simulate live chat
    setTimeout(() => {
      let responseText = "That sounds awesome! Let me look at the tickets.";
      
      const lower = sentText.toLowerCase();
      if (lower.includes('neon') || lower.includes('horizon')) {
        responseText = "Yes! I bought the Standard ticket. We should totally go together!";
      } else if (lower.includes('food') || lower.includes('jazz')) {
        responseText = "Oh the food trucks look amazing! Brisket is calling my name. Let's do Standard entry!";
      } else if (lower.includes('free') || lower.includes('hackathon')) {
        responseText = "CodeCraft hackathon? I'm totally down, let's form a team!";
      } else if (lower.includes('buy') || lower.includes('ticket')) {
        responseText = "Done! I just bought mine too. It already shows up in my active tickets!";
      }

      sendMessage(currentUser.id, responseText);
    }, 1800);
  };

  const getActionVerb = (type: 'going' | 'interested' | 'promoted') => {
    switch (type) {
      case 'going': return 'is going to';
      case 'interested': return 'is interested in';
      case 'promoted': return 'promoted the event';
      default: return 'is exploring';
    }
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-4 pb-24 bg-background relative overflow-hidden fade-in">
      {/* Decorative background gradients */}
      <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] rounded-full bg-primary/5 blur-[85px] pointer-events-none" />

      {/* Friends list scroll row */}
      <div className="shrink-0 flex flex-col gap-2.5 mb-5 relative z-10">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-textColor-secondary">
          Active Circles
        </h3>
        
        <div className="flex gap-4 overflow-x-auto no-scrollbar py-1">
          {userFriends.map((friend) => (
            <button
              key={friend.id}
              onClick={() => setChatFriendId(friend.id)}
              className="flex flex-col items-center gap-1.5 focus:outline-none shrink-0"
            >
              {/* Profile Avatar with online status */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-surface-outline bg-surface-variant flex items-center justify-center p-0.5 shadow-sm hover:scale-102 transition-transform">
                  <img
                    src={friend.profileImage}
                    alt={friend.fullName}
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
                {/* Glowing Online Status Indicator dot */}
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background animate-pulse" />
              </div>
              <span className="text-[10px] font-semibold text-textColor-primary max-w-[50px] truncate text-center">
                {friend.fullName.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Friend activity feed list */}
      <div className="flex-1 flex flex-col gap-3.5 min-h-0 relative z-10">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-textColor-secondary flex items-center gap-1">
          <MessageCircle className="w-4 h-4 text-primary" />
          <span>Friends Activity Feed</span>
        </h3>

        <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3">
          {feedActivities.map((act) => (
            <div
              key={act.id}
              className="p-4 rounded-m3-lg border border-surface-outline bg-surface flex gap-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={act.friendAvatar}
                alt={act.friendName}
                className="w-10 h-10 rounded-full object-cover shrink-0 border border-surface-outline bg-surface-variant"
              />
              <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-between">
                <div className="text-xs text-textColor-primary leading-tight">
                  <span className="font-extrabold">{act.friendName}</span>{' '}
                  <span className="text-textColor-secondary">{getActionVerb(act.actionType)}</span>{' '}
                  <span className="font-bold text-primary hover:underline cursor-pointer" onClick={() => navigate('EventDetails', { eventId: act.eventId })}>
                    {act.eventName}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[9px] text-textColor-secondary mt-1.5 font-medium uppercase tracking-wider">
                  <span>{act.timestamp}</span>
                  <button
                    onClick={() => setChatFriendId(act.friendId)}
                    className="flex items-center gap-1 text-secondary hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Coordinate</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Private Messages Bottom Sheet Drawer */}
      <BottomSheet
        isOpen={chatFriendId !== null}
        onClose={() => setChatFriendId(null)}
        title={activeFriend ? `Chat with ${activeFriend.fullName.split(' ')[0]}` : 'Direct Messaging'}
        maxHeight="h-[80vh]"
      >
        <div className="flex flex-col h-[60vh] text-textColor-primary">
          {/* Scrollable messages container */}
          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto no-scrollbar p-1 flex flex-col gap-3"
          >
            {activeChatMessages.map((msg) => {
              const isMe = msg.senderId === currentUser?.id;
              
              return (
                <div
                  key={msg.id}
                  className={`max-w-[75%] rounded-m3-lg p-3 text-xs leading-relaxed ${
                    isMe
                      ? 'self-end bg-secondary text-white rounded-tr-none'
                      : 'self-start bg-surface-variant border border-surface-outline/50 text-textColor-primary rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div className="flex justify-end items-center gap-1 mt-1 text-[8px] opacity-75 font-mono">
                    <span>
                      {new Date(msg.timestamp).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                      })}
                    </span>
                    {isMe && <CheckCheck className="w-3 h-3 text-white" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Typing drawer form */}
          <div className="pt-3 border-t border-surface-outline/50 flex gap-2 items-center bg-surface shrink-0">
            <button className="p-2 rounded-full text-textColor-secondary hover:text-textColor-primary hover:bg-surface-variant transition-colors">
              <Smile className="w-5.5 h-5.5" />
            </button>
            <input
              type="text"
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Send coordinate message..."
              className="flex-1 h-11 px-4 rounded-m3-full bg-surface-variant border border-surface-outline focus:outline-none focus:border-secondary text-textColor-primary text-xs transition-colors"
            />
            <Ripple className="rounded-full overflow-hidden shrink-0">
              <button
                onClick={handleSend}
                className="w-11 h-11 bg-secondary text-white rounded-full flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </Ripple>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};
