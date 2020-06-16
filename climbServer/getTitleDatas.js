const puppeteer = require('puppeteer')
const fs = require('fs')

const scrape = async () => {
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
  await page.goto('https://www.blacklisten.cn')
  await page.waitFor(1000)
  // window.scrollTo(0, document.body.scrollHeight)

  const result = await page.evaluate(async () => {
    debugger
    const resultDatas = []
    const jumps = []
    const jumpDatas = document.querySelectorAll('.pagation .pagation-list .jump')
    jumpDatas.forEach((jump) => {
      if (jump.style.display !== 'none' && !jump.className.includes('gobtn')) {
        jumps.push(jump)
      }
    })
    jumps.shift()
    if (jumps.length > 1) {
      jumps.pop()
    }
    
    function* makeRangeIterator() {
      for (let i = 0; i < jumps.length; i++) {
        yield jumps[i].click()
      }
    }

    const jumpIterator = makeRangeIterator()  
    const getTitleDatas = async () => {
      let titleDatas = []
      titleDatas = document.querySelectorAll('.abstract-wrapper .title a')
      titleDatas.forEach(async (item, index) => {
        let obj = {
          title: item.innerText || item.innerHTML,
          href: item.href
        }
        resultDatas.push(obj)
        if (index === titleDatas.length - 1 && index >= 9) {
          await jumpIterator.next()
          getTitleDatas()
        }
      })
    }
    getTitleDatas()

    return resultDatas
  })
  return result
}

scrape().then((value) => {
  fs.writeFile('./data.json', JSON.stringify(value), (err) => {
    if (err) {
      console.error(err)
    }
  })
  console.log(value)
})
