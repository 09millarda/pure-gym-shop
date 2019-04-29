import { IListingState, IReduxState, ISubsetGroup } from "../../../App/index";
import PageTitle from "../../../Layout/PageTitle/PageTitle";
import { useState, useEffect } from "react";
import React from "react";
import { fetchAllListings } from "../../Store/Listings/redux/listingsActions";
import { fetchAllSubsets, updateNewSubsetFormState } from "../redux/subsetActions";
import { connect } from "react-redux";
import swal from "sweetalert";
import getDataUrl from "../../../App/common/proxy";
import history from "../../../App/history";
import showErrorAlert from "../../../App/common/errorMessage";
import SubsetEditForm from "../../../Components/SubsetEditForm";

interface INewSubsetDispatchProps {
  updateNewSubsetForm: (name: string, itemIds: number[]) => void;
  fetchAllItems: () => void;
  fetchAllSubsets: () => void;
}

interface INewSubsetStateProps {
  name: string;
  itemIds: number[];
  isFetchingItems: boolean;
  listings: IListingState[];
}

type INewSubsetProps = INewSubsetDispatchProps & INewSubsetStateProps;

function NewSubset(props: INewSubsetProps): JSX.Element {
  const formRef: React.RefObject<SubsetEditForm> = React.createRef();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    props.fetchAllItems();
  }, []);

  function handleFormChange(name: string, itemIds: number[]): void {
    props.updateNewSubsetForm(name, itemIds);
  }

  async function onSave(): Promise<void> {
    if (formRef.current) {
      if (!formRef.current.validateForm()) {
        return;
      }
    }

    const swalResponse: any = await swal({
      icon: "warning",
      title: "Are you sure?",
      text: "This will create a new item subset.",
      dangerMode: true,
      buttons: ["Cancel", "Create"]
    });

    if (swalResponse === true) {
      setIsSaving(true);

      const url: string = `${getDataUrl()}/subsets`;
      await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          name: props.name,
          itemIds: props.itemIds
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(async (res) => {
        if (res.status === 201) {
          props.updateNewSubsetForm("", []);
          props.fetchAllSubsets();
          history.push("/subset-management");
        } else {
          const text: string = await res.text();
          showErrorAlert("Couldn't save item", text);
        }
      })
      .catch((err) => {
        showErrorAlert("Couldn't save item", err);
      })
      .finally(() => {
        setIsSaving(false);
      });
    }
  }

  return (
    <div className="card-box">
      <PageTitle
        title="NEW SUBSET"
      />
      <SubsetEditForm
        ref={formRef}
        form={{
          name: props.name,
          itemIds: props.itemIds,
          subsetId: -1
        }}
        listings={props.listings}
        isFetchingListings={props.isFetchingItems}
        formChanged={handleFormChange}
        readonly={isSaving}
      />
      <button
        className="btn btn-info mt-3"
        disabled={isSaving}
        onClick={onSave}
      >
        {isSaving ? "Saving..." : "Save Subset"}
      </button>
    </div>
  );
}

function mapStateToProps(state: IReduxState): INewSubsetStateProps {
  return {
    itemIds: state.subsetState.newSubsetState.itemIds,
    name: state.subsetState.newSubsetState.name,
    isFetchingItems: state.listingsState.isFetchingListings,
    listings: state.listingsState.listings
  };
}

function mapDispatchToProps(dispatch: any): INewSubsetDispatchProps {
  return {
    fetchAllItems: () => dispatch(fetchAllListings()),
    fetchAllSubsets: () => dispatch(fetchAllSubsets()),
    updateNewSubsetForm: (name: string, itemIds: number[]) =>
      dispatch(updateNewSubsetFormState(name, itemIds))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewSubset);