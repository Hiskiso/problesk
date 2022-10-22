let red = document.createElement("div")
let blue = document.createElement("div")
const isMobile = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let modes = [[100, 100], [300, 300], [700,700], [100, 300]]
let mode = 0

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

let interval2 = setInterval(async()=>{
blue.style.background = ""
red.style.background = "red"
let redInt = setInterval(async()=>{
    red.style.background = ""
    await delay(10)
    red.style.background = "red"
},400)
await delay(400)
clearInterval(redInt)
blue.style.background = "blue"
red.style.background = ""
let blueInt = setInterval(async()=>{
    blue.style.background = ""
    await delay(10)
    blue.style.background = "blue"
},400)
await delay(400)
clearInterval(blueInt)
}, 800)

    red.addEventListener("click", ()=>{
        clearInterval(interval)

        mode += 1
        if(mode >= modes.length){
            mode = 0
        }
        console.log(modes[mode]) 
        interval = setInterval(async()=>{
        
            await delay(modes[mode][0])
            red.style.background = ""
            await delay(modes[mode][0])
            red.style.background = "red"
            await delay(modes[mode][1])
            blue.style.background = ""
            await delay(modes[mode][1])
            blue.style.background = "blue"
            }, (modes[mode][0]*2)+(modes[mode][1]*2))  
     })
        
   
