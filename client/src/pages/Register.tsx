import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Lock } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const registerMutation = useMutation({
    mutationFn: async (data: { name: string; email: string; password: string }) => {
      const res = await apiRequest('POST', '/api/auth/register', data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "تم إنشاء الحساب",
        description: "يمكنك الآن تسجيل الدخول",
      });
      setLocation("/login");
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message || "حدث خطأ، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden bg-background">
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      
      <Card className="glass border-white/10 w-full max-w-md p-8 relative z-10" data-testid="card-register">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary neon-glow-primary mb-2">إنشاء حساب</h2>
          <p className="text-muted-foreground">انضم إلى مجتمع VeXa اليوم</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">الاسم</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="أدخل اسمك"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="glass border-white/10 focus:border-primary pl-10"
                required
                data-testid="input-name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">البريد الإلكتروني</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="glass border-white/10 focus:border-primary pl-10"
                required
                data-testid="input-password"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-accent text-white h-12"
            disabled={registerMutation.isPending}
            data-testid="button-submit"
          >
            {registerMutation.isPending ? 'جاري التسجيل...' : 'تسجيل'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            لديك حساب بالفعل؟{" "}
            <Link href="/login" data-testid="link-login">
              <span className="text-primary hover:underline cursor-pointer">تسجيل الدخول</span>
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
