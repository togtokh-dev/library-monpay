import auth from "./auth";
import invoice from "./invoice";
import branch from "./branch";
const config = {
  id: "",
  client_id: "",
  client_secret: "",
  username: "",
  password: "",
};
let token = "";
let BranchToken = "";
let host = "";
let hosts = {
  staging: "https://z-wallet.monpay.mn",
  prod: "https://wallet.monpay.mn",
};

export default {
  token,
  BranchToken,
  config,
  hosts,
  host,
  auth,
  invoice,
  branch,
};
