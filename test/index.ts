import MONPAY from "../src/index";

MONPAY.auth
  .TOKEN("prod", {
    id: 10314020,
    client_id: "zkOnEGDHt89tTELJ",
    client_secret: "ifC4zSR39RieRPJv",
    username: "seller_panda",
    password: "868896",
  })
  .then(async (r) => {
    console.log(r);
    const invoice = await MONPAY.invoice.CREATE.DEEP_LINK({
      branch: "Togtokh_dev",
      amount: 200,
      callback: "https://togtokh.dev/callback",
      description: "test",
      redirectUri: "",
    });
    console.log(invoice);
    if (invoice.data?.id) {
      const asd = await MONPAY.invoice.CHECKER.DEEP_LINK(invoice.data?.id);
      console.log(asd);
    }
    // const invoice = await MONPAY.invoice.CREATE.QR({
    //   branch: "Togtokh_dev",
    //   amount: 200,
    //   callback: "https://togtokh.dev/callback",
    //   displayName: "test",
    // });
    // console.log(invoice);
    // if (invoice.data?.uuid) {
    //   const asd = await MONPAY.invoice.CHECKER.QR(invoice.data?.uuid);
    //   console.log(asd);
    // }
  })
  .catch((e) => {
    console.log(e);
  });
