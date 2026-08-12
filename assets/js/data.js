/*
 * History — dataset
 * ------------------------------------------------------------------
 * All figures below are researched historical estimates. Peak land
 * areas follow the standard scholarly compilations (Taagepera; the
 * "list of largest empires" consensus): British Empire 35.5M km²,
 * Mongol Empire 24M km², Russian Empire 22.8M km², Qing 14.7M km²,
 * Spanish 13.7M km², French colonial 11.5M km², Abbasid 11.1M km².
 * Population share records: Achaemenid Persia ~44% of humanity
 * (c. 480 BC), Qing ~37% (c. 1820), Han ~29% (1 AD).
 *
 * Ancient dates are estimates and are marked "c." where scholars
 * disagree. Portraits and long-form summaries are NOT stored here —
 * they are fetched live from the Wikipedia REST API at runtime
 * (see app.js → wikiSummary), so the page always shows real,
 * current encyclopedia data.
 */

const HISTORY = {};

/* ------------------------------------------------------------------ *
 * 1. WORLD POPULATION  (standard McEvedy & Jones / UN estimates)
 * ------------------------------------------------------------------ */
HISTORY.population = [
  [-10000, 4e6], [-8000, 5e6], [-5000, 5e6], [-3000, 14e6], [-2000, 27e6],
  [-1000, 50e6], [-500, 100e6], [1, 190e6], [200, 190e6], [400, 190e6],
  [600, 200e6], [800, 220e6], [1000, 265e6], [1200, 360e6], [1300, 360e6],
  [1400, 350e6], [1500, 425e6], [1600, 545e6], [1700, 610e6], [1750, 790e6],
  [1800, 900e6], [1850, 1.2e9], [1900, 1.6e9], [1950, 2.5e9], [1970, 3.7e9],
  [2000, 6.1e9], [2026, 8.2e9]
];

/* ------------------------------------------------------------------ *
 * 2. ERAS — the coloured spine of the timeline
 * ------------------------------------------------------------------ */
HISTORY.eras = [
  { id: 'stone',    name: 'Stone Age',        start: -10000, end: -3300, color: '#8d7b68',
    blurb: 'Ice retreats. Humans stop chasing herds and start planting seeds — the single biggest change in our species’ story.' },
  { id: 'bronze',   name: 'Bronze Age',       start: -3300,  end: -1200, color: '#c08552',
    blurb: 'Writing, cities, kings and the first empires. Then, around 1177 BC, most of it collapses at once.' },
  { id: 'iron',     name: 'Iron Age',         start: -1200,  end: -550,  color: '#6b7a8f',
    blurb: 'Cheap iron democratises war. Assyria builds the first true military superpower; Greece invents the polis.' },
  { id: 'classical',name: 'Classical Age',    start: -550,   end: 476,   color: '#c9a227',
    blurb: 'Persia, Greece, India, China and Rome — four corners of Eurasia thinking hard at the same time.' },
  { id: 'medieval', name: 'Medieval World',   start: 476,    end: 1453,  color: '#7b5ea7',
    blurb: 'Islam, Tang China, the Vikings, and a Mongol horse army that stitches Eurasia into one road network.' },
  { id: 'early',    name: 'Early Modern',     start: 1453,   end: 1789,  color: '#2a9d8f',
    blurb: 'Printing, gunpowder and ocean-going ships. Europe reaches every coastline; silver and slavery move the world.' },
  { id: 'industrial', name: 'Industrial Age', start: 1789,   end: 1914,  color: '#e76f51',
    blurb: 'Coal, steam and steel. In one century humans gain more power over matter than in the previous ten thousand years.' },
  { id: 'modern',   name: 'Modern Era',       start: 1914,   end: 1991,  color: '#e63946',
    blurb: 'Two world wars, the atom, the vote for everyone, and a 45-year staring contest between two superpowers.' },
  { id: 'digital',  name: 'Digital Age',      start: 1991,   end: 2026,  color: '#4cc9f0',
    blurb: 'The internet, the smartphone and AI. Eight billion people, one network, and history speeding up again.' }
];

/* ------------------------------------------------------------------ *
 * 3. DOMINANT POWERS — who ran the world, and their banners
 *    flag = stylised SVG spec.  bands: colours top→bottom (or l→r).
 *    glyph: a unicode emblem placed on the field.
 * ------------------------------------------------------------------ */
HISTORY.powers = [
  { id:'neolithic', name:'Neolithic Villages', short:'Neolithic', start:-10000, end:-3300,
    seat:'Fertile Crescent', wiki:'Neolithic_Revolution',
    area:null, popShare:null, capital:'Çatalhöyük · Jericho · Göbekli Tepe',
    flag:{ bands:['#a3907c','#8d7b68'], dir:'h', glyph:'ᛒ', ink:'#f2e8dc' },
    fact:'No kings, no writing, no armies — but Göbekli Tepe (c. 9600 BC) proves hunter-gatherers built temples 7,000 years before the pyramids.' },

  { id:'sumer', name:'Sumerian City-States', short:'Sumer', start:-3300, end:-2334,
    seat:'Mesopotamia', wiki:'Sumer', area:0.1, popShare:2, capital:'Uruk · Ur · Lagash',
    flag:{ bands:['#3f6f8f','#d9b36c'], dir:'h', glyph:'\u{1330F}', ink:'#1b2430' },
    fact:'Uruk invented writing around 3200 BC — and the first thing humanity ever wrote down was a receipt for barley.' },

  { id:'akkad', name:'Akkadian Empire', short:'Akkad', start:-2334, end:-2154,
    seat:'Mesopotamia', wiki:'Akkadian_Empire', area:0.8, popShare:8, capital:'Akkad',
    flag:{ bands:['#8c2f39','#c9a227'], dir:'h', glyph:'✵', ink:'#f6e7c1' },
    fact:'Sargon of Akkad built the first empire in history and claimed to have fought 34 battles without losing one.' },

  { id:'egypt-old', name:'Old & Middle Kingdom Egypt', short:'Egypt', start:-2686, end:-1550,
    seat:'Nile Valley', wiki:'Old_Kingdom_of_Egypt', area:0.4, popShare:5, capital:'Memphis · Thebes',
    flag:{ bands:['#e9c46a','#1d7874'], dir:'h', glyph:'\u{13080}', ink:'#12262c' },
    fact:'The Great Pyramid stayed the tallest building on Earth for 3,800 years — a record no structure has come close to since.' },

  { id:'babylon-old', name:'Old Babylonian Empire', short:'Babylon', start:-1894, end:-1595,
    seat:'Mesopotamia', wiki:'First_Babylonian_dynasty', area:0.5, popShare:5, capital:'Babylon',
    flag:{ bands:['#264b96','#c9a227'], dir:'v', glyph:'⚖', ink:'#f6e7c1' },
    fact:'Hammurabi carved 282 laws into a 2.25 m stone pillar so that "the strong should not harm the weak" — the oldest law code we can still read in full.' },

  { id:'egypt-new', name:'New Kingdom Egypt', short:'New Kingdom', start:-1550, end:-1077,
    seat:'Nile & Levant', wiki:'New_Kingdom_of_Egypt', area:1.0, popShare:6, capital:'Thebes',
    flag:{ bands:['#1d7874','#e9c46a','#8c2f39'], dir:'h', glyph:'☉', ink:'#12262c' },
    fact:'Kadesh (1274 BC) was the largest chariot battle ever fought — and produced the first peace treaty in history, copies of which survive in both Egyptian and Hittite.' },

  { id:'assyria', name:'Neo-Assyrian Empire', short:'Assyria', start:-911, end:-609,
    seat:'Near East', wiki:'Neo-Assyrian_Empire', area:1.4, popShare:10, capital:'Nineveh',
    flag:{ bands:['#6d071a','#3d3d3d'], dir:'h', glyph:'\u{1F3F9}', ink:'#e8d8b0' },
    fact:'Assyria ran the world’s first professional standing army, first siege engineering corps, and first imperial postal road network.' },

  { id:'babylon-neo', name:'Neo-Babylonian Empire', short:'Neo-Babylon', start:-626, end:-539,
    seat:'Mesopotamia', wiki:'Neo-Babylonian_Empire', area:0.5, popShare:6, capital:'Babylon',
    flag:{ bands:['#1b4f9c','#e0a458'], dir:'h', glyph:'\u{1F981}', ink:'#f6e7c1' },
    fact:'Nebuchadnezzar II rebuilt Babylon with the blue-glazed Ishtar Gate — and, legend says, the Hanging Gardens for a homesick queen.' },

  { id:'persia', name:'Achaemenid Persian Empire', short:'Persia', start:-550, end:-330,
    seat:'Iran → Egypt → Indus', wiki:'Achaemenid_Empire', area:5.5, popShare:44, capital:'Persepolis · Susa',
    flag:{ bands:['#7d1128','#c9a227','#1d3557'], dir:'h', glyph:'\u{1F985}', ink:'#f6e7c1' },
    fact:'Still the record holder: around 480 BC roughly 44% of every human alive answered to the Persian king — a share no empire has ever matched.' },

  { id:'macedon', name:'Macedonian Empire', short:'Macedon', start:-336, end:-323,
    seat:'Greece → India', wiki:'Macedonian_Empire', area:5.2, popShare:23, capital:'Babylon · Pella',
    flag:{ bands:['#d4af37','#1b2430'], dir:'h', glyph:'✹', ink:'#1b2430' },
    fact:'Alexander conquered 5.2 million km² in 12 years, never lost a battle, and died at 32 without naming an heir.' },

  { id:'maurya', name:'Maurya Empire', short:'Maurya', start:-322, end:-185,
    seat:'Indian subcontinent', wiki:'Maurya_Empire', area:5.0, popShare:30, capital:'Pataliputra',
    flag:{ bands:['#f4a261','#e9c46a'], dir:'h', glyph:'☸', ink:'#1d3557' },
    fact:'After the Kalinga war killed 100,000 people, Ashoka renounced conquest, converted to Buddhism, and carved his apology into rocks across India.' },

  { id:'han', name:'Han Dynasty China', short:'Han China', start:-202, end:220,
    seat:'East Asia', wiki:'Han_dynasty', area:6.5, popShare:29, capital:'Chang’an · Luoyang',
    flag:{ bands:['#8c1c13','#1b2430'], dir:'h', glyph:'\u{1F409}', ink:'#e9c46a' },
    fact:'The Han opened the Silk Road, invented paper and the seismograph, and gave the majority of Chinese people the name they still use for themselves.' },

  { id:'rome', name:'Roman Empire', short:'Rome', start:-27, end:476,
    seat:'Mediterranean', wiki:'Roman_Empire', area:5.0, popShare:21, capital:'Rome · Constantinople',
    flag:{ bands:['#7d1128','#c9a227'], dir:'v', glyph:'\u{1F985}', ink:'#f6e7c1' },
    fact:'At its 117 AD peak under Trajan, Rome ruled from Scotland to the Persian Gulf — and you could walk 80,000 km of paved road without leaving it.' },

  { id:'byzantine', name:'Byzantine Empire', short:'Byzantium', start:330, end:1453,
    seat:'Eastern Mediterranean', wiki:'Byzantine_Empire', area:2.7, popShare:10, capital:'Constantinople',
    flag:{ bands:['#c9a227','#7d1128'], dir:'h', glyph:'\u{1F985}', ink:'#7d1128' },
    fact:'Rome did not fall in 476 — its eastern half kept going for another thousand years, until cannon breached Constantinople in 1453.' },

  { id:'sasanian', name:'Sasanian Empire', short:'Sasanian Persia', start:224, end:651,
    seat:'Iran & Mesopotamia', wiki:'Sasanian_Empire', area:3.5, popShare:14, capital:'Ctesiphon',
    flag:{ bands:['#5c2a9d','#c9a227'], dir:'h', glyph:'\u{1F525}', ink:'#f6e7c1' },
    fact:'Rome and Sasanian Persia fought for 400 years — then exhausted each other so completely that Arab armies took both in a single generation.' },

  { id:'umayyad', name:'Umayyad Caliphate', short:'Umayyad', start:661, end:750,
    seat:'Spain → Central Asia', wiki:'Umayyad_Caliphate', area:11.1, popShare:29, capital:'Damascus',
    flag:{ bands:['#f4f1de','#e9edc9'], dir:'h', glyph:'☄', ink:'#2a2a2a' },
    fact:'In under 100 years the caliphate grew from a single Arabian city to 11.1 million km² — the fastest empire expansion in recorded history.' },

  { id:'abbasid', name:'Abbasid Caliphate', short:'Abbasid', start:750, end:1258,
    seat:'Baghdad & the Islamic world', wiki:'Abbasid_Caliphate', area:11.1, popShare:20, capital:'Baghdad',
    flag:{ bands:['#1a1a1a','#2b2b2b'], dir:'h', glyph:'\u{1F4D6}', ink:'#e9c46a' },
    fact:'Baghdad’s House of Wisdom paid translators the weight of each finished book in gold, preserving Greek science for the whole world.' },

  { id:'tang', name:'Tang Dynasty China', short:'Tang China', start:618, end:907,
    seat:'East Asia', wiki:'Tang_dynasty', area:5.4, popShare:22, capital:'Chang’an',
    flag:{ bands:['#e9c46a','#8c1c13'], dir:'h', glyph:'\u{1F338}', ink:'#8c1c13' },
    fact:'Chang’an was the largest city on Earth with a million residents — and printed the world’s first dated book in 868 AD.' },

  { id:'mongol', name:'Mongol Empire', short:'Mongols', start:1206, end:1368,
    seat:'Eurasia', wiki:'Mongol_Empire', area:24.0, popShare:25, capital:'Karakorum · Dadu',
    flag:{ bands:['#2b2b2b','#1b2430'], dir:'h', glyph:'☸', ink:'#e9c46a', tamga:true },
    fact:'The largest contiguous land empire ever: 24 million km². A traveller could ride from Korea to Hungary under one law — the Pax Mongolica.' },

  { id:'mali', name:'Mali Empire', short:'Mali', start:1235, end:1670,
    seat:'West Africa', wiki:'Mali_Empire', area:1.1, popShare:5, capital:'Niani · Timbuktu',
    flag:{ bands:['#e9c46a','#2a9d8f'], dir:'v', glyph:'\u{1F42B}', ink:'#1b2430' },
    fact:'Mansa Musa gave away so much gold crossing Egypt in 1324 that he crashed the Mediterranean gold price for a decade.' },

  { id:'ottoman', name:'Ottoman Empire', short:'Ottomans', start:1299, end:1922,
    seat:'Anatolia · Balkans · Levant', wiki:'Ottoman_Empire', area:5.2, popShare:7, capital:'Constantinople / Istanbul',
    flag:{ bands:['#c1121f','#9d0208'], dir:'h', glyph:'☪', ink:'#ffffff' },
    fact:'The Ottomans took Constantinople in 1453 with the largest cannon yet built — ending the Roman state after 2,206 years.' },

  { id:'ming', name:'Ming Dynasty China', short:'Ming China', start:1368, end:1644,
    seat:'East Asia', wiki:'Ming_dynasty', area:6.5, popShare:28, capital:'Nanjing · Beijing',
    flag:{ bands:['#c1121f','#e9c46a'], dir:'h', glyph:'\u{1F3EE}', ink:'#7d1128' },
    fact:'Zheng He’s treasure ships were five times the length of Columbus’s Santa María — then the fleet was burned and China turned inward.' },

  { id:'inca', name:'Inca Empire', short:'Inca', start:1438, end:1533,
    seat:'Andes', wiki:'Inca_Empire', area:2.0, popShare:2, capital:'Cusco',
    flag:{ bands:['#e63946','#f77f00','#fcbf49','#06d6a0','#118ab2','#7209b7'], dir:'h', glyph:'☀', ink:'#ffffff' },
    fact:'The Inca ran a 40,000 km road empire with no wheels, no iron and no writing — accounts were kept in knotted strings called quipu.' },

  { id:'spain', name:'Spanish Empire', short:'Spain', start:1492, end:1898,
    seat:'Global', wiki:'Spanish_Empire', area:13.7, popShare:12, capital:'Madrid',
    flag:{ bands:['#c60b1e','#ffc400','#c60b1e'], dir:'h', glyph:'\u{1F451}', ink:'#7d1128' },
    fact:'The first empire "on which the sun never set" — Potosí silver from Bolivia became the world’s first global currency, circulating in Ming China.' },

  { id:'mughal', name:'Mughal Empire', short:'Mughals', start:1526, end:1857,
    seat:'Indian subcontinent', wiki:'Mughal_Empire', area:4.0, popShare:23, capital:'Agra · Delhi',
    flag:{ bands:['#0d7c3e','#e9c46a'], dir:'h', glyph:'\u{1F5FF}', ink:'#f6e7c1' },
    fact:'Around 1700 the Mughals produced roughly a quarter of the entire world economy — and built the Taj Mahal with 1,000 elephants hauling marble.' },

  { id:'qing', name:'Qing Dynasty China', short:'Qing China', start:1636, end:1912,
    seat:'East Asia', wiki:'Qing_dynasty', area:14.7, popShare:37, capital:'Beijing',
    flag:{ bands:['#f6d55c','#e8b04b'], dir:'h', glyph:'\u{1F409}', ink:'#1b4f9c' },
    fact:'Around 1820 more than one in three humans alive was a Qing subject — the second-highest population share any state has ever held.' },

  { id:'russia', name:'Russian Empire', short:'Russia', start:1721, end:1917,
    seat:'Eurasia', wiki:'Russian_Empire', area:22.8, popShare:8, capital:'St Petersburg',
    flag:{ bands:['#ffffff','#0039a6','#d52b1e'], dir:'h', glyph:'\u{1F985}', ink:'#c9a227' },
    fact:'The third-largest empire ever — one sixth of all land on Earth, spanning eleven time zones and once including Alaska.' },

  { id:'france-nap', name:'Napoleonic France', short:'France', start:1804, end:1815,
    seat:'Europe', wiki:'First_French_Empire', area:2.1, popShare:4, capital:'Paris',
    flag:{ bands:['#0055a4','#ffffff','#ef4135'], dir:'v', glyph:'\u{1F41D}', ink:'#c9a227' },
    fact:'Napoleon lost half a million men in Russia in 1812 — but his Civil Code still underpins the law of some 70 countries.' },

  { id:'britain', name:'British Empire', short:'Britain', start:1815, end:1956,
    seat:'Global', wiki:'British_Empire', area:35.5, popShare:23, capital:'London',
    flag:{ bands:['#012169','#ffffff','#c8102e'], dir:'union', glyph:'', ink:'#ffffff' },
    fact:'The largest empire in history: 35.5 million km² in 1920 — a quarter of all land and a quarter of all people.' },

  { id:'usa-ussr', name:'The Cold War Bipolar Order', short:'USA ⚔ USSR', start:1945, end:1991,
    seat:'Global', wiki:'Cold_War', area:22.4, popShare:15, capital:'Washington · Moscow',
    flag:{ bands:['#b22234','#ffffff','#cc0000'], dir:'split', glyph:'☭', ink:'#ffd700' },
    fact:'Two states, ~60,000 nuclear warheads at the 1986 peak, and 45 years in which they never once fought each other directly.' },

  { id:'usa', name:'United States', short:'United States', start:1991, end:2026,
    seat:'Global', wiki:'United_States', area:9.8, popShare:4, capital:'Washington, D.C.',
    flag:{ bands:['#b22234','#ffffff','#3c3b6e'], dir:'stars', glyph:'', ink:'#ffffff' },
    fact:'After 1991 one country held roughly 25% of world GDP and 40% of world military spending — the closest thing history has seen to a single global hegemon.' }
];

/* ------------------------------------------------------------------ *
 * 4. TIMELINE EVENTS
 * ------------------------------------------------------------------ */
HISTORY.events = [
  { y:-9600, t:'Göbekli Tepe raised',        d:'Hunter-gatherers in Anatolia carve and erect T-shaped megaliths — monumental religion arrives 7,000 years before the pyramids.', tag:'stone', icon:'🗿' },
  { y:-9500, t:'Farming begins',             d:'Wheat, barley, sheep and goats are domesticated in the Fertile Crescent. Jericho becomes a permanent farming town.', tag:'stone', icon:'🌾' },
  { y:-7400, t:'Çatalhöyük',                 d:'Up to 8,000 people live in a honeycomb town in Anatolia, entering their houses through the roof.', tag:'stone', icon:'🏘️' },
  { y:-3300, t:'Writing invented',           d:'Cuneiform appears in Uruk. Humanity gains an external memory — and history, literally, begins.', tag:'bronze', icon:'✍️' },
  { y:-3100, t:'Egypt unified',              d:'Narmer joins Upper and Lower Egypt into the first territorial nation-state.', tag:'bronze', icon:'👑' },
  { y:-2560, t:'Great Pyramid of Giza',      d:'2.3 million blocks, aligned to true north within a twentieth of a degree. Tallest structure on Earth for 3,800 years.', tag:'bronze', icon:'🔺' },
  { y:-2334, t:'The first empire',           d:'Sargon of Akkad conquers Sumer and invents the idea of ruling many peoples under one crown.', tag:'bronze', icon:'⚔️' },
  { y:-1792, t:'Code of Hammurabi',          d:'Babylon publishes 282 laws in stone — the state now answers to written rules, not just the king’s mood.', tag:'bronze', icon:'⚖️' },
  { y:-1274, t:'Battle of Kadesh',           d:'Ramesses II vs the Hittites: the largest chariot battle ever, followed by the first surviving peace treaty.', tag:'bronze', icon:'🐎' },
  { y:-1177, t:'Bronze Age Collapse',        d:'Within a generation, Mycenae, the Hittites and half the Mediterranean world simply stop. Writing is lost for centuries.', tag:'bronze', icon:'🌋' },
  { y:-776,  t:'First Olympic Games',        d:'Greek city-states pause their wars every four years to run, wrestle and throw things.', tag:'iron', icon:'🏛️' },
  { y:-753,  t:'Rome founded',               d:'A hill village on the Tiber begins a 2,200-year run as a state.', tag:'iron', icon:'🐺' },
  { y:-563,  t:'The Buddha born',            d:'Siddhartha Gautama, Confucius, Laozi and the Hebrew prophets all appear within ~150 years — the Axial Age.', tag:'iron', icon:'☸️' },
  { y:-550,  t:'Cyrus founds Persia',        d:'The Achaemenid Empire grows to rule 44% of humanity — a record that still stands.', tag:'classical', icon:'🦅' },
  { y:-508,  t:'Athenian democracy',         d:'Cleisthenes hands power to an assembly of citizens. The idea takes 2,400 years to catch on.', tag:'classical', icon:'🗳️' },
  { y:-480,  t:'Thermopylae & Salamis',      d:'A few hundred Greek ships stop the largest empire on Earth, and Greek thought survives to shape the West.', tag:'classical', icon:'⛵' },
  { y:-331,  t:'Alexander takes Persia',     d:'At Gaugamela a 25-year-old Macedonian shatters the Achaemenid army and inherits the world.', tag:'classical', icon:'🐴' },
  { y:-261,  t:'Ashoka’s conversion',   d:'Sickened by the slaughter at Kalinga, India’s greatest conqueror renounces war and spreads Buddhism across Asia.', tag:'classical', icon:'🕊️' },
  { y:-221,  t:'China unified',              d:'Qin Shi Huang standardises script, coins, axle-widths and law — and starts the Great Wall.', tag:'classical', icon:'🧱' },
  { y:-218,  t:'Hannibal crosses the Alps',  d:'37 elephants over the mountains. Rome loses 50,000 men at Cannae and still refuses to surrender.', tag:'classical', icon:'🐘' },
  { y:-44,   t:'Caesar assassinated',        d:'The Republic dies with him; his heir Augustus builds the Empire that replaces it.', tag:'classical', icon:'🗡️' },
  { y:30,    t:'Crucifixion of Jesus',       d:'An execution in a minor province seeds the religion that will claim a third of humanity.', tag:'classical', icon:'✝️' },
  { y:105,   t:'Paper invented',             d:'Cai Lun standardises papermaking in Han China. It reaches Europe 1,100 years later.', tag:'classical', icon:'📄' },
  { y:117,   t:'Rome at its greatest extent',d:'Trajan’s empire: 5 million km², 21% of humanity, 80,000 km of paved road.', tag:'classical', icon:'🏛️' },
  { y:313,   t:'Edict of Milan',             d:'Constantine legalises Christianity; within a century it is the empire’s official faith.', tag:'classical', icon:'⛪' },
  { y:476,   t:'Fall of Western Rome',       d:'Romulus Augustulus is deposed. The eastern half carries on for another 977 years.', tag:'classical', icon:'💀' },
  { y:622,   t:'The Hijra',                  d:'Muhammad moves to Medina. Year one of the Islamic calendar; within a century Islam rules from Spain to India.', tag:'medieval', icon:'🌙' },
  { y:751,   t:'Battle of Talas',            d:'Abbasid and Tang armies clash in Central Asia — and papermaking escapes China to the Islamic world.', tag:'medieval', icon:'📜' },
  { y:800,   t:'Charlemagne crowned',        d:'A Frankish king is made "Emperor of the Romans", inventing the idea of Europe.', tag:'medieval', icon:'👑' },
  { y:830,   t:'House of Wisdom',            d:'Baghdad becomes the planet’s research capital: algebra, optics, medicine and the preservation of Greek science.', tag:'medieval', icon:'📚' },
  { y:1066,  t:'Norman Conquest',            d:'One battle rewires the language, law and aristocracy of England — and eventually a third of the globe.', tag:'medieval', icon:'🏹' },
  { y:1206,  t:'Genghis Khan proclaimed',    d:'Temüjin unites the steppe tribes and begins assembling the largest contiguous empire ever.', tag:'medieval', icon:'🏇' },
  { y:1215,  t:'Magna Carta',                d:'English barons force a king to accept that he, too, is under the law.', tag:'medieval', icon:'📜' },
  { y:1258,  t:'Sack of Baghdad',            d:'The Mongols end the Abbasid Caliphate; the Tigris is said to have run black with the ink of books.', tag:'medieval', icon:'🔥' },
  { y:1324,  t:'Mansa Musa’s hajj',     d:'Mali’s emperor spends so much gold in Cairo that he devalues the metal across the Mediterranean.', tag:'medieval', icon:'💰' },
  { y:1347,  t:'The Black Death',            d:'In seven years plague kills 30–50% of Europe. Labour becomes scarce, serfdom cracks, wages rise.', tag:'medieval', icon:'☠️' },
  { y:1405,  t:'Zheng He sets sail',         d:'Chinese treasure fleets reach East Africa — 87 years before Columbus, with ships five times larger.', tag:'medieval', icon:'🚢' },
  { y:1440,  t:'Gutenberg’s press',     d:'Movable type in Mainz. Information becomes cheap, and no monarch or church ever fully controls it again.', tag:'medieval', icon:'🖨️' },
  { y:1453,  t:'Fall of Constantinople',     d:'Ottoman cannon breach the walls. The Roman state, 2,206 years old, finally ends.', tag:'medieval', icon:'🏰' },
  { y:1492,  t:'Columbus reaches America',   d:'Two biospheres separated for 12,000 years collide. The Columbian Exchange reshapes every continent’s diet.', tag:'early', icon:'🧭' },
  { y:1517,  t:'The Reformation',            d:'Luther’s 95 theses + the printing press = Europe’s first viral document and 130 years of religious war.', tag:'early', icon:'⛪' },
  { y:1543,  t:'Copernicus moves the Earth', d:'The Sun, not us, sits at the centre. The Scientific Revolution begins.', tag:'early', icon:'🌞' },
  { y:1687,  t:'Newton’s Principia',    d:'Three laws and gravity explain both falling apples and orbiting moons. Nature turns out to be mathematical.', tag:'early', icon:'🍎' },
  { y:1776,  t:'American independence',      d:'Thirteen colonies declare that governments derive power from the consent of the governed.', tag:'early', icon:'🇺🇸' },
  { y:1789,  t:'French Revolution',          d:'Liberty, equality, fraternity — and the guillotine. Monarchy stops being the default form of government.', tag:'industrial', icon:'🎭' },
  { y:1804,  t:'Haitian independence',       d:'The only successful large-scale slave revolt in history founds a free black republic.', tag:'industrial', icon:'⛓️' },
  { y:1825,  t:'The railway age',            d:'Stockton–Darlington opens. Land travel becomes faster than a horse for the first time ever.', tag:'industrial', icon:'🚂' },
  { y:1859,  t:'On the Origin of Species',   d:'Darwin explains life without design — arguably the single most consequential idea in biology.', tag:'industrial', icon:'🧬' },
  { y:1869,  t:'Suez Canal & Periodic Table',d:'The world’s shipping map and the world’s chemistry are both redrawn in one year.', tag:'industrial', icon:'⚗️' },
  { y:1879,  t:'Practical electric light',   d:'Edison’s lamp, then the grid. Human activity is unhooked from the sun.', tag:'industrial', icon:'💡' },
  { y:1903,  t:'First powered flight',       d:'12 seconds at Kitty Hawk. 66 years later a human walks on the Moon.', tag:'industrial', icon:'✈️' },
  { y:1914,  t:'World War I',                d:'Four empires — German, Austro-Hungarian, Ottoman and Russian — do not survive it. 17 million die.', tag:'modern', icon:'💣' },
  { y:1917,  t:'Russian Revolution',         d:'The Bolsheviks seize power and communism becomes a state project covering a sixth of the planet.', tag:'modern', icon:'☭' },
  { y:1928,  t:'Penicillin',                 d:'Fleming’s mouldy dish begins the antibiotic era and adds decades to average human life.', tag:'modern', icon:'💊' },
  { y:1939,  t:'World War II',               d:'The deadliest conflict ever: 70–85 million dead, including six million Jews murdered in the Holocaust.', tag:'modern', icon:'🌍' },
  { y:1945,  t:'Hiroshima & the UN',         d:'Humanity acquires the means to end itself — and, months later, builds an institution to try to prevent it.', tag:'modern', icon:'☢️' },
  { y:1947,  t:'Indian independence',        d:'400 million people leave the British Empire. Decolonisation becomes unstoppable.', tag:'modern', icon:'🇮🇳' },
  { y:1953,  t:'Structure of DNA',           d:'Franklin’s photograph, Watson and Crick’s double helix. Life gets a readable source code.', tag:'modern', icon:'🧬' },
  { y:1969,  t:'Apollo 11',                  d:'600 million people watch two humans walk on another world.', tag:'modern', icon:'🌕' },
  { y:1989,  t:'The Berlin Wall falls',      d:'Eastern Europe frees itself in months, mostly without bloodshed.', tag:'modern', icon:'🧱' },
  { y:1991,  t:'USSR dissolves · Web opens', d:'The Cold War ends and Tim Berners-Lee puts the World Wide Web into the public domain — in the same year.', tag:'digital', icon:'🌐' },
  { y:2007,  t:'The smartphone',             d:'A connected computer in every pocket. Within 15 years, most of humanity is online.', tag:'digital', icon:'📱' },
  { y:2020,  t:'COVID-19 pandemic',          d:'The first truly global pandemic of the connected age — and vaccines designed in days, deployed in months.', tag:'digital', icon:'🦠' },
  { y:2022,  t:'8 billion humans · AI arrives', d:'World population passes 8 billion as generative AI becomes the fastest-adopted technology in history.', tag:'digital', icon:'🤖' }
];

/* ------------------------------------------------------------------ *
 * 5. FIGURES — wiki = exact Wikipedia title used for the live fetch
 * ------------------------------------------------------------------ */
HISTORY.figures = [
  { n:'Imhotep',            wiki:'Imhotep',                 b:-2650, d:-2600, era:'bronze',    role:'Architect & physician', pl:'Egypt',   why:'Designed the first pyramid and became the only commoner ever worshipped as a god of medicine.' },
  { n:'Sargon of Akkad',    wiki:'Sargon_of_Akkad',         b:-2334, d:-2279, era:'bronze',    role:'Emperor',  pl:'Akkad',     why:'Built the first empire in world history.' },
  { n:'Khufu',              wiki:'Khufu',                   b:-2589, d:-2566, era:'bronze',    role:'Pharaoh',  pl:'Egypt',     why:'Commissioned the Great Pyramid of Giza.' },
  { n:'Hammurabi',          wiki:'Hammurabi',               b:-1810, d:-1750, era:'bronze',    role:'King',     pl:'Babylon',   why:'Published the most complete law code of the ancient world.' },
  { n:'Hatshepsut',         wiki:'Hatshepsut',              b:-1507, d:-1458, era:'bronze',    role:'Pharaoh',  pl:'Egypt',     why:'One of the most successful pharaohs — and a woman who ruled as king.' },
  { n:'Ramesses II',        wiki:'Ramesses_II',             b:-1303, d:-1213, era:'bronze',    role:'Pharaoh',  pl:'Egypt',     why:'Reigned 66 years and signed the first known peace treaty.' },
  { n:'Ashurbanipal',       wiki:'Ashurbanipal',            b:-685,  d:-631,  era:'iron',      role:'King',     pl:'Assyria',   why:'Assembled the first systematically collected library on Earth.' },
  { n:'Nebuchadnezzar II',  wiki:'Nebuchadnezzar_II',       b:-634,  d:-562,  era:'iron',      role:'King',     pl:'Babylon',   why:'Rebuilt Babylon into the ancient world’s most spectacular city.' },
  { n:'Laozi',              wiki:'Laozi',                   b:-601,  d:-531,  era:'iron',      role:'Philosopher', pl:'China',  why:'Founding text of Daoism, shaping 2,500 years of Chinese thought.' },
  { n:'Cyrus the Great',    wiki:'Cyrus_the_Great',         b:-600,  d:-530,  era:'classical', role:'Emperor',  pl:'Persia',    why:'Founded the largest empire the world had yet seen — and ruled it with unusual tolerance.' },
  { n:'Gautama Buddha',     wiki:'Gautama_Buddha',          b:-563,  d:-483,  era:'iron',      role:'Teacher',  pl:'India',     why:'Founded Buddhism, now followed by half a billion people.' },
  { n:'Confucius',          wiki:'Confucius',               b:-551,  d:-479,  era:'iron',      role:'Philosopher', pl:'China',   why:'His ethics organised Chinese government and family life for two millennia.' },
  { n:'Darius the Great',   wiki:'Darius_the_Great',        b:-550,  d:-486,  era:'classical', role:'Emperor',  pl:'Persia',    why:'Ran an empire of 44% of humanity with roads, coinage and satraps.' },
  { n:'Socrates',           wiki:'Socrates',                b:-470,  d:-399,  era:'classical', role:'Philosopher', pl:'Athens',  why:'Invented the method of relentless questioning that underlies Western philosophy.' },
  { n:'Plato',              wiki:'Plato',                   b:-428,  d:-348,  era:'classical', role:'Philosopher', pl:'Athens',  why:'Founded the Academy; all later philosophy is arguably footnotes to him.' },
  { n:'Aristotle',          wiki:'Aristotle',               b:-384,  d:-322,  era:'classical', role:'Philosopher', pl:'Greece',  why:'Systematised logic, biology and physics — the standard textbook for 1,800 years.' },
  { n:'Alexander the Great',wiki:'Alexander_the_Great',     b:-356,  d:-323,  era:'classical', role:'Conqueror', pl:'Macedon',  why:'Conquered from Greece to India by the age of 30, spreading Greek culture across Asia.' },
  { n:'Chandragupta Maurya',wiki:'Chandragupta_Maurya',     b:-340,  d:-297,  era:'classical', role:'Emperor',  pl:'India',     why:'Unified most of the Indian subcontinent for the first time.' },
  { n:'Ashoka',             wiki:'Ashoka',                  b:-304,  d:-232,  era:'classical', role:'Emperor',  pl:'India',     why:'Renounced war at the height of his power and spread Buddhism across Asia.' },
  { n:'Qin Shi Huang',      wiki:'Qin_Shi_Huang',           b:-259,  d:-210,  era:'classical', role:'Emperor',  pl:'China',     why:'Unified China, standardised everything, and was buried with 8,000 terracotta soldiers.' },
  { n:'Hannibal',           wiki:'Hannibal',                b:-247,  d:-183,  era:'classical', role:'General',  pl:'Carthage',  why:'Crossed the Alps with elephants and nearly destroyed Rome.' },
  { n:'Julius Caesar',      wiki:'Julius_Caesar',           b:-100,  d:-44,   era:'classical', role:'Dictator', pl:'Rome',      why:'Conquered Gaul, ended the Republic, and gave his name to "emperor" in a dozen languages.' },
  { n:'Cleopatra',          wiki:'Cleopatra',               b:-69,   d:-30,   era:'classical', role:'Pharaoh',  pl:'Egypt',     why:'The last pharaoh, who played Roman politics for 20 years to keep Egypt independent.' },
  { n:'Augustus',           wiki:'Augustus',                b:-63,   d:14,    era:'classical', role:'Emperor',  pl:'Rome',      why:'Founded the Roman Empire and 200 years of Mediterranean peace.' },
  { n:'Jesus',              wiki:'Jesus',                   b:-4,    d:30,    era:'classical', role:'Preacher', pl:'Judea',     why:'Central figure of Christianity, the largest religion in history.' },
  { n:'Trajan',             wiki:'Trajan',                  b:53,    d:117,   era:'classical', role:'Emperor',  pl:'Rome',      why:'Took Rome to its greatest territorial extent.' },
  { n:'Marcus Aurelius',    wiki:'Marcus_Aurelius',         b:121,   d:180,   era:'classical', role:'Emperor',  pl:'Rome',      why:'Ruled the world and wrote a private diary that is still a bestselling philosophy book.' },
  { n:'Constantine the Great', wiki:'Constantine_the_Great',b:272,   d:337,   era:'classical', role:'Emperor',  pl:'Rome',      why:'Legalised Christianity and founded Constantinople.' },
  { n:'Attila',             wiki:'Attila',                  b:406,   d:453,   era:'classical', role:'Khagan',   pl:'Huns',      why:'The Scourge of God — terror of both halves of the Roman world.' },
  { n:'Justinian I',        wiki:'Justinian_I',             b:482,   d:565,   era:'medieval',  role:'Emperor',  pl:'Byzantium', why:'Codified Roman law into the basis of most European legal systems.' },
  { n:'Muhammad',           wiki:'Muhammad',                b:570,   d:632,   era:'medieval',  role:'Prophet',  pl:'Arabia',    why:'Founded Islam and a state that became a world empire within a century.' },
  { n:'Wu Zetian',          wiki:'Wu_Zetian',               b:624,   d:705,   era:'medieval',  role:'Empress',  pl:'China',     why:'The only woman to rule China in her own name, over a golden age.' },
  { n:'Charlemagne',        wiki:'Charlemagne',             b:748,   d:814,   era:'medieval',  role:'Emperor',  pl:'Francia',   why:'United Western Europe and revived learning after the Roman collapse.' },
  { n:'Harun al-Rashid',    wiki:'Harun_al-Rashid',         b:763,   d:809,   era:'medieval',  role:'Caliph',   pl:'Baghdad',   why:'Presided over the Islamic Golden Age and the world’s richest court.' },
  { n:'Al-Khwarizmi',       wiki:'Al-Khwarizmi',            b:780,   d:850,   era:'medieval',  role:'Mathematician', pl:'Baghdad', why:'Gave us algebra — and, from his name, the word "algorithm".' },
  { n:'Avicenna',           wiki:'Avicenna',                b:980,   d:1037,  era:'medieval',  role:'Physician', pl:'Persia',   why:'His Canon of Medicine was the standard medical text in Europe for 600 years.' },
  { n:'Genghis Khan',       wiki:'Genghis_Khan',            b:1162,  d:1227,  era:'medieval',  role:'Khagan',   pl:'Mongolia',  why:'Built the largest contiguous land empire ever assembled.' },
  { n:'Saladin',            wiki:'Saladin',                 b:1137,  d:1193,  era:'medieval',  role:'Sultan',   pl:'Egypt/Syria', why:'Retook Jerusalem and was admired even by his crusader enemies.' },
  { n:'Kublai Khan',        wiki:'Kublai_Khan',             b:1215,  d:1294,  era:'medieval',  role:'Emperor',  pl:'Yuan China', why:'Completed the Mongol conquest of China and hosted Marco Polo.' },
  { n:'Marco Polo',         wiki:'Marco_Polo',              b:1254,  d:1324,  era:'medieval',  role:'Merchant', pl:'Venice',    why:'His travel book made Europe hungry for Asia — Columbus carried a copy.' },
  { n:'Mansa Musa',         wiki:'Mansa_Musa',              b:1280,  d:1337,  era:'medieval',  role:'Emperor',  pl:'Mali',      why:'Very likely the richest individual in all of history.' },
  { n:'Ibn Battuta',        wiki:'Ibn_Battuta',             b:1304,  d:1369,  era:'medieval',  role:'Explorer', pl:'Morocco',   why:'Travelled ~120,000 km across Africa, Asia and Europe — three times Marco Polo’s range.' },
  { n:'Timur',              wiki:'Timur',                   b:1336,  d:1405,  era:'medieval',  role:'Conqueror',pl:'Samarkand', why:'The last great steppe conqueror; ancestor of the Mughal dynasty.' },
  { n:'Zheng He',           wiki:'Zheng_He',                b:1371,  d:1433,  era:'medieval',  role:'Admiral',  pl:'Ming China',why:'Commanded treasure fleets to Africa decades before Europe’s age of sail.' },
  { n:'Joan of Arc',        wiki:'Joan_of_Arc',             b:1412,  d:1431,  era:'medieval',  role:'Commander',pl:'France',    why:'A teenage peasant who turned the Hundred Years’ War and was burned for it at 19.' },
  { n:'Johannes Gutenberg', wiki:'Johannes_Gutenberg',      b:1400,  d:1468,  era:'medieval',  role:'Printer',  pl:'Mainz',     why:'Movable type — arguably the most disruptive invention before the internet.' },
  { n:'Mehmed II',          wiki:'Mehmed_the_Conqueror',    b:1432,  d:1481,  era:'medieval',  role:'Sultan',   pl:'Ottoman',   why:'Took Constantinople at 21, ending the Roman state.' },
  { n:'Christopher Columbus',wiki:'Christopher_Columbus',   b:1451,  d:1506,  era:'early',     role:'Navigator',pl:'Genoa/Spain', why:'Reconnected two hemispheres separated for 12,000 years — with catastrophic consequences for the Americas.' },
  { n:'Leonardo da Vinci',  wiki:'Leonardo_da_Vinci',       b:1452,  d:1519,  era:'early',     role:'Polymath', pl:'Florence',  why:'Painter, anatomist and engineer — the definition of a Renaissance mind.' },
  { n:'Nicolaus Copernicus',wiki:'Nicolaus_Copernicus',     b:1473,  d:1543,  era:'early',     role:'Astronomer',pl:'Poland',   why:'Moved the Earth out of the centre of the universe.' },
  { n:'Michelangelo',       wiki:'Michelangelo',            b:1475,  d:1564,  era:'early',     role:'Artist',   pl:'Florence',  why:'The Sistine Chapel and the David — the peak of Renaissance art.' },
  { n:'Martin Luther',      wiki:'Martin_Luther',           b:1483,  d:1546,  era:'early',     role:'Reformer', pl:'Germany',   why:'Split Western Christianity and made vernacular literacy a religious duty.' },
  { n:'Suleiman the Magnificent', wiki:'Suleiman_the_Magnificent', b:1494, d:1566, era:'early', role:'Sultan', pl:'Ottoman',   why:'Took the Ottoman Empire to its cultural and military peak.' },
  { n:'Akbar',              wiki:'Akbar',                   b:1542,  d:1605,  era:'early',     role:'Emperor',  pl:'Mughal India', why:'Ruled a quarter of the world economy and abolished the tax on non-Muslims.' },
  { n:'Elizabeth I',        wiki:'Elizabeth_I',             b:1533,  d:1603,  era:'early',     role:'Queen',    pl:'England',   why:'Held off Spain, launched English seapower, and presided over Shakespeare.' },
  { n:'William Shakespeare',wiki:'William_Shakespeare',     b:1564,  d:1616,  era:'early',     role:'Playwright',pl:'England',  why:'Added ~1,700 words to English and still defines drama worldwide.' },
  { n:'Galileo Galilei',    wiki:'Galileo_Galilei',         b:1564,  d:1642,  era:'early',     role:'Astronomer',pl:'Italy',    why:'Pointed a telescope at the sky and made observation the arbiter of truth.' },
  { n:'Isaac Newton',       wiki:'Isaac_Newton',            b:1643,  d:1727,  era:'early',     role:'Physicist',pl:'England',   why:'Showed the universe runs on mathematics that a human can write down.' },
  { n:'Kangxi Emperor',     wiki:'Kangxi_Emperor',          b:1654,  d:1722,  era:'early',     role:'Emperor',  pl:'Qing China',why:'Reigned 61 years over the most populous state on Earth.' },
  { n:'Peter the Great',    wiki:'Peter_the_Great',         b:1672,  d:1725,  era:'early',     role:'Tsar',     pl:'Russia',    why:'Dragged Russia into Europe and built St Petersburg on a swamp.' },
  { n:'Adam Smith',         wiki:'Adam_Smith',              b:1723,  d:1790,  era:'early',     role:'Economist',pl:'Scotland',  why:'The Wealth of Nations founded modern economics.' },
  { n:'George Washington',  wiki:'George_Washington',       b:1732,  d:1799,  era:'industrial',role:'President', pl:'USA',      why:'Won a revolution — then handed power back, which was the truly radical part.' },
  { n:'Napoleon',           wiki:'Napoleon',                b:1769,  d:1821,  era:'industrial',role:'Emperor',  pl:'France',    why:'Conquered Europe and left behind a legal code still used by 70 countries.' },
  { n:'Simón Bolívar',      wiki:'Sim%C3%B3n_Bol%C3%ADvar', b:1783,  d:1830,  era:'industrial',role:'Liberator',pl:'S. America',why:'Freed six nations from Spanish rule.' },
  { n:'Charles Darwin',     wiki:'Charles_Darwin',          b:1809,  d:1882,  era:'industrial',role:'Naturalist',pl:'England',  why:'Explained the diversity of all life with one mechanism.' },
  { n:'Abraham Lincoln',    wiki:'Abraham_Lincoln',         b:1809,  d:1865,  era:'industrial',role:'President',pl:'USA',       why:'Held the Union together and ended American slavery.' },
  { n:'Karl Marx',          wiki:'Karl_Marx',               b:1818,  d:1883,  era:'industrial',role:'Philosopher',pl:'Germany', why:'His critique of capitalism organised the politics of half the 20th-century world.' },
  { n:'Queen Victoria',     wiki:'Queen_Victoria',          b:1819,  d:1901,  era:'industrial',role:'Queen-Empress',pl:'Britain',why:'Figurehead of the largest empire in history at its zenith.' },
  { n:'Otto von Bismarck',  wiki:'Otto_von_Bismarck',       b:1815,  d:1898,  era:'industrial',role:'Chancellor',pl:'Germany',  why:'Unified Germany and invented the welfare state to outflank socialism.' },
  { n:'Thomas Edison',      wiki:'Thomas_Edison',           b:1847,  d:1931,  era:'industrial',role:'Inventor', pl:'USA',       why:'Light, recorded sound, film — and the industrial research lab itself.' },
  { n:'Nikola Tesla',       wiki:'Nikola_Tesla',            b:1856,  d:1943,  era:'industrial',role:'Engineer', pl:'USA/Serbia',why:'Alternating current — the reason electricity reaches your wall socket.' },
  { n:'Marie Curie',        wiki:'Marie_Curie',             b:1867,  d:1934,  era:'modern',    role:'Physicist',pl:'Poland/France', why:'Only person ever to win Nobel Prizes in two different sciences.' },
  { n:'Mahatma Gandhi',     wiki:'Mahatma_Gandhi',          b:1869,  d:1948,  era:'modern',    role:'Leader',   pl:'India',     why:'Proved that mass nonviolence could defeat the largest empire on Earth.' },
  { n:'Albert Einstein',    wiki:'Albert_Einstein',         b:1879,  d:1955,  era:'modern',    role:'Physicist',pl:'Germany/USA',why:'Rewrote space, time, gravity and energy in a single decade.' },
  { n:'Winston Churchill',  wiki:'Winston_Churchill',       b:1874,  d:1965,  era:'modern',    role:'PM',       pl:'Britain',   why:'Kept Britain in the war during the year it stood alone.' },
  { n:'Adolf Hitler',       wiki:'Adolf_Hitler',            b:1889,  d:1945,  era:'modern',    role:'Dictator', pl:'Germany',   why:'Caused the deadliest war in history and the Holocaust — history’s darkest cautionary tale.' },
  { n:'Mao Zedong',         wiki:'Mao_Zedong',              b:1893,  d:1976,  era:'modern',    role:'Chairman', pl:'China',     why:'Founded the People’s Republic; his policies also caused history’s deadliest famine.' },
  { n:'Alan Turing',        wiki:'Alan_Turing',             b:1912,  d:1954,  era:'modern',    role:'Mathematician',pl:'Britain',why:'Invented the theory of computing and helped break Enigma.' },
  { n:'Nelson Mandela',     wiki:'Nelson_Mandela',          b:1918,  d:2013,  era:'modern',    role:'President',pl:'South Africa',why:'27 years in prison, then chose reconciliation over revenge.' },
  { n:'Martin Luther King Jr.', wiki:'Martin_Luther_King_Jr.', b:1929, d:1968, era:'modern',   role:'Activist', pl:'USA',       why:'Led the movement that dismantled legal segregation in America.' },
  { n:'Neil Armstrong',     wiki:'Neil_Armstrong',          b:1930,  d:2012,  era:'modern',    role:'Astronaut',pl:'USA',       why:'First human to set foot on another world.' },
  { n:'Tim Berners-Lee',    wiki:'Tim_Berners-Lee',         b:1955,  d:null,  era:'digital',   role:'Computer scientist',pl:'Britain', why:'Invented the World Wide Web — and gave it away for free.' }
];

/* Sort helpers used by the UI */
HISTORY.figures.sort((a, b) => a.b - b.b);
HISTORY.events.sort((a, b) => a.y - b.y);
