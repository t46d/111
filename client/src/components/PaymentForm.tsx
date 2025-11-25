import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock, Zap, Crown } from "lucide-react";
import { useState } from "react";

export default function PaymentForm() {
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');

  const plans = [
    { id: 'basic', name: 'أساسي', price: 5, icon: Zap, features: ['دردشة غير محدودة', 'تطابقات يومية'] },
    { id: 'premium', name: 'مميز', price: 10, icon: Crown, features: ['كل مميزات الأساسي', 'أولوية في التطابق', 'رسائل متقدمة'] },
  ];

  const handleCheckout = () => {
    const plan = plans.find(p => p.id === selectedPlan);
    console.log(`Checkout initiated for ${plan?.name} - $${plan?.price}`);
  };

  return (
    <Card className="glass border-white/10 p-6" data-testid="card-payment">
      <div className="flex items-center gap-2 mb-6">
        <Lock className="w-5 h-5 text-accent" />
        <h3 className="text-xl font-semibold">اشتراك مميز</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isSelected = selectedPlan === plan.id;
          
          return (
            <Card
              key={plan.id}
              className={`p-4 cursor-pointer transition-all border-2 hover-elevate ${
                isSelected
                  ? 'border-primary bg-primary/5 neon-border'
                  : 'border-white/10 glass'
              }`}
              onClick={() => setSelectedPlan(plan.id)}
              data-testid={`card-plan-${plan.id}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-lg">{plan.name}</h4>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-bold text-primary">${plan.price}</span>
                    <span className="text-sm text-muted-foreground">/شهر</span>
                  </div>
                </div>
                <Icon className={`w-6 h-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
              
              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {feature}
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>

      <Button
        className="w-full bg-gradient-to-r from-primary to-accent text-white h-12 text-base"
        onClick={handleCheckout}
        data-testid="button-checkout"
      >
        <Lock className="w-4 h-4 mr-2" />
        اشترك الآن
      </Button>

      <div className="flex items-center justify-center gap-2 mt-4">
        <Badge variant="secondary" className="bg-secondary/50 text-xs">
          آمن ومشفر
        </Badge>
        <Badge variant="secondary" className="bg-secondary/50 text-xs">
          إلغاء في أي وقت
        </Badge>
      </div>
    </Card>
  );
}
