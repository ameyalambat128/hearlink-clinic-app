export const extractKeywords = (trackId: string, sentenceId: number) => {
  const keywordList = [
    {
      "1": ["white", "silk", "jacket", "any", "shoes"],
      "2": ["child", "crawled", "into", "dense", "grass"],
      "3": ["footprints", "showed", "path", "took", "beach"],
      "4": ["vent", "edge", "brought", "fresh", "air"],
      "5": ["band", "steel", "three", "inches", "wide"],
      "6": ["weight", "package", "seen", "high", "scale"],
    },
    {
      "1": ["tear", "thin", "sheet", "yellow", "pad"],
      "2": ["cruise", "waters", "sleek", "yacht", "fun"],
      "3": ["streak", "color", "down", "left", "edge"],
      "4": ["done", "before", "boy", "could", "see"],
      "5": ["crouch", "before", "jump", "miss", "mark"],
      "6": ["square", "peg", "settle", "round", "hole"],
    },
    {
      "1": ["pitch", "straw", "through", "door", "stable"],
      "2": ["sink", "thing", "which", "pile", "dishes"],
      "3": ["post", "no", "bills", "office", "wall"],
      "4": ["dimes", "showered", "down", "all", "sides"],
      "5": ["pick", "card", "slip", "under", "pack"],
      "6": ["store", "jammed", "before", "sale", "start"],
    },
    {
      "1": ["sense", "smell", "better", "that", "touch"],
      "2": ["picked", "dice", "for", "second", "roll"],
      "3": ["drop", "ashes", "worn", "old", "rug"],
      "4": ["couch", "cover", "hall", "drapes", "blue"],
      "5": ["stems", "tall", "glasses", "cracked", "broke"],
      "6": ["cleat", "sank", "deeply", "soft", "turf"],
    },
    {
      "1": ["have", "better", "than", "wait", "hope"],
      "2": ["screen", "before", "fire", "kept", "sparks"],
      "3": ["thick", "glasses", "helped", "read", "print"],
      "4": ["chair", "looked", "strong", "no", "bottom"],
      "5": ["they", "told", "wild", "tales", "frighten"],
      "6": ["force", "equal", "would", "move", "earth"],
    },
    {
      "1": ["leaf", "drifts", "along", "slow", "spin"],
      "2": ["pencil", "cut", "sharp", "both", "ends"],
      "3": ["down", "road", "way", "grain", "farmer"],
      "4": ["best", "method", "fix", "place", "clips"],
      "5": ["if", "mumble", "speech", "will", "lost"],
      "6": ["toad", "frog", "hard", "tell", "apart"],
    },
    {
      "1": ["kite", "dipped", "swayed", "stayed", "aloft"],
      "2": ["beetle", "droned", "hot", "june", "sun"],
      "3": ["theft", "pearl", "pin", "kept", "secret"],
      "4": ["wide", "grin", "earned", "many", "friends"],
      "5": ["hurdle", "pit", "aid", "long", "pole"],
      "6": ["peep", "under", "tent", "see", "clowns"],
    },
    {
      "1": ["sun", "came", "light", "eastern", "sky"],
      "2": ["stale", "smell", "old", "beer", "lingers"],
      "3": ["desk", "firm", "on", "shaky", "floor"],
      "4": ["list", "names", "carved", "around", "base"],
      "5": ["news", "struck", "doubt", "restless", "minds"],
      "6": ["sand", "drifts", "sill", "old", "house"],
    },
    {
      "1": ["take", "shelter", "tent", "keep", "still"],
      "2": ["little", "tales", "they", "tell", "false"],
      "3": ["press", "pedal", "with", "left", "foot"],
      "4": ["black", "trunk", "fell", "from", "landing"],
      "5": ["cheap", "clothes", "flashy", "dont", "last"],
      "6": ["night", "alarm", "roused", "deep", "sleep"],
    },
    {
      "1": ["dots", "light", "betrayed", "black", "cat"],
      "2": ["put", "chart", "mantel", "tack", "down"],
      "3": ["steady", "drip", "worse", "drenching", "rain"],
      "4": ["flat", "pack", "takes", "luggage", "space"],
      "5": ["gloss", "top", "made", "unfit", "read"],
      "6": ["seven", "seals", "stamped", "great", "sheets"],
    },
    {
      "1": ["marsh", "freeze", "when", "cold", "enough"],
      "2": ["gray", "mare", "walked", "before", "colt"],
      "3": ["bottles", "hold", "four", "kinds", "rum"],
      "4": ["wheeled", "bike", "past", "winding", "road"],
      "5": ["throw", "used", "paper", "cup", "plate"],
      "6": ["wall", "phone", "rang", "loud", "often"],
    },
    {
      "1": ["hinge", "door", "creaked", "old", "age"],
      "2": ["bright", "lanterns", "gay", "dark", "lawn"],
      "3": ["offered", "proof", "form", "large", "chart"],
      "4": ["their", "eyelids", "droop", "want", "sleep"],
      "5": ["there", "many", "ways", "these", "things"],
      "6": ["we", "like", "see", "clear", "weather"],
    },
  ];

  const trackIndex = parseInt(trackId) - 3;
  return keywordList[trackIndex][String(sentenceId)];
};

export const getKeywordsForTrack = (trackId: string) => {
  const keywords = [];
  for (let i = 1; i <= 6; i++) {
    keywords.push(...extractKeywords(trackId, i));
  }
  return keywords;
};

export const chunkArray = (arr: string[], chunkSize: number) => {
  const result = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
};
