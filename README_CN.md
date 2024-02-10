# Remote Log Server With Colorful Log

<div align=center> <img src="./assets/5672.jpg_wh300.jpg" /> </div>

------

[中文 README](README_CN.md) | [English README](README.md)

---

在VSCode中提供一个Socket TCP Server 端口，用于监听客户端的日志，并在输出通道中进行高亮显示；同时提供一个语言模式，提供对已有日志文件的高亮显示。

## 功能

该插件高亮基于 `｜`进行分割，单行日志中具有4个 `｜`符号，即可进行日志高亮。

日志一般具有时间、日志等级、行号、日志内容等信息，各个框架的默认格式输出都不同，但都可以通过自定义格式化输出。

`｜`在没有颜色高亮的文本中也具有良好的文本分割视觉效果，所以该插件使用 `｜`进行日志高亮，单行文本具有四个 `｜`，就会将文本切分为以下语义，从而进行高亮。

```tex
Definition:
time | other | level | fileno | msg

Example:
2024-02-03 22:59:47,945 || DEBUG    || this is DEBUG
2024-02-03 22:59:47,945 | client ip:127.0.0.1| ERROR    || this is ERROR
2024-02-03 22:59:47,945 || CRITICAL    | log.py:12 | this is CRITICAL
2024-02-03 22:59:47,945 | client ip:127.0.0.1| WARNING    | log.py:12 | this is WARNING
```

![image-20240210102215463](./assets/image-20240210102215463.png)

### Remote Log Server

1. 启动 `Remote Log Server`（点击下方状态栏的Remote Log Server：启动按钮）
2. 在输出通道中选中 `TCP Log Server Output`
3. 等待客户端链接并发送日志

![remoteLogServer](./assets/remoteLogServer.gif)

可以使用以下 `Python（Test Version：3.10.10）`代码进行测试

```python
#!/usr/bin/env python3
# coding=utf-8
import logging
import logging.handlers

class RemoteTCPServerLogHandler(logging.StreamHandler):
    """
    """
    def __init__(self, host, port=logging.handlers.DEFAULT_TCP_LOGGING_PORT):
        logging.StreamHandler.__init__(self)
        import socket
        self.client = socket.socket(socket.AF_INET,socket.SOCK_STREAM) 
        self.tcpServerAddr = (host, port) 
        self.client.connect(self.tcpServerAddr)  
        self.stream = self.client.makefile("wr")
        selfIP = self.client.getsockname()[0]
        self.formatter = logging.Formatter("%(asctime)s | " + f"Client IP:{selfIP} | " +"%(levelname)-8s |%(filename)s:%(lineno)-4d | %(message)s")

if __name__ == "__main__":
    import time
    logger = logging.getLogger('socket_logger')
    logger.addHandler(RemoteTCPServerLogHandler("127.0.0.1"))
    logger.setLevel(logging.DEBUG)
    # from loguru import logger
    while 1:
        time.sleep(0.5)
        logger.debug('This is a debug message')
        time.sleep(0.5)
        logger.info('This is an info message')
        time.sleep(0.5)
        logger.warning('This is a warning message')
        time.sleep(0.5)
        logger.error('This is an error message')
        time.sleep(0.5)
        logger.critical('This is a critical message')
```

### Colorful Log Mode

- 打开日志文件，选择语言模式为 `ColorfulLog`

![coforfulLog](./assets/coforfulLog.gif)

### 如何自定义颜色

在 `settings.json`中进行编辑

```json
    "editor.tokenColorCustomizations": {
        "textMateRules": [
            {
                "name": "ColorfulLog.log-time",
                "scope": "ColorfulLog.log-time",
                "settings": {
                    "fontStyle": "",
                    "foreground": "#a5cd70"
                }
            },
            {
                "name": "ColorfulLog.log-other-info",
                "scope": "ColorfulLog.log-other-info",
                "settings": {
                    "fontStyle": "",
                    "foreground": "#0aa344"
                }
            },
            {
                "name": "ColorfulLog.log-level.DEBUG",
                "scope": "ColorfulLog.log-level.DEBUG",
                "settings": {
                    "fontStyle": "bold",
                    "foreground": "#6fc1fa"
                }
            },
            {
                "name": "ColorfulLog.log-level.INFO",
                "scope": "ColorfulLog.log-level.INFO",
                "settings": {
                    "fontStyle": "bold",
                    "foreground": "#acb2be"
                }
            },
            {
                "name": "ColorfulLog.log-level.ERROR",
                "scope": "ColorfulLog.log-level.ERROR",
                "settings": {
                    "fontStyle": "bold",
                    "foreground": "#ed6c72"
                }
            },
            {
                "name": "ColorfulLog.log-level.WARNING",
                "scope": "ColorfulLog.log-level.WARNING",
                "settings": {
                    "fontStyle": "bold",
                    "foreground": "#e5a769"
                }
            },
            {
                "name": "ColorfulLog.log-level.CRITICAL",
                "scope": "ColorfulLog.log-level.CRITICAL",
                "settings": {
                    "fontStyle": "bold underline",
                    "foreground": "#cfe31b"
                }
            },
            {
                "name": "ColorfulLog.log-level.SUCCESS",
                "scope": "ColorfulLog.log-level.SUCCESS",
                "settings": {
                    "fontStyle": "bold",
                    "foreground": "#b1de82"
                }
            },
            {
                "name": "ColorfulLog.log-fileno",
                "scope": "ColorfulLog.log-fileno",
                "settings": {
                    "fontStyle": "",
                    "foreground": "#b0aecf"
                }
            }
        ]
    }
```

## 插件配置

在插件配置中搜索 `Remote Log Server With Colorful Log`

Remote Log Server With Colorful Log: Host为本地TCP服务器的Host地址

Remote Log Server With Colorful Log: Port为本地TCP服务器的Port端口号

## 更新日志

查看 `CHANGELOG` 标签以了解每个版本的更改。

## 报告问题

在 GitHub 的 [问题页面](https://github.com/JunJie-zhang-o/Remote-Log-Server-With-Colorful-Log/issues)上报告任何问题。请遵循模板并尽可能添加详细信息。

## 贡献

该扩展的源代码托管在 [GitHub](https://github.com/JunJie-zhang-o/Remote-Log-Server-With-Colorful-Log) 上。非常欢迎贡献、拉取请求、建议和错误报告。

* 请将任何问题和建议发布到 GitHub 的 [问题页面](https://github.com/JunJie-zhang-o/Remote-Log-Server-With-Colorful-Log/issues)。对于功能请求或建议，请添加 `feature request` 标签。
* 要贡献代码，请先 fork 项目，然后创建一个 pull 请求合并到主分支。如果你进行了显著的功能更改，请更新 README。
* 目前尚无官方的贡献指南或行为准则，但请遵循标准的开源规范，并在发表任何评论时保持尊重。

## 许可证

该项目使用 MIT 许可证授权 - 详细信息请参阅 [LICENSE](https://github.com/JunJie-zhang-o/Remote-Log-Server-With-Colorful-Log/blob/main/LICENSE) 文件。

## Enjoy！！！
