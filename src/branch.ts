import { axiosMasterMain } from "axios-master";
import { AxiosResponse } from "axios";
import MONPAY from ".";

type ApiResponse<T> = {
  code: number;
  info: string;
  result: T;
};

type BranchLoginResult = {
  token: string;
  branch: {
    username: string;
    accountIdMerch: number;
    profileId: number;
    phone: string;
    name: string;
    branchId: number;
    branchType: string;
    hasPinCode: boolean;
  };
};

const BranchLogin = async (): Promise<string> => {
  try {
    const result: ApiResponse<BranchLoginResult> = await axiosMasterMain(
      {
        method: "POST",
        url: `${MONPAY.host}/rest/branch/login`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          username: MONPAY.config.username,
          password: MONPAY.config.password,
        },
      },
      {
        name: "login",
        timeout: 20000,
        shouldRetry: false,
        shouldRetryStatus: [],
        logger(data) {
          console.log("Login Log:", data);
        },
      },
    );

    if (result.code === 0) {
      MONPAY.BranchToken = result.result.token;
      return result.result.token;
    }
    console.error("BranchLogin Error:", result);
    return "";
  } catch (error) {
    const axiosError = error as AxiosResponse<ApiResponse<null>>;
    console.error("BranchLogin Error =>?:", axiosError.data);
    return "";
  }
};

type RewardParams = {
  receiver: {
    type: "PHONE";
    value: string;
  };
  description: string;
  prefix: string;
  suffix: string;
  amount: number;
  pin: string;
};

type RewardResponse = ApiResponse<{
  journals: {
    transactionId: number;
  }[];
}>;

export const reward = async (
  data?: RewardParams,
): Promise<{
  success: boolean;
  message: string;
  data?: {
    id?: string | number;
  };
}> => {
  try {
    const result: RewardResponse = await axiosMasterMain(
      {
        method: "POST",
        url: `${MONPAY.host}/rest/branch/candy/reward`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${MONPAY.BranchToken}`,
        },
        data: data,
      },
      {
        name: "reward",
        timeout: 20000,
        shouldRetry: true,
        shouldRetryStatus: [401],
        retryFunction: BranchLogin,
        logger(data) {
          console.log("Reward Log:", data);
        },
      },
    );

    if (result.code === 0) {
      return {
        success: true,
        message: "Амжилттай",
        data: { id: result.result.journals[0].transactionId },
      };
    }

    return {
      success: false,
      message: result.info,
    };
  } catch (error) {
    const axiosError = error as AxiosResponse;
    return {
      success: false,
      message: axiosError.data || "Reward request failed",
    };
  }
};

export default {
  reward,
  BranchLogin,
};
