import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ThreatMap from './ThreatMap';
import ThreatFeed from './ThreatFeed';
import ThreatMetrics from './ThreatMetrics';
import ThreatPrediction from './ThreatPrediction';
import cyberBg from '@/assets/cyber-bg.jpg';

const CyberDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState<'operational' | 'warning' | 'critical'>('operational');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Randomly change system status for demo
      const statuses: ('operational' | 'warning' | 'critical')[] = ['operational', 'warning', 'critical'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      setSystemStatus(randomStatus);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-cyber-green text-background';
      case 'warning': return 'bg-cyber-orange text-background';
      case 'critical': return 'bg-cyber-red text-background animate-pulse';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div 
      className="min-h-screen bg-background p-6 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)), url(${cyberBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header */}
      <div className="mb-6 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-cyber-green mb-2">
              🛡️ CYBER THREAT COMMAND CENTER
            </h1>
            <p className="text-muted-foreground">
              Real-time monitoring • AI-powered predictions • Global threat intelligence
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono text-cyber-cyan">
              {currentTime.toLocaleTimeString()}
            </div>
            <div className="text-sm text-muted-foreground">
              {currentTime.toLocaleDateString()}
            </div>
            <Badge className={`mt-2 ${getStatusColor(systemStatus)}`}>
              SYSTEM {systemStatus.toUpperCase()}
            </Badge>
          </div>
        </div>
        
        {/* System Alert Bar */}
        <div className="cyber-border bg-card/30 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></div>
              <span className="text-sm text-cyber-green font-semibold">THREAT DETECTION: ACTIVE</span>
              <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-pulse"></div>
              <span className="text-sm text-cyber-cyan font-semibold">AI PREDICTION: ONLINE</span>
              <div className="w-2 h-2 bg-cyber-orange rounded-full animate-pulse"></div>
              <span className="text-sm text-cyber-orange font-semibold">GLOBAL MONITORING: ENABLED</span>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              DEFCON-{Math.floor(Math.random() * 3) + 2}
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-6 relative z-10">
        <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto bg-card border-cyber-green/20">
          <TabsTrigger 
            value="overview" 
            className="data-[state=active]:bg-cyber-green data-[state=active]:text-background"
          >
            📊 Overview
          </TabsTrigger>
          <TabsTrigger 
            value="threats"
            className="data-[state=active]:bg-cyber-green data-[state=active]:text-background"
          >
            🚨 Live Threats
          </TabsTrigger>
          <TabsTrigger 
            value="prediction"
            className="data-[state=active]:bg-cyber-green data-[state=active]:text-background"
          >
            🤖 AI Prediction
          </TabsTrigger>
          <TabsTrigger 
            value="map"
            className="data-[state=active]:bg-cyber-green data-[state=active]:text-background"
          >
            🗺️ Global Map
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ThreatMetrics />
            </div>
            <div>
              <ThreatFeed />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="threats" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <ThreatFeed />
            <ThreatMap />
          </div>
        </TabsContent>

        <TabsContent value="prediction" className="space-y-6">
          <ThreatPrediction />
        </TabsContent>

        <TabsContent value="map" className="space-y-6">
          <ThreatMap />
        </TabsContent>
      </Tabs>

      {/* Animated Matrix Rain Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-10 z-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-cyber-green text-xs font-mono animate-matrix-flow"
            style={{
              left: `${i * 5}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          >
            {Array.from({ length: 20 }).map((_, j) => (
              <div key={j} className="opacity-70">
                {String.fromCharCode(0x30A0 + Math.random() * 96)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CyberDashboard;