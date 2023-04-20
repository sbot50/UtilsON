var badgelist = {
  Staff: "<:Discordstaff:1098601407663308840>",
  Partner: "<:DiscordPartnerBadge:1098601405662638132>",
  Hypesquad: "<:HypeSquad_Event_Badge:1098601416173564017>",
  BugHunterLevel1: "<:Bug_hunter_badge:1098601403376750672>",
  HypeSquadOnlineHouse1: "<:Hypesquad_bravery_badge:1098601412805533716>",
  HypeSquadOnlineHouse2: "<:Hypesquad_brilliance_badge:1098601414403575888>",
  HypeSquadOnlineHouse3: "<:Hypesquad_balance_badge:1098601410976817225>",
  PremiumEarlySupporter: "<:Early_supporter_badge:1098601409030672447>",
  PremiumSupporter: "<:Nitro_badge:1098601502211313795>",
  BugHunterLevel2: "<:Bug_buster_badge:1098601401896161351>",
  VerifiedDeveloper: "<:Verified_developer_badge:1098601505071833160>",
  CertifiedModerator: "<:Moderator_Programs_Alumni:1098601418316841161>",
  ActiveDeveloper: "<:ActiveDeveloperBadge:1098601399656382554>",
  //VerifiedBot: "",
};

module.exports = {
  bte: (list) => {
    list = list.sort();
    let newlist = [];
    for (let badge of list) {
      if (badgelist.hasOwnProperty(badge)) {
        newlist.push(badgelist[badge]);
      }
    }
    return newlist;
  },
};
