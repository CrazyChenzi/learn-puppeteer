const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'data.json')
const options = {
  headless: false,
  timeout: 0,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
  ignoreHTTPSErrors: true,
  executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
}

let browser,
    page

/**
 * 读取文件
 * @author blacklisten
 * @date 2020-06-16
 * @param {any} path
 * @param {any} options
 * @param {any} type
 * @returns {any}
 */
const readFile = (path, options, type) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, options || 'utf-8', (err, data) => {
      if (err) {
        reject(err)
      }
      if (type === 'json') {
        resolve(JSON.parse(data))
      }
    })
  })
}


/**
 * 获取href
 */
const getHref = async () => {
  const urlDatas = await readFile(filePath, '', 'json')
  function* makeRangeIterator() {
    for (let i = 0; i < urlDatas.length; i++) {
      yield urlDatas[i]
    }
  }

  const UrlIterator = makeRangeIterator()

  const getUrls = () => {
    let { href } = UrlIterator.next().value
    return href
  }
  initVssue(getUrls, true)
}

/**
 * 递归创建issues
 * @param {*} getUrls 获取next
 * @param {*} isFirst 是否为第一个序列
 */
const initVssue = async (getUrls, isFirst) => {
  try {
    const href = getUrls()
    if (!href) {
      return
    }
    await page.goto(href, {
      waitUntil: ['networkidle2'],
      timeout: 20*1000
    })
    await page.waitFor(2000)
    
    if (isFirst) {
      const searchInitBtn = page.$('#app > div.theme-container > div > div:nth-child(3) > div:nth-child(5) > main > div.comments-wrapper > div > div.vssue-body > div.vssue-new-comment > div.vssue-new-comment-footer > div > button')
      if (searchInitBtn) {
        await page.click('#app > div.theme-container > div > div:nth-child(3) > div:nth-child(5) > main > div.comments-wrapper > div > div.vssue-body > div.vssue-new-comment > div.vssue-new-comment-footer > div > button')
        await page.waitFor(5000)
      }
      
      const searchBtn = await page.$('#app > div.theme-container > div > div:nth-child(3) > div:nth-child(5) > main > div.comments-wrapper > div > div.vssue-body > div.vssue-status > p > a')
      if (searchBtn) {
        await page.click('#app > div.theme-container > div > div:nth-child(3) > div:nth-child(5) > main > div.comments-wrapper > div > div.vssue-body > div.vssue-status > p > a')
        await page.waitFor(1000)
      }
      initVssue(getUrls)
    } else {
      const searchBtn = await page.$('#app > div.theme-container > div > div:nth-child(3) > div:nth-child(5) > main > div.comments-wrapper > div > div.vssue-body > div.vssue-status > p > a')
      if (searchBtn) {
        await page.click('#app > div.theme-container > div > div:nth-child(3) > div:nth-child(5) > main > div.comments-wrapper > div > div.vssue-body > div.vssue-status > p > a')
        await page.waitFor(1000)
      }
      initVssue(getUrls)
    }
  } catch (error) {
    console.log(error)
    initVssue(getUrls)
  }
}

/**
 * 初始化Github登陆
 */
const loginGithub = async () => {
  browser = await puppeteer.launch(options)
  page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 900})

  await page.goto('https://github.com/login', {
    waitUntil: ['networkidle2'],
    timeout: 20*1000
  })
  await page.waitFor(1000)

  const resultLogin = page.evaluate(() => {
    document.querySelector('#login_field').value = '************************'
    document.querySelector('#password').value = '************************'
    document.querySelector('#login > form > div.auth-form-body.mt-3 > input.btn.btn-primary.btn-block').click()

    return 'success'
  })

  resultLogin.then(() => {
    setTimeout(() => {
      getHref()
    }, 1000)
  })
}

loginGithub()
