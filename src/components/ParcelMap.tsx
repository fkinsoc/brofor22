import React, { useEffect, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Parcel } from '../lib/data';

export default function ParcelMap({ parcel, allParcels }: { parcel?: Parcel, allParcels?: Parcel[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const apiKey = (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY || (process as any).env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 border border-zinc-800 p-6 text-center">
        <h3 className="text-white font-medium mb-2">Google Maps API Key Required</h3>
        <p className="text-sm text-zinc-400 mb-4">
          Please add VITE_GOOGLE_MAPS_API_KEY to your environment variables to enable the interactive map.
        </p>
      </div>
    );
  }

  // Single parcel mode
  if (parcel) {
    const color = parcel.riskLevel === 'High' ? '#ef4444' : parcel.riskLevel === 'Medium' ? '#f59e0b' : '#10b981';
    
    return (
      <APIProvider apiKey={apiKey}>
        <div style={{ height: '100%', width: '100%' }}>
          <Map
            defaultCenter={{ lat: parcel.lat, lng: parcel.lng }}
            defaultZoom={14}
            mapId="DEMO_MAP_ID"
            disableDefaultUI={true}
            internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
          >
            <AdvancedMarker position={{ lat: parcel.lat, lng: parcel.lng }}>
              <Pin background={color} borderColor="#ffffff" glyphColor="#ffffff" />
            </AdvancedMarker>
          </Map>
        </div>
      </APIProvider>
    );
  }

  // Multi-parcel mode
  if (allParcels && allParcels.length > 0) {
    const centerLat = allParcels.reduce((sum, p) => sum + p.lat, 0) / allParcels.length;
    const centerLng = allParcels.reduce((sum, p) => sum + p.lng, 0) / allParcels.length;

    return (
      <APIProvider apiKey={apiKey}>
        <div style={{ height: '100%', width: '100%' }}>
          <Map
            defaultCenter={{ lat: centerLat, lng: centerLng }}
            defaultZoom={11}
            mapId="DEMO_MAP_ID"
            disableDefaultUI={true}
            internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
          >
            {allParcels.map(p => {
              const color = p.riskLevel === 'High' ? '#ef4444' : p.riskLevel === 'Medium' ? '#f59e0b' : '#10b981';
              return (
                <AdvancedMarker key={p.id} position={{ lat: p.lat, lng: p.lng }} title={`${p.id} - ${p.riskLevel} Risk`}>
                  <Pin background={color} borderColor="#ffffff" glyphColor="#ffffff" scale={0.8} />
                </AdvancedMarker>
              );
            })}
          </Map>
        </div>
      </APIProvider>
    );
  }

  return null;
}
