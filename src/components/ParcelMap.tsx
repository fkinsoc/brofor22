import React, { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { Parcel } from "../lib/data";
function MarkerWithInfoWindow({ parcel }: { parcel: Parcel }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infoWindowShown, setInfoWindowShown] = useState(false);
  const color =
    parcel.riskLevel === "High"
      ? "#ef4444"
      : parcel.riskLevel === "Medium"
        ? "#f59e0b"
        : "#10b981";
  return (
    <>
      {" "}
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: parcel.lat, lng: parcel.lng }}
        title={`${parcel.id} - ${parcel.riskLevel} Risk`}
        onClick={() => setInfoWindowShown(true)}
      >
        {" "}
        <Pin
          background={color}
          borderColor="#ffffff"
          glyphColor="#ffffff"
          scale={0.8}
        />{" "}
      </AdvancedMarker>{" "}
      {infoWindowShown && (
        <InfoWindow
          anchor={marker}
          onCloseClick={() => setInfoWindowShown(false)}
          pixelOffset={[0, -5]}
        >
          {" "}
          <div className="text-zinc-900 p-1">
            {" "}
            <h4 className="font-bold text-sm mb-1">{parcel.id}</h4>{" "}
            <p className="text-xs mb-1">
              <strong>Owner:</strong> {parcel.landOwner}
            </p>{" "}
            <p className="text-xs mb-1">
              <strong>Area:</strong> {parcel.areaAcres} acres
            </p>{" "}
            <p className="text-xs">
              {" "}
              <strong>Risk:</strong>{" "}
              <span
                className={`ml-1 font-semibold ${parcel.riskLevel === "High" ? "text-zinc-900 dark:text-zinc-100" : parcel.riskLevel === "Medium" ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-900 dark:text-zinc-100"}`}
              >
                {" "}
                {parcel.riskLevel} ({parcel.riskScore}){" "}
              </span>{" "}
            </p>{" "}
          </div>{" "}
        </InfoWindow>
      )}{" "}
    </>
  );
}
export default function ParcelMap({
  parcel,
  allParcels,
}: {
  parcel?: Parcel;
  allParcels?: Parcel[];
}) {
  const [mounted, setMounted] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [loadingKey, setLoadingKey] = useState(true);
  useEffect(() => {
    setMounted(true);
    fetch("/api/config/maps")
      .then((res) => res.json())
      .then((data) => {
        setApiKey(data.apiKey || "");
        setLoadingKey(false);
      })
      .catch(() => setLoadingKey(false));
  }, []);
  if (!mounted || loadingKey)
    return (
      <div className="w-full h-full flex items-center justify-center bg-background-primary dark:bg-[#0A0A0A]">
        {" "}
        <div className="w-8 h-8 border-2 border-zinc-900 dark:border-zinc-100 border-t-transparent rounded-none"></div>{" "}
      </div>
    );
  if (!apiKey) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-background-primary dark:bg-[#0A0A0A] border border-border-subtle dark:border-zinc-800 p-6 text-center rounded-none">
        {" "}
        <h3 className="text-text-primary dark:text-white font-medium mb-2">
          Google Maps API Key Required
        </h3>{" "}
        <p className="text-sm text-zinc-800 dark:text-zinc-300 mb-4 max-w-md">
          {" "}
          Please add <code>VITE_GOOGLE_MAPS_API_KEY</code> to your environment
          secrets to enable the interactive map.{" "}
        </p>{" "}
        <a
          href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-900 dark:bg-zinc-100 text-text-primary dark:text-white text-xs font-bold py-2 px-4 rounded-none"
        >
          {" "}
          Get a Free Maps Demo Key{" "}
        </a>{" "}
      </div>
    );
  }
  
  // Single parcel mode
  if (parcel) {
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
            <MarkerWithInfoWindow parcel={parcel} />
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
            {allParcels.map(p => (
              <MarkerWithInfoWindow key={p.id} parcel={p} />
            ))}
          </Map>
        </div>
      </APIProvider>
    );
  }

  return null;
}