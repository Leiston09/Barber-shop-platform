export const formatCurrency = (price : number) =>
  Number(price).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });


  