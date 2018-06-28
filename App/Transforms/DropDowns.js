reportDbIndex = (index: string) =>{
  switch (index){
    case "0":
      return "SP"; // Spam
    case "1":
      return "SH"; // Sexual Harassment
    case "2":
      return "UN"; // Unsolicited Nudity
    case "3":
      return "AC"; // Abusive Chat
    default:
      return "OT"; // Other
  }
}
flagDbIndex = (index:string) =>{
  switch (index){
    case "0":
      return 1; // Spam
    case "1":
      return 2; // Sexual Harassment
    case "2":
      return 3; // Unsolicited Nudity
    case "3":
      return 4; // Abusive Chat
    default:
      return 5; // Other
  }
}
export {reportDbIndex, flagDbIndex};
