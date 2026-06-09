import SwiftUI

struct ChildProfile: Codable {
    var name: String = "林小舟"
    var age: String = "4岁2个月"
    var level: Int = 2
}

struct TrainingTask: Identifiable, Hashable {
    let id: String
    let title: String
}

struct TrainingDomain: Identifiable, Hashable {
    let id: String
    let name: String
    let tasks: [TrainingTask]
}

struct TrainingLevel: Identifiable, Hashable {
    let id: Int
    let name: String
    let age: String
    let domains: [TrainingDomain]
}

@MainActor
final class SteppaStore: ObservableObject {
    @Published var profile: ChildProfile {
        didSet { saveProfile() }
    }

    @Published var taskProgress: [String: Int] {
        didSet { saveProgress() }
    }

    let levels: [TrainingLevel] = TrainingCatalog.levels

    private let profileKey = "steppa.ios.profile"
    private let progressKey = "steppa.ios.progress"

    init() {
        if
            let data = UserDefaults.standard.data(forKey: profileKey),
            let decoded = try? JSONDecoder().decode(ChildProfile.self, from: data)
        {
            profile = decoded
        } else {
            profile = ChildProfile()
        }

        if
            let data = UserDefaults.standard.data(forKey: progressKey),
            let decoded = try? JSONDecoder().decode([String: Int].self, from: data)
        {
            taskProgress = decoded
        } else {
            taskProgress = [:]
        }
    }

    func progress(for task: TrainingTask) -> Int {
        taskProgress[task.id, default: 0]
    }

    func setProgress(_ value: Int, for task: TrainingTask) {
        taskProgress[task.id] = min(5, max(0, value))
    }

    func domainProgress(_ domain: TrainingDomain) -> Int {
        guard !domain.tasks.isEmpty else { return 0 }
        let done = domain.tasks.reduce(0) { $0 + progress(for: $1) }
        return Int((Double(done) / Double(domain.tasks.count * 5) * 100).rounded())
    }

    func levelProgress(_ level: TrainingLevel) -> Int {
        let tasks = level.domains.flatMap(\.tasks)
        guard !tasks.isEmpty else { return 0 }
        let done = tasks.reduce(0) { $0 + progress(for: $1) }
        return Int((Double(done) / Double(tasks.count * 5) * 100).rounded())
    }

    var overallProgress: Int {
        let tasks = levels.flatMap { $0.domains.flatMap(\.tasks) }
        guard !tasks.isEmpty else { return 0 }
        let done = tasks.reduce(0) { $0 + progress(for: $1) }
        return Int((Double(done) / Double(tasks.count * 5) * 100).rounded())
    }

    var missingTasks: [TrainingTask] {
        levels
            .flatMap { $0.domains.flatMap(\.tasks) }
            .filter { progress(for: $0) < 3 }
            .prefix(6)
            .map { $0 }
    }

    var recentTasks: [TrainingTask] {
        levels
            .flatMap { $0.domains.flatMap(\.tasks) }
            .filter { progress(for: $0) >= 3 }
            .prefix(6)
            .map { $0 }
    }

    var recommendedTask: TrainingTask? {
        levels
            .flatMap { $0.domains.flatMap(\.tasks) }
            .first { progress(for: $0) < 3 }
    }

    private func saveProfile() {
        guard let data = try? JSONEncoder().encode(profile) else { return }
        UserDefaults.standard.set(data, forKey: profileKey)
    }

    private func saveProgress() {
        guard let data = try? JSONEncoder().encode(taskProgress) else { return }
        UserDefaults.standard.set(data, forKey: progressKey)
    }
}

struct ContentView: View {
    @StateObject private var store = SteppaStore()

    var body: some View {
        TabView {
            ProfileView()
                .tabItem {
                    Label("档案", systemImage: "person.crop.circle")
                }

            TrainingView()
                .tabItem {
                    Label("训练", systemImage: "square.grid.2x2")
                }

            OverviewView()
                .tabItem {
                    Label("总览", systemImage: "chart.bar")
                }
        }
        .environmentObject(store)
        .tint(.teal)
    }
}

struct ProfileView: View {
    @EnvironmentObject private var store: SteppaStore
    @State private var draft = ChildProfile()

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    HStack(spacing: 16) {
                        AvatarView(name: store.profile.name)
                        VStack(alignment: .leading, spacing: 6) {
                            Text(store.profile.name)
                                .font(.title2.bold())
                            Text("\(store.profile.age) · Level \(store.profile.level)")
                                .foregroundStyle(.secondary)
                            BlockProgressView(value: store.overallProgressBlocks, label: "\(store.overallProgress)%")
                        }
                    }
                    .padding(.vertical, 8)
                }

                Section("基础信息") {
                    TextField("姓名", text: $draft.name)
                    TextField("年龄", text: $draft.age)
                    Picker("当前 Level", selection: $draft.level) {
                        Text("Level 1").tag(1)
                        Text("Level 2").tag(2)
                        Text("Level 3").tag(3)
                    }
                }

                Button("保存") {
                    store.profile = draft
                }
                .font(.headline)
            }
            .navigationTitle("儿童档案")
            .onAppear {
                draft = store.profile
            }
        }
    }
}

struct TrainingView: View {
    @EnvironmentObject private var store: SteppaStore
    @State private var selectedLevel = 2

    var body: some View {
        NavigationStack {
            List {
                Picker("Level", selection: $selectedLevel) {
                    ForEach(store.levels) { level in
                        Text(level.name).tag(level.id)
                    }
                }
                .pickerStyle(.segmented)
                .listRowSeparator(.hidden)

                if let level = store.levels.first(where: { $0.id == selectedLevel }) {
                    Section("\(level.age) · \(levelProgressText(level))") {
                        ForEach(level.domains) { domain in
                            NavigationLink {
                                DomainDetailView(domain: domain)
                            } label: {
                                DomainRow(domain: domain)
                            }
                        }
                    }
                }
            }
            .navigationTitle("训练")
            .onAppear {
                selectedLevel = store.profile.level
            }
        }
    }

    private func levelProgressText(_ level: TrainingLevel) -> String {
        "完成 \(store.levelProgress(level))%"
    }
}

struct DomainDetailView: View {
    @EnvironmentObject private var store: SteppaStore
    let domain: TrainingDomain

    var body: some View {
        List {
            Section {
                VStack(alignment: .leading, spacing: 10) {
                    Text("\(store.domainProgress(domain))%")
                        .font(.largeTitle.bold())
                    Text("分类完成率根据所有子任务的 0-5 方块汇总计算")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
                .padding(.vertical, 4)
            }

            Section("子任务") {
                ForEach(domain.tasks) { task in
                    VStack(alignment: .leading, spacing: 10) {
                        Text(task.title)
                            .font(.body.weight(.medium))
                        EditableBlockProgress(task: task)
                    }
                    .padding(.vertical, 6)
                }
            }
        }
        .navigationTitle(domain.name)
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct OverviewView: View {
    @EnvironmentObject private var store: SteppaStore

    var body: some View {
        NavigationStack {
            List {
                Section {
                    VStack(alignment: .leading, spacing: 12) {
                        Text("\(store.overallProgress)%")
                            .font(.largeTitle.bold())
                        Text("总体进度")
                            .foregroundStyle(.secondary)
                        BlockProgressView(value: store.overallProgressBlocks, label: "")
                    }
                    .padding(.vertical, 8)
                }

                Section("各领域完成情况") {
                    ForEach(store.levels) { level in
                        DisclosureGroup(level.name) {
                            ForEach(level.domains) { domain in
                                NavigationLink {
                                    DomainDetailView(domain: domain)
                                } label: {
                                    DomainRow(domain: domain)
                                }
                            }
                        }
                    }
                }

                Section("当前缺失技能") {
                    ForEach(store.missingTasks) { task in
                        Text(task.title)
                    }
                }

                Section("最近进步项目") {
                    if store.recentTasks.isEmpty {
                        Text("暂无记录")
                            .foregroundStyle(.secondary)
                    } else {
                        ForEach(store.recentTasks) { task in
                            Text(task.title)
                        }
                    }
                }

                Section("下一步推荐") {
                    Text(store.recommendedTask?.title ?? "当前没有待推荐项目")
                }
            }
            .navigationTitle("进度总览")
        }
    }
}

struct DomainRow: View {
    @EnvironmentObject private var store: SteppaStore
    let domain: TrainingDomain

    var body: some View {
        HStack(spacing: 12) {
            VStack(alignment: .leading, spacing: 4) {
                Text(domain.name)
                    .font(.body.weight(.medium))
                Text("\(domain.tasks.count) 个子任务")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            }

            Spacer()

            Text("\(store.domainProgress(domain))%")
                .font(.subheadline.bold())
                .foregroundStyle(.teal)
        }
        .padding(.vertical, 4)
    }
}

struct EditableBlockProgress: View {
    @EnvironmentObject private var store: SteppaStore
    let task: TrainingTask

    var body: some View {
        HStack(spacing: 8) {
            ForEach(1...5, id: \.self) { value in
                Button {
                    let current = store.progress(for: task)
                    store.setProgress(value == current ? value - 1 : value, for: task)
                } label: {
                    RoundedRectangle(cornerRadius: 4)
                        .fill(value <= store.progress(for: task) ? Color.teal : Color.clear)
                        .overlay(
                            RoundedRectangle(cornerRadius: 4)
                                .stroke(Color.teal.opacity(0.6), lineWidth: 1)
                        )
                        .frame(width: 26, height: 26)
                }
                .buttonStyle(.plain)
                .accessibilityLabel("设置为 \(value)/5")
            }

            Text("\(store.progress(for: task))/5")
                .font(.footnote.bold())
                .foregroundStyle(.secondary)
                .padding(.leading, 4)
        }
    }
}

struct BlockProgressView: View {
    let value: Int
    let label: String

    var body: some View {
        HStack(spacing: 6) {
            ForEach(1...5, id: \.self) { index in
                RoundedRectangle(cornerRadius: 4)
                    .fill(index <= value ? Color.teal : Color.clear)
                    .overlay(
                        RoundedRectangle(cornerRadius: 4)
                            .stroke(Color.teal.opacity(0.6), lineWidth: 1)
                    )
                    .frame(width: 20, height: 20)
            }

            if !label.isEmpty {
                Text(label)
                    .font(.footnote.bold())
                    .foregroundStyle(.secondary)
            }
        }
    }
}

struct AvatarView: View {
    let name: String

    var body: some View {
        Text(String(name.first ?? "S"))
            .font(.title.bold())
            .foregroundStyle(.white)
            .frame(width: 64, height: 64)
            .background(Color.teal.gradient)
            .clipShape(RoundedRectangle(cornerRadius: 14))
    }
}

private extension SteppaStore {
    var overallProgressBlocks: Int {
        Int((Double(overallProgress) / 20.0).rounded())
    }
}

enum TrainingCatalog {
    static let levels: [TrainingLevel] = [
        TrainingLevel(
            id: 1,
            name: "Level 1",
            age: "0-18个月能力",
            domains: [
                domain("l1-mand", "请求 Mand", [
                    "用声音、手势或替代沟通表达需要",
                    "主动请求多个偏好物",
                    "在等待或中断时发起请求",
                    "向不同成人请求帮助或继续",
                    "在自然活动中稳定发起请求",
                ]),
                domain("l1-tact", "命名 Tact", [
                    "命名常见物品或人物",
                    "无回声提示命名日常物品",
                    "命名动作或显著特征",
                    "在实物和图片间迁移命名",
                    "自发命名环境中新奇事物",
                ]),
                domain("l1-listener", "听者反应 Listener", [
                    "听到名字后看向说话者",
                    "按简单指令完成身体动作",
                    "从少量物品中选择指定物",
                    "按指令接触身体部位",
                    "完成多种一步指令",
                ]),
                domain("l1-imitation", "动作模仿 Imitation", [
                    "模仿拍手或挥手",
                    "模仿物品相关动作",
                    "模仿面部或口部动作",
                    "模仿新动作",
                    "连续模仿动作序列",
                ]),
            ]
        ),
        TrainingLevel(
            id: 2,
            name: "Level 2",
            age: "18-30个月能力",
            domains: [
                domain("l2-mand", "请求 Mand", [
                    "请求缺失物品",
                    "请求帮助、休息和注意",
                    "用两词以上形式表达需要",
                    "跨人员和地点请求",
                    "扩展请求词库",
                ]),
                domain("l2-tact", "命名 Tact", [
                    "命名大量常见名词",
                    "命名动作、位置和属性",
                    "描述组合刺激",
                    "用短语描述物品或事件",
                    "自发描述日常变化",
                ]),
                domain("l2-lrffc", "LRFFC", [
                    "按功能选择物品",
                    "按特征选择物品",
                    "按类别选择物品",
                    "听辨功能、特征和类别",
                    "迁移到书本和自然环境",
                ]),
                domain("l2-social", "社交 Social", [
                    "参与平行游戏",
                    "轮流玩玩具",
                    "回应同伴发起",
                    "主动发起互动",
                    "维持短时合作游戏",
                ]),
            ]
        ),
        TrainingLevel(
            id: 3,
            name: "Level 3",
            age: "30-48个月能力",
            domains: [
                domain("l3-conversation", "对话 Intraverbal", [
                    "回答常见 WH 问题",
                    "围绕熟悉主题多轮问答",
                    "回答过去或未来事件",
                    "根据类别和功能进行联想",
                    "主动补充信息",
                ]),
                domain("l3-group", "集体 Group", [
                    "跟随小组多步指令",
                    "独立等待和轮流",
                    "跟随集体示范",
                    "完成课堂活动",
                    "参与学前课堂常规",
                ]),
                domain("l3-reading", "阅读 Reading", [
                    "识别环境文字",
                    "匹配或命名字母",
                    "理解翻页常规",
                    "识别简单词或名字",
                    "回答图书内容问题",
                ]),
                domain("l3-math", "数学 Math", [
                    "一一对应点数",
                    "识别基础数量",
                    "按数量拿取物品",
                    "排序和比较数字材料",
                    "完成早期数概念活动",
                ]),
            ]
        ),
    ]

    private static func domain(_ id: String, _ name: String, _ titles: [String]) -> TrainingDomain {
        TrainingDomain(
            id: id,
            name: name,
            tasks: titles.enumerated().map { index, title in
                TrainingTask(id: "\(id)-t\(index + 1)", title: title)
            }
        )
    }
}

#Preview {
    ContentView()
}
