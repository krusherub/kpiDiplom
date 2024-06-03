import { UserDataType, WalletEnum } from "../Components/types";

export const sendTransaction = (userData: UserDataType, action: any) => {
	if (userData.loginType === WalletEnum.anchor) {
		return userData.anchorSession.transact({ action });
	} else {
		return userData.waxSession.api.transact({actions:[action]}, {
			blocksBehind: 3,
			expireSeconds: 1200,
		});
	}
};