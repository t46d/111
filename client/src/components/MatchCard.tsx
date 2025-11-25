import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MatchCardProps {
  name: string;
  score: number;
  interests: string[];
  avatarUrl?: string;
}

export default function MatchCard({ name, score, interests, avatarUrl }: MatchCardProps) {
  return (
    <Card className="glass border-white/10 overflow-hidden hover-elevate transition-all duration-300 group" data-testid={`card-match-${name}`}>
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-16 h-16 ring-2 ring-primary/50 ring-offset-2 ring-offset-background">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="bg-primary/20 text-primary text-lg font-semibold">
                {name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold text-foreground" data-testid={`text-name-${name}`}>
                {name}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                <span className="text-xs text-muted-foreground">متصل الآن</span>
              </div>
            </div>
          </div>
          
          <Badge className="bg-primary/20 text-primary border-primary/30 neon-glow-primary" data-testid={`badge-score-${name}`}>
            {Math.round(score * 100)}%
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {interests.map((interest, idx) => (
            <Badge
              key={idx}
              variant="secondary"
              className="text-xs bg-secondary/50"
              data-testid={`badge-interest-${interest}`}
            >
              {interest}
            </Badge>
          ))}
        </div>

        <Button
          className="w-full bg-gradient-to-r from-primary to-accent text-white"
          data-testid={`button-connect-${name}`}
          onClick={() => console.log(`Connect with ${name}`)}
        >
          <Heart className="w-4 h-4 mr-2" />
          التواصل
        </Button>
      </div>
    </Card>
  );
}
