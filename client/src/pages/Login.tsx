import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { saveUser } from "@/lib/auth";
import { trackEvent, ANALYTICS_EVENTS } from "@/lib/analytics";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await apiRequest('POST', '/api/auth/login', data);
      return await res.json();
    },
    onSuccess: (data: any) => {
      saveUser(data.user);
      toast({
        title: "تم تسجيل الدخول",
        description: "مرحباً بك في VeXa",
      });
      trackEvent(ANALYTICS_EVENTS.USER_LOGIN, { email: email });
      setLocation("/profile");
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message || "تحقق من البريد الإلكتروني وكلمة المرور",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-background">
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      
      <Card className="glass border-white/10 w-full max-w-md p-8 relative z-10" data-testid="card-login">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary neon-glow-primary mb-2">تسجيل الدخول</h2>
          <p className="text-muted-foreground">مرحباً بعودتك إلى VeXa</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">البريد الإلكتروني</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass border-white/10 focus:border-primary pl-10"
                required
                data-testid="input-email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">كلمة المرور</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass border-white/10 focus:border-primary pl-10"
                required
                data-testid="input-password"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-accent text-white h-12"
            disabled={loginMutation.isPending}
            data-testid="button-submit"
          >
            {loginMutation.isPending ? 'جاري تسجيل الدخول...' : 'دخول'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            ليس لديك حساب؟{" "}
            <Link href="/register" data-testid="link-register">
              <span className="text-primary hover:underline cursor-pointer">إنشاء حساب جديد</span>
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
