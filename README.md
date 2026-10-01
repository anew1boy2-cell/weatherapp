# 简洁天气 Web App

这是一个无需后端、打开浏览器即可运行的天气软件源码。

## 功能
- 城市搜索
- 当前温度、体感温度、湿度、风速
- 5天天气预报
- 响应式手机/电脑界面
- 中文天气描述和天气图标

## 数据来源
使用 Open-Meteo 的公开 API：
- https://open-meteo.com/

## 运行
最简单的方法：直接打开 `index.html`。

如果浏览器因跨域或本地文件限制无法请求 API，可以在项目目录运行：

```bash
python -m http.server 8000
```

然后访问：
http://localhost:8000

## 文件
- index.html：页面结构
- style.css：界面样式
- app.js：天气查询和业务逻辑
