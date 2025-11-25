import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Star, MessageCircle, ArrowLeft } from 'lucide-react';
import { trackEvent, ANALYTICS_EVENTS } from '@/lib/analytics';
import { getUser } from '@/lib/auth';

export default function UserDetail() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const currentUser = getUser();
  const userId = new URLSearchParams(window.location.search).get('id');
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const { data: reviewsData } = useQuery<any>({
    queryKey: ['/api/reviews', userId],
    enabled: !!userId,
  });

  useEffect(() => {
    if (userId) {
      trackEvent(ANALYTICS_EVENTS.VIEW_REVIEWS, { userId });
    }
  }, [userId]);

  const createReviewMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error('User ID required');
      const res = await apiRequest('POST', '/api/reviews', {
        toUserId: userId,
        rating,
        comment,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reviews', userId] });
      toast({
        title: 'شكراً لتقييمك',
        description: 'تم حفظ المراجعة بنجاح',
      });
      setComment('');
      setRating(5);
      trackEvent(ANALYTICS_EVENTS.CREATE_REVIEW, { userId, rating });
    },
    onError: () => {
      toast({
        title: 'خطأ',
        description: 'فشل حفظ المراجعة',
        variant: 'destructive',
      });
    },
  });

  if (!userId) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container py-12 text-center">
          <p className="text-muted-foreground">المستخدم غير محدد</p>
          <Button
            onClick={() => setLocation('/')}
            className="mt-4"
            data-testid="button-back"
          >
            العودة للرئيسية
          </Button>
        </div>
      </div>
    );
  }

  const reviews = reviewsData?.reviews || [];
  const averageRating = reviewsData?.averageRating || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 max-w-2xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => setLocation('/')}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          العودة
        </Button>

        {/* Rating Summary */}
        <Card className="glass border-white/10 p-6 mb-6" data-testid="card-rating-summary">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">التقييم الإجمالي</h2>
              <p className="text-muted-foreground">
                بناءً على {reviews.length} تقييم
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex gap-1 justify-end">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(averageRating)
                        ? 'fill-primary text-primary'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Add Review Form */}
        {currentUser && currentUser.id !== userId && (
          <Card className="glass border-white/10 p-6 mb-6" data-testid="card-add-review">
            <h3 className="text-lg font-semibold mb-4">أضف تقييمك</h3>
            
            {/* Rating Stars */}
            <div className="flex gap-2 mb-4" data-testid="rating-picker">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                  data-testid={`button-rate-${star}`}
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-primary text-primary'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Comment */}
            <textarea
              placeholder="شارك تجربتك... (اختياري)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-white/10 bg-background/50 text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4 resize-none"
              rows={3}
              data-testid="textarea-comment"
            />

            {/* Submit Button */}
            <Button
              onClick={() => createReviewMutation.mutate()}
              disabled={createReviewMutation.isPending}
              className="w-full gradient-primary"
              data-testid="button-submit-review"
            >
              {createReviewMutation.isPending ? 'جاري الحفظ...' : 'إرسال التقييم'}
            </Button>
          </Card>
        )}

        {/* Reviews List */}
        <div className="space-y-4" data-testid="reviews-list">
          <h3 className="text-lg font-semibold">التقييمات ({reviews.length})</h3>
          {reviews.length === 0 ? (
            <Card className="glass border-white/10 p-6 text-center">
              <p className="text-muted-foreground">لا توجد تقييمات حتى الآن</p>
            </Card>
          ) : (
            reviews.map((review: any) => (
              <Card
                key={review.id}
                className="glass border-white/10 p-4"
                data-testid={`card-review-${review.id}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? 'fill-primary text-primary'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString('ar-SA')}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-foreground">{review.comment}</p>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
