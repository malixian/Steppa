const STATUS = {
  notStarted: "未开始",
  training: "训练中",
  emerging: "部分掌握",
  mastered: "已掌握",
  generalized: "已泛化",
};

const statusWeight = {
  [STATUS.notStarted]: 0,
  [STATUS.training]: 0.35,
  [STATUS.emerging]: 0.65,
  [STATUS.mastered]: 0.88,
  [STATUS.generalized]: 1,
};

const statusOrder = [
  STATUS.notStarted,
  STATUS.training,
  STATUS.emerging,
  STATUS.mastered,
  STATUS.generalized,
];

const levelMeta = {
  1: { label: "Level 1", age: "0-18个月能力" },
  2: { label: "Level 2", age: "18-30个月能力" },
  3: { label: "Level 3", age: "30-48个月能力" },
};

const levelDomains = {
  1: [
    {
      domain: "请求 Mand",
      stages: [
        "在强动机下用声音、手势或替代沟通表达需要",
        "在物品可见时主动请求多个偏好物",
        "在等待或中断时发起请求",
        "向不同成人请求帮助、继续或结束",
        "在自然活动中稳定发起多种请求",
      ],
    },
    {
      domain: "命名 Tact",
      stages: [
        "命名少量常见物品或人物",
        "在无回声提示下命名日常物品",
        "命名动作、声音或显著特征",
        "在书本、玩具和实物间迁移命名",
        "自发命名环境中的新奇事物",
      ],
    },
    {
      domain: "听者反应 Listener",
      stages: [
        "听到名字或简单提示后看向说话者",
        "按简单指令完成身体动作",
        "从少量物品中选择指定物",
        "按指令接触身体部位或熟悉人物",
        "在自然情境中完成多种一步指令",
      ],
    },
    {
      domain: "视觉感知与配对 VP-MTS",
      stages: [
        "追视和接触显著视觉刺激",
        "完成相同物品配对",
        "完成相同图片配对",
        "按形状、颜色或类别进行简单辨别",
        "独立完成基础拼插、分类或配对任务",
      ],
    },
    {
      domain: "独立游戏 Play",
      stages: [
        "短时操作 cause-effect 玩具",
        "独立探索多个玩具材料",
        "完成功能性玩具动作",
        "连续进行两个以上游戏动作",
        "在成人较少提示下维持独立游戏",
      ],
    },
    {
      domain: "社交与社交游戏 Social",
      stages: [
        "用目光、靠近或声音发起社交接触",
        "回应成人的社交游戏",
        "在游戏中轮流或等待短时间",
        "模仿同伴的简单动作",
        "主动参与简短互动游戏",
      ],
    },
    {
      domain: "动作模仿 Imitation",
      stages: [
        "模仿拍手、挥手等大动作",
        "模仿物品相关动作",
        "模仿面部或口部动作",
        "在不同材料中模仿新动作",
        "连续模仿多个动作序列",
      ],
    },
    {
      domain: "仿说 Echoic",
      stages: [
        "模仿简单声音或音节",
        "模仿熟悉单词近似音",
        "模仿双音节或常用词",
        "在功能活动中仿说目标词",
        "清晰仿说多种早期词语",
      ],
    },
    {
      domain: "自发发声 Vocal",
      stages: [
        "在活动中出现自发声音",
        "增加不同音节和声调变化",
        "用声音配合请求或社交接触",
        "在游戏中产生多样化发声",
        "稳定出现可塑造的早期语音",
      ],
    },
  ],
  2: [
    {
      domain: "请求 Mand",
      stages: [
        "不用实物提示请求缺失物品",
        "请求帮助、休息、继续和注意",
        "用两词以上形式表达具体需要",
        "在不同人员和地点中请求",
        "在自然动机下持续扩展请求库",
      ],
    },
    {
      domain: "命名 Tact",
      stages: [
        "命名大量常见名词",
        "命名动作、位置和常见属性",
        "命名组合刺激中的关键元素",
        "用短语描述物品或事件",
        "自发描述日常活动中的变化",
      ],
    },
    {
      domain: "听者反应 Listener",
      stages: [
        "完成多种一步指令",
        "按名称选择人物、地点和物品",
        "完成两步相关指令",
        "听从含动作或位置的指令",
        "在活动转换中稳定遵从指令",
      ],
    },
    {
      domain: "视觉感知与配对 VP-MTS",
      stages: [
        "完成非完全相同图片配对",
        "按颜色、形状、大小分类",
        "完成简单拼图或嵌板",
        "按类别归类多个物品",
        "独立完成视觉辨别学习任务",
      ],
    },
    {
      domain: "独立游戏 Play",
      stages: [
        "使用玩具完成多步功能玩法",
        "在不同材料间转换游戏方案",
        "进行早期假扮或象征游戏",
        "独立维持活动数分钟",
        "自发组合材料创造新玩法",
      ],
    },
    {
      domain: "社交与社交游戏 Social",
      stages: [
        "接近同伴并参与平行游戏",
        "在成人支持下轮流玩玩具",
        "回应同伴的简单发起",
        "用语言或替代沟通发起互动",
        "在短时合作游戏中维持参与",
      ],
    },
    {
      domain: "动作模仿 Imitation",
      stages: [
        "模仿带物品动作",
        "模仿精细动作和口部动作",
        "模仿两步动作序列",
        "延迟模仿熟悉动作",
        "从同伴或视频中学习新动作",
      ],
    },
    {
      domain: "仿说 Echoic",
      stages: [
        "仿说多种单词近似音",
        "仿说双词短语",
        "仿说含不同音节结构的词",
        "在低提示下仿说功能短句",
        "用仿说支持新词学习",
      ],
    },
    {
      domain: "按功能特征类别听者反应 LRFFC",
      stages: [
        "按功能选择物品",
        "按特征选择物品",
        "按类别选择物品",
        "在混合问题中听辨功能、特征和类别",
        "把 LRFFC 技能迁移到书本和自然环境",
      ],
    },
    {
      domain: "对话与填充 Intraverbal",
      stages: [
        "完成歌曲、儿歌或熟悉短语填空",
        "回答简单个人信息问题",
        "回答常见物品功能问题",
        "在无视觉支持下回答熟悉问题",
        "进行简短来回对话",
      ],
    },
    {
      domain: "集体与课堂 Group",
      stages: [
        "在小组中坐好并关注材料",
        "跟随集体的一步指令",
        "轮到自己时回应老师",
        "参与短时桌面或圈圈活动",
        "在小组转换中保持参与",
      ],
    },
    {
      domain: "语言结构 Linguistics",
      stages: [
        "稳定使用单词或替代沟通符号",
        "组合两词表达",
        "使用名词加动作或属性短语",
        "开始使用复数、代词或位置词",
        "在自然活动中产生多样短句",
      ],
    },
  ],
  3: [
    {
      domain: "请求 Mand",
      stages: [
        "请求信息、解释或澄清",
        "在没有明显物品时表达需要",
        "用完整句请求复杂活动",
        "协商、拒绝或提出替代选择",
        "跨人员和情境自发请求信息与帮助",
      ],
    },
    {
      domain: "命名 Tact",
      stages: [
        "描述物品的多个属性",
        "命名类别、功能和关系",
        "描述图片或事件中的细节",
        "用句子描述过去或正在发生的活动",
        "自发讲述观察到的变化和原因",
      ],
    },
    {
      domain: "听者反应 Listener",
      stages: [
        "完成两步和三步指令",
        "按多个属性选择目标",
        "理解方位、数量和时间相关指令",
        "根据规则完成活动",
        "在教学和生活情境中独立听从复杂指令",
      ],
    },
    {
      domain: "视觉感知与配对 VP-MTS",
      stages: [
        "完成复杂分类和排序",
        "按多个特征进行视觉辨别",
        "完成模式复制和序列任务",
        "解决基础视觉问题",
        "把视觉辨别用于学业前任务",
      ],
    },
    {
      domain: "独立游戏 Play",
      stages: [
        "独立进行主题假扮游戏",
        "按规则玩简单桌游或运动游戏",
        "计划并完成多步骤游戏",
        "灵活替换材料和角色",
        "维持较长时间的创造性游戏",
      ],
    },
    {
      domain: "社交与社交游戏 Social",
      stages: [
        "向同伴发起游戏邀请",
        "回应同伴评论或请求",
        "在合作游戏中协商角色",
        "维持多个来回的同伴互动",
        "在自然场景中泛化社交沟通",
      ],
    },
    {
      domain: "按功能特征类别听者反应 LRFFC",
      stages: [
        "按复杂功能和特征选择目标",
        "按类别、部分和用途进行听辨",
        "回答谁、哪里、什么时候相关听辨问题",
        "在书本和图片中按描述找目标",
        "把 LRFFC 迁移到对话和课堂理解",
      ],
    },
    {
      domain: "对话与填充 Intraverbal",
      stages: [
        "回答常见 WH 问题",
        "围绕熟悉主题进行多轮问答",
        "回答关于过去或未来事件的问题",
        "根据类别、功能或特征进行语言联想",
        "维持简短主题对话并主动补充信息",
      ],
    },
    {
      domain: "集体与课堂 Group",
      stages: [
        "在小组活动中跟随多步指令",
        "独立等待、举手和轮流",
        "跟随集体示范完成任务",
        "在较少个别提示下完成课堂活动",
        "参与学前课堂常规并保持学习行为",
      ],
    },
    {
      domain: "语言结构 Linguistics",
      stages: [
        "使用多词句表达完整意思",
        "使用形容词、方位词和数量词",
        "使用代词、时态或连接词",
        "组合复杂句描述事件",
        "在对话和叙述中灵活使用语法结构",
      ],
    },
    {
      domain: "阅读 Reading",
      stages: [
        "识别常见符号和环境文字",
        "匹配或命名部分字母",
        "理解书本方向和翻页常规",
        "识别简单词或名字",
        "回答关于图书内容的基础问题",
      ],
    },
    {
      domain: "书写 Writing",
      stages: [
        "模仿线条和简单图形",
        "描摹形状、符号或名字",
        "用工具进行可控涂写",
        "复制部分字母或数字",
        "完成早期书写和描画任务",
      ],
    },
    {
      domain: "数学 Math",
      stages: [
        "进行一一对应点数",
        "识别基础数量和大小",
        "按数量拿取物品",
        "排序、比较和配对数字材料",
        "完成早期数概念活动",
      ],
    },
  ],
};

const statusSeeds = {
  1: [STATUS.generalized, STATUS.mastered, STATUS.mastered, STATUS.emerging, STATUS.training],
  2: [STATUS.mastered, STATUS.emerging, STATUS.training, STATUS.training, STATUS.notStarted],
  3: [STATUS.training, STATUS.notStarted, STATUS.notStarted, STATUS.notStarted, STATUS.notStarted],
};

const programs = Object.entries(levelDomains).flatMap(([level, domains]) =>
  domains.flatMap((domainSpec, domainIndex) =>
    domainSpec.stages.map((title, index) => ({
      id: `l${level}-d${domainIndex + 1}-t${index + 1}`,
      level: Number(level),
      age: levelMeta[level].age.replace("能力", ""),
      domain: domainSpec.domain,
      title,
      status: statusSeeds[level][index],
      updated: buildUpdate(Number(level), domainSpec.domain, index),
    })),
  ),
);

let activeLevel = "all";
const pageLevel = Number(document.body.dataset.levelPage || 0);

const domainList = document.querySelector("#domainList");
const domainDetailPanel = document.querySelector("#domainDetailPanel");
const domainDetailTitle = document.querySelector("#domainDetailTitle");
const domainDetailList = document.querySelector("#domainDetailList");
const missingSkills = document.querySelector("#missingSkills");
const recentWins = document.querySelector("#recentWins");
const programColumns = document.querySelector("#programColumns");
const statusBoard = document.querySelector("#statusBoard");
const searchInput = document.querySelector("#programSearch");
const overallProgress = document.querySelector("#overallProgress");
const overallBar = document.querySelector("#overallBar");
const recommendationTitle = document.querySelector("#recommendationTitle");
const recommendationReason = document.querySelector("#recommendationReason");
const profileAvatar = document.querySelector("#profileAvatar");
const profileNameLine = document.querySelector("#profileNameLine");
const profileLevelLine = document.querySelector("#profileLevelLine");
const profileForm = document.querySelector("#profileForm");
const childNameInput = document.querySelector("#childNameInput");
const childAgeInput = document.querySelector("#childAgeInput");
const childLevelInput = document.querySelector("#childLevelInput");
const profileStorageKey = "steppa.childProfile";
const progressStorageKey = "steppa.taskProgress";
let selectedDomain = "";

function buildUpdate(level, domain, index) {
  const notes = [
    "已在自然情境中记录稳定表现",
    "近三次训练表现稳定，继续做人员和材料泛化",
    "已有独立反应，仍需减少提示并提高流畅度",
    "正在建立目标反应，建议每日短回合练习",
    "建议作为下一阶段基线和教学目标",
  ];
  return `Level ${level} · ${domain} · ${notes[index]}`;
}

function filteredPrograms() {
  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
  return programs.filter((program) => {
    const levelMatch = pageLevel
      ? program.level === pageLevel
      : activeLevel === "all" || String(program.level) === activeLevel;
    const text = `${program.domain} ${program.title} ${program.status}`.toLowerCase();
    return levelMatch && (!query || text.includes(query));
  });
}

function completionFor(items) {
  if (!items.length) return 0;
  const completedBlocks = items.reduce((sum, item) => sum + completionBlocksFor(item), 0);
  const totalBlocks = items.length * 5;
  return Math.round((completedBlocks / totalBlocks) * 100);
}

function loadProgressOverrides() {
  try {
    return JSON.parse(localStorage.getItem(progressStorageKey) || "{}");
  } catch {
    return {};
  }
}

function saveProgressOverride(taskId, blocks) {
  const overrides = loadProgressOverrides();
  overrides[taskId] = blocks;
  localStorage.setItem(progressStorageKey, JSON.stringify(overrides));
}

function completionBlocksFor(item) {
  const override = loadProgressOverrides()[item.id];
  if (Number.isInteger(override)) return Math.max(0, Math.min(5, override));
  return Math.round(statusWeight[item.status] * 5);
}

function completionBlockMarkup(item, interactive = false) {
  const completed = completionBlocksFor(item);
  const blocks = Array.from({ length: 5 }, (_, index) => {
    const filled = index < completed ? " filled" : "";
    const value = index + 1;
    if (interactive) {
      return `<button class="completion-block${filled}" type="button" data-task-id="${item.id}" data-block-value="${value}" aria-label="设置为 ${value}/5"></button>`;
    }
    return `<span class="completion-block${filled}" aria-hidden="true"></span>`;
  }).join("");

  return `
    <span class="completion-meter${interactive ? " editable" : ""}" aria-label="完成度 ${completed}/5">
      ${blocks}
      <span class="completion-label">${completed}/5</span>
    </span>
  `;
}

function renderOverview(items) {
  if (!domainList || !missingSkills || !recentWins || !overallProgress || !overallBar) return;

  const overall = completionFor(programs);
  overallProgress.textContent = `${overall}%`;
  overallBar.style.width = `${overall}%`;

  const domains = [...new Set(items.map((item) => item.domain))].sort((a, b) =>
    a.localeCompare(b, "zh-CN"),
  );
  domainList.innerHTML = domains
    .map((domain) => {
      const domainItems = items.filter((item) => item.domain === domain);
      const score = completionFor(domainItems);
      return `
        <button class="domain-row" type="button" data-domain="${domain}">
          <span class="domain-name">${domain}</span>
          <div class="progress-track"><span style="width:${score}%"></span></div>
          <span class="domain-score">${score}%</span>
        </button>
      `;
    })
    .join("");

  domainList.querySelectorAll(".domain-row").forEach((button) => {
    button.addEventListener("click", () => {
      selectedDomain = button.dataset.domain;
      renderDomainDetail(items);
    });
  });

  if (selectedDomain) renderDomainDetail(items);

  missingSkills.innerHTML = programs
    .filter((item) => [STATUS.notStarted, STATUS.training].includes(item.status))
    .slice(0, 6)
    .map(
      (item) =>
        `<li><strong>${item.title}</strong><span class="skill-meta">Level ${item.level} · ${item.domain} · ${item.status}</span></li>`,
    )
    .join("");

  recentWins.innerHTML = programs
    .filter((item) => [STATUS.mastered, STATUS.generalized, STATUS.emerging].includes(item.status))
    .slice(0, 6)
    .map((item) => `<li><strong>${item.title}</strong><span class="activity-note">${item.updated}</span></li>`)
    .join("");
}

function renderDomainDetail(items) {
  if (!domainDetailTitle || !domainDetailList) return;

  const domainItems = items.filter((item) => item.domain === selectedDomain);
  if (!selectedDomain || !domainItems.length) {
    domainDetailTitle.textContent = selectedDomain || "选择一个领域";
    domainDetailList.innerHTML = '<p class="empty-note">当前筛选下没有匹配的子任务。</p>';
    return;
  }

  const score = completionFor(domainItems);
  domainDetailTitle.textContent = `${selectedDomain} · ${domainItems.length}项 · ${score}%`;
  domainDetailList.innerHTML = domainItems
    .map(
      (item) => `
        <article class="domain-task">
          <div>
            <strong>${item.title}</strong>
            <span class="program-domain">Level ${item.level} · ${item.status}</span>
          </div>
          ${completionBlockMarkup(item, true)}
        </article>
      `,
    )
    .join("");

  domainDetailList.querySelectorAll(".completion-block").forEach((button) => {
    button.addEventListener("click", () => {
      const task = programs.find((item) => item.id === button.dataset.taskId);
      if (!task) return;

      const selectedBlocks = Number(button.dataset.blockValue);
      const currentBlocks = completionBlocksFor(task);
      const nextBlocks = selectedBlocks === currentBlocks ? selectedBlocks - 1 : selectedBlocks;
      saveProgressOverride(task.id, Math.max(0, Math.min(5, nextBlocks)));
      render();
    });
  });
}

function loadProfile() {
  const fallback = { name: "林小舟", age: "4岁2个月", level: "2" };
  try {
    return { ...fallback, ...JSON.parse(localStorage.getItem(profileStorageKey) || "{}") };
  } catch {
    return fallback;
  }
}

function renderProfile() {
  if (!profileNameLine || !profileLevelLine || !profileAvatar) return;

  const profile = loadProfile();
  const level = levelMeta[profile.level] || levelMeta[2];
  profileNameLine.textContent = `${profile.name}，${profile.age}`;
  profileLevelLine.textContent = `当前 VB-MAPP 等级：${level.label} · ${level.age}`;
  profileAvatar.textContent = (profile.name || "S").trim().slice(0, 1);

  if (childNameInput) childNameInput.value = profile.name;
  if (childAgeInput) childAgeInput.value = profile.age;
  if (childLevelInput) childLevelInput.value = String(profile.level);
}

function bindProfileForm() {
  if (!profileForm) return;

  profileForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const profile = {
      name: childNameInput.value.trim() || "未命名",
      age: childAgeInput.value.trim() || "未填写年龄",
      level: childLevelInput.value,
    };
    localStorage.setItem(profileStorageKey, JSON.stringify(profile));
    renderProfile();
  });
}

function renderPrograms(items) {
  if (!programColumns) return;
  if (pageLevel) {
    renderLevelDetail(items);
    return;
  }

  renderLevelOverview();
}

function renderLevelOverview() {
  const levels = Object.entries(levelMeta).map(([id, meta]) => ({ id: Number(id), ...meta }));

  programColumns.innerHTML = levels
    .map((level) => {
      const levelItems = programs.filter((item) => item.level === level.id);
      const domainCount = levelDomains[level.id].length;
      const score = completionFor(levelItems);
      return `
        <a class="level-overview-card" href="level-${level.id}.html">
          <div>
            <span class="section-kicker">${level.age}</span>
            <h3>${level.label}</h3>
          </div>
          <div class="level-card-stats">
            <span>${levelItems.length} 项</span>
            <span>${domainCount} 类</span>
            <span>完成率 ${score}%</span>
          </div>
          <div class="progress-track"><span style="width:${score}%"></span></div>
        </a>
      `;
    })
    .join("");
}

function renderLevelDetail(items) {
  const domains = levelDomains[pageLevel].map((item) => item.domain);
  programColumns.innerHTML = domains
    .map((domain) => {
      const domainItems = items.filter((item) => item.domain === domain);
      const score = completionFor(domainItems);
      const cards = domainItems.length
        ? domainItems.map(programCard).join("")
        : '<div class="status-item">没有匹配项目</div>';
      return `
        <section class="domain-section">
          <div class="domain-section-header">
            <div>
              <span class="section-kicker">${domainItems.length} 项</span>
              <h3>${domain}</h3>
            </div>
            <strong>${score}%</strong>
          </div>
          <div class="progress-track"><span style="width:${score}%"></span></div>
          <div class="domain-program-list">${cards}</div>
        </section>
      `;
    })
    .join("");
}

function programCard(item) {
  return `
    <article class="program-card" data-status="${item.status}">
      <div>
        <span class="program-title">${item.title}</span>
        <span class="program-domain">${item.domain}</span>
      </div>
      ${completionBlockMarkup(item)}
    </article>
  `;
}

function renderStatusBoard(items) {
  if (!statusBoard) return;

  statusBoard.innerHTML = statusOrder
    .map((status) => {
      const laneItems = items.filter((item) => item.status === status);
      const cards = laneItems.length
        ? laneItems
            .map(
              (item) =>
                `<div class="status-item">${item.title}<span class="program-domain">Level ${item.level} · ${item.domain}</span></div>`,
            )
            .join("")
        : '<div class="status-item">暂无项目</div>';
      return `
        <div class="status-lane">
          <div class="status-title">${status}<span class="status-count">${laneItems.length}</span></div>
          ${cards}
        </div>
      `;
    })
    .join("");
}

function recommendNext() {
  const candidate = [...programs]
    .filter((item) => item.status !== STATUS.generalized && item.status !== STATUS.mastered)
    .sort((a, b) => statusWeight[a.status] - statusWeight[b.status] || a.level - b.level)[0];

  if (!candidate) {
    recommendationTitle.textContent = "当前项目均已掌握或泛化";
    recommendationReason.textContent = "可以新增更高阶目标，或扩展到自然情境中的泛化记录。";
    return;
  }

  recommendationTitle.textContent = candidate.title;
  recommendationReason.textContent = `推荐从 Level ${candidate.level} · ${candidate.domain} 开始，因为它当前处于“${candidate.status}”，能直接补齐最近的能力缺口。`;
}

function render() {
  const items = filteredPrograms();
  renderProfile();
  renderOverview(items);
  renderPrograms(items);
  renderStatusBoard(items);
}

document.querySelectorAll(".segment").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".segment").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeLevel = button.dataset.level;
    render();
  });
});

if (searchInput) searchInput.addEventListener("input", render);
document.querySelector("#recommendButton")?.addEventListener("click", recommendNext);
bindProfileForm();

render();
