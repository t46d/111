import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Circle } from "lucide-react";
import { useState } from "react";

interface Message {
  id: string;
  text: string;
  isMine: boolean;
  timestamp: string;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'مرحباً! كيف حالك؟', isMine: false, timestamp: '10:30' },
    { id: '2', text: 'أهلاً! أنا بخير، شكراً. وأنت؟', isMine: true, timestamp: '10:31' },
    { id: '3', text: 'رائع! هل لديك وقت للدردشة؟', isMine: false, timestamp: '10:32' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      isMine: true,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    console.log('Message sent:', message.text);
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
            <Circle className="w-2 h-2 fill-accent text-accent" />
            <span className="text-xs text-muted-foreground">متصل</span>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" data-testid="scroll-chat-messages">
        <div className="space-y-4">
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
          />
          <Button
            onClick={handleSend}
            className="bg-gradient-to-r from-primary to-accent"
            data-testid="button-send"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
