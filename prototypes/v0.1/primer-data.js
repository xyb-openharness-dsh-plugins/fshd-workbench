/* 小飞侠 FSHD · 疾病概要数据（36 号）
 * 口径：docs/DISEASE-PRIMER.md；规范：starter docs/36-DISEASE-PRIMER.md。
 * FSHD 是罕见神经肌肉病，不是肿瘤：这里引用的是神经肌肉病领域的指南与专家综述，
 * 不套 CSCO / NCCN / AJCC 等肿瘤文件。全部内容属第 ② 层（解释），不做判断。
 *
 * 原件状态：AAN/AANEM 2015 指南只有公开链接、未存档原件；GeneReviews 直接页出现验证码，
 * 只提取到摘要，未假称读过全文。两者页码一律「页码待核」。
 */
window.DISEASE_PRIMER = {
  brand: '小飞侠 FSHD',
  name: '面肩肱型肌营养不良症',
  en: 'Facioscapulohumeral Muscular Dystrophy',
  updated: '2026-10-25',
  sections: [
    {
      id: 'definition',
      title: '定义',
      intro: 'FSHD（面肩肱型肌营养不良症）是一种遗传性肌肉疾病，主要累及面部、肩胛带与上臂，也可累及腹部和下肢；'
        + '不同人的受累范围与变化速度差别很大。本台只抄报告与功能记录原文，不做严重度判读，也不预测外显率。',
      points: [
        '分型：FSHD1 与 FSHD2 的分子机制不同，遗传咨询不能合并。基因报告需记录 D4Z4 重复数、4qA / 4qB 单倍型、甲基化，以及 SMCHD1 / DNMT3B / LRIF1 等相关基因原文；字段允许「未明确」。',
        '检测方法：Southern blot、OGM、qPCR 等写法不同；普通外显子检测阴性不能自动排除 FSHD，报告不全时本台保留缺项与原文，不替报告补结论。',
        '诊断依据是临床分布 + 基因检测 + 家族史的组合。本台不以算法确诊，也不拿 D4Z4 重复数自行生成筛查处方。',
        '中文全称「面肩肱型肌营养不良症」，英文 facioscapulohumeral muscular dystrophy（FSHD）；这两个名字在本台指同一件事，不混用旧称。'
      ],
      sources: [
        { org: 'AAN / AANEM', doc: 'Evidence-based guideline: Diagnosis and management of facioscapulohumeral muscular dystrophy', version: '2015', original: false, page: '页码待核', note: '公开指南链接（PMC4520817），本项目未存档原件' },
        { org: 'GeneReviews', doc: 'Facioscapulohumeral Muscular Dystrophy', version: '更新 2025-07-10', original: false, page: '页码待核', note: '直接页出现验证码，只提取到摘要，未读取完整正文' }
      ]
    },
    {
      id: 'evidence',
      title: '医学资料规范和指南情况',
      intro: '这台工作台里出现的「怎么确诊、该防哪些并发症、哪些照护类别可以讨论」，都应能追到下面某一份文件。'
        + 'FSHD 属罕见病，本项目没有找到可核对的中国 FSHD 诊疗指南全文，表里照实写。',
      table: {
        head: ['机构', '文件', '版本 / 年份', '原件', '本台的用途'],
        rows: [
          ['AAN / AANEM', 'Evidence-based guideline: Diagnosis and management of facioscapulohumeral muscular dystrophy', '2015', '未取得原件（公开指南链接，未存档）', '诊断路径与照护类别（康复、器具、疼痛、呼吸、眼与听力）'],
          ['GeneReviews', 'Facioscapulohumeral Muscular Dystrophy', '更新 2025-07-10', '未取得完整正文（直接页验证码，据摘要提取）', '分子机制、FSHD1 / FSHD2 区分、遗传咨询边界'],
          ['—', '中国 FSHD 诊疗指南 / 共识', '未检索到可核对版本', '未取得原件', '国内口径暂缺；不用其他病种指南代填']
        ]
      },
      points: [
        '未取得原件的文件只记「存在」与「大致讲什么」，不引用其具体条文，页码写「页码待核」。',
        '「指南里列了这一类照护」不等于「你所在医院能提供」：具体服务、等候时间、跨省手续与报销比例，本台不预填「可做」或「医保报销」。',
        '2015 年指南是历史文件，本台不用它替代 2026 年的药物状态核验；新药与在研项目另按登记与开发者公告记录。'
      ],
      sources: [
        { org: 'AAN / AANEM', doc: 'Evidence-based guideline: Diagnosis and management of facioscapulohumeral muscular dystrophy', version: '2015', original: false, page: '页码待核', note: '公开指南链接，未存档原件' },
        { org: 'GeneReviews', doc: 'Facioscapulohumeral Muscular Dystrophy', version: '更新 2025-07-10', original: false, page: '页码待核', note: '仅摘要，未读取完整正文' }
      ]
    },
    {
      id: 'landscape',
      title: '目前治疗全景概要',
      intro: 'FSHD 没有肿瘤那样的病期与线序，下面按照护类别分组。只列指南与专家综述里出现过的类别，'
        + '不含具体训练处方、器具品牌、药物剂量与适用条件——那些必须由你的神经肌肉病团队按你的功能状态决定。',
      groups: [
        {
          label: '功能与康复',
          points: [
            '个体化物理治疗与作业治疗：针对足下垂、绊倒、抬臂与穿衣受限等具体任务，由康复团队评估后安排；本台只记录「做了什么、多久一次、目标是什么」。',
            '适当运动：指南与综述把它列为照护类别；具体强度、频次与禁忌由医生或治疗师给出，本台不生成运动处方。',
            '功能记录：面部（吹气 / 闭眼）、肩胛（抬臂 / 翼状肩）、上臂、腹部（腰凸）、下肢（爬楼 / 足下垂）分区自查；医生量表（如 FSHD-CSS）只存原文，本台不打分。'
          ]
        },
        {
          label: '器具与手术',
          points: [
            '辅助器具评估：踝足矫形器（AFO）、腰背支具、腹带、轮椅与移动辅具，属于「评估—适配—复查」流程；本台记录谁开的、何时、费用与适配情况，不推荐品牌或型号。',
            '肩胛固定术：指南把它列为精选患者可评估的选项；手术不阻断疾病进展，获益与风险需由骨科 / 神经肌肉病团队判断，本台只留讨论记录。'
          ]
        },
        {
          label: '症状与并发症',
          points: [
            '疼痛与疲劳：疼痛评估、物理治疗、按医嘱用药与日常活动调整都属照护类别；本台只记录部位、强度、诱因与活动影响，不给用药建议。',
            '呼吸：肺功能评估、专科转诊，必要时通气支持；本台把「已确认的呼吸随访任务」与一般锻炼提醒分开，异常情况提示就诊而不是自行判断。',
            '眼与听力：闭眼不全时的眼保护、眼科与听力评估；眼底（Coats 病）与高频听力属于并发症筛查节奏，具体间隔按医生建议记录。',
            '脊柱：脊柱侧弯等肌骨问题纳入康复 / 肌骨评估，本台只记录筛查结果原文与下次建议时间。'
          ]
        },
        {
          label: '遗传、生活与临床研究',
          points: [
            '遗传咨询：FSHD1 / FSHD2 分开讨论，家系结构与风险说明由专业来源与遗传咨询限定；本台不计算个人风险、不替做生育决定，家系记录默认私密。',
            '生活与资源：慢特病、残疾证、救助项目、学业与就业的申请状态留痕；本台不担保结果、不代判资格。',
            '临床研究：参加登记良好的临床试验是正式选项，不是最后手段；登记不证明有效、安全或开放入组，状态需向研究中心核实。'
          ]
        }
      ],
      points: [
        '以上是文献与指南里列出的手段，按病期与线序排列，不代表任何一项适合你。选哪一个，这一句需要问你的医生。'
      ],
      sources: [
        { org: 'AAN / AANEM', doc: 'Evidence-based guideline: Diagnosis and management of facioscapulohumeral muscular dystrophy', version: '2015', original: false, page: '页码待核', note: '公开指南链接，未存档原件' },
        { org: 'GeneReviews', doc: 'Facioscapulohumeral Muscular Dystrophy', version: '更新 2025-07-10', original: false, page: '页码待核', note: '仅摘要，未读取完整正文' }
      ]
    },
    {
      id: 'trend',
      title: '发展趋势',
      intro: '这一段只写已经发生、能回源核对的事，每条带日期或版本号。本项目没有自采 FSHD 在研登记的数量与阶段分布，'
        + '所以不写数量统计；监管批件与分类体系更新也没有核实到，整类不写。',
      points: [
        '2015：AAN / AANEM 发布 FSHD 诊断与管理循证指南；本项目记录为 2015 版，未检索到更新版。',
        '2025-07-10：GeneReviews「Facioscapulohumeral Muscular Dystrophy」条目更新（本项目核查记录，仅摘要）。',
        '截至 2026-10-18 的公开登记与开发者公告：del-brax 处于 III 期（FORTITUDE-3，NCT07038200；2026-06-11 公告）；EPI-321 处于 I/II 期（NCT06907875；2026-10-05 报告首 6 例六个月数据）；apitegromab 处于 II 期（NCT07435129；2026-09-02 公告已开始给药）。'
      ],
      sources: [
        { org: 'AAN / AANEM', doc: 'Evidence-based guideline: Diagnosis and management of facioscapulohumeral muscular dystrophy', version: '2015', original: false, page: '页码待核' },
        { org: 'GeneReviews', doc: 'Facioscapulohumeral Muscular Dystrophy', version: '更新 2025-07-10', original: false, page: '页码待核' },
        { org: '开发者公告 / ClinicalTrials.gov', doc: 'del-brax、EPI-321、apitegromab 的登记与公告', version: '核查日 2026-10-18', original: false, page: '不以页码计', note: '据 docs/research/FSHD-THERAPIES.md 转引，未存档原件' }
      ]
    }
  ]
}
