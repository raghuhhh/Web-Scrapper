const puppeteer = require("puppeteer")
const fs = require("fs/promises")
const xlsx = require("xlsx")


async function start() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto("https://learnwebcode.github.io/practice-requests/")

    //To take a single page browser size screenshot 
    await page.screenshot({ path: "Downloads/Screenshots/screenshot1.png" })

    //To take a full page screenshot i.e the entie page of the website
    await page.screenshot({ path: "Downloads/Screenshots/screenshot2.png", fullPage: true })

    //To extract any text from a site we use the class selectors to extract the
    // content from it and map the data to our required files not only in the .txt format we can also extract into .csv,xlsx,etc,....
    const names = await page.evaluate(() => {
        return Array.from(document.querySelectorAll(".a-link-normal")).map(x => x.textContent)
    })
    await fs.writeFile("Downloads/TextFiles/names.txt", names.join("\t"))


    //To extract any images from any site we need to include
    const photos=page.$$eval("img",imgs=>{
        return imgs.map(x=>x.src)
      })
      for(const photo of photos){
        const imagepage=await page.goto(photo)
        await fs.writeFile(photo.split("/").pop(),await imagepage.buffer())
      }


    await browser.close()
}
start()

