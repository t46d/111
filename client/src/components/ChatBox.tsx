import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Circle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { getUserId } from "@/lib/auth";

interface Message {
  id: string;
  text: string;
  isMine: boolean;
  timestamp: string;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentUserId = getUserId() || 'demo-user-1';
  const chatPartnerId = 'demo-user-2'; // In real app, get from route params or props

  useEffect(() => {
    const socket = io(window.location.origin);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      // Join user's personal room
      socket.emit('join', currentUserId);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socket.on('message', (msg: any) => {
      // Only add if not already in messages
      setMessages(prev => {
        if (prev.some(m => m.id === msg.id)) return prev;
        
        const message: Message = {
          id: msg.id,
          text: msg.text,
          isMine: msg.fromUserId === currentUserId,
          timestamp: new Date(msg.timestamp).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        };
        return [...prev, message];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [currentUserId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !socketRef.current) return;
    
    socketRef.current.emit('message', {
      text: newMessage,
      fromUserId: currentUserId,
      toUserId: chatPartnerId,
    });
    
    setNewMessage('');
  };

  return (
    <Card className="glass border-white/10 flex flex-col h-[600px]">
      <div className="p-4 border-b border-white/10 flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-primary/20 text-primary">A</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">Ava</h3>
          <div className="flex items-center gap-1">
            <Circle className={`w-2 h-2 fill-current ${isConnected ? 'text-accent' : 'text-muted-foreground'}`} />
            <span className="text-xs text-muted-foreground">
              {isConnected ? 'متصل' : 'غير متصل'}
            </span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" data-testid="scroll-chat-messages">
        <div className="space-y-4" ref={scrollRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
              data-testid={`message-${msg.id}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  msg.isMine
                    ? 'bg-gradient-to-r from-primary to-accent text-white'
                    : 'glass border-white/10'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                <span className="text-xs opacity-70 mt-1 block">{msg.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-white/10 glass">
        <div className="flex gap-2">
          <Input
            placeholder="اكتب رسالتك..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="glass border-white/10 focus:border-primary"
            data-testid="input-message"
            disabled={!isConnected}
          />
          <Button
            onClick={handleSend}
            className="bg-gradient-to-r from-primary to-accent"
            data-testid="button-send"
            disabled={!isConnected}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
