import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Prediction {
  id: string;
  threatType: string;
  probability: number;
  timeframe: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  factors: string[];
}

interface PredictionData {
  hour: string;
  predicted: number;
  actual: number;
}

const ThreatPrediction = () => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [predictionData, setPredictionData] = useState<PredictionData[]>([]);

  const threatTypes = [
    'Distributed Denial of Service',
    'Advanced Persistent Threat',
    'Ransomware Campaign',
    'Data Exfiltration',
    'Zero-Day Exploit',
    'Credential Stuffing',
    'Supply Chain Attack',
    'Insider Threat'
  ];

  const riskFactors = [
    'Increased dark web chatter',
    'Geopolitical tensions',
    'Seasonal vulnerability patterns',
    'Recent infrastructure changes',
    'Threat actor group activity',
    'Industry-specific targeting',
    'Holiday/weekend patterns',
    'Economic indicators'
  ];

  const generatePredictions = () => {
    const newPredictions: Prediction[] = Array.from({ length: 6 }, (_, i) => {
      const impacts: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
      const timeframes = ['Next 6 hours', 'Next 12 hours', 'Next 24 hours', 'Next 48 hours', 'Next week'];
      
      return {
        id: `prediction-${i}`,
        threatType: threatTypes[Math.floor(Math.random() * threatTypes.length)],
        probability: Math.floor(Math.random() * 80) + 15,
        timeframe: timeframes[Math.floor(Math.random() * timeframes.length)],
        impact: impacts[Math.floor(Math.random() * impacts.length)],
        confidence: Math.floor(Math.random() * 30) + 70,
        factors: Array.from({ length: Math.floor(Math.random() * 3) + 2 }, () => 
          riskFactors[Math.floor(Math.random() * riskFactors.length)]
        )
      };
    });

    setPredictions(newPredictions.sort((a, b) => b.probability - a.probability));
  };

  const generatePredictionChart = () => {
    const data: PredictionData[] = Array.from({ length: 12 }, (_, i) => {
      const hour = new Date();
      hour.setHours(hour.getHours() + i);
      
      const predicted = Math.floor(Math.random() * 50) + 20;
      const actual = i < 6 ? Math.floor(Math.random() * 60) + 15 : 0; // Only show actual for past hours
      
      return {
        hour: hour.toLocaleTimeString('en-US', { hour: '2-digit' }),
        predicted,
        actual: actual || undefined
      };
    });

    setPredictionData(data);
  };

  useEffect(() => {
    generatePredictions();
    generatePredictionChart();
    
    const interval = setInterval(() => {
      generatePredictions();
      generatePredictionChart();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-cyber-red';
    if (probability >= 60) return 'text-cyber-orange';
    if (probability >= 40) return 'text-cyber-blue';
    return 'text-cyber-green';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'critical': return 'bg-cyber-red text-background';
      case 'high': return 'bg-cyber-orange text-background';
      case 'medium': return 'bg-cyber-blue text-background';
      case 'low': return 'bg-cyber-green text-background';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Prediction Engine Header */}
      <Card className="cyber-border">
        <CardHeader>
          <CardTitle className="text-cyber-green flex items-center justify-between">
            🤖 AI Threat Prediction Engine
            <Badge className="bg-cyber-green text-background animate-pulse">
              ACTIVE
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Model Accuracy</div>
              <div className="text-2xl font-bold text-cyber-green">94.7%</div>
              <Progress value={94.7} className="mt-2" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Predictions Generated</div>
              <div className="text-2xl font-bold text-cyber-cyan">
                {predictions.length.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Last Updated</div>
              <div className="text-lg font-semibold text-cyber-orange">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Predictions List */}
        <Card className="cyber-border">
          <CardHeader>
            <CardTitle className="text-cyber-green">High-Risk Predictions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {predictions.map((prediction) => (
              <div 
                key={prediction.id}
                className="border border-border/30 rounded-lg p-4 bg-card/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge className={getImpactColor(prediction.impact)}>
                    {prediction.impact.toUpperCase()}
                  </Badge>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${getProbabilityColor(prediction.probability)}`}>
                      {prediction.probability}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {prediction.confidence}% confidence
                    </div>
                  </div>
                </div>
                
                <h4 className="font-semibold text-cyber-cyan mb-1">
                  {prediction.threatType}
                </h4>
                
                <div className="text-sm text-muted-foreground mb-2">
                  Expected: <span className="text-cyber-orange">{prediction.timeframe}</span>
                </div>
                
                <div className="text-xs">
                  <div className="text-muted-foreground mb-1">Risk Factors:</div>
                  <div className="flex flex-wrap gap-1">
                    {prediction.factors.map((factor, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline"
                        className="text-xs border-cyber-cyan/30 text-cyber-cyan"
                      >
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Progress 
                  value={prediction.probability} 
                  className="mt-2" 
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Prediction vs Reality Chart */}
        <Card className="cyber-border">
          <CardHeader>
            <CardTitle className="text-cyber-green">Prediction Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={predictionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="hour" 
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
                <Line
                  type="monotone"
                  dataKey="predicted"
                  stroke="hsl(var(--cyber-cyan))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: 'hsl(var(--cyber-cyan))' }}
                  name="Predicted Threats"
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="hsl(var(--cyber-green))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--cyber-green))' }}
                  name="Actual Threats"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ThreatPrediction;