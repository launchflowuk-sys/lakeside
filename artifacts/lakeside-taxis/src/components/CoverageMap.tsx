import { useEffect, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import "./CoverageMap.css";

const hotspots = [
  { name: "Grays",            lat: 51.4752, lng: 0.3232, desc: "Town centre, station & surrounding streets", major: true,  href: "/areas/grays" },
  { name: "Purfleet",         lat: 51.4782, lng: 0.2372, desc: "Riverside area & Purfleet-on-Thames",        major: false, href: "/areas/purfleet" },
  { name: "Chafford Hundred", lat: 51.4891, lng: 0.2963, desc: "Lakeside shopping & residential",            major: true,  href: "/areas/chafford-hundred" },
  { name: "Tilbury",          lat: 51.4626, lng: 0.3584, desc: "Docks, cruise terminal & town centre",       major: false, href: "/areas/tilbury" },
  { name: "South Ockendon",   lat: 51.5116, lng: 0.2953, desc: "Residential estates & village",              major: false, href: "/areas/south-ockendon" },
  { name: "Aveley",           lat: 51.5022, lng: 0.2663, desc: "Village & surrounding area",                 major: false, href: "/areas/aveley" },
  { name: "West Thurrock",    lat: 51.4878, lng: 0.2732, desc: "Retail parks & Stonehouse Corner",           major: false, href: "/areas/west-thurrock" },
  { name: "Stanford-le-Hope", lat: 51.5147, lng: 0.4248, desc: "Town centre & station",                     major: false, href: "/areas/stanford-le-hope" },
  { name: "Corringham",       lat: 51.5130, lng: 0.4005, desc: "Town & surrounding villages",                major: false, href: "/areas/corringham" },
];

const DARK_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: "geometry",           stylers: [{ color: "#1a1f2e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1f2e" }] },
  { elementType: "labels.text.fill",   stylers: [{ color: "#8a96a8" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d0c8b8" }] },
  { featureType: "poi",                stylers: [{ visibility: "off" }] },
  { featureType: "road",               elementType: "geometry",         stylers: [{ color: "#2a3140" }] },
  { featureType: "road",               elementType: "geometry.stroke",  stylers: [{ color: "#212a37" }] },
  { featureType: "road",               elementType: "labels.text.fill", stylers: [{ color: "#6c7a8a" }] },
  { featureType: "road.highway",       elementType: "geometry",         stylers: [{ color: "#3a4560" }] },
  { featureType: "road.highway",       elementType: "geometry.stroke",  stylers: [{ color: "#1f2835" }] },
  { featureType: "road.highway",       elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
  { featureType: "transit",            elementType: "geometry",         stylers: [{ color: "#2f3948" }] },
  { featureType: "transit.station",    elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "water",              elementType: "geometry",         stylers: [{ color: "#0f1921" }] },
  { featureType: "water",              elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "water",              elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] },
];

// Yellow circle SVG marker — no Map ID required, works with any API key
function makeMarkerIcon(major: boolean): google.maps.Icon {
  const size = major ? 20 : 14;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size * 2}" height="${size * 2}">
    <circle cx="${size}" cy="${size}" r="${size - 2}" fill="#f5c518" stroke="${major ? "#ffffff" : "#c9a010"}" stroke-width="2"/>
  </svg>`;
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(size * 2, size * 2),
    anchor: new google.maps.Point(size, size),
  };
}

const API_KEY = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "") as string;

export default function CoverageMap() {
  const mapDivRef  = useRef<HTMLDivElement>(null);
  const initialised = useRef(false);

  useEffect(() => {
    const el = mapDivRef.current;
    if (!el || initialised.current) return;
    initialised.current = true;
    let destroyed = false;

    if (!API_KEY) {
      el.innerHTML = `<div class="cmap-no-key">Map visible on live site — add <code>VITE_GOOGLE_MAPS_API_KEY</code> to your Coolify build args.</div>`;
      return;
    }

    setOptions({ key: API_KEY, v: "weekly" });

    importLibrary("maps").then(({ Map, InfoWindow }) => {
      if (destroyed || !mapDivRef.current) return;

      const map = new Map(mapDivRef.current, {
        center: { lat: 51.493, lng: 0.34 },
        zoom: 12,
        styles: DARK_STYLE,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_BOTTOM },
        gestureHandling: "cooperative",
      });

      let openWindow: google.maps.InfoWindow | null = null;

      for (const spot of hotspots) {
        const marker = new google.maps.Marker({
          map,
          position: { lat: spot.lat, lng: spot.lng },
          title: spot.name,
          icon: makeMarkerIcon(spot.major),
        });

        const infoWindow = new InfoWindow({
          content: `<div class="cmap-iw">
            <div class="cmap-iw-name">${spot.name}</div>
            <div class="cmap-iw-desc">${spot.desc}</div>
            <a class="cmap-iw-link" href="${spot.href}">View area &rarr;</a>
          </div>`,
        });

        marker.addListener("click", () => {
          openWindow?.close();
          infoWindow.open({ map, anchor: marker });
          openWindow = infoWindow;
        });
      }

      map.addListener("click", () => { openWindow?.close(); openWindow = null; });

    }).catch((err: unknown) => {
      console.error("[CoverageMap] Google Maps failed to load:", err);
      if (mapDivRef.current && !destroyed) {
        mapDivRef.current.innerHTML = `<div class="cmap-no-key">Map unavailable.</div>`;
      }
    });

    return () => { destroyed = true; };
  }, []);

  return (
    <div className="cmap-section">
      <div className="cmap-legend">
        <div className="cmap-legend-dot cmap-legend-dot--major" />
        <span>Main hub</span>
        <div className="cmap-legend-dot" />
        <span>Coverage area</span>
      </div>
      <div ref={mapDivRef} className="cmap-map" />
    </div>
  );
}
