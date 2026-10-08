# Leo 表情包：Render 手动部署

这是独立 Node.js MCP 服务，读取本仓库公开的 stickers.json，提供表情目录和图片卡片。
此版本的 /mcp 是公开、只读、无登录接口。只返回公开表情，不接入账号或私有数据，不保存聊天内容。
Sites 原来的私有服务未修改。本版本不需要 Sites 发布凭据或 OpenAI API Key。

## Render

New → Web Service → Public Git Repository：

- Repository: https://github.com/Jae00214/leo-stickers
- Branch: main
- Root Directory: mcp
- Runtime: Node
- Build Command: npm install
- Start Command: npm start
- Health Check Path: /healthz
- Instance Type: Free（页面提供时可选；免费服务会休眠，唤醒可能较慢）

Deploy 后等服务显示 Live，复制 Render 提供的 HTTPS 域名，加 /mcp。
在 ChatGPT 的自定义 MCP 连接中填写地址，Authentication 选择 No authentication。
账号或工作区需提供自定义 MCP 功能；最终卡片显示需要在实际 ChatGPT 聊天里验证。

测试：“查看表情目录，然后给我发 vc-001 比心表情。”

## 维护

图片和标签仍在 stickers.json 中维护。服务每分钟读取一次新索引，上游暂时不可用时使用缓存或预置的八张表情。
工具优先按编号选图，query 支持简单情绪关键词。第三方图片的权利说明见仓库根 README。

## 本机验证

Node >=22.16；cd mcp 后运行 npm test，再 npm start。

