
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Users, Share, Hand, Smile, Send, LayoutGrid, Maximize2, MoreVertical } from 'lucide-react';
import { User, UserRole } from '@/types';
import clsx from 'clsx';

interface LiveClassroomProps {
  title: string;
  instructor: string;
  userRole: UserRole;
  onEndCall: () => void;
}

interface LiveMessage {
  id: string;
  user: string;
  text: string;
  time: string;
}

const LiveClassroom: React.FC<LiveClassroomProps> = ({ title, instructor, userRole, onEndCall }) => {
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [chatInput, setChatInput] = useState('');
  const [participants, setParticipants] = useState(142);
  const [chatMessages, setChatMessages] = useState<LiveMessage[]>([
    { id: '1', user: 'Selin Y.', text: 'Hocam sesiniz gelmiyor.', time: '14:02' },
    { id: '2', user: 'Moderatör', text: 'Lütfen herkes mikrofonunu kontrol etsin.', time: '14:03' },
    { id: '3', user: 'Mehmet T.', text: 'Şimdi düzeldi, teşekkürler.', time: '14:03' },
  ]);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMessage: LiveMessage = {
      id: Date.now().toString(),
      user: 'Siz',
      text: chatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages([...chatMessages, newMessage]);
    setChatInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 ring-1 ring-black/50">
      {/* Header */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 px-4 py-3 flex justify-between items-center shrink-0 border-b border-slate-700/50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-md">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
            <span className="text-red-400 text-[10px] font-bold tracking-wider">CANLI</span>
          </div>
          <div>
            <h2 className="text-white font-bold text-sm md:text-base tracking-tight">{title}</h2>
            <p className="text-slate-400 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
              {instructor}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-slate-800/50 border border-slate-700 px-3 py-1.5 rounded-full">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-200 font-medium">{participants}</span>
          </div>
          <div className="text-slate-500 text-xs font-mono bg-black/20 px-2 py-1 rounded">00:14:25</div>
          <button className="text-slate-400 hover:text-white p-1"><MoreVertical className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Main Stage */}
      <div className="flex-1 flex overflow-hidden relative bg-slate-950">
        {/* Video Grid */}
        <div className="flex-1 relative flex items-center justify-center p-4 lg:p-6">

          {/* Main Broadcast Feed */}
          <div className="relative w-full h-full max-h-[700px] aspect-video bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800 group">
            <img
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80"
              alt="Instructor"
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            />

            {/* Name Tag */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 border border-white/10">
              {micOn ? <Mic className="w-3.5 h-3.5 text-green-400" /> : <MicOff className="w-3.5 h-3.5 text-red-400" />}
              <span>{instructor}</span>
            </div>

            {/* Connection Status */}
            <div className="absolute top-4 right-4 flex gap-1">
              <div className="w-1 h-3 bg-green-500 rounded-full"></div>
              <div className="w-1 h-3 bg-green-500 rounded-full"></div>
              <div className="w-1 h-3 bg-green-500 rounded-full"></div>
              <div className="w-1 h-3 bg-slate-600 rounded-full"></div>
            </div>

            {/* Floating Reactions Area */}
            <div className="absolute bottom-20 right-10 pointer-events-none">
              {/* Animation placeholders would go here */}
            </div>
          </div>

          {/* User Self View (Picture in Picture) */}
          {cameraOn && (
            <div className="absolute bottom-8 right-8 w-48 h-32 bg-slate-800 rounded-xl border border-slate-600 overflow-hidden shadow-2xl z-10 ring-2 ring-black/50">
              <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=300&q=80" alt="Self" className="w-full h-full object-cover scale-x-[-1]" />
              <div className="absolute bottom-1 left-1 text-[10px] text-white bg-black/50 px-1 rounded">Siz</div>
            </div>
          )}
        </div>

        {/* Right Sidebar (Chat) */}
        {showChat && (
          <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 animate-in slide-in-from-right duration-300 shadow-xl z-20">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur">
              <h3 className="text-slate-200 font-bold text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" /> Ders Sohbeti
              </h3>
              <button onClick={() => setShowChat(false)} className="text-slate-500 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-900" ref={chatContainerRef}>
              {chatMessages.map(msg => (
                <div key={msg.id} className="flex flex-col group animate-in fade-in slide-in-from-bottom-2 duration-200">
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className={clsx("text-xs font-bold", msg.user === 'Siz' ? 'text-indigo-400' : 'text-slate-400')}>{msg.user}</span>
                    <span className="text-[10px] text-slate-600 group-hover:text-slate-500">{msg.time}</span>
                  </div>
                  <div className={clsx(
                    "p-3 rounded-2xl text-sm leading-relaxed shadow-sm",
                    msg.user === 'Siz'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800">
              <div className="flex items-center gap-2 bg-slate-800 rounded-xl p-1.5 border border-slate-700 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
                <input
                  type="text"
                  className="bg-transparent border-none text-white text-sm w-full focus:ring-0 placeholder-slate-500 px-2"
                  placeholder="Bir mesaj yazın..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim()}
                  className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="text-slate-400 hover:text-yellow-400 transition-colors p-1 hover:bg-slate-800 rounded" title="El Kaldır"><Hand className="w-5 h-5" /></button>
                <button className="text-slate-400 hover:text-yellow-400 transition-colors p-1 hover:bg-slate-800 rounded" title="Emoji"><Smile className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div className="h-20 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-6 px-6 shrink-0 relative shadow-[0_-10px_20px_rgba(0,0,0,0.2)] z-30">

        {/* Left Status (Hidden on mobile) */}
        <div className="absolute left-6 hidden lg:flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Ses</span>
            <div className="flex gap-1 mt-1">
              <div className="w-1 h-2 bg-green-500 rounded-full"></div>
              <div className="w-1 h-3 bg-green-500 rounded-full"></div>
              <div className="w-1 h-4 bg-green-500 rounded-full"></div>
              <div className="w-1 h-2 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Center Control Cluster */}
        <div className="flex items-center gap-3 bg-slate-800/50 p-2 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
          <ControlButton
            icon={micOn ? <Mic /> : <MicOff />}
            active={micOn}
            onClick={() => setMicOn(!micOn)}
            label={micOn ? "Sessize Al" : "Sesi Aç"}
            offColor="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
            activeColor="bg-slate-700 text-white hover:bg-slate-600 border border-slate-600"
          />
          <ControlButton
            icon={cameraOn ? <Video /> : <VideoOff />}
            active={cameraOn}
            onClick={() => setCameraOn(!cameraOn)}
            label={cameraOn ? "Kamerayı Kapat" : "Kamerayı Aç"}
            offColor="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20"
            activeColor="bg-slate-700 text-white hover:bg-slate-600 border border-slate-600"
          />

          <div className="w-px h-8 bg-slate-700 mx-1"></div>

          <ControlButton
            icon={<Hand className={handRaised ? 'fill-yellow-400 text-yellow-400' : ''} />}
            active={handRaised}
            onClick={() => setHandRaised(!handRaised)}
            label="El Kaldır"
            activeColor="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
            offColor="bg-slate-700 text-slate-400 hover:text-white hover:bg-slate-600 border border-transparent"
          />
          <ControlButton
            icon={<Share />}
            active={false}
            onClick={() => { }}
            label="Ekran Paylaş"
            offColor="bg-slate-700 text-slate-400 hover:text-white hover:bg-slate-600 border border-transparent"
          />
          <ControlButton
            icon={<MessageSquare />}
            active={showChat}
            onClick={() => setShowChat(!showChat)}
            label="Sohbeti Aç/Kapat"
            activeColor="bg-indigo-600 text-white border border-indigo-500 shadow-lg shadow-indigo-900/50"
            offColor="bg-slate-700 text-slate-400 hover:text-white hover:bg-slate-600 border border-transparent"
          />
        </div>

        <button
          onClick={onEndCall}
          className="ml-2 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-900/40 border-t border-red-500 hover:scale-105"
        >
          <PhoneOff className="w-5 h-5" />
          <span className="hidden sm:inline">{userRole === UserRole.INSTRUCTOR ? 'Dersi Bitir' : 'Ayrıl'}</span>
        </button>

        {/* Right Controls */}
        <div className="absolute right-6 hidden lg:flex">
          <button className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface ControlButtonProps {
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  label: string;
  activeColor?: string;
  offColor?: string;
}

const ControlButton: React.FC<ControlButtonProps> = ({ icon, active, onClick, label, activeColor, offColor }) => (
  <div className="relative group">
    <button
      onClick={onClick}
      className={clsx(
        "p-3 rounded-xl transition-all duration-200 flex items-center justify-center",
        active ? activeColor : offColor
      )}
      aria-label={label}
    >
      {React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}
    </button>
    {/* Tooltip */}
    <div className="absolute bottom-[120%] left-1/2 -translate-x-1/2 px-2 py-1 bg-slate-800 text-slate-200 text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700 shadow-xl">
      {label}
    </div>
  </div>
);

export default LiveClassroom;
