const puppeteer = require('puppeteer')

const screenshotPage = async (url) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url)
  await page.screenshot({path: `../screenshot/${Math.random()}.png`})
  await browser.close()
}

screenshotPage('https://www.baidu.com')
