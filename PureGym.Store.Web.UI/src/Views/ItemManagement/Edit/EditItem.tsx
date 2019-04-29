import React, { useState, useEffect } from "react";
import PageTitle from "../../../Layout/PageTitle/PageTitle";
import { IListingState, IReduxState } from "../../../App/index";
import { RouteComponentProps } from "react-router";
import ItemEditForm from "../../../Components/ItemEditForm";
import history from "../../../App/history";
import { connect } from "react-redux";
import swal from "sweetalert";
import getDataUrl from "../../../App/common/proxy";
import showErrorAlert from "../../../App/common/errorMessage";
import { fetchAllListings } from "../../Store/Listings/redux/listingsActions";

interface IEditItemDispatchProps {
  fetchAllListings: () => void;
}

interface IEditItemUrlProps {
  itemId: string;
}

interface IEditItemStateProps {
  items: IListingState[];
}

type IEditItemProps = IEditItemStateProps & RouteComponentProps<IEditItemUrlProps> & IEditItemDispatchProps;

interface IEditItemState {
  form: {
    description: string;
    title: string;
    unitPrice: string;
    imageUri: string;
  };
  isEditing: boolean;
  isSaving: boolean;
  isDeleting: boolean;
}

class EditItem extends React.PureComponent<IEditItemProps, IEditItemState> {
  private formRef: React.RefObject<ItemEditForm> = React.createRef();
  public constructor(props: IEditItemProps) {
    super(props);

    this.state = {
      form: {
        description: "",
        imageUri: "",
        title: "",
        unitPrice: ""
      },
      isEditing: false,
      isSaving: false,
      isDeleting: false
    };
  }

  public componentWillReceiveProps(nextProps: IEditItemProps) {
    if (this.props.match.params.itemId !== nextProps.match.params.itemId) {
      this.setState({
        isEditing: false,
        isSaving: false,
        isDeleting: false
      });
    }
  }

  public render(): JSX.Element {
    const item: IListingState | undefined = this.props.items.find(i => i.itemId.toString() === this.props.match.params.itemId);

    if (item == null) {
      history.push("/item-management");
      return <></>;
    }

    return (
      <div className="card-box">
        <PageTitle
          title={"EDIT ITEM (ITEM ID: " + this.props.match.params.itemId + ")"}
        />
        <ItemEditForm
          ref={this.formRef}
          form={{
            itemId: item.itemId,
            description: item.description,
            title: item.name,
            unitPrice: item.price,
            imageUri: item.imageUri
          }}
          formChanged={this.handleFormChange}
          readonly={!this.state.isEditing || this.state.isSaving}
        />
        {
          this.state.isEditing &&
          (
            <>
              <button
                className="btn btn-info mt-3"
                onClick={this.updateItem}
                disabled={this.state.isSaving}
              >{this.state.isSaving ? "Saving..." : "Update Item"}</button>
            </>
          )
        }
        {
          !this.state.isEditing &&
          <>
            <button
              className="btn btn-primary mt-3"
              onClick={() => this.setState({isEditing: true})}
            >Edit Item</button>
            <button 
              className="btn btn-danger mt-3 ml-3"
              onClick={this.deleteItem}
            >
              Delete Item
            </button>
          </>
        }
      </div>
    );
  }

  private deleteItem = async(): Promise<void> => {
    const swalResponse: any = await swal({
      icon: "warning",
      title: "Are you sure?",
      text: "This will permanently delete this item",
      dangerMode: true,
      buttons: ["Cancel", "Delete"]
    });

    if (swalResponse === true) {
      this.setState({
        isDeleting: true
      });

      const url: string = `${getDataUrl()}/items/${this.props.match.params.itemId}`;
      await fetch(url, {
        method: "DELETE"
      })
      .then(async (res) => {
        if (res.status === 200) {
          this.props.fetchAllListings();
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
        this.setState({
          isDeleting: false
        });
      });
    }
  }

  private updateItem = async(): Promise<void> => {
    if (this.formRef.current && this.formRef.current.validateForm()) {
      const swalResponse: any = await swal({
        icon: "warning",
        title: "Are you sure?",
        text: "This will update the selected item",
        dangerMode: true,
        buttons: ["Cancel", "Update"]
      });

      if (swalResponse === true) {
        this.setState({
          isSaving: true
        });

        const url: string = `${getDataUrl()}/items/${this.props.match.params.itemId}`;
        await fetch(url, {
          method: "PUT",
          body: JSON.stringify({
            name: this.state.form.title,
            description: this.state.form.description,
            price: this.state.form.unitPrice || 0,
            imageUri: this.state.form.imageUri
          }),
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(async (res) => {
          if (res.status === 200) {
            this.props.fetchAllListings();
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
          this.setState({
            isSaving: false
          });
        });
      }
    }
  }

  private handleFormChange = (title: string, description: string, price: number, imageUri: string): void => {
    this.setState({
      ...this.state,
      form: {...this.state.form, title, description, imageUri, unitPrice: price.toString()}
    });
  }
}

function mapDispatchToProps(dispatch: any): IEditItemDispatchProps {
  return {
    fetchAllListings: () => dispatch(fetchAllListings())
  };
}

function mapStateToProps(state: IReduxState): IEditItemStateProps {
  return {
    items: state.listingsState.listings
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditItem);