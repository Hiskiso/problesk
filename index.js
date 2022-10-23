let red = document.createElement("div")
let blue = document.createElement("div")
const isMobile = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

document.body.appendChild(red)
document.body.appendChild(blue)


document.body.style.margin = 0
if (isMobile) {
    document.body.style.display = "flex"
    document.body.style.flexDirection = "row"
    document.body.style.justifyContent = "flex-start"
}

document.body.style.background = "black"

red.style.height = isMobile ? "100vh" : "50vh"
red.style.width = isMobile ? "100vw" : "100vw"
red.style.background = "red"

blue.style.height = isMobile ? "100vh" : "50vh"
blue.style.width = isMobile ? "100vw" : "100vw"
blue.style.background = "blue"

let Mdelay = 50
let count = 2 
setInterval(async()=>{
    blue.style.background = ""
    

    for (let i = 0; i < count; i++) {
        await delay(Mdelay)
        red.style.background = "red"  
        await delay(Mdelay)
        red.style.background = ""
       
    }
    red.style.background = ""
    for (let i = 0; i < count; i++) {
        await delay(Mdelay)
        blue.style.background = "blue"  
        await delay(Mdelay)
        blue.style.background = ""
    }
  
   
}, ((Mdelay * 2) * (count + 1)) + ((Mdelay * 2) * (count + 1)))