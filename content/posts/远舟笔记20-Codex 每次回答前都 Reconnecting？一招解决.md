---
title: Codex 每次回答前都 Reconnecting？一招解决
tags:
  - Codex
  - 命令行工具
  - 网络调试
  - 实用技巧
line: 🔵 工具实操线
date: 2026-06-25
---

>远舟笔记·第20篇

如果你用过 Codex（OpenAI 的命令行编程助手），大概率见过这个画面：

> Reconnecting (1/5)...
> Reconnecting (2/5)...
> ...
> Reconnecting (5/5)...
> （然后正常回答了）

以前我也觉得这是网络不稳定，或者服务器忙。直到今天看了源码分析才发现——完全不是这么回事。

---

## 现象：每次回答前先重连5次

Codex 新版本有个默认行为：回答之前，先尝试建立 WebSocket 连接。

WebSocket（简称 `wss://`）是一种长连接协议，适合需要持续双向通信的场景。而传统的 HTTPS 是短连接，每次请求独立。

Codex 的新版本默认优先走 WebSocket，但问题在于——你的网络环境（代理、VPN、公司防火墙）很可能不支持 WebSocket。

于是 Codex 开始重连。一次不行就两次，两次不行就五次。五次都不行，它才放弃，降级回普通的 HTTPS 连接，然后正常工作。

整个过程用户看到的就是：

> 卡住 → 重连提示 → 卡住 → 重连提示 → ... → 突然正常了

看起来像网络不好，其实只是**默认配置不适合你的网络环境**。

---

## 为什么：源码里的一个判断

这个问题在 Codex 的源码里很清晰。关键路径就一句话：

```
stream() 函数中检查 provider 的 supports_websockets 字段
  ├── 为 true → 走 WebSocket（然后重连失败）
  └── 为 false → 直接走 HTTPS（秒回）
```

WebSocket 到底用不用，只看一个字段——`supports_websockets`。默认是 true，所以 Codex 每次都先去尝试 WebSocket。

对于能直连 OpenAI 服务器的环境（比如海外用户），WebSocket 更快。但对于经过代理、VPN、公司网络的用户，WebSocket 连接大概率被阻断，就会触发重连机制。

---

## 怎么解决：一行配置

修复方案很简单，在 Codex 的配置文件里改一行。注意 TOML 格式有个规则——**同一个键不能出现两次**，否则是非法的。所以不能简单加一行，而是要把原有的 `model_provider` 替换掉：

找到原来这一行：

```toml
model_provider = "openai"
```

把它改成：

```toml
model_provider = "openai_http"

[model_providers.openai_http]
name = "OpenAI HTTP"
wire_api = "responses"
requires_openai_auth = true
supports_websockets = false
```

关键是 `supports_websockets = false`。加上之后，Codex 就不再尝试 WebSocket，直接走 HTTPS，完全绕开重连问题。

而且不影响功能——API 类型还是 Responses API，认证方式不变，只是传输协议从长连接改回短连接。实测体感几乎没有差别。

---

📚 **你可能还想读**

- [远舟笔记第19篇：Fable 5 被美国封禁后，我在本地跑了一个蒸馏版]（能力可以被封锁，知识很难被彻底隔绝）
- [远舟笔记第17篇：AI时代，键盘开始变成我的想法限速器]（当工具本身成为瓶颈，就该重新审视人机关系了）
