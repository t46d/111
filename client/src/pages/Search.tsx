import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search as SearchIcon, MapPin, Heart, MessageCircle } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  interests: string[];
  avatarUrl?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
}

export default function Search() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"friends" | "nearby">("friends");
  const [maxDistance, setMaxDistance] = useState("50");

  const { data: users = [], isLoading } = useQuery<UserProfile[]>({
    queryKey: ["/api/search", searchQuery, searchType, maxDistance],
    enabled: searchQuery.length > 0 || searchType === "nearby",
  });

  const { data: nearbyUsers = [] } = useQuery<UserProfile[]>({
    queryKey: ["/api/nearby", maxDistance],
    enabled: searchType === "nearby",
  });

  const displayUsers = searchType === "nearby" ? nearbyUsers : users;

  const calculateDistance = (lat1?: number, lon1?: number, lat2?: number, lon2?: number): number | null => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return Math.round(R * c * 10) / 10;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
        <h1 className="text-4xl font-bold mb-8 text-foreground flex items-center gap-3">
          <SearchIcon className="w-10 h-10 text-primary" />
          البحث عن الأصدقاء
        </h1>

        <Card className="glass border-white/10 p-6 mb-8">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={() => setSearchType("friends")}
                variant={searchType === "friends" ? "default" : "outline"}
                className="flex-1"
                data-testid="button-search-friends"
              >
                بحث عن أصدقاء
              </Button>
              <Button
                onClick={() => setSearchType("nearby")}
                variant={searchType === "nearby" ? "default" : "outline"}
                className="flex-1"
                data-testid="button-search-nearby"
              >
                قريب مني
              </Button>
            </div>

            {searchType === "friends" ? (
              <Input
                placeholder="ابحث باسم أو اهتمام..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass border-white/10 focus:border-primary"
                data-testid="input-search-friends"
              />
            ) : (
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="الحد الأقصى للمسافة (كم)"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(e.target.value)}
                  min="1"
                  max="500"
                  className="glass border-white/10 focus:border-primary"
                  data-testid="input-max-distance"
                />
                <span className="text-sm text-muted-foreground flex items-center">كم</span>
              </div>
            )}
          </div>
        </Card>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">جاري البحث...</p>
          </div>
        ) : displayUsers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayUsers.map((user) => {
              const distance = searchType === "nearby" ? calculateDistance(0, 0, user.latitude, user.longitude) : null;
              return (
                <Card key={user.id} className="glass border-white/10 p-6 hover-elevate" data-testid={`card-user-${user.id}`}>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="w-16 h-16 ring-2 ring-primary/30">
                      {user.avatarUrl ? (
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                      ) : null}
                      <AvatarFallback className="bg-primary/20 text-primary font-bold">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg" data-testid={`text-username-${user.id}`}>{user.name}</h3>
                      {user.region && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {user.region}
                        </p>
                      )}
                    </div>
                  </div>

                  {distance !== null && (
                    <div className="mb-3 text-sm text-accent">
                      على بعد {distance} كم
                    </div>
                  )}

                  {user.interests.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-2">الاهتمامات:</p>
                      <div className="flex flex-wrap gap-1">
                        {user.interests.slice(0, 3).map((interest, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      data-testid={`button-like-${user.id}`}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      إعجاب
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      data-testid={`button-message-${user.id}`}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      رسالة
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchQuery ? "لم يتم العثور على نتائج" : "لا توجد مستخدمين قريبين"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
