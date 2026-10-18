'use strict';
const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pages=['看板','我的确诊','功能与康复','并发症筛查','疼痛与疲劳','检查与指标','病情一图秀','医保与资源','心理与生活','复诊准备','临床研究','设置'];
const navIcons={'看板':'⌂','我的确诊':'◉','功能与康复':'↗','并发症筛查':'＋','疼痛与疲劳':'≈','检查与指标':'▤','病情一图秀':'⌁','医保与资源':'◇','心理与生活':'♡','复诊准备':'✓','临床研究':'⌕','设置':'⚙'};
let current='看板', tab='全部', width=35;

/* ============================================================
   指标定义（一图秀口径；与 docs/ONE-CHART-CONTRACT.md §2 一致）
   delta: pct=检验类按百分比；abs=功能/量表类按绝对量（带单位）
   ============================================================ */
const METRICS=[
{code:'ck', name:'CK 肌酸激酶',   cat:'检验', unit:'U/L',       dec:0, delta:'pct', color:'#246943', src:'门诊生化报告（模拟）'},
{code:'fvc',name:'FVC 占预计值',  cat:'呼吸', unit:'%预计',     dec:0, delta:'pct', color:'#2f7f8c', src:'肺功能室报告（模拟）'},
{code:'w6m',name:'6 分钟步行距离',cat:'功能', unit:'m',         dec:0, delta:'abs', color:'#205b82', src:'康复科 6MWT 记录（模拟）'},
{code:'grip',name:'握力（右手）', cat:'功能', unit:'kg',        dec:1, delta:'abs', color:'#a4561f', src:'康复科握力计（模拟）'},
{code:'rss',name:'临床严重度评分',cat:'量表', unit:'分 / 0–5',  dec:1, delta:'abs', color:'#7a3f6d', src:'神经内科门诊评估（模拟）'},
{code:'fss',name:'疲劳严重度 FSS',cat:'量表', unit:'分 / 9–63', dec:0, delta:'abs', color:'#8a6d1f', src:'本人自评量表（模拟）'}];
const metricBy=c=>METRICS.find(m=>m.code===c);
const fmt=(m,v)=>Number(v).toFixed(m.dec);
const MONTH=30*864e5;

/* ============================================================
   三组模拟档案（每档案 6 指标 × 1–5 次记录；周航含单点指标用于演示「单点不连线」）
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
  series:{ck:[['2024-09-12',318],['2025-03-14',344],['2025-09-20',351],['2026-03-11',386],['2026-09-02',412]],
          fvc:[['2025-03-14',92],['2025-09-20',89],['2026-03-11',86],['2026-09-02',83]],
          w6m:[['2025-03-14',520],['2025-09-20',498],['2026-03-11',470],['2026-09-02',455]],
          grip:[['2025-03-14',26.0],['2025-09-20',24.2],['2026-03-11',22.4],['2026-09-02',21.1]],
          rss:[['2025-03-14',3.0],['2025-09-20',3.0],['2026-03-11',3.5],['2026-09-02',3.5]],
          fss:[['2025-09-20',38],['2026-03-11',42],['2026-09-02',45]]},
  emg:'2026-09-02 肌电图：肌源性损害，累及面肩肱分布（候选，待核对）',
  events:[
    {d:'2025-03-14',kind:'gene',  title:'确诊 FSHD1',   status:'done',   src:'北京协和医院 神经内科 · 基因检测报告'},
    {d:'2026-08-20',kind:'device',title:'AFO 配具交付', status:'done',   src:'康复科门诊开具（模拟）'},
    {d:'2026-11-20',kind:'screen',title:'眼底复查',     status:'planned',src:'眼科门诊建议（原文抄录）'}],
  seed:[
    {kind:'功能与康复',date:'2026-10-05',type:'画像预置 · 本人观察',region:'肩胛 / 上肢',side:'右',note:'抬臂过肩困难，翼状肩胛明显（不对称）',source:'走查模拟'},
    {kind:'功能与康复',date:'2026-09-02',type:'画像预置 · 本人观察',region:'面部',side:'双侧',note:'吹气球吹不起来；睡眠时左眼闭不严，晨起干涩（不对称）',source:'走查模拟'},
    {kind:'功能与康复',date:'2026-08-20',type:'画像预置 · 辅助器具',region:'下肢',side:'左',note:'定制塑料 AFO 交付（康复科 李医生开具，2800 元），左脚拖步改善',source:'走查模拟'},
    {kind:'功能与康复',date:'2026-10-12',type:'画像预置 · 康复 / 支持性干预',region:'躯干',side:'双侧',note:'水中步行 30 分钟，次日无疲劳加重',source:'走查模拟'},
    {kind:'并发症筛查',date:'2025-11-20',type:'画像预置 · 专业建议原文',region:'眼底',side:'双侧',note:'眼底像未见明显血管异常（原文抄录）；每年复查',source:'走查模拟',due:'2026-11-20'},
    {kind:'并发症筛查',date:'2026-06-15',type:'画像预置 · 专业建议原文',region:'肌骨 / 脊柱',side:'双侧',note:'骨科门诊：轻度脊柱前凸，继续观察（原文抄录）',source:'走查模拟',due:'2027-06-15'},
    {kind:'疼痛与疲劳',date:'2026-10-14',type:'画像预置 · 本人观察',region:'肩胛 / 上肢',side:'右',note:'右肩胛周围疼痛 4/10，抬臂、久坐触发',source:'走查模拟'},
    {kind:'疼痛与疲劳',date:'2026-09-28',type:'画像预置 · 本人观察',region:'躯干',side:'双侧',note:'腰背部疼痛 3/10，站立 30 分钟后出现',source:'走查模拟'},
    {kind:'心理与生活',date:'2026-10-10',type:'画像预置 · 本人观察',region:'',side:'',note:'最难受的不是身体，是别人以为我在生气',source:'走查模拟',private:true},
    {kind:'心理与生活',date:'2026-08-22',type:'画像预置 · 本人观察',region:'',side:'',note:'和主管谈成了每周两天远程办公',source:'走查模拟'}]},
{ id:'p2', name:'周航', initial:'周', meta:'FSHD1 · 22 岁 · 确诊期（大学生）',
  gene:{repeats:2,haplo:'4qA',method:'实时荧光定量 PCR（qPCR）+ Southern Blot 复核',type:'FSHD1',hospital:'福建医科大学附属第一医院 神经内科',date:'2026-08-30',
    quote:'D4Z4 重复单元数目 2（qPCR），Southern Blot 复核一致，4qA 单倍型。'},
  misdx:[
    {when:'2026-04',kind:'preliminary',label:'「体质差、缺乏锻炼」',hospital:'校医院'},
    {when:'2026-06',kind:'revised',label:'肌电图提示肌源性损害，转诊基因检测',hospital:'省立医院 神经内科'},
    {when:'2026-08-30',kind:'confirmed',label:'确诊 FSHD1（基因检测）',hospital:'福建医科大学附属第一医院 神经内科'}],
  family:[{relation:'父亲',status:'临床评估疑似携带，未做基因确认',note:'家系检测已预约遗传咨询'}],
  series:{ck:[['2026-06-20',298],['2026-08-30',322]],
          fvc:[['2026-08-30',97]],
          w6m:[['2026-08-30',610],['2026-10-02',595]],
          grip:[['2026-08-30',38.0],['2026-10-02',36.4]],
          rss:[['2026-08-30',1.5]],
          fss:[['2026-09-10',28],['2026-10-01',31]]},
  emg:'2026-06-20 肌电图：轻度肌源性改变（报告原文待录入）',
  events:[
    {d:'2026-08-30',kind:'gene',  title:'确诊 FSHD1',          status:'done',   src:'福建医科大学附属第一医院 神经内科'},
    {d:'2026-11-10',kind:'screen',title:'基线眼底 / 听力筛查', status:'planned',src:'确诊后门诊建议（尚未做，原文抄录）'}],
  seed:[
    {kind:'功能与康复',date:'2026-09-10',type:'画像预置 · 本人观察',region:'肩胛 / 上肢',side:'双侧',note:'引体向上做不了，举哑铃吃力',source:'走查模拟'},
    {kind:'功能与康复',date:'2026-09-10',type:'画像预置 · 本人观察',region:'面部',side:'双侧',note:'吹口哨一直不会，确诊后才明白是症状',source:'走查模拟'},
    {kind:'功能与康复',date:'2026-09-10',type:'画像预置 · 本人观察',region:'躯干',side:'双侧',note:'仰卧起坐做不起来，腹部略前凸',source:'走查模拟'},
    {kind:'功能与康复',date:'2026-10-02',type:'画像预置 · 康复 / 支持性干预',region:'下肢',side:'双侧',note:'游泳 40 分钟（自由泳），无不适',source:'走查模拟'},
    {kind:'并发症筛查',date:'2026-09-05',type:'画像预置 · 专业建议原文',region:'眼底',side:'双侧',note:'确诊后建议做基线眼底检查（尚未做，计划 11 月）',source:'走查模拟',due:'2026-11-10'},
    {kind:'并发症筛查',date:'2026-09-05',type:'画像预置 · 专业建议原文',region:'听力',side:'双侧',note:'确诊后建议做基线听力检查（尚未做）',source:'走查模拟',due:'2026-11-10'},
    {kind:'疼痛与疲劳',date:'2026-09-18',type:'画像预置 · 本人观察',region:'躯干',side:'双侧',note:'剧烈运动后恢复比同学慢（自述）',source:'走查模拟'},
    {kind:'心理与生活',date:'2026-09-01',type:'画像预置 · 本人观察',region:'',side:'',note:'拿到报告那天反而松了口气——终于知道不是自己不努力',source:'走查模拟',private:true},
    {kind:'心理与生活',date:'2026-09-15',type:'画像预置 · 本人观察',region:'',side:'',note:'还没告诉室友，怕被当成梗来玩',source:'走查模拟',private:true},
    {kind:'心理与生活',date:'2026-10-01',type:'画像预置 · 本人观察',region:'',side:'',note:'保研计划照旧，导师那边先不说',source:'走查模拟'}]},
{ id:'p3', name:'陈静', initial:'陈', meta:'FSHD1 · 41 岁 · 轻症外显（家系已知）',
  gene:{repeats:4,haplo:'4qA',method:'Southern Blot',type:'FSHD1',hospital:'上海华山医院 神经内科',date:'2019-05-22',
    quote:'D4Z4 重复单元数目 4，4qA 单倍型；与家系中已确诊成员一致的分子特征。'},
  misdx:[
    {when:'2019-05-22',kind:'confirmed',label:'确诊 FSHD1（家系检测，母亲与舅舅均为患者）',hospital:'上海华山医院 神经内科'}],
  family:[
    {relation:'母亲',status:'已确诊 FSHD1（轮椅）',note:'由本人照护为主'},
    {relation:'女儿（14 岁）',status:'未检测',note:'等她成年后自己决定；遗传咨询材料已备好'}],
  series:{ck:[['2024-06-11',285],['2025-06-17',301],['2026-06-09',279],['2026-09-15',290]],
          fvc:[['2024-06-11',96],['2025-06-17',94],['2026-06-09',95],['2026-09-15',93]],
          w6m:[['2024-06-11',560],['2025-06-17',552],['2026-06-09',545],['2026-09-15',538]],
          grip:[['2024-06-11',29.0],['2025-06-17',28.2],['2026-06-09',28.0],['2026-09-15',27.3]],
          rss:[['2019-05-22',1.0],['2024-06-11',1.5],['2025-06-17',1.5],['2026-06-09',2.0]],
          fss:[['2025-06-17',32],['2026-06-09',34],['2026-09-15',33]]},
  emg:'2019-04 肌电图：轻度肌源性改变（历史报告）',
  events:[
    {d:'2019-05-22',kind:'gene',  title:'确诊 FSHD1（家系）', status:'done',   src:'上海华山医院 神经内科'},
    {d:'2026-10-25',kind:'screen',title:'呼吸功能复查',       status:'planned',src:'呼吸科门诊建议（原文抄录）'}],
  seed:[
    {kind:'功能与康复',date:'2026-10-01',type:'画像预置 · 本人观察',region:'肩胛 / 上肢',side:'右',note:'右肩偶发酸胀，抬臂可完成（不对称）',source:'走查模拟'},
    {kind:'功能与康复',date:'2026-10-01',type:'画像预置 · 本人观察',region:'下肢',side:'双侧',note:'爬楼无困难；长距离步行后小腿酸',source:'走查模拟'},
    {kind:'功能与康复',date:'2026-10-15',type:'画像预置 · 康复 / 支持性干预',region:'躯干',side:'双侧',note:'快走 5 公里（照护者保持自身体力）',source:'走查模拟'},
    {kind:'功能与康复',date:'2024-03-15',type:'画像预置 · 辅助器具',region:'躯干',side:'双侧',note:'定制背部紧身胸衣（备而未用，1600 元）',source:'走查模拟'},
    {kind:'并发症筛查',date:'2026-04-10',type:'画像预置 · 专业建议原文',region:'眼底',side:'双侧',note:'未见异常（原文抄录）；每年复查',source:'走查模拟',due:'2027-04-10'},
    {kind:'并发症筛查',date:'2026-04-10',type:'画像预置 · 专业建议原文',region:'听力',side:'双侧',note:'正常（原文抄录）；每年复查',source:'走查模拟',due:'2027-04-10'},
    {kind:'并发症筛查',date:'2025-10-18',type:'画像预置 · 专业建议原文',region:'呼吸',side:'双侧',note:'正常（原文抄录）；下次 2026-10-25（到期）',source:'走查模拟',due:'2026-10-25'},
    {kind:'疼痛与疲劳',date:'2026-09-20',type:'画像预置 · 本人观察',region:'肩胛 / 上肢',side:'右',note:'提重物后右肩痛 2/10',source:'走查模拟'},
    {kind:'心理与生活',date:'2026-09-12',type:'画像预置 · 本人观察',region:'',side:'',note:'比母亲轻很多，但她每次摔倒我心都会一沉',source:'走查模拟',private:true},
    {kind:'心理与生活',date:'2026-08-30',type:'画像预置 · 本人观察',region:'',side:'',note:'女儿的检测决定权留给她自己，我先把材料准备好',source:'走查模拟'}]}
];
let profileId='p1';
const cur=()=>PROFILES.find(p=>p.id===profileId)||PROFILES[0];
const seriesOf=(p,code)=>(p.series&&p.series[code])||[];
const stateOf=id=>{stateOf.map=stateOf.map||{};const k=id;
  if(!stateOf.map[k]){const p=PROFILES.find(x=>x.id===k);
    const sel=METRICS.filter(m=>seriesOf(p,m.code).length).slice(0,4).map(m=>m.code);
    stateOf.map[k]={records:(p&&p.seed?p.seed:[]).map((s,i)=>({...s,id:'seed-'+k+'-'+i})),saved:new Set(),flipped:new Set(),
      chart:{range:'12m',zoom:100,sel,toggles:{events:true,endLabels:true,changes:true},pin:null,ev:null}};}
  return stateOf.map[k];};
const records=()=>stateOf(profileId).records, saved=()=>stateOf(profileId).saved;
const flipped=()=>stateOf(profileId).flipped;
const chart=()=>stateOf(profileId).chart;

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

/* ============================================================
   我的确诊（taste：瑞士平面 + 一角留白；大号数字锚点取代文字堆叠）
   ============================================================ */
function renderDiagnosis(p){
const steps=p.misdx.map((m,i)=>{const n=String(i+1).padStart(2,'0');
  const k=m.kind==='preliminary'?'先被诊断':m.kind==='revised'?'诊断修订':'分子确诊';
  return `<div class="dx-step ${m.kind==='confirmed'?'confirm':''}">
    <i>${n}</i><span class="dx-step-k">${k}</span>
    <b>${esc(m.label)}</b>
    <small>${esc(m.when)} · ${esc(m.hospital)}</small></div>`;}).join('');
return `<section class="card dx">
  <div class="dx-head">
    <div class="dx-anchor"><span class="dx-num">${p.gene.repeats}</span><span class="dx-num-k">D4Z4 重复单元数目（抄录）</span></div>
    <div class="dx-facts">
      <div><span class="k">单倍型</span><b>${esc(p.gene.haplo)}</b></div>
      <div><span class="k">分型</span><b>${esc(p.gene.type)}</b></div>
      <div><span class="k">检测方法</span><b>${esc(p.gene.method)}</b></div>
      <div><span class="k">机构 · 日期</span><b>${esc(p.gene.hospital)} · ${esc(p.gene.date)}</b></div>
    </div>
  </div>
  <details class="dx-quote"><summary>报告原文位（不改写、不判读）</summary><div class="quote">「${esc(p.gene.quote)}」</div></details>
  <p class="note">严重程度与外显预测不由本工作台给出。AI 工具（Khub 社区开源链路、OpenRare）的解读属于待医生复核的线索，不写入本档案。</p>
</section>
<section class="card dx"><h2>确诊之路</h2>
  <div class="dx-steps">${steps}</div>
  <p class="note">只新增、不删除历史。这段经历引发情绪时，可到「心理与生活」记录（私密）。</p>
</section>
<section class="card private dx"><h2>家系记录 <span class="tag private">私密 · 不进导出</span></h2>
  <div class="dx-family">${p.family.map(f=>`<div class="dx-fam"><b>${esc(f.relation)}</b><span>${esc(f.status)}</span><small>${esc(f.note)}</small></div>`).join('')}</div>
  <details><summary>可讨论问题（遗传咨询准备）</summary><ul><li>我的 FSHD 是遗传来的还是新生突变？</li><li>家系成员检测的意义与流程？</li><li>50% 遗传概率与 20%–30% 新生突变如何理解？</li></ul></details>
  <p class="note">默认私密：不进导出、看板摘要与 AI 草稿。术语卡与沟通材料在「复诊准备」。</p>
</section>`;
}

/* ============================================================
   指标卡（真 3D 翻转；背面=最近 N 次迷你折线）
   ============================================================ */
function deltaText(m,prevVal,lastVal){
  if(prevVal==null||prevVal===lastVal)return '与上次相同';
  const d=lastVal-prevVal;
  if(m.delta==='pct')return (d>0?'+':'')+(d/Math.abs(prevVal)*100).toFixed(1)+'%';
  return (d>0?'+':'')+fmt(m,d)+' '+m.unit.replace(/\s*\/.*/,'');
}
/* 指标卡背面迷你折线（与小畅宝 v0.2 同源：基线 + 折线 + 点） */
function sparkline(pts,color,w=200,h=44){
  if(!pts||pts.length<2)return '';
  const vs=pts.map(x=>x[1]);let lo=Math.min(...vs),hi=Math.max(...vs);
  if(hi===lo){hi+=1;lo-=1}
  const X=i=>4+(w-8)*i/(pts.length-1);
  const Y=v=>h-5-(h-10)*(v-lo)/(hi-lo);
  const d=pts.map((x,i)=>`${i?'L':'M'}${X(i).toFixed(1)},${Y(x[1]).toFixed(1)}`).join('');
  const dots=pts.map((x,i)=>`<circle class="sp-dot" cx="${X(i).toFixed(1)}" cy="${Y(x[1]).toFixed(1)}" r="2.6" fill="${color}"><title>${esc(x[0])} · ${fmt({dec:1},x[1])}</title></circle>`).join('');
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" aria-hidden="true"><path class="base" d="M4 ${h-5}H${w-4}"/><path class="sp-line" d="${d}" stroke="${color}"/>${dots}</svg>`;
}
const METRIC_CATS=['检验','呼吸','功能','量表'];
function metricCard(p,m){
  const pts=seriesOf(p,m.code);if(!pts.length)return '';
  const last=pts[pts.length-1],prev=pts.length>1?pts[pts.length-2]:null;
  const vals=pts.map(x=>x[1]),on=flipped().has(m.code);
  const cat=`<span class="cat"><i style="background:${m.color}"></i>${esc(m.cat)}</span>`;
  return `<button class="mcard" data-action="mflip" data-code="${m.code}" aria-pressed="${on}"
    aria-label="${esc(m.name)} 指标卡，末值 ${fmt(m,last[1])} ${esc(m.unit)}，${esc(last[0])}，点击翻转查看最近 ${pts.length} 次趋势">
    <span class="mcard-inner">
      <span class="mface front">${cat}<span class="name">${esc(m.name)}</span>
        <span class="val"><span>${fmt(m,last[1])}</span><small>${esc(m.unit)}</small></span>
        ${prev?`<span class="delta">较上次 <em>${esc(deltaText(m,prev[1],last[1]))}</em>（${esc(last[0])}）</span>`:`<span class="delta">首次记录（${esc(last[0])}）</span>`}
        <span class="rec">${esc(last[0])} · ${esc(m.src)}</span></span>
      <span class="mface back">${cat}<span class="name">${esc(m.name)}</span><span class="count">最近 ${pts.length} 次 · ${esc(m.unit)}</span>
        ${sparkline(pts,m.color)}
        ${pts.length>1
          ?`<span class="spark-labels"><span>${esc(pts[0][0])}</span><span>${esc(last[0])}</span></span>`
          :`<span class="spark-labels"><span>只有 1 次记录，暂不连线</span><span>${esc(last[0])}</span></span>`}
        <span class="foot">末值 ${fmt(m,last[1])} ${esc(m.unit)} · 全期 ${fmt(m,Math.min(...vals))}–${fmt(m,Math.max(...vals))}</span></span>
    </span></button>`;
}
function metricCardGrid(p){
  return METRIC_CATS.map(c=>{const ms=METRICS.filter(m=>m.cat===c&&seriesOf(p,m.code).length);
    if(!ms.length)return '';
    return `<div class="metric-group"><div class="metric-group-head"><h3>${esc(c)}</h3><span>${ms.length} 项</span></div>
      <div class="metric-grid">${ms.map(m=>metricCard(p,m)).join('')}</div></div>`;}).join('');
}

/* ---------- 检查与指标 ---------- */
function renderLabs(p){
const ckM=metricBy('ck'),ckPts=seriesOf(p,'ck');
return card('指标卡 · 点击翻转看最近趋势','<p class="note" style="margin-bottom:8px">正面给末值与变化；背面给该指标最近若干次的迷你折线。只有 1 次记录时不连线。检验值按百分比、功能与量表按绝对量标注变化（带单位）。</p>'+metricCardGrid(p))
+card('肌电图与其他报告',`<div class="quote">${esc(p.emg)}</div>
  <div class="table-wrap"><table><tr><th>来源</th><th>字段</th><th>候选值</th><th>状态</th></tr>
  <tr><td>肌电图报告（模拟）</td><td>结论（原文）</td><td>${esc(p.emg.split('：').slice(1).join('：')||'—')}</td><td><span class="tag orange">待核对</span></td></tr>
  <tr><td>生化报告（模拟）</td><td>CK</td><td>${ckPts.length?fmt(ckM,ckPts[ckPts.length-1][1])+' U/L':'—'}</td><td><span class="tag green">已核对</span></td></tr></table></div>
  <p class="note">解析失败不产候选，原件保留可重试；重复导入按 sha256 去重。接受候选只写入事实表，接受≠临床审核。</p>`);
}

/* ============================================================
   病情一图秀（对齐 docs/16-ONE-CHART-SPEC.md R1–R12）
   ============================================================ */
const EV_COLOR={gene:'#205b82',device:'#246943',screen:'#a4561f'};
const EV_STATUS={done:{label:'已发生',color:'green'},planned:{label:'计划',color:'orange'},discussion:{label:'讨论中',color:'blue'},pending:{label:'待核实',color:'orange'},unknown:{label:'状态未知',color:''}};
const eventKey=(e)=>e.id||`${e.d}|${e.kind}|${e.title}`;
const RANGES=[['6m','近 6 月'],['12m','近 12 月'],['all','全期']];
const RANGE_LABEL={ '6m':'近 6 月','12m':'近 12 月','all':'全期' };
const shortDate=d=>d.slice(5).replace('-','.');

/* 画布常量（与小畅宝 v0.2 一图秀引擎一致） */
const CW=980,CH=420,CX0=62,CX1=954,CY0=132,CY1=366;
const xOf=(t,t0,t1)=>CX0+(t-t0)/Math.max(1,t1-t0)*(CX1-CX0);
const inDomain=(d,t0,t1)=>{const t=Date.parse(d);return t>=t0-1&&t<=t1+1};

/* 单调三次插值（Fritsch-Carlson）：只平滑折线，不产生越过相邻点的过冲鼓包 */
function smoothPath(coords){
  const n=coords.length;if(!n)return '';
  if(n===1)return `M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
  const dx=[],slope=[];
  for(let i=0;i<n-1;i++){const ddx=coords[i+1].x-coords[i].x;dx.push(ddx);slope.push(ddx?(coords[i+1].y-coords[i].y)/ddx:0)}
  const tan=[slope[0]];
  for(let i=1;i<n-1;i++){
    if(slope[i-1]*slope[i]<=0)tan.push(0);
    else{const w1=2*dx[i]+dx[i-1],w2=dx[i]+2*dx[i-1];tan.push((w1+w2)/(w1/slope[i-1]+w2/slope[i]));}}
  tan.push(slope[n-2]);
  let d=`M ${coords[0].x.toFixed(1)} ${coords[0].y.toFixed(1)}`;
  for(let i=0;i<n-1;i++){
    const c1x=coords[i].x+dx[i]/3,c1y=coords[i].y+tan[i]*dx[i]/3;
    const c2x=coords[i+1].x-dx[i]/3,c2y=coords[i+1].y-tan[i+1]*dx[i]/3;
    d+=` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${coords[i+1].x.toFixed(1)} ${coords[i+1].y.toFixed(1)}`;}
  return d;
}
function monthTicks(t0,t1){
  const out=[];let cur=new Date(new Date(t0).getFullYear(),new Date(t0).getMonth(),1);
  if(cur.getTime()<t0)cur.setMonth(cur.getMonth()+1);
  while(cur.getTime()<=t1){const x=xOf(cur.getTime(),t0,t1);
    if(x>CX0+6&&x<CX1-6)out.push({x,label:(cur.getMonth()+1)+'月'});
    cur=new Date(cur.getFullYear(),cur.getMonth()+1,1);}
  if(out.length>7)return out.filter((_,i)=>i%2===0);
  return out;
}

function renderOneChart(p){
const st=chart();
const groups=METRIC_CATS.map(c=>({cat:c,codes:METRICS.filter(m=>m.cat===c)})).filter(g=>g.codes.length);
const ds=[];METRICS.forEach(m=>seriesOf(p,m.code).forEach(x=>ds.push(x[0])));p.events.forEach(e=>ds.push(e.d));
const ts=ds.map(d=>Date.parse(d)).sort((a,b)=>a-b);
const rng=`${shortDate(new Date(ts[0]).toISOString().slice(0,10))} – ${shortDate(new Date(ts[ts.length-1]).toISOString().slice(0,10))}`;
return `<div class="chips" aria-label="时间范围">${RANGES.map(([k,l])=>`<button class="chip" aria-pressed="${st.range===k}" data-action="range" data-range="${k}">${l}</button>`).join('')}</div>
<div class="overview">
  <aside class="rail" aria-label="筛选与指标选择">
    <details class="pick" ${window.innerWidth>900?'open':''}>
      <summary>选择指标 <small>最多 4 个 · 已选 ${st.sel.length}</small></summary>
      <div class="metric-list">${groups.map(g=>`<div class="cat-label">${esc(g.cat)}</div>${g.codes.filter(c=>seriesOf(p,c.code).length).map(c=>`<label class="metric-pick"><input type="checkbox" ${st.sel.includes(c.code)?'checked':''} data-pick="${c.code}"><i style="background:${c.color}"></i><span>${esc(c.name)}</span><small>${seriesOf(p,c.code).length} 次</small></label>`).join('')}`).join('')}</div>
      <p class="small-note">最多 4 条；勾选第 5 条会被拒绝并提示。</p></details>
    <section><h3>显示</h3>
      <div class="chips">
        <button class="chip" aria-pressed="${st.toggles.events}" data-action="toggle" data-key="events">事件节点</button>
        <button class="chip" aria-pressed="${st.toggles.endLabels}" data-action="toggle" data-key="endLabels">末点数值</button>
        <button class="chip" aria-pressed="${st.toggles.changes}" data-action="toggle" data-key="changes">变化标注</button></div></section>
    <section><h3>时间窗缩放</h3>
      <div class="zoom"><input type="range" min="40" max="100" value="${st.zoom}" data-action="zoom" aria-label="时间窗缩放"><span>${st.zoom}%</span></div>
      <p class="small-note">右端锚定最新记录；40% 表示只看最近四成时间。</p></section>
    <section><h3>口径</h3>
      <p class="small-note">每条线按该指标<b>全部记录</b>的最小值–最大值归一化，只用于同屏回顾，不能比较不同指标的绝对值；切换时间窗不改变纵向映射。检验类变化按百分比，功能与量表按绝对量（带单位）。</p></section>
    <button class="primary" id="btnReplay">重播趋势动画</button>
    <p class="small-note">重播只重启图表动画，不重置筛选、翻卡状态与滚动位置。</p>
  </aside>
  <div class="timeline-main">
    <div class="chart-panel">
      <div class="chart-top">
        <div><h2>已选 ${st.sel.length} 项 · ${RANGE_LABEL[st.range]}</h2>
          <p class="small-note">点击数据点固定详情；事件泳道独立于数据区上方，引线不穿过曲线。</p></div>
        <span class="pill">${rng}</span></div>
      <div class="legend" id="chartLegend"></div>
      <div class="chart-wrap" id="chartWrap"></div>
      <div class="pin" id="chartPin" hidden></div>
      <div class="ev-tags" id="evTags"></div>
    </div>
    <div class="section-title"><h2>指标卡片</h2><span class="source-link">点一张卡翻到背面；每张卡互不影响</span></div>
    ${metricCardGrid(p)}
  </div>
</div>`;
}

function drawChart({animate=false}={}){
  const wrap=$('#chartWrap');if(!wrap)return;
  const scrollLeft=wrap.scrollLeft;
  const p=cur(),st=chart();
  const ds=[];METRICS.forEach(m=>seriesOf(p,m.code).forEach(x=>ds.push(x[0])));p.events.forEach(e=>ds.push(e.d));
  const ts=ds.map(d=>Date.parse(d)).sort((a,b)=>a-b);
  const t1=ts[ts.length-1],tStart=ts[0];
  const months={'6m':6,'12m':12}[st.range];
  const start=months?new Date(new Date(t1).setMonth(new Date(t1).getMonth()-months)):new Date(tStart);
  const t0=t1-(t1-start.getTime())*st.zoom/100;
  const visibleEvents=st.toggles.events?p.events.map((e,i)=>({e,i,key:eventKey(e),x:xOf(Date.parse(e.d),t0,t1)})).filter(({e})=>inDomain(e.d,t0,t1)).sort((a,b)=>a.x-b.x):[];
  const laneEnds=[];
  visibleEvents.forEach(item=>{const width=Math.min(170,Math.max(54,item.e.title.length*6.2+34));let lane=laneEnds.findIndex(end=>item.x-width/2>=end.x+end.width/2+8);if(lane<0)lane=laneEnds.length;item.lane=lane;item.labelWidth=width;laneEnds[lane]={x:item.x,width};});
  const plotTop=Math.max(CY0,34+laneEnds.length*22+22),plotBottom=Math.max(CY1,plotTop+234),chartHeight=plotBottom+54;
  const series=st.sel.map(c=>metricBy(c)).filter(m=>m&&seriesOf(p,m.code).length).map(m=>{
    const all=seriesOf(p,m.code),vs=all.map(x=>x[1]);
    const lo=Math.min(...vs),hi=Math.max(...vs);
    return {m,lo,hi,span:(hi-lo)||Math.max(Math.abs(hi)*0.08,1),pts:all.filter(x=>inDomain(x[0],t0,t1))};
  }).filter(s=>s.pts.length);
  const yOf=(s,v)=>plotBottom-(v-s.lo)/s.span*(plotBottom-plotTop);

  const legend=$('#chartLegend'),tags=$('#evTags'),pin=$('#chartPin');
  if(!series.length){
    wrap.innerHTML='<div class="empty"><h3>这个时间窗里没有所选指标</h3><p>扩大时间范围，或在左侧加选一个指标。</p></div>';
    legend.innerHTML='';tags.innerHTML='';pin.hidden=true;return;}

  const grid=[0,1,2,3,4].map(i=>{const y=plotTop+i*(plotBottom-plotTop)/4;
    return `<line class="grid" x1="${CX0}" x2="${CX1}" y1="${y}" y2="${y}"/>`}).join('');
  const ticks=monthTicks(t0,t1).map(t=>`<line class="axis" x1="${t.x.toFixed(1)}" x2="${t.x.toFixed(1)}" y1="${plotBottom}" y2="${plotBottom+5}"/><text class="tick" x="${t.x.toFixed(1)}" y="${plotBottom+18}" text-anchor="middle">${t.label}</text>`).join('');

  /* 事件泳道：独立行，引线止于数据区上沿，不穿过曲线 */
  let strip='',markLines='';
  if(st.toggles.events){
    visibleEvents.forEach(({e,i,key,x,lane,labelWidth})=>{
      const row=27+lane*22,col=EV_COLOR[e.kind]||'#5c6d65',status=EV_STATUS[e.status]||EV_STATUS.unknown,active=st.ev===key||st.ev===i;
      const left=Math.min(CX1-labelWidth,Math.max(CX0,x-labelWidth/2));
      const shape=e.status==='planned'
        ?`<rect x="${(x-5).toFixed(1)}" y="${row-4}" width="10" height="10" rx="1.5" fill="#fff" stroke="${col}" stroke-width="1.8" transform="rotate(45 ${x.toFixed(1)} ${row+1})"/>`
        :`<circle cx="${x.toFixed(1)}" cy="${row+1}" r="5" fill="${e.status==='done'?col:'#fff'}" stroke="${col}" stroke-width="1.8"/>`;
      strip+=`<g class="event-node${active?' selected':''}" data-action="ev" data-i="${i}" data-event-key="${esc(key)}" tabindex="0" role="button" aria-label="${esc(e.d)}，${esc(e.title)}，${status.label}" aria-pressed="${active}" style="animation-delay:${i*65}ms">
        <circle class="event-hit" cx="${x.toFixed(1)}" cy="${row+1}" r="12"/>
        ${shape}<text class="ev-label" x="${(left+labelWidth/2).toFixed(1)}" y="${row-7}" text-anchor="middle" fill="${col}">${esc(e.title)} · ${status.label}</text><title>${esc(e.d)} · ${esc(e.title)} · ${status.label} · 来源：${esc(e.src||'未记录')}</title></g>`;
      markLines+=`<line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${row+8}" y2="${plotTop-9}" stroke="${col}" stroke-width="1" stroke-dasharray="3 5" opacity=".42"/>`;});
    if(!visibleEvents.length)strip=`<text class="tick" x="${CX0}" y="38">当前时间窗内没有事件；扩大时间范围可查看。</text>`;
    else strip+=`<text x="8" y="38" font-size="9" fill="#8fa1b5">事件</text>`;
  }

  /* 末点标签：按 y 排序强制最小间距 13px，右端左锚定 */
  const lastPos=series.map(s=>{
    const c=s.pts.map(pt=>({x:xOf(Date.parse(pt[0]),t0,t1),y:yOf(s,pt[1])})),l=c[c.length-1];
    return {s,x:l.x,y:l.y,v:s.pts[s.pts.length-1][1]};}).sort((a,b)=>a.y-b.y);
  let cursor=-Infinity;
  for(const it of lastPos){it.ly=Math.max(it.y,cursor+13);cursor=it.ly}
  const overflow=Math.max(0,lastPos[lastPos.length-1].ly-(plotBottom+2));
  if(overflow)for(const it of lastPos)it.ly-=overflow;

  const lines=series.map((s,si)=>{
    const coords=s.pts.map(pt=>({x:xOf(Date.parse(pt[0]),t0,t1),y:yOf(s,pt[1])}));
    const path=s.pts.length>1
      ?`<path class="line" d="${smoothPath(coords)}" stroke="${s.m.color}" pathLength="1" style="animation-delay:${si*90}ms"/>`:'';
    const points=coords.map((c,i)=>{const pt=s.pts[i],isLast=i===s.pts.length-1;
      const active=st.pin&&st.pin.code===s.m.code&&st.pin.date===pt[0];
      return `<circle class="pt${active?' active':''}" cx="${c.x.toFixed(1)}" cy="${c.y.toFixed(1)}" r="${isLast?5.2:4.2}" fill="${s.m.color}" data-action="pin" data-code="${s.m.code}" data-date="${pt[0]}" style="animation-delay:${i*45+si*90}ms"><title>${esc(s.m.name)} ${fmt(s.m,pt[1])} ${esc(s.m.unit)} · ${esc(pt[0])}</title></circle>`;}).join('');
    const lp=lastPos.find(x=>x.s===s),nearRight=lp.x>CX1-44,lx=nearRight?lp.x-8:lp.x+8;
    const label=st.toggles.endLabels
      ?`<text class="delta-tag" x="${lx.toFixed(1)}" y="${(lp.ly+4).toFixed(1)}" text-anchor="${nearRight?'end':'start'}" fill="${s.m.color}">${fmt(s.m,lp.v)} ${esc(s.m.unit)}</text>`:'';
    return `<g>${path}${points}${label}</g>`;}).join('');

  if(animate)st.animationRunId=(st.animationRunId||0)+1;
  wrap.innerHTML=`<svg class="chart${animate?' chart-animate':''}" id="onechartSvg" data-animation-run="${st.animationRunId||0}" viewBox="0 0 ${CW} ${chartHeight}" role="img"
    aria-label="所选指标时序图，共 ${series.length} 条序列；每条线按自身全部记录范围归一化，不代表数值可比">
    ${grid}${ticks}${markLines}${lines}${strip}
    <text class="tick" x="${CX0}" y="${plotBottom+36}">各序列按自身全部记录的最小值–最大值归一化，不代表数值可比</text>
  </svg><div class="chart-tip" id="chartTip"></div>`;
  wrap.scrollLeft=scrollLeft;

  /* 图例：末值 + 全期范围 + 变化（按指标类型选口径） */
  legend.innerHTML=series.map(s=>{
    const all=seriesOf(p,s.m.code),vals=all.map(x=>x[1]),last=s.pts[s.pts.length-1];
    const idx=all.findIndex(x=>x[0]===last[0]),prev=idx>0?all[idx-1]:null;
    let chg='';
    if(st.toggles.changes&&prev){const d=last[1]-prev[1];
      if(d===0)chg='较上次无变化';
      else if(s.m.delta==='pct')chg=(d>0?'+':'')+(d/Math.abs(prev[1])*100).toFixed(1)+'%';
      else chg=(d>0?'+':'')+fmt(s.m,d)+' '+s.m.unit.replace(/\s*\/.*/,'');}
    return `<span><i style="background:${s.m.color}"></i><b>${esc(s.m.name)}</b>
      <span>末值 ${fmt(s.m,last[1])} ${esc(s.m.unit)}</span>
      <span class="range">全期 ${fmt(s.m,Math.min(...vals))}–${fmt(s.m,Math.max(...vals))}</span>
      ${s.pts.length<2?'<span class="tag">只有 1 次记录，暂不连线</span>':chg?`<span class="tag">较上次 ${esc(chg)}</span>`:''}</span>`;}).join('');

  /* 图下事件标签：与图上节点同一 id */
  if(!st.toggles.events)tags.innerHTML='<p class="small-note">事件显示已关闭；记录没有被删除。</p>';
  else{
    tags.innerHTML=visibleEvents.length?visibleEvents.map(({e,i,key})=>{const status=EV_STATUS[e.status]||EV_STATUS.unknown,active=st.ev===key||st.ev===i;
      return `<button class="ev-tag${active?' active':''}" data-action="ev" data-i="${i}" data-event-key="${esc(key)}" aria-pressed="${active}">
      <b>${esc(e.d)}</b> <span class="ev-tag-title">${esc(e.title)}</span> <span class="tag ${status.color}">${status.label}</span></button>`;}).join('')
      :'<p class="small-note">当前时间窗内没有事件；扩大时间范围可查看。</p>';}

  /* 固定详情 */
  if(st.pin){const m=metricBy(st.pin.code);const hit=(seriesOf(p,st.pin.code)||[]).find(x=>x[0]===st.pin.date);
    pin.innerHTML=hit
      ?`<div><b>${esc(m.name)} · ${fmt(m,hit[1])} ${esc(m.unit)}</b><p>${esc(hit[0])} · 来源：${esc(m.src)}</p></div><button class="icon-button" data-action="pin-close" aria-label="关闭详情">×</button>`
      :`<div><b>该记录已不在当前时间窗</b><p>可扩大时间范围后重新点选。</p></div><button class="icon-button" data-action="pin-close" aria-label="关闭详情">×</button>`;
    pin.hidden=false;}
  else if(st.ev!=null){const i=p.events.findIndex(e=>eventKey(e)===st.ev);const e=i>=0?p.events[i]:(Number.isInteger(st.ev)?p.events[st.ev]:null);
    if(e){const status=EV_STATUS[e.status]||EV_STATUS.unknown;
      pin.innerHTML=`<div><b>${esc(e.title)} · ${esc(e.d)}</b><p>${status.label} · ${esc(e.kind)} · 来源：${esc(e.src||'未记录')} · 来源核对：${esc(e.sourceStatus||'待核实')}<br>事件为抄录，不推断与指标变化的因果。</p></div><button class="icon-button" data-action="ev-close" aria-label="关闭事件详情">×</button>`;pin.hidden=false;}
    else{st.ev=null;pin.hidden=true;}}
  else pin.hidden=true;

  /* 悬停预览 + 点选固定 */
  const svgEl=$('#onechartSvg'),tip=$('#chartTip');
  const highlightEvent=(i,on)=>{document.querySelectorAll(`.event-node[data-i="${i}"],.ev-tag[data-i="${i}"]`).forEach(node=>node.classList.toggle('hover-linked',on));};
  svgEl.onpointerover=ev=>{const node=ev.target.closest('.event-node');if(node){highlightEvent(node.dataset.i,true);tip.classList.add('on');tip.style.left=(Number(node.querySelector('.event-hit').getAttribute('cx')/CW*100))+'%';tip.style.top=(Number(node.querySelector('.event-hit').getAttribute('cy')/chartHeight*100))+'%';tip.textContent=node.querySelector('title')?.textContent||node.getAttribute('aria-label');}};
  svgEl.onpointerout=ev=>{const node=ev.target.closest('.event-node');if(node&&!node.contains(ev.relatedTarget)){highlightEvent(node.dataset.i,false);tip.classList.remove('on');}};
  svgEl.onfocusin=ev=>{const node=ev.target.closest('.event-node');if(node)highlightEvent(node.dataset.i,true);};
  svgEl.onfocusout=ev=>{const node=ev.target.closest('.event-node');if(node)highlightEvent(node.dataset.i,false);};
  svgEl.onkeydown=ev=>{const node=ev.target.closest('.event-node');if(!node||!['Enter',' '].includes(ev.key))return;ev.preventDefault();const i=node.dataset.i;node.dispatchEvent(new MouseEvent('click',{bubbles:true}));requestAnimationFrame(()=>svgEl.querySelector(`.event-node[data-i="${i}"]`)?.focus());};
  tags.onpointerover=ev=>{const tag=ev.target.closest('.ev-tag');if(tag)highlightEvent(tag.dataset.i,true);};
  tags.onpointerout=ev=>{const tag=ev.target.closest('.ev-tag');if(tag&&!tag.contains(ev.relatedTarget))highlightEvent(tag.dataset.i,false);};
  tags.onfocusin=ev=>{const tag=ev.target.closest('.ev-tag');if(tag)highlightEvent(tag.dataset.i,true);};
  tags.onfocusout=ev=>{const tag=ev.target.closest('.ev-tag');if(tag)highlightEvent(tag.dataset.i,false);};
  const nearest=ev=>{const r=svgEl.getBoundingClientRect();
    const mx=(ev.clientX-r.left)*CW/r.width,my=(ev.clientY-r.top)*chartHeight/r.height;
    let best=null,bd=1e9;
    series.forEach(s=>s.pts.forEach(pt=>{
      const dx=xOf(Date.parse(pt[0]),t0,t1)-mx,dy=yOf(s,pt[1])-my,d=dx*dx+dy*dy;
      if(d<bd){bd=d;best={s,pt}}}));
    return {best,bd};};
  svgEl.onpointermove=ev=>{if(ev.target.closest('.event-node'))return;const {best,bd}=nearest(ev);
    if(best&&bd<3600){tip.classList.add('on');
      tip.style.left=(xOf(Date.parse(best.pt[0]),t0,t1)/CW*100)+'%';
      tip.style.top=(yOf(best.s,best.pt[1])/chartHeight*100)+'%';
      tip.textContent=`${best.s.m.name} ${fmt(best.s.m,best.pt[1])} ${best.s.m.unit} · ${best.pt[0]}`;}
    else tip.classList.remove('on');};
  svgEl.onpointerleave=()=>tip.classList.remove('on');
  svgEl.onclick=ev=>{
    const el=ev.target.closest('[data-action="pin"]');
    if(el){st.pin={code:el.dataset.code,date:el.dataset.date};drawChart();return}
    const {best,bd}=nearest(ev);if(!best||bd>600)return;
    st.pin={code:best.s.m.code,date:best.pt[0]};drawChart();};
}
/* 重播：只重建图表图层，不重置筛选 / 翻卡 / 事件 / 滚动 */
function replayChart(){drawChart({animate:true})}

function render(){
$('#nav').innerHTML=pages.map(p=>`<button data-page="${p}" aria-label="${p}" title="${p}" ${p===current?'aria-current="page"':''}><span class="nav-icon" aria-hidden="true">${navIcons[p]}</span><span class="nav-label">${p}</span></button>`).join('')+`<small>档案：${esc(cur().name)}<br>当前为分批探索稿<br>完整原型未签认</small>`;
const p=cur();
let html=`<div class="page-head"><div class="eyebrow">我的 FSHD 工作台 / ${esc(current)}</div><h1>${esc(current)}</h1></div>`;
if(current==='看板')html+=`<section class="hero"><h1>记录变化，<br>准备下一次复诊。</h1><p>从今天最想完成的一件事开始。你的生活任务、功能变化和问题，可以一起带到诊室。当前档案：${esc(p.name)}（${esc(p.meta)}）。</p></section><div class="grid">${card('今天想先做什么？',jump('功能与康复','记录一项生活任务的变化')+jump('并发症筛查','整理医生建议的检查计划')+jump('复诊准备','准备复诊问题与材料'),'feature')}${card('把支持带进日常',jump('医保与资源','找患者组织与诊疗线索')+jump('临床研究','核对听说的新药进展')+jump('心理与生活','整理私密困扰与支持需要'))}</div><div class="grid section">${card('筛查计划',records().filter(r=>r.kind==='并发症筛查').length?'<p>已记录 '+records().filter(r=>r.kind==='并发症筛查').length+' 条模拟计划。无建议日期的项目保持待确认。</p>'+jump('并发症筛查','查看计划'):'<div class="empty">还没有专业建议日期。与医生确认后再记录，不自动推算逾期。</div>')}${card('本次记录',`<p>${records().filter(r=>!r.private).length} 条公开模拟记录 · ${saved().size} 条已收藏线索</p><small>私密心理记录不出现在看板摘要中。切右上角档案可看 ${PROFILES.map(x=>x.name).join(' / ')} 三组画像。</small>` )}</div><details class="section"><summary>💡 为什么有这些入口？</summary><p>中国患者研究归纳了五类诉求：靶向药、辅助器具、心理支持、就业机会和更包容的社会环境。五项没有全国统一量化名次。</p><a href="https://doi.org/10.1186/s41687-026-01026-z" target="_blank" rel="noopener noreferrer">查看2026患者研究</a></details>`;
else if(current==='我的确诊')html+=renderDiagnosis(p);
else if(current==='检查与指标')html+=renderLabs(p);
else if(current==='病情一图秀')html+=renderOneChart(p);
else if(['功能与康复','并发症筛查','疼痛与疲劳','心理与生活'].includes(current)){const descriptions={'功能与康复':'关注洗头、穿衣、起身、上下台阶等具体任务。下面含「画像预置」的模拟记录与你新增的记录；不对称、辅具体验、跌倒或专业建议都可记录，不自行生成训练方案。','并发症筛查':'记录适用于自己的专业建议。眼、听力、呼吸与肌骨评估的条件不同，不预设人人每年四项检查。预置条目展示典型节奏，具体以医生建议为准。','疼痛与疲劳':'记录发生情境和对生活的影响，帮助复诊时说清楚，不自动判断好转或恶化。','心理与生活':'这里的感受记录默认私密，不进入看板、复诊导出或 AI 草稿。学业就业、独立生活与沟通材料保持原有子页归属。'};html+=`<p>${descriptions[current]}</p><div class="row"><span class="pill">画像预置 ${records().filter(r=>r.type&&r.type.startsWith('画像预置')).length} 条 · 你新增 ${records().filter(r=>!(r.type||'').startsWith('画像预置')).length} 条</span><button class="primary" id="add">新增模拟记录</button></div><div class="card section ${current==='心理与生活'?'private':''}">${recordList(current)}</div>`;if(current==='心理与生活')html+=`<div class="card section"><h2>支持与生活事项</h2><p>可先记录：我最需要什么支持、愿意告诉谁、工作/学业希望怎样调整、出行需要核实哪些无障碍条件。完整子页尚待原型细化。</p>${jump('医保与资源','查看支持资源')}</div>`;}
else if(current==='医保与资源'||current==='临床研究'){
const isTrial=current==='临床研究',items=isTrial?trials:resources,filters=isTrial?['全部','已收藏']:['全部','患者组织','公益组织','渠道 / 工具','医疗机构','已收藏'];
html+=`<p>${isTrial?'把注册阶段、公开结果与实际可及性分开看。这里是有日期的研究快照，不是可购买药品目录。':'从要解决的事情出发，核对服务范围与入口。名单有代表性，不是医院排名；预约、资格及费用仍需咨询。'}</p><div class="subnav">${filters.map(f=>`<button data-filter="${f}" aria-pressed="${tab===f}">${f}</button>`).join('')}</div><div class="grid">${items.filter(i=>tab==='全部'||tab==='已收藏'&&saved().has(i.id)||i.type===tab).map(i=>card(esc(i.name),`<span class="pill">${esc(i.stage||i.type+' · '+i.region)}</span><p>${esc(i.mechanism||i.service)}</p>${isTrial?`<p>${esc(i.result)}</p>`:''}<p><strong>可及性：</strong>${esc(i.limit)}</p><div class="source">${esc(i.source||i.evidence)} · 核对 2026-10-18${i.date?' · 事件 '+esc(i.date):''}</div><div class="row section"><button data-detail="${i.id}" class="small">详情与咨询准备</button><button data-save="${i.id}" class="small" aria-pressed="${saved().has(i.id)}">${saved().has(i.id)?'取消收藏':'收藏'}</button></div>`)).join('')||'<div class="empty">还没有收藏。返回“全部”，选择需要核实的线索。</div>'}</div>`;
}
else if(current==='复诊准备')html+=`<p>汇总「${esc(p.name)}」本轮非私密模拟记录与收藏。公共研究线索与本人观察分区输出，支持下载真实 Markdown 文件。</p><div class="card"><h2>本次摘要</h2>${records().filter(r=>!r.private).map(r=>`<div class="record"><strong>${esc(r.kind)} · ${esc(r.date)}</strong><p>${esc(r.note)}</p><small>用户模拟记录，非专业结论；来源：${esc(r.source||'未记录')}</small></div>`).join('')||'<div class="empty">还没有可汇总的记录。先记录一项生活任务变化。</div>'}<h3>指标摘要（抄录位）</h3><div class="table-wrap"><table><tr><th>指标</th><th>末值</th><th>日期</th><th>全期范围</th><th>来源</th></tr>${METRICS.filter(m=>seriesOf(p,m.code).length).map(m=>{const a=seriesOf(p,m.code),l=a[a.length-1],v=a.map(x=>x[1]);return `<tr><td>${esc(m.name)}</td><td class="num">${fmt(m,l[1])} ${esc(m.unit)}</td><td>${esc(l[0])}</td><td class="num">${fmt(m,Math.min(...v))}–${fmt(m,Math.max(...v))}</td><td>${esc(m.src)}</td></tr>`}).join('')}</table></div><p>已收藏 ${saved().size} 条公共线索；不代表已核实可获得服务。</p><button id="export" class="primary">下载复诊准备.md</button></div>`;
else if(current==='设置')html+=`<div class="stack">${card('本机资料目录','<p>未连接。此 HTML 原型不读取或持久化患者资料。</p><button disabled>选择目录（待 Desktop 接入）</button>')}${card('报告解析','<p>未配置、未发送。真实解析须另行显示上传路径并按文件授权。</p><button disabled>解析报告（未接通）</button>')}${card('模拟档案','<p>'+PROFILES.map(x=>esc(x.name)+'（'+esc(x.meta)+'）').join('<br>')+'</p><p class="note">三组画像用于走查不同病程阶段；右上角随时切换。记录与收藏按档案隔离。</p>')}${card('关于','<p>小飞侠 0.1.0 · 研究快照 2026-10-18。只是交互探索稿，完整导航与任务仍待细化，未通过用户原型确认。</p>')}</div>`;
$('#main').innerHTML=html;
if(current==='病情一图秀')drawChart({animate:true});
}

/* ---------- 档案切换 ---------- */
function profileModal(){
modal('切换模拟患者档案',`<p class="note">三组均为演示画像，覆盖不同病程阶段；切换后各页数据与记录随之变化（按档案隔离）。</p>
  ${PROFILES.map(x=>{const n=METRICS.filter(m=>seriesOf(x,m.code).length).length;
  return `<button class="list-row" data-action="choose-profile" data-profile="${x.id}">
  <span class="avatar">${x.initial}</span>
  <span><b style="font-size:13px">${esc(x.name)}</b> <span class="pill">${esc(x.meta)}</span><br><span class="note">确诊 ${esc(x.gene.date)} · ${esc(x.gene.type)} · D4Z4 ${x.gene.repeats} · ${n} 项指标</span></span></button>`}).join('')}`);
}
function applyProfileHeader(){$('#pfAvatar').textContent=cur().initial;$('#pfName').textContent=cur().name;$('#pfMeta').textContent=cur().meta;}
function chooseProfile(id){
  if(id===profileId)return;
  profileId=id;applyProfileHeader();tab='全部';render();
  toast('已切换到 '+cur().name+'（'+cur().meta+'）；记录、收藏、翻卡与图表筛选按档案隔离');
}

/* ---------- 事件分发 ---------- */
document.addEventListener('click',e=>{
const el=e.target.closest('[data-action]');if(el){
  const a=el.dataset.action;
  if(a==='toggle'){const k=el.dataset.key;const st=chart();st.toggles[k]=!st.toggles[k];
    el.setAttribute('aria-pressed',String(st.toggles[k]));drawChart();return}
  if(a==='range'){const st=chart();st.range=el.dataset.range;
    document.querySelectorAll('[data-action="range"]').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.range===st.range)));
    drawChart({animate:true});return}
  if(a==='pin-close'){chart().pin=null;drawChart();return}
  if(a==='ev-close'){chart().ev=null;drawChart();return}
  if(a==='ev'){const st=chart(),i=Number(el.dataset.i),key=el.dataset.eventKey||eventKey(cur().events[i]);st.ev=st.ev===key||st.ev===i?null:key;st.pin=null;drawChart();return}
}
const b=e.target.closest('button');
if(b&&b.dataset.action==='choose-profile'){chooseProfile(b.dataset.profile);$('#dialog').close();return}
if(b&&b.dataset.action==='mflip'){const code=b.dataset.code,on=b.getAttribute('aria-pressed')==='true';
  on?flipped().delete(code):flipped().add(code);b.setAttribute('aria-pressed',String(!on));return}
if(b&&b.dataset.action==='metric'){const st=chart(),code=b.dataset.code;
  if(st.sel.includes(code)){st.sel=st.sel.filter(c=>c!==code)}
  else if(st.sel.length>=4){toast('最多同时显示 4 条曲线；请先取消一条再选');return}
  else st.sel.push(code);
  drawChart({animate:true});return}
if(b&&b.dataset.action==='range'){chart().range=b.dataset.range;drawChart({animate:true});return}
if(b&&b.dataset.action==='ev'){const i=Number(b.dataset.i),st=chart(),key=b.dataset.eventKey||eventKey(cur().events[i]);st.ev=st.ev===key||st.ev===i?null:key;st.pin=null;drawChart();return}
if(b&&b.dataset.action==='ev-close'){chart().ev=null;drawChart();return}
if(b&&b.dataset.action==='pin-close'){chart().pin=null;drawChart();return}
if(b&&b.id==='btnReplay'){replayChart();return}
if(b&&b.dataset.page){current=b.dataset.page;tab='全部';render();return}
if(b&&b.id==='add'){entryForm(current);return}
if(b&&b.id==='profileBtn'){profileModal();return}
if(b&&b.dataset.filter){tab=b.dataset.filter;render();return}
if(b&&b.dataset.save){const id=b.dataset.save;saved().has(id)?saved().delete(id):saved().add(id);render();toast('收藏已更新（归属档案 '+cur().name+'，仅当前页面暂存）');return}
if(b&&b.dataset.detail){const i=[...resources,...trials].find(i=>i.id===b.dataset.detail);modal(i.name,`<p>${esc(i.service||i.mechanism)}</p><p>${esc(i.result||'')}</p><p><strong>待核实：</strong>${esc(i.limit)}</p><h3>咨询时可以问</h3><ul><li>目前是否提供与我需求相关的服务或研究？</li><li>需要哪些已有报告、转诊材料和往返安排？</li><li>费用、补偿、资格与实际名额如何确认？</li></ul><p>来源性质：${esc(i.source||i.evidence)}；本轮核对 2026-10-18。没有电话核验或预约。</p><a target="_blank" rel="noopener noreferrer" href="${i.url}">打开原始来源 ↗</a>`);return}
if(b&&b.id==='export')download();});
document.addEventListener('change',e=>{
const t=e.target;
if(t.dataset&&t.dataset.pick){const st=chart(),code=t.dataset.pick;
  if(t.checked){
    if(st.sel.length>=4){t.checked=false;toast('最多同时显示 4 条曲线；请先取消一条再选');return}
    st.sel.push(code);
  }else st.sel=st.sel.filter(c=>c!==code);
  const sum=document.querySelector('.pick summary small');
  if(sum)sum.textContent='最多 4 个 · 已选 '+st.sel.length;
  drawChart();return}
if(t.dataset&&t.dataset.action==='zoom'){const st=chart();st.zoom=Number(t.value);
  if(t.nextElementSibling)t.nextElementSibling.textContent=st.zoom+'%';drawChart({animate:true});return}
if(t.id==='aiState'){$('#aiStatus').textContent=t.value;$('#aiNote').textContent=t.value.includes('冲突')?'已有草稿保留。覆盖与发送均被阻止；可取消并返回工作台。':t.value.includes('失败')?'连接失败（模拟）。未发送任何内容，工作台记录保留。':t.value+'；无真实连接或发送。'}});

function download(){const p=cur();const body=['# 小飞侠 0.1.0 · 复诊准备（模拟 · '+p.name+'）','生成：'+new Date().toISOString(),'仅当前探索稿数据；私密记录未包含。','\n## 本人模拟记录',...records().filter(r=>!r.private).map(r=>`- ${r.date} / ${r.kind}：${r.note}\n  来源：${r.source||'未记录'}；非专业结论`),'\n## 指标摘要（抄录位）',...METRICS.filter(m=>seriesOf(p,m.code).length).map(m=>{const a=seriesOf(p,m.code),l=a[a.length-1];return `- ${m.name}：${fmt(m,l[1])} ${m.unit}（${l[0]}）· ${m.src}`}),'\n## 基因确诊档案（抄录位）',`- ${p.gene.type} · D4Z4 ${p.gene.repeats} · ${p.gene.haplo} · ${p.gene.method} · ${p.gene.hospital} ${p.gene.date}`,`- 原文：${p.gene.quote}`,'\n## 公共参考线索（不等于个人病历事实）',...[...resources,...trials].filter(i=>saved().has(i.id)).map(i=>`- ${i.name}：${i.limit}\n  ${i.url}\n  核对2026-10-18；${i.source||i.evidence}`),'\n## 下次可问','- 哪些功能变化值得进一步评估？','- 哪些检查适用于我，计划日期和来源是什么？'].join('\n');const a=document.createElement('a'),url=URL.createObjectURL(new Blob([body],{type:'text/markdown;charset=utf-8'}));a.href=url;a.download='小飞侠-复诊准备-模拟.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('已生成 Markdown 下载（'+p.name+'）；请查看浏览器下载结果')}
$('#font').onclick=()=>{document.body.classList.toggle('large');$('#font').textContent=document.body.classList.contains('large')?'标准字':'大字'};
$('#close').onclick=$('#done').onclick=()=>$('#dialog').close();
$('#about').onclick=()=>modal('小飞侠 0.1.0 · 关于与范围','<p>这是第一批交互探索稿，非完整工作台、非真实患者服务。</p><p>可走查：三组模拟档案切换、确诊档案与误诊时间线、指标卡 3D 翻转看趋势、一图秀多指标（独立归一化 / 时间窗 / 缩放 / 事件泳道 / 重播）、功能/筛查/症状/私密记录、资源与研究收藏（含 Khub 社区与 OpenRare 工具线索）、复诊 Markdown 导出及模拟面板状态稿。</p><p>尚待：报告导入、生产存储、原生 Agent 实机适配、完整子页与异常状态、用户确认。</p>');
function setWidth(v){width=Math.min(45,Math.max(25,Number(v)));$('#shell').style.setProperty('--pane',width+'%');$('#width').value=width;$('#split').setAttribute('aria-valuenow',width);$('#split').setAttribute('aria-valuetext',width+'%')}
function aiToggle(show){if(show&&$('#shell').clientWidth<620){$('#aiStatus').textContent='窄屏已收起';toast('工作区较窄，AI 助手面板已收起；扩大工作区后可打开');return}
  $('#pane').hidden=$('#split').hidden=!show;$('#shell').classList.toggle('with-pane',show);$('#ai').setAttribute('aria-expanded',String(show));$('#ai').setAttribute('aria-label',show?'隐藏 AI 助手':'打开 AI 助手');$('#aiStatus').textContent=show?'宿主状态未验证':'已收起';setWidth(width)}
$('#ai').onclick=()=>aiToggle($('#pane').hidden);$('#hideAI').onclick=()=>{aiToggle(false);$('#ai').focus()};$('#width').oninput=e=>setWidth(e.target.value);$('#split').onkeydown=e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();setWidth(e.key==='Home'?25:e.key==='End'?45:width+(e.key==='ArrowLeft'?1:-1))}};
$('#split').onpointerdown=e=>{e.target.setPointerCapture(e.pointerId);e.target.onpointermove=ev=>{const box=$('#shell').getBoundingClientRect();setWidth((box.right-ev.clientX)/box.width*100)};e.target.onpointerup=()=>e.target.onpointermove=null};
const paneResize=new ResizeObserver(entries=>{const w=entries[0].contentRect.width;document.querySelector('header').classList.toggle('frame-compact',w<=760);if(w<620){$('#nav').classList.add('nav-compact');if(!$('#pane').hidden){aiToggle(false);$('#aiStatus').textContent='窄屏已收起'}}else $('#nav').classList.remove('nav-compact')});paneResize.observe($('#shell'));
applyProfileHeader();render();
