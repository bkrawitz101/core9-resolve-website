function getHash(str) {
  if (!str) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function splitMobileLabel(name) {
  if (!name) return [''];
  if (name.includes('&')) {
    const idx = name.indexOf('&');
    return [name.slice(0, idx + 1).trim(), name.slice(idx + 1).trim()].filter(Boolean);
  }
  const words = name.trim().split(/\s+/);
  if (words.length <= 1 || name.length <= 12) return [name];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

const CORE9_COLORS = {
  bgTop: '#132238',
  bgBottom: '#17263d',
  goldCore: '#d7bc8c',
  goldBright: '#e4cb9c',
  goldMuted: '#b79a69',
  pearl: '#f3efe7',
};

const SPOKE_COLORS = ['#e4cb9c', '#f3efe7', '#b79a69'];

export function initNineFunctionsJourney(rootEl, functionsData) {
  const stageEl = rootEl.querySelector('#circle-stage');
  const canvas = rootEl.querySelector('#flow-canvas');
  const detailOverlay = rootEl.querySelector('#fractal-detail-panel');
  if (!stageEl || !canvas || !Array.isArray(functionsData) || functionsData.length === 0) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const tagEl = rootEl.querySelector('#detail-tag');
  const titleEl = rootEl.querySelector('#detail-title');
  const questionEl = rootEl.querySelector('#detail-question');
  const summaryEl = rootEl.querySelector('#detail-summary');
  const explanationEl = rootEl.querySelector('#detail-explanation');
  const scalesEl = rootEl.querySelector('#detail-scales');
  const flowEl = rootEl.querySelector('#detail-flow');
  const storyLinkEl = rootEl.querySelector('#detail-story-link');
  const backCircleBtn = rootEl.querySelector('#btn-back-circle');
  const prevBtn = rootEl.querySelector('#btn-prev-fn');
  const nextBtn = rootEl.querySelector('#btn-next-fn');
  const stepPills = Array.from(rootEl.querySelectorAll('[data-fn-index]'));

  const state = {
    mode: 'circle',
    selectedIndex: 0,
    hoveredNodeKey: null,
    isWarping: false,
    warpDirection: 'down',
    warpProgress: 0,
    warpAnchor: { x: 0, y: 0 },
    pendingMode: null,
    pendingIndex: 0,
    width: 960,
    height: 600,
  };

  const sporeProgresses = {};

  function resize() {
    const rect = stageEl.getBoundingClientRect();
    const width = Math.max(300, Math.floor(rect.width || 960));
    const height = Math.max(220, Math.floor(rect.height || 600));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    state.width = width;
    state.height = height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function updateDetailCard(index) {
    const fn = functionsData[index];
    if (!fn) return;

    if (tagEl) tagEl.textContent = fn.role_tag || `${fn.num} · FUNCTION`;
    if (titleEl) titleEl.textContent = `${fn.num}. ${fn.name}`;
    if (questionEl) questionEl.textContent = fn.question || '';
    if (summaryEl) summaryEl.textContent = fn.summary || '';
    if (explanationEl) explanationEl.textContent = fn.explanation || '';
    if (scalesEl) scalesEl.textContent = fn.scales_note || '';
    if (flowEl) flowEl.textContent = fn.flow_label || '';
    if (storyLinkEl) {
      storyLinkEl.setAttribute('href', fn.href || '#');
      storyLinkEl.textContent = `Open Function ${fn.num} Interactive Story →`;
    }

    stepPills.forEach((pill) => {
      const idx = Number(pill.getAttribute('data-fn-index'));
      const isCurrent = state.mode === 'detail' && idx === index;
      pill.setAttribute('aria-pressed', String(isCurrent));
      pill.classList.toggle('is-active', isCurrent);
    });
  }

  function syncOverlayVisibility() {
    const isDetail = state.mode === 'detail' && !state.isWarping;
    stageEl.classList.toggle('is-detail-mode', state.mode === 'detail');
    if (detailOverlay) {
      detailOverlay.hidden = state.mode !== 'detail';
      detailOverlay.classList.toggle('is-visible', isDetail);
    }
    // Re-measure canvas height after mobile `.is-detail-mode` CSS changes height
    requestAnimationFrame(resize);
  }

  function getCircleLayout() {
    const { width, height } = state;
    const isNarrow = width < 680;
    const cx = width / 2;
    const cy = height / 2 + (isNarrow ? 12 : 8);

    // On narrow phones, give vertical room and keep horizontal radius compact enough for clean 2-line radial labels
    const rx = isNarrow
      ? Math.max(68, Math.min(width * 0.23, 108))
      : Math.min(width * 0.29, height * 0.34, 215);
    const ry = isNarrow
      ? Math.max(118, Math.min(height * 0.34, 162))
      : rx;

    const nodes = functionsData.map((fn, idx) => {
      const angle = -Math.PI / 2 + (idx / functionsData.length) * Math.PI * 2;
      const x = cx + Math.cos(angle) * rx;
      const y = cy + Math.sin(angle) * ry;
      return {
        key: `circle-${fn.num}`,
        index: idx,
        x,
        y,
        angle,
        radius: isNarrow ? 17 : 27,
        hash: getHash(`fn-${fn.num}`),
        data: fn,
      };
    });

    const edges = nodes.map((src, idx) => {
      const tgt = nodes[(idx + 1) % nodes.length];
      return {
        id: `c-edge-${idx}`,
        source: src,
        target: tgt,
        primary: true,
        bias: isNarrow ? 10 : 14,
        hash: getHash(`c-edge-${idx}`),
      };
    });

    for (let i = 0; i < nodes.length; i += 1) {
      const chordTarget = nodes[(i + 3) % nodes.length];
      edges.push({
        id: `chord-${i}`,
        source: nodes[i],
        target: chordTarget,
        primary: false,
        bias: -8,
        hash: getHash(`chord-${i}`),
      });
    }

    return { cx, cy, rx, ry, isNarrow, nodes, edges };
  }

  function getDetailLayout() {
    const { width, height } = state;
    const isStacked = width < 900;
    const cx = isStacked ? width * 0.5 : width * 0.24;
    const cy = isStacked ? height * 0.46 : height * 0.5;
    const orbit = isStacked ? Math.min(width * 0.26, height * 0.33, 84) : Math.min(width * 0.16, height * 0.28, 138);

    const fn = functionsData[state.selectedIndex] || functionsData[0];
    const centerNode = {
      key: `detail-center-${fn.num}`,
      index: state.selectedIndex,
      x: cx,
      y: cy,
      radius: isStacked ? 26 : 38,
      hash: getHash(`detail-${fn.num}`),
      isCenter: true,
      subLabel: `FUNCTION ${fn.num}`,
      title: isStacked ? fn.name : fn.name,
    };

    const subSpecs = [
      { key: 'question', angle: -Math.PI * 0.72, subLabel: 'QUESTION', title: 'What It Asks' },
      { key: 'scales', angle: Math.PI * 0.72, subLabel: '3 SCALES', title: isStacked ? 'All Scales' : 'Personal · Family · Business' },
      { key: 'flow', angle: 0, subLabel: 'NEXT STEP', title: 'Feeds Cycle' },
    ];

    const subNodes = subSpecs.map((spec) => ({
      key: `sub-${spec.key}`,
      x: cx + Math.cos(spec.angle) * orbit,
      y: cy + Math.sin(spec.angle) * orbit,
      angle: spec.angle,
      radius: isStacked ? 14 : 20,
      hash: getHash(spec.key),
      isCenter: false,
      subLabel: spec.subLabel,
      title: spec.title,
    }));

    const nodes = [centerNode, ...subNodes];
    const edges = subNodes.map((sub, i) => ({
      id: `d-edge-${i}`,
      source: centerNode,
      target: sub,
      primary: true,
      bias: i % 2 === 0 ? 12 : -12,
      hash: getHash(`d-edge-${i}`),
    }));

    for (let i = 0; i < subNodes.length; i += 1) {
      edges.push({
        id: `d-ring-${i}`,
        source: subNodes[i],
        target: subNodes[(i + 1) % subNodes.length],
        primary: false,
        bias: 16,
        hash: getHash(`d-ring-${i}`),
      });
    }

    return { cx, cy, isStacked, nodes, edges };
  }

  function startFractalTransition(targetMode, targetIndex) {
    if (state.isWarping) return;

    const currentLayout = getCircleLayout();
    const anchorNode = currentLayout.nodes[targetIndex] || currentLayout.nodes[0];

    state.warpDirection = targetMode === 'detail' ? 'down' : 'up';
    state.warpAnchor =
      state.mode === 'circle' && targetMode === 'detail' && anchorNode
        ? { x: anchorNode.x, y: anchorNode.y }
        : { x: state.width / 2, y: state.height / 2 };

    if (state.mode === 'detail' && targetMode === 'detail') {
      state.warpAnchor = {
        x: state.width < 900 ? state.width * 0.5 : state.width * 0.24,
        y: state.width < 900 ? state.height * 0.46 : state.height * 0.5,
      };
    }

    state.pendingMode = targetMode;
    state.pendingIndex = ((targetIndex % functionsData.length) + functionsData.length) % functionsData.length;
    state.warpProgress = 0;
    state.isWarping = true;
    state.hoveredNodeKey = null;

    if (detailOverlay && targetMode === 'circle') {
      detailOverlay.classList.remove('is-visible');
    }
  }

  function drawTendrilsAndSpores(edges, time, scaleFactor, cxOrigin, cyOrigin) {
    edges.forEach((edge) => {
      const sx0 = cxOrigin + (edge.source.x - cxOrigin) * scaleFactor;
      const sy0 = cyOrigin + (edge.source.y - cyOrigin) * scaleFactor;
      const tx0 = cxOrigin + (edge.target.x - cxOrigin) * scaleFactor;
      const ty0 = cyOrigin + (edge.target.y - cyOrigin) * scaleFactor;

      const isActive =
        state.hoveredNodeKey === edge.source.key || state.hoveredNodeKey === edge.target.key;

      const dx = tx0 - sx0;
      const dy = ty0 - sy0;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      const amp = Math.min(14, len * 0.08);
      const segments = 14;
      const tendrilsCount = edge.primary ? 5 : 2;
      const tendrilPaths = [];

      for (let j = 0; j < tendrilsCount; j += 1) {
        const pts = [];
        for (let k = 0; k <= segments; k += 1) {
          const t = k / segments;
          const bx = sx0 + dx * t;
          const by = sy0 + dy * t;
          const arch = edge.bias * scaleFactor * Math.sin(t * Math.PI);
          const wave = Math.sin(k * 0.55 + j * 1.4 + time * 1.2) * amp * Math.sin(t * Math.PI);
          pts.push({
            x: bx + nx * (arch + wave * Math.cos(j * 0.9)),
            y: by + ny * (arch + wave * Math.sin(j * 0.9)),
          });
        }
        tendrilPaths.push(pts);

        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let k = 1; k < pts.length; k += 1) {
          ctx.lineTo(pts[k].x, pts[k].y);
        }

        if (edge.primary) {
          const alpha =
            j === 0
              ? isActive
                ? 0.72
                : 0.34
              : j === 1
                ? isActive
                  ? 0.45
                  : 0.2
                : isActive
                  ? 0.26
                  : 0.08;
          ctx.strokeStyle =
            j === 1
              ? `rgba(243, 239, 231, ${alpha})`
              : `rgba(215, 188, 140, ${alpha})`;
          ctx.lineWidth = j === 0 ? 1.15 : j === 1 ? 0.7 : 0.5;
        } else {
          ctx.strokeStyle = isActive ? 'rgba(215, 188, 140, 0.14)' : 'rgba(215, 188, 140, 0.045)';
          ctx.lineWidth = 0.6;
        }
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      if (!edge.primary) return;

      const sporeCount = 2;
      for (let s = 0; s < sporeCount; s += 1) {
        const key = `${edge.id}-${s}`;
        if (sporeProgresses[key] === undefined) {
          sporeProgresses[key] = (edge.source.index / 9 + s * 0.48) % 1.0;
        }
        sporeProgresses[key] = (sporeProgresses[key] + 0.0024 + s * 0.001) % 1.0;

        const path = tendrilPaths[s % tendrilPaths.length];
        const segFloat = sporeProgresses[key] * (path.length - 1);
        const i1 = Math.floor(segFloat);
        const i2 = Math.min(path.length - 1, i1 + 1);
        const frac = segFloat - i1;
        const px = path[i1].x + (path[i2].x - path[i1].x) * frac;
        const py = path[i1].y + (path[i2].y - path[i1].y) * frac;

        const glowR = (isActive ? 7.5 : 5.2) * Math.min(1.25, Math.max(0.72, scaleFactor));
        const col = SPOKE_COLORS[(edge.source.index + s) % SPOKE_COLORS.length];
        const grad = ctx.createRadialGradient(px, py, 0, px, py, glowR);
        grad.addColorStop(0, col);
        grad.addColorStop(0.35, col);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(px, py, glowR, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    });
  }

  function drawNode(node, time, x, y, scaleFactor, showLabels, isCompact) {
    const isHovered = state.hoveredNodeKey === node.key;
    const isHighlighted = isHovered || node.isCenter;
    const r = node.radius * Math.max(0.55, Math.min(1.6, scaleFactor));
    const pulse = 1.0 + Math.sin(time * 2.2 + node.hash) * 0.035;
    const haloR = r * (isHighlighted ? 1.16 : 1.0) * pulse;

    // Dashed orbital ring
    ctx.strokeStyle = isHighlighted
      ? 'rgba(228, 203, 156, 0.65)'
      : 'rgba(215, 188, 140, 0.28)';
    ctx.lineWidth = isHighlighted ? 1.4 : 1.0;
    ctx.setLineDash(node.isCenter ? [] : [4, 5]);
    ctx.beginPath();
    const rot = isHighlighted ? time * 0.35 : 0;
    ctx.arc(x, y, haloR, rot, rot + Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    if (isHighlighted) {
      const ping = 1.0 + ((time * 1.1 + Math.abs(node.hash)) % 1.0) * 0.65;
      ctx.strokeStyle = 'rgba(228, 203, 156, 0.28)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, r * ping, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Radial gold atmospheric glow
    const glowR = r * (isHighlighted ? 2.6 : 1.85);
    const glowGrad = ctx.createRadialGradient(x, y, 0, x, y, glowR);
    glowGrad.addColorStop(0, 'rgba(215, 188, 140, 0.34)');
    glowGrad.addColorStop(0.4, 'rgba(183, 154, 105, 0.14)');
    glowGrad.addColorStop(1, 'rgba(21, 36, 58, 0)');
    ctx.beginPath();
    ctx.arc(x, y, glowR, 0, Math.PI * 2);
    ctx.fillStyle = glowGrad;
    ctx.fill();

    // Glowing orb nucleus
    const coreR = r * (isHighlighted ? 0.42 : 0.34);
    ctx.beginPath();
    ctx.arc(x, y, coreR, 0, Math.PI * 2);
    ctx.fillStyle = isHighlighted ? CORE9_COLORS.goldBright : CORE9_COLORS.goldCore;
    ctx.shadowColor = CORE9_COLORS.goldBright;
    ctx.shadowBlur = isHighlighted ? 18 : 8;
    ctx.fill();
    ctx.shadowBlur = 0;

    if (node.data && isCompact) {
      // Crisp number right inside the orb on mobile
      ctx.font = '700 8.5px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#15243a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(node.index + 1), x, y + 0.5);
    } else {
      ctx.beginPath();
      ctx.arc(x, y, coreR * 0.36, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    if (!showLabels) return;

    if (node.data) {
      const cosA = Math.cos(node.angle);
      const sinA = Math.sin(node.angle);
      const isTop = Math.abs(cosA) < 0.08 && sinA < 0;
      const numLabel = node.data.num;
      const nameLabel = node.data.name;

      ctx.textBaseline = 'middle';

      if (isTop) {
        ctx.textAlign = 'center';
        ctx.font = `700 ${isCompact ? 9.5 : 11}px system-ui, -apple-system, sans-serif`;
        ctx.fillStyle = CORE9_COLORS.goldCore;
        ctx.fillText(isCompact ? `01` : numLabel, x, y - haloR - (isCompact ? 22 : 28));

        ctx.font = `600 ${isCompact ? 12 : 14}px Georgia, "Times New Roman", serif`;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(nameLabel, x, y - haloR - (isCompact ? 9 : 12));
      } else if (isCompact) {
        // Mobile radial short-wrapped labels cleanly spaced without side-edge clipping
        const onRight = cosA >= 0;
        const pad = haloR + 7;
        const lx = onRight ? x + pad : x - pad;
        ctx.textAlign = onRight ? 'left' : 'right';

        const lines = splitMobileLabel(nameLabel);
        ctx.font = '600 10.5px Georgia, "Times New Roman", serif';
        ctx.fillStyle = isHovered ? '#ffffff' : CORE9_COLORS.pearl;
        if (lines.length === 1) {
          ctx.fillText(lines[0], lx, y);
        } else {
          ctx.fillText(lines[0], lx, y - 6);
          ctx.fillText(lines[1], lx, y + 7);
        }
      } else {
        const onRight = cosA >= 0;
        const pad = haloR + 15;
        const lx = onRight ? x + pad : x - pad;
        ctx.textAlign = onRight ? 'left' : 'right';

        ctx.font = '700 10.5px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = isHovered ? CORE9_COLORS.goldBright : CORE9_COLORS.goldCore;
        ctx.fillText(`FUNCTION ${numLabel}`, lx, y - 7);

        ctx.font = '600 14px Georgia, "Times New Roman", serif';
        ctx.fillStyle = isHovered ? '#ffffff' : CORE9_COLORS.pearl;
        ctx.fillText(nameLabel, lx, y + 9);
      }
    } else if (node.subLabel) {
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.font = `700 ${isCompact ? 8.5 : 10}px system-ui, -apple-system, sans-serif`;
      ctx.fillStyle = CORE9_COLORS.goldCore;
      ctx.fillText(node.subLabel, x, y + haloR + (isCompact ? 10 : 14));
      ctx.font = `600 ${isCompact ? 11 : 13}px Georgia, "Times New Roman", serif`;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(node.title, x, y + haloR + (isCompact ? 23 : 30));
    }
  }

  let frameId = 0;

  function draw() {
    const { width, height } = state;
    const time = Date.now() * 0.001;

    let scaleFactor = 1.0;
    let sceneAlpha = 1.0;

    if (state.isWarping) {
      state.warpProgress += 0.022;
      if (state.warpProgress >= 0.5 && state.pendingMode !== null) {
        state.mode = state.pendingMode;
        state.selectedIndex = state.pendingIndex;
        state.pendingMode = null;
        updateDetailCard(state.selectedIndex);
        syncOverlayVisibility();
      }
      if (state.warpProgress >= 1.0) {
        state.warpProgress = 0;
        state.isWarping = false;
        syncOverlayVisibility();
      } else if (state.warpProgress < 0.5) {
        const p = state.warpProgress / 0.5;
        scaleFactor =
          state.warpDirection === 'down'
            ? 1.0 + Math.pow(p, 3.0) * 9.0
            : Math.max(0.08, 1.0 - p * 0.9);
        sceneAlpha = Math.max(0, 1.0 - p);
      } else {
        const p = (state.warpProgress - 0.5) / 0.5;
        scaleFactor =
          state.warpDirection === 'down'
            ? Math.max(0.08, Math.pow(p, 2.0))
            : 1.0 + Math.pow(1.0 - p, 2.8) * 6.0;
        sceneAlpha = p;
      }
    }

    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, CORE9_COLORS.bgTop);
    bgGrad.addColorStop(1, CORE9_COLORS.bgBottom);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    const aura = ctx.createRadialGradient(
      width * 0.5,
      height * 0.5,
      0,
      width * 0.5,
      height * 0.5,
      Math.max(width, height) * 0.55
    );
    aura.addColorStop(0, 'rgba(183, 154, 105, 0.11)');
    aura.addColorStop(0.55, 'rgba(142, 166, 199, 0.05)');
    aura.addColorStop(1, 'rgba(21, 36, 58, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = sceneAlpha;

    if (state.mode === 'circle') {
      const { cx, cy, rx, ry, isNarrow, nodes, edges } = getCircleLayout();
      const pivotX = state.isWarping ? state.warpAnchor.x : cx;
      const pivotY = state.isWarping ? state.warpAnchor.y : cy;

      ctx.strokeStyle = 'rgba(215, 188, 140, 0.14)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(
        pivotX + (cx - pivotX) * scaleFactor,
        pivotY + (cy - pivotY) * scaleFactor,
        rx * scaleFactor,
        ry * scaleFactor,
        0,
        0,
        Math.PI * 2
      );
      ctx.stroke();

      if (!state.isWarping) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `700 ${isNarrow ? 9 : 10.5}px system-ui, -apple-system, sans-serif`;
        ctx.fillStyle = 'rgba(215, 188, 140, 0.78)';
        ctx.fillText('CORE9 RESOLVE™', cx, cy - (isNarrow ? 12 : 13));

        ctx.font = `italic 600 ${isNarrow ? 13.5 : 19}px Georgia, "Times New Roman", serif`;
        ctx.fillStyle = '#ffffff';
        ctx.fillText('Circle of Nine', cx, cy + (isNarrow ? 4 : 8));

        ctx.font = `${isNarrow ? 9.5 : 12}px system-ui, -apple-system, sans-serif`;
        ctx.fillStyle = 'rgba(207, 215, 227, 0.72)';
        ctx.fillText(isNarrow ? 'Tap any point' : 'Select a point to fractal in', cx, cy + (isNarrow ? 21 : 30));
      }

      drawTendrilsAndSpores(edges, time, scaleFactor, pivotX, pivotY);

      nodes.forEach((node) => {
        const nx = pivotX + (node.x - pivotX) * scaleFactor;
        const ny = pivotY + (node.y - pivotY) * scaleFactor;
        drawNode(node, time, nx, ny, scaleFactor, !state.isWarping, isNarrow);
      });
    } else {
      const { cx, cy, isStacked, nodes, edges } = getDetailLayout();
      drawTendrilsAndSpores(edges, time, scaleFactor, cx, cy);

      nodes.forEach((node) => {
        const nx = cx + (node.x - cx) * scaleFactor;
        const ny = cy + (node.y - cy) * scaleFactor;
        drawNode(node, time, nx, ny, scaleFactor, !state.isWarping, isStacked);
      });
    }

    if (state.isWarping) {
      const burstR = state.warpProgress * Math.max(width, height) * 0.45;
      ctx.strokeStyle = `rgba(228, 203, 156, ${0.38 * (1 - state.warpProgress)})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(state.warpAnchor.x, state.warpAnchor.y, burstR, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
    frameId = requestAnimationFrame(draw);
  }

  function findInteractiveCircleNode(clientX, clientY) {
    if (state.mode !== 'circle' || state.isWarping) return null;
    const rect = canvas.getBoundingClientRect();
    const mx = clientX - rect.left;
    const my = clientY - rect.top;
    const { nodes } = getCircleLayout();

    let closest = null;
    let minDist = Infinity;
    for (const node of nodes) {
      const dist = Math.hypot(mx - node.x, my - node.y);
      if (dist <= node.radius + 26 && dist < minDist) {
        minDist = dist;
        closest = node;
      }
    }
    return closest;
  }

  canvas.addEventListener('mousemove', (e) => {
    const hover = findInteractiveCircleNode(e.clientX, e.clientY);
    state.hoveredNodeKey = hover ? hover.key : null;
    canvas.style.cursor = hover ? 'pointer' : 'default';
  });

  canvas.addEventListener('mouseleave', () => {
    state.hoveredNodeKey = null;
    canvas.style.cursor = 'default';
  });

  canvas.addEventListener('click', (e) => {
    const clicked = findInteractiveCircleNode(e.clientX, e.clientY);
    if (clicked) {
      startFractalTransition('detail', clicked.index);
    }
  });

  backCircleBtn?.addEventListener('click', () => {
    if (state.mode === 'detail') {
      startFractalTransition('circle', state.selectedIndex);
    }
  });

  prevBtn?.addEventListener('click', () => {
    startFractalTransition('detail', state.selectedIndex - 1);
  });

  nextBtn?.addEventListener('click', () => {
    startFractalTransition('detail', state.selectedIndex + 1);
  });

  stepPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const idx = Number(pill.getAttribute('data-fn-index'));
      if (!Number.isNaN(idx)) {
        startFractalTransition('detail', idx);
      }
    });
  });

  window.addEventListener('resize', resize);
  resize();
  updateDetailCard(0);
  syncOverlayVisibility();
  frameId = requestAnimationFrame(draw);

  return () => {
    window.removeEventListener('resize', resize);
    cancelAnimationFrame(frameId);
  };
}
