import { useEffect, useRef, useState } from 'react';

interface Destination {
  id: string;
  arrival: number;
  departure: number;
  city: string;
  region: string;
  location: {
    lat: number;
    lng: number;
  };
  population?: number;
}

interface SantaTracker3DProps {
  currentDestination: Destination | null;
  route: Destination[];
  santaInfo: any;
}

export default function SantaTracker3D({ currentDestination, route, santaInfo }: SantaTracker3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.5);
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      render(ctx, canvas.width, canvas.height);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [rotation, zoom, currentDestination, route]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    
    const deltaX = e.clientX - lastMouse.current.x;
    const deltaY = e.clientY - lastMouse.current.y;
    
    setRotation(prev => ({
      x: prev.x + deltaY * 0.005,
      y: prev.y + deltaX * 0.005,
    }));
    
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => Math.max(0.5, Math.min(3, prev - e.deltaY * 0.001)));
  };

  const handleRecenter = () => {
    if (currentDestination) {
      const lat = (currentDestination.location.lat * Math.PI) / 180;
      const lng = (currentDestination.location.lng * Math.PI) / 180;
      setRotation({ x: -lat, y: lng });
      setZoom(2);
    }
  };

  const latLngToXYZ = (lat: number, lng: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    
    return { x, y, z };
  };

  const project3DTo2D = (x: number, y: number, z: number, width: number, height: number) => {
    const cosX = Math.cos(rotation.x);
    const sinX = Math.sin(rotation.x);
    const cosY = Math.cos(rotation.y);
    const sinY = Math.sin(rotation.y);

    let y1 = y * cosX - z * sinX;
    let z1 = y * sinX + z * cosX;

    let x2 = x * cosY - z1 * sinY;
    let z2 = x * sinY + z1 * cosY;

    const scale = 200 * zoom;
    const x2d = width / 2 + x2 * scale;
    const y2d = height / 2 - y1 * scale;
    
    return { x: x2d, y: y2d, z: z2 };
  };

  const render = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, width, height);

    drawStars(ctx, width, height);

    const earthRadius = 1;
    drawGlobe(ctx, width, height, earthRadius);

    if (route.length > 0) {
      drawRoute(ctx, width, height, earthRadius);
    }

    if (currentDestination) {
      drawSanta(ctx, width, height, earthRadius);
    }

    drawAtmosphere(ctx, width, height, earthRadius);
  };

  const drawStars = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 2;
      ctx.globalAlpha = Math.random() * 0.8 + 0.2;
      ctx.fillRect(x, y, size, size);
    }
    ctx.globalAlpha = 1;
  };

  const drawGlobe = (ctx: CanvasRenderingContext2D, width: number, height: number, radius: number) => {
    const segments = 32;
    const rings = 16;

    const now = Date.now() / 1000;
    const dayNightRotation = ((now % 86400) / 86400) * Math.PI * 2;

    for (let ring = 0; ring < rings; ring++) {
      for (let seg = 0; seg < segments; seg++) {
        const lat1 = -90 + (ring * 180) / rings;
        const lat2 = -90 + ((ring + 1) * 180) / rings;
        const lng1 = -180 + (seg * 360) / segments;
        const lng2 = -180 + ((seg + 1) * 360) / segments;

        const p1 = latLngToXYZ(lat1, lng1, radius);
        const p2 = latLngToXYZ(lat1, lng2, radius);
        const p3 = latLngToXYZ(lat2, lng2, radius);
        const p4 = latLngToXYZ(lat2, lng1, radius);

        const proj1 = project3DTo2D(p1.x, p1.y, p1.z, width, height);
        const proj2 = project3DTo2D(p2.x, p2.y, p2.z, width, height);
        const proj3 = project3DTo2D(p3.x, p3.y, p3.z, width, height);
        const proj4 = project3DTo2D(p4.x, p4.y, p4.z, width, height);

        if (proj1.z > 0 || proj2.z > 0 || proj3.z > 0 || proj4.z > 0) continue;

        const avgZ = (proj1.z + proj2.z + proj3.z + proj4.z) / 4;
        const isLit = Math.cos(lng1 * (Math.PI / 180) + dayNightRotation) > 0;
        
        const baseColor = isLit ? { r: 40, g: 80, b: 140 } : { r: 10, g: 20, b: 40 };
        const brightness = Math.max(0.3, 1 + avgZ * 0.5);
        
        ctx.fillStyle = `rgb(${Math.floor(baseColor.r * brightness)}, ${Math.floor(baseColor.g * brightness)}, ${Math.floor(baseColor.b * brightness)})`;
        
        ctx.beginPath();
        ctx.moveTo(proj1.x, proj1.y);
        ctx.lineTo(proj2.x, proj2.y);
        ctx.lineTo(proj3.x, proj3.y);
        ctx.lineTo(proj4.x, proj4.y);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(100, 150, 200, 0.2)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  };

  const drawAtmosphere = (ctx: CanvasRenderingContext2D, width: number, height: number, radius: number) => {
    const center = project3DTo2D(0, 0, 0, width, height);
    const edge = project3DTo2D(radius, 0, 0, width, height);
    const atmosphereRadius = Math.abs(edge.x - center.x);

    const gradient = ctx.createRadialGradient(
      center.x, center.y, atmosphereRadius * 0.95,
      center.x, center.y, atmosphereRadius * 1.15
    );
    gradient.addColorStop(0, 'rgba(100, 150, 255, 0)');
    gradient.addColorStop(0.5, 'rgba(100, 150, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(100, 150, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(center.x, center.y, atmosphereRadius * 1.15, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawRoute = (ctx: CanvasRenderingContext2D, width: number, height: number, radius: number) => {
    if (!currentDestination) return;

    const currentIndex = route.findIndex(d => d.id === currentDestination.id);
    if (currentIndex === -1) return;

    const pastRoute = route.slice(0, currentIndex + 1);
    const futureRoute = route.slice(currentIndex);

    ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    drawRoutePath(ctx, width, height, radius, pastRoute);

    ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    drawRoutePath(ctx, width, height, radius, futureRoute);
    
    ctx.setLineDash([]);
  };

  const drawRoutePath = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    radius: number,
    destinations: Destination[]
  ) => {
    if (destinations.length < 2) return;

    ctx.beginPath();
    for (let i = 0; i < destinations.length; i++) {
      const dest = destinations[i];
      const pos = latLngToXYZ(dest.location.lat, dest.location.lng, radius * 1.01);
      const proj = project3DTo2D(pos.x, pos.y, pos.z, width, height);
      
      if (proj.z < 0) {
        if (i === 0) {
          ctx.moveTo(proj.x, proj.y);
        } else {
          ctx.lineTo(proj.x, proj.y);
        }
      }
    }
    ctx.stroke();
  };

  const drawSanta = (ctx: CanvasRenderingContext2D, width: number, height: number, radius: number) => {
    if (!currentDestination) return;

    const now = Date.now();
    const nextDestIndex = route.findIndex(d => d.arrival > now);
    
    let lat = currentDestination.location.lat;
    let lng = currentDestination.location.lng;

    if (nextDestIndex > 0) {
      const prevDest = route[nextDestIndex - 1];
      const nextDest = route[nextDestIndex];
      const progress = (now - prevDest.departure) / (nextDest.arrival - prevDest.departure);
      
      if (progress > 0 && progress < 1) {
        lat = prevDest.location.lat + (nextDest.location.lat - prevDest.location.lat) * progress;
        lng = prevDest.location.lng + (nextDest.location.lng - prevDest.location.lng) * progress;
      }
    }

    const pos = latLngToXYZ(lat, lng, radius * 1.05);
    const proj = project3DTo2D(pos.x, pos.y, pos.z, width, height);

    if (proj.z < 0) {
      const size = 40 * zoom;
      const bobOffset = Math.sin(Date.now() / 500) * 5;
      
      ctx.save();
      ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
      ctx.shadowBlur = 20;
      ctx.font = `${size}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🎅', proj.x, proj.y + bobOffset);
      ctx.restore();

      const trailLength = 50 * zoom;
      const gradient = ctx.createLinearGradient(
        proj.x - trailLength, proj.y,
        proj.x, proj.y
      );
      gradient.addColorStop(0, 'rgba(255, 215, 0, 0)');
      gradient.addColorStop(1, 'rgba(255, 215, 0, 0.3)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(proj.x - trailLength, proj.y - 5, trailLength, 10);
    }
  };

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
      <div className="absolute top-4 left-4 bg-black/60 text-white p-3 rounded-lg text-sm space-y-1">
        <p>🖱️ Drag to rotate</p>
        <p>🔍 Scroll to zoom</p>
        <button
          onClick={handleRecenter}
          className="mt-2 px-3 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-400 transition-colors"
        >
          Recenter on Santa
        </button>
      </div>
      {currentDestination && (
        <div className="absolute bottom-4 left-4 bg-black/60 text-white p-3 rounded-lg">
          <p className="font-bold">{currentDestination.city}</p>
          <p className="text-sm text-gray-300">{currentDestination.region}</p>
        </div>
      )}
    </div>
  );
}
