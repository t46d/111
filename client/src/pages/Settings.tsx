import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings as SettingsIcon, Globe, Bell, Lock, Eye } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    language: 'ar',
    notifications: true,
    privateProfile: false,
    showOnline: true,
  });

  const handleSave = () => {
    console.log('Settings saved:', settings);
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم تحديث إعداداتك بنجاح",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-3xl mx-auto px-6 pt-24 pb-12">
        <h1 className="text-4xl font-bold mb-8 text-foreground flex items-center gap-3">
          <SettingsIcon className="w-10 h-10 text-primary" />
          الإعدادات
        </h1>
        
        <div className="space-y-6">
          <Card className="glass border-white/10 p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              اللغة والمنطقة
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="language">اللغة</Label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => setSettings({ ...settings, language: value })}
                >
                  <SelectTrigger className="w-48 glass border-white/10" data-testid="select-language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="glass border-white/10 p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              الإشعارات
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notifications" className="text-base">تفعيل الإشعارات</Label>
                  <p className="text-sm text-muted-foreground">احصل على إشعارات للتطابقات والرسائل الجديدة</p>
                </div>
                <Switch
                  id="notifications"
                  checked={settings.notifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, notifications: checked })}
                  data-testid="switch-notifications"
                />
              </div>
            </div>
          </Card>

          <Card className="glass border-white/10 p-6">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              الخصوصية
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="private" className="text-base">حساب خاص</Label>
                  <p className="text-sm text-muted-foreground">إخفاء ملفك الشخصي من البحث</p>
                </div>
                <Switch
                  id="private"
                  checked={settings.privateProfile}
                  onCheckedChange={(checked) => setSettings({ ...settings, privateProfile: checked })}
                  data-testid="switch-private"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="online" className="text-base">إظهار حالة الاتصال</Label>
                  <p className="text-sm text-muted-foreground">السماح للآخرين برؤية حالة اتصالك</p>
                </div>
                <Switch
                  id="online"
                  checked={settings.showOnline}
                  onCheckedChange={(checked) => setSettings({ ...settings, showOnline: checked })}
                  data-testid="switch-online"
                />
              </div>
            </div>
          </Card>

          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-primary to-accent text-white h-12"
            data-testid="button-save"
          >
            حفظ الإعدادات
          </Button>
        </div>
      </div>
    </div>
  );
}
