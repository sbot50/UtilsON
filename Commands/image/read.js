// const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
// const Discord = require("discord.js");
// const fs = require("fs");
// const { ocrSpace } = require("ocr-space-api-wrapper");
// const webtest = require(`./../../Misc/webtest`);
// const { createCanvas, loadImage } = require("canvas");

// function makeid(length) {
//   let result = "";
//   let characters =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   let charactersLength = characters.length;
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }
//   return result;
// }

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("read")
//     .setDescription("Read text on an image with OCR technology!")
//     .addStringOption((option) =>
//       option
//         .setName("link")
//         .setDescription("Link to the image!")
//         .setRequired(true)
//     ),
//   permissions: [],
//   async execute({ args, interaction }) {
//     let source;
//     let contenttype = await webtest.isimg(args.link);
//     if (!contenttype.includes("png")) {
//       let img = await loadImage(args.link);
//       let canvas = createCanvas(img.width, img.height);
//       let ctx = canvas.getContext("2d");
//       ctx.drawImage(img, 0, 0);
//       img = await canvas.toBuffer("image/png");
//       let rngid = makeid(20);
//       await fs.writeFileSync(`/tmp/${rngid}.png`, img);
//       source = `https://hf.space/embed/CodeON/UtilsON/+/page?id=${rngid}`;
//     } else {
//       source = args.link;
//     }
//     var options = {
//       apiKey: process.env.OCR_KEY,
//       filetype: "png",
//       verbose: false,
//       detectOrientation: true,
//       scale: true,
//       OCREngine: 2,
//     };
//     let out;
//     out = await ocrSpace(source, options);
//     if (out.IsErroredOnProcessing == true) {
//       let embed = new EmbedBuilder()
//         .setColor(0xa31600)
//         .addFields([
//           {
//             name: "**ERROR**",
//             value: "Something went wrong trying to OCR your image!",
//           },
//         ])
//         .setFooter({ text: "Used NPMs: 'ocr-space-api-wrapper'" });
//       await interaction
//         .editReply({ content: " ", embeds: [embed], ephemeral: true })
//         .then((message) => {
//           setTimeout(function () {
//             try {
//               message.delete();
//             } catch {}
//           }, 5000);
//         });
//       return;
//     } else {
//       console.log(out);
//       out = out.ParsedResults[0].ParsedText;
//       if (out == "") {
//         let embed = new EmbedBuilder()
//           .setColor(0xa31600)
//           .addFields([
//             {
//               name: "**ERROR**",
//               value: "No text detected!",
//             },
//           ])
//           .setFooter({ text: "Used NPMs: 'ocr-space-api-wrapper'" });
//         await interaction
//           .editReply({ content: " ", embeds: [embed], ephemeral: true })
//           .then((message) => {
//             setTimeout(function () {
//               try {
//                 message.delete();
//               } catch {}
//             }, 5000);
//           });
//         return;
//       }
//       let embed = new EmbedBuilder()
//         .setColor(0x1cd0ce)
//         .addFields([
//           {
//             name: "**Read:**",
//             value: out,
//           },
//         ])
//         .setImage(args.link)
//         .setFooter({ text: "Used NPMs: 'ocr-space-api-wrapper'" });
//       await interaction.editReply({ content: " ", embeds: [embed] });
//     }
//   },
// };
