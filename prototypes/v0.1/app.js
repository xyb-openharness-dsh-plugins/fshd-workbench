'use strict';
const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pages=['看板','我的确诊','功能与康复','并发症筛查','疼痛与疲劳','检查与指标','病情一图秀','医保与资源','心理与生活','复诊准备','临床研究','设置'];
let current='看板', tab='全部', width=35;

/* ============================================================
   三组模拟档案（参考小肺宝 v4 PROFILES 结构；档案隔离记录与收藏）
   ============================================================ */
const PROFILES=[
{ id:'p1', name:'林晓飞', initial:'林', meta:'FSHD1 · 34 岁 · 进展期',
  gene:{repeats:3,haplo:'4qA',method:'光学基因组图谱（OGM）',type:'FSHD1',hospital:'北京协和医院 神经内科',date:'2025-03-14',
    quote:'4q35 D4Z4 重复单元数目 3，4qA 单倍型，符合 FSHD1 分子诊断特征。'},
  misdx:[
    {when:'2021-06',kind:'preliminary',label:'肢带型肌营养不良（LGMD）',hospital:'省人民医院 神经内科'},
    {when:'2024-11',kind:'revised',label:'修订诊断：考虑 FSHD，建议基因检测',hospital:'北京协和医院 神经内科'},
    {when:'2025-03',kind:'confirmed',label:'确诊 FSHD1（基因检测）',hospital:'北京协和医院 神经内科'}],
  family:[{relation:'母亲',status:'未检测（本人暂不打算检测）',note:'父亲疑似新生突变来源待遗传咨询确认'}],
  ck:[['2025-09-20',351],['2026-03-11',386],['2026-09-02',412]],ckRef:'40–320 U/L',
  emg:'2026-09-02 肌电图：肌源性损害，累及面肩肱分布（候选，待核对）',
  chartEvents:[
    {d:'2025-03-14',kind:'gene',title:'确诊 FSHD1'},
    {d:'2026-08-20',kind:'device',title:'AFO 配具'},
    {d:'2026-11-20',kind:'screen',title:'眼底复查到期'}]},
{ id:'p2', name:'周航', initial:'周', meta:'FSHD1 · 22 岁 · 确诊期（大学生）',
  gene:{repeats:2,haplo:'4qA',method:'实时荧光定量 PCR（qPCR）+ Southern Blot 复核',type:'FSHD1',hospital:'福建医科大学附属第一医院 神经内科',date:'2026-08-30',
    quote:'D4Z4 重复单元数目 2（qPCR），Southern Blot 复核一致，4qA 单倍型。'},
  misdx:[
    {when:'2026-04',kind:'preliminary',label:'「体质差、缺乏锻炼」',hospital:'校医院'},
    {when:'2026-06',kind:'revised',label:'肌电图提示肌源性损害，转诊基因检测',hospital:'省立医院 神经内科'},
    {when:'2026-08-30',kind:'confirmed',label:'确诊 FSHD1（基因检测）',hospital:'福建医科大学附属第一医院 神经内科'}],
  family:[{relation:'父亲',status:'临床评估疑似携带，未做基因确认',note:'家系检测已预约遗传咨询'}],
  ck:[['2026-06-20',298],['2026-08-30',322]],ckRef:'40–320 U/L',
  emg:'2026-06-20 肌电图：轻度肌源性改变（报告原文待录入）',
  chartEvents:[
    {d:'2026-08-30',kind:'gene',title:'确诊 FSHD1'},
    {d:'2026-11-10',kind:'screen',title:'基线筛查（计划）'}]},
{ id:'p3', name:'陈静', initial:'陈', meta:'FSHD1 · 41 岁 · 轻症外显（家系已知）',
  gene:{repeats:4,haplo:'4qA',method:'Southern Blot',type:'FSHD1',hospital:'上海华山医院 神经内科',date:'2019-05-22',
    quote:'D4Z4 重复单元数目 4，4qA 单倍型；与家系中已确诊成员一致的分子特征。'},
  misdx:[
    {when:'2019-05-22',kind:'confirmed',label:'确诊 FSHD1（家系检测，母亲与舅舅均为患者）',hospital:'上海华山医院 神经内科'}],
  family:[
    {relation:'母亲',status:'已确诊 FSHD1（轮椅）',note:'由本人照护为主'},
    {relation:'女儿（14 岁）',status:'未检测',note:'等她成年后自己决定；遗传咨询材料已备好'}],
  ck:[['2024-06-11',285],['2025-06-17',301],['2026-06-09',279],['2026-09-15',290]],ckRef:'40–320 U/L',
  emg:'2019-04 肌电图：轻度肌源性改变（历史报告）',
  chartEvents:[
    {d:'2019-05-22',kind:'gene',title:'确诊 FSHD1（家系）'},
    {d:'2026-10-25',kind:'screen',title:'呼吸功能复查到期'}]}
];
let profileId='p1';
const cur=()=>PROFILES.find(p=>p.id===profileId)||PROFILES[0];
const stateOf=id=>{stateOf.map=stateOf.map||{};const k=id;
  if(!stateOf.map[k])stateOf.map[k]={records:[],saved:new Set()};return stateOf.map[k];};
const records=()=>stateOf(profileId).records, saved=()=>stateOf(profileId).saved;

/* 公共资源与研究线索（与档案无关；核对日 2026-10-18） */
const resources=[
{id:'fshdchina',name:'FSHD-China · 你并不孤单',type:'患者组织',region:'中国',service:'FSHD 科普、病友交流与研究信息。',limit:'未核验法人登记、项目名额；不提供诊断。',url:'https://www.fshd-china.org/',evidence:'组织官网自述'},
{id:'khub',name:'Khub 罕见病开源社区',type:'患者组织',region:'中国 · 线上',service:'FSHD 病友发起的患者共创社区：AI×基因解读工具与脚本、单病种知识库（RAG）、「无界对话舱」等患者×技术×创新活动；与病痛挑战基金会等公益方协作。',limit:'社区工具输出属于线索与开源实践记录，不是诊断结论；项目状态与内容未逐项核实。',url:'https://mp.weixin.qq.com/s/EjxSO6ZFQaQdlTsInuO7kg',evidence:'社区公众号（2026-08）'},
{id:'icf',name:'病痛挑战公益基金会',type:'公益组织',region:'中国',service:'跨病种病友服务、康复与心理家庭支持；与 Khub 等社区合办患者×技术活动（无界对话舱）。',limit:'FSHD 教育覆盖不代表自动符合资金援助资格。',url:'https://chinaicf.org/actionDetail?id=1',evidence:'组织官网'},
{id:'openrare',name:'OpenRare（开源基因辅助诊断工具）',type:'渠道 / 工具',region:'开源 · 本地部署',service:'基因辅助诊断 Agent 基础设施：中文表型 HPO 标准化、多源证据整合、确定性排序、本地优先与可审计；与 FSHD 的 D4Z4/长读长场景相关（长读路径在推进）。',limit:'辅助定位：输出为可复核证据链，最终诊断由医生做出；尚未与任何医院/患者形成服务承诺（未核实）。',url:'https://github.com/OpenRare2026/OpenRare',evidence:'项目组公众号（2026-08-30）'},
{id:'cord',name:'蔻德罕见病中心 CORD',type:'公益组织',region:'中国',service:'患者组织支持、政策倡导和资源教育。',limit:'不是专病医院；具体援助项目需另行咨询。',url:'https://www.cord.org.cn/about_us_1/1.html',evidence:'组织官网'},
{id:'fj',name:'福建医科大学附属第一医院',type:'医疗机构',region:'福建福州',service:'有 FSHD 分子检测和长期队列的原始研究证据。',limit:'历史科研能力不等于当前任意院区可检测；挂号、费用、周期待咨询。',url:'https://jmg.bmj.com/content/57/2/109',evidence:'2020 原始研究'},
{id:'pku',name:'北京大学第一医院',type:'医疗机构',region:'北京',service:'有儿童早发 FSHD 分子确诊病例的合作研究。',limit:'儿童与成人就诊路径、当前检测方式未实测。',url:'https://pubmed.ncbi.nlm.nih.gov/32392958/',evidence:'2020 原始研究'},
{id:'huashan',name:'华山医院神经肌病团队',type:'医疗机构',region:'上海',service:'团队公开站介绍 FSHD 队列研究。',limit:'团队自述未由医院主域交叉核实，当前门诊和名额待确认。',url:'https://huashanmuscle.com/about',evidence:'团队自述，证据有限'},
{id:'society',name:'FSHD Society',type:'患者组织',region:'美国 / 国际线上',service:'Navigator 资源导航、支持社群及研究信息。',limit:'英语资源为主；不等于中国患者可赴美获药或入组。',url:'https://www.fshdsociety.org/living-with-fshd/managing-fshd/fshd-navigator/',evidence:'组织官网'},
{id:'rochester',name:'Rochester FSHD Research Center',type:'医疗机构',region:'美国',service:'专病临床与遗传研究、神经肌病服务。',limit:'转诊、保险、自费和跨境就医条件未核实。',url:'https://www.urmc.rochester.edu/neurology/fshd-center',evidence:'医院官网'}];
const trials=[
{id:'delbrax',name:'del-brax / AOC 1020',stage:'III期进行中',mechanism:'向肌肉递送 siRNA，靶向 DUX4。',result:'已有公司披露的生物标志物结果；不能等同日常功能获益已证实。',limit:'尚非获批治疗。中国批准、中心与费用未核实。',date:'2026-06-11',url:'https://clinicaltrials.gov/study/NCT07038200',source:'注册线索；结果依据见本地研究报告'},
{id:'epi',name:'EPI-321',stage:'I/II期 · 已完成入组',mechanism:'表观遗传调控，重新抑制 DUX4。',result:'2026-10-05 公司披露首6例六个月初步结果；开放标签、小样本。',limit:'全试验12例已完成入组；不可按当前可报名展示。中国可及性未核实。',date:'2026-10-05',url:'https://clinicaltrials.gov/study/NCT06907875',source:'公司披露 / 注册线索；非完整随机对照结论'},
{id:'los',name:'losmapimod',stage:'III期失败后暂停开发',mechanism:'p38α/β MAPK 抑制剂。',result:'REACH 未达到主要终点。',limit:'保留失败结果，不作为可获治疗或活跃招募项目。',date:'2024-09-12',url:'https://www.sec.gov/Archives/edgar/data/1680581/000119312524217822/d844807d8k.htm',source:'开发者 SEC 公告'},
{id:'gym',name:'emugrobart / GYM329',stage:'停止 FSHD 开发',mechanism:'靶向肌生成抑制素。',result:'2026-03 开发者宣布停止 FSHD 临床活动。',limit:'旧招募页面不能覆盖更新的停止决定。',date:'2026-03-19',url:'https://www.fshdsociety.org/wp-content/uploads/2026/03/FSHD-emugrobart-community-letter-update-March-2026.docx-1.pdf',source:'开发者致患者社区原始信'}];

const card=(title,body,cls='')=>`<section class="card ${cls}"><h2>${title}</h2>${body}</section>`;
const jump=(name,text)=>`<button class="task-link" data-page="${name}">${text||name} →</button>`;
function toast(text){const t=$('#toast');t.textContent=text;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),3800)}
function modal(title,body){$('#dialogTitle').textContent=title;$('#dialogBody').innerHTML=body;$('#dialog').showModal()}

function entryForm(kind){
const extra=kind==='功能与康复'?`<label>身体区域<select name="region"><option>肩胛 / 上肢</option><option>面部</option><option>躯干</option><option>下肢</option></select></label><label>侧别<select name="side"><option>左</option><option>右</option><option>双侧</option><option>未明确</option></select></label>`:kind==='并发症筛查'?`<label>评估类别<select name="region"><option>呼吸</option><option>眼底</option><option>听力</option><option>肌骨 / 脊柱</option></select></label><label>下次日期（仅抄录专业建议）<input name="due" type="date"></label>`:'';
modal('新增模拟记录',`<p class="notice">仅用于走查，不输入真实信息。保存后可在本页回顾；记录归属当前档案「${esc(cur().name)}」，刷新即重置。</p><form id="entryForm"><input name="kind" type="hidden" value="${esc(kind)}"><div class="fields"><label>记录日期<input name="date" type="date" required max="${new Date().toLocaleDateString('en-CA')}"></label><label>记录类型<select name="type"><option>本人观察</option><option>专业建议原文</option><option>辅助器具</option><option>跌倒事件</option><option>康复 / 支持性干预</option></select></label>${extra}</div><label>${kind==='并发症筛查'?'建议原文与适用条件':'具体任务、体验或问题'}<textarea name="note" required maxlength="1200" placeholder="例如：示例任务；示例来源。不要填写真实病历。"></textarea></label><label>来源（可留空，保持未记录）<input name="source" maxlength="120"></label><button class="primary">保存模拟记录</button></form>`);
$('#entryForm').onsubmit=e=>{e.preventDefault();const item=Object.fromEntries(new FormData(e.target));records().push({...item,id:crypto.randomUUID(),private:kind==='心理与生活'});$('#dialog').close();render();toast('模拟记录已保存（归属 '+cur().name+'）；刷新后重置')};
}
function recordList(kind){const rows=records().filter(r=>r.kind===kind);return rows.length?rows.map(r=>`<div class="record"><strong>${esc(r.date)} · ${esc(r.type)}</strong><p>${esc(r.region||'')}${r.side?' · '+esc(r.side):''} ${esc(r.note)}</p><small>来源：${esc(r.source||'未记录')}${kind==='并发症筛查'?' · 下次：'+esc(r.due||'待与医生确认'):''}${r.private?' · 私密 / 不进入摘要':''}</small></div>`).join(''):'<div class="empty">还没有记录。可以新增一条模拟记录，体验保存与回顾。</div>'}

/* ---------- 我的确诊：基因档案 + 误诊时间线 + 家系（私密） ---------- */
function renderDiagnosis(p){
return card('基因确诊档案（只抄录，不判读）',`
  <div class="kv">
    <span class="k">D4Z4 重复数</span><span><b>${p.gene.repeats}</b>（仅抄录）</span>
    <span class="k">单倍型</span><span>${esc(p.gene.haplo)}</span>
    <span class="k">检测方法</span><span>${esc(p.gene.method)}</span>
    <span class="k">分型</span><span>${esc(p.gene.type)}</span>
    <span class="k">医院 / 日期</span><span>${esc(p.gene.hospital)} · ${esc(p.gene.date)}</span>
  </div>
  <div class="quote">报告原文位：「${esc(p.gene.quote)}」</div>
  <p class="note">严重程度与外显预测不由本工作台给出。用 AI 工具（如 Khub 社区开源链路、OpenRare）做的个人基因组解读，属于「待医生复核的线索」，不应直接写入本档案。</p>`)
+card('确诊之路（误诊经历留痕）',`<div class="tl">${p.misdx.map(m=>`<div class="ev ${m.kind==='confirmed'?'confirm':''}"><b>${m.kind==='preliminary'?'先被诊断为':m.kind==='revised'?'修订':'确诊'}</b>：${esc(m.label)}<br><span class="when">${esc(m.when)} · ${esc(m.hospital)}</span></div>`).join('')}</div><p class="note">只新增、不删除历史。这段经历引发情绪时，可到「心理与生活」记录（私密）。</p>`)
+card(`家系记录 <span class="tag private">私密 · 不进导出</span>`,`<p class="note">默认私密：不进导出、不进看板摘要、不进 AI 草稿。家人信息由你决定何时开放。</p>
  ${p.family.map(f=>`<div class="record"><strong>${esc(f.relation)}</strong><p>${esc(f.status)}</p><small>${esc(f.note)}</small></div>`).join('')}
  <h3>可讨论问题（遗传咨询准备）</h3><ul><li>我的 FSHD 是遗传来的还是新生突变？</li><li>家系成员检测的意义与流程？</li><li>50% 遗传概率与 20%–30% 新生突变如何理解？</li></ul>
  <p class="note">术语卡与沟通材料生成在「复诊准备」页。</p>`,'private');
}

/* ---------- 检查与指标：CK 翻面卡 + 肌电原文 + 导入候选 ---------- */
function renderLabs(p){
const ck=p.ck, last=ck[ck.length-1], prev=ck.length>1?ck[ck.length-2]:null;
const delta=prev?last[1]-prev[1]:null;
return card(`CK 指标速览（参考 ${esc(p.ckRef)}）· 点击翻面`,`
  <div class="flip-grid">${ck.map((m,i)=>{
    const d=(prev&&i===ck.length-1)?`较上次 ${delta>0?'+':''}${delta}`:'';
    return `<button class="flip" aria-pressed="false" data-action="flip" aria-label="CK ${m[1]}，${m[0]}，点击翻转查看记录说明">
      <span class="flip-inner">
        <span class="flip-face"><span class="flip-value">${m[1]} <small>U/L</small></span>
          <span class="txt">采血 ${esc(m[0])}${d?' · '+d:''}<br>参考范围 ${esc(p.ckRef)}</span>
          <span class="flip-hint">点击翻转查看记录说明</span></span>
        <span class="flip-face flip-back"><span class="txt">来源：门诊检验报告（模拟）。FSHD 的 CK 通常正常至轻度升高（一般不超过上限 3–5 倍）；解读交给医生，本工作台不判读。</span>
          <span class="flip-hint">再次点击返回摘要</span></span>
      </span></button>`;}).join('')}</div>`)
+card('肌电图与其他报告',`<div class="quote">${esc(p.emg)}</div>
  <div class="table-wrap"><table><tr><th>来源</th><th>字段</th><th>候选值</th><th>状态</th></tr>
  <tr><td>肌电图报告（模拟）</td><td>结论（原文）</td><td>${esc(p.emg.split('：').slice(1).join('：')||'—')}</td><td><span class="tag orange">待核对</span></td></tr>
  <tr><td>生化报告（模拟）</td><td>CK</td><td>${last[1]} U/L</td><td><span class="tag green">已核对</span></td></tr></table></div>
  <p class="note">解析失败不产候选，原件保留可重试；重复导入按 sha256 去重。接受候选只写入事实表，接受≠临床审核。</p>`);
}

/* ---------- 病情一图秀：CK 动态曲线 + 事件泳道 ---------- */
function renderOneChart(p){
return card('一图秀 · CK 曲线 + 事件泳道',`
  <p class="note" style="margin-bottom:6px">「${esc(p.name)}」的模拟数据。悬停看数值，点击数据点留下明细；事件泳道（确诊=蓝 · 器具=绿 · 筛查=橙）在曲线之上，不压线。</p>
  <div class="chart-wrap" id="chartWrap">
    <svg id="onechartSvg" viewBox="0 0 680 260" role="img" aria-label="CK 随时间变化折线图，按该指标全部记录范围缩放；事件泳道在上方">
      <text x="24" y="16" font-size="10" fill="#5c6d65">事件泳道（不压曲线）</text>
      <g id="lane"></g>
      <line x1="44" y1="228" x2="660" y2="228" stroke="#d7e5dc"/>
      <g id="yaxis"></g>
      <path id="ckline" class="line" fill="none" stroke="#246943" stroke-width="2" pathLength="1"/>
      <g id="ckpts"></g>
      <text x="44" y="252" font-size="9" fill="#5c6d65">↑ 曲线按该指标全部记录范围缩放，不代表不同指标数值可比</text>
    </svg>
    <div class="chart-tip" id="chartTip"></div>
  </div>
  <div class="pin" id="chartPin" hidden></div>`);
}
function drawChart(p){
  const svg=$('#onechartSvg');if(!svg)return;
  const L=44,R=660,CH_TOP=96,CH_BOT=210;
  const dates=p.ck.map(m=>new Date(m[0])),t0=+Math.min(...dates),t1=+Math.max(...dates);
  const vals=p.ck.map(m=>m[1]),v0=Math.min(...vals)*0.92,v1=Math.max(...vals)*1.06;
  const X=d=>t1===t0?(L+R)/2:L+((new Date(d)-t0)/(t1-t0))*(R-L);
  const Y=v=>CH_BOT-((v-v0)/(v1-v0))*(CH_BOT-CH_TOP);
  const lane=$('#lane');lane.innerHTML='';
  p.chartEvents.forEach((e,i)=>{
    const x=X(e.d),y=44+(i%2)*14,col=e.kind==='gene'?'#205b82':e.kind==='device'?'#246943':'#a4561f';
    lane.insertAdjacentHTML('beforeend',
      `<line x1="${x}" y1="${y+6}" x2="${x}" y2="228" stroke="${col}" stroke-opacity=".28" stroke-dasharray="3 6"/>
       <rect x="${x-5}" y="${y-4}" width="10" height="10" rx="2" fill="${col}" transform="rotate(45 ${x} ${y+1})"><title>${esc(e.title)} ${esc(e.d)}</title></rect>
       <text x="${x+9}" y="${y+5}" font-size="9.5" fill="#48565a">${esc(e.title)}</text>`);});
  const ya=$('#yaxis');ya.innerHTML='';
  for(let i=0;i<=2;i++){const v=v0+(v1-v0)*i/2,y=Y(v);
    ya.insertAdjacentHTML('beforeend',`<line x1="44" y1="${y}" x2="660" y2="${y}" stroke="#edf4ef"/><text x="38" y="${y+3}" font-size="9" fill="#5c6d65" text-anchor="end">${Math.round(v)}</text>`);}
  const line=$('#ckline');
  line.setAttribute('d',p.ck.map((m,i)=>`${i?'L':'M'}${X(m[0]).toFixed(1)},${Y(m[1]).toFixed(1)}`).join(' '));
  const g=$('#ckpts');g.innerHTML='';
  p.ck.forEach((m,i)=>{
    const x=X(m[0]),y=Y(m[1]);
    g.insertAdjacentHTML('beforeend',`<circle class="pt" cx="${x}" cy="${y}" r="4" fill="#246943" style="animation-delay:${i*90}ms"><title>CK ${m[1]} U/L · ${esc(m[0])}</title></circle>`);
    if(i===p.ck.length-1){const anchor=(R-x)<46?'end':'start',dx=anchor==='end'?-8:8;
      g.insertAdjacentHTML('beforeend',`<text x="${x+dx}" y="${y-8}" font-size="10" fill="#1f3d2e" text-anchor="${anchor}" font-weight="600">${m[1]}</text>`);}});
  const tip=$('#chartTip'),wrap=$('#chartWrap');
  svg.onpointermove=e=>{
    const r=svg.getBoundingClientRect(),mx=(e.clientX-r.left)*680/r.width,my=(e.clientY-r.top)*260/r.height;
    let best=null,bd=1e9;
    p.ck.forEach(m=>{const dx=X(m[0])-mx,dy=Y(m[1])-my,d=dx*dx+dy*dy;if(d<bd){bd=d;best=m;}});
    if(best&&bd<9000){tip.style.opacity=1;tip.style.left=(X(best[0])/680*100)+'%';tip.style.top=(Y(best[1])/260*100)+'%';
      tip.textContent=`CK ${best[1]} U/L · ${best[0]}`;}else tip.style.opacity=0;};
  svg.onpointerleave=()=>tip.style.opacity=0;
  svg.onclick=e=>{
    const r=svg.getBoundingClientRect(),mx=(e.clientX-r.left)*680/r.width,my=(e.clientY-r.top)*260/r.height;
    let best=null,bd=1e9;
    p.ck.forEach(m=>{const dx=X(m[0])-mx,dy=Y(m[1])-my,d=dx*dx+dy*dy;if(d<bd){bd=d;best=m;}});
    if(!best||bd>400)return;
    const pin=$('#chartPin');pin.hidden=false;
    pin.innerHTML=`<b>CK ${best[1]} U/L</b> · ${esc(best[0])} · 来源：门诊检验报告（模拟）· 参考 ${esc(p.ckRef)}<br><span class="note">数值仅作记录展示，不构成判断。</span> <button class="small" data-action="pin-close">收起</button>`;};
}

function render(){
$('#nav').innerHTML=pages.map(p=>`<button data-page="${p}" ${p===current?'aria-current="page"':''}>${p}</button>`).join('')+`<small>档案：${esc(cur().name)}<br>当前为分批探索稿<br>完整原型未签认</small>`;
const p=cur();
let html=`<div class="page-head"><div class="eyebrow">我的 FSHD 工作台 / ${esc(current)}</div><h1>${esc(current)}</h1></div>`;
if(current==='看板')html+=`<section class="hero"><h1>记录变化，<br>准备下一次复诊。</h1><p>从今天最想完成的一件事开始。你的生活任务、功能变化和问题，可以一起带到诊室。当前档案：${esc(p.name)}（${esc(p.meta)}）。</p></section><div class="grid">${card('今天想先做什么？',jump('功能与康复','记录一项生活任务的变化')+jump('并发症筛查','整理医生建议的检查计划')+jump('复诊准备','准备复诊问题与材料'),'feature')}${card('把支持带进日常',jump('医保与资源','找患者组织与诊疗线索')+jump('临床研究','核对听说的新药进展')+jump('心理与生活','整理私密困扰与支持需要'))}</div><div class="grid section">${card('筛查计划',records().filter(r=>r.kind==='并发症筛查').length?'<p>已记录 '+records().filter(r=>r.kind==='并发症筛查').length+' 条模拟计划。无建议日期的项目保持待确认。</p>'+jump('并发症筛查','查看计划'):'<div class="empty">还没有专业建议日期。与医生确认后再记录，不自动推算逾期。</div>')}${card('本次记录',`<p>${records().filter(r=>!r.private).length} 条公开模拟记录 · ${saved().size} 条已收藏线索</p><small>私密心理记录不出现在看板摘要中。切右上角档案可看 ${PROFILES.map(x=>x.name).join(' / ')} 三组画像。</small>` )}</div><details class="section"><summary>💡 为什么有这些入口？</summary><p>中国患者研究归纳了五类诉求：靶向药、辅助器具、心理支持、就业机会和更包容的社会环境。五项没有全国统一量化名次。</p><a href="https://doi.org/10.1186/s41687-026-01026-z" target="_blank" rel="noopener noreferrer">查看2026患者研究</a></details>`;
else if(current==='我的确诊')html+=renderDiagnosis(p);
else if(current==='检查与指标')html+=renderLabs(p);
else if(current==='病情一图秀')html+=renderOneChart(p);
else if(['功能与康复','并发症筛查','疼痛与疲劳','心理与生活'].includes(current)){const descriptions={'功能与康复':'关注洗头、穿衣、起身、上下台阶等具体任务。记录不对称、辅具体验、跌倒或专业建议，不自行生成训练方案。','并发症筛查':'记录适用于自己的专业建议。眼、听力、呼吸与肌骨评估的条件不同，不预设人人每年四项检查。','疼痛与疲劳':'记录发生情境和对生活的影响，帮助复诊时说清楚，不自动判断好转或恶化。','心理与生活':'这里的感受记录默认私密，不进入看板、复诊导出或 AI 草稿。学业就业、独立生活与沟通材料保持原有子页归属。'};html+=`<p>${descriptions[current]}</p><div class="row"><span class="pill">当前页面内存模拟</span><button class="primary" id="add">新增模拟记录</button></div><div class="card section ${current==='心理与生活'?'private':''}">${recordList(current)}</div>`;if(current==='心理与生活')html+=`<div class="card section"><h2>支持与生活事项</h2><p>可先记录：我最需要什么支持、愿意告诉谁、工作/学业希望怎样调整、出行需要核实哪些无障碍条件。完整子页尚待原型细化。</p>${jump('医保与资源','查看支持资源')}</div>`;}
else if(current==='医保与资源'||current==='临床研究'){
const isTrial=current==='临床研究',items=isTrial?trials:resources,filters=isTrial?['全部','已收藏']:['全部','患者组织','公益组织','渠道 / 工具','医疗机构','已收藏'];
html+=`<p>${isTrial?'把注册阶段、公开结果与实际可及性分开看。这里是有日期的研究快照，不是可购买药品目录。':'从要解决的事情出发，核对服务范围与入口。名单有代表性，不是医院排名；预约、资格及费用仍需咨询。'}</p><div class="subnav">${filters.map(f=>`<button data-filter="${f}" aria-pressed="${tab===f}">${f}</button>`).join('')}</div><div class="grid">${items.filter(i=>tab==='全部'||tab==='已收藏'&&saved().has(i.id)||i.type===tab).map(i=>card(esc(i.name),`<span class="pill">${esc(i.stage||i.type+' · '+i.region)}</span><p>${esc(i.mechanism||i.service)}</p>${isTrial?`<p>${esc(i.result)}</p>`:''}<p><strong>可及性：</strong>${esc(i.limit)}</p><div class="source">${esc(i.source||i.evidence)} · 核对 2026-10-18${i.date?' · 事件 '+esc(i.date):''}</div><div class="row section"><button data-detail="${i.id}" class="small">详情与咨询准备</button><button data-save="${i.id}" class="small" aria-pressed="${saved().has(i.id)}">${saved().has(i.id)?'取消收藏':'收藏'}</button></div>`)).join('')||'<div class="empty">还没有收藏。返回“全部”，选择需要核实的线索。</div>'}</div>`;
}
else if(current==='复诊准备')html+=`<p>汇总「${esc(p.name)}」本轮非私密模拟记录与收藏。公共研究线索与本人观察分区输出，支持下载真实 Markdown 文件。</p><div class="card"><h2>本次摘要</h2>${records().filter(r=>!r.private).map(r=>`<div class="record"><strong>${esc(r.kind)} · ${esc(r.date)}</strong><p>${esc(r.note)}</p><small>用户模拟记录，非专业结论；来源：${esc(r.source||'未记录')}</small></div>`).join('')||'<div class="empty">还没有可汇总的记录。先记录一项生活任务变化。</div>'}<p>已收藏 ${saved().size} 条公共线索；不代表已核实可获得服务。</p><button id="export" class="primary">下载复诊准备.md</button></div>`;
else if(current==='设置')html+=`<div class="stack">${card('本机资料目录','<p>未连接。此 HTML 原型不读取或持久化患者资料。</p><button disabled>选择目录（待 Desktop 接入）</button>')}${card('报告解析','<p>未配置、未发送。真实解析须另行显示上传路径并按文件授权。</p><button disabled>解析报告（未接通）</button>')}${card('模拟档案','<p>'+PROFILES.map(x=>esc(x.name)+'（'+esc(x.meta)+'）').join('<br>')+'</p><p class="note">三组画像用于走查不同病程阶段；右上角随时切换。记录与收藏按档案隔离。</p>')}${card('关于','<p>小飞侠 0.1.0 · 研究快照 2026-10-18。只是交互探索稿，完整导航与任务仍待细化，未通过用户原型确认。</p>')}</div>`;
$('#main').innerHTML=html;
if(current==='病情一图秀')drawChart(p);
}

/* ---------- 档案切换 ---------- */
function profileModal(){
modal('切换模拟患者档案',`<p class="note">三组均为演示画像，覆盖不同病程阶段；切换后各页数据与记录随之变化（按档案隔离）。</p>
  ${PROFILES.map(x=>`<button class="list-row" data-action="choose-profile" data-profile="${x.id}">
  <span class="avatar">${x.initial}</span>
  <span><b style="font-size:13px">${esc(x.name)}</b> <span class="pill">${esc(x.meta)}</span><br><span class="note">确诊 ${esc(x.gene.date)} · ${esc(x.gene.type)} · D4Z4 ${x.gene.repeats} · CK ${x.ck.length} 次</span></span></button>`).join('')}`);
}
function applyProfileHeader(){$('#pfAvatar').textContent=cur().initial;$('#pfName').textContent=cur().name;$('#pfMeta').textContent=cur().meta;}
function chooseProfile(id){
  if(id===profileId)return;
  profileId=id;applyProfileHeader();tab='全部';render();
  toast('已切换到 '+cur().name+'（'+cur().meta+'）；记录与收藏按档案隔离，互不影响');
}

/* ---------- 事件分发 ---------- */
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
if(b.dataset.action==='choose-profile'){chooseProfile(b.dataset.profile);$('#dialog').close();return}
if(b.dataset.action==='flip'){const on=b.getAttribute('aria-pressed')==='true';b.setAttribute('aria-pressed',String(!on));b.setAttribute('aria-label',!on?'点击返回摘要':'点击翻转查看记录说明');return}
if(b.dataset.action==='pin-close'){const pin=$('#chartPin');if(pin)pin.hidden=true;return}
if(b.dataset.page){current=b.dataset.page;tab='全部';render()}
if(b.id==='add')entryForm(current);
if(b.id==='profileBtn')profileModal();
if(b.dataset.filter){tab=b.dataset.filter;render()}
if(b.dataset.save){const id=b.dataset.save;saved().has(id)?saved().delete(id):saved().add(id);render();toast('收藏已更新（归属档案 '+cur().name+'，仅当前页面暂存）')}
if(b.dataset.detail){const i=[...resources,...trials].find(i=>i.id===b.dataset.detail);modal(i.name,`<p>${esc(i.service||i.mechanism)}</p><p>${esc(i.result||'')}</p><p><strong>待核实：</strong>${esc(i.limit)}</p><h3>咨询时可以问</h3><ul><li>目前是否提供与我需求相关的服务或研究？</li><li>需要哪些已有报告、转诊材料和往返安排？</li><li>费用、补偿、资格与实际名额如何确认？</li></ul><p>来源性质：${esc(i.source||i.evidence)}；本轮核对 2026-10-18。没有电话核验或预约。</p><a target="_blank" rel="noopener noreferrer" href="${i.url}">打开原始来源 ↗</a>`)}
if(b.id==='export')download();});
function download(){const p=cur();const body=['# 小飞侠 0.1.0 · 复诊准备（模拟 · '+p.name+'）','生成：'+new Date().toISOString(),'仅当前探索稿数据；私密记录未包含。','\n## 本人模拟记录',...records().filter(r=>!r.private).map(r=>`- ${r.date} / ${r.kind}：${r.note}\n  来源：${r.source||'未记录'}；非专业结论`),'\n## 基因确诊档案（抄录位）',`- ${p.gene.type} · D4Z4 ${p.gene.repeats} · ${p.gene.haplo} · ${p.gene.method} · ${p.gene.hospital} ${p.gene.date}`,`- 原文：${p.gene.quote}`,'\n## 公共参考线索（不等于个人病历事实）',...[...resources,...trials].filter(i=>saved().has(i.id)).map(i=>`- ${i.name}：${i.limit}\n  ${i.url}\n  核对2026-10-18；${i.source||i.evidence}`),'\n## 下次可问','- 哪些功能变化值得进一步评估？','- 哪些检查适用于我，计划日期和来源是什么？'].join('\n');const a=document.createElement('a'),url=URL.createObjectURL(new Blob([body],{type:'text/markdown;charset=utf-8'}));a.href=url;a.download='小飞侠-复诊准备-模拟.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('已生成 Markdown 下载（'+p.name+'）；请查看浏览器下载结果')}
$('#font').onclick=()=>{document.body.classList.toggle('large');$('#font').textContent=document.body.classList.contains('large')?'标准字':'大字'};
$('#close').onclick=$('#done').onclick=()=>$('#dialog').close();
$('#about').onclick=()=>modal('小飞侠 0.1.0 · 关于与范围','<p>这是第一批交互探索稿，非完整工作台、非真实患者服务。</p><p>可走查：三组模拟档案切换、确诊档案与误诊时间线、功能/筛查/症状/私密记录、CK 翻面卡与一图秀动态曲线、资源与研究收藏（含 Khub 社区与 OpenRare 工具线索）、复诊 Markdown 导出及模拟面板状态稿。</p><p>尚待：报告导入、生产存储、原生 Agent 实机适配、完整子页与异常状态、用户确认。</p>');
function setWidth(v){width=Math.min(45,Math.max(25,Number(v)));$('#pane').style.width=width+'%';$('#width').value=width;$('#split').setAttribute('aria-valuenow',width)}
function aiToggle(show){if(show&&matchMedia('(max-width:760px)').matches){toast('窄屏优先保留工作台；请在宽窗口查看面板状态稿');return}$('#pane').hidden=$('#split').hidden=!show;$('#ai').textContent=show?'隐藏 AI 对话':'打开 AI 对话';setWidth(width)}
$('#ai').onclick=()=>aiToggle($('#pane').hidden);$('#hideAI').onclick=()=>aiToggle(false);$('#width').oninput=e=>setWidth(e.target.value);$('#split').onkeydown=e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();setWidth(e.key==='Home'?25:e.key==='End'?45:width+(e.key==='ArrowLeft'?1:-1))}};
$('#split').onpointerdown=e=>{e.target.setPointerCapture(e.pointerId);e.target.onpointermove=ev=>{const box=$('#shell').getBoundingClientRect();setWidth((box.right-ev.clientX)/box.width*100)};e.target.onpointerup=()=>e.target.onpointermove=null};
$('#aiState').onchange=e=>$('#aiNote').textContent=e.target.value.includes('冲突')?'已有草稿保留。覆盖与发送均被阻止；可取消并返回工作台。':e.target.value.includes('失败')?'连接失败（模拟）。未发送任何内容，工作台记录保留。':e.target.value+'；无真实连接或发送。';
matchMedia('(max-width:760px)').addEventListener('change',e=>{if(e.matches)aiToggle(false)});
applyProfileHeader();render();
