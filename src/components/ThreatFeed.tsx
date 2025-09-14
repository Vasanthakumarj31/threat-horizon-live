import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Threat {
  id: string;
  type: string;
  source: string;
  target: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  description: string;
  status: 'active' | 'mitigated' | 'investigating';
}

const ThreatFeed = () => {
  const [threats, setThreats] = useState<Threat[]>([]);

  const threatTypes = [
    'DDoS Attack', 'Malware Detected', 'Phishing Campaign', 'Data Exfiltration', 
    'Ransomware', 'SQL Injection', 'Brute Force', 'Zero-Day Exploit',
    'Advanced Persistent Threat', 'Credential Theft'
  ];

  const sources = [
    'Firewall-01', 'IDS-West', 'Honeypot-DMZ', 'SIEM-Central', 'EDR-Endpoint',
    'Threat-Intel-Feed', 'DNS-Monitor', 'Network-Scanner'
  ];

  const generateThreat = (): Threat => {
    const severities: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
    const statuses: ('active' | 'mitigated' | 'investigating')[] = ['active', 'mitigated', 'investigating'];
    
    return {
      id: `threat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      target: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      severity: severities[Math.floor(Math.random() * severities.length)],
      timestamp: new Date(),
      description: 'Suspicious activity detected from external source',
      status: statuses[Math.floor(Math.random() * statuses.length)]
    };
  };

  useEffect(() => {
    // Initialize with some threats
    const initialThreats = Array.from({ length: 10 }, () => generateThreat());
    setThreats(initialThreats);

    // Add new threats periodically
    const interval = setInterval(() => {
      const newThreat = generateThreat();
      setThreats(prev => [newThreat, ...prev].slice(0, 50)); // Keep only latest 50
    }, 3000 + Math.random() * 5000); // Random interval between 3-8 seconds

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-cyber-red text-background';
      case 'high': return 'bg-cyber-orange text-background';
      case 'medium': return 'bg-cyber-blue text-background';
      case 'low': return 'bg-cyber-green text-background';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-destructive text-destructive-foreground';
      case 'investigating': return 'bg-cyber-orange text-background';
      case 'mitigated': return 'bg-cyber-green text-background';
      default: return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <Card className="cyber-border h-full">
      <CardHeader>
        <CardTitle className="text-cyber-green flex items-center justify-between">
          Live Threat Feed
          <div className="w-3 h-3 bg-cyber-green rounded-full animate-pulse" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px]">
          <div className="p-4 space-y-3">
            {threats.map((threat) => (
              <div 
                key={threat.id} 
                className="border border-border/30 rounded-lg p-3 bg-card/50 hover:bg-card transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge className={getSeverityColor(threat.severity)}>
                      {threat.severity.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(threat.status)}>
                      {threat.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {threat.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                
                <h4 className="font-semibold text-cyber-cyan mb-1">
                  {threat.type}
                </h4>
                
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Source: <span className="text-cyber-green font-mono">{threat.source}</span></div>
                  <div>Target: <span className="text-cyber-orange font-mono">{threat.target}</span></div>
                  <div className="text-xs">{threat.description}</div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ThreatFeed;