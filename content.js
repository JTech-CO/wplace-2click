(() => {
  'use strict';

  // ===== 설정 =====
  const TRIGGER_KEY = 'i';   // 트리거 키
  const CLICK_HOLD_MS = 100; // 클릭 유지 시간 (0.1초)
  const GAP_MS = 100;        // 두 클릭 사이 대기 (0.1초)

  // ===== 마우스 위치 추적 =====
  let mouseX = Math.floor(innerWidth / 2);
  let mouseY = Math.floor(innerHeight / 2);
  const track = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
  for (const type of ['mousemove', 'pointermove']) {
    addEventListener(type, track, { capture: true, passive: true });
  }

  // ===== 합성 마우스 이벤트 =====
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function fire(type, x, y, buttons) {
    const target = document.elementFromPoint(x, y) || document.body;
    if (!target) return;
    const init = {
      bubbles: true, cancelable: true, composed: true, view: window, detail: 1,
      clientX: x, clientY: y, screenX: x, screenY: y, button: 0, buttons,
    };
    const event = type.startsWith('pointer')
      ? new PointerEvent(type, { ...init, pointerId: 1, pointerType: 'mouse', isPrimary: true, pressure: buttons ? 0.5 : 0 })
      : new MouseEvent(type, init);
    target.dispatchEvent(event);
  }

  // 단일 클릭: 누름 → 유지 → 뗌
  async function click(x, y) {
    fire('pointerdown', x, y, 1);
    fire('mousedown', x, y, 1);
    await sleep(CLICK_HOLD_MS);
    fire('pointerup', x, y, 0);
    fire('mouseup', x, y, 0);
    fire('click', x, y, 0);
  }

  // 개별 2회 클릭: 클릭(0.1s) → 대기(0.1s) → 클릭(0.1s)
  async function doubleClick(x, y) {
    await click(x, y);
    await sleep(GAP_MS);
    await click(x, y);
  }

  // ===== 상태 표시 =====
  const BASE_TEXT = 'wplace 2click running';
  let indicator = null;

  function ensureIndicator() {
    if (indicator?.isConnected) return;
    indicator = document.createElement('div');
    indicator.textContent = BASE_TEXT;
    Object.assign(indicator.style, {
      position: 'fixed', top: '8px', left: '10px', zIndex: '2147483647',
      padding: '3px 8px', color: '#ff2d2d', background: 'rgba(0, 0, 0, 0.55)',
      font: '600 13px/1.45 system-ui, sans-serif', borderRadius: '4px',
      pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap',
    });
    (document.body || document.documentElement).appendChild(indicator);
  }

  function setActive(active) {
    if (indicator) indicator.textContent = active ? `${BASE_TEXT} ●` : BASE_TEXT;
  }

  const isTyping = (n) => !!n && (/^(INPUT|TEXTAREA|SELECT)$/.test(n.tagName) || n.isContentEditable);
  let busy = false;

  addEventListener('keydown', async (e) => {
    if (!e.isTrusted || busy) return;
    if (e.key?.toLowerCase() !== TRIGGER_KEY) return;
    if (e.ctrlKey || e.altKey || e.metaKey || e.repeat || e.isComposing) return;
    if (isTyping(e.target) || isTyping(document.activeElement)) return;

    busy = true;
    setActive(true);
    try {
      await doubleClick(mouseX, mouseY);
    } finally {
      setActive(false);
      busy = false;
    }
  }, true);

  // ===== 초기화 =====
  ensureIndicator();
  setInterval(ensureIndicator, 1500);
})();
