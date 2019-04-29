import React, { useEffect, useState } from "react";
import PageTitle from "../../../Layout/PageTitle/PageTitle";
import ItemEditForm from "../../../Components/ItemEditForm";
import { IReduxState } from "../../../App/index";
import { updateNewItemFormState } from "./redux/newItemAction";
import { connect } from "react-redux";
import swal from "sweetalert";
import showErrorAlert from "../../../App/common/errorMessage";
import history from "../../../App/history";
import getDataUrl from "../../../App/common/proxy";
import { fetchAllListings } from "../../Store/Listings/redux/listingsActions";

interface INewItemDispatchProps {
  updateNewItemForm: (title: string, price: number, description: string, imageUri: string) => void;
  fetchAllItems: () => void;
}

interface INewItemStateProps {
  title: string;
  description: string;
  price?: number;
  imageUri: string;
}

type INewItemProps = INewItemDispatchProps & INewItemStateProps;

function NewItem(props: INewItemProps): JSX.Element {
  const formRef: React.RefObject<ItemEditForm> = React.createRef();
  const [isSaving, setIsSaving] = useState(false);

  function handleFormChange(title: string, description: string, price: number, imageUri: string): void {
    props.updateNewItemForm(title, price, description, imageUri);
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
      text: "This will list a new item in the store.",
      dangerMode: true,
      buttons: ["Cancel", "Create"]
    });

    if (swalResponse === true) {
      setIsSaving(true);

      const url: string = `${getDataUrl()}/items`;
      await fetch(url, {
        method: "POST",
        body: JSON.stringify({
          name: props.title,
          description: props.description,
          price: props.price || 0,
          imageUri: props.imageUri
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(async (res) => {
        if (res.status === 201) {
          props.updateNewItemForm("", 0, "", "");
          props.fetchAllItems();
          history.push("/item-management");
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
        title="NEW ITEM"
      />
      <ItemEditForm
        ref={formRef}
        form={{
          imageUri: props.imageUri,
          description: props.description,
          title: props.title,
          unitPrice: props.price || 0,
          itemId: -1
        }}
        formChanged={handleFormChange}
        readonly={isSaving}
      />
      <button
        className="btn btn-info mt-3"
        onClick={onSave}
        disabled={isSaving}
      >{isSaving ? "Saving..." : "Save Item"}</button>
    </div>
  );
}

function mapStateToProps(state: IReduxState): INewItemStateProps {
  return {
    title: state.newItemState.title,
    description: state.newItemState.description,
    price: state.newItemState.unitPrice,
    imageUri: state.newItemState.imageUri
  };
}

function mapDispatchToProps(dispatch: any): INewItemDispatchProps {
  return {
    updateNewItemForm: (title: string, price: number, description: string, imageUri: string) =>
      dispatch(updateNewItemFormState(title, price, description, imageUri)),
      fetchAllItems: () => dispatch(fetchAllListings())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewItem);