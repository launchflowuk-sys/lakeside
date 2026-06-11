import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import "./CoverageMap.css";

const hotspots = [
  { name: "Grays",            lat: 51.4752, lng: 0.3232, desc: "Town centre, station & surrounding streets", major: true,  href: "/areas/grays" },
  { name: "Purfleet",         lat: 51.4782, lng: 0.2372, desc: "Riverside area & Purfleet-on-Thames",        major: false, href: "/areas/purfleet" },
  { name: "Chafford Hundred", lat: 51.4891, lng: 0.2963, desc: "Lakeside shopping & residential",            major: true,  href: "/areas/chafford-hundred" },
  { name: "Tilbury",          lat: 51.4626, lng: 0.3584, desc: "Docks, cruise terminal & town centre",        major: false, href: "/areas/tilbury" },
  { name: "South Ockendon",   lat: 51.5116, lng: 0.2953, desc: "Residential estates & village",              major: false, href: "/areas/south-ockendon" },
  { name: "Aveley",           lat: 51.5022, lng: 0.2663, desc: "Village & surrounding area",                 major: false, href: "/areas/aveley" },
  { name: "West Thurrock",    lat: 51.4878, lng: 0.2732, desc: "Retail parks & Stonehouse Corner",           major: false, href: "/areas/west-thurrock" },
  { name: "Stanford-le-Hope", lat: 51.5147, lng: 0.4248, desc: "Town centre & station",                      major: false, href: "/areas/stanford-le-hope" },
  { name: "Corringham",       lat: 51.5130, lng: 0.4005, desc: "Town & surrounding villages",                major: false, href: "/areas/corringham" },
];

const MAP_H = 480;

export default function CoverageMap() {
  // placeholderRef: always-rendered, used to measure available width synchronously
  const placeholderRef = useRef<HTMLDivElement>(null);
  // mapDivRef: the actual Leaflet container, created by us with explicit px dimensions
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const mapRef    = useRef<LeafletMap | null>(null);

  useEffect(() => {
    const placeholder = placeholderRef.current;
    if (!placeholder || mapRef.current) return;

    let destroyed = false;
    let map: LeafletMap | null = null;

    // Read the placeholder's width — it is a block-level div so its offsetWidth
    // is already determined by the CSS layout engine at this point.
    const containerW = placeholder.offsetWidth;

    // Create the Leaflet div with explicit px dimensions so Leaflet measures correctly
    const el = document.createElement("div");
    el.style.width  = `${containerW}px`;
    el.style.height = `${MAP_H}px`;
    el.style.position = "relative"; // for popup absolute positioning
    placeholder.replaceWith(el);
    mapDivRef.current = el;

    import("leaflet").then((mod) => {
      if (destroyed || !el.isConnected) return;
      const L = mod.default ?? mod;

      map = L.map(el, {
        center: [51.49, 0.34],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        preferCanvas: true,
      });
      mapRef.current = map;

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        { subdomains: "abcd", maxZoom: 19 }
      ).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Popup
      const popup = document.createElement("div");
      popup.className = "cmap-popup";
      popup.style.display = "none";
      el.appendChild(popup);

      let activeMarker: ReturnType<typeof L.circleMarker> | null = null;

      hotspots.forEach((spot) => {
        const r = spot.major ? 14 : 10;

        const marker = L.circleMarker([spot.lat, spot.lng], {
          radius: r,
          color: "#f5c518",
          weight: spot.major ? 2.5 : 2,
          fillColor: "#f5c518",
          fillOpacity: spot.major ? 0.42 : 0.22,
        }).addTo(map!);

        L.circleMarker([spot.lat, spot.lng], {
          radius: r + 8, color: "#f5c518", weight: 1,
          fillOpacity: 0, opacity: 0.18, interactive: false,
        }).addTo(map!);

        const showPopup = () => {
          const pt = map!.latLngToContainerPoint([spot.lat, spot.lng]);
          popup.innerHTML = `
            <div class="cmap-popup-name">${spot.name}</div>
            <div class="cmap-popup-desc">${spot.desc}</div>
            <a class="cmap-popup-link" href="${spot.href}">View area →</a>
          `;
          popup.style.display = "block";
          const popW = 200;
          let left = pt.x + 18;
          if (left + popW > el.offsetWidth - 10) left = pt.x - popW - 18;
          popup.style.left = `${Math.max(4, left)}px`;
          popup.style.top  = `${Math.max(8, pt.y - 16)}px`;
          if (activeMarker && activeMarker !== marker) {
            activeMarker.setStyle({ fillOpacity: 0.22, weight: 2 });
          }
          marker.setStyle({ fillOpacity: 0.9, weight: 3 });
          activeMarker = marker;
        };

        const hidePopup = () => {
          popup.style.display = "none";
          marker.setStyle({ fillOpacity: spot.major ? 0.42 : 0.22, weight: spot.major ? 2.5 : 2 });
          activeMarker = null;
        };

        marker.on("mouseover", showPopup);
        marker.on("mouseout", hidePopup);
        marker.on("click", (e) => { L.DomEvent.stopPropagation(e); showPopup(); });
      });

      map.on("click", () => { popup.style.display = "none"; });

      const onResize = () => {
        if (!destroyed && map && el.parentElement) {
          const newW = el.parentElement.offsetWidth;
          el.style.width = `${newW}px`;
          map.invalidateSize();
        }
      };
      window.addEventListener("resize", onResize);
      (el as any).__cleanup = () => window.removeEventListener("resize", onResize);
    });

    return () => {
      destroyed = true;
      const cleanup = (mapDivRef.current as any)?.__cleanup;
      if (cleanup) cleanup();
      map?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="cmap-section">
      <div className="cmap-legend">
        <div className="cmap-legend-dot cmap-legend-dot--major" />
        <span>Main hub</span>
        <div className="cmap-legend-dot" />
        <span>Coverage area</span>
      </div>
      {/* placeholder measured synchronously; replaced by the Leaflet div in useEffect */}
      <div ref={placeholderRef} className="cmap-placeholder" />
      <p className="cmap-credit">
        Map © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors, © <a href="https://carto.com/" target="_blank" rel="noopener">CARTO</a>
      </p>
    </div>
  );
}
