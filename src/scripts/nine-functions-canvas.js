const CATEGORY_COLORS = {
  input: {
    core: '#34d399',
    glow: 'rgba(52, 211, 153, 0.4)',
    text: '#6ee7b7',
  },
  processing: {
    core: '#fbbf24',
    glow: 'rgba(251, 191, 36, 0.4)',
    text: '#fcd34d',
  },
  output: {
    core: '#22d3ee',
    glow: 'rgba(34, 211, 238, 0.4)',
    text: '#67e8f9',
  },
  biology: {
    core: '#a3e635',
    glow: 'rgba(163, 230, 53, 0.4)',
    text: '#bef264',
  },
  energy: {
    core: '#fb923c',
    glow: 'rgba(251, 146, 60, 0.4)',
    text: '#ffedd5',
  },
  legal: {
    core: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.4)',
    text: '#e9d5ff',
  },
};

const ORBIT_COORDS = [
  { x: 260, y: 92, z: -72 },   // 01
  { x: 540, y: 92, z: 62 },    // 02
  { x: 675, y: 185, z: -48 },  // 03
  { x: 675, y: 325, z: 86 },   // 04
  { x: 400, y: 255, z: 0 },    // 05 (Center Core)
  { x: 540, y: 418, z: -84 },  // 06
  { x: 260, y: 418, z: 54 },   // 07
  { x: 125, y: 325, z: -64 },  // 08
  { x: 125, y: 185, z: 74 },   // 09
];

function getHash(str) {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

export function initNineFunctionsJourney(rootEl, functionsData) {
  const canvas = rootEl.querySelector('#flow-canvas');
  if (!canvas || !Array.isArray(functionsData) || functionsData.length === 0) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const titleEl = rootEl.querySelector('#inspector-title');
  const tagEl = rootEl.querySelector('#inspector-tag');
  const questionEl = rootEl.querySelector('#inspector-question');
  const summaryEl = rootEl.querySelector('#inspector-summary');
  const flowEl = rootEl.querySelector('#inspector-flow');
  const storyLinkEl = rootEl.querySelector('#inspector-story-link');
  const prevBtn = rootEl.querySelector('#btn-prev-fn');
  const nextBtn = rootEl.querySelector('#btn-next-fn');
  const zoomInBtn = rootEl.querySelector('#btn-zoom-in');
  const zoomOutBtn = rootEl.querySelector('#btn-zoom-out');
  const resetBtn = rootEl.querySelector('#btn-reset-cam');
  const rotateBtn = rootEl.querySelector('#btn-toggle-rotate');
  const modeBtn = rootEl.querySelector('#btn-toggle-mode');
  const journeyButtons = Array.from(rootEl.querySelectorAll('[data-fn-index]'));

  const nodes = functionsData.map((item, idx) => {
    const coord = ORBIT_COORDS[idx] || { x: 400, y: 255, z: 0 };
    const id = `fn-${item.num}`;
    return {
      id,
      index: idx,
      x: coord.x - 400,
      y: coord.y - 255,
      z: coord.z,
      hash: getHash(id),
      isCenter: item.num === '05',
      data: item,
    };
  });

  // Primary 1 -> 2 -> ... -> 9 -> 1 journey plus catalytic links through Center Core (05)
  const edges = nodes.map((node, idx) => {
    const nextNode = nodes[(idx + 1) % nodes.length];
    return {
      id: `edge-${node.data.num}-${nextNode.data.num}`,
      source: node.id,
      target: nextNode.id,
      label: node.data.flow_label || `${node.data.num} → ${nextNode.data.num}`,
      hash: getHash(`edge-${node.data.num}-${nextNode.data.num}`),
      primary: true,
    };
  });

  if (nodes.length >= 9) {
    edges.push(
      {
        id: 'bridge-01-05',
        source: nodes[0].id,
        target: nodes[4].id,
        label: 'Direction → Impact',
        hash: getHash('bridge-01-05'),
        primary: false,
      },
      {
        id: 'bridge-05-09',
        source: nodes[4].id,
        target: nodes[8].id,
        label: 'Contribution → Renewal',
        hash: getHash('bridge-05-09'),
        primary: false,
      }
    );
  }

  const state = {
    viewMode: '3d',
    autoRotate: true,
    theta: 0.18,
    phi: -0.1,
    zoom: 1.0,
    baseZoom: 1.0,
    selectedIndex: 0,
    hoveredId: null,
    isDragging: false,
    hasDragged: false,
    lastMouse: { x: 0, y: 0 },
    downPos: { x: 0, y: 0 },
    lookAt: { x: 0, y: 0, z: 0 },
    panOffset: { x: 0, y: 0, z: 0 },
  };

  const fov = 460;
  const sporeProgresses = {};

  function computeBaseZoom(width, height) {
    const wScale = width / 940;
    const hScale = height / 620;
    return Math.max(0.52, Math.min(1.08, Math.min(wScale, hScale)));
  }

  function resize() {
    const rect = canvas.parentElement?.getBoundingClientRect();
    const width = Math.max(320, Math.floor(rect?.width || window.innerWidth));
    const height = Math.max(420, Math.floor(rect?.height || 560));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const prevBase = state.baseZoom;
    state.baseZoom = computeBaseZoom(width, height);
    if (Math.abs(state.zoom - prevBase) < 0.05) {
      state.zoom = state.baseZoom;
    }
  }

  function selectFunction(index, refocus = true) {
    const safeIdx = ((index % nodes.length) + nodes.length) % nodes.length;
    state.selectedIndex = safeIdx;
    if (refocus) {
      state.panOffset = { x: 0, y: 0, z: 0 };
    }

    const active = nodes[safeIdx].data;
    const next = nodes[(safeIdx + 1) % nodes.length].data;
    const theme = CATEGORY_COLORS[active.category] || CATEGORY_COLORS.input;

    if (tagEl) {
      tagEl.textContent = active.role_tag || `FUNCTION ${active.num}`;
      tagEl.style.color = theme.text;
    }
    if (titleEl) titleEl.textContent = `${active.num}. ${active.name}`;
    if (questionEl) questionEl.textContent = active.question;
    if (summaryEl) summaryEl.textContent = active.summary;
    if (flowEl) {
      flowEl.textContent = `Flows to ${next.num}. ${next.name} (${active.flow_label || 'Next Step'})`;
    }
    if (storyLinkEl) {
      storyLinkEl.setAttribute('href', active.href);
      storyLinkEl.textContent = `Open Function ${active.num} Story →`;
    }

    journeyButtons.forEach((btn) => {
      const btnIdx = Number(btn.getAttribute('data-fn-index'));
      const isCurrent = btnIdx === safeIdx;
      btn.setAttribute('aria-pressed', String(isCurrent));
      btn.classList.toggle('is-active', isCurrent);
    });
  }

  function getProjectedState() {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 800;
    const height = rect.height || 560;
    const cx = width / 2;
    const cy = height / 2;
    const time = Date.now() * 0.001;

    const is3D = state.viewMode === '3d';
    const cosT = is3D ? Math.cos(state.theta) : 1;
    const sinT = is3D ? Math.sin(state.theta) : 0;
    const cosP = is3D ? Math.cos(state.phi) : 1;
    const sinP = is3D ? Math.sin(state.phi) : 0;

    // Slight gentle bias toward selected node while keeping the full loop readable
    const activeNode = nodes[state.selectedIndex];
    const targetX = activeNode ? activeNode.x * 0.35 : 0;
    const targetY = activeNode ? activeNode.y * 0.35 : 0;
    const targetZ = activeNode && is3D ? activeNode.z * 0.35 : 0;

    state.lookAt.x += (targetX - state.lookAt.x) * 0.07;
    state.lookAt.y += (targetY - state.lookAt.y) * 0.07;
    state.lookAt.z += (targetZ - state.lookAt.z) * 0.07;

    const camX = state.lookAt.x + state.panOffset.x;
    const camY = state.lookAt.y + state.panOffset.y;
    const camZ = state.lookAt.z + state.panOffset.z;

    const projectedNodes = nodes.map((node) => {
      const nzRaw = is3D ? node.z : 0;
      const waveX = is3D ? Math.sin(time * 0.4 + node.hash) * 6 : Math.sin(time * 0.4 + node.hash) * 2;
      const waveY = is3D ? Math.cos(time * 0.35 + node.hash) * 6 : Math.cos(time * 0.35 + node.hash) * 2;

      const nx = node.x + waveX - camX;
      const ny = node.y + waveY - camY;
      const nz = nzRaw - camZ;

      const x1 = nx * cosT - nz * sinT;
      const z1 = nx * sinT + nz * cosT;
      const y2 = ny * cosP - z1 * sinP;
      const z2 = ny * sinP + z1 * cosP;

      const scale = is3D ? fov / Math.max(40, fov + z2) : 1.0;
      const sx = cx + x1 * scale * state.zoom;
      const sy = cy + y2 * scale * state.zoom;
      const baseRadius = node.isCenter ? 46 : 36;
      const radius = baseRadius * scale * state.zoom;

      return { ...node, rx: x1, ry: y2, rz: z2, sx, sy, radius, scale };
    });

    return { width, height, cx, cy, time, is3D, cosT, sinT, cosP, sinP, camX, camY, camZ, projectedNodes };
  }

  function findNodeAt(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top;
    const { projectedNodes } = getProjectedState();

    // Check front-to-back
    const sorted = [...projectedNodes].sort((a, b) => a.rz - b.rz);
    for (const node of sorted) {
      const dist = Math.hypot(mx - node.sx, my - node.sy);
      if (dist <= Math.max(28, node.radius + 18)) {
        return node;
      }
    }
    return null;
  }

  let frameId = 0;

  function draw() {
    if (state.autoRotate && state.viewMode === '3d') {
      state.theta += 0.0014;
    }

    const { width, height, cx, cy, time, is3D, cosT, sinT, cosP, sinP, camX, camY, camZ, projectedNodes } =
      getProjectedState();

    // Deep void backdrop (#020403) + subtle atmospheric gradients
    ctx.fillStyle = '#020403';
    ctx.fillRect(0, 0, width, height);

    const glow1 = ctx.createRadialGradient(
      width * 0.25 + Math.sin(time * 0.4) * 50,
      height * 0.65 + Math.cos(time * 0.4) * 40,
      0,
      width * 0.25,
      height * 0.65,
      width * 0.55
    );
    glow1.addColorStop(0, 'rgba(4, 120, 87, 0.14)');
    glow1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, width, height);

    const glow2 = ctx.createRadialGradient(
      width * 0.78 + Math.cos(time * 0.32) * 50,
      height * 0.28 + Math.sin(time * 0.32) * 40,
      0,
      width * 0.78,
      height * 0.28,
      width * 0.48
    );
    glow2.addColorStop(0, 'rgba(109, 40, 217, 0.09)');
    glow2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, width, height);

    const nodesDict = {};
    projectedNodes.forEach((n) => {
      nodesDict[n.id] = n;
    });

    const selectedNodeId = nodes[state.selectedIndex]?.id;

    // Project edges as 5 weaving tendril filaments each
    const projectedEdges = edges.map((edge) => {
      const source = nodesDict[edge.source];
      const target = nodesDict[edge.target];
      if (!source || !target) return null;

      const sibling = edges.find(
        (e) =>
          e.id !== edge.id &&
          ((e.source === edge.source && e.target === edge.target) ||
            (e.source === edge.target && e.target === edge.source))
      );

      let biasOffset = edge.primary ? 16 : -22;
      if (sibling) {
        biasOffset = edge.id < sibling.id ? 26 : -26;
      }

      const segments = 12;
      const numTendrils = 5;
      const tendrils = [];
      const szSource = is3D ? source.z : 0;
      const szTarget = is3D ? target.z : 0;
      const amp = Math.min(20, Math.hypot(target.rx - source.rx, target.ry - source.ry) * 0.09);

      for (let j = 0; j < numTendrils; j += 1) {
        const points = [];
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const normalLen = Math.hypot(dx, dy) || 1;
        const nxNorm = -dy / normalLen;
        const nyNorm = dx / normalLen;

        for (let k = 0; k <= segments; k += 1) {
          const tVal = k / segments;
          const bx = source.x - camX + dx * tVal;
          const by = source.y - camY + dy * tVal;
          const bz = szSource - camZ + (szTarget - szSource) * tVal;

          const curveOffset = biasOffset * Math.sin(tVal * Math.PI);
          const wave = Math.sin(k * 0.5 + j * 1.5 + time * 1.4) * (is3D ? amp : amp * 0.3);

          const px = bx + nxNorm * (curveOffset + wave * Math.sin(j * 0.8));
          const py = by + nyNorm * (curveOffset + wave * Math.cos(j * 0.8));
          const pz = bz + (is3D ? Math.cos(k * 0.6 + j * 1.1 + time * 1.1) * amp * 0.65 : 0);

          const rx = px * cosT - pz * sinT;
          const rz = px * sinT + pz * cosT;
          const ry = py * cosP - rz * sinP;
          const rzFinal = py * sinP + rz * cosP;

          const pScale = is3D ? fov / Math.max(40, fov + rzFinal) : 1.0;
          points.push({
            sx: cx + rx * pScale * state.zoom,
            sy: cy + ry * pScale * state.zoom,
            rz: rzFinal,
          });
        }
        tendrils.push(points);
      }

      return { ...edge, tendrils, midZ: (source.rz + target.rz) / 2 };
    }).filter(Boolean);

    projectedEdges.sort((a, b) => b.midZ - a.midZ);

    // Draw edges + pill labels
    projectedEdges.forEach((edge) => {
      const isHoveredEdge = state.hoveredId === edge.source || state.hoveredId === edge.target;
      const isSelectedEdge = selectedNodeId === edge.source || selectedNodeId === edge.target;

      edge.tendrils.forEach((points, idx) => {
        ctx.beginPath();
        ctx.moveTo(points[0].sx, points[0].sy);
        for (let k = 1; k < points.length; k += 1) {
          ctx.lineTo(points[k].sx, points[k].sy);
        }

        const avgZ = points.reduce((sum, p) => sum + p.rz, 0) / points.length;
        const depthScale = is3D ? fov / Math.max(40, fov + avgZ) : 1.0;

        let color = '16, 185, 129';
        let opacity = 0.04;
        let strokeWidth = 0.45;

        if (idx === 0) {
          color = '52, 211, 153';
          opacity = isSelectedEdge ? 0.72 : isHoveredEdge ? 0.58 : 0.16;
          strokeWidth = 0.85;
        } else if (idx === 1) {
          color = '16, 185, 129';
          opacity = isSelectedEdge ? 0.48 : isHoveredEdge ? 0.36 : 0.09;
          strokeWidth = 0.55;
        } else if (idx === 2) {
          color = '34, 211, 238';
          opacity = isSelectedEdge ? 0.38 : isHoveredEdge ? 0.28 : 0.06;
          strokeWidth = 0.45;
        } else if (idx === 3) {
          opacity = isSelectedEdge ? 0.16 : isHoveredEdge ? 0.1 : 0.025;
          strokeWidth = 0.9;
        } else {
          opacity = isSelectedEdge ? 0.08 : isHoveredEdge ? 0.05 : 0.012;
          strokeWidth = 1.25;
        }

        ctx.strokeStyle = `rgba(${color}, ${opacity * depthScale})`;
        ctx.lineWidth = strokeWidth * depthScale;
        ctx.lineCap = 'round';
        ctx.stroke();
      });

      if (edge.label && (isSelectedEdge || isHoveredEdge)) {
        const midPt = edge.tendrils[0][Math.floor(edge.tendrils[0].length / 2)];
        ctx.font = 'bold 10px ui-monospace, SFMono-Regular, Menlo, monospace';
        const labelW = ctx.measureText(edge.label).width;

        ctx.fillStyle = 'rgba(2, 4, 3, 0.88)';
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.42)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(midPt.sx - labelW / 2 - 7, midPt.sy - 9, labelW + 14, 18, 5);
        } else {
          ctx.rect(midPt.sx - labelW / 2 - 7, midPt.sy - 9, labelW + 14, 18);
        }
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#6ee7b7';
        ctx.textAlign = 'center';
        ctx.fillText(edge.label, midPt.sx, midPt.sy + 3.5);
      }
    });

    // Traveling luminous spores
    const sporeColors = ['#6ee7b7', '#22d3ee', '#fcd34d'];
    projectedEdges.forEach((edge) => {
      const isSelectedEdge = selectedNodeId === edge.source || selectedNodeId === edge.target;
      const numSpores = edge.primary ? 3 : 2;

      for (let idx = 0; idx < numSpores; idx += 1) {
        const key = `${edge.id}-spore-${idx}`;
        if (sporeProgresses[key] === undefined) {
          sporeProgresses[key] = Math.random();
        }
        const speed = 0.0028 + idx * 0.0014 + (Math.abs(edge.hash) % 4) * 0.0004;
        sporeProgresses[key] = (sporeProgresses[key] + speed) % 1.0;

        const tendril = edge.tendrils[idx % edge.tendrils.length];
        const segFloat = sporeProgresses[key] * (tendril.length - 1);
        const s1 = Math.floor(segFloat);
        const s2 = Math.min(tendril.length - 1, s1 + 1);
        const frac = segFloat - s1;
        const p1 = tendril[s1];
        const p2 = tendril[s2];
        if (!p1 || !p2) continue;

        const ssx = p1.sx + (p2.sx - p1.sx) * frac;
        const ssy = p1.sy + (p2.sy - p1.sy) * frac;
        const srz = p1.rz + (p2.rz - p1.rz) * frac;
        const sScale = is3D ? fov / Math.max(40, fov + srz) : 1.0;

        const size = (1.3 + idx * 0.35) * sScale;
        const mult = isSelectedEdge ? 1.55 : 1.0;
        const color = sporeColors[idx % sporeColors.length];

        const grad = ctx.createRadialGradient(ssx, ssy, 0, ssx, ssy, size * 3.2 * mult);
        grad.addColorStop(0, color);
        grad.addColorStop(0.35, color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.beginPath();
        ctx.arc(ssx, ssy, size * 3.2 * mult, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    });

    // Nodes sorted back-to-front
    projectedNodes.sort((a, b) => b.rz - a.rz);

    projectedNodes.forEach((node) => {
      const theme = CATEGORY_COLORS[node.data.category] || CATEGORY_COLORS.input;
      const isSelected = node.index === state.selectedIndex;
      const isHovered = state.hoveredId === node.id;

      const haloScale = isSelected ? 1.25 : isHovered ? 1.15 : 1.0;
      const pulse = 1.0 + Math.sin(time * 2.8 + node.hash) * 0.05;
      const finalRadius = node.radius * haloScale * pulse;

      // Dashed halo circle
      ctx.strokeStyle = isSelected
        ? `${theme.core}88`
        : isHovered
          ? 'rgba(52, 211, 153, 0.45)'
          : `rgba(228, 228, 231, ${Math.min(0.26, 0.14 * node.scale)})`;
      ctx.lineWidth = isSelected ? 1.5 : 1.0;
      ctx.setLineDash(node.isCenter ? [] : [4, 6]);
      ctx.beginPath();
      const rot = isSelected ? time * 0.4 : 0;
      ctx.arc(node.sx, node.sy, finalRadius, rot, rot + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Hover / active expanding radar ring
      if (isSelected || isHovered) {
        const pingScale = 1.0 + ((time * 1.35 + Math.abs(node.hash)) % 1.0) * 0.85;
        ctx.strokeStyle = `${theme.text}55`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(node.sx, node.sy, node.radius * pingScale, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Radial glow burst
      const glowRad = node.radius * (isSelected ? 3.4 : isHovered ? 2.8 : 2.1);
      const fillGrad = ctx.createRadialGradient(node.sx, node.sy, 0, node.sx, node.sy, glowRad);
      fillGrad.addColorStop(0, `${theme.core}55`);
      fillGrad.addColorStop(0.32, `${theme.core}22`);
      fillGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.beginPath();
      ctx.arc(node.sx, node.sy, glowRad, 0, Math.PI * 2);
      ctx.fillStyle = fillGrad;
      ctx.fill();

      // Bright nucleus
      const coreRad = node.radius * (isSelected ? 0.36 : isHovered ? 0.31 : 0.26);
      ctx.beginPath();
      ctx.arc(node.sx, node.sy, coreRad, 0, Math.PI * 2);
      ctx.fillStyle = theme.core;
      ctx.shadowColor = theme.core;
      ctx.shadowBlur = isSelected ? 22 : isHovered ? 16 : 9;
      ctx.fill();
      ctx.shadowBlur = 0;

      // White pinpoint center
      ctx.beginPath();
      ctx.arc(node.sx, node.sy, coreRad * 0.36, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Floating monospace typography
      const textAlpha = isSelected ? 1.0 : isHovered ? 0.9 : Math.max(0.48, 0.72 * node.scale);
      const alphaHex = Math.floor(Math.min(1, textAlpha) * 255)
        .toString(16)
        .padStart(2, '0');

      const labelX = node.sx + finalRadius + 10;
      ctx.textAlign = 'left';
      ctx.font = 'bold 10px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillStyle = `${theme.text}${alphaHex}`;
      ctx.fillText(node.data.role_tag || `FUNCTION ${node.data.num}`, labelX, node.sy - 5);

      ctx.font = 'bold 13px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.fillStyle = `rgba(255, 255, 255, ${textAlpha})`;
      ctx.fillText(node.data.name, labelX, node.sy + 11);
    });

    frameId = requestAnimationFrame(draw);
  }

  // Pointer helpers (supports mouse & touch)
  function onPointerDown(clientX, clientY) {
    state.isDragging = true;
    state.hasDragged = false;
    state.lastMouse = { x: clientX, y: clientY };
    state.downPos = { x: clientX, y: clientY };
    state.autoRotate = false;
    updateRotateButton();
  }

  function onPointerMove(clientX, clientY, shiftKey = false) {
    const hover = findNodeAt(clientX, clientY);
    state.hoveredId = hover ? hover.id : null;
    canvas.style.cursor = hover ? 'pointer' : state.isDragging ? 'grabbing' : 'grab';

    if (!state.isDragging) return;
    const dx = clientX - state.lastMouse.x;
    const dy = clientY - state.lastMouse.y;
    const totalDist = Math.hypot(clientX - state.downPos.x, clientY - state.downPos.y);
    if (totalDist > 7) state.hasDragged = true;

    if (state.viewMode === '2d' || shiftKey) {
      const cosT = state.viewMode === '3d' ? Math.cos(state.theta) : 1;
      const sinT = state.viewMode === '3d' ? Math.sin(state.theta) : 0;
      const panSpeed = 1.0 / state.zoom;
      state.panOffset.x -= dx * cosT * panSpeed;
      state.panOffset.z -= dx * sinT * panSpeed;
      state.panOffset.y -= dy * panSpeed;
    } else {
      state.theta += dx * 0.005;
      state.phi = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, state.phi - dy * 0.005));
    }

    state.lastMouse = { x: clientX, y: clientY };
  }

  function onPointerUp(clientX, clientY) {
    state.isDragging = false;
    if (!state.hasDragged) {
      const clicked = findNodeAt(clientX, clientY);
      if (clicked) {
        selectFunction(clicked.index, true);
      }
    }
    canvas.style.cursor = state.hoveredId ? 'pointer' : 'grab';
  }

  function updateRotateButton() {
    if (!rotateBtn) return;
    rotateBtn.setAttribute('aria-pressed', String(state.autoRotate));
    rotateBtn.classList.toggle('is-active', state.autoRotate);
  }

  function updateModeButton() {
    if (!modeBtn) return;
    modeBtn.textContent = state.viewMode === '3d' ? '2D View' : '3D Orbit';
  }

  canvas.addEventListener('mousedown', (e) => onPointerDown(e.clientX, e.clientY));
  window.addEventListener('mousemove', (e) => onPointerMove(e.clientX, e.clientY, e.shiftKey));
  window.addEventListener('mouseup', (e) => {
    if (state.isDragging) onPointerUp(e.clientX, e.clientY);
  });

  canvas.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        onPointerDown(t.clientX, t.clientY);
      }
    },
    { passive: true }
  );
  canvas.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches.length === 1) {
        const t = e.touches[0];
        onPointerMove(t.clientX, t.clientY, false);
      }
    },
    { passive: true }
  );
  canvas.addEventListener(
    'touchend',
    (e) => {
      const t = e.changedTouches[0];
      if (t) onPointerUp(t.clientX, t.clientY);
    },
    { passive: true }
  );

  canvas.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      state.zoom = Math.max(0.4, Math.min(2.3, state.zoom - e.deltaY * 0.0014));
      state.autoRotate = false;
      updateRotateButton();
    },
    { passive: false }
  );

  prevBtn?.addEventListener('click', () => selectFunction(state.selectedIndex - 1, true));
  nextBtn?.addEventListener('click', () => selectFunction(state.selectedIndex + 1, true));
  zoomInBtn?.addEventListener('click', () => {
    state.zoom = Math.min(2.3, state.zoom + 0.16);
    state.autoRotate = false;
    updateRotateButton();
  });
  zoomOutBtn?.addEventListener('click', () => {
    state.zoom = Math.max(0.4, state.zoom - 0.16);
    state.autoRotate = false;
    updateRotateButton();
  });
  resetBtn?.addEventListener('click', () => {
    state.theta = 0.18;
    state.phi = -0.1;
    state.zoom = state.baseZoom;
    state.autoRotate = true;
    state.panOffset = { x: 0, y: 0, z: 0 };
    selectFunction(0, true);
    updateRotateButton();
  });
  rotateBtn?.addEventListener('click', () => {
    state.autoRotate = !state.autoRotate;
    updateRotateButton();
  });
  modeBtn?.addEventListener('click', () => {
    state.viewMode = state.viewMode === '3d' ? '2d' : '3d';
    updateModeButton();
  });

  journeyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.getAttribute('data-fn-index'));
      if (!Number.isNaN(idx)) selectFunction(idx, true);
    });
  });

  window.addEventListener('resize', resize);
  resize();
  state.zoom = state.baseZoom;
  selectFunction(0, true);
  updateRotateButton();
  updateModeButton();
  frameId = requestAnimationFrame(draw);

  return () => {
    window.removeEventListener('resize', resize);
    cancelAnimationFrame(frameId);
  };
}
