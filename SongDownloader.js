// Requiring Puppeter From nodejs
const puppeteer = require("puppeteer");
// Taking input Form user
let input = process.argv;
let browser;

let SongName = "";
for (let i = 2; i < input.length; i++) {
    SongName = SongName + input[i];
}


let Youtubelink="https://www.youtube.com/";// You Tube link
let DownloaderLink="https://en.savefrom.net/1-youtube-video-downloader-5/";// SongDownloader Site Link
let cTab;

(async ()=>{
    try{
        let browserOpenPromise=puppeteer.launch({
            headless:false,
            defaultViewport:null,
            args:["--start-maximized"]
        });
         browser=await browserOpenPromise;
        let allTabs=await browser.pages();
        cTab=allTabs[0];
        let vdoUrl= await Twovideo(SongName);// Searching Song  Name on YouTube
        ///Got 2 links for a question
        console.log(vdoUrl);
        await Dvideo(vdoUrl[0]);//Downloading Top Two Videos From SaveFrom.net
        let alltabs=await browser.pages();
        if(alltabs.length>1){
            alltabs[1].close();
        }
        await Dvideo(vdoUrl[1]);
        
       
    }
    catch{
    }
}
)();

//Function that wiil Seacrh Song Name on You tube 

async function Twovideo(name)
{
    await cTab.goto(Youtubelink);
    await cTab.waitForSelector("input[id='search']");
    await cTab.type("input[id='search']",name,{delay:200});// Typing Song Name on Youtube
    await cTab.waitForTimeout(1000);
    await cTab.keyboard.press("Enter");
    await cTab.waitForSelector("a#video-title");
    let got=await cTab.evaluate(()=>{
        let Videoarr=[];    
        let allLinks=document.querySelectorAll("a#video-title");
        console.log(allLinks);
        Videoarr.push("https://www.youtube.com"+allLinks[0].getAttribute("href"));//Pushing Links of Top Two Videos in an array
        Videoarr.push("https://www.youtube.com"+allLinks[1].getAttribute("href"));
        return Videoarr;
    });
    return got;
}


// DownLoading video From Savefrom.next;
async function Dvideo(link)
{   
    await cTab.goto(DownloaderLink);
    await cTab.waitForSelector("#sf_url");
    await cTab.type("#sf_url",link,{delay:200});//putting link in search Box
    await cTab.keyboard.press("Enter");
    await cTab.waitForSelector(".link-box .def-btn-box");
    // await cTab.waitForTimeout(5000);
    await cTab.click(".link-box .def-btn-box");//click on Download Buttton
   
}