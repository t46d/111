import { Link, useLocation } from "wouter";
import { Sparkles, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [location] = useLocation();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDark]);

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/search", label: "البحث" },
    { href: "/profile", label: "ملفي الشخصي" },
    { href: "/chat", label: "الدردشة" },
    { href: "/settings", label: "الإعدادات" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 cursor-pointer hover-elevate active-elevate-2 px-3 py-1 rounded-md">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-2xl font-bold text-primary neon-glow-primary">VeXa</span>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} data-testid={`link-${link.label}`}>
                <Button
                  variant={location === link.href ? "secondary" : "ghost"}
                  className="text-sm"
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDark(!isDark)}
              data-testid="button-theme-toggle"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            
            <Link href="/login" data-testid="link-login">
              <Button variant="outline" className="hidden sm:inline-flex">
                تسجيل الدخول
              </Button>
            </Link>
            
            <Link href="/register" data-testid="link-register">
              <Button className="bg-primary text-primary-foreground">
                إنشاء حساب
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
