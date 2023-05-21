export const isInDb = (req, data) => {

  const id = parseInt(req.url.split("/")[2]);
  const order = data.find(item => item.id === id);

  if (order) return order;
  else return null;
}

export const checkId = (req, data) => {
  const id = parseInt(req.url.split("/")[2]);
  const indx = data.findIndex(item => item.id === id);
  
  if (indx === -1) return null;
  else return indx;
}