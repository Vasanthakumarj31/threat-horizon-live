import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface MetricData {
  time: string;
  threats: number;
  blocked: number;
  critical: number;
}

const ThreatMetrics = () => {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [liveStats, setLiveStats] = useState({
    totalThreats: 0,
    blocked: 0,
    investigating: 0,
    critical: 0
  });

  useEffect(() => {
    // Initialize with sample data
    const initialData: MetricData[] = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date();
      hour.setHours(hour.getHours() - (23 - i));
      
      return {
        time: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        threats: Math.floor(Math.random() * 100) + 20,
        blocked: Math.floor(Math.random() * 80) + 15,
        critical: Math.floor(Math.random() * 10) + 1
      };
    });
    
    setMetrics(initialData);
    
    // Update stats periodically
    const interval = setInterval(() => {
      const newDataPoint: MetricData = {
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        threats: Math.floor(Math.random() * 100) + 20,
        blocked: Math.floor(Math.random() * 80) + 15,
        critical: Math.floor(Math.random() * 10) + 1
      };
      
      setMetrics(prev => [...prev.slice(1), newDataPoint]);
      
      setLiveStats({
        totalThreats: Math.floor(Math.random() * 500) + 1000,
        blocked: Math.floor(Math.random() * 400) + 800,
        investigating: Math.floor(Math.random() * 50) + 10,
        critical: Math.floor(Math.random() * 20) + 5
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Live Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-cyber-green">
              {liveStats.totalThreats.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Threats</div>
            <div className="text-xs text-cyber-cyan mt-1">Last 24h</div>
          </CardContent>
        </Card>
        
        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-cyber-green">
              {liveStats.blocked.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Blocked</div>
            <div className="text-xs text-cyber-green mt-1">
              {((liveStats.blocked / liveStats.totalThreats) * 100).toFixed(1)}% Success Rate
            </div>
          </CardContent>
        </Card>
        
        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-cyber-orange">
              {liveStats.investigating}
            </div>
            <div className="text-sm text-muted-foreground">Investigating</div>
            <div className="text-xs text-cyber-orange mt-1">Active Cases</div>
          </CardContent>
        </Card>
        
        <Card className="cyber-border">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-cyber-red">
              {liveStats.critical}
            </div>
            <div className="text-sm text-muted-foreground">Critical</div>
            <div className="text-xs text-cyber-red mt-1 animate-pulse">Immediate Action</div>
          </CardContent>
        </Card>
      </div>

      {/* Threat Trends Chart */}
      <Card className="cyber-border">
        <CardHeader>
          <CardTitle className="text-cyber-green">Threat Trends (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={metrics}>
              <defs>
                <linearGradient id="threatsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--cyber-red))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--cyber-red))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="blockedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--cyber-green))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--cyber-green))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 'var(--radius)'
                }}
              />
              <Area
                type="monotone"
                dataKey="threats"
                stroke="hsl(var(--cyber-red))"
                fillOpacity={1}
                fill="url(#threatsGradient)"
                name="Total Threats"
              />
              <Area
                type="monotone"
                dataKey="blocked"
                stroke="hsl(var(--cyber-green))"
                fillOpacity={1}
                fill="url(#blockedGradient)"
                name="Blocked"
              />
              <Line
                type="monotone"
                dataKey="critical"
                stroke="hsl(var(--cyber-orange))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--cyber-orange))' }}
                name="Critical"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThreatMetrics;