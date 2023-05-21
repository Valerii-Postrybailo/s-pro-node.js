export const parsePayload =(req,res) =>{
  return new Promise((resolve)=>{
    const chunks = [];

    req.on("data", (data)=> chunks.push(data));
    req.on("end", ()=> {
      const payloadStr = Buffer.concat(chunks).toString();
      try {
        const payload = JSON.parse(payloadStr);
        resolve(payload);
      }
      catch{
        res.statusCode = 400;
        res.end("Bad request! Can't open JSON or date and price format is wrong or missing!");
      }
    })
  })
}