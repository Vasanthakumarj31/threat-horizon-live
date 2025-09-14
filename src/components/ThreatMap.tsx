import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ThreatLocation {
  id: string;
  coordinates: [number, number];
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  threatType: string;
  country: string;
  timestamp: Date;
}

const ThreatMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [threats, setThreats] = useState<ThreatLocation[]>([]);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: 'globe' as any,
      zoom: 1.5,
      center: [0, 20],
      pitch: 0,
    });

    // Add navigation controls with cyber styling
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add glow effects and atmosphere
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(0, 50, 50)',
        'high-color': 'rgb(0, 100, 100)',
        'horizon-blend': 0.1,
      });
    });

    setShowTokenInput(false);
    generateThreats();
  };

  const generateThreats = () => {
    const threatTypes = ['Malware', 'DDoS', 'Phishing', 'Ransomware', 'Data Breach', 'SQL Injection'];
    const threatLevels: ('low' | 'medium' | 'high' | 'critical')[] = ['low', 'medium', 'high', 'critical'];
    
    const newThreats: ThreatLocation[] = Array.from({ length: 50 }, (_, i) => ({
      id: `threat-${i}`,
      coordinates: [
        (Math.random() - 0.5) * 360,
        (Math.random() - 0.5) * 180
      ],
      threatLevel: threatLevels[Math.floor(Math.random() * threatLevels.length)],
      threatType: threatTypes[Math.floor(Math.random() * threatTypes.length)],
      country: 'Unknown',
      timestamp: new Date(Date.now() - Math.random() * 86400000)
    }));

    setThreats(newThreats);
    addThreatsToMap(newThreats);
  };

  const addThreatsToMap = (threatData: ThreatLocation[]) => {
    if (!map.current) return;

    // Add threat markers
    threatData.forEach((threat) => {
      const color = getThreatColor(threat.threatLevel);
      
      // Create custom marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'threat-marker';
      markerEl.style.cssText = `
        width: 12px;
        height: 12px;
        background: ${color};
        border: 2px solid ${color}40;
        border-radius: 50%;
        box-shadow: 0 0 10px ${color}80;
        animation: pulse 2s infinite;
      `;

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="bg-card p-3 rounded cyber-border">
          <div class="text-cyber-green font-bold">${threat.threatType}</div>
          <div class="text-sm text-muted-foreground">Level: ${threat.threatLevel}</div>
          <div class="text-xs text-muted-foreground">${threat.timestamp.toLocaleString()}</div>
        </div>
      `);

      new mapboxgl.Marker(markerEl)
        .setLngLat(threat.coordinates)
        .setPopup(popup)
        .addTo(map.current!);
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

  useEffect(() => {
    // Cleanup function
    return () => {
      map.current?.remove();
    };
  }, []);

  if (showTokenInput) {
    return (
      <Card className="cyber-border h-full">
        <CardHeader>
          <CardTitle className="text-cyber-green">Global Threat Map</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Enter your Mapbox public token to view the global threat map.
            Get your token at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-cyber-cyan hover:underline">mapbox.com</a>
          </p>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="pk.eyJ1IjoiZXhhbXBsZS..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="bg-input border-cyber-green/30"
            />
            <Button 
              onClick={initializeMap}
              disabled={!mapboxToken}
              variant="outline"
              className="border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-background"
            >
              Initialize
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="cyber-border h-full">
      <CardHeader>
        <CardTitle className="text-cyber-green flex items-center justify-between">
          Global Threat Map
          <span className="text-sm font-normal text-cyber-cyan">
            {threats.length} Active Threats
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 h-[400px]">
        <div ref={mapContainer} className="w-full h-full rounded-b-lg" />
      </CardContent>
    </Card>
  );
};

export default ThreatMap;