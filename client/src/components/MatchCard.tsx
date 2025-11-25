import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { trackEvent, ANALYTICS_EVENTS } from "@/lib/analytics";

interface MatchCardProps {
  id: string;
  name: string;
  score: number;
  interests: string[];
  avatarUrl?: string;
}

export default function MatchCard({ id, name, score, interests, avatarUrl }: MatchCardProps) {
  const [, setLocation] = useLocation();

  const handleViewProfile = () => {
    trackEvent(ANALYTICS_EVENTS.VIEW_MATCH, { matchId: id, matchName: name });
    setLocation(`/user?id=${id}`);
  };

  const handleChat = () => {
    trackEvent(ANALYTICS_EVENTS.START_CHAT, { matchId: id, matchName: name });
    setLocation('/chat');
  };

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

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleViewProfile}
            data-testid={`button-view-profile-${name}`}
          >
            <User className="w-4 h-4" />
          </Button>
          <Button
            className="flex-1 bg-gradient-to-r from-primary to-accent text-white"
            data-testid={`button-connect-${name}`}
            onClick={handleChat}
          >
            <Heart className="w-4 h-4 mr-2" />
            التواصل
          </Button>
        </div>
      </div>
    </Card>
  );
}
