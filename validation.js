import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
dayjs.extend(customParseFormat)

export const priceValidation =(price)=>{
  if( typeof price === "number" && price > 0 ) return true
  else false 
}

export const dataValidation = (date) =>{
  if (date){
    const isISODate = dayjs(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ', { strict: true }).isValid()
    if (isISODate ) {
      const dateObj = dayjs(date).toDate();
      if (!isNaN(dateObj)) {
        return dateObj;
      }
    }
  }
  
  return null;
}