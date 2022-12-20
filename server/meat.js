const log = require("./log.js").log;
const Ban = require("./ban.js");
const Utils = require("./utils.js");
const io = require('./app.js').io;
const settings = require("./json/settings.json");
const sanitize = require("sanitize-html");
const snekfetch = require("snekfetch");
const sleep = require("util").promisify(setTimeout);
const axios = require('axios').default;
const {Client, Intents} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');


var onCooldown = false;
var onloginCooldown = false;
var registerCool = false;
var registerCooldwn;
let roomsPublic = [];
let rooms = {};
let usersAll = [];
let sockets = [];
var ips = [];
var noflood = [];
let mutes = Ban.mutes;


var Filter = require('bad-words'),
    filter = new Filter();

// https://stackoverflow.com/questions/3144711/find-the-time-left-in-a-settimeout
function getTimeLeft(timeout) {
    return Math.ceil((timeout._idleStart + timeout._idleTimeout - Date.now()) / 1000);
}
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

exports.beat = function () {
    io.on("connection", function (socket) {
        if (socket.handshake.query.version == settings.version && socket.handshake.query.channel == settings.channel) {
            new User(socket);
        } else {
			return "Unauthorized!"
			throw "Unauthorized!"
		}
    });
};

var settingsSantize = {
    allowedTags: [
        "h3",
        "h4",
        "h5",
        "h6",
        "blockquote",
        "p",
        "a",
        "ul",
        "ol",
        "nl",
        "li",
        "b",
        "i",
        "strong",
        "em",
        "strike",
        "code",
        "hr",
        "br",
        "div",
        "table",
        "thead",
        "caption",
        "tbody",
        "tr",
        "th",
        "td",
        "pre",
        "iframe",
        "marquee",
        "button",
        "input",
        "details",
        "summary",
        "progress",
        "meter",
        "font",
        "h1",
        "h2",
        "span",
        "select",
        "option",
        "abbr",
        "acronym",
        "adress",
        "article",
        "aside",
        "bdi",
        "bdo",
        "big",
        "center",
        "site",
        "data",
        "datalist",
        "dl",
        "del",
        "dfn",
        "dialog",
        "dir",
        "dl",
        "dt",
        "fieldset",
        "figure",
        "figcaption",
        "header",
        "ins",
        "kbd",
        "legend",
        "mark",
        "nav",
        "optgroup",
        "form",
        "q",
        "rp",
        "rt",
        "ruby",
        "s",
        "sample",
        "section",
        "small",
        "sub",
        "sup",
        "template",
        "textarea",
        "tt",
        "u",
    ],
    allowedAttributes: {
        a: ["href", "name", "target"],
        p: ["align"],
        table: ["align", "border", "bgcolor", "cellpadding", "cellspadding", "frame", "rules", "width"],
        tbody: ["align", "valign"],
        tfoot: ["align", "valign"],
        td: ["align", "colspan", "headers", "nowrap"],
        th: ["align", "colspan", "headers", "nowrap"],
        textarea: ["cols", "dirname", "disabled", "placeholder", "maxlength", "readonly", "required", "rows", "wrap"],
        pre: ["width"],
        ol: ["compact", "reversed", "start", "type"],
        option: ["disabled"],
        optgroup: ["disabled", "label", "selected"],
        legend: ["align"],
        li: ["type", "value"],
        hr: ["align", "noshade", "size", "width"],
        fieldset: ["disabled"],
        dialog: ["open"],
        dir: ["compact"],
        bdo: ["dir"],
        marquee: ["behavior", "bgcolor", "direction", "width", "height", "loop", "scrollamount", "scrolldelay"],
        button: ["disabled"],
        input: ["value", "type", "disabled", "maxlength", "max", "min", "placeholder", "readonly", "required", "checked"],
        details: ["open"],
        div: ["align"],
        progress: ["value", "max"],
        meter: ["value", "max", "min", "optimum", "low", "high"],
        font: ["size", "family", "color"],
        select: ["disabled", "multiple", "require"],
        ul: ["type", "compact"],
        "*": ["hidden", "spellcheck", "title", "contenteditable", "data-style"],
    },
    selfClosing: ["img", "br", "hr", "area", "base", "basefont", "input", "link", "meta", "wbr"],
    allowedSchemes: ["http", "https", "ftp", "mailto", "data"],
    allowedSchemesByTag: {},
    allowedSchemesAppliedToAttributes: ["href", "src", "cite"],
    allowProtocolRelative: true,
};

// Code by ItzCrazyScout, CosmicStar98 and 'HOST'
// Private :)
const { Webhook, MessageBuilder } = require("discord-webhook-node");
const { join } = require("path");
const { post } = require("snekfetch");
const hook = new Webhook("https://discord.com/api/webhooks/1048334163939446834/MWt3Ow2RegyFJWvWpxB7-9IBCwvTuwvYhDaA18L21YI5YLKZBVO1fHd2AXQXBfqc69Fe");


var stickers = {
    sex: "the sex sticker has been removed",
    sad: "so sad",
    bonzi: "BonziBUDDY",
    host: "host is a bathbomb",
    spook: "ew im spooky",
    forehead: "you have a big forehead",
    ban: "i will ban you so hard right now",
    flatearth: "this is true, and you cant change my opinion loser",
    swag: "look at my swag",
    topjej: "toppest jej",
    cyan: "cyan is yellow",
    no: "fuck no",
    bye: "bye i'm fucking leaving",
    kiddie: "kiddie",
    big_bonzi: "you picked the wrong room id fool!",
    lol: "lol",
    flip: "fuck you",
    sans: "fuck you",
    crybaby: "crybaby",
};

function emojify(txt) {
	return txt.replace(/:(bonzi|evil|pink|earth|sad|clown|swag):/g, "<img src=\"/img/icons/emoji/$1.png\">")
}

function markup(text) {
	if (text.startsWith("++")) {
		return text.slice(2)
	}
	text = text.replace(/%%%%/g, "<br>")
	for (let i = 0; i < 50; i++) {
		text = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
		text = text.replace(/\*(.*?)\*/g, "<i>$1</i>")
		text = text.replace(/\~\~(.*?)\~\~/g, "<s>$1</s>")
		text = text.replace(/`(.*?)`/g, "<code>$1</code>")
		text = text.replace(/(<br>|^|{CON})>(.*?)(<br>|$|{END})/g, "$1<div data-style=\"quote\">{CON}$2{END}</div>{CON}")
		text = text.replace(/(<br>|^|{CON})#(.*?)(<br>|$|{END})/g, "$1<h3>{CON}$2{END}</h3>{CON}")
		text = text.replace(/''(.*?)\|\|(.*?)''/g, "<abbr title=\"$2\">$1</abbr>")
		text = text.replace(/(<br>|^|{CON})----(<br>|$|{END})/g, "<hr>{CON}")
	}
	text = text.replace(/{(CON|END)}/g, "")
	return text
}

var noflood = [];
const activeUsers = {};


function checkRoomEmpty(room) {
    if (room.users.length != 0) return;

    log.info.log('debug', 'removeRoom', {
        room: room
    });

    let publicIndex = roomsPublic.indexOf(room.rid);
    if (publicIndex != -1)
        roomsPublic.splice(publicIndex, 1);
    
    room.deconstruct();
    delete rooms[room.rid];
    delete room;
}

class Room {
    constructor(rid, prefs) {
        this.rid = rid;
        this.users = [];
		this.prefs = prefs;
		this.background = "#6d33a0";
    }
    deconstruct() {
        try {
            this.users.forEach((user) => {
                user.disconnect();
            });
        } catch (e) {
            log.info.log('warn', 'roomDeconstruct', {
                e: e,
                thisCtx: this
            });
        }
        //delete this.rid;
        //delete this.prefs;
        //delete this.users;
    }

    isFull() {
        return this.users.length >= this.prefs.room_max;
    }

    join(user) {
        noflood.push(user.socket);
        user.socket.join(this.rid);
        this.users.push(user);
        this.updateUser(user);
    }

    leave(user) {
        // HACK
        try {
            this.emit('leave', {
                 guid: user.guid
            });
     
            let userIndex = this.users.indexOf(user);
     
            if (userIndex == -1) return;
            this.users.splice(userIndex, 1);
     
            checkRoomEmpty(this);
        } catch(e) {
            log.info.log('warn', 'roomLeave', {
                e: e,
                thisCtx: this
            });
        }
    }

    updateUser(user) {
		this.emit('update', {
			guid: user.guid,
			userPublic: user.public
        });
    }

    getUsersPublic() {
        let usersPublic = {};
        this.users.forEach((user) => {
            usersPublic[user.guid] = user.public;
        });
        return usersPublic;
    }

    emit(cmd, data) {
		io.to(this.rid).emit(cmd, data);
    }
}

function newRoom(rid, prefs) {
    rooms[rid] = new Room(rid, prefs);
    log.info.log('debug', 'newRoom', {
        rid: rid
    });
}

let godword = Math.floor((Math.random() * 100000000000000000) + 10);
console.log('Godword:', godword)

setInterval(function() {
console.log('Godword:', godword)
}, 60 * 1000); 

let userCommands = {
    godmode: function (word) {
        let success = word == godword;
        if (success) {
            this.private.runlevel = 3;
            this.socket.emit("admin");
        } else {
            this.socket.emit("alert", 'Wrong password. Did you try "Password"?');
        }
        log.info.log("info", "godmode", {
            guid: this.guid,
            success: success,
        });
    },
    "sanitize": function() {
        let sanitizeTerms = ["false", "off", "disable", "disabled", "f", "no", "n"];
        let argsString = Utils.argsString(arguments);
        this.private.sanitize = !sanitizeTerms.includes(argsString.toLowerCase());
    },
    "joke": function() {
        this.room.emit("joke", {
            guid: this.guid,
            rng: Math.random()
        });
    },
    "fact": function() {
        this.room.emit("fact", {
            guid: this.guid,
            rng: Math.random()
        });
    },
	updates: function () {
		this.socket.emit('alert', { title: "Updates", msg: '<ul><li>Initial Release.\n', button:"Ok", sanitize: true });
	},
	markdown: function (data) {
		this.private.markup = !this.private.markup
		this.socket.emit('alert', { title: "Markup", msg: `Markup is now ${this.private.markup ? "on" : "off"}` })
	},
	effect: function (...txt) {
		if (txt[0] == "remove") txt = [""]
		this.public.effect = txt.join(" ")
	},
    sticker: function (sticker) {
        if (Object.keys(stickers).includes(sticker)) {
            this.room.emit("talk", {
                text: `<img src="img/icons/stickers/${sticker}.png" width=170>`,
                say: stickers[sticker],
                guid: this.guid,
            });
        } else {
            this.socket.emit('alert',{title:'Error 404',msg:'That sticker doesn\'t exist.',button:"Ok"});
        }
    },
    wtf: function (text) {
        var wtf = [
            "i cut a hole in my computer so i can fuck it",
            "i hate minorities",
            "i said /godmode password and it didnt work",
            "i like to imagine i have sex with my little pony characters",
            "ok yall are grounded grounded grounded grounded grounded grounded grounded grounded grounded for 64390863098630985 years go to ur room",
            "i like to eat dog crap off the ground",
            "i can use inspect element to change your name so i can bully you",
            "i can ban you, my dad is seamus",
            "why do woman reject me, i know i masturbate in public and dont shower but still",
            "put your dick in my nose and lets have nasal sex",
            "my cock is 6 ft so ladies please suck it",
            "please make pope free",
            "whats that color",
            "I got a question. but it's a serious, yes, serious thing that I have to say! AAAAAAAAAAA! I! am! not! made! by! Pixel works! Pixel works doesn't make microsoft agent videos! Kieran G&A Doesn't exist! Anymore! So, if you guys keep mocking me that i am made by Pixel works (Originally Aqua) or Kieran G&A, then i am gonna commit kill you! huff, puff, that is all.",
            "This PC cannot run Windows 11. The processor isn't supported for Windows 11. While this PC doesn't meet the system requirements, you'll keep getting Windows 10 Updates.",
            "I made Red Brain Productions, and i deny that i am made by Pixelworks",
            "100. Continue.",
            "418. I'm a teapot.",
            "I am SonicFan08 and i like Norbika9Entertainment and grounded videos! Wow! I also block people who call me a gotard!",
            "When BonziWORLD leaks your memory, your system will go AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "Bonkey sugar. Anything that makes one physically satisfied. By extension, anything good or desirable. The following are examples of things which are most certainly bonkey sugar...",
            "i like to harass bonziworld fans on bonziworld",
            "there is a fucking white bird in my chest please get him out",
            "i am that frog that is speaking chinese",
            "i don't let anyone have any fun like holy shit i hate bonziworld soooooooooo much!",
            "i make gore art out of dream as fucking usual",
            "yummy yummy two letter object in my tummy! yummy in my tummy! i pretend to be david and terrorize the fuck out of my friends!",
            "why the fuck are you hating Twitter?! what did they do to you?!",
            "seamus has a weird- NO YOU FUCKING DONT! YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY! [[ IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII",
            "This is not a test. You have been caught as a 'funny child harassment' moment. you will be banned. You got banned! Why? Being retarded? IDK. You literally harass BonziWORLD Fans. How dare you!",
            "fingerprinting on bonzi.world is giving out your location! real! not fake!",
            "how many fucking times have i told you? GIVE ME THE MARIO 64 BETA ROM NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW NOW!",
            "<p hidden> i have nothing to say </p>",
            "<script>alert('If you see this message, " + this.public.name + " used /wtf.');</script>",
            "Yeah, of course " + this.public.name + " wants me to use /wtf. [[???????????]] Hah hah! Look at the stupid " + this.public.color + " Microsoft Agent character embarassing himself! Fuck you. It isn't funny.",
            "I am getting fucking tired of you using this command. Fucking take a break already!",
            "<script></script>",
            "DeviantArt",
            "You're a [['fVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVkjng]] asshole!",
            ,
            "javascript",
            "BonziWORLD.exe has encountered and error and needs to close. Nah, seriously, you caused this error to happen because you used /wtf.",
            "moo!",
            "host bathbomb",
            "Hi.",
            "hiii i'm soundcard from mapper league",
            "I injected some soundcard syringes into your browser. <small>this is obviously fake</small>",
            '<img src="https://cdn.discordapp.com/emojis/854164241527209995.gif?v=1"></img>',
            "i listen to baby from justin bieber",
            "i watch numberblocks",
            "i watch doodland and now people are calling me a doodtard",
            "i watch bfdi and now people are calling me a objecttard",
            "i post klasky csupo effects and now people are calling me a logotard",
            "i inflate people, and body inflation is my fetish.",
            "i installed BonziBUDDY on my pc and now i have a virus",
            "i deleted system32",
            "i flood servers, and that makes me cool.",
            "I unironically do ERPs that has body inflation fetishism with people. Do you have a problem with that? YES! INFLATION FUCKING SUCKS YOU STUPID PERSON NAMED GERI!",
            "I unironically do ERPs that has body inflation fetishism with people. Do you have a problem with that? YES! INFLATION FUCKING SUCKS YOU STUPID PERSON NAMED BOWGART!",
            "I unironically do ERPs that has body inflation fetishism with people. Do you have a problem with that? YES! INFLATION FUCKING SUCKS YOU STUPID PERSON NAMED POM POM!",
            "I unironically do ERPs that has body inflation fetishism with people. Do you have a problem with that? YES! INFLATION FUCKING SUCKS YOU STUPID PERSON NAMED WHITTY!",
            "Hi. My name is DanielTR52 and i change my fucking mind every 1 picosecond. Also, ICS fucking sucks. Nope, now he doesnt. Now he does. Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.  Now he doesnt. Now he does.",
            "i still use the wii u&trade;",
            "i used homebrew on my nintendo switch and i got banned",
            "i bricked my wii",
            "muda muda muda muda!",
            'i am going to post inflation videos because, remember: "I inflate people and inflation is my fetish."',
            "i copy other people's usernames",
            "i use microsoft agent scripting helper for fighting videos against innocent people that did nothing wrong by just friendly commenting",
            "i use microsoft agent scripting helper for gotard videos",
            "i use hotswap for my xbox 360",
            "i boycotted left 4 dead 2",
            "CAN U PLZ UNBAN ME PLZ PLZ PLZ PLZ PLZ PLZ PLZ PLZ",
            "Hey, " + this.public.name + " You're a fucking asshole!",
            "Damn, " + this.public.name + " really likes /wtf",
            "I use an leaked build of Windows 11 on my computer.",
            "Do you know how much /wtf quotes are there?",
            "Fun Fact: You're a fucking asshole",
            "i watch body inflation videos on youtube",
            "ItzCrazyScout, No! More like.... ekfheiophjeodxenwobifuodhndoxnwsiohbdeiowdhn2werifhwefief! He banned euhdeioqwdheiwohjixzojqsioh r23oipwshnwq! End of rant.",
            "Pro Hacker: NEAGEUR! [[llllllllllllll]] NEAGEUR!",
            "i play left 4 dead games 24/7",
            "i am so cool. i shit on people, add reactions  that make fun of users on discord, and abuse my admin powers. i am really so cool.",
            "This product will not operate when connected to a device which makes unauthorized copies. Please refer to your instruction booklet for more information.",
            "hey medic i like doodland",
            "i installed windows xp on my real computer",
            "i am whistler and i like to say no u all the time",
            "HEY EVERYONE LOOK AT ME I USE NO U ALL THE TIME LMAO",
            "i like to give my viewers anxiety",
            "how to make a bonziworld server?",
            "shock, blood loss, infection; [['oU: hoUhoUhoUhoU]]! i love stabbing!",
            "I AM ANGRY BECAUSE I GOT BANNED! I WILL MAKE A MASH VIDEO OUT OF ME GETTING BANNED!",
            "oh you're approaching me!",
            "MUTED! HEY EVERYONE LOOK AT ME I SAY MUTED IN ALL CAPS WHEN I MUTE SOMEONE LMAO",
            "can you boost my server? no? you're mean!>:(",
            "no u",
            "",
            "numberblocks is my fetish",
            "#inflation big haram",
            "Sorry, i don't want you anymore.",
            "Twitter Cancel Culture! Twitter Cancel Culture! Twitter Cancel Culture! Twitter Cancel Culture! Twitter Cancel Culture!",
            "cry about it",
            "<p hidden>[[??????????????????????????????????????????????????????????????????????????????????????]] Hello? Is anyone there? Please help me!</p>",
            "SyntaxError: Unexpected string",
            "i post random gummibar videos on bonziworld",
            "i support meatballmars",
            "PLEASE GIVE THIS VIDEO LIKES!!!!! I CANNOT TAKE IT ANYMORE!",
            "I WILL MAKE A BAD VIDEO OUT OF YOU! GRRRRRRRRRRRR!",
            "Muted",
            "i keep watching doodland like forever now",
            "i mined diamonds with a wooden pickaxe",
            "i kept asking for admin and now i got muted",
            "I FAP TO FEMMEPYRO NO JOKE",
            "i like to imagine that i am getting so fat for no reason at all",
            "i am not kid",
            "i want mario beta rom hack now!",
            "i am a gamer girl yes not man no im not man i am gamer girl so give me money and ill giv you my adress <3",
        ];
        var num = Math.floor(Math.random() * wtf.length);
        this.room.emit("talk", {
            text: wtf[num],
            guid: this.guid,
        });
        this.room.emit("wtf", {
            text: wtf[num],
            guid: this.guid,
        });
    },
    "youtube": function(vidRaw) {
        var vid = this.private.sanitize ? sanitize(vidRaw) : vidRaw;
        this.room.emit("youtube", {
            guid: this.guid,
            vid: vid,
        });
    },
    "soundcloud": function(audRaw) {
        var aud = this.private.sanitize ? sanitize(audRaw) : audRaw;
        this.room.emit("soundcloud", {
            guid: this.guid,
            aud: aud,
        });
    },
    "swag": function () {
        this.room.emit("swag", {
            guid: this.guid,
        });
    },
    "earth": function () {
        this.room.emit("earth", {
            guid: this.guid,
        });
    },  
    "grin": function () {
        this.room.emit("grin", {
            guid: this.guid,
        });
    },
    "clap": function () {
            this.room.emit("clap", {
                guid: this.guid,
       });
    },
    "wave": function () {
        this.room.emit("wave", {
            guid: this.guid,
        });
    },
    "shrug": function () {
        this.room.emit("shrug", {
            guid: this.guid,
        });
    },
    "praise": function () {
        this.room.emit("praise", {
            guid: this.guid,
        });
    },
    "backflip": function(swag, praise, sad, think, shrug, wave, clap, grin, earth) {
        this.room.emit("backflip", {
            guid: this.guid,
            swag: swag == "swag",
			praise: praise == "praise",
			sad: sad == "sad",
			think: think == "think",
			shrug: shrug == "shrug",
			wave: wave == "wave",
			clap: clap == "clap",
			grin: grin == "grin",
			earth: earth == "earth"
        });
    },
    "sad": function() {
        this.room.emit("sad", {
            guid: this.guid,
        });
    },
    "think": function() {
        this.room.emit("think", {
            guid: this.guid,
        });
    },
    image: function (imgRaw) {
        var img = this.private.sanitize ? sanitize(imgRaw) : imgRaw;
        this.room.emit("image", {
            guid: this.guid,
            img: img,
        });
    }, 
    video: function (vidRaw) {
        var vid = this.private.sanitize ? sanitize(vidRaw) : vidRaw;
        this.room.emit("video", {
            guid: this.guid,
            vid: vid,
        });
    },
    audio: function (audRaw) {
        var aud = this.private.sanitize ? sanitize(audRaw) : audRaw;
        this.room.emit("audio", {
            guid: this.guid,
            aud: aud,
        });
    },
    toppestjej: function () {
        this.room.emit("talk", {
            text: `<div hidden style="display: none;">- </div><img src="/img/icons/bonzi/topjej.png">`,
            say: "toppest jej",
            guid: this.guid,
        });
    },
    kick: function (data) {
        if (this.private.runlevel < 3) {
            this.socket.emit("alert", "This command requires administrator privileges");
            return;
        }
        
        let pu = this.room.getUsersPublic()[data];
        if (pu && pu.color) {
            let target;
            this.room.users.map((n) => {
                if (n.guid == data) {
                    target = n;
                }
            });
            target.socket.emit("kick", {
                reason: "You got kicked.",
            });
            target.disconnect();
        } else {
            this.socket.emit("alert", "The user you are trying to kick left. Get dunked on nerd");
        }
    },
    nofuckoff: function (data) {
        if (this.private.runlevel < 3) {
            this.socket.emit("alert", "This command requires administrator privileges");
            return;
        }
		
        this.room.emit("nofuckoff", {
            guid: data,
        });
        var user = this;
        setTimeout(function () {
            let pu = user.room.getUsersPublic()[data];
            if (pu && pu.color) {
                let target;
                user.room.users.map((n) => {
                    if (n.guid == data) {
                        target = n;
                    }
                });
                setTimeout(function () {
                    target.disconnect();
                    target.socket.emit("kick", {
                        reason: "No fuck off<br><br><video style='border-radius: 3px;' src=\"https://cdn.discordapp.com/attachments/954050025170825237/1025126830845472798/DankVideo15.mp4\" autoplay loop width=380>",
						//reason: "No fuck off<br><audio style='display: none;' src=\"/sfx/no_fuck_off.mp3\" autoplay loop width=380>",
                    });
                }, 380);
            } else {
                user.socket.emit("alert", "The user you are trying to dissolve left. Get dunked on nerd");
            }
        }, 1084);
    },
    ban: function (data) {
        if (this.private.runlevel < 3) {
            this.socket.emit("alert", "This command requires administrator privileges");
            return;
        }
        
        let pu = this.room.getUsersPublic()[data];
        if (pu && pu.color) {
            let target;
            this.room.users.map((n) => {
                if (n.guid == data) {
                    target = n;
                }
            });
            if (target.getIp() == "::1") {
                Ban.removeBan(target.getIp());
            } else if (target.getIp() == "::ffff:127.0.0.1") {
                Ban.removeBan(target.getIp());
            } else {
                if (target.private.runlevel > 2 && this.getIp() != "::1" && this.getIp() != "::ffff:127.0.0.1") {
                    return;
                }
                Ban.addBan(target.getIp(), 24 * 3600, "You got banned.");
                target.socket.emit("ban", {
                    reason: data.reason,
                });
                target.disconnect();
            }
        } else {
            this.socket.emit("alert", "The user you are trying to ban left. Get dunked on nerd");
        }
    },
	"unban": function(ip) {
        if (this.private.runlevel < 3) {
            this.socket.emit("alert", "This command requires administrator privileges");
            return;
        }
		Ban.removeBan(ip)
		console.log('unbanned ' + ip);
    },
	"warn": function(ip, reason) {
        if (this.private.runlevel < 3) {
            this.socket.emit("alert", "This command requires administrator privileges");
            return;
        }
		Ban.warn(ip, reason)
		console.log('warning to ' + ip + ' ' + reason);
    },
    send_invite: function () {
        // kinda did it
        this.room.emit("talk", {
            text: "The Discord Invite: https://discord.gg/zpnXyrDYmm",
            say: "- bob",
            guid: this.guid,
        });
    },
    godlevel: function () {
        this.socket.emit("alert", "Your godlevel is " + this.private.runlevel + ".");
    },
	behh: function () {
		this.room.emit("talk", {
			text: "Behh is the worst message! \
        It's horrendous and spammy. I hate it. \
        The point of messages are to show thoughts, but what thought does this show? \
        Do you just wake up in the morning and think \"wow, I really feel like a massive fucking behh today\"? \
        It's useless. I hate it. It just provokes a deep rooted anger within me whenever I hear it. \
        I want to drive on over to fucking onutes house and kill him. If this was a skin I'd push it off a fucking cliff. \
        People just say behh as if it's funny. It's not. Behh deserves to die. \
        It deserves to have his smug little sound smashed in with a hammer. \
        Oh wow, it's a nonsense, how fucking hilarious, I'll use it in every message I post. NO. STOP IT. It deserves to burn in hell. \
        Why is it so goddamn dumb. You're a 4 letter work, you have no life goals, you will never accomplish anything in life apart from pissing me off. \
        When you die nobody will mourn. I hope you die",
			guid: this.guid
		})
	},
    "linux": "passthrough",
    "pawn": "passthrough",
    "bees": "passthrough",
    "color": function(color) {
        if (typeof color != "undefined") {
            if (settings.bonziColors.indexOf(color) == -1) return;
            
            this.public.color = color;
        } else {
            this.public.color = settings.bonziColors[
                Math.floor(Math.random() * settings.bonziColors.length)
            ];
        }

        this.room.updateUser(this);
    },
	voice: function (color) {
        this.public.voice = color;
        this.room.updateUser(this);
    },
    "char": function (color) {
        
        if (typeof color != "undefined") {
            if (settings.bonziChars.indexOf(color) == -1) return;

            this.public.color = color;
        } else {
            this.public.color = settings.bonziChars[
                Math.floor(Math.random() * settings.bonziChars.length)
            ];
        }

        this.room.updateUser(this);
    },
	pope: function() {
		if (this.private.runlevel === 3) { // removing this will cause chaos
			this.public.color = "pope";
			this.room.updateUser(this);
		} else {
			this.socket.emit("alert", "Ah ah ah! You didn't say the magic word!")
		}
    },
    god: function () {
        if (this.private.runlevel === 3) { // removing this will cause chaos
            this.public.color = "god";
            this.room.updateUser(this);
        } else {
            this.socket.emit("alert", "Ah ah ah! You didn't say the magic word!");
        }
    },
    "asshole": function() {
        this.room.emit("asshole", {
            guid: this.guid,
            target: sanitize(Utils.argsString(arguments))
        });
    },
    "owo": function() {
        this.room.emit("owo", {
            guid: this.guid,
            target: sanitize(Utils.argsString(arguments))
        });
    },
    "uwu": function () {
        this.room.emit("uwu", {
            guid: this.guid,
            target: sanitize(Utils.argsString(arguments)),
        });
    },
    "welcome": function () {
        this.room.emit("welcome", {
            guid: this.guid,
            target: sanitize(Utils.argsString(arguments)),
        });
    },
    "kiddie": function () {
        this.room.emit("kiddie", {
            guid: this.guid,
            target: sanitize(Utils.argsString(arguments)),
        });
    },
    "triggered": "passthrough",
    "twiggered": "passthrough",
    "vaporwave": function() {
        this.socket.emit("vaporwave");
        this.room.emit("youtube", {
            guid: this.guid,
            vid: "5BZLz21ZS_Y"
        });
    },
    "unvaporwave": function() {
        this.socket.emit("unvaporwave");
    },
    "name": function() {
        let argsString = Utils.argsString(arguments);
        if (argsString.length > this.room.prefs.name_limit)
            return;
        if (argsString.includes("{COLOR}")) {
            argsString = this.public.color;
        }
        if (argsString.includes("{NAME}")) {
            return;
        }
        let name = argsString || this.room.prefs.defaultName;
        this.public.name = this.private.sanitize ? sanitize(name) : name;
        this.room.updateUser(this);
		
        if (this.public.name.match(/Cosmic/gi) && this.private.runlevel < 3) {
            this.public.name = "Impersonator";
        }
        if (this.public.name.includes(/Cosmic/gi) && this.private.runlevel < 3) {
            this.public.name = "Impersonator";
        }
        if (this.public.name.match(/BonziPOPE/gi) && this.private.runlevel < 3) {
            this.public.name = "Impersonator";
        }
        if (this.public.name.match(/Seamus/gi) && this.private.runlevel < 3) {
            this.public.name = "Impersonator";
        }
        if (this.public.name.includes(/Seamus/gi) && this.private.runlevel < 3) {
            this.public.name = "Impersonator";
        }
        if (this.public.name.match(/Jy/gi) && this.private.runlevel < 3) {
            this.public.name = "Impersonator";
        }
        if (this.public.name.match(/itzcrazyscout/gi) && this.private.runlevel < 3) {
            this.public.name = "Impersonator";
        }
        if (this.public.name.match(/ics/gi) && this.private.runlevel < 3) {
            this.public.name = "Impersonator";
        }
        if (this.public.name.match(/itzultrascout/gi) && this.private.runlevel < 3) {
            this.public.name = "Impersonator";
        }
        if (this.public.name.match(/ius/gi) && this.private.runlevel < 3) {
            this.public.name = "Impersonator";
        }
        if (this.public.name.includes(/🔨/i) && this.private.runlevel < 3) {
            this.public.name = "Fake Admin";
        }
        if (this.public.name.includes(/admin/i) && this.private.runlevel < 3) {
            this.public.name = "Fake Admin";
        }
        if (this.public.name.includes(/pope/i) && this.private.runlevel < 3) {
            this.public.name = "Fake Admin";
        }
        if (this.public.name.includes(/Fune/i) || this.public.name.includes(/fune/i) || this.public.name.includes(/SLAV/i) || this.public.name.includes(/Slav/i) || this.public.name.includes(/slav/i)) {
            this.public.name = "Edgy Faggot";
        }
        if (this.public.name.includes(/Diogo/i) || this.public.name.includes(/diogo/i) || this.public.name.includes(/Doggis/i) || this.public.name.includes(/doggis/i)) {
            this.public.name = "DOGGIS!";
        }
    },
    "status": function() {
        let argsString = Utils.argsString(arguments);
        if (argsString.length > this.room.prefs.status_limit)
            return;
          
        let status = argsString;
        this.public.status = this.private.sanitize ? sanitize(status) : status;
        this.room.updateUser(this);
        if (this.public.status.match(/Cosmic/gi) && this.private.runlevel < 3) {
            this.public.status = "Impersonator";
        }
        if (this.public.status.includes(/Cosmic/gi) && this.private.runlevel < 3) {
            this.public.status = "Impersonator";
        }
        if (this.public.status.match(/BonziPOPE/gi) && this.private.runlevel < 3) {
            this.public.status = "Impersonator";
        }
        if (this.public.status.match(/Seamus/gi) && this.private.runlevel < 3) {
            this.public.status = "Impersonator";
        }
        if (this.public.status.includes(/Seamus/gi) && this.private.runlevel < 3) {
            this.public.status = "Impersonator";
        }
        if (this.public.status.match(/Jy/gi) && this.private.runlevel < 3) {
            this.public.status = "Impersonator";
        }
        if (this.public.status.match(/itzcrazyscout/gi) && this.private.runlevel < 3) {
            this.public.status = "Impersonator";
        }
        if (this.public.status.match(/ics/gi) && this.private.runlevel < 3) {
            this.public.status = "Impersonator";
        }
        if (this.public.status.match(/itzultrascout/gi) && this.private.runlevel < 3) {
            this.public.status = "Impersonator";
        }
        if (this.public.status.match(/ius/gi) && this.private.runlevel < 3) {
            this.public.status = "Impersonator";
        }
        if (this.public.status.includes(/🔨/i) && this.private.runlevel < 3) {
            this.public.status = "Fake Admin";
        }
        if (this.public.status.includes(/admin/i) && this.private.runlevel < 3) {
            this.public.status = "Fake Admin";
        }
        if (this.public.status.includes(/Administrator/i) && this.private.runlevel < 3) {
            this.public.status = "Fake Admin";
        }
        if (this.public.status.includes(/pope/i) && this.private.runlevel < 3) {
            this.public.status = "Fake Admin";
        }
    },
    broadcast: function (...text) {
        if (this.private.runlevel < 3) {
            this.socket.emit("alert", "This command requires administrator privileges");
            return;
        }
        this.room.emit("broadcast", { msg: text.join(' '), sanitize: false, title: "Broadcast from " + this.public.name });
    },
    dvdbounce: function (status) {
        if (this.private.runlevel < 3) {
            this.socket.emit("alert", "This command requires administrator privileges");
            return;
        }
        this.room.emit("dvdbounce", {
            guid: this.guid,
            status: status,
        });
        if (status == "on") {
            this.public._extras = {
                dvd: true,
                dvdTick: true,
            };
            this.room.updateUser(this);
        }
        if (status == "off") {
            this.public._extras = {};
            this.room.updateUser(this);
        }
    },
    setguid: function (data) {
        this.guid = data;
    },
    getguid: function () {
		this.socket.emit("alert", "Your GUID is: " + this.guid + "");
    },
    limit: function (room_num) {
        if (this.private.runlevel < 3) {
            this.socket.emit("alert", "This command requires administrator privileges");
            return;
        }
        room_num = parseInt(room_num);

        if (isNaN(room_num)) {
            this.socket.emit("alert", "Ur drunk lel");
            return;
        }

        this.prefs.room_max = room_num;

        this.room.emit("alert", "The max limit of this room is now " + this.prefs.room_max);
    },
    "pitch": function(pitch) {
        pitch = parseInt(pitch);

        if (isNaN(pitch)) return;

        this.public.pitch = Math.max(
            Math.min(
                parseInt(pitch),
                this.room.prefs.pitch.max
            ),
            this.room.prefs.pitch.min
        );

        this.room.updateUser(this);
    },
    "speed": function(speed) {
        speed = parseInt(speed);

        if (isNaN(speed)) return;

        this.public.speed = Math.max(
            Math.min(
                parseInt(speed),
                this.room.prefs.speed.max
            ),
            this.room.prefs.speed.min
        );
        
        this.room.updateUser(this);
    },
	"group": function (...text) {
		text = text.join(" ")
		if (text) {
			this.private.group = text + ""
			this.socket.emit("alert", "joined the group")
			return
		}
		this.socket.emit("alert", "enter a group id")
	},
	startyping: function () {
		this.room.emit("typing", { guid: this.guid })
	},
	stoptyping: function () {
		this.room.emit("stoptyping", { guid: this.guid })
	},
    "dm":function(...text){
        text = text.join(" ")
        text = sanitize(text,settingsSantize)
        if(!this.private.group){
            this.socket.emit("alert","join a group first")
            return
        }
        this.room.users.map(n=>{
            if(this.private.group === n.private.group){
                n.socket.emit("talk",{
                    guid:this.guid,
                    text:"<small><i>Only your group can see this.</i></small><br>"+text,
                    say:text
                })
            }
        })
    },
	"dm2": function (data) {
		if (typeof data != "object") return
		let pu = this.room.getUsersPublic()[data.target]
		if (pu && pu.color) {
			let target;
			this.room.users.map(n => {
				if (n.guid == data.target) {
					target = n;
				}
			})
			data.text = sanitize(data.text, settingsSantize)
			target.socket.emit("talk", {
				guid: this.guid,
				text: "<small>Only you can see this.</small><br>" + data.text,
				say: data.text
			})
			this.socket.emit("talk", {
				guid: this.guid,
				text: "<small>Only " + pu.name + " can see this.</small><br>" + data.text,
				say: data.text
			})
		} else {
			this.socket.emit('alert', { msg: 'The user you are trying to dm left. Get dunked on nerd', button: "oh fuck" })
		}
	}
};

class User {
    constructor(socket) {
        this.guid = Utils.guidGen();
        this.socket = socket;

        // Handle ban
	    if (Ban.isBanned(this.getIp())) {
            Ban.handleBan(this.socket);
        }
		
		this.ratelimitlevel = 0;
        this.private = {
            login: false,
            sanitize: true,
            runlevel: 0
        };

        this.public = {
            color: settings.bonziColors[Math.floor(
                Math.random() * settings.bonziColors.length
            )]
        };

        log.access.log('info', 'connect', {
            guid: this.guid,
            ip: this.getIp()
        });
        // fuck you cosmic jk
        if (this.getIp() == "::1" || this.getIp() == "::ffff:127.0.0.1" || this.getIp() == "72.23.139.58" || this.getIp() == "91.137.28.200") {
            this.private.runlevel = 3;
            this.socket.emit("admin");
            this.private.sanitize = false;
        }
       this.socket.on('login', this.login.bind(this));
    }

    getIp() {
        return this.socket.request.connection.remoteAddress;
    }

    getPort() {
        return this.socket.handshake.address.port;
    }

    login(data) {
        if (typeof data != 'object') return; // Crash fix (issue #9)
        
        if (this.private.login) return;

		log.info.log('info', 'login', {
			guid: this.guid,
        });
        
        let rid = data.room;
        
		// Check if room was explicitly specified
		var roomSpecified = true;

		// If not, set room to public

        if (typeof rid == "undefined" || rid === "" || rid.startsWith("20")) {
            if (rid.startsWith("20")) {
                this.socket.emit("loginFail", {
                    reason: "nameMal",
                });
            }
			rid = roomsPublic[Math.max(roomsPublic.length - 1, 0)];
			roomSpecified = false;
        }
		log.info.log('debug', 'roomSpecified', {
			guid: this.guid,
			roomSpecified: roomSpecified
        });
        
		// If private room
		if (roomSpecified) {
            if (sanitize(rid) != rid) {
                this.socket.emit("loginFail", {
                    reason: "nameMal"
                });
                return;
            }

			// If room does not yet exist
			if (typeof rooms[rid] == "undefined") {
				// Clone default settings
				var tmpPrefs = JSON.parse(JSON.stringify(settings.prefs.private));
				// Set owner
				tmpPrefs.owner = this.guid;
                newRoom(rid, tmpPrefs);
			}
			// If room is full, fail login
			else if (rooms[rid].isFull()) {
				log.info.log('debug', 'loginFail', {
					guid: this.guid,
					reason: "full"
				});
				return this.socket.emit("loginFail", {
					reason: "full"
				});
			}
		// If public room
		} else {
			// If room does not exist or is full, create new room
			if ((typeof rooms[rid] == "undefined") || rooms[rid].isFull()) {
				rid = Utils.guidGen();
				roomsPublic.push(rid);
				// Create room
				newRoom(rid, settings.prefs.public);
			}
        }
        
        this.room = rooms[rid];

        // Check name
		this.public.name = sanitize(data.name) || this.room.prefs.defaultName;
           if (data.name.includes("flood") || data.name.includes("fl00d") || data.name.includes("raid")) {
                log.info.log("debug", "loginFail", {
                    guid: this.guid,
                    reason: "nameMal",
                });
                this.socket.emit("loginFail", {
                    reason: "nameMal",
                });
                return;
            }
            if (data.name.includes("Fuck Cosmic")) {
                log.info.log("debug", "loginFail", {
                    guid: this.guid,
                    reason: "nameMal",
                });
                return this.socket.emit("loginFail", {
                    reason: "nameMal",
                });
            }
            if (data.name.includes("Diogo") || data.name.includes("diogo") || data.name.includes("Doggis") || data.name.includes("doggis")) {
                log.info.log("debug", "loginFail", {
                    guid: this.guid,
                    reason: "nameMal",
                });
                return this.socket.emit("loginFail", {
                    reason: "nameMal",
                });
            } // :trollface:
            if (data.name.includes("Fune") || data.name.includes("fune") || data.name.includes("SLAV") || data.name.includes("slav")) {
                log.info.log("debug", "loginFail", {
                    guid: this.guid,
                    reason: "nameMal",
                });
                return this.socket.emit("loginFail", {
                    reason: "nameMal",
                });
            } // :trollface:
            if (data.name.includes("Bonzi.ga") || data.name.includes("bonzi.ga")) {
                log.info.log("debug", "loginFail", {
                    guid: this.guid,
                    reason: "nameMal",
                });
                return this.socket.emit("loginFail", {
                    reason: "nameMal",
                });
            } // :trollface:
			
		if (this.public.name.length > this.room.prefs.name_limit)
			return this.socket.emit("loginFail", {
				reason: "nameLength"
			});
        
		if (this.room.prefs.speed.default == "random")
			this.public.speed = Utils.randomRangeInt(
				this.room.prefs.speed.min,
				this.room.prefs.speed.max
			);
		else this.public.speed = this.room.prefs.speed.default;

		if (this.room.prefs.pitch.default == "random")
			this.public.pitch = Utils.randomRangeInt(
				this.room.prefs.pitch.min,
				this.room.prefs.pitch.max
			);
		else this.public.pitch = this.room.prefs.pitch.default;
        this.public.voice = "espeak";
        let count = 0;
        for (const i in rooms) {
            const room = rooms[i];
            for (let u in room.users) {
                const user = room.users[u];
                if (user.getIp() == this.getIp()) {
                    count++;
                }
            }
        }

		// i will always find ways to fix things (originally)
        // all though it's mostly just server.erik.red code (thx bathbomb)
        if (count > 2 && (this.getIp() != "::1" && this.getIp() != "72.23.139.58")) {
            this.socket.emit("loginFail", {
                reason: "TooMany",
            });
            return;
        }
		
        // Join room
		this.room.join(this);

        this.private.login = true;
		this.ratelimitlevel = 0;
        this.socket.removeAllListeners("login");

		// Send all user info
		this.socket.emit('updateAll', {
			usersPublic: this.room.getUsersPublic()
		});

		// Send room info
		this.socket.emit('room', {
			room: rid,
			isOwner: this.room.prefs.owner == this.guid,
			isPublic: roomsPublic.indexOf(rid) != -1
		});

        this.socket.on('talk', this.talk.bind(this));
        this.socket.on('command', this.command.bind(this));
        this.socket.on('disconnect', this.disconnect.bind(this));
    }
	
    talk(data) {
        if (typeof data != 'object') { // Crash fix (issue #9)
            data = {
                text: "HEY EVERYONE LOOK AT ME I'M TRYING TO SCREW WITH THE SERVER LMAO"
            };
        }
        if (this.ratelimitlevel >= 100) {
            this.socket.emit("ratelimit");        
            Ban.mute(this.getIp(), 356, "You are currently rate limited. Please try again later.");
            this.ratelimitlevel = 0; 
        } else {
            this.ratelimitlevel = this.ratelimitlevel + 15;
            setTimeout(function(){
                this.ratelimitlevel = this.ratelimitlevel - 15;
            },1000)
        }
        if (data.text.match(/>addadmin/i)) {
            data = {
                text: "HEY EVERYONE LOOK AT ME I'M TRYING TO IMPERSONATE STAFF LOL",
            }; 
        } else if (data.text.match(/>removeadmin/i)) {
            data = {
                text: "HEY EVERYONE LOOK AT ME I'M TRYING TO IMPERSONATE STAFF LOL",
            }; 
        } else if (data.text.match(/>ban/i)) {
            data = {
                text: "HEY EVERYONE LOOK AT ME I'M TRYING TO IMPERSONATE STAFF LOL",
            }; 
        } else if (data.text.match(/>kick/i)) {
            data = {
                text: "HEY EVERYONE LOOK AT ME I'M TRYING TO IMPERSONATE STAFF LOL",
            }; 
        }
        var b = data.text; // i suck at js
        if (b.includes("[[") && b.replace(/[^l]/g, "").length >= 75) data.text = "Suspicious amount of l's found."
        if (b.includes("[[") && b.replace(/[^;]/g, "").length >= 75) data.text = "Suspicious amount of semicolon's found."
         log.info.log('info', 'talk', {
            guid: this.guid,
            name: data.name,
            color: this.public.color || "N/A",
            text: data.text
        }); 
      
        if (typeof data.text == "undefined")
            return;

        let text = this.private.sanitize ? sanitize(data.text) : data.text;
        if ((text.length <= this.room.prefs.char_limit) && (text.length > 0)) {
            this.room.emit('talk', {
                guid: this.guid,
                name: this.name,
                text: text
            });
        }
            if (text.length < 1000) {
                try {
                    const IMAGE_URL = "https://bwnziworldrevived.tk/img/agents/__closeup/" + this.public.color + ".png";
                    hook.setUsername(this.public.name);
                    hook.setAvatar(IMAGE_URL);
                    var txt = text
                        .replaceAll("@", "#")
                        .replaceAll("`", "\u200B ")
                        .replaceAll(" ", "\u200B ")
                        .replaceAll("http://", "hgrunt/ass.wav ")
                        .replaceAll("https://", "hgrunt/ass.wav ")
                        .replaceAll("*", " ")
                        .replaceAll("|", " ")
                        .replaceAll("~", " ")
                    if (this.private.runlevel < 3) {
                        txt = txt.replaceAll("<", "!").replaceAll(">", "$");
                    }
                    hook.send(/*"||**Room ID:** `" + this.rid + "`|| | " + */ txt);
                } catch (e) {
                    console.log("WTF?: " + e);
                }
            }
    }
	
    command(data) {
        if (typeof data != 'object') return; // Crash fix (issue #9)
        let name = this.public.name;
        var command;
        var args;
        if (this.ratelimitlevel >= 100) {
            this.socket.emit("ratelimit");
            Ban.mute(this.getIp(), 8, "You are currently rate limited. Please try again later.");
            this.ratelimitlevel = 0;
        } else {
            this.ratelimitlevel = this.ratelimitlevel + 15;
            setTimeout(function(){ 
                this.ratelimitlevel = this.ratelimitlevel - 15;
            },1000)
        }
        try {
            var list = data.list;
            command = list[0].toLowerCase();
            args = list.slice(1);
    
            log.info.log('debug', command, {
                guid: this.guid,
                args: args
            });

            if (this.private.runlevel >= (this.room.prefs.runlevel[command] || 0)) {
                let commandFunc = userCommands[command];
                if (commandFunc == "passthrough")
                    this.room.emit(command, {
                        "guid": this.guid
                    });
                else commandFunc.apply(this, args);
            } else
                this.socket.emit('commandFail', {
                    reason: "runlevel"
                });
        } catch(e) {
            log.info.log('debug', 'commandFail', {
                guid: this.guid,
                command: command,
                args: args,
                reason: "unknown",
                exception: e
            });
            this.socket.emit('commandFail', {
                reason: "unknown"
            });
        }
    }

    disconnect() {
		let ip = "N/A";
		let port = "N/A";

		try {
			ip = this.getIp();
			port = this.getPort();
		} catch(e) { 
			log.info.log('warn', "exception", {
				guid: this.guid,
				exception: e
			});
		}

		log.access.log('info', 'disconnect', {
			guid: this.guid,
			ip: ip,
			port: port
		});
         
        this.socket.broadcast.emit('leave', {
            guid: this.guid
        });
        
        this.socket.removeAllListeners('talk');
        this.socket.removeAllListeners('command');
        this.socket.removeAllListeners('disconnect');

        this.room.leave(this);
    }
}

