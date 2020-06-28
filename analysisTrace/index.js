const puppeteer = require('puppeteer')

const url = `https://www.blacklisten.cn`
const times = 5 // 检测次数
const record = []
const options = {
  headless: false,
  timeout: 0,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
  ignoreHTTPSErrors: true,
  executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
}

const initAnalysis = async () => {
  for (let i = 0; i < times; i++) {
    const browser = await puppeteer.launch(options)
    const page = await browser.newPage()
    await page.tracing.start({path: 'trace.json', screenshots: true})
    await page.goto(url, {
      waitUntil: "networkidle2"
    })
    await page.waitFor(1000)
  
    // 获取页面的 window.performance 属性
    const timing = JSON.parse(await page.evaluate(
      () => JSON.stringify(window.performance.timing)
    ))
    await page.tracing.stop()
    record.push(calculate(timing))
    await browser.close()
  }
  resultLog()
}

const calculate = (timing) => {
  const result = {}
  result.whiteScreenTime = timing.responseStart - timing.navigationStart // 白屏时间
  result.requestTime = timing.responseEnd - timing.responseStart // 请求时间

  return result
}

const resultLog = () => {
  let whiteScreenTime = 0, requestTime = 0
  record.forEach((item) => {
    whiteScreenTime += item.whiteScreenTime
    requestTime += item.requestTime
  })

  console.log(`请求地址：${url}`, `页面平均白屏时间：${whiteScreenTime/times}ms`, `页面平均响应时间：${requestTime/times}ms`)
}

initAnalysis()
