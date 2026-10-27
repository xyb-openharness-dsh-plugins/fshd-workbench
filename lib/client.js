window.__ModuleLoader__.load({
  id: "@xyb-community/fshd-workbench",
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const metadata = {"title":"小飞侠 FSHD 工作台","description":"本机优先的FSHD基因确诊档案、功能与辅助器具、并发症筛查、疼痛疲劳与生活就业、遗传家庭沟通工作台"}
    const UI_ENTRY = '/api/fshd/ui/'
    function Panel() {
      return h('main', { className: 'wb-fshd-frame', style: { flex: 1, display: 'flex', minHeight: 0, background: '#f7faf8' } },
        h('iframe', {
          src: UI_ENTRY,
          title: metadata.title,
          loading: 'eager',
          style: { flex: 1, width: '100%', height: '100%', border: '0', minHeight: 0, display: 'block' },
          'aria-label': metadata.title,
        }))
    }
    function apply(ctx) {
      ctx.effect(() => ctx.desktopWorkbenches.register({
        "title":"小飞侠 FSHD 工作台",
        "repository":"https://github.com/xyb-openharness-dsh-plugins/fshd-workbench",
        "description":"本机优先的FSHD基因确诊档案、功能与辅助器具、并发症筛查、疼痛疲劳与生活就业、遗传家庭沟通工作台",
        "customFrame":true
      }, Panel))
    }
    return { apply, inject: ['desktopWorkbenches'] }
  }
})
