import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ThreatLocation {
  id: string;
  coordinates: [number, number];
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  threatType: string;
  country: string;
  timestamp: Date;
}

interface AttackFlow {
  id: string;
  source: [number, number];
  target: [number, number];
  sourceCountry: string;
  targetCountry: string;
  attackType: string;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  attribution: string;
}

const ThreatMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [threats, setThreats] = useState<ThreatLocation[]>([]);
  const [attackFlows, setAttackFlows] = useState<AttackFlow[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || initialized) return;

    // Initialize Leaflet map
    map.current = L.map(mapContainer.current, {
      center: [20, 0],
      zoom: 2,
      zoomControl: true,
      attributionControl: true,
    });

    // Add dark themed tile layer from OpenStreetMap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map.current);

    setInitialized(true);
    generateThreats();

    return () => {
      map.current?.remove();
    };
  }, []);

  const generateThreats = () => {
    const threatTypes = ['Malware', 'DDoS', 'Phishing', 'Ransomware', 'Data Breach', 'SQL Injection'];
    const threatLevels: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
    const countries = ['Russia', 'China', 'North Korea', 'Iran', 'USA', 'Germany', 'UK', 'France', 'Brazil', 'India'];
    const attributions = ['APT28', 'Lazarus Group', 'Fancy Bear', 'Cozy Bear', 'Anonymous', 'DarkHalo', 'Carbanak', 'Unknown'];
    
    const newThreats: ThreatLocation[] = Array.from({ length: 30 }, (_, i) => ({
      id: `threat-${i}`,
      coordinates: [
        (Math.random() - 0.5) * 360,
        (Math.random() - 0.5) * 160
      ],
      threatLevel: threatLevels[Math.floor(Math.random() * threatLevels.length)],
      threatType: threatTypes[Math.floor(Math.random() * threatTypes.length)],
      country: countries[Math.floor(Math.random() * countries.length)],
      timestamp: new Date(Date.now() - Math.random() * 86400000)
    }));

    // Generate attack flows between countries
    const newAttackFlows: AttackFlow[] = Array.from({ length: 15 }, (_, i) => ({
      id: `flow-${i}`,
      source: [
        (Math.random() - 0.5) * 360,
        (Math.random() - 0.5) * 160
      ],
      target: [
        (Math.random() - 0.5) * 360,
        (Math.random() - 0.5) * 160
      ],
      sourceCountry: countries[Math.floor(Math.random() * countries.length)],
      targetCountry: countries[Math.floor(Math.random() * countries.length)],
      attackType: threatTypes[Math.floor(Math.random() * threatTypes.length)],
      threatLevel: threatLevels[Math.floor(Math.random() * threatLevels.length)],
      timestamp: new Date(Date.now() - Math.random() * 3600000),
      attribution: attributions[Math.floor(Math.random() * attributions.length)]
    }));

    setThreats(newThreats);
    setAttackFlows(newAttackFlows);
    addThreatsToMap(newThreats);
    addAttackFlowsToMap(newAttackFlows);
  };

  const addThreatsToMap = (threatData: ThreatLocation[]) => {
    if (!map.current) return;

    threatData.forEach((threat) => {
      const color = getThreatColor(threat.threatLevel);
      
      // Create custom icon
      const icon = L.divIcon({
        className: 'threat-marker',
        html: `<div style="
          width: 12px;
          height: 12px;
          background: ${color};
          border: 2px solid ${color}40;
          border-radius: 50%;
          box-shadow: 0 0 10px ${color}80;
          animation: pulse 2s infinite;
        "></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });

      const marker = L.marker(threat.coordinates, { icon }).addTo(map.current!);
      
      marker.bindPopup(`
        <div style="background: hsl(var(--card)); padding: 12px; border-radius: 6px; border: 1px solid hsl(var(--border)); color: hsl(var(--foreground));">
          <div style="color: hsl(var(--primary)); font-weight: bold; margin-bottom: 4px;">${threat.threatType}</div>
          <div style="font-size: 12px; color: hsl(var(--muted-foreground)); margin-bottom: 2px;">Level: ${threat.threatLevel}</div>
          <div style="font-size: 10px; color: hsl(var(--muted-foreground));">${threat.timestamp.toLocaleString()}</div>
        </div>
      `);
    });
  };

  const addAttackFlowsToMap = (attackFlowData: AttackFlow[]) => {
    if (!map.current) return;

    attackFlowData.forEach((flow) => {
      const color = getThreatColor(flow.threatLevel);
      
      // Add source marker
      const sourceIcon = L.divIcon({
        className: 'attack-source',
        html: `<div style="
          width: 8px;
          height: 8px;
          background: ${color};
          border: 1px solid ${color};
          border-radius: 50%;
          box-shadow: 0 0 8px ${color};
        "></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5]
      });

      // Add target marker
      const targetIcon = L.divIcon({
        className: 'attack-target',
        html: `<div style="
          width: 10px;
          height: 10px;
          background: transparent;
          border: 2px solid ${color};
          border-radius: 50%;
          box-shadow: 0 0 12px ${color};
          animation: pulse 1.5s infinite;
        "></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7]
      });

      // Add markers
      const sourceMarker = L.marker(flow.source, { icon: sourceIcon }).addTo(map.current!);
      const targetMarker = L.marker(flow.target, { icon: targetIcon }).addTo(map.current!);

      // Add connection line
      const line = L.polyline([flow.source, flow.target], {
        color: color,
        weight: 2,
        opacity: 0.6,
        dashArray: '5, 10'
      }).addTo(map.current!);

      // Add popup to target marker
      targetMarker.bindPopup(`
        <div style="background: hsl(var(--card)); padding: 12px; border-radius: 6px; border: 1px solid hsl(var(--border)); color: hsl(var(--foreground));">
          <div style="color: ${color}; font-weight: bold; margin-bottom: 4px;">${flow.attackType} Attack</div>
          <div style="font-size: 12px; color: hsl(var(--primary)); margin-bottom: 2px;">Attribution: ${flow.attribution}</div>
          <div style="font-size: 10px; color: hsl(var(--muted-foreground)); margin-bottom: 1px;">${flow.sourceCountry} → ${flow.targetCountry}</div>
          <div style="font-size: 10px; color: hsl(var(--muted-foreground)); margin-bottom: 1px;">Level: ${flow.threatLevel}</div>
          <div style="font-size: 10px; color: hsl(var(--muted-foreground));">${flow.timestamp.toLocaleString()}</div>
        </div>
      `);
    });
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'critical': return '#ff0040';
      case 'high': return '#ff6600';
      case 'medium': return '#ffcc00';
      case 'low': return '#00ff80';
      default: return '#00ffff';
    }
  };

  return (
    <Card className="cyber-border h-full">
      <CardHeader>
        <CardTitle className="text-cyber-green flex items-center justify-between">
          Global Threat Attribution Map
          <div className="text-sm font-normal space-x-4">
            <span className="text-cyber-cyan">{threats.length} Threats</span>
            <span className="text-cyber-red">{attackFlows.length} Attack Flows</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[400px]">
        <div ref={mapContainer} className="w-full h-full rounded-b-lg" />
      </CardContent>
    </Card>
  );
};

export default ThreatMap;