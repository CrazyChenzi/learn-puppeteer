const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'data.json')

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

const initVssue = async () => {
  const urlDatas = await readFile(filePath, '', 'json')
  
  const options = {
    headless: false,
    timeout: 0,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
    ignoreHTTPSErrors: true,
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  }

  const browser = await puppeteer.launch(options)
  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 900})

  urlDatas.forEach(({href}) => {
    
  })

  await page.waitFor(1000)

}


initVssue()
