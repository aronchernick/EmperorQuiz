// Roman Emperor Game — Emperor Database & Question Bank
// Each question scores points toward specific emperors based on agree/disagree.
// Categories: power, warfare, justice, culture, character, politics

const EMPERORS = {
  augustus: {
    name: "Augustus",
    reign: "27 BC – 14 AD",
    title: "The Architect of Empire",
    icon: "🏛️",
    color: "#C9A84C",
    tagline: "Patient · Strategic · Visionary · Disciplined",
    description: "You are Augustus — the master builder. You don't seize power rashly; you engineer it. Behind a modest exterior lies a mind that thinks in decades, not days. You transformed a broken republic into a golden age through patience, propaganda, and political genius. You understand that true power isn't about brute force — it's about making the world believe you're indispensable. You'd never call yourself king, but everyone knows who rules.",
    portrait: "https://commons.wikimedia.org/wiki/Special:FilePath/Augustus_Bevilacqua_Glyptothek_Munich_317.jpg?width=600",
    traits: "Founder of the Roman Empire. Master of diplomacy and political maneuvering. Built the Pax Romana through patience and cunning rather than violence."
  },
  tiberius: {
    name: "Tiberius",
    reign: "14–37 AD",
    title: "The Reluctant Ruler",
    icon: "🏔️",
    color: "#607D8B",
    tagline: "Cautious · Competent · Withdrawn · Suspicious",
    description: "You are Tiberius — the reluctant ruler who never wanted the throne but bore its weight with grim determination. You're competent, careful, and deeply private. While others crave the spotlight, you'd rather retreat to your island and let the world sort itself out. You trust few, delegate grudgingly, and see through flattery instantly. Your administration may lack warmth, but it runs like clockwork.",
    portrait: "https://commons.wikimedia.org/wiki/Special:FilePath/Tiberius_palermo.jpg?width=600",
    traits: "Effective but reclusive administrator. Preferred solitude on Capri. Competent general who grew increasingly paranoid."
  },
  caligula: {
    name: "Caligula",
    reign: "37–41 AD",
    title: "The Unpredictable",
    icon: "🎭",
    color: "#FF5252",
    tagline: "Bold · Erratic · Extravagant · Absolute",
    description: "You are Caligula — and you refuse to play by anyone's rules but your own. You see the absurdity in tradition, the hypocrisy in the Senate, and you'd rather burn the playbook than follow it. You demand absolute loyalty and absolute spectacle. Others call you mad, but maybe you're the only one honest enough to say what power really is. You'd make your horse a senator just to prove a point.",
    portrait: "https://commons.wikimedia.org/wiki/Special:FilePath/Caligula_bust.jpg?width=600",
    traits: "Initially popular, became increasingly tyrannical. Known for extravagance and unpredictable behavior. Demanded to be worshipped as a god."
  },
  claudius: {
    name: "Claudius",
    reign: "41–54 AD",
    title: "The Unlikely Scholar",
    icon: "📜",
    color: "#78909C",
    tagline: "Intellectual · Underestimated · Pragmatic · Inclusive",
    description: "You are Claudius — the one nobody expected. Overlooked, mocked, dismissed as a fool — and you used every bit of that as cover. Behind the stammer lies a brilliant mind: legal reformer, infrastructure builder, historian. You expanded the empire not just in territory but in who counted as Roman. You prove that the quiet ones, the ones who listen and learn, often rule the best.",
    portrait: "https://commons.wikimedia.org/wiki/Special:FilePath/Claudius_crop.jpg?width=600",
    traits: "Scholarly emperor who expanded citizenship and reformed the bureaucracy. Conquered Britain. Overlooked by his family, he became one of Rome's most effective administrators."
  },
  nero: {
    name: "Nero",
    reign: "54–68 AD",
    title: "The Artist Emperor",
    icon: "🎵",
    color: "#E040FB",
    tagline: "Creative · Populist · Self-Expressive · Theatrical",
    description: "You are Nero — the artist who happened to be emperor. You crave beauty, performance, and the adoration of the crowd. You'd rather compose poetry than attend Senate meetings, and you believe life itself should be a work of art. Your grand visions — golden palaces, epic performances, a remade Rome — are either genius or madness, depending on who's telling the story. You don't care which, as long as they're talking about you.",
    portrait: "https://commons.wikimedia.org/wiki/Special:FilePath/Nero_pushkin.jpg?width=600",
    traits: "Patron of the arts who saw himself as an artist first. Initially popular with the common people. Built the Domus Aurea. His reign ended in chaos."
  },
  vespasian: {
    name: "Vespasian",
    reign: "69–79 AD",
    title: "The No-Nonsense Restorer",
    icon: "🔨",
    color: "#8D6E63",
    tagline: "Pragmatic · Fiscally Shrewd · Humorous · Grounded",
    description: "You are Vespasian — the common-sense emperor who picked up the pieces after everyone else broke them. No noble pedigree, no grand philosophy — just grit, humor, and an uncanny ability to balance the books. You'd tax urine if it meant funding the Colosseum (and you did). You rose from nothing, earned respect through competence, and died cracking jokes. Pretension is your enemy; results are your religion.",
    portrait: "https://commons.wikimedia.org/wiki/Special:FilePath/Vespasianus01_pushkin_edit.png?width=600",
    traits: "Founded the Flavian dynasty. Restored financial stability after civil war. Down-to-earth personality. Built the Colosseum. Famous for his dry wit."
  },
  trajan: {
    name: "Trajan",
    reign: "98–117 AD",
    title: "The Soldier's Emperor",
    icon: "⚔️",
    color: "#D32F2F",
    tagline: "Glorious · Expansionist · Benevolent · Meritocratic",
    description: "You are Trajan — Optimus Princeps, the best of emperors. You believe greatness is earned on the battlefield and shared with the people. Under your rule, Rome reached its greatest extent, not through tyranny but through courage and generosity. You reward merit over birthright, feed the poor, and lead from the front. You are the emperor other emperors wished they could be.",
    portrait: "https://commons.wikimedia.org/wiki/Special:FilePath/Traianus_Glyptothek_Munich_72.jpg?width=600",
    traits: "Expanded Rome to its greatest territorial extent. Known as 'Optimus Princeps' (best ruler). Military genius who was also beloved for public welfare programs."
  },
  hadrian: {
    name: "Hadrian",
    reign: "117–138 AD",
    title: "The Restless Traveler",
    icon: "🌍",
    color: "#00897B",
    tagline: "Cultured · Cosmopolitan · Builder · Curious",
    description: "You are Hadrian — the emperor who couldn't sit still. While others ruled from Rome, you walked every corner of your empire, absorbing cultures, designing buildings, writing poetry. You built walls not out of fear but wisdom — knowing that true strength means knowing your limits. Architecture, philosophy, love, adventure — you want it all, and you refuse to be confined by anyone's expectations.",
    portrait: "https://commons.wikimedia.org/wiki/Special:FilePath/Bust_of_Hadrian_in_the_Musei_Capitolini_MC817.jpg?width=600",
    traits: "Traveled extensively throughout the empire. Builder of Hadrian's Wall and the Pantheon. Patron of Greek culture. Consolidated rather than expanded the empire."
  },
  marcus_aurelius: {
    name: "Marcus Aurelius",
    reign: "161–180 AD",
    title: "The Philosopher King",
    icon: "📖",
    color: "#5C6BC0",
    tagline: "Stoic · Dutiful · Principled · Contemplative",
    description: "You are Marcus Aurelius — the philosopher who never wanted a sword but picked one up because duty demanded it. You write meditations by candlelight on the frontier, seeking wisdom not for glory but for strength to carry an impossible burden. You believe virtue is its own reward, that character matters more than comfort, and that even an emperor must answer to something higher than himself. You are proof that the noblest ruler is the one who'd rather be reading.",
    portrait: "https://commons.wikimedia.org/wiki/Special:FilePath/Marcus_Aurelius_bust_2.jpg?width=600",
    traits: "Stoic philosopher who wrote 'Meditations.' Spent most of his reign at war despite preferring peace. Considered the last of the Five Good Emperors."
  },
  commodus: {
    name: "Commodus",
    reign: "180–192 AD",
    title: "The Gladiator Emperor",
    icon: "🗡️",
    color: "#F4511E",
    tagline: "Thrill-Seeking · Self-Indulgent · Populist · Theatrical",
    description: "You are Commodus — and you'd rather fight in the arena than sit on a throne. Rules, traditions, the Senate's disapproval — none of it matters when the crowd is roaring your name. You inherited the greatest empire on Earth and used it as your personal playground. Irresponsible? Maybe. But you lived more in one day than most people do in a lifetime. You believe power should be fun, and you're absolutely going to enjoy every second of it.",
    portrait: "https://commons.wikimedia.org/wiki/Special:FilePath/Commodus_Musei_Capitolini_MC1120.jpg?width=600",
    traits: "Son of Marcus Aurelius who preferred gladiatorial combat to governing. Renamed Rome after himself. His reign marked the beginning of Rome's decline."
  },
  septimius_severus: {
    name: "Septimius Severus",
    reign: "193–211 AD",
    title: "The Iron Fist",
    icon: "🦁",
    color: "#424242",
    tagline: "Military · Ruthless · Loyal · Transformative",
    description: "You are Septimius Severus — the African-born emperor who seized power through sheer military will and held it through iron discipline. You trust soldiers over senators, reward loyalty above all else, and understand that in a world of wolves, the strongest survive. You expanded the army, enriched the troops, and told your sons to 'enrich the soldiers and ignore everyone else.' Harsh? Maybe. But your empire held.",
    portrait: "https://commons.wikimedia.org/wiki/Special:FilePath/Septimius_Severus_Glyptothek_Munich_357.jpg?width=600",
    traits: "First African-born emperor. Military strongman who dissolved the Praetorian Guard. Expanded the army and prioritized military loyalty above all."
  },
  diocletian: {
    name: "Diocletian",
    reign: "284–305 AD",
    title: "The Great Reformer",
    icon: "📐",
    color: "#1565C0",
    tagline: "Systematic · Transformative · Authoritarian · Disciplined",
    description: "You are Diocletian — the emperor who looked at a crumbling empire and said 'I'll rebuild the entire system from scratch.' You invented the Tetrarchy, reformed taxation, reorganized the army, and standardized the bureaucracy. You see problems as engineering challenges. And when the work was done? You retired to grow cabbages. You're the rare leader who builds something greater than themselves and walks away.",
    portrait: "https://commons.wikimedia.org/wiki/Special:FilePath/Diocletianus-Vaux1.jpg?width=600",
    traits: "Ended the Crisis of the Third Century. Created the Tetrarchy (rule of four). Massive administrative and military reforms. Voluntarily abdicated."
  },
  constantine: {
    name: "Constantine",
    reign: "306–337 AD",
    title: "The Visionary",
    icon: "✝️",
    color: "#7B1FA2",
    tagline: "Transformative · Ambitious · Unifying · Bold",
    description: "You are Constantine — the emperor who saw a vision and changed the world. You don't just want to rule an empire; you want to transform civilization. Moving the capital, embracing a new faith, rewriting the rules of power — nothing is too bold. You understand that the greatest leaders don't just manage the present; they create the future. Whether through faith or ambition, you leave a mark that lasts millennia.",
    portrait: "https://commons.wikimedia.org/wiki/Special:FilePath/Museo_Capitolino_-_Costantino_I.jpg?width=600",
    traits: "First Christian emperor. Founded Constantinople. United the empire under one rule. His decisions shaped Western civilization for centuries."
  },
  julian: {
    name: "Julian",
    reign: "361–363 AD",
    title: "The Apostate",
    icon: "🔥",
    color: "#EF6C00",
    tagline: "Intellectual · Contrarian · Philosophical · Principled",
    description: "You are Julian — the emperor who swam against the tide. When the whole world was going one way, you said 'no' and went the other, not out of spite but conviction. A scholar, a soldier, and a philosopher, you tried to restore what was lost and challenge the orthodoxy of your age. You may have failed, but you failed magnificently — and on your own terms. You prove that principles matter more than popularity.",
    portrait: "https://commons.wikimedia.org/wiki/Special:FilePath/Julian_Apostata_Paris.jpg?width=600",
    traits: "Last non-Christian emperor. Brilliant scholar and military commander. Attempted to restore traditional Roman religion. Died on campaign in Persia."
  },
  theodosius: {
    name: "Theodosius I",
    reign: "379–395 AD",
    title: "The Last Unifier",
    icon: "🕊️",
    color: "#00695C",
    tagline: "Diplomatic · Devout · Firm · Pragmatic",
    description: "You are Theodosius — the last emperor to rule both East and West as one. You understand that an empire needs a soul, and you gave yours one — making Christianity the official religion and drawing a line in the sand. Diplomatic when possible, firm when necessary, you navigated a crumbling world with faith and pragmatism in equal measure. You didn't save the empire, but you gave it dignity in its final unified chapter.",
    portrait: "https://commons.wikimedia.org/wiki/Special:FilePath/Theodosius_I._Roman_Emperor._379-395_CE._Museo_de_la_Real_Academia_de_Bellas_Artes_de_San_Fernando.jpg?width=600",
    traits: "Last emperor to rule a united Roman Empire. Made Christianity the state religion. Skilled diplomat who settled with the Goths rather than fighting them."
  },
  justinian: {
    name: "Justinian I",
    reign: "527–565 AD",
    title: "The Restorer",
    icon: "⛪",
    color: "#AD1457",
    tagline: "Ambitious · Legal Reformer · Grand Builder · Tireless",
    description: "You are Justinian — the emperor who refused to accept that Rome had fallen. You reconquered lost territories, codified centuries of Roman law into one unified code, and built the Hagia Sophia — a wonder that still stands. You worked tirelessly, slept little, and dreamed of restoring an empire to its former glory. You are proof that sheer force of will can reshape the world, even when everyone says it's too late.",
    portrait: "https://commons.wikimedia.org/wiki/Special:FilePath/Mosaic_of_Justinianus_I_-_Basilica_San_Vitale_(Ravenna).jpg?width=600",
    traits: "Byzantine emperor who reconquered much of the Western Empire. Created the Justinian Code. Built the Hagia Sophia. His wife Theodora was equally influential."
  }
};

// Question categories for display
const CATEGORIES = {
  power: { name: "Power & Rule", color: "#C9A84C", icon: "👑" },
  warfare: { name: "War & Peace", color: "#D32F2F", icon: "⚔️" },
  justice: { name: "Law & Justice", color: "#5C6BC0", icon: "⚖️" },
  culture: { name: "Culture & Legacy", color: "#00897B", icon: "🎭" },
  character: { name: "Character & Virtue", color: "#8D6E63", icon: "🦅" },
  politics: { name: "People & Politics", color: "#7B1FA2", icon: "👥" }
};

const QUESTIONS = [
  // ===== POWER & RULE =====
  {
    id: "pow1",
    category: "power",
    text: "You've been given absolute authority. Your first instinct is to build institutions and systems that will outlast you, rather than make dramatic immediate changes.",
    context: "Foundation vs. spectacle — do you build for the long term or seize the moment?",
    likeText: "Build systems",
    dislikeText: "Act boldly now",
    agree: { augustus: 3, diocletian: 3, claudius: 2, theodosius: 1 },
    disagree: { caligula: 2, nero: 2, trajan: 1, constantine: 2 }
  },
  {
    id: "pow2",
    category: "power",
    text: "Power is most effective when people don't even realize you're wielding it. The best ruler appears almost reluctant.",
    context: "Subtle influence vs. open authority — how should power look?",
    likeText: "Power should be subtle",
    dislikeText: "Power should be visible",
    agree: { augustus: 3, tiberius: 2, claudius: 2, theodosius: 1 },
    disagree: { caligula: 2, nero: 2, trajan: 1, commodus: 2, septimius_severus: 1 }
  },
  {
    id: "pow3",
    category: "power",
    text: "If you inherited leadership of a failing organization, you'd tear down the entire structure and rebuild it from scratch rather than patch what's broken.",
    context: "Revolutionary reform vs. incremental change.",
    likeText: "Rebuild everything",
    dislikeText: "Fix what exists",
    agree: { diocletian: 3, constantine: 2, justinian: 2, septimius_severus: 1 },
    disagree: { hadrian: 2, marcus_aurelius: 2, tiberius: 2, theodosius: 1 }
  },
  {
    id: "pow4",
    category: "power",
    text: "You'd rather delegate important tasks to trusted advisors than try to control every decision yourself.",
    context: "Delegation vs. centralization — how tightly do you grip the reins?",
    likeText: "Delegate widely",
    dislikeText: "Control everything",
    agree: { claudius: 2, tiberius: 2, hadrian: 1, commodus: 2 },
    disagree: { diocletian: 2, justinian: 3, caligula: 1, augustus: 1, constantine: 1 }
  },
  {
    id: "pow5",
    category: "power",
    text: "A good leader should be willing to voluntarily give up power when their work is done, rather than hold on until the end.",
    context: "Voluntary abdication — can you walk away from the throne?",
    likeText: "Walk away when done",
    dislikeText: "Hold power for life",
    agree: { diocletian: 3, augustus: 1, marcus_aurelius: 2, vespasian: 1 },
    disagree: { caligula: 2, nero: 2, commodus: 2, justinian: 2, constantine: 1 }
  },
  {
    id: "pow6",
    category: "power",
    text: "Sometimes the best way to consolidate power is to share it — splitting authority among trusted partners rather than holding it all yourself.",
    context: "Shared rule vs. sole authority — strength through division?",
    likeText: "Share power",
    dislikeText: "Rule alone",
    agree: { diocletian: 3, theodosius: 2, augustus: 1, marcus_aurelius: 1 },
    disagree: { caligula: 2, constantine: 2, justinian: 2, septimius_severus: 1, nero: 1 }
  },
  {
    id: "pow7",
    category: "power",
    text: "Your organization's headquarters has become corrupt and dysfunctional. You'd move the entire capital to a fresh location rather than try to reform it from within.",
    context: "Relocation vs. reformation — start fresh or stand your ground?",
    likeText: "Move to a new base",
    dislikeText: "Reform from within",
    agree: { constantine: 3, diocletian: 1, justinian: 1 },
    disagree: { augustus: 2, vespasian: 2, hadrian: 1, marcus_aurelius: 1, tiberius: 1 }
  },
  {
    id: "pow8",
    category: "power",
    text: "The trappings of power — grand titles, palaces, ceremonies — aren't vanity. They're tools that make people respect and obey authority.",
    context: "Ceremony and spectacle as instruments of rule.",
    likeText: "Spectacle serves power",
    dislikeText: "Humility earns respect",
    agree: { nero: 2, caligula: 2, diocletian: 2, constantine: 1, justinian: 2 },
    disagree: { vespasian: 3, marcus_aurelius: 2, claudius: 1, tiberius: 1 }
  },
  {
    id: "pow9",
    category: "power",
    text: "You didn't seek leadership — it was thrust upon you. But now that it's yours, you'll carry the burden without complaint.",
    context: "Reluctant leadership — ruling out of duty, not ambition.",
    likeText: "Duty calls, I answer",
    dislikeText: "I prefer to choose my path",
    agree: { marcus_aurelius: 3, tiberius: 2, claudius: 2, theodosius: 1 },
    disagree: { trajan: 1, constantine: 2, caligula: 1, nero: 1, julian: 2 }
  },
  {
    id: "pow10",
    category: "power",
    text: "When nobody expected anything from you — when you were overlooked and dismissed — you used that underestimation as your greatest weapon.",
    context: "The power of being underestimated.",
    likeText: "That's my story",
    dislikeText: "I demand recognition",
    agree: { claudius: 3, vespasian: 2, augustus: 1, diocletian: 1 },
    disagree: { nero: 2, caligula: 2, commodus: 2, trajan: 1 }
  },

  // ===== WAR & PEACE =====
  {
    id: "war1",
    category: "warfare",
    text: "True greatness means expanding your borders. An empire that isn't growing is dying.",
    context: "Expansion vs. consolidation — is bigger always better?",
    likeText: "Expand always",
    dislikeText: "Consolidate what you have",
    agree: { trajan: 3, justinian: 2, septimius_severus: 1, constantine: 1 },
    disagree: { hadrian: 3, augustus: 2, marcus_aurelius: 1, diocletian: 1, theodosius: 1 }
  },
  {
    id: "war2",
    category: "warfare",
    text: "A leader should personally lead troops into battle, fighting alongside their soldiers rather than commanding from safety.",
    context: "Leading from the front vs. strategic command.",
    likeText: "Fight alongside them",
    dislikeText: "Command from behind",
    agree: { trajan: 3, julian: 3, marcus_aurelius: 2, septimius_severus: 2 },
    disagree: { augustus: 2, tiberius: 2, claudius: 1, diocletian: 1, justinian: 1 }
  },
  {
    id: "war3",
    category: "warfare",
    text: "Building a great defensive wall is wiser than launching an offensive campaign. Know your limits and defend them well.",
    context: "Defense vs. offense — the wisdom of boundaries.",
    likeText: "Build the wall",
    dislikeText: "Take the fight to them",
    agree: { hadrian: 3, augustus: 2, diocletian: 2, theodosius: 1, tiberius: 1 },
    disagree: { trajan: 3, julian: 2, septimius_severus: 2, justinian: 1 }
  },
  {
    id: "war4",
    category: "warfare",
    text: "When facing a powerful enemy, negotiation and diplomacy are almost always better than war.",
    context: "Diplomacy vs. military force.",
    likeText: "Negotiate first",
    dislikeText: "Show strength",
    agree: { augustus: 2, theodosius: 3, hadrian: 2, claudius: 1, tiberius: 1 },
    disagree: { trajan: 2, septimius_severus: 3, julian: 2, caligula: 1, constantine: 1 }
  },
  {
    id: "war5",
    category: "warfare",
    text: "After defeating an enemy, you should integrate them into your society and give them a path to become full citizens rather than subjugating them.",
    context: "Integration vs. subjugation of conquered peoples.",
    likeText: "Integrate them",
    dislikeText: "They must submit",
    agree: { claudius: 3, hadrian: 2, trajan: 2, theodosius: 1, augustus: 1 },
    disagree: { septimius_severus: 2, caligula: 2, nero: 1, diocletian: 1 }
  },
  {
    id: "war6",
    category: "warfare",
    text: "The military is the backbone of any state. Soldiers should be the best-paid and most respected members of society.",
    context: "Military primacy — should the army come first?",
    likeText: "Soldiers first",
    dislikeText: "Balance all institutions",
    agree: { septimius_severus: 3, trajan: 2, vespasian: 1, diocletian: 1 },
    disagree: { marcus_aurelius: 2, hadrian: 1, claudius: 2, augustus: 1, nero: 1, theodosius: 1 }
  },
  {
    id: "war7",
    category: "warfare",
    text: "You'd rather win through a brilliant strategic move that avoids bloodshed than through a glorious but costly battle.",
    context: "Strategic cunning vs. martial valor.",
    likeText: "Cunning over combat",
    dislikeText: "Glory in battle",
    agree: { augustus: 3, tiberius: 2, theodosius: 2, claudius: 1 },
    disagree: { trajan: 2, julian: 2, commodus: 1, septimius_severus: 2 }
  },
  {
    id: "war8",
    category: "warfare",
    text: "Sometimes a campaign you know you'll probably lose is still worth fighting, if the cause is just and principled.",
    context: "Principled defeat vs. pragmatic survival.",
    likeText: "Fight for principle",
    dislikeText: "Live to fight another day",
    agree: { julian: 3, marcus_aurelius: 2, trajan: 1 },
    disagree: { augustus: 2, vespasian: 2, tiberius: 2, theodosius: 1, diocletian: 1 }
  },
  {
    id: "war9",
    category: "warfare",
    text: "Civil wars are the worst kind of conflict. You'd do almost anything to avoid Romans fighting Romans — even making uncomfortable compromises.",
    context: "Unity at any cost vs. fighting for what's right internally.",
    likeText: "Unity above all",
    dislikeText: "Some fights are necessary",
    agree: { theodosius: 3, augustus: 2, marcus_aurelius: 2, hadrian: 1, vespasian: 1 },
    disagree: { septimius_severus: 2, constantine: 2, julian: 1, diocletian: 1 }
  },
  {
    id: "war10",
    category: "warfare",
    text: "A leader who has never experienced the hardship of a military camp and a long march has no right to send soldiers to die.",
    context: "Firsthand experience as a prerequisite for command.",
    likeText: "Leaders must serve first",
    dislikeText: "Leadership is about judgment",
    agree: { trajan: 3, julian: 2, septimius_severus: 2, marcus_aurelius: 2, vespasian: 1 },
    disagree: { claudius: 2, nero: 2, caligula: 1, justinian: 1 }
  },

  // ===== LAW & JUSTICE =====
  {
    id: "jus1",
    category: "justice",
    text: "The law should be written down clearly and applied equally to everyone — senator and slave alike. No exceptions, no 'interpretation.'",
    context: "Universal rule of law vs. flexible justice.",
    likeText: "Equal law for all",
    dislikeText: "Justice needs flexibility",
    agree: { justinian: 3, diocletian: 2, hadrian: 2, claudius: 1 },
    disagree: { augustus: 1, caligula: 2, nero: 2, commodus: 1, tiberius: 1 }
  },
  {
    id: "jus2",
    category: "justice",
    text: "Mercy toward a defeated enemy is more powerful than punishment. Clemency wins loyalty that fear never can.",
    context: "Clemency vs. harsh punishment — what secures obedience?",
    likeText: "Show mercy",
    dislikeText: "Punish decisively",
    agree: { augustus: 2, marcus_aurelius: 3, trajan: 2, hadrian: 1, theodosius: 1 },
    disagree: { septimius_severus: 2, caligula: 2, tiberius: 2, diocletian: 1 }
  },
  {
    id: "jus3",
    category: "justice",
    text: "Dissent and criticism of the ruler should be tolerated — even encouraged — as a check on power.",
    context: "Free speech vs. authority — should the emperor be questioned?",
    likeText: "Tolerate dissent",
    dislikeText: "Silence undermines authority",
    agree: { marcus_aurelius: 3, trajan: 2, hadrian: 1, vespasian: 2, julian: 1 },
    disagree: { caligula: 3, nero: 2, tiberius: 2, septimius_severus: 1, diocletian: 1 }
  },
  {
    id: "jus4",
    category: "justice",
    text: "Corruption is the cancer of any government. You'd pursue it ruthlessly, even if it means punishing allies and friends.",
    context: "Anti-corruption — zero tolerance or political reality?",
    likeText: "Root out all corruption",
    dislikeText: "Some flexibility is necessary",
    agree: { vespasian: 2, diocletian: 2, tiberius: 2, trajan: 2, justinian: 1 },
    disagree: { commodus: 2, nero: 1, caligula: 1, augustus: 1 }
  },
  {
    id: "jus5",
    category: "justice",
    text: "Sometimes you need to make a brutal public example of one person to prevent a thousand others from stepping out of line.",
    context: "Exemplary punishment — deterrence through severity.",
    likeText: "Fear keeps order",
    dislikeText: "That's tyranny",
    agree: { septimius_severus: 3, tiberius: 2, diocletian: 2, caligula: 1 },
    disagree: { marcus_aurelius: 3, trajan: 1, hadrian: 1, claudius: 1, theodosius: 1 }
  },
  {
    id: "jus6",
    category: "justice",
    text: "Expanding citizenship and legal rights to conquered peoples and outsiders strengthens a society more than keeping it exclusive.",
    context: "Inclusive citizenship vs. exclusive privilege.",
    likeText: "Expand rights widely",
    dislikeText: "Citizenship must be earned",
    agree: { claudius: 3, hadrian: 2, trajan: 2, constantine: 1, theodosius: 1 },
    disagree: { tiberius: 2, caligula: 1, septimius_severus: 1, augustus: 1 }
  },
  {
    id: "jus7",
    category: "justice",
    text: "A ruler should personally hear legal cases and appeals from common citizens, not just leave it to judges and bureaucrats.",
    context: "Hands-on justice vs. delegated judiciary.",
    likeText: "Hear cases personally",
    dislikeText: "Trust the system",
    agree: { claudius: 3, marcus_aurelius: 2, trajan: 1, hadrian: 1, justinian: 1 },
    disagree: { tiberius: 2, commodus: 3, diocletian: 1, nero: 1 }
  },
  {
    id: "jus8",
    category: "justice",
    text: "The previous ruler's closest advisors and family should be investigated and held accountable if they committed crimes — no amnesty for the powerful.",
    context: "Accountability vs. peaceful transition of power.",
    likeText: "No one is above the law",
    dislikeText: "Let the past be past",
    agree: { vespasian: 2, tiberius: 2, septimius_severus: 2, diocletian: 1 },
    disagree: { augustus: 2, theodosius: 2, marcus_aurelius: 1, hadrian: 1, constantine: 1 }
  },
  {
    id: "jus9",
    category: "justice",
    text: "Codifying all existing laws into one clear, organized legal code would be your greatest legacy — more lasting than any military victory.",
    context: "Legal codification as the ultimate achievement.",
    likeText: "Laws outlast victories",
    dislikeText: "Actions speak louder",
    agree: { justinian: 3, hadrian: 2, diocletian: 2, claudius: 1 },
    disagree: { trajan: 2, commodus: 1, nero: 1, septimius_severus: 1 }
  },
  {
    id: "jus10",
    category: "justice",
    text: "Religious freedom should be guaranteed — people should worship however they choose without state interference.",
    context: "Religious tolerance vs. state religion.",
    likeText: "Freedom of worship",
    dislikeText: "One faith unifies",
    agree: { julian: 3, hadrian: 2, augustus: 1, claudius: 1, trajan: 1 },
    disagree: { theodosius: 3, constantine: 2, diocletian: 1 }
  },

  // ===== CULTURE & LEGACY =====
  {
    id: "cul1",
    category: "culture",
    text: "If you could be remembered for only one thing, you'd choose a magnificent building that survives for millennia — not a military victory that fades from memory.",
    context: "Architectural legacy vs. martial glory.",
    likeText: "Build something eternal",
    dislikeText: "Win something glorious",
    agree: { hadrian: 3, justinian: 3, augustus: 1, nero: 1, constantine: 1 },
    disagree: { trajan: 2, septimius_severus: 2, julian: 1, commodus: 1 }
  },
  {
    id: "cul2",
    category: "culture",
    text: "The arts — music, poetry, theater, painting — are not luxuries. They are the soul of civilization and deserve massive public funding.",
    context: "Arts patronage — essential or extravagant?",
    likeText: "Fund the arts",
    dislikeText: "Practical matters first",
    agree: { nero: 3, hadrian: 2, justinian: 1, constantine: 1, marcus_aurelius: 1 },
    disagree: { vespasian: 2, septimius_severus: 2, diocletian: 1, tiberius: 2 }
  },
  {
    id: "cul3",
    category: "culture",
    text: "When you travel, you don't just visit — you immerse yourself in local cultures, adopt their best ideas, and bring them home.",
    context: "Cultural absorption — cosmopolitan curiosity.",
    likeText: "Absorb every culture",
    dislikeText: "Stay true to your own",
    agree: { hadrian: 3, claudius: 2, julian: 2, trajan: 1 },
    disagree: { tiberius: 2, septimius_severus: 1, caligula: 1, augustus: 1 }
  },
  {
    id: "cul4",
    category: "culture",
    text: "Greek philosophy and culture are superior to Roman practicality. Intellectual refinement matters more than engineering and conquest.",
    context: "Hellenism vs. Roman pragmatism.",
    likeText: "Philosophy over pragmatism",
    dislikeText: "Results over ideas",
    agree: { hadrian: 3, julian: 3, marcus_aurelius: 2, nero: 1 },
    disagree: { vespasian: 2, septimius_severus: 2, diocletian: 1, augustus: 1, trajan: 1 }
  },
  {
    id: "cul5",
    category: "culture",
    text: "A ruler's personal life — love, grief, passion — is just as important as their public duties. You refuse to separate the human from the title.",
    context: "Personal expression vs. stoic duty.",
    likeText: "Embrace your humanity",
    dislikeText: "Duty above self",
    agree: { hadrian: 2, nero: 2, commodus: 2, constantine: 1 },
    disagree: { marcus_aurelius: 3, tiberius: 2, diocletian: 1, vespasian: 1, augustus: 1 }
  },
  {
    id: "cul6",
    category: "culture",
    text: "Massive public spectacles — gladiatorial games, chariot races, lavish festivals — are essential for keeping the people happy and loyal.",
    context: "Bread and circuses — entertainment as governance.",
    likeText: "Give them spectacle",
    dislikeText: "Invest in substance",
    agree: { commodus: 3, nero: 2, caligula: 2, trajan: 1, vespasian: 1 },
    disagree: { marcus_aurelius: 2, tiberius: 2, julian: 1, hadrian: 1 }
  },
  {
    id: "cul7",
    category: "culture",
    text: "You see yourself as an artist or philosopher first, and a leader second. Power is just the means — expression is the end.",
    context: "The artist-ruler paradox.",
    likeText: "Art is my true calling",
    dislikeText: "Leadership is the calling",
    agree: { nero: 3, hadrian: 2, julian: 2, marcus_aurelius: 1 },
    disagree: { augustus: 2, diocletian: 2, septimius_severus: 1, vespasian: 2 }
  },
  {
    id: "cul8",
    category: "culture",
    text: "Building massive infrastructure — roads, aqueducts, harbors, public baths — is the greatest gift a ruler can give their people.",
    context: "Infrastructure as legacy.",
    likeText: "Build infrastructure",
    dislikeText: "Other priorities matter more",
    agree: { claudius: 2, trajan: 2, hadrian: 2, vespasian: 2, justinian: 1, augustus: 1 },
    disagree: { nero: 1, commodus: 2, caligula: 2, tiberius: 1 }
  },
  {
    id: "cul9",
    category: "culture",
    text: "History is written by the victors, and a wise leader carefully controls their own narrative. Image management is a legitimate tool of statecraft.",
    context: "Propaganda and legacy — controlling the story.",
    likeText: "Control the narrative",
    dislikeText: "Let truth speak for itself",
    agree: { augustus: 3, constantine: 2, justinian: 1, nero: 1, diocletian: 1 },
    disagree: { marcus_aurelius: 2, vespasian: 1, julian: 2, trajan: 1 }
  },
  {
    id: "cul10",
    category: "culture",
    text: "When something has been lost — a tradition, a territory, a golden age — you feel a burning need to restore it, even if others say it's impossible.",
    context: "Restoration vs. moving forward.",
    likeText: "Restore what was lost",
    dislikeText: "Build something new",
    agree: { justinian: 3, julian: 3, constantine: 1 },
    disagree: { augustus: 2, diocletian: 2, vespasian: 1, hadrian: 1 }
  },

  // ===== CHARACTER & VIRTUE =====
  {
    id: "chr1",
    category: "character",
    text: "Self-discipline and personal restraint are the most important virtues a leader can possess. Without them, power corrupts absolutely.",
    context: "Stoic self-mastery vs. enjoying the fruits of power.",
    likeText: "Discipline is everything",
    dislikeText: "Life is meant to be lived",
    agree: { marcus_aurelius: 3, augustus: 2, vespasian: 2, diocletian: 2, tiberius: 1 },
    disagree: { commodus: 3, nero: 2, caligula: 2 }
  },
  {
    id: "chr2",
    category: "character",
    text: "You keep a journal or engage in deep self-reflection regularly. Understanding yourself is the foundation of understanding the world.",
    context: "Meditations — the examined life.",
    likeText: "Self-reflection is key",
    dislikeText: "Action over introspection",
    agree: { marcus_aurelius: 3, julian: 2, hadrian: 2, claudius: 1 },
    disagree: { trajan: 1, commodus: 2, septimius_severus: 2, vespasian: 1 }
  },
  {
    id: "chr3",
    category: "character",
    text: "When things go wrong, your first emotion is usually dark humor rather than despair. You can laugh at absurdity, even your own.",
    context: "Wit in the face of adversity.",
    likeText: "Laugh at the chaos",
    dislikeText: "Take things seriously",
    agree: { vespasian: 3, claudius: 1, hadrian: 1, caligula: 1 },
    disagree: { marcus_aurelius: 1, tiberius: 2, septimius_severus: 1, diocletian: 1, justinian: 1 }
  },
  {
    id: "chr4",
    category: "character",
    text: "You often feel like you're performing a role — wearing a mask for the public — while the real you is very different from what people see.",
    context: "The mask of power — public persona vs. private self.",
    likeText: "I wear a mask daily",
    dislikeText: "What you see is what you get",
    agree: { augustus: 2, tiberius: 3, claudius: 2, nero: 1, constantine: 1 },
    disagree: { vespasian: 2, trajan: 2, marcus_aurelius: 1, commodus: 1 }
  },
  {
    id: "chr5",
    category: "character",
    text: "You'd rather be feared than loved. Love is fickle, but fear is reliable.",
    context: "The Machiavellian question applied to Rome.",
    likeText: "Fear keeps order",
    dislikeText: "Love earns loyalty",
    agree: { septimius_severus: 3, tiberius: 2, caligula: 2, diocletian: 1 },
    disagree: { marcus_aurelius: 2, trajan: 2, hadrian: 1, vespasian: 1, theodosius: 1, augustus: 1 }
  },
  {
    id: "chr6",
    category: "character",
    text: "You come from humble origins and have had to earn everything through hard work. You're suspicious of people who inherited their position.",
    context: "Self-made vs. born to power.",
    likeText: "I earned my place",
    dislikeText: "Heritage has value",
    agree: { vespasian: 3, diocletian: 2, septimius_severus: 2, justinian: 1 },
    disagree: { nero: 1, commodus: 2, caligula: 1, marcus_aurelius: 1, trajan: 1 }
  },
  {
    id: "chr7",
    category: "character",
    text: "You tend to become paranoid and suspicious of those closest to you over time. Trust, once broken, is gone forever.",
    context: "Paranoia and trust — the isolating nature of power.",
    likeText: "Trust no one completely",
    dislikeText: "Give people the benefit of the doubt",
    agree: { tiberius: 3, caligula: 2, nero: 1, septimius_severus: 2 },
    disagree: { marcus_aurelius: 2, trajan: 2, hadrian: 1, vespasian: 1, claudius: 1 }
  },
  {
    id: "chr8",
    category: "character",
    text: "If you're being honest, you enjoy luxury, pleasure, and spectacle. You'd rather live magnificently for a short time than modestly for a long one.",
    context: "Hedonism vs. asceticism in leadership.",
    likeText: "Live magnificently",
    dislikeText: "Modesty and endurance",
    agree: { nero: 3, commodus: 3, caligula: 2 },
    disagree: { marcus_aurelius: 2, vespasian: 2, tiberius: 1, diocletian: 2, augustus: 1 }
  },
  {
    id: "chr9",
    category: "character",
    text: "Your physical and mental stamina is extraordinary. You can work 18-hour days for years and never lose focus.",
    context: "Tireless work ethic — the engine of empire.",
    likeText: "I'm relentless",
    dislikeText: "Balance matters more",
    agree: { justinian: 3, diocletian: 2, augustus: 2, trajan: 1, marcus_aurelius: 1 },
    disagree: { commodus: 2, nero: 1, caligula: 1, tiberius: 1 }
  },
  {
    id: "chr10",
    category: "character",
    text: "You've faced personal tragedy — loss, betrayal, suffering — and it has made you stronger rather than bitter.",
    context: "Resilience through suffering.",
    likeText: "Suffering forged me",
    dislikeText: "Suffering is just suffering",
    agree: { marcus_aurelius: 2, augustus: 2, vespasian: 1, hadrian: 2, constantine: 1, theodosius: 1 },
    disagree: { nero: 2, commodus: 1, caligula: 2 }
  },

  // ===== PEOPLE & POLITICS =====
  {
    id: "pol1",
    category: "politics",
    text: "The common people's love and support matter more than the approval of the elites. A ruler should always side with the masses over the aristocracy.",
    context: "Populism vs. elitism — whose support matters most?",
    likeText: "Side with the people",
    dislikeText: "Elites drive progress",
    agree: { nero: 2, commodus: 2, trajan: 2, vespasian: 2, constantine: 1 },
    disagree: { tiberius: 2, augustus: 1, claudius: 1, diocletian: 1, septimius_severus: 1 }
  },
  {
    id: "pol2",
    category: "politics",
    text: "A strong, professional bureaucracy is more important than charismatic leadership. Systems should outlast any one person.",
    context: "Institutional strength vs. personal rule.",
    likeText: "Systems over strongmen",
    dislikeText: "Leaders shape history",
    agree: { claudius: 3, diocletian: 3, hadrian: 1, justinian: 1, augustus: 1 },
    disagree: { constantine: 2, caligula: 1, nero: 1, septimius_severus: 1, trajan: 1 }
  },
  {
    id: "pol3",
    category: "politics",
    text: "Public welfare programs — free grain, public baths, housing for the poor — are not charity. They're investments in stability and loyalty.",
    context: "Welfare state — Roman style.",
    likeText: "Feed the people",
    dislikeText: "People should earn their bread",
    agree: { trajan: 3, augustus: 2, vespasian: 1, constantine: 1, claudius: 1 },
    disagree: { tiberius: 2, septimius_severus: 1, caligula: 1, diocletian: 1 }
  },
  {
    id: "pol4",
    category: "politics",
    text: "The Senate is an outdated institution of self-interested aristocrats. Real power should rest with one decisive leader who acts for everyone.",
    context: "Autocracy vs. shared governance.",
    likeText: "One strong leader",
    dislikeText: "Power needs checks",
    agree: { caligula: 3, constantine: 2, septimius_severus: 2, justinian: 1, diocletian: 1 },
    disagree: { augustus: 2, marcus_aurelius: 1, trajan: 1, claudius: 1, vespasian: 1 }
  },
  {
    id: "pol5",
    category: "politics",
    text: "Religion — whether you personally believe or not — is an incredibly useful political tool that a wise ruler should harness to unify the people.",
    context: "Religion as statecraft.",
    likeText: "Use religion strategically",
    dislikeText: "Keep faith and politics separate",
    agree: { constantine: 3, augustus: 2, theodosius: 2, diocletian: 1, justinian: 1 },
    disagree: { julian: 3, hadrian: 1, marcus_aurelius: 1 }
  },
  {
    id: "pol6",
    category: "politics",
    text: "You'd rather be known as the ruler who balanced the budget and fixed the economy than the one who won a great battle.",
    context: "Fiscal responsibility as the highest duty.",
    likeText: "Fix the economy",
    dislikeText: "Win glory",
    agree: { vespasian: 3, augustus: 2, diocletian: 2, tiberius: 1 },
    disagree: { trajan: 2, commodus: 1, nero: 1, constantine: 1, julian: 1 }
  },
  {
    id: "pol7",
    category: "politics",
    text: "Succession should be based on merit — adopting the most capable person — not blood inheritance. Your heir should be the best candidate, not your child.",
    context: "Adoptive succession vs. dynastic inheritance.",
    likeText: "Merit over blood",
    dislikeText: "Family is everything",
    agree: { trajan: 3, hadrian: 2, marcus_aurelius: 2, augustus: 1 },
    disagree: { septimius_severus: 2, constantine: 2, commodus: 1, vespasian: 1, justinian: 1 }
  },
  {
    id: "pol8",
    category: "politics",
    text: "When a society is deeply divided, sometimes imposing one unifying belief or identity is better than tolerating endless fragmentation.",
    context: "Enforced unity vs. diverse coexistence.",
    likeText: "Unity by any means",
    dislikeText: "Diversity is strength",
    agree: { theodosius: 3, constantine: 2, diocletian: 2, septimius_severus: 1 },
    disagree: { hadrian: 2, julian: 2, claudius: 2, marcus_aurelius: 1 }
  },
  {
    id: "pol9",
    category: "politics",
    text: "You believe in leading by personal example. You'd voluntarily take a pay cut, sleep on a camp bed, and eat the same food as your subjects.",
    context: "Egalitarian leadership — the anti-luxury approach.",
    likeText: "Lead by example",
    dislikeText: "Rank has its privileges",
    agree: { marcus_aurelius: 3, julian: 2, vespasian: 2, trajan: 1 },
    disagree: { nero: 2, commodus: 2, caligula: 2, justinian: 1 }
  },
  {
    id: "pol10",
    category: "politics",
    text: "An empire is only as strong as its provinces. You'd spend most of your time traveling and strengthening the outer regions rather than sitting in the capital.",
    context: "Provincial governor vs. capital dweller.",
    likeText: "Tour the provinces",
    dislikeText: "Rule from the center",
    agree: { hadrian: 3, trajan: 2, septimius_severus: 1, marcus_aurelius: 1, julian: 1 },
    disagree: { tiberius: 2, nero: 2, justinian: 2, claudius: 1, commodus: 1 }
  }
];