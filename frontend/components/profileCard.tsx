import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type ProfileProps = {
  profile: {
    experience_level: string;
    investment_amount: number;
    investment_currency: string;
    investment_goals: string[];
    investment_horizon: string;
    preferred_activities: string[];
    risk_tolerance: string;
  };
};

export default function ProfileCard({ profile }: ProfileProps) {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Simplified color mapping with fewer options
  const getActivityColor = (activity: string) => {
    const activityLower = activity.toLowerCase();
    
    if (activityLower.includes('stocks') || activityLower.includes('etfs')) {
      return 'bg-blue-50 text-blue-700';
    }
    if (activityLower.includes('bonds') || activityLower.includes('funds')) {
      return 'bg-green-50 text-green-700';
    }
    if (activityLower.includes('crypto') || activityLower.includes('forex')) {
      return 'bg-purple-50 text-purple-700';
    }
    if (activityLower.includes('estate') || activityLower.includes('commodities')) {
      return 'bg-amber-50 text-amber-700';
    }
    
    return 'bg-gray-50 text-gray-700';
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Investment Profile</CardTitle>
        <CardDescription>Your personalized investment preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Amount</p>
            <p className="text-lg font-semibold">
              {formatCurrency(profile.investment_amount, profile.investment_currency)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Risk Tolerance</p>
            <p className="text-lg font-semibold capitalize">{profile.risk_tolerance}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Experience Level</p>
            <p className="text-lg font-semibold capitalize">{profile.experience_level}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Time Horizon</p>
            <p className="text-lg font-semibold capitalize">{profile.investment_horizon}</p>
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Investment Goals</p>
          <div className="flex flex-wrap gap-2">
            {profile.investment_goals.map((goal, index) => (
              <Badge key={index} variant="secondary" className="px-2 py-1">
                {goal}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">Preferred Activities</p>
          <div className="flex flex-wrap gap-2">
            {profile.preferred_activities.map((activity, index) => (
              <Badge key={index} variant="outline" className={`px-2 py-1 ${getActivityColor(activity)}`}>
                {activity}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}