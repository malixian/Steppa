# Steppa iOS Client

This is a native SwiftUI iOS client for Steppa.

## UI Structure

- 档案
  - 查看儿童姓名、年龄、当前 Level
  - 编辑基础信息并保存到本机
  - 查看总体 5 格进度

- 训练
  - 选择 Level 1 / Level 2 / Level 3
  - 查看该 Level 下的能力分类
  - 进入分类后，对每个子任务点击 0-5 个方块记录完成度

- 总览
  - 查看总体进度
  - 按 Level 展开各领域完成情况
  - 点击领域查看子任务
  - 查看缺失技能、最近进步项目和下一步推荐

## Operation Tree

```text
打开 Steppa
  -> 档案
      -> 编辑姓名 / 年龄 / Level
      -> 保存到本机
  -> 训练
      -> 选择 Level
      -> 选择分类
      -> 查看子任务
      -> 点击 0-5 个方块
      -> 自动更新分类和总体进度
  -> 总览
      -> 查看整体进度
      -> 展开 Level
      -> 点击领域
      -> 查看该领域所有子任务
      -> 查看下一步推荐
```

## Run

Open `Steppa.xcodeproj` on macOS with Xcode, select a simulator or iPhone, then run.
