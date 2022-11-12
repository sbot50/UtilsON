// module.exports = {
//   execute: async (client, args, guild, channel, member, db) => {
//     if (guild.owner != member.user.id) {
//       return [{"**ERROR**":"Only the guild owner can use this command!"}]
//     }
//     let type = args[0];
//     let old = await db.get(guild.id + "-cface")
//     if (type == old) {
//       if (type == true) {
//         return [{"**ERROR**":"Custom faces are already on!"}]
//       } else {
//         return [{"**ERROR**":"Custom faces are already off!"}]
//       }
//     } else {
//       await db.set(guild.id + "-cface", type);
//       if (type == true) {
//         return [{"DESCRIPTION":"Custom faces are now on!"}]
//       } else {
//         return [{"DESCRIPTION":"Custom faces are now off!"}]
//       }
//     }
//   }
// };
