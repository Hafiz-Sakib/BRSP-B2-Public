import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

/*
  থ্রিডি গাড়ি — three.js
  view = 'front' : সামনে থেকে দেখা (হেডলাইট, পজিশন লাইট, ইন্ডিকেটর, নম্বর প্লেট)
  view = 'top'   : উপর থেকে দেখা (লো বিম / হাই বিম কতদূর যায়)
  গাড়ির মুখ -Z দিকে; গাড়ির ডান পাশ = +X
*/

const FONT = '"Hind Siliguri","Noto Sans Bengali","Nirmala UI",system-ui,sans-serif';
const reduced = () => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const FRONT_Z = -2.1;
const LOW_REACH = 8.5; // ছবির স্কেলে (বাস্তব ≈ ৩০–৪০ মি)
const HIGH_REACH = 19; // বাস্তব ≈ ১০০ মি+

/* ---------- টেক্সচার ---------- */
function beamTexture() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 256;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 0, 256); // উপর = দূর (স্বচ্ছ), নিচ = কাছে (উজ্জ্বল)
  g.addColorStop(0, 'rgba(255,255,255,0)');
  g.addColorStop(0.55, 'rgba(255,255,255,.35)');
  g.addColorStop(1, 'rgba(255,255,255,1)');
  x.fillStyle = g;
  x.fillRect(0, 0, 64, 256);
  x.globalCompositeOperation = 'destination-in';
  const h = x.createLinearGradient(0, 0, 64, 0);
  h.addColorStop(0, 'rgba(0,0,0,0)');
  h.addColorStop(0.3, 'rgba(0,0,0,1)');
  h.addColorStop(0.7, 'rgba(0,0,0,1)');
  h.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = h;
  x.fillRect(0, 0, 64, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function glowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.3, 'rgba(255,255,255,.4)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function shadowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(64, 64, 8, 64, 64, 64);
  g.addColorStop(0, 'rgba(0,0,0,.85)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

function roadTexture() {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 512;
  const x = c.getContext('2d');
  x.fillStyle = '#2a3445';
  x.fillRect(0, 0, 256, 512);
  for (let i = 0; i < 2600; i += 1) {
    const v = 30 + Math.floor(Math.random() * 40);
    x.fillStyle = `rgba(${v + 20},${v + 28},${v + 44},.35)`;
    x.fillRect(Math.random() * 256, Math.random() * 512, 2, 2);
  }
  x.fillStyle = 'rgba(226,232,240,.55)';
  x.fillRect(10, 0, 5, 512); // বাঁ কিনারা
  x.fillRect(241, 0, 5, 512); // ডান কিনারা
  x.fillStyle = 'rgba(226,232,240,.7)';
  for (let y = 0; y < 512; y += 128) x.fillRect(125, y, 6, 64); // মাঝের ড্যাশ
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}

function textSprite(text, color, w, h, bold = false) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = Math.round(512 * (h / w));
  const x = c.getContext('2d');
  x.font = `${bold ? 700 : 600} ${Math.round(c.height * 0.62)}px ${FONT}`;
  x.fillStyle = color;
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.fillText(text, c.width / 2, c.height / 2 + 2);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, depthTest: false }));
  s.scale.set(w, h, 1);
  s.renderOrder = 10;
  return s;
}

/* ট্র্যাপিজিয়াম আলোর পাতা — মাটিতে শুয়ে থাকে, -Z দিকে লম্বা */
function sheetGeo(len, w0, w1) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([-w0 / 2, 0, 0, w0 / 2, 0, 0, w1 / 2, 0, -len, -w1 / 2, 0, -len], 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute([0, 0, 1, 0, 1, 1, 0, 1], 2));
  g.setIndex([0, 1, 2, 0, 2, 3]);
  return g;
}

/* ---------- গাড়ি ---------- */
function buildScene(view) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1220);
  if (view === 'front') scene.fog = new THREE.Fog(0x0b1220, 9, 38);

  const paint = new THREE.MeshPhysicalMaterial({ color: 0x35517f, roughness: 0.32, metalness: 0.55, clearcoat: 1, clearcoatRoughness: 0.12 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x0a1018, roughness: 0.05, metalness: 0.9 });
  const trim = new THREE.MeshStandardMaterial({ color: 0x0f141d, roughness: 0.6, metalness: 0.1 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xdde4ee, roughness: 0.2, metalness: 1 });
  const tire = new THREE.MeshStandardMaterial({ color: 0x0a0c11, roughness: 0.85, metalness: 0 });

  /* রাস্তা ও মাটি */
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(300, 300).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x0c1322, roughness: 1 }));
  ground.position.y = -0.02;
  scene.add(ground);
  const rt = roadTexture();
  rt.repeat.set(1, 120 / 18);
  const road = new THREE.Mesh(new THREE.PlaneGeometry(9, 120).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ map: rt, roughness: 0.92, metalness: 0 }));
  road.position.set(0, 0, -40);
  scene.add(road);

  const car = new THREE.Group();
  scene.add(car);
  const add = (geo, mat, x, y, z) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    car.add(m);
    return m;
  };

  /* কাঠামো */
  add(new RoundedBoxGeometry(1.8, 0.62, 4.2, 5, 0.2), paint, 0, 0.58, 0);
  add(new RoundedBoxGeometry(1.7, 0.14, 1.5, 4, 0.06), paint, 0, 0.9, -1.2);
  add(new RoundedBoxGeometry(1.52, 0.44, 2.0, 5, 0.16), glass, 0, 1.13, 0.5);
  add(new RoundedBoxGeometry(1.5, 0.1, 1.9, 4, 0.05), paint, 0, 1.4, 0.5);
  add(new RoundedBoxGeometry(1.78, 0.22, 0.2, 3, 0.07), trim, 0, 0.4, FRONT_Z);
  add(new RoundedBoxGeometry(1.78, 0.2, 0.2, 3, 0.07), trim, 0, 0.4, 2.1);
  // সাইড মিরর
  [-1, 1].forEach((s) => add(new RoundedBoxGeometry(0.16, 0.1, 0.22, 3, 0.04), paint, s * 1.02, 0.96, -0.55));
  // গ্রিল
  add(new RoundedBoxGeometry(0.86, 0.2, 0.06, 3, 0.03), trim, 0, 0.68, FRONT_Z - 0.02);
  [0.63, 0.68, 0.73].forEach((y) => add(new THREE.BoxGeometry(0.78, 0.014, 0.02), chrome, 0, y, FRONT_Z - 0.06));

  /* চাকা */
  [[-1, -1.35], [1, -1.35], [-1, 1.35], [1, 1.35]].forEach(([sx, z]) => {
    add(new THREE.CylinderGeometry(0.36, 0.36, 0.26, 40).rotateZ(Math.PI / 2), tire, sx * 0.9, 0.36, z);
    add(new THREE.CylinderGeometry(0.22, 0.22, 0.27, 28).rotateZ(Math.PI / 2), chrome, sx * 0.9, 0.36, z);
  });

  /* হেডলাইট */
  const lensMat = new THREE.MeshStandardMaterial({ color: 0xb3bac6, roughness: 0.15, metalness: 0.2, emissive: 0xfff3c4, emissiveIntensity: 0 });
  [-1, 1].forEach((s) => {
    add(new RoundedBoxGeometry(0.54, 0.22, 0.1, 3, 0.05), trim, s * 0.62, 0.7, FRONT_Z - 0.02);
    const lens = add(new THREE.SphereGeometry(1, 28, 16), lensMat, s * 0.62, 0.7, FRONT_Z - 0.09);
    lens.scale.set(0.22, 0.085, 0.05);
  });

  /* পজিশন বাতি (সামনে ছোট, হলদেটে) */
  const posMat = new THREE.MeshStandardMaterial({ color: 0x8a7a45, roughness: 0.3, emissive: 0xfcd34d, emissiveIntensity: 0 });
  [-1, 1].forEach((s) => add(new THREE.SphereGeometry(0.05, 16, 12), posMat, s * 0.36, 0.6, FRONT_Z - 0.04));

  /* নম্বর প্লেট */
  const plateMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af, roughness: 0.5, emissive: 0xfef3c7, emissiveIntensity: 0 });
  add(new THREE.BoxGeometry(0.5, 0.14, 0.02), plateMat, 0, 0.4, FRONT_Z - 0.12);

  /* ইন্ডিকেটর (সামনে ও পেছনে, কোণায়) */
  const indMat = { L: null, R: null };
  [['L', -1], ['R', 1]].forEach(([id, s]) => {
    const m = new THREE.MeshStandardMaterial({ color: 0x8a5a2b, roughness: 0.3, emissive: 0xfb923c, emissiveIntensity: 0 });
    indMat[id] = m;
    add(new RoundedBoxGeometry(0.3, 0.08, 0.06, 3, 0.025), m, s * 0.74, 0.5, FRONT_Z - 0.03);
    add(new RoundedBoxGeometry(0.3, 0.08, 0.06, 3, 0.025), m, s * 0.74, 0.5, 2.13);
  });

  /* পেছনের লাল বাতি */
  const tailMat = new THREE.MeshStandardMaterial({ color: 0x7a2323, roughness: 0.3, emissive: 0xef4444, emissiveIntensity: 0 });
  [-1, 1].forEach((s) => add(new RoundedBoxGeometry(0.5, 0.16, 0.06, 3, 0.03), tailMat, s * 0.62, 0.72, 2.13));

  /* নিচের ছায়া */
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 5.4).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, opacity: 0.8, depthWrite: false }));
  sh.position.y = 0.012;
  car.add(sh);

  /* আলোর পাতা (মাটিতে) */
  const bt = beamTexture();
  const mkSheet = (len, w0, w1, color, sx) => {
    const m = new THREE.Mesh(sheetGeo(len, w0, w1), new THREE.MeshBasicMaterial({ map: bt, color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }));
    m.position.set(sx * 0.62, 0.035, FRONT_Z - 0.1);
    scene.add(m);
    return m;
  };
  const lowSheets = [-1, 1].map((s) => mkSheet(LOW_REACH, 0.7, 5.4, 0xffeeb8, s));
  const highSheets = [-1, 1].map((s) => mkSheet(HIGH_REACH, 0.5, 3.6, 0xbfe3ff, s));
  // রাস্তার পাতা যেন গাড়ির মাথার ওপর না ওঠে
  lowSheets.concat(highSheets).forEach((m) => { m.renderOrder = 2; });

  /* গ্লো স্প্রাইট */
  const gt = glowTexture();
  const mkGlow = (x, y, z, color) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: gt, color, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0, toneMapped: false }));
    s.position.set(x, y, z);
    scene.add(s);
    return s;
  };
  const headGlow = [-1, 1].map((s) => mkGlow(s * 0.62, 0.7, FRONT_Z - 0.2, 0xfff3c4));
  const posGlow = [-1, 1].map((s) => mkGlow(s * 0.36, 0.6, FRONT_Z - 0.12, 0xfcd34d));
  const tailGlow = [-1, 1].map((s) => mkGlow(s * 0.62, 0.72, 2.25, 0xef4444));
  const indGlow = {
    L: [mkGlow(-0.74, 0.5, FRONT_Z - 0.12, 0xfb923c), mkGlow(-0.74, 0.5, 2.25, 0xfb923c)],
    R: [mkGlow(0.74, 0.5, FRONT_Z - 0.12, 0xfb923c), mkGlow(0.74, 0.5, 2.25, 0xfb923c)],
  };

  /* লেবেল */
  const labels = new THREE.Group();
  const rl = textSprite('ডান (R)', '#cbd5e1', 1.0, 0.26, true);
  rl.position.set(1.45, 0.3, FRONT_Z);
  const ll = textSprite('বাঁ (L)', '#cbd5e1', 1.0, 0.26, true);
  ll.position.set(-1.45, 0.3, FRONT_Z);
  labels.add(rl, ll);
  scene.add(labels);

  const dist = new THREE.Group();
  const mkLine = (z) => {
    const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(5, 0.05, z), new THREE.Vector3(24, 0.05, z)]);
    const l = new THREE.Line(g, new THREE.LineDashedMaterial({ color: 0x64748b, dashSize: 0.5, gapSize: 0.4 }));
    l.computeLineDistances();
    return l;
  };
  const zl = FRONT_Z - LOW_REACH;
  const zh = FRONT_Z - HIGH_REACH;
  dist.add(mkLine(zl), mkLine(zh));
  const tl = textSprite('লো বিম ≈ ৩০–৪০ মি', '#94a3b8', 8, 1.2);
  tl.position.set(9.4, 0.1, zl + 0.9);
  const th = textSprite('হাই বিম ≈ ১০০ মি+', '#94a3b8', 8, 1.2);
  th.position.set(9.4, 0.1, zh + 0.9);
  dist.add(tl, th);
  scene.add(dist);

  labels.visible = view === 'front';
  dist.visible = view === 'top';

  /* আলো */
  scene.add(new THREE.HemisphereLight(0x8aa4d6, 0x0b1220, 0.55));
  const moon = new THREE.DirectionalLight(0xa8bdf0, 1.2);
  moon.position.set(-5, 8, -8);
  scene.add(moon);
  const rim = new THREE.DirectionalLight(0xffd9a8, 0.35);
  rim.position.set(6, 4, 6);
  scene.add(rim);

  return { scene, lensMat, posMat, plateMat, indMat, tailMat, lowSheets, highSheets, headGlow, posGlow, tailGlow, indGlow };
}

export default function Car3D({ view = 'front', ring, high, turn, blink, onFail }) {
  const mountRef = useRef(null);
  const api = useRef(null);
  const live = useRef({});
  live.current = { ring, high, turn, blink, onFail };

  useEffect(() => {
    const mount = mountRef.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
    } catch (err) {
      live.current.onFail?.();
      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    const el = renderer.domElement;
    el.style.display = 'block';
    mount.appendChild(el);

    const S = buildScene(view);
    const pm = new THREE.PMREMGenerator(renderer);
    const envTex = pm.fromScene(new RoomEnvironment(renderer), 0.04).texture;
    S.scene.environment = envTex;
    if ('environmentIntensity' in S.scene) S.scene.environmentIntensity = 0.45;

    const camera = new THREE.PerspectiveCamera(30, 1.5, 0.3, 300);
    if (view === 'front') {
      camera.position.set(1.5, 1.25, -7.3);
      camera.up.set(0, 1, 0);
      camera.lookAt(0, 0.78, -1.5);
    } else {
      camera.position.set(0, 52, -2);
      camera.up.set(0, 0, -1);
      camera.lookAt(0, 0, -8);
    }

    const cur = { park: 0, low: 0, high: 0, L: 0, R: 0 };
    const tgt = { park: 0, low: 0, high: 0, L: 0, R: 0 };
    const WARM = new THREE.Color(0xfff3c4);
    const COOL = new THREE.Color(0xcfe8ff);
    const tmp = new THREE.Color();
    let raf = 0;
    let last = 0;
    let dead = false;

    const paint = () => {
      const { park, low, high: hi, L, R } = cur;
      tmp.copy(WARM).lerp(COOL, hi);
      S.lensMat.emissive.copy(tmp);
      S.lensMat.emissiveIntensity = low * 2.2 + hi * 1.2;
      S.posMat.emissiveIntensity = park * 2.4;
      S.plateMat.emissiveIntensity = park * 0.55;
      S.tailMat.emissiveIntensity = park * 2.2;
      S.lowSheets.forEach((m) => { m.material.opacity = 0.72 * low; });
      S.highSheets.forEach((m) => { m.material.opacity = 0.85 * hi; });
      S.headGlow.forEach((g) => {
        g.material.opacity = low * 0.85;
        g.material.color.copy(tmp);
        const sc = 1.0 + 0.9 * hi;
        g.scale.set(sc, sc, 1);
      });
      S.posGlow.forEach((g) => { g.material.opacity = park * (1 - low * 0.6) * 0.8; g.scale.set(0.45, 0.45, 1); });
      S.tailGlow.forEach((g) => { g.material.opacity = park * 0.75; g.scale.set(0.8, 0.8, 1); });
      ['L', 'R'].forEach((id) => {
        const v = id === 'L' ? L : R;
        S.indMat[id].emissiveIntensity = v * 3;
        S.indGlow[id].forEach((g) => { g.material.opacity = v * 0.9; g.scale.set(0.7, 0.7, 1); });
      });
    };

    const frame = (t) => {
      raf = 0;
      if (dead) return;
      const dt = Math.min(0.05, Math.max(0.001, (t - last) / 1000));
      last = t;
      let moving = false;
      Object.keys(cur).forEach((k) => {
        const rate = k === 'L' || k === 'R' ? 26 : 9;
        if (reduced()) cur[k] = tgt[k];
        else cur[k] += (tgt[k] - cur[k]) * (1 - Math.exp(-dt * rate));
        if (Math.abs(tgt[k] - cur[k]) > 0.004) moving = true;
        else cur[k] = tgt[k];
      });
      paint();
      renderer.render(S.scene, camera);
      if (moving) raf = requestAnimationFrame(frame);
    };
    const invalidate = () => {
      if (dead || raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const sync = (first) => {
      const p = live.current;
      tgt.park = p.ring !== 'off' ? 1 : 0;
      tgt.low = p.ring === 'low' ? 1 : 0;
      tgt.high = p.ring === 'low' && p.high ? 1 : 0;
      tgt.R = p.turn === 'R' && p.blink ? 1 : 0;
      tgt.L = p.turn === 'L' && p.blink ? 1 : 0;
      if (first) { Object.assign(cur, tgt); paint(); }
      invalidate();
    };

    const resize = () => {
      const w = Math.max(40, mount.clientWidth);
      const h = Math.max(40, mount.clientHeight);
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      invalidate();
    };
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    ro?.observe(mount);
    resize();
    sync(true);
    renderer.render(S.scene, camera);
    api.current = { sync: () => sync(false) };

    return () => {
      dead = true;
      if (raf) cancelAnimationFrame(raf);
      ro?.disconnect();
      S.scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          const ms = Array.isArray(o.material) ? o.material : [o.material];
          ms.forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
        }
      });
      envTex.dispose();
      pm.dispose();
      renderer.dispose();
      if (el.parentNode === mount) mount.removeChild(el);
      api.current = null;
    };
  }, [view]);

  useEffect(() => { api.current?.sync(); }, [ring, high, turn, blink]);

  return (
    <div className="relative w-full" style={{ aspectRatio: '3 / 2' }}>
      <div ref={mountRef} className="absolute inset-0" />
    </div>
  );
}
