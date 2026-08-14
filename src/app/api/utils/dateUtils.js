
export async function convertDate(rawDate) {
    console.log(rawDate)
    const dateObj = new Date(rawDate);

// Format: 01 03 2026
const formattedDate = dateObj.toLocaleDateString('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
}).replace(/\//g, ' ');
return formattedDate;
}

export async function calcDate(rawDate,int) {
    console.log(rawDate)
    const dateObj = new Date(rawDate);
    dateObj.setDate(dateObj.getDate() + int);
// Format: 01 03 2026
const formattedDate = dateObj.toLocaleDateString('en-GB', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric'
}).replace(/\//g, ' ');
return formattedDate;
}