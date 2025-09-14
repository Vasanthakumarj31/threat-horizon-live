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
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(true);
  const [threats, setThreats] = useState<ThreatLocation[]>([]);
  const [attackFlows, setAttackFlows] = useState<AttackFlow[]>([]);

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

  const addAttackFlowsToMap = (attackFlowData: AttackFlow[]) => {
    if (!map.current) return;

    attackFlowData.forEach((flow) => {
      const color = getThreatColor(flow.threatLevel);
      
      // Add source marker
      const sourceMarker = document.createElement('div');
      sourceMarker.className = 'attack-source';
      sourceMarker.style.cssText = `
        width: 8px;
        height: 8px;
        background: ${color};
        border: 1px solid ${color};
        border-radius: 50%;
        box-shadow: 0 0 8px ${color};
      `;

      // Add target marker
      const targetMarker = document.createElement('div');
      targetMarker.className = 'attack-target';
      targetMarker.style.cssText = `
        width: 10px;
        height: 10px;
        background: transparent;
        border: 2px solid ${color};
        border-radius: 50%;
        box-shadow: 0 0 12px ${color};
        animation: pulse 1.5s infinite;
      `;

      // Create flow popup
      const flowPopup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="bg-card p-3 rounded cyber-border">
          <div class="text-cyber-red font-bold">${flow.attackType} Attack</div>
          <div class="text-sm text-cyber-orange">Attribution: ${flow.attribution}</div>
          <div class="text-xs text-muted-foreground">${flow.sourceCountry} → ${flow.targetCountry}</div>
          <div class="text-xs text-muted-foreground">Level: ${flow.threatLevel}</div>
          <div class="text-xs text-muted-foreground">${flow.timestamp.toLocaleString()}</div>
        </div>
      `);

      // Add markers to map
      new mapboxgl.Marker(sourceMarker)
        .setLngLat(flow.source)
        .addTo(map.current!);

      new mapboxgl.Marker(targetMarker)
        .setLngLat(flow.target)
        .setPopup(flowPopup)
        .addTo(map.current!);

      // Add connection line using map source and layer
      const lineId = `attack-line-${flow.id}`;
      
      map.current!.addSource(lineId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [flow.source, flow.target]
          }
        }
      });

      map.current!.addLayer({
        id: lineId,
        type: 'line',
        source: lineId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': color,
          'line-width': 2,
          'line-opacity': 0.6,
          'line-dasharray': [2, 4]
        }
      });
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