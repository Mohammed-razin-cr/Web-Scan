import { useEffect, useRef } from 'react';
import styled from '@emotion/styled';
import * as THREE from 'three';

/* ─── Container: right half of hero, never overlaps text ─── */
const Wrap = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 46%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 1100px) {
    width: 100%;
    height: 100%;
    opacity: 0.14;
    z-index: 0;
  }
  @media (max-width: 640px) {
    align-items: flex-start;
    padding-top: 7rem;
    opacity: 0.11;
  }
`;

const CanvasHost = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  width: min(92%, calc((100vh - 6rem) * 0.92));
  max-height: calc((100vh - 6rem) * 0.92);
  @media (max-width: 1100px) { width: min(72%, 40rem); }
  @media (max-width: 640px) { width: min(125%, 34rem); }

  canvas {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }
`;

/* ─── helpers ─────────────────────────────────────────── */
const latLonToVec3 = (lat, lon, r) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
};

const fresnelAtmosphereMaterial = (color, intensity, power) =>
  new THREE.ShaderMaterial({
    uniforms: {
      color: { value: color },
      intensity: { value: intensity },
      power: { value: power },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float intensity;
      uniform float power;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      void main() {
        float fresnel = pow(1.0 - abs(dot(normalize(vNormal), normalize(vViewPosition))), power);
        gl_FragColor = vec4(color, fresnel * intensity);
      }
    `,
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

const addLatLine = (
  group,
  lat,
  r,
  material,
  lonStep = 0.75,
) => {
  const pts = [];
  for (let lon = 0; lon <= 360; lon += lonStep) pts.push(latLonToVec3(lat, lon, r));
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), material.clone()));
};

const addLonLine = (
  group,
  lon,
  r,
  material,
  latStep = 0.75,
) => {
  const pts = [];
  for (let lat = -90; lat <= 90; lat += latStep) pts.push(latLonToVec3(lat, lon, r));
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), material.clone()));
};

const makeSmoothRing = (
  group,
  radius,
  thickness,
  color,
  opacity,
  rx,
  ry,
  segments = 512,
) => {
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(radius - thickness * 0.5, radius + thickness * 0.5, segments),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  ring.rotation.x = rx;
  ring.rotation.y = ry;
  group.add(ring);
  return ring;
};

const fitCameraToSphere = (camera, radius, margin = 1.22) => {
  const fovRad = (camera.fov * Math.PI) / 180;
  camera.position.set(0, 0, (radius * margin) / Math.tan(fovRad / 2));
  camera.lookAt(0, 0, 0);
  camera.updateProjectionMatrix();
};

/* ─── component ───────────────────────────────────────── */
const Globe3D = () => {
  const mountRef = useRef(null);
  const hostRef = useRef(null);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const getSize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      return Math.max(280, Math.round(Math.min(w, h) || 480));
    };

    let size = getSize();

    /* ── renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size, false);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    el.appendChild(renderer.domElement);

    /* ── scene / camera ── */
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);

    const group = new THREE.Group();
    scene.add(group);

    /* ── lighting for depth ── */
    scene.add(new THREE.AmbientLight(0x16353a, 0.55));
    const keyLight = new THREE.DirectionalLight(0x7ef0e8, 1.35);
    keyLight.position.set(3.5, 2.2, 4.5);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xffcb9a, 0.42);
    fillLight.position.set(-4.2, -1.4, 2.8);
    scene.add(fillLight);
    const rimLight = new THREE.PointLight(0x2a8f95, 0.9, 12);
    rimLight.position.set(-1.5, 0.5, -3.5);
    scene.add(rimLight);

    const R = 1.25;
    const segments = 192;
    const ringSegments = 512;
    const outerRadius = R * 1.24;
    const sphereGeo = (radius) => new THREE.SphereGeometry(radius, segments, segments);

    fitCameraToSphere(camera, outerRadius, 1.24);

    /* ── outer atmosphere shells ── */
    const atmColor = new THREE.Color(0x4ce1d3);
    const atmMat = fresnelAtmosphereMaterial(atmColor, 0.42, 2.4);
    group.add(new THREE.Mesh(sphereGeo(R * 1.14), atmMat));

    const outerHazeMat = fresnelAtmosphereMaterial(new THREE.Color(0x0d4f52), 0.18, 3.2);
    group.add(new THREE.Mesh(sphereGeo(outerRadius), outerHazeMat));

    /* ── lit globe body ── */
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0x071016,
      metalness: 0.42,
      roughness: 0.58,
      emissive: 0x0b2228,
      emissiveIntensity: 0.35,
      transparent: true,
      opacity: 0.98,
    });
    group.add(new THREE.Mesh(sphereGeo(R * 0.998), globeMat));

    /* ── subtle front-side rim highlight ── */
    const frontRimMat = fresnelAtmosphereMaterial(new THREE.Color(0x8ef5ec), 0.12, 4.5);
    frontRimMat.side = THREE.FrontSide;
    frontRimMat.blending = THREE.NormalBlending;
    group.add(new THREE.Mesh(sphereGeo(R * 1.004), frontRimMat));

    /* ── lat / lon grid (equator + prime meridian emphasized) ── */
    const gridMat = new THREE.LineBasicMaterial({ color: 0x1a7070, transparent: true, opacity: 0.22 });
    const gridBrightMat = new THREE.LineBasicMaterial({ color: 0x3cb8b0, transparent: true, opacity: 0.48 });
    const equatorMat = new THREE.LineBasicMaterial({ color: 0x4ce1d3, transparent: true, opacity: 0.62 });

    for (let lat = -75; lat <= 75; lat += 15) {
      const isEquator = lat === 0;
      addLatLine(group, lat, R, isEquator ? equatorMat : gridMat);
    }
    for (let lon = 0; lon < 360; lon += 15) {
      const isPrime = lon === 0;
      addLonLine(group, lon, R, isPrime ? gridBrightMat : gridMat);
    }

    /* ── city dots with additive glow halos ── */
    const cities = [
      [51, 0],     [40.7, -74],  [35.7, 139.7], [28.6, 77.2],  [-33.9, 151.2],
      [55.8, 37.6],[48.9, 2.3],  [19.1, 72.8],  [1.3, 103.8],  [-23.5, -46.6],
      [37.8,-122.4],[41.9,12.5], [30.1, 31.2],  [39.9, 116.4], [25.2, 55.3],
      [-34.6,-58.4],[60.2,24.9], [43.7,-79.4],  [22.3, 114.2], [59.9, 10.7],
    ];

    const colA = new THREE.Color(0x4ce1d3);
    const colB = new THREE.Color(0xffcb9a);
    const nodeVecs = [];
    const dotGeo = new THREE.SphereGeometry(0.018, 24, 24);
    const glowGeo = new THREE.SphereGeometry(0.048, 32, 32);
    const pingGeo = new THREE.RingGeometry(0.04, 0.055, ringSegments);

    /* city dot + animated ping circle (flat circle that grows outward on surface) */
    
    const pings = [];

    cities.forEach(([lat, lon], i) => {
      const v = latLonToVec3(lat, lon, R);
      nodeVecs.push(v);
      const dotColor = i % 3 === 0 ? colB : colA;

      // Soft bloom halo
      const halo = new THREE.Mesh(
        glowGeo,
        new THREE.MeshBasicMaterial({
          color: dotColor,
          transparent: true,
          opacity: 0.28,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      halo.position.copy(v.clone().multiplyScalar(1.001));
      group.add(halo);

      // Core dot
      const dot = new THREE.Mesh(
        dotGeo,
        new THREE.MeshBasicMaterial({ color: dotColor }),
      );
      dot.position.copy(v.clone().multiplyScalar(1.003));
      group.add(dot);

      // Ping circle: start tiny, grow outward then reset
      const pingMat = new THREE.MeshBasicMaterial({
        color: dotColor,
        transparent: true,
        opacity: 0.75,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const pingMesh = new THREE.Mesh(pingGeo, pingMat);
      pingMesh.position.copy(v.clone().multiplyScalar(1.002));
      pingMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), v.clone().normalize());
      pingMesh.scale.set(0, 0, 0);
      group.add(pingMesh);
      pings.push({ ring: pingMesh, phase: i * (Math.PI / 5) });
    });

    /* ── arc connections ── */
    const arcPairs = [
      [0,1],[1,3],[3,14],[14,8],[8,2],[2,19],[19,0],
      [4,8],[5,0],[6,5],[7,14],[9,6],[10,1],[11,1],
      [12,6],[13,3],[15,11],[16,0],[17,10],[18,2],
    ];

    
    const arcs = [];

    arcPairs.forEach(([ia, ib]) => {
      const a = nodeVecs[ia], b = nodeVecs[ib];
      const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R * 1.42);
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      const mat = new THREE.LineBasicMaterial({
        color: new THREE.Color().lerpColors(colA, colB, Math.random()),
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), mat);
      group.add(line);
      arcs.push({ line, prog: Math.random() * 1.4, speed: 0.004 + Math.random() * 0.003, pts: curve.getPoints(60), mat });
    });

    /* ── decorative orbit rings (smooth flat rings, not faceted torus) ── */
    const ring1 = makeSmoothRing(group, R * 1.14, 0.009, 0x4ce1d3, 0.72, Math.PI / 2, 0, ringSegments);
    const ring2 = makeSmoothRing(group, R * 1.22, 0.007, 0xffcb9a, 0.38, Math.PI / 3.2, Math.PI / 5, ringSegments);

    /* ── tiny satellites (Points, not Mesh — no confusion with planet look) ── */
    const satGeo = new THREE.BufferGeometry();
    satGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3 * 3), 3));
    const satPts = new THREE.Points(satGeo, new THREE.PointsMaterial({
      color: 0x4ce1d3, size: 0.09, transparent: true, opacity: 0.95,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));
    scene.add(satPts);

    const sat2Geo = new THREE.BufferGeometry();
    sat2Geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3), 3));
    const sat2Pts = new THREE.Points(sat2Geo, new THREE.PointsMaterial({
      color: 0xffcb9a, size: 0.075, transparent: true, opacity: 0.9,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));
    scene.add(sat2Pts);

    /* ── star field ── */
    const sPts = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) {
      const r = 6 + Math.random() * 8;
      const phi = Math.acos(2 * Math.random() - 1);
      const th = Math.random() * Math.PI * 2;
      sPts[i*3] = r * Math.sin(phi) * Math.cos(th);
      sPts[i*3+1] = r * Math.sin(phi) * Math.sin(th);
      sPts[i*3+2] = r * Math.cos(phi);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(sPts, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({
      color: 0xd1e8e2, size: 0.024, transparent: true, opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })));

    /* ── mouse tilt ── */
    let mx = 0, my = 0;
    const onMouse = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    /* ── resize ── */
    const onResize = () => {
      size = getSize();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(size, size, false);
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(el);
    onResize();

    /* ── animation ── */
    let raf;
    const start = Date.now();
    const orR = R * 1.52;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = (Date.now() - start) / 1000;

      group.rotation.y = t * 0.09 + mx * 0.14;
      group.rotation.x = Math.sin(t * 0.055) * 0.045 + my * 0.06;

      ring1.rotation.z = t * 0.12;
      ring2.rotation.z = -t * 0.07;

      // Ping circles expand & fade
      pings.forEach(({ ring, phase }) => {
        const p = ((t * 0.8 + phase) % (Math.PI * 2)) / (Math.PI * 2);
        const s = p * 3.8;
        ring.scale.set(s, s, s);
        (ring.material ).opacity = (1 - p) * 0.72;
      });

      // Arcs
      arcs.forEach((arc) => {
        arc.prog += arc.speed;
        if (arc.prog > 1.5) arc.prog = 0;
        const head = Math.min(arc.prog, 1);
        const tail = Math.max(0, arc.prog - 0.35);
        const slice = arc.pts.slice(
          Math.floor(tail * arc.pts.length),
          Math.floor(head * arc.pts.length) + 1,
        );
        if (slice.length > 1) {
          arc.line.geometry.setFromPoints(slice);
          arc.line.geometry.computeBoundingSphere();
        }
        arc.mat.opacity = arc.prog < 1 ? Math.sin(head * Math.PI) * 0.95 : 0;
      });

      // Subtle atmosphere pulse
      atmMat.uniforms.intensity.value = 0.34 + 0.08 * Math.sin(t * 0.75);
      outerHazeMat.uniforms.intensity.value = 0.14 + 0.05 * Math.sin(t * 0.55 + 1.2);
      globeMat.emissiveIntensity = 0.28 + 0.08 * Math.sin(t * 0.4);

      // Satellites as Points (3 positions in one geometry for perf)
      const pos = satGeo.attributes.position;
      const p1x = Math.cos(t * 0.5) * orR, p1y = Math.sin(t * 0.27) * orR * 0.45, p1z = Math.sin(t * 0.5) * orR;
      const p2x = Math.cos(t * 0.33 + 2) * orR * 0.88, p2y = Math.sin(t * 0.58 + 1) * orR * 0.55, p2z = Math.sin(t * 0.33 + 2) * orR * 0.88;
      const p3x = Math.cos(-t * 0.68 + 4) * orR * 1.06, p3y = Math.sin(-t * 0.4 + 3) * orR * 0.35, p3z = Math.sin(-t * 0.68 + 4) * orR * 1.06;
      pos.setXYZ(0, p1x, p1y, p1z);
      pos.setXYZ(1, p2x, p2y, p2z);
      pos.setXYZ(2, p3x, p3y, p3z);
      pos.needsUpdate = true;

      const pos2 = sat2Geo.attributes.position;
      pos2.setXYZ(0, Math.cos(t * 0.41 + 1) * orR * 0.95, Math.sin(-t * 0.35 + 2) * orR * 0.6, Math.sin(t * 0.41 + 1) * orR * 0.95);
      pos2.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      resizeObserver.disconnect();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <Wrap ref={mountRef} aria-hidden="true">
      <CanvasHost ref={hostRef} />
    </Wrap>
  );
};

export default Globe3D;
