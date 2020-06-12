const puppeteer = require('puppeteer')

const screenshotPage = async (url) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url)
  await page.screenshot({path: `screenshotPage/${Math.random()}.png`})
  await browser.close()
}

// screenshotPage('https://www.baidu.com')

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
    path: `screenshotPage/${Math.random()}.png`,
    fullPage: true
  })
  await browser.close()
}

// screenshotPageFullScreen('https://juejin.im/post/5d2ae42751882528cd105ab0')

const getElementBounding = async (page, element) => {
  try {
    const pos = await page.$eval(element, e => {
      console.log(e)
      const { left, top, width, height } = e.getBoundingClientRect()
      console.log(left, '-------')
      return { left, top, width, height }
    })
    return pos
  } catch (e) {
    console.log(e)
  }
}

// emm。。。 top值不是很准
const screenshotPageArea = async (url) => {
  const options = {
    headless: false,
    timeout: 0,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized', '--disable-infobars'],
    ignoreHTTPSErrors: true
  }
  const browser = await puppeteer.launch(options)
  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 1080});
  await page.goto(url, {
    waitUntil: ['networkidle2'],
    timeout: 20*1000
  })
  await page.evaluate(() => {
    return Promise.resolve(window.scrollTo(0, window.innerHeight))
  })
  const pos = await getElementBounding(page, '.post-text')

  await page.screenshot({
    path: `screenshotPage/t.png`,
    // 根据业务应用场景灵活运用
    clip: {
      x: pos.left,
      y: pos.top + 77,
      width: pos.width,
      height: pos.height
    }
  })
  console.log(pos)
  // await browser.close()
}

screenshotPageArea('https://stackoverrun.com/cn/q/13142025')
