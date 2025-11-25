import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import MatchCard from "@/components/MatchCard";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, MessageCircle, Zap } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  // todo: remove mock functionality
  const { data: recommendations = [], isLoading } = useQuery({
    queryKey: ['/api/match/recommendations'],
    queryFn: async () => {
      // Mock data for prototype
      return [
        { name: 'Ava', score: 0.86, interests: ['Design', 'Tech', 'Music'] },
        { name: 'Leo', score: 0.81, interests: ['Music', 'Travel', 'Art'] },
        { name: 'Maya', score: 0.79, interests: ['Art', 'Wellness', 'Books'] },
      ];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="min-h-[70vh] flex items-center justify-center relative overflow-hidden pt-20">
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-primary neon-glow-primary" data-testid="text-hero-title">
            VeXa
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-medium" data-testid="text-hero-subtitle">
            منصة دردشة وتعارف بالذكاء الاصطناعي
          </p>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            اكتشف أشخاصاً جدداً يشاركونك اهتماماتك من خلال تقنية الذكاء الاصطناعي المتقدمة
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" data-testid="link-cta-register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent text-white h-14 px-8 text-lg w-full sm:w-auto"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                ابدأ الآن مجاناً
              </Button>
            </Link>
            <Link href="/chat" data-testid="link-cta-chat">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg glass border-white/20 w-full sm:w-auto"
              >
                استكشف المنصة
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            لماذا VeXa؟
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'تطابق ذكي', description: 'خوارزميات ذكاء اصطناعي متقدمة لإيجاد أفضل التطابقات' },
              { icon: MessageCircle, title: 'دردشة فورية', description: 'تواصل مباشر وآمن مع الأشخاص المميزين' },
              { icon: Users, title: 'مجتمع نشط', description: 'الآلاف من المستخدمين النشطين يومياً' },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="glass border-white/10 p-6 rounded-lg hover-elevate transition-all" data-testid={`card-feature-${idx}`}>
                  <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recommendations */}
      <section className="py-20 px-6 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            تطابقات مقترحة لك
          </h2>
          
          {isLoading ? (
            <div className="text-center text-muted-foreground">جاري التحميل...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((rec: any, idx: number) => (
                <MatchCard
                  key={idx}
                  name={rec.name}
                  score={rec.score}
                  interests={rec.interests}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
