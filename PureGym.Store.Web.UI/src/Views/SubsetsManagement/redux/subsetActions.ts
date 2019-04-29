import { AnyAction } from "redux";
import { ThunkResult, IListingState } from "../../../App/index";
import getDataUrl from "../../../App/common/proxy";
import showErrorMessage from "../../../App/common/errorMessage";

export const FETCH_ALL_SUBSETS: string = "FETCH_ALL_SUBSETS";
export const FETCHED_ALL_SUBSETS: string = "FETCHED_ALL_SUBSETS";
export const UPDATE_NEW_SUBSET: string = "UPDATE_NEW_SUBSET";

export function fetchAllSubsets(): ThunkResult<void> {
  return async (dispatch) => {
    dispatch({
      type: FETCH_ALL_SUBSETS
    });

    const url: string = `${getDataUrl()}/subsets`;
    fetch(url)
      .then(async (res) => {
        const subsets = await res.json();
        dispatch({
          type: FETCHED_ALL_SUBSETS,
          subsets
        });
      })
      .catch((err) => {
        showErrorMessage("Failed to fetch subsets", err);
      });
  };
}

export function updateNewSubsetFormState(name: string, itemIds: number[]): AnyAction {
  return {
    type: UPDATE_NEW_SUBSET,
    name,
    itemIds
  };
}