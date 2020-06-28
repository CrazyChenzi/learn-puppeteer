const puppeteer = require('puppeteer')

const url = `https://www.blacklisten.cn`
const options = {
  headless: true,
  timeout: 0,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
  ignoreHTTPSErrors: true,
  executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
}

const printPdf = async () => {
  const browser = await puppeteer.launch(options)
  const page = await browser.newPage()
  await page.goto(url, {
    waitUntil: "networkidle2"
  })
  await page.waitFor(1000)

  await page.pdf({path: 'page.pdf', printBackground: true})

  await browser.close()
}

printPdf()
