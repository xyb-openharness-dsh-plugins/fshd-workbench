window.__ModuleLoader__.load({
  id: '@xyb-community/fshd-workbench',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const UI_ENTRY = '/api/fshd/ui/'
    const API_PREFIX = UI_ENTRY.replace(/\/ui\/?$/, '') // → /api/fshd
    const VERSION = '0.1.5'
    const TITLE = '小飞侠'
    const PANEL_TITLE = '小飞侠 FSHD 工作台'
    const SUBTITLE = '本机资料 · 记录不是诊断'
    const DESCRIPTION = '把散落的检查、基因确诊档案、功能与康复记录、并发症筛查、疼痛疲劳与生活就业整理成可核对、可回溯的资料，并整理成就诊时能带着走的问题清单。'
    // 业务侧 ↔ 壳层 的消息类型（与 prototypes/v0.1/app.js 严格对应）
    const MT = {
      open: 'fshd:open-agent',
      close: 'fshd:close-agent',
      draft: 'fshd:agent-draft',
      state: 'fshd:agent-state',
    }

    /* ---- 面板宽度常量（customFrame 由工作台自管分栏；值只有这一份来源） ---- */
    const AGENT_DEFAULT = 0.35
    const AGENT_MIN = 0.25
    const AGENT_MAX = 0.45
    const AGENT_STEP = 0.02
    const NARROW_BELOW = 760
    const DRAWER_MAX = 420
    const WIDTH_KEY = 'xyb.fshd.agent-pane.v1'

    const clampWidth = (value) => {
      const n = Number(value)
      if (!Number.isFinite(n)) return AGENT_DEFAULT
      return Math.min(AGENT_MAX, Math.max(AGENT_MIN, n))
    }
    const snapWidth = (value) => clampWidth(Math.round(value / AGENT_STEP) * AGENT_STEP)
    const round4 = (n) => Math.round(n * 10000) / 10000

    function loadWidth() {
      try {
        const saved = JSON.parse(localStorage.getItem(WIDTH_KEY) || 'null')
        return clampWidth(saved?.width)
      } catch { return AGENT_DEFAULT }
    }
    function saveWidth(width) {
      try { localStorage.setItem(WIDTH_KEY, JSON.stringify({ width: round4(width) })) } catch { /* 隐私模式忽略 */ }
    }

    /* ---- 品牌色与悬停光晕：与顶栏 AI 按钮同色，不写死蓝色 ---- */
    const SPLITTER_BRAND = '#1f7a4d'
    const splitterRgba = (hex, alpha) => {
      const raw = hex.replace('#', '')
      const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw
      const n = parseInt(full, 16)
      return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
    }

    /* ---------------- 样式 ---------------- */

    const rootStyle = {
      display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, minWidth: 0,
      width: '100%', maxWidth: '100%', boxSizing: 'border-box',
      background: '#f4f8f5', fontFamily: '-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif',
    }
    // 首个子元素必须是语义 <header>，避让 macOS 左上角窗口按钮（--dsh-frame-leading-clearance）。
    // 三段式：左=品牌+版本号；中=状态说明（flex:1 弱化）；右=AI 按钮组（margin-left:auto 紧贴右缘）。
    const headerStyle = {
      display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto', flexWrap: 'wrap',
      padding: '6px 12px', paddingInlineStart: 'var(--dsh-frame-leading-clearance, 12px)',
      borderBottom: '1px solid #e3ece6', background: '#eef4f0', fontSize: 12,
    }
    const brandStyle = {
      display: 'flex', alignItems: 'center', gap: 7, fontWeight: 700, color: '#1c5635',
      whiteSpace: 'nowrap', fontSize: 12.5,
    }
    const verStyle = {
      fontWeight: 500, fontSize: 11, color: '#5e7a68', background: '#e1ece4',
      borderRadius: 999, padding: '1px 8px', whiteSpace: 'nowrap',
    }
    const hintStyle = { flex: 1, minWidth: 200, color: '#6f8779', fontSize: 11.5 }
    const headerActionsStyle = {
      display: 'flex', alignItems: 'center', gap: 6, flex: '0 0 auto', marginLeft: 'auto',
    }
    const bodyStyle = { position: 'relative', display: 'flex', flex: 1, minHeight: 0, minWidth: 0, overflow: 'hidden' }
    const businessStyle = { flex: 1, minWidth: 0, minHeight: 0, display: 'flex', flexDirection: 'column' }
    const frameStyle = { flex: '1 1 auto', width: '100%', minHeight: 0, border: 0, display: 'block' }
    const paneStyle = {
      display: 'flex', flexDirection: 'column', flex: '0 0 auto', minWidth: 0, minHeight: 0,
      borderLeft: '1px solid #dce8e1', background: '#fff', overflow: 'hidden',
    }
    const drawerStyle = {
      position: 'absolute', top: 0, right: 0, bottom: 0, zIndex: 3,
      boxShadow: '-8px 0 24px rgba(23,62,46,0.14)',
    }
    /* 1px 视觉细线，绝对定位在业务区与会话区边界上（不占布局宽度）；热区由内部 11px 透明子元素提供 */
    const splitterStyle = {
      position: 'absolute', top: 0, bottom: 0, width: 1, marginRight: -0.5,
      zIndex: 2, background: '#dce8e1', cursor: 'col-resize', touchAction: 'none',
      transition: 'background .15s ease, box-shadow .15s ease',
    }
    const splitterHoverStyle = {
      ...splitterStyle, background: SPLITTER_BRAND,
      boxShadow: `0 0 6px ${splitterRgba(SPLITTER_BRAND, 0.55)}`,
    }
    const splitterDragStyle = {
      ...splitterHoverStyle,
      boxShadow: `0 0 10px ${splitterRgba(SPLITTER_BRAND, 0.8)}`,
    }
    const splitterHitStyle = {
      position: 'absolute', top: 0, bottom: 0, left: -5, width: 11,
      background: 'transparent', cursor: 'col-resize',
    }
    const splitterGripStyle = {
      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      width: 14, height: 22, borderRadius: 4, background: SPLITTER_BRAND,
      color: '#fff', fontSize: 11, lineHeight: '22px', letterSpacing: '-1px', textAlign: 'center',
      opacity: 0.95, pointerEvents: 'none', userSelect: 'none',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.18)',
    }
    const dragShieldStyle = {
      position: 'absolute', top: 0, right: 0, bottom: 0, left: 0,
      zIndex: 4, cursor: 'col-resize',
    }
    const fallbackStyle = { padding: 24, color: '#234033', fontSize: 14, lineHeight: 1.7 }
    // AI 按钮：全屏唯一强色块（品牌绿）；收起 × 为中性幽灵按钮。
    const buttonStyle = {
      border: 0, borderRadius: 999, padding: '5px 14px', whiteSpace: 'nowrap',
      background: '#1f7a4d', color: '#fff', font: 'inherit', fontWeight: 600, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', gap: 7, minHeight: 30,
    }
    const ghostStyle = { ...buttonStyle, background: 'transparent', color: '#3d6450', border: '1px solid #cdddcd' }
    const padStyle = {
      display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center',
      padding: 20, color: '#3d6450', fontSize: 12.5, lineHeight: 1.75,
    }

    function Fallback({ onRetry }) {
      return h('div', { style: fallbackStyle },
        h('p', null, `页面没能加载（v${VERSION} · ${UI_ENTRY}）。常见原因是 Harness 刚重启、插件还没加载完。`),
        h('p', null, '本工作台的数据只存在你选择的本机目录里，不会因为这个提示丢失。'),
        h('button', { type: 'button', style: buttonStyle, onClick: onRetry }, '重新加载'),
      )
    }

    /* ---------------- 会话判定（官方 dsh-site-selection 同款） ---------------- */

    let bridge = null
    function currentSession() {
      const service = bridge?.desktopWorkbenches
      if (typeof service?.currentSession === 'function') return service.currentSession() || null
      const snapshot = bridge?.sessions?.list?.getSnapshot?.()
      return snapshot?.current || Object.keys(snapshot?.byId || {}).find((id) =>
        (snapshot.byId[id]?.retainedBy?.mainView ?? 0) > 0) || null
    }
    function workbenchOwnsSession(sessionId) {
      if (!sessionId) return false
      const service = bridge?.desktopWorkbenches
      if (typeof service?.ownsSession === 'function') return service.ownsSession(sessionId)
      return false
    }
    function ownedSession() {
      const id = currentSession()
      return workbenchOwnsSession(id) ? id : null
    }

    /* ---------------- 原生草稿：填入 + 可一键发送（34 号契约） ---------------- */

    function fillDraft(sessionId, prompt) {
      if (!sessionId || ownedSession() !== sessionId) throw new Error('会话已切换，请回到本工作台再操作')
      const actx = bridge.sessions.scope?.(sessionId)
      const conversation = actx?.get?.('conversation')
      if (!conversation) throw new Error('对话输入不可用')
      const input = conversation.input.for(actx)
      const snapshot = input.state.getSnapshot()
      // 冲突守卫：现有草稿含引用/特殊输入 → 不覆盖，提示用户先在原生会话处理
      if (snapshot.occurrences?.length || (snapshot.phase && snapshot.phase !== 'plain')) {
        throw new Error('当前草稿含引用或特殊输入，请先在原生会话里处理，再交给小飞侠')
      
      async function createOwnedSession() {
        let workspaceId
        try { workspaceId = service?.defaultWorkspace?.()?.workspaceId } catch { workspaceId = undefined }
        return service.newSession(workspaceId)
      }
}
      const current = snapshot.draft || ''
      input.setDraft(current.trim() ? `${current}\n\n${prompt}` : prompt)
    }

    const DRAFT_QUEUE_KEY = 'xyb.fshd.initial-drafts.v1'
    let pendingDraft = null // { sessionId, prompt, send }
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFT_QUEUE_KEY) || 'null')
      if (saved?.sessionId && saved?.prompt) pendingDraft = saved
    } catch { /* 隐私模式忽略 */ }
    function rememberDraft(entry) {
      pendingDraft = entry
      try {
        if (entry) localStorage.setItem(DRAFT_QUEUE_KEY, JSON.stringify(entry))
        else localStorage.removeItem(DRAFT_QUEUE_KEY)
      } catch { /* 隐私模式忽略 */ }
    }
    function flushDraft() {
      if (!pendingDraft) return false
      try {
        const { sessionId, prompt, send } = pendingDraft
        fillDraft(sessionId, prompt)
        if (send) {
          const actx = bridge.sessions.scope?.(sessionId)
          const input = actx?.get?.('conversation')?.input?.for?.(actx)
          const snap = input?.state?.getSnapshot?.()
          // 双守卫：仅 plain 相 + 非空才 submit，异常不抛出
          if (!input || (snap?.phase && snap.phase !== 'plain')) {
            throw new Error('草稿含引用或特殊输入，未自动发送；请回到会话处理')
          }
          input.submit?.()
        }
        rememberDraft(null)
        return true
      } catch { return false /* composer 未就绪就留给下一轮轮询 */ }
    }

    function onboardingPrompt(dir) {
      return [
        '你正在协助我使用「小飞侠 FSHD 工作台」。它只做本机资料整理与信息解释，不提供诊疗建议。',
        `资料目录：${dir || '（当前为内存模拟，尚未接入本机目录）'}`,
        '里面是我的基因确诊档案、功能评估、并发症筛查、疼痛疲劳记录、复诊准备与公共参考线索（如 Khub 病友社区、OpenRare 工具）。',
        '分工：你帮我汇总、找缺漏，把报告里的指标和日期整理成对照表，解释指南原文；判断和决定由我和治疗团队做。',
        '我标记的"看法"是我自己的担心或判断，不是医生结论；本工作台不替我下"好转/进展"之类的判断。',
      ].join('\n')
    }

    /* ---------------- 面板（customFrame） ---------------- */

    function Panel({ conversation }) {
      const [generation, setGeneration] = React.useState(0)
      const [broken, setBroken] = React.useState(false)
      const [note, setNote] = React.useState('')
      const [width, setWidth] = React.useState(loadWidth)
      const [paneOpen, setPaneOpen] = React.useState(true)
      const [connecting, setConnecting] = React.useState(false)
      const [narrow, setNarrow] = React.useState(false)
      const [dragging, setDragging] = React.useState(false)
      const [hovering, setHovering] = React.useState(false)
      const [frameReady, setFrameReady] = React.useState(0)

      const brokenTimer = React.useRef(null)
      const shellRef = React.useRef(null)
      const dragHostRef = React.useRef(null)
      const frameRef = React.useRef(null)

      // customFrame 下 conversation prop 恒非空（宿主即使无会话也交 display:none 容器）。
      // 不能拿它当"已有会话"判据——会话归属只能问 currentSession()+ownsSession(id)，
      // 并在 subscribe 回调里重算，否则按钮永远只是切显隐、ensureSession 永不触发（2026-10-24 教训）。
      const [sessionTick, bumpSessionTick] = React.useReducer((n) => n + 1, 0)
      const ownedId = React.useMemo(() => ownedSession(), [sessionTick])
      const hasConversation = Boolean(ownedId)
      const canOpenSession = typeof bridge?.desktopWorkbenches?.newSession === 'function'

      // 8 秒内无 onLoad 视为没起来：给可重试提示，不留白板。
      React.useEffect(() => {
        setBroken(false)
        brokenTimer.current = setTimeout(() => setBroken(true), 8000)
        return () => clearTimeout(brokenTimer.current)
      }, [generation])

      // 挂载后消化未送达开场白（composer 就绪每 500ms 一轮）+ 订阅会话变化；
      // 订阅回调必须 bumpSessionTick——会话是外面建的，不重算 hasConversation 会一直停在首帧。
      React.useEffect(() => {
        const timer = setInterval(() => { if (flushDraft()) setNote('草稿已填入右侧会话，按回车发送') }, 500)
        const unsubscribe = bridge?.desktopWorkbenches?.subscribe?.(() => { setNote(''); bumpSessionTick() })
        bumpSessionTick()
        return () => { clearInterval(timer); unsubscribe?.() }
      }, [])

      // 窄屏判定用容器宽度而非窗口宽度（合同 §3 基线）。
      React.useEffect(() => {
        const host = shellRef.current
        if (!host || typeof ResizeObserver !== 'function') return undefined
        const observer = new ResizeObserver((entries) => {
          const w = entries[0]?.contentRect?.width ?? 0
          setNarrow(w > 0 && w < NARROW_BELOW)
        })
        observer.observe(host)
        return () => observer.disconnect()
      }, [])

      const applyWidth = React.useCallback((next) => {
        const snapped = round4(snapWidth(next))
        setWidth(snapped)
        saveWidth(snapped)
      }, [])

      /* ---- splitter：指针拖动（按容器 rect 夹取，不按 window） ---- */
      const stopDrag = React.useCallback(() => {
        dragHostRef.current = null
        setDragging(false)
      }, [])
      React.useEffect(() => {
        if (!dragging) return undefined
        const onMove = (event) => {
          const host = dragHostRef.current
          if (!host) return
          const rect = host.getBoundingClientRect()
          if (!rect.width) return
          // 会话在右侧：指针越靠左，会话越宽
          applyWidth((rect.right - event.clientX) / rect.width)
        }
        document.addEventListener('pointermove', onMove)
        document.addEventListener('pointerup', stopDrag)
        document.addEventListener('pointercancel', stopDrag)
        return () => {
          document.removeEventListener('pointermove', onMove)
          document.removeEventListener('pointerup', stopDrag)
          document.removeEventListener('pointercancel', stopDrag)
        }
      }, [dragging, applyWidth, stopDrag])

      const onSplitterPointerDown = (event) => {
        event.preventDefault()
        dragHostRef.current = shellRef.current
        setDragging(true)
        try { event.currentTarget.setPointerCapture?.(event.pointerId) } catch { /* 由 document 监听兜住 */ }
      }
      const onSplitterKeyDown = (event) => {
        const delta = { ArrowLeft: AGENT_STEP, ArrowRight: -AGENT_STEP }[event.key] // ← 变宽
        if (delta !== undefined) { event.preventDefault(); applyWidth(width + delta); return }
        if (event.key === 'Home') { event.preventDefault(); applyWidth(AGENT_MAX); return }
        if (event.key === 'End') { event.preventDefault(); applyWidth(AGENT_MIN) }
      }

      /* ---- 打开 / 收起 AI 对话 ---- */
      async function openAgent(prompt = null, send = false) {
        setNote('')
        if (!canOpenSession) {
          setNote('当前 Desktop 版本不支持从面板调起会话；请从左侧会话列表新建会话')
          return
        }
        setConnecting(true)
        try {
          let dir = null
          try {
            const res = await fetch(`${API_PREFIX}/api/health`)
            dir = (await res.json())?.dir || null
          } catch { /* 拿不到目录也照样调起 */ }
          // folder 仅在拿到真实业务目录时才传：空 folder 会让 ensureSession 直接失败，比"没传"更糟。
          const id = await createOwnedSession()
          if (!id) {
            setNote('已取消资料目录选择，没有创建会话。可以再次点击「AI 对话」重试。')
            return
          }
          rememberDraft({ sessionId: id, prompt: prompt || onboardingPrompt(dir), send })
          flushDraft()
          setPaneOpen(true)
          setNote('会话已就绪：草稿已填入右侧输入框' + (send ? '并发送' : '') + '，按回车继续')
        } catch (error) {
          setNote(`没能调起会话：${error?.message ?? error}`)
        } finally {
          setConnecting(false)
        }
      }

      // 收起只是隐藏，不是结束/删除会话；再点「打开 AI 对话」回到同一会话。
      function onAgentClick() {
        if (!hasConversation) { void openAgent(); return }
        setPaneOpen((open) => !open)
        setNote('')
      }

      // 页面上「带入对话」按钮走这里：幂等——重复点不会把已展开的面板收起。
      async function ensureOpen(prompt = null, send = false) {
        if (!hasConversation) { await openAgent(prompt, send); return }
        setPaneOpen(true)
        if (prompt) { rememberDraft({ sessionId: ownedId, prompt, send }); setNote(flushDraft() ? '已把内容填入会话' + (send ? '并发送' : '') + '，按回车继续' : '会话输入框还没就绪；草稿已暂存，就绪后自动填入') }
        else setNote('会话已就绪')
      }

      // 业务页发来的「带入对话」草稿：填入原生输入框（可一键发送，34 号契约）。
      async function deliverContext(prompt, send = false) {
        const id = ownedSession()
        if (id) {
          rememberDraft({ sessionId: id, prompt, send })
          setPaneOpen(true)
          setNote(flushDraft()
            ? '已把这一页的内容填入会话' + (send ? '并发送' : '') + '，按回车继续'
            : '会话输入框还没就绪；草稿已暂存，就绪后自动填入')
          return
        }
        setNote('正在为你调起 AI 会话…')
        await openAgent(prompt, send)
      }

      // handler 每轮换成最新闭包，effect 只注册一次：
      // 直接在 effect 里闭包会拿到首帧 state（会话 ID 变了也不自知）。
      const deliverRef = React.useRef(null)
      React.useEffect(() => { deliverRef.current = deliverContext })
      const openRef = React.useRef(null)
      React.useEffect(() => { openRef.current = ensureOpen })
      const closeRef = React.useRef(null)
      React.useEffect(() => { closeRef.current = () => { if (hasConversation) setPaneOpen(false) } })
      React.useEffect(() => {
        function onMessage(event) {
          const data = event.data
          if (!data || typeof data !== 'object') return
          const type = data.type
          if (type !== MT.open && type !== MT.close && type !== MT.draft) return
          const frame = frameRef.current
          // 只认自己的 iframe 且同源：挡住同源其他窗口冒充。
          if (!frame || event.source !== frame.contentWindow) return
          if (event.origin !== window.location.origin) return
          if (type === MT.open) { void openRef.current?.(null, false); return }
          if (type === MT.close) { closeRef.current?.(); return }
          const prompt = typeof data.prompt === 'string' ? data.prompt.trim() : ''
          if (!prompt) return
          void deliverRef.current?.(prompt.slice(0, 8000), Boolean(data.send))
        }
        window.addEventListener('message', onMessage)
        return () => window.removeEventListener('message', onMessage)
      }, [])

      const agentLabel = !canOpenSession
        ? 'AI 对话暂不可用'
        : connecting ? '正在连接…'
          : !hasConversation ? 'AI 对话'
            : paneOpen ? '收起 AI 对话' : '打开 AI 对话'

      /* ---- 把会话状态回告业务页：让 iframe 内顶栏按钮显示真实五态 ---- */
      React.useEffect(() => {
        const frame = frameRef.current
        if (!frame?.contentWindow) return
        frame.contentWindow.postMessage({
          type: MT.state,
          connected: hasConversation,
          paneOpen: paneOpen && hasConversation,
          connecting,
          canOpen: canOpenSession,
        }, window.location.origin)
      }, [hasConversation, paneOpen, connecting, canOpenSession, frameReady, generation])

      if (broken) return h(Fallback, { onRetry: () => setGeneration((n) => n + 1) })

      const percent = Math.round(width * 100)
      const paneVisible = paneOpen && (hasConversation || connecting)

      return h('div', { style: rootStyle },
        h('header', { style: headerStyle },
          // 左侧：品牌 + 版本号（真机反馈：版本号放 logo 边上，不只藏在业务页右上角）
          h('span', { style: brandStyle }, '🦸 小飞侠'),
          h('span', { style: verStyle }, `v${VERSION}`),
          h('span', { style: hintStyle },
            hasConversation
              ? '右侧是 DSH 原生会话：可拖中间分隔边调整宽度（25%–45%），收起不会结束会话。'
              : '还没有会话。点右侧「AI 对话」调起原生会话，开场白只填进草稿，不自动发送。'),
          // 右侧：按钮组，margin-left:auto 紧贴右缘
          h('div', { style: headerActionsStyle },
            h('button', {
              type: 'button', style: buttonStyle, onClick: onAgentClick,
              disabled: connecting || !canOpenSession, 'aria-label': `AI 对话：${agentLabel}`,
            }, agentLabel),
            // 独立的收起控件，不把关闭藏在面板内部（合同 §1）
            hasConversation && paneOpen && h('button', {
              type: 'button', style: ghostStyle, onClick: () => setPaneOpen(false),
              'aria-label': '收起 AI 对话面板',
            }, '×'),
            note && h('span', { style: { color: '#2f6b49', fontWeight: 600 } }, note),
          ),
        ),
        h('div', { ref: shellRef, style: bodyStyle },
          h('div', { style: businessStyle },
            h('iframe', {
              key: generation, ref: frameRef, src: UI_ENTRY, title: `${TITLE} · ${SUBTITLE}`,
              style: frameStyle, sandbox: 'allow-scripts allow-same-origin allow-forms allow-downloads',
              onLoad: () => { setBroken(false); clearTimeout(brokenTimer.current); setFrameReady((n) => n + 1) },
            }),
          ),
          // splitter 只在宽屏出现；窄屏是覆盖式抽屉，拖宽没有意义。
          // 顺序必须在 aside 之前：排在后面会贴到面板最右缘，既没有悬停高亮也拖不动。
          !narrow && paneVisible && h('div', {
            role: 'separator', 'aria-orientation': 'vertical',
            'aria-label': '调整 AI 对话面板宽度',
            'aria-valuemin': Math.round(AGENT_MIN * 100),
            'aria-valuemax': Math.round(AGENT_MAX * 100),
            'aria-valuenow': percent,
            tabIndex: 0,
            style: {
              ...(dragging ? splitterDragStyle : hovering ? splitterHoverStyle : splitterStyle),
              right: `${percent}%`,
            },
            onPointerDown: onSplitterPointerDown,
            onPointerEnter: () => setHovering(true),
            onPointerLeave: () => setHovering(false),
            onKeyDown: onSplitterKeyDown,
          },
            h('span', { style: splitterHitStyle, 'aria-hidden': 'true' }),
            (hovering || dragging) ? h('span', { style: splitterGripStyle, 'aria-hidden': 'true' }, '⠿') : null),
          // 原生会话始终挂载：卸载会丢输入框与草稿状态（宿主明确要求不重挂输入树），隐藏走 display。
          h('aside', {
            style: {
              ...paneStyle,
              ...(narrow ? drawerStyle : null),
              width: narrow ? `min(92%, ${DRAWER_MAX}px)` : `${percent}%`,
              display: paneVisible ? 'flex' : 'none',
            },
            'aria-label': 'AI 对话',
            'aria-hidden': paneVisible ? undefined : 'true',
          }, conversation ?? h('div', { style: padStyle },
            h('b', null, 'AI 对话还没开始'),
            h('span', null, '点顶栏「AI 对话」调起 DSH 原生会话后，它会固定出现在这一侧。'),
            h('span', null, '没有会话也不影响记录：左侧的资料整理、指标与一图秀照常可用。'),
          )),
          // 拖动期间铺透明遮罩：指针掠过业务 iframe 时事件仍归文档，拖动不断
          dragging ? h('div', { style: dragShieldStyle, 'aria-hidden': 'true' }) : null,
        ),
      )
    }

    function apply(ctx) {
      bridge = ctx
      ctx.effect(() => ctx.desktopWorkbenches.register({
        title: TITLE,
        panelTitle: PANEL_TITLE,
        icon: '🦸',
        repository: 'https://github.com/xyb-openharness-dsh-plugins/fshd-workbench',
        description: DESCRIPTION,
        audience: 'FSHD 患者与照护者',
        requirements: '本机资料整理；不做诊断与处置建议，判断由用户与治疗团队做出。',
        initialization: 'empty',
        embedded: true,
        version: VERSION,
        author: '小飞侠社区贡献者',
        // 面板参数唯一来源；customFrame 下真实宽度由 AGENT_PANE 反推，这里只是注册元信息（宿主仍校验）。
        layout: { businessSide: 'left', businessWidth: 0.65 },
        customFrame: true,
      }, Panel))
    }

    return { apply, inject: ['desktopWorkbenches', 'sessions'] }
  },
})
