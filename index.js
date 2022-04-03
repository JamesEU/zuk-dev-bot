const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const axios = require('axios')
const { RobloxPlayer } = require("rbxapp")
const cheerio = require('cheerio');
const fs = require('fs')
const rbxlaunch = require("rbxlaunch")
const path = require('path')
let CurrentApprovedVersion = require('./version.json')
const Discord = require('discord.js');
let ProtectedServerStatus = {
    "TimeStarted": 0,
    "Attempts": 0,
}

var getpid = require('getpid');
let cookie = "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_5F7F278B355E482ED05AA4C01C01B04E05B5368586F11D5C777CBED4798087440752750BE7203235E81A3BE54D5DC9F7C4F829A89B59D2468DEE33B1136C2111E4868EAA47C710A6848E35064AD079D6C6CE4707E966B10C508030505DF9FF2F4CC936D5BDA8E34FD70633F9A98726887E27073FAE3324F212473DBCB5CB567EBCC01C0452DDC4C73B06AAA1DD2A86424814DD2DA1E48557D085A30EF82A09EDCEC3E317C38F9F6A63C646A88FC9C8E4662D8333296CB5C2B7F071A22CC660B1F845079BA5D9C95A5CFEEA1343360799A72B2F3F49A55FD1322C2E0644847311DAE7EA2D0356B899B8B9920E31033AC5A2C92052543473C447C6AB9C731F2E0EEAA23BADA90B631CA8352C983FF36A810A4D08E1AA21831865A18CDB3440E116FE3CCCB9DC7541D35244874CCECC35387BF44BAE85A9117FDF7C41AE4BD5E67BFEAA47CDE8F554D30FB9419FF124254CC89AC5EF"
let xsrfToken = 0;
const noblox = require("noblox.js")


const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

async function Init() {
    const currentUser = await noblox.setCookie(cookie)
    console.log(`Logged in as ${currentUser.UserName} [${currentUser.UserID}]`)
    xsrfToken = await noblox.getGeneralToken();
    ShutDownGames();
}

Init();

async function GetVersionNumberRoblox() {
    let Request = await axios.get("https://www.roblox.com/places/version-history-items?assetID=627321314&page=1&_=1648682609142", { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36', 'cookie': '.ROBLOSECURITY=_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_7EC4CC778BB4CF957DCA8D482BBB7DEA61322F132EB8FDC79E16F5452B39E09606A475AE198DDCE3AB6CDE671DBB1ECCC540ED52F22052EA8AD82C2169C225F440A765A5D41D5336DA9E0FE4766D116E660120BD9C62ECEA68D4092207CB5CE03E535A9FC5440A7FADA6C049E5D9C655CCDFE3E9ECFB9EE3BC95D7E16A70D92B830CEC400E9FC846CA8B373A3204A6EDA70CA02A434662C93A200D29CD1163D2BA4B1A6CF10966AA5441765B27F7B1E6B738A9254A3787275C5FF153A2DEFD34130FF405259CE6667B3F96FAC9D1A4683A4C0EECAD247055D3DB1DC1157AF90BF03FA93EBC732E215A2A4B0D690363A74757E65ED13C4F3D5E92386FC72DC2CDD3FEE6E1DBE5FE5F817A6D0A94FB6A53438F8848F53539F71674E0BFAC688FAD0223F72038F63643C6528DA5A3E5A1F89F9F0A83FB06EC4F10B515E7E03337CDF049F2022A6B556E714E474C6AFC99E446643A7C; .RBXID=_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIwZmQzNTk2NC01MjEwLTRhNDUtYWZmMi05NDhmODgwZWE4N2YiLCJzdWIiOjc5MDY1M30.oe4vJsK2hJRU9Pr6yV8PWCPPs-OHXN4pIrGWTj8QTVg; __RequestVerificationToken=Nputowx2B26EBIpnZ_jAnqdRnr6iKIZIszTClVsX2N_660HwpCMI4pTYzUPdhzOxQDWxz608JqkFcX49Mud8fv6UGGo1;' } });
    const $ = cheerio.load(Request.data);
    let rows = $('body > div.versionHistoryTableContainer > table').find("tr")
    console.log(`Checking for new version...`)
    for (var i = 0; i < rows.length; i++) {
        let row = rows[i];
        let cols = $(row).find("td");
        let VersionNumber = cols[0];
        let Created = cols[1]
        let PublishedCol = cols[2]
        let RevertVersion = cols[3]
        //console.log(`Version: ${$(VersionNumber).text()} Approved Version: ${CurrentApprovedVersion.version}, Revert ID: ${$(RevertVersion).find("span").attr('data-asset-version-id')}`)
        if ($(PublishedCol).find("span").length > 0) {
            console.log(`Published:  ${$(VersionNumber).text()}`)
            if ($(VersionNumber).text() !== CurrentApprovedVersion.version) {
                let Revert = axios.post('https://www.roblox.com/places/revert', { assetVersionID: CurrentApprovedVersion.assetVersion }, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36', 'cookie': cookie } })
                client.channels.cache.get("778283985235214378").send(`Version: ${$(VersionNumber).text()} Approved Version: ${CurrentApprovedVersion.version}, Revert ID: ${$(RevertVersion).find("span").attr('data-asset-version-id')}. This version was not approved by a Head Developer, or Founding Member. As a result this update has been automatically reverted, any progress has been lost.`)
            }
        }
    }
}

// async function LaunchRobloxSession() {
//     promise = new Promise((resolve, reject) => {
//         const rbxlaunch = require("rbxlaunch")
//         try {
//             await rbxlaunch.game({
//                 placeId: 627321314,
//                 cookie: "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_5F7F278B355E482ED05AA4C01C01B04E05B5368586F11D5C777CBED4798087440752750BE7203235E81A3BE54D5DC9F7C4F829A89B59D2468DEE33B1136C2111E4868EAA47C710A6848E35064AD079D6C6CE4707E966B10C508030505DF9FF2F4CC936D5BDA8E34FD70633F9A98726887E27073FAE3324F212473DBCB5CB567EBCC01C0452DDC4C73B06AAA1DD2A86424814DD2DA1E48557D085A30EF82A09EDCEC3E317C38F9F6A63C646A88FC9C8E4662D8333296CB5C2B7F071A22CC660B1F845079BA5D9C95A5CFEEA1343360799A72B2F3F49A55FD1322C2E0644847311DAE7EA2D0356B899B8B9920E31033AC5A2C92052543473C447C6AB9C731F2E0EEAA23BADA90B631CA8352C983FF36A810A4D08E1AA21831865A18CDB3440E116FE3CCCB9DC7541D35244874CCECC35387BF44BAE85A9117FDF7C41AE4BD5E67BFEAA47CDE8F554D30FB9419FF124254CC89AC5EF"
//             })
//             console.log("Successfully launched!")
//             return true
//         } catch (error) {
//             console.log(error)
//         }
//     })
//     return promise
// }


const sleep = ms => new Promise(r => setTimeout(r, ms));
var rp = require('request-promise');

async function PrivatizeGame() {
    try {
        const xsrfToken = await noblox.getGeneralToken();
        console.log(`XSRF-TOKEN: ${xsrfToken}`)
        var options = {
            'method': 'POST',
            'url': 'https://develop.roblox.com/v1/universes/258090298/deactivate',
            'headers': {
                'x-csrf-token': xsrfToken,
                'Cookie': '.RBXID=_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4N2I3NjNlYi02YzRlLTRiODgtYjk2NC00ZDNjMDcxMzYwY2QiLCJzdWIiOjc5MDY1M30.YNGDmLS4v_sCH20jeD35-qAnT0xi2lUf1fsFtEQMLhQ; .RBXIDCHECK=dfcaa970-3bd0-4324-ad41-cf464d3df942; .ROBLOSECURITY=_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_5F7F278B355E482ED05AA4C01C01B04E05B5368586F11D5C777CBED4798087440752750BE7203235E81A3BE54D5DC9F7C4F829A89B59D2468DEE33B1136C2111E4868EAA47C710A6848E35064AD079D6C6CE4707E966B10C508030505DF9FF2F4CC936D5BDA8E34FD70633F9A98726887E27073FAE3324F212473DBCB5CB567EBCC01C0452DDC4C73B06AAA1DD2A86424814DD2DA1E48557D085A30EF82A09EDCEC3E317C38F9F6A63C646A88FC9C8E4662D8333296CB5C2B7F071A22CC660B1F845079BA5D9C95A5CFEEA1343360799A72B2F3F49A55FD1322C2E0644847311DAE7EA2D0356B899B8B9920E31033AC5A2C92052543473C447C6AB9C731F2E0EEAA23BADA90B631CA8352C983FF36A810A4D08E1AA21831865A18CDB3440E116FE3CCCB9DC7541D35244874CCECC35387BF44BAE85A9117FDF7C41AE4BD5E67BFEAA47CDE8F554D30FB9419FF124254CC89AC5EF; GuestData=UserID=-264852427; RBXEventTrackerV2=CreateDate=2/15/2022 10:47:19 AM&rbxid=95810626&browserid=126564420920; RBXSessionTracker=sessionid=f12730ef-3ff7-4a84-87ce-6b9a410fbbb9; _vs=2146011694836773317:1645722615.7093155:5738379107656083806; rbx-ip2=; RBXcb=RBXViralAcquisition=false&RBXSource=false&GoogleAnalytics=false; __RequestVerificationToken=nKK3GRvulwaakHX1j3437E7xWOaXySRueoRSuTvV4B2phqLvHT7ARw84HfEtA10atreeJK0D56GtPf7ElAUHhAc23TE1'
            },
            formData: {
                'universeId': 258090298
            }
        };
        rp(options, function (error, response) {
            if (response.statusCode == 403) {
                console.log("403 Forbidden")
            }
            xsrfToken = response.headers['x-csrf-token']
        });
    } catch (error) {
        console.log(error)
    }
}

async function ShutDownGames() {
    try {
        console.log(`XSRF-TOKEN: ${xsrfToken}`)
        var options = {
            'method': 'POST',
            'url': 'https://www.roblox.com/games/shutdown-all-instances',
            'headers': {
                'x-csrf-token': xsrfToken,
                'Cookie': '.RBXID=_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4N2I3NjNlYi02YzRlLTRiODgtYjk2NC00ZDNjMDcxMzYwY2QiLCJzdWIiOjc5MDY1M30.YNGDmLS4v_sCH20jeD35-qAnT0xi2lUf1fsFtEQMLhQ; .RBXIDCHECK=dfcaa970-3bd0-4324-ad41-cf464d3df942; .ROBLOSECURITY=_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_5F7F278B355E482ED05AA4C01C01B04E05B5368586F11D5C777CBED4798087440752750BE7203235E81A3BE54D5DC9F7C4F829A89B59D2468DEE33B1136C2111E4868EAA47C710A6848E35064AD079D6C6CE4707E966B10C508030505DF9FF2F4CC936D5BDA8E34FD70633F9A98726887E27073FAE3324F212473DBCB5CB567EBCC01C0452DDC4C73B06AAA1DD2A86424814DD2DA1E48557D085A30EF82A09EDCEC3E317C38F9F6A63C646A88FC9C8E4662D8333296CB5C2B7F071A22CC660B1F845079BA5D9C95A5CFEEA1343360799A72B2F3F49A55FD1322C2E0644847311DAE7EA2D0356B899B8B9920E31033AC5A2C92052543473C447C6AB9C731F2E0EEAA23BADA90B631CA8352C983FF36A810A4D08E1AA21831865A18CDB3440E116FE3CCCB9DC7541D35244874CCECC35387BF44BAE85A9117FDF7C41AE4BD5E67BFEAA47CDE8F554D30FB9419FF124254CC89AC5EF; GuestData=UserID=-264852427; RBXEventTrackerV2=CreateDate=2/15/2022 10:47:19 AM&rbxid=95810626&browserid=126564420920; RBXSessionTracker=sessionid=f12730ef-3ff7-4a84-87ce-6b9a410fbbb9; _vs=2146011694836773317:1645722615.7093155:5738379107656083806; rbx-ip2=; RBXcb=RBXViralAcquisition=false&RBXSource=false&GoogleAnalytics=false; __RequestVerificationToken=nKK3GRvulwaakHX1j3437E7xWOaXySRueoRSuTvV4B2phqLvHT7ARw84HfEtA10atreeJK0D56GtPf7ElAUHhAc23TE1'
            },
            formData: {
                'placeId': '627321314',
                'replaceInstances': 'false'
            }
        };
        rp(options, function (error, response) {
            if (response.statusCode == 403) {
                console.log("403 Forbidden")
                console.log(response.headers)
                xsrfToken = response.headers['x-csrf-token']
                ShutDownGames();
            }
        });
    } catch (error) {
        console.log(error)
    }
}

processedLogFiles = {}

async function StartGame() {
    let Promise = new Promise(async (resolve, reject) => {
        let FoundFile = false;
        const robloxPlayer = new RobloxPlayer()
        const player = await robloxPlayer.locate(true)
        //let fetchXsrfToken = await rbxlaunch.fetchXsrfToken(cookie)
        //console.info(`Roblox is installed at: ${player.appdata}, ${fetchXsrfToken.split(";")[0]}`)
        //fetchXsrfToken = fetchXsrfToken.split(";")[0]
        try {
            await rbxlaunch.game({
                placeId: 627321314,
                cookie: cookie
            })
            let time = new Date();
            time = time.getTime()
            console.log("Successfully launched!", time)
            await sleep(5000)
            do {
                const logFilesDir = path.join(player.appdata, "logs")
                const logFiles = fs.readdirSync(logFilesDir)
                console.log('Searching for log file...')
                for (const logFile of logFiles) {
                    const fileCreatedTime = fs.statSync(path.join(logFilesDir, logFile)).birthtime
                    const now = new Date()
                    const timeDifference = now.getTime() - fileCreatedTime.getTime()
                    console.log(fileCreatedTime.getTime(), time, time - fileCreatedTime.getTime())
                    if ((time - fileCreatedTime.getTime()) < 2900) {
                        console.info(`Found log file: ${logFile}`)
                        var lineReader = require('readline').createInterface({
                            input: fs.createReadStream(path.join(logFilesDir, logFile))
                        });

                        lineReader.on('line', async function (line) {
                            if (line.includes('serverId:')) {
                                FoundFile = true;
                                line = line.replace('serverId:', '')
                                line = line.replace('|', ':')
                                line = line.substring(58, line.length)
                                line = line.split(':')
                                console.log(line[0])
                                let IpLookup = await axios.get(`http://ipinfo.io/${line[0]}/json`)
                                console.log(IpLookup.data.country)
                                if (IpLookup.data.country !== "NL") {
                                    console.log("Not in the netherlands!")
                                    // create embed 
                                    const embed = new Discord.MessageEmbed()
                                        .setTitle("Server Protected Starter")
                                        .setDescription("The server is not PROTECTED. Attempts: " + (ProtectedServerStatus.Attempts + 1) + " | IP: " + line[0])
                                        .setColor(0x00AE86)
                                        .setFooter("Server is not in the Netherlands!")
                                        .setTimestamp()
                                    client.channels.cache.get("937818692253802496").send({ embeds: [embed] })
                                    ProtectedServerStatus.Attempts = ProtectedServerStatus.Attempts + 1
                                    getpid('RobloxPlayerBeta.exe', function (err, pid) {
                                        if (err) {
                                            return handle_error(err);
                                        }
                                        if (Array.isArray(pid)) {
                                            pid.forEach(function (pid) {
                                                process.kill(pid);
                                            });
                                        } else {
                                            if (pid) {
                                                process.kill(pid);
                                            } else {
                                                console.log('PID not found');
                                            }
                                        }
                                    });
                                    ShutDownGames();
                                    StartGame();
                                } else {
                                    const embed = new Discord.MessageEmbed()
                                        .setTitle("Server Protected Starter")
                                        .setDescription("The server is PROTECTED. Attempts: " + (ProtectedServerStatus.Attempts + 1) + " | IP: " + line[0])
                                        .setColor(0x00AE86)
                                        .setFooter("Server is in the Netherlands!")
                                        .setTimestamp()
                                    client.channels.cache.get("937818692253802496").send({ embeds: [embed] }) 
                                    resolve('Server is in the Netherlands!')
                                }
                            }
                        });
                    }
                }
                await sleep(2000)
            }
            while (!FoundFile);
        } catch (error) {
            reject(error)
            console.log(error)
        }
    })
    return await Promise
}

StartGame();


client.login("OTU4ODUwMTE2Mjc2NjA0OTg4.YkTUwg.zjRdYcvtBG6MjbFnVWfpp1kRYv8")
const rest = new REST({ version: '9' }).setToken("OTU4ODUwMTE2Mjc2NjA0OTg4.YkTUwg.zjRdYcvtBG6MjbFnVWfpp1kRYv8");


const commands = [
    {
        name: 'startprotectedserver',
        description: 'Tries to start a protected server.',
    },
]


async function SyncCommands() {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands("958850116276604988"),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

SyncCommands();
