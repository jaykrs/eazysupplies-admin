export const storageURL = process.env.storageURL;
export const SkuType = [
    {id:'PACKET',name:'PACKET'},
    {id:'BAG',name:'BAG'},
    {id:'BOTTLE',name:'BOTTLE'},
    {id:'PLASTIC BOTTLE',name:'PLASTIC BOTTLE'},
    {id:'GLASS BOTTLE',name:'GLASS BOTTLE'},
    {id:'JERRY CAN',name:'JERRY CAN'},
    {id:'POUCH',name:'POUCH'},
    {id:'TIN',name:'TIN'}
];
export const ConvertIntoIso8601 =  function toISO8601(input) {
  if (!input) return null;

  let dateObj;

  if (input instanceof Date) {
    dateObj = input;
  } else if (typeof input === "string") {
    // If input is like "YYYY-MM-DDTHH:MM", append seconds
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(input)) {
      input += ":00";
    }
    dateObj = new Date(input);
  } else {
    return null;
  }

  // Check if valid date
  if (isNaN(dateObj.getTime())) {
    console.error("Invalid date:", input);
    return null;
  }

  // Convert to ISO-8601 string in UTC
  return dateObj.toISOString();
}