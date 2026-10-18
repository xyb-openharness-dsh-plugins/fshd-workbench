-- 0001_initial.sql · 小飞侠 FSHD 工作台
-- 状态：草案（2026-10-18）。未冻结、未执行；G3 通过后按家族流程冻结 sha256 并纳入 check-schema。
-- 约定：四层结构（领域事实/流程实例/读模型不落库/偏好）；改正=新增版本；日期可空不回填。

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- ============ L1 领域事实 ============

CREATE TABLE subject (
  id            INTEGER PRIMARY KEY,
  display_name  TEXT NOT NULL,
  birth_year    INTEGER,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 导入原件：按 (subject_id, sha256) 去重；重复导入不重置已解析状态
CREATE TABLE document (
  id             INTEGER PRIMARY KEY,
  subject_id     INTEGER NOT NULL REFERENCES subject(id),
  relative_path  TEXT NOT NULL,
  sha256         TEXT NOT NULL,
  mime           TEXT,
  imported_at    TEXT NOT NULL DEFAULT (datetime('now')),
  report_date    TEXT,                      -- 材料报告日期，可空不回填
  UNIQUE (subject_id, sha256)
);

-- 基因确诊档案：只抄录不判读；改正=新增版本（superseded_by）
CREATE TABLE gene_report_finding (
  id              INTEGER PRIMARY KEY,
  subject_id      INTEGER NOT NULL REFERENCES subject(id),
  d4z4_repeats    INTEGER,                  -- 1–10 常见，仅抄录
  haplotype       TEXT CHECK (haplotype IN ('4qA','4qB','unknown') OR haplotype IS NULL),
  method          TEXT,                     -- Southern Blot/分子梳/OGM/qPCR 原文
  fshd_type       TEXT CHECK (fshd_type IN ('FSHD1','FSHD2','undetermined') OR fshd_type IS NULL),
  hospital        TEXT,
  report_date     TEXT,                     -- 可空
  source_document INTEGER REFERENCES document(id),
  version         INTEGER NOT NULL DEFAULT 1,
  superseded_by   INTEGER REFERENCES gene_report_finding(id),
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 确诊/误诊经历留痕：只新增不删除
CREATE TABLE diagnosis_history (
  id          INTEGER PRIMARY KEY,
  subject_id  INTEGER NOT NULL REFERENCES subject(id),
  kind        TEXT NOT NULL CHECK (kind IN ('preliminary','revised','confirmed')),
  label       TEXT NOT NULL,                -- 当时的诊断名称原文
  hospital    TEXT,
  occurred_on TEXT,                         -- 可空
  note        TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 分区功能自查：自查恒不为结论
CREATE TABLE function_observation (
  id             INTEGER PRIMARY KEY,
  subject_id     INTEGER NOT NULL REFERENCES subject(id),
  region         TEXT NOT NULL CHECK (region IN ('face','scapula','upper_arm','abdomen','lower_limb')),
  side           TEXT NOT NULL DEFAULT 'both' CHECK (side IN ('left','right','both')),
  ability_key    TEXT NOT NULL,             -- 如 blow/whistle/eye_close/arm_raise/stair/foot_drop
  status_text    TEXT NOT NULL,             -- 用户原话，不做分级
  is_asymmetric  INTEGER NOT NULL DEFAULT 0 CHECK (is_asymmetric IN (0,1)),
  is_conclusion  INTEGER NOT NULL DEFAULT 0 CHECK (is_conclusion = 0),
  occurred_on    TEXT,
  created_at     TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_function_observation_subject_time ON function_observation(subject_id, occurred_on);

-- 医生评分原文位（FSHD-CSS 等）：只存原文，无数值判读
CREATE TABLE clinical_score_record (
  id          INTEGER PRIMARY KEY,
  subject_id  INTEGER NOT NULL REFERENCES subject(id),
  score_name  TEXT NOT NULL,
  value_text  TEXT NOT NULL,                -- 原文抄录
  source      TEXT,                         -- 医生/报告出处
  occurred_on TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 辅助器具档案
CREATE TABLE assistive_device (
  id          INTEGER PRIMARY KEY,
  subject_id  INTEGER NOT NULL REFERENCES subject(id),
  kind        TEXT NOT NULL CHECK (kind IN ('afo','back_brace','abdominal_binder','wheelchair','other')),
  name_text   TEXT,                         -- 用户自填，无品牌诱导位
  prescriber  TEXT,
  issued_on   TEXT,
  cost_note   TEXT,
  status      TEXT NOT NULL DEFAULT 'in_use' CHECK (status IN ('in_use','retired','considering')),
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 康复记录打卡
CREATE TABLE rehab_log (
  id          INTEGER PRIMARY KEY,
  subject_id  INTEGER NOT NULL REFERENCES subject(id),
  activity    TEXT NOT NULL,
  occurred_on TEXT,
  note        TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 并发症筛查：四类；结果只存原文；next_due_on 可空
CREATE TABLE screening_event (
  id           INTEGER PRIMARY KEY,
  subject_id   INTEGER NOT NULL REFERENCES subject(id),
  kind         TEXT NOT NULL CHECK (kind IN ('ocular_coats','hearing','respiratory','spine')),
  result_text  TEXT,                        -- 原文
  occurred_on  TEXT,
  next_due_on  TEXT,                        -- 医生建议的下次时间，可空
  source_document INTEGER REFERENCES document(id),
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_screening_subject_kind ON screening_event(subject_id, kind, occurred_on);

-- 疼痛/疲劳：severity 存原文，不判读趋势
CREATE TABLE symptom_entry (
  id            INTEGER PRIMARY KEY,
  subject_id    INTEGER NOT NULL REFERENCES subject(id),
  kind          TEXT NOT NULL CHECK (kind IN ('pain','fatigue')),
  site          TEXT,
  trigger_text  TEXT,
  severity_text TEXT,                       -- 如 "3/10" 原文
  occurred_on   TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_symptom_subject_time ON symptom_entry(subject_id, kind, occurred_on);

-- 检验指标（字典指标，复用家族抽取概念）
CREATE TABLE metric_result (
  id              INTEGER PRIMARY KEY,
  subject_id      INTEGER NOT NULL REFERENCES subject(id),
  metric_code     TEXT NOT NULL,            -- 如 CK
  value_num       REAL,                     -- 认不出数值时为 NULL（如 "<0.5" 保留原文）
  unit            TEXT,                     -- 认不出单位留空
  ref_text        TEXT,                     -- 参考范围不当结果
  value_text      TEXT,                     -- 原文
  occurred_on     TEXT,
  source_document INTEGER REFERENCES document(id),
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_metric_subject_code_time ON metric_result(subject_id, metric_code, occurred_on);

-- 医保/救助：只有状态与材料，无资格判断
CREATE TABLE insurance_case (
  id               INTEGER PRIMARY KEY,
  subject_id       INTEGER NOT NULL REFERENCES subject(id),
  kind             TEXT NOT NULL CHECK (kind IN ('chronic_outpatient','disability_cert','aid_program')),
  title            TEXT NOT NULL,
  status           TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned','submitted','approved','rejected','closed')),
  materials_note   TEXT,
  last_verified_on TEXT,                    -- 过期未核实由读模型标注
  created_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 资源档案（组织/专家/渠道）：标来源与未核实，不排序
CREATE TABLE resource_item (
  id               INTEGER PRIMARY KEY,
  subject_id       INTEGER NOT NULL REFERENCES subject(id),
  kind             TEXT NOT NULL CHECK (kind IN ('org','expert','channel')),
  name             TEXT NOT NULL,
  detail           TEXT,
  source           TEXT,
  last_verified_on TEXT,
  created_at       TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 研究线索：注册节点与临床结果分列；无数据为 NULL（界面显示"目前无公开临床疗效数据"）
CREATE TABLE research_lead (
  id                   INTEGER PRIMARY KEY,
  subject_id           INTEGER NOT NULL REFERENCES subject(id),
  name                 TEXT NOT NULL,
  sponsor              TEXT,
  registration_note    TEXT,               -- IND/获批临床/试验登记节点
  clinical_result_note TEXT,               -- 已公布 ORR/PFS 等；NULL=无公开数据
  source_url           TEXT,
  collected_on         TEXT,
  is_starred           INTEGER NOT NULL DEFAULT 0,
  created_at           TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 家系成员：默认私密（fail-closed 读取）
CREATE TABLE family_member (
  id                  INTEGER PRIMARY KEY,
  subject_id          INTEGER NOT NULL REFERENCES subject(id),
  relation            TEXT NOT NULL,
  genetic_status_text TEXT,                 -- 只抄录，不算风险
  note                TEXT,
  is_private          INTEGER NOT NULL DEFAULT 1 CHECK (is_private = 1),
  created_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 心理与生活（viewpoint）：恒不为结论；默认私密
CREATE TABLE viewpoint (
  id            INTEGER PRIMARY KEY,
  subject_id    INTEGER NOT NULL REFERENCES subject(id),
  kind          TEXT NOT NULL CHECK (kind IN ('feeling','social','life_work')),
  text          TEXT NOT NULL,
  is_conclusion INTEGER NOT NULL DEFAULT 0 CHECK (is_conclusion = 0),
  is_private    INTEGER NOT NULL DEFAULT 1,
  occurred_on   TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 待办：due_on 允许未来（planned）；已完成事件不晚于今天（应用层 assertPlanDate）
CREATE TABLE task (
  id          INTEGER PRIMARY KEY,
  subject_id  INTEGER NOT NULL REFERENCES subject(id),
  title       TEXT NOT NULL,
  due_on      TEXT,
  status      TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned','done','cancelled')),
  context_kind TEXT,                        -- screening/insurance/visit/...
  context_id  INTEGER,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============ L2 流程实例 ============

CREATE TABLE import_job (
  id          INTEGER PRIMARY KEY,
  document_id INTEGER NOT NULL REFERENCES document(id),
  state       TEXT NOT NULL CHECK (state IN ('pending','parsing','parsed','failed')),
  error       TEXT,                         -- 失败原因；失败不产候选
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT
);

-- 候选：合并同值；冲突/缺单位/非数字/低把握度读取时算，不落库
CREATE TABLE candidate (
  id           INTEGER PRIMARY KEY,
  document_id  INTEGER NOT NULL REFERENCES document(id),
  field        TEXT NOT NULL,
  value_text   TEXT NOT NULL,
  value_num    REAL,
  unit         TEXT,
  occurred_on  TEXT,                        -- 候选自带日期，可空
  confidence   REAL,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (document_id, field, value_text)
);

-- 核对动作：接受只写对应事实表；reviewed_by 保持 NULL（接受≠临床审核）
CREATE TABLE review_action (
  id           INTEGER PRIMARY KEY,
  candidate_id INTEGER NOT NULL REFERENCES candidate(id),
  action       TEXT NOT NULL CHECK (action IN ('accepted','rejected')),
  target_table TEXT,
  target_id    INTEGER,
  reviewed_by  TEXT,                        -- 保持 NULL
  created_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ============ L4 偏好（可覆盖写） ============

CREATE TABLE ui_pref (
  key        TEXT PRIMARY KEY,              -- ai_pane_open / ai_pane_width / nav_collapsed
  value_text TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE privacy_pref (
  key        TEXT PRIMARY KEY,              -- include_private 默认 fail-closed
  value_text TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
