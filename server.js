import {createServer} from "http";
import dotenv from "dotenv";
import{ customAlphabet } from'nanoid';

import { orders } from "./db.js";
import { parsePayload } from "./parseDate.js";
import {priceValidation, dataValidation} from './validation.js' 
import {isInDb,checkId} from './checkId.js'

dotenv.config();

const nanoid = customAlphabet('01', 4);

const server = createServer( async (req, res) =>{

  try{
      if(req.url === "/orders" && req.method === "GET"){

        res.setHeader("Content-Type", "application/json");
        res.end( JSON.stringify(orders));

      } else if(req.url === "/orders" && req.method === "POST"){
          const {date, price} = await parsePayload(req,res);
          if (priceValidation(price) && dataValidation(date)){

            orders.push({id : Number(nanoid()), date:dataValidation(date), price});

            res.statusCode = 201;
            res.end("New order was added!");

          } else {
              res.statusCode = 400;
              res.end("Bad request! Data or price format is wrong or missing!");
          };

      } else if (req.url.startsWith("/orders/") && req.method === "DELETE"){

          const indx = checkId(req, orders);
          
          if (indx === null){
            res.statusCode = 404;
            res.end("There is no such resource! Check your URL or HTTP method!");

          } else{
            orders.splice(indx,1);
            res.statusCode = 204;
            res.end();
          }

      } else if (req.url.startsWith("/orders/") && req.method === "PUT"){

          const order = isInDb(req,orders);
          const {date, price} = await parsePayload(req, res);

          if(priceValidation(price) && dataValidation(date) ){
            order.date = dataValidation(date);
            order.price = price;

            res.statusCode = 201; 
            res.end("Order was rewrited!");

          } else {
            res.statusCode = 400;
            res.end("Bad request! Data or price format is wrong or missing!");
          };
        
      } else if (req.url.startsWith("/orders/") && req.method === "PATCH"){

          const order = isInDb(req,orders);

          const payload = await parsePayload(req, res);
          const {date,price} = payload;

          if(priceValidation(price) || dataValidation(date)){
              
            if ("date" in payload) order.date = dataValidation(date);

            if ("price" in payload) order.price = price;

            res.statusCode = 201;
            res.end("Fields were rewrited!");

          } else {
            res.statusCode = 404;
            res.end("There is no such resource! Check your URL or HTTP method!");
          } 
    
    }else {
      res.statusCode = 404;
      res.end("There is no such resource! Check your URL or HTTP method!");
    };

  } catch(err){
    console.error(err);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
});

server.listen(process.env.PORT || 3000, () =>{
  console.log("Server is running!");
});