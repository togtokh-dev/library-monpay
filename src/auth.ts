import axios from "axios";
import MONPAY from "./";
import { stringify } from "qs";
const TOKEN = async (
  host: "prod" | "staging",
  body: {
    id: string | number;
    client_id: string;
    client_secret: string;
    username: string;
    password: string;
  },
): Promise<{
  success: boolean;
  message: string;
}> => {
  MONPAY.host = MONPAY.hosts[host];
  try {
    const data = stringify({
      client_id: body.client_id,
      client_secret: body.client_secret,
      grant_type: "client_credentials",
    });
    const res = await axios.post(`${MONPAY.host}/v2/oauth/token`, data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    MONPAY.token = res.data.access_token;
    MONPAY.config = {
      id: body.id.toString(),
      client_id: body.client_id,
      client_secret: body.client_secret,
      username: body.username,
      password: body.password,
    };
    MONPAY.branch.BranchLogin();
    return {
      success: true,
      message: "success",
    };
  } catch (error) {
    return {
      success: false,
      message: "error",
    };
  }
};
export default { TOKEN };
