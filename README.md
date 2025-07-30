# MONPAY

## Example

```bash
    import MONPAY from "@togtokh.dev/monpay";

    MONPAY.auth
      .TOKEN("prod", {
        id: ,
        client_id: "",
        client_secret: "",
        username: "",
        password: "",
      })
      .then(async (r) => {
        console.log(r);
        const invoice = await MONPAY.invoice.CREATE.DEEP_LINK({
          branch: "Togtokh_dev",
          amount: 200,
          callback: "https://togtokh.dev/callback",
          description: "test",
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


```
