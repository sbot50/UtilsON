var badgelist = {
  HypeSquadOnlineHouse3: "<:Hypesquad_balance_badge:855775854923218965>",
  HypeSquadOnlineHouse2: "<:Hypesquad_brilliance_badge:855775855359819776>",
  HypeSquadOnlineHouse1: "<:Hypesquad_bravery_badge:855775855073558528>",
  VerifiedDeveloper: "<:Verified_developer_badge:855775854482817085>",
  PremiumSupporter: "<:Nitro_badge:855775854814691328>",
  Staff: "<:Discordstaff:855775854529085470>",
  Partner: "<:New_partner_badge:855775854515978280>",
  Hypesquad: "<:Hypesquad_events_badge:855758233905922068>",
  BugHunterLevel1: "<:Bug_hunter_badge:855775855229534258>",
  BugHunterLevel2: "<:Bug_buster_badge:855775853719060541>",
  PremiumEarlySupporter: "<:Early_supporter_badge:855775856277192735>",
  CertifiedModerator: "<:Discord_Certified_Moderator:855775854479147008>",
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
