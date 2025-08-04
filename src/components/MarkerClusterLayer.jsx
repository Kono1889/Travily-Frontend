// src/components/MarkerClusterLayer.jsx
import { useEffect } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useMap } from "react-leaflet";

const MarkerClusterLayer = ({ markers }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !markers.length) return;

    const markerGroup = L.markerClusterGroup();

    markers.forEach((place) => {
      const marker = L.marker([place.lat, place.lon]);
      const popupContent = `
        <strong>${place.name || "Unnamed Place"}</strong><br />
        ${place.address || place.description || "No info"}
        ${place.image ? `<br /><img src="${place.image}" style="margin-top:8px;width:100%;border-radius:6px;" />` : ""}
      `;
      marker.bindPopup(popupContent);
      markerGroup.addLayer(marker);
    });

    map.addLayer(markerGroup);

    return () => {
      map.removeLayer(markerGroup);
    };
  }, [map, markers]);

  return null;
};

export default MarkerClusterLayer;
