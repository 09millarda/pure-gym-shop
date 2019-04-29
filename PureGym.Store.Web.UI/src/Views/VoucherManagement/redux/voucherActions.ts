import { ThunkResult } from "../../../App/index";
import getDataUrl from "../../../App/common/proxy";
import showErrorAlert from "../../../App/common/errorMessage";

export const FETCH_ALL_VOUCHERS: string = "FETCH_ALL_VOUCHERS";
export const FETCHED_ALL_VOUCHERS: string = "FETCHED_ALL_VOUCHERS";

export function fetchAllVouchers(): ThunkResult<void> {
  return async (dispatch) => {
    dispatch({
      type: FETCH_ALL_VOUCHERS
    });

    const url: string = `${getDataUrl()}/vouchers`;
    fetch(url)
      .then(async (response) => {
        const vouchers: any = await response.json();
        dispatch({
          type: FETCHED_ALL_VOUCHERS,
          vouchers
        });
      })
      .catch((err) => {
        showErrorAlert("An error occured fetching vouchers", `${err}`);
      });
  };
}