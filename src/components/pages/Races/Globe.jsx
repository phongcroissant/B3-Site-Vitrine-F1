import { useMemo, useRef, useState } from "react";
import { useFetch } from "../../../hooks/useFetch";

const RADIUS = 200;
const SIZE = RADIUS * 2 + 40;
const CENTER = SIZE / 2;

// GeoJSON basse resolution des terres (continents), directement exploitable.
const LAND_URL =
  "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/110m/physical/ne_110m_land.json";

const deg2rad = (d) => (d * Math.PI) / 180;

// Projection orthographique : place un point (lat, lon) sur le disque du globe
// selon la rotation courante (lambda = longitude, phi = latitude du centre).
function project(lat, lon, lambda, phi) {
  const la = deg2rad(lat);
  const lo = deg2rad(lon) - deg2rad(lambda);
  const p = deg2rad(phi);

  const cosc =
    Math.sin(p) * Math.sin(la) + Math.cos(p) * Math.cos(la) * Math.cos(lo);

  const x = Math.cos(la) * Math.sin(lo);
  const y = Math.cos(p) * Math.sin(la) - Math.sin(p) * Math.cos(la) * Math.cos(lo);

  return {
    x: CENTER + x * RADIUS,
    y: CENTER - y * RADIUS,
    visible: cosc >= 0, // face cachée du globe -> on n'affiche pas
  };
}

// Variante pour les polygones de terre : les sommets de la face cachée sont
// rabattus sur le bord du globe afin que les contours qui franchissent
// l'horizon restent cohérents (le tout est ensuite découpé au disque).
function projectLand(lat, lon, lambda, phi) {
  const la = deg2rad(lat);
  const lo = deg2rad(lon) - deg2rad(lambda);
  const p = deg2rad(phi);

  const cosc =
    Math.sin(p) * Math.sin(la) + Math.cos(p) * Math.cos(la) * Math.cos(lo);

  const x = Math.cos(la) * Math.sin(lo);
  const y = Math.cos(p) * Math.sin(la) - Math.sin(p) * Math.cos(la) * Math.cos(lo);

  if (cosc >= 0) {
    return { x: CENTER + x * RADIUS, y: CENTER - y * RADIUS };
  }
  const m = Math.hypot(x, y) || 1;
  return { x: CENTER + (x / m) * RADIUS, y: CENTER - (y / m) * RADIUS };
}

// Transforme les features GeoJSON (Polygon / MultiPolygon) en chemins SVG.
function buildLand(geo, lambda, phi) {
  if (!geo?.features) return [];
  const paths = [];

  const ringToPath = (ring) => {
    let d = "";
    ring.forEach(([lon, lat], i) => {
      const { x, y } = projectLand(lat, lon, lambda, phi);
      d += `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return d + "Z";
  };

  geo.features.forEach((f) => {
    const { type, coordinates } = f.geometry || {};
    if (type === "Polygon") {
      coordinates.forEach((ring) => paths.push(ringToPath(ring)));
    } else if (type === "MultiPolygon") {
      coordinates.forEach((poly) =>
        poly.forEach((ring) => paths.push(ringToPath(ring))),
      );
    }
  });
  return paths;
}

// Lignes du quadrillage (méridiens + parallèles) pour donner du relief à la rotation.
function buildGraticule(lambda, phi) {
  const lines = [];

  const sample = (points) => {
    let current = [];
    points.forEach((p) => {
      if (p.visible) {
        current.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
      } else if (current.length) {
        lines.push(current.join(" "));
        current = [];
      }
    });
    if (current.length) lines.push(current.join(" "));
  };

  for (let lon = -180; lon <= 180; lon += 30) {
    const pts = [];
    for (let lat = -90; lat <= 90; lat += 4) pts.push(project(lat, lon, lambda, phi));
    sample(pts);
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const pts = [];
    for (let lon = -180; lon <= 180; lon += 4) pts.push(project(lat, lon, lambda, phi));
    sample(pts);
  }
  return lines;
}

export default function Globe({ races, selected, onSelect }) {
  const [rotation, setRotation] = useState({ lambda: 0, phi: -20 });
  const drag = useRef(null);

  const points = useMemo(
    () =>
      races
        .map((race) => {
          const loc = race.Circuit?.Location;
          if (!loc) return null;
          return {
            round: race.round,
            name: race.raceName,
            lat: parseFloat(loc.lat),
            lon: parseFloat(loc.long),
          };
        })
        .filter((p) => p && !Number.isNaN(p.lat) && !Number.isNaN(p.lon)),
    [races],
  );

  const { data: landGeo } = useFetch(LAND_URL);

  const land = useMemo(
    () => buildLand(landGeo, rotation.lambda, rotation.phi),
    [landGeo, rotation],
  );

  const graticule = useMemo(
    () => buildGraticule(rotation.lambda, rotation.phi),
    [rotation],
  );

  const getXY = (e) => {
    const t = e.touches?.[0];
    return { x: t ? t.clientX : e.clientX, y: t ? t.clientY : e.clientY };
  };

  const onDown = (e) => {
    const { x, y } = getXY(e);
    drag.current = { x, y, lambda: rotation.lambda, phi: rotation.phi };
  };

  const onMove = (e) => {
    if (!drag.current) return;
    const { x, y } = getXY(e);
    const dx = x - drag.current.x;
    const dy = y - drag.current.y;
    setRotation({
      lambda: drag.current.lambda + dx * 0.4,
      phi: Math.max(-90, Math.min(90, drag.current.phi - dy * 0.4)),
    });
  };

  const onUp = () => {
    drag.current = null;
  };

  // Centre le globe sur un circuit donné (au clic dans la liste).
  const focusCircuit = (p) => {
    setRotation({ lambda: p.lon, phi: p.lat });
    onSelect?.(p.round);
  };

  return (
    <div className="flex justify-center">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-md cursor-grab active:cursor-grabbing touch-none select-none"
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={onUp}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
      >
        <defs>
          <radialGradient id="ocean" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#0b1f4d" />
          </radialGradient>
          <clipPath id="globe-clip">
            <circle cx={CENTER} cy={CENTER} r={RADIUS} />
          </clipPath>
        </defs>

        <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="url(#ocean)" />

        <g clipPath="url(#globe-clip)">
          {land.map((d, i) => (
            <path key={i} d={d} fill="#15803d" stroke="#166534" strokeWidth="0.5" />
          ))}
        </g>

        {graticule.map((pts, i) => (
          <polyline
            key={i}
            points={pts}
            fill="none"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1"
          />
        ))}

        {points.map((p) => {
          const { x, y, visible } = project(p.lat, p.lon, rotation.lambda, rotation.phi);
          if (!visible) return null;
          const isSelected = String(selected) === String(p.round);
          return (
            <g key={p.round} onClick={() => focusCircuit(p)} className="cursor-pointer">
              <circle
                cx={x}
                cy={y}
                r={isSelected ? 7 : 4}
                fill={isSelected ? "#facc15" : "#ef4444"}
                stroke="#fff"
                strokeWidth="1.5"
              />
              {isSelected && (
                <text
                  x={x + 10}
                  y={y + 4}
                  fontSize="12"
                  fill="#fff"
                  style={{ paintOrder: "stroke" }}
                  stroke="#000"
                  strokeWidth="0.6"
                >
                  {p.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
