const {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
} = require("discord.js");
// const { registerFont, createCanvas } = require("canvas");
const { Image } = require("imagescript");
const fs = require("fs");
const Discord = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("captcha")
    .setDescription("Generates a captcha!")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription(
          "Generate a captcha with this text! (max 15 characters)"
        )
        .setRequired(false)
    ),
  permissions: ["AttachFiles"],
  async execute({ args, interaction }) {
    let orgtext;
    let text = args.text;
    let wingdingsmode = 0;
    if (text && text.endsWith(" (wingdings)")) {
      text = text.replace(" (wingdings)", "");
      wingdingsmode = 1;
    } else if (text && text == "(wingdings)") {
      text = text.replace("(wingdings)", "");
      wingdingsmode = 1;
    }
    if (!text || text.length < 16) {
      if (!text || text.length == 0 || text == "") {
        let charlist = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        text = "";
        let rand = Math.floor(Math.random() * 5) + 3;
        if (rand < 5) {
          rand = 5;
        }
        for (let i = 0; i < rand; i++) {
          text =
            text + charlist.charAt(Math.floor(Math.random() * charlist.length));
        }
      }
      orgtext = text;
      let image = new Image(500, 200);
      //   let canvas = createCanvas(500, 200);
      //   registerFont("./Fonts/arial.ttf", { family: "Arial" });
      //   registerFont("./Fonts/calibri.ttf", { family: "Calibri" });
      //   registerFont("./Fonts/times_new_roman.ttf", {
      //     family: "Times New Roman",
      //   });
      //   registerFont("./Fonts/roadrage.ttf", { family: "Road Rage" });
      //   registerFont("./Fonts/comic.ttf", { family: "Comic Sans MS" });
      //   registerFont("./Fonts/wingdings.ttf", { family: "Wingdings" });
      let fonts = [
        fs.readFileSync("../../Fonts/arial.ttf").then(r => r.arrayBuffer()).then(b => new Uint8Array(b)),
        fs.readFileSync("../../Fonts/calibri.ttf").then(r => r.arrayBuffer()).then(b => new Uint8Array(b)),
        fs.readFileSync("../../Fonts/times_new_roman.ttf").then(r => r.arrayBuffer()).then(b => new Uint8Array(b)),
        fs.readFileSync("../../Fonts/roadrage.ttf").then(r => r.arrayBuffer()).then(b => new Uint8Array(b)),
        fs.readFileSync("../../Fonts/comic.ttf").then(r => r.arrayBuffer()).then(b => new Uint8Array(b)),
      ];
      //let ctx = canvas.getContext("2d");
      let p1 = image.width;
      let p2 = image.height;
      for (let i = 0; i < 100; i++) {
        let charlist = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let char = charlist.charAt(Math.floor(Math.random() * charlist.length));
        let loc1 = Math.random() * p1;
        let loc2 = Math.random() * p2;
        let rngfont = fonts[Math.floor(Math.random() * fonts.length)];
        if (wingdingsmode == 1) {
          rngfont = "Wingdings";
        }
        let text = Image.renderText(rngfont, 20, char, rngColor());
        image = image.composite(text, loc1, loc2);
        // ctx.font = "20px " + rngfont;
        // ctx.fillStyle = rngColor();
        // ctx.fillText(char, loc1, loc2);
      }
      text = text.split("");
    //   ctx.lineWidth = 3;
    //   ctx.fillStyle = "rgb(0, 224, 15)";
    //   ctx.strokeStyle = "rgb(235, 7, 30)";
    //   let l1 = -1;
    //   let l2 = -1;
    //   let loc1 = 0;
    //   let offset = (canvas.width - 100) / text.length;
    //   let array = [];
    //   for (let j = 0; j < text.length; j++) {
    //     loc1 = loc1 + offset;
    //     let loc2 = Math.random() * (p2 - 50) + 50;
    //     l2 = l1;
    //     l1 = [loc1, loc2];
    //     let list = [text[j], loc1, loc2];
    //     array.push(list);
    //     if (l2 != -1) {
    //       ctx.moveTo(l2[0], l2[1]);
    //       ctx.lineTo(l1[0], l1[1]);
    //       ctx.stroke();
    //     }
    //   }
    //   for (let k = 0; k < array.length; k++) {
    //     ctx.fillStyle =
    //       "rgb(" +
    //       rngNum() +
    //       "," +
    //       (Math.floor(Math.random() * 200) + 55) +
    //       " ," +
    //       rngNum() +
    //       ")";
    //     let rng = JSON.stringify(Math.floor(Math.random() * 25) + 25);
    //     let rngfont = fonts[Math.floor(Math.random() * fonts.length)];
    //     if (wingdingsmode == 1) {
    //       rngfont = "Wingdings";
    //     }
    //     ctx.font = rng + "px " + rngfont;
    //     let value = array[k];
    //     let letter = value[0];
    //     let loc1 = value[1];
    //     let loc2 = value[2];
    //     ctx.fillText(letter, loc1, loc2);
    //   }
      let captcha = new AttachmentBuilder(Buffer.from(image), {
        name: "CAPTCHA.png",
      });
      let embed = new EmbedBuilder()
        .setColor(0x1cd0ce)
        .addFields([
          {
            name: "**Input**",
            value: orgtext,
          },
        ])
        .setImage("attachment://CAPTCHA.png")
        .setFooter({ text: "Used NPM: 'canvas'" });
      await interaction.editReply({
        content: " ",
        embeds: [embed],
        files: [captcha],
      });
    } else {
      let embed = new EmbedBuilder()
        .setColor(0xa31600)
        .addFields([
          {
            name: "**ERROR**",
            value: "The text is too long, max 15 characters!",
          },
        ])
        .setFooter({ text: "Used NPM: 'canvas'" });
      await interaction
        .editReply({ content: " ", embeds: [embed], ephemeral: true })
        .then((message) => {
          setTimeout(function () {
            try {
              message.delete();
            } catch {}
          }, 5000);
        });
    }
  },
};

function rngColor() {
  return "rgb(" + rngNum() + "," + rngNum() + "," + rngNum() + ")";
}
function rngNum() {
  return Math.floor(Math.random() * 256);
}
