import { AnyAction } from "redux";
import { ThunkResult, IListingState } from "../../../../App/index";
import getDataUrl from "../../../../App/common/proxy";
import showErrorAlert from "../../../../App/common/errorMessage";

export const FETCH_ALL_LISTINGS: string = "FETCH_ALL_LISTINGS";
export const FETCHED_ALL_LISTINGS: string = "FETCHED_ALL_LISTINGS";

export function fetchAllListings(): ThunkResult<void> {
  return async (dispatch) => {
    dispatch({
      type: FETCH_ALL_LISTINGS
    });

    const url: string = `${getDataUrl()}/items`;
    fetch(url)
      .then(async (response) => {
        const listings: IListingState[] = await response.json();
        dispatch({
          type: FETCHED_ALL_LISTINGS,
          listings
        });
      })
      .catch((err) => {
        showErrorAlert("An error occured fetching listings", `${err}`);
      });
  };
}