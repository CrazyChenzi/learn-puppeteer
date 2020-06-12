const puppeteer = require('puppeteer')

const screenshotPageFullScreen = async (url) => {
  const options = {
    headless: true,
    timeout: 0,
    args: ['--no-sanbox', '--disable-setuid-sandbox'],
    ignoreHTTPSErrors: true
  }

  const browser = await puppeteer.launch(options)
  const page = await browser.newPage()
  await page.goto(url, {
    waitUntil: ['networkidle2'],
    timeout: 20*1000
  })

  await page.evaluate(() => {
    return Promise.resolve(window.scrollTo(0, window.innerHeight))
  })

  await page.screenshot({
    path: `../screenshot/${Math.random()}.png`,
    fullPage: true
  })
  await browser.close()
}

screenshotPageFullScreen('https://juejin.im/post/5d2ae42751882528cd105ab0')