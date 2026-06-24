import { useEffect, useMemo, useRef } from "react";
import { useFetch } from "../../../hooks/useFetch";

const SIZE = 460; // résolution logique du canvas
const CENTER = SIZE / 2;
const R = SIZE * 0.42;

// GeoJSON basse résolution des terres (continents).
const LAND_URL =
  "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/master/110m/physical/ne_110m_land.json";

const deg2rad = (d) => (d * Math.PI) / 180;

// lat/lon -> vecteur unitaire (lon=0,lat=0 face à la caméra, axe +z)
function toVec(lat, lon) {
  const la = deg2rad(lat);
  const lo = deg2rad(lon);
  return {
    x: Math.cos(la) * Math.sin(lo),
    y: Math.sin(la),
    z: Math.cos(la) * Math.cos(lo),
  };
}

// rotation du globe : spin longitude (lambda) puis inclinaison (phi)
function rotate(v, lambda, phi) {
  const x1 = v.x * Math.cos(lambda) + v.z * Math.sin(lambda);
  const z1 = -v.x * Math.sin(lambda) + v.z * Math.cos(lambda);
  const y2 = v.y * Math.cos(phi) - z1 * Math.sin(phi);
  const z2 = v.y * Math.sin(phi) + z1 * Math.cos(phi);
  return { x: x1, y: y2, z: z2 };
}

// projection orthographique vers l'écran ; z>0 = face visible
function project(v) {
  return { sx: CENTER + v.x * R, sy: CENTER - v.y * R, z: v.z };
}

// interpolation sphérique (great-circle) entre deux vecteurs unitaires
function slerp(a, b, t) {
  let dot = a.x * b.x + a.y * b.y + a.z * b.z;
  dot = Math.max(-1, Math.min(1, dot));
  const omega = Math.acos(dot);
  if (omega < 1e-6) return { ...a };
  const s = Math.sin(omega);
  const k0 = Math.sin((1 - t) * omega) / s;
  const k1 = Math.sin(t * omega) / s;
  return {
    x: a.x * k0 + b.x * k1,
    y: a.y * k0 + b.y * k1,
    z: a.z * k0 + b.z * k1,
  };
}

export default function Globe({ races, selected, onSelect }) {
  const canvasRef = useRef(null);
  const { data: landGeo } = useFetch(LAND_URL);

  // refs partagées avec la boucle d'animation
  const landRef = useRef(null);
  const selectedRef = useRef(selected);
  const onSelectRef = useRef(onSelect);
  const rotRef = useRef({ lambda: 0, phi: deg2rad(-18) });
  const dragRef = useRef(null);
  const hitsRef = useRef([]); // points projetés pour le clic

  useEffect(() => {
    landRef.current = landGeo;
  }, [landGeo]);
  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  // circuits -> points (vecteur géographique + métadonnées)
  const points = useMemo(
    () =>
      (races || [])
        .map((race) => {
          const loc = race.Circuit?.Location;
          if (!loc) return null;
          const lat = parseFloat(loc.lat);
          const lon = parseFloat(loc.long);
          if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
          return { round: race.round, name: race.raceName, lat, lon, vec: toVec(lat, lon) };
        })
        .filter(Boolean),
    [races],
  );

  // arcs : on relie les circuits dans l'ordre du calendrier (tour du monde F1)
  const arcs = useMemo(() => {
    const sorted = [...points].sort((a, b) => Number(a.round) - Number(b.round));
    const list = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      list.push({ a: sorted[i].vec, b: sorted[i + 1].vec, offset: i / Math.max(1, sorted.length) });
    }
    return list;
  }, [points]);

  // recentre le globe quand un circuit est sélectionné depuis la liste
  useEffect(() => {
    selectedRef.current = selected;
    if (selected == null) return;
    const p = points.find((q) => String(q.round) === String(selected));
    if (p) rotRef.current = { lambda: -deg2rad(p.lon), phi: deg2rad(p.lat) };
  }, [selected, points]);

  // boucle de rendu
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // grille de points (dot-matrix)
    const dots = [];
    for (let lat = -84; lat <= 84; lat += 6) {
      const ring = Math.max(4, Math.round(Math.cos(deg2rad(lat)) * 56));
      for (let i = 0; i < ring; i++) dots.push(toVec(lat, (i / ring) * 360 - 180));
    }

    let raf;
    const start = performance.now();

    const draw = (now) => {
      // rotation auto sauf pendant un drag ou si un circuit est sélectionné
      if (!dragRef.current && selectedRef.current == null) {
        rotRef.current.lambda += 0.0016;
      }
      const L = rotRef.current.lambda;
      const P = rotRef.current.phi;
      const t = (now - start) / 1000;

      ctx.clearRect(0, 0, SIZE, SIZE);

      // halo
      const halo = ctx.createRadialGradient(CENTER, CENTER, R * 0.55, CENTER, CENTER, R * 1.18);
      halo.addColorStop(0, "rgba(30,42,72,0.45)");
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(CENTER, CENTER, R * 1.18, 0, Math.PI * 2);
      ctx.fill();

      // points de la sphère
      for (const d of dots) {
        const v = rotate(d, L, P);
        if (v.z < -0.05) continue;
        const p = project(v);
        const depth = (v.z + 1) / 2;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, 0.9, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(150,170,210,${0.1 + depth * 0.38})`;
        ctx.fill();
      }

      // contours des continents
      const geo = landRef.current;
      if (geo?.features) {
        ctx.strokeStyle = "rgba(160,180,220,0.35)";
        ctx.lineWidth = 0.8;
        const drawRing = (ring) => {
          ctx.beginPath();
          let started = false;
          for (const [lon, lat] of ring) {
            const v = rotate(toVec(lat, lon), L, P);
            const p = project(v);
            if (v.z < 0) {
              started = false;
              continue;
            }
            if (!started) {
              ctx.moveTo(p.sx, p.sy);
              started = true;
            } else ctx.lineTo(p.sx, p.sy);
          }
          ctx.stroke();
        };
        for (const f of geo.features) {
          const g = f.geometry;
          if (!g) continue;
          if (g.type === "Polygon") g.coordinates.forEach(drawRing);
          else if (g.type === "MultiPolygon")
            g.coordinates.forEach((poly) => poly.forEach(drawRing));
        }
      }

      // arcs rouges animés
      const STEPS = 56;
      const cycle = 4.2;
      ctx.lineWidth = 1.6;
      for (const arc of arcs) {
        const local = (((t / cycle + arc.offset) % 1) + 1) % 1;
        let head, tail, alpha;
        if (local < 0.6) {
          head = local / 0.6;
          tail = 0;
          alpha = 1;
        } else if (local < 0.82) {
          head = 1;
          tail = 0;
          alpha = 1;
        } else {
          head = 1;
          tail = (local - 0.82) / 0.18;
          alpha = 1 - (local - 0.82) / 0.18;
        }
        for (let i = 0; i < STEPS; i++) {
          const f0 = i / STEPS;
          const f1 = (i + 1) / STEPS;
          if (f1 < tail || f0 > head) continue;
          const e0 = 1 + 0.22 * Math.sin(Math.PI * f0);
          const e1 = 1 + 0.22 * Math.sin(Math.PI * f1);
          const s0 = rotate(slerp(arc.a, arc.b, f0), L, P);
          const s1 = rotate(slerp(arc.a, arc.b, f1), L, P);
          if (s0.z < -0.1 && s1.z < -0.1) continue;
          const p0 = project({ x: s0.x * e0, y: s0.y * e0, z: s0.z });
          const p1 = project({ x: s1.x * e1, y: s1.y * e1, z: s1.z });
          const glow = head - f1 < 0.06 ? 1 : 0.5;
          ctx.strokeStyle = `rgba(255,${40 + glow * 70},${40 + glow * 40},${alpha * glow})`;
          ctx.beginPath();
          ctx.moveTo(p0.sx, p0.sy);
          ctx.lineTo(p1.sx, p1.sy);
          ctx.stroke();
        }
      }

      // points circuits (clic) + sélection
      const hits = [];
      for (const pt of points) {
        const v = rotate(pt.vec, L, P);
        if (v.z < 0) continue;
        const p = project(v);
        const isSel = String(selectedRef.current) === String(pt.round);
        hits.push({ round: pt.round, sx: p.sx, sy: p.sy });
        const radius = isSel ? 8 : 6;
        const g = ctx.createRadialGradient(p.sx, p.sy, 0, p.sx, p.sy, radius);
        const color = isSel ? "250,204,21" : "255,60,60";
        g.addColorStop(0, `rgba(${color},0.95)`);
        g.addColorStop(1, `rgba(${color},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, isSel ? 2.6 : 2, 0, Math.PI * 2);
        ctx.fillStyle = isSel ? "#fff" : "rgba(255,210,210,1)";
        ctx.fill();
        if (isSel) {
          ctx.font = "12px sans-serif";
          ctx.fillStyle = "#fff";
          ctx.strokeStyle = "rgba(0,0,0,0.7)";
          ctx.lineWidth = 3;
          ctx.strokeText(pt.name, p.sx + 10, p.sy + 4);
          ctx.fillText(pt.name, p.sx + 10, p.sy + 4);
        }
      }
      hitsRef.current = hits;

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [points, arcs]);

  // --- interactions ---------------------------------------------------------
  const localXY = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const src = e.touches?.[0] || e;
    return {
      x: ((src.clientX - rect.left) / rect.width) * SIZE,
      y: ((src.clientY - rect.top) / rect.height) * SIZE,
    };
  };

  const onDown = (e) => {
    const src = e.touches?.[0] || e;
    dragRef.current = {
      x: src.clientX,
      y: src.clientY,
      lambda: rotRef.current.lambda,
      phi: rotRef.current.phi,
      moved: 0,
    };
  };

  const onMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    const src = e.touches?.[0] || e;
    const dx = src.clientX - d.x;
    const dy = src.clientY - d.y;
    d.moved = Math.max(d.moved, Math.abs(dx) + Math.abs(dy));
    rotRef.current = {
      lambda: d.lambda + dx * 0.006,
      phi: Math.max(-deg2rad(80), Math.min(deg2rad(80), d.phi - dy * 0.006)),
    };
  };

  const onUp = (e) => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d || d.moved > 6) return; // c'était un drag, pas un clic
    const { x, y } = localXY(e);
    let best = null;
    for (const h of hitsRef.current) {
      const dist = Math.hypot(h.sx - x, h.sy - y);
      if (dist < 12 && (!best || dist < best.dist)) best = { round: h.round, dist };
    }
    if (best) onSelectRef.current?.(best.round);
  };

  return (
    <div className="flex justify-center">
      <canvas
        ref={canvasRef}
        style={{ width: "100%", maxWidth: 420, aspectRatio: "1 / 1", touchAction: "none" }}
        className="cursor-grab active:cursor-grabbing select-none"
        onMouseDown={onDown}
        onMouseMove={onMove}
        onMouseUp={onUp}
        onMouseLeave={() => (dragRef.current = null)}
        onTouchStart={onDown}
        onTouchMove={onMove}
        onTouchEnd={onUp}
      />
    </div>
  );
}
