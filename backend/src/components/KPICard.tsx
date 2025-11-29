import { Card, CardContent } from './ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ReactNode } from 'react';

interface KPICardProps {
  title: string;
  value: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  bgColor?: string;
}

export function KPICard({ title, value, icon, trend, subtitle, bgColor = 'from-gray-500 to-gray-600' }: KPICardProps) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="size-4 text-green-600" />;
    if (trend === 'down') return <TrendingDown className="size-4 text-red-600" />;
    if (trend === 'neutral') return <Minus className="size-4 text-gray-600" />;
    return null;
  };

  return (
    <Card className="overflow-hidden border-2 border-gray-100 hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <p className="text-sm text-gray-600">{title}</p>
          <div className={`p-2 rounded-lg bg-gradient-to-br ${bgColor}`}>
            <div className="text-white">
              {icon}
            </div>
          </div>
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <p className="text-gray-900 mb-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
          
          {trend && (
            <div className="flex items-center">
              {getTrendIcon()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
