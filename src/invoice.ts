import axios from "axios";
import MONPAY from ".";

const CREATE_DEEP_LINK = async (body: {
  branch: string;
  description: string;
  amount: number;
  callback: string;
  redirectUri: string;
}): Promise<{
  success: boolean;
  message: string;
  data?: {
    id: number;
    receiver: string;
    amount: number;
    miniAppId: number;
    createDate: string;
    updateDate: string;
    status: string;
    description: string;
    redirectUri: string;
    invoiceType: string;
    clientServiceUrl: string;
  };
}> => {
  try {
    const res = await axios.post(
      `${MONPAY.host}/v2/api/oauth/invoice`,
      JSON.stringify({
        amount: body.amount,
        redirectUri: body.redirectUri,
        clientServiceUrl: body.callback,
        receiver: body.branch,
        invoiceType: "P2B",
        description: body.description,
      }),
      {
        headers: {
          Authorization: `Bearer ${MONPAY.token}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (res.data.code == "OK") {
      return {
        success: true,
        message: "success",
        data: res.data.result,
      };
    } else {
      return {
        success: false,
        message: res.data.info || "",
      };
    }
  } catch (error) {
    console.log("FAILED", error?.response?.data);
    return {
      success: false,
      message: error?.response?.data?.message || "error",
    };
  }
};

const CREATE_QR_CODE = async (body: {
  branch: string;
  displayName: string;
  amount: number;
  callback: string;
}): Promise<{
  success: boolean;
  message: string;
  data?: {
    qrcode: string;
    uuid: string;
  };
}> => {
  try {
    const res = await axios.post(
      `${MONPAY.host}/rest/branch/qrpurchase/generate`,
      JSON.stringify({
        amount: body.amount,
        generateUuid: true,
        displayName: body.displayName,
        callbackUrl: body.callback,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            MONPAY.config.username + ":" + MONPAY.config.id,
          ).toString("base64")}`,
        },
      },
    );
    if (res.data.code == 0) {
      return {
        success: true,
        message: "success",
        data: res.data.result,
      };
    } else {
      return {
        success: false,
        message: res.data.info || "",
      };
    }
  } catch (error) {
    console.log("FAILED", error?.response?.data);
    return {
      success: false,
      message: error?.response?.data?.message || "error",
    };
  }
};

const CHECKER_QR_CODE = async (
  uuid: string,
): Promise<{
  success: boolean;
  message: string;
  data?: {
    uuid: string;
    usedAt: number;
    usedById: number;
    transactionId: string;
    amount: number;
    createdAt: number;
    userPhone: string;
    userAccountNo: string;
    usedAtUI: string;
    createdAtUI: string;
    amountUI: string;
  };
}> => {
  try {
    const res = await axios.get(
      `${MONPAY.host}/rest/branch/qrpurchase/check?uuid=${uuid}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            MONPAY.config.username + ":" + MONPAY.config.password,
          ).toString("base64")}`,
        },
      },
    );
    if (res.data.code == 0) {
      return {
        success: true,
        message: "success",
        data: res.data.result,
      };
    } else {
      return {
        success: false,
        message: res.data.info || "",
      };
    }
  } catch (error) {
    console.log("FAILED", error?.response?.data);
    return {
      success: false,
      message: error?.response?.data?.message || "error",
    };
  }
};
const CHECKER_DEEP_LINK = async (
  id: string | number,
): Promise<{
  success: boolean;
  message: string;
  data?: {
    id: number;
    receiver: string;
    amount: number;
    miniAppId: number;
    createDate: string;
    updateDate: string;
    status: string;
    description: string;
    redirectUri: string;
    invoiceType: string;
    clientServiceUrl: string;
    userId?: number;
    txnId?: string;
    statusInfo?: string;
  };
}> => {
  try {
    const res = await axios.get(`${MONPAY.host}/v2/api/oauth/invoice/${id}`, {
      headers: {
        Authorization: `Bearer ${MONPAY.token}`,
        "Content-Type": "application/json",
      },
    });
    if (res.data.code == "OK") {
      if (res.data.result.status == "PAID") {
        return Promise.resolve({
          success: true,
          data: res.data.result,
          message: res.data.result.statusInfo,
        });
      } else {
        return Promise.resolve({
          success: false,
          data: null,
          // data: null || response.result,
          message: "Төлбөр төлөлт хийгдээгүй байна",
        });
      }
    } else {
      return Promise.resolve({
        success: false,
        data: null,
        message: res.data.info,
      });
    }
  } catch (error) {
    console.log("FAILED", error?.response?.data);
    return {
      success: false,
      message: error?.response?.data?.message || "error",
    };
  }
};
export default {
  CREATE: { QR: CREATE_QR_CODE, DEEP_LINK: CREATE_DEEP_LINK },
  CHECKER: { QR: CHECKER_QR_CODE, DEEP_LINK: CHECKER_DEEP_LINK },
};
