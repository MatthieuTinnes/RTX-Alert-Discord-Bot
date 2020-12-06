require('dotenv').config()
var HTMLParser = require('node-html-parser');
const Discord = require('discord.js');
const fetch = require('node-fetch');

const client = new Discord.Client();
let leSpam = 0

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});
client.on('message', msg => {
    if(msg.content == "!rtx"){
        rtxToggle(msg);
    }
});

function rtxToggle(msg){
    if(leSpam != 0 ){
        console.log(`Désactivation du RTX :'(`);
        clearInterval(leSpam);
        leSpam  = 0;
    }else{
        console.log(`Activation du RTX !!!`);
        let leSpam = setInterval(() => {
            fetch(process.env.API_NVIDIA_ENDPOINT)
            .then(
                res => res.json()
            )
            .then(
                json => {
                    if(json.searchedProducts.featuredProduct.prdStatus != "out_of_stock"){
                        console.log("GO GO GO");
                        msg.channel.send(`RTX cards available now ! ${msg.author}`);
                        if(typeof(json.searchedProducts.featuredProduct.retailers[0]) != undefined)
                            msg.channel.send(json.searchedProducts.featuredProduct.retailers[0].purchaseLink);
                        clearInterval(leSpam);
                        leSpam  = 0;   
                    }else{
                        console.log("Pas en stock :'(");
                    }
                }  
            )
        },parseInt(process.env.CHECK_INTERVAL))
    }
}

client.login(process.env.DISCORD_TOKEN);