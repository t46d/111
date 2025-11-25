import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Heart, X } from "lucide-react";

export default function Profile() {
  const { toast } = useToast();
  
  // todo: remove mock functionality
  const { data: profile } = useQuery({
    queryKey: ['/api/profile/me'],
    queryFn: async () => ({
      email: 'user@example.com',
      name: 'محمد أحمد',
      interests: ['Design', 'Tech', 'Music'],
    }),
  });

  const [formData, setFormData] = useState({
    name: profile?.name || '',
    interests: profile?.interests?.join(', ') || '',
  });

  const [newInterest, setNewInterest] = useState('');

  const handleSave = () => {
    console.log('Profile updated:', formData);
    toast({
      title: "تم حفظ الملف الشخصي",
      description: "تم تحديث معلوماتك بنجاح",
    });
  };

  const removeInterest = (interest: string) => {
    const interests = formData.interests.split(',').map(s => s.trim()).filter(s => s !== interest);
    setFormData({ ...formData, interests: interests.join(', ') });
  };

  const addInterest = () => {
    if (!newInterest.trim()) return;
    const interests = formData.interests ? `${formData.interests}, ${newInterest}` : newInterest;
    setFormData({ ...formData, interests });
    setNewInterest('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-6 pt-24 pb-12">
        <h1 className="text-4xl font-bold mb-8 text-foreground">ملفي الشخصي</h1>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Avatar & Stats */}
          <Card className="glass border-white/10 p-6 h-fit">
            <div className="flex flex-col items-center text-center">
              <Avatar className="w-32 h-32 ring-4 ring-primary/30 ring-offset-4 ring-offset-background mb-4">
                <AvatarFallback className="bg-primary/20 text-primary text-4xl font-bold">
                  {profile?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <h2 className="text-2xl font-bold mb-1">{profile?.name || 'User'}</h2>
              <p className="text-sm text-muted-foreground mb-4">{profile?.email}</p>
              
              <div className="grid grid-cols-2 gap-4 w-full mt-4">
                <div className="glass border-white/10 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-primary">24</div>
                  <div className="text-xs text-muted-foreground">تطابقات</div>
                </div>
                <div className="glass border-white/10 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-accent">12</div>
                  <div className="text-xs text-muted-foreground">محادثات</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Right Column - Editable Info */}
          <div className="md:col-span-2 space-y-6">
            <Card className="glass border-white/10 p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                المعلومات الشخصية
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="glass border-white/10 focus:border-primary"
                    data-testid="input-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      value={profile?.email || ''}
                      disabled
                      className="glass border-white/10 pl-10 opacity-60"
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="glass border-white/10 p-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                الاهتمامات
              </h3>
              
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {formData.interests.split(',').map(interest => interest.trim()).filter(Boolean).map((interest, idx) => (
                    <Badge
                      key={idx}
                      className="bg-primary/20 text-primary border-primary/30 pr-2"
                      data-testid={`badge-interest-${interest}`}
                    >
                      {interest}
                      <button
                        onClick={() => removeInterest(interest)}
                        className="ml-2 hover:bg-primary/30 rounded-full p-0.5"
                        data-testid={`button-remove-${interest}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="أضف اهتمام جديد"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addInterest()}
                    className="glass border-white/10 focus:border-primary"
                    data-testid="input-new-interest"
                  />
                  <Button
                    onClick={addInterest}
                    className="bg-primary"
                    data-testid="button-add-interest"
                  >
                    إضافة
                  </Button>
                </div>
              </div>
            </Card>

            <Button
              onClick={handleSave}
              className="w-full bg-gradient-to-r from-primary to-accent text-white h-12"
              data-testid="button-save"
            >
              حفظ التغييرات
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
