import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import ChatBox from "@/components/ChatBox";
import PaymentForm from "@/components/PaymentForm";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trackEvent, ANALYTICS_EVENTS } from "@/lib/analytics";

export default function Chat() {
  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.START_CHAT);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <h1 className="text-4xl font-bold mb-8 text-foreground">الدردشة</h1>
        
        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="glass border-white/10 mb-6">
            <TabsTrigger value="chat" data-testid="tab-chat">المحادثات</TabsTrigger>
            <TabsTrigger value="premium" data-testid="tab-premium">اشتراك مميز</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <ChatBox />
          </TabsContent>

          <TabsContent value="premium" className="space-y-6">
            <PaymentForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
