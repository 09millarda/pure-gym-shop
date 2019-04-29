import React from "react";
import { IListingState, ISubsetGroup, IReduxState } from "../../../App/index";
import { RouteComponentProps } from "react-router";
import { fetchAllSubsets } from "../redux/subsetActions";
import { fetchAllListings } from "../../Store/Listings/redux/listingsActions";
import { connect } from "react-redux";
import history from "../../../App/history";
import PageTitle from "../../../Layout/PageTitle/PageTitle";
import SubsetEditForm from "../../../Components/SubsetEditForm";
import swal from "sweetalert";
import getDataUrl from "../../../App/common/proxy";
import showErrorAlert from "../../../App/common/errorMessage";

interface IEditSubsetDispatchProps {
  fetchAllListings: () => void;
  fetchAllSubsets: () => void;
}

interface IEditSubsetUrlProps {
  subsetId: string;
}

interface IEditSubsetStateProps {
  listings: IListingState[];
  subsets: ISubsetGroup[];
  isFetchingListings: boolean;
}

type IEditSubsetProps = IEditSubsetDispatchProps & RouteComponentProps<IEditSubsetUrlProps> & IEditSubsetStateProps;

interface IEditSubsetState {
  form: {
    name: string;
    itemIds: number[];
  };
  isEditing: boolean;
  isSaving: boolean;
  isDeleting: boolean;
}

class EditSubset extends React.PureComponent<IEditSubsetProps, IEditSubsetState> {
  private formRef: React.RefObject<SubsetEditForm> = React.createRef();
  public constructor(props: IEditSubsetProps) {
    super(props);

    this.state = {
      form: {
        itemIds: [],
        name: ""
      },
      isDeleting: false,
      isEditing: false,
      isSaving: false
    };
  }

  public componentDidMount() {
    this.props.fetchAllListings();
  }

  public componentWillReceiveProps(nextProps: IEditSubsetProps) {
    if (this.props.match.params.subsetId !== nextProps.match.params.subsetId) {
      this.setState({
        isEditing: false,
        isSaving: false,
        isDeleting: false
      });
    }
  }

  public render(): JSX.Element {
    const subset: ISubsetGroup | undefined = this.props.subsets.find(s => s.subsetId.toString() === this.props.match.params.subsetId);

    if (subset == null) {
      history.push("/subset-management");
      return <></>;
    }

    return (
      <div className="card-box">
        <PageTitle
          title={"EDIT SUBSET (SUBSET ID: " + this.props.match.params.subsetId + ")"}
        />
        <SubsetEditForm
          ref={this.formRef}
          isFetchingListings={this.props.isFetchingListings}
          listings={this.props.listings}
          form={{
            itemIds: subset.items.map(i => i.itemId),
            name: subset.name,
            subsetId: subset.subsetId
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
                onClick={this.updateSubset}
                disabled={this.state.isSaving}
              >{this.state.isSaving ? "Saving..." : "Update Subset"}</button>
            </>
          )
        }
        {
          !this.state.isEditing &&
          <>
            <button
              className="btn btn-primary mt-3"
              onClick={() => this.setState({isEditing: true})}
            >Edit Subset</button>
            <button
              className="btn btn-danger mt-3 ml-3"
              onClick={this.deleteSubset}
            >
              Delete Subset
            </button>
          </>
        }
      </div>
    );
  }

  private deleteSubset = async(): Promise<void> => {
    const swalResponse: any = await swal({
      icon: "warning",
      title: "Are you sure?",
      text: "This will permanently delete this subset",
      dangerMode: true,
      buttons: ["Cancel", "Delete"]
    });

    if (swalResponse === true) {
      this.setState({
        isDeleting: true
      });

      const url: string = `${getDataUrl()}/subsets/${this.props.match.params.subsetId}`;
      await fetch(url, {
        method: "DELETE"
      })
      .then(async (res) => {
        if (res.status === 200) {
          this.props.fetchAllSubsets();
          history.push("/subset-management");
        } else {
          const text: string = await res.text();
          showErrorAlert("Couldn't delete subset", text);
        }
      })
      .catch((err) => {
        showErrorAlert("Couldn't delete subset", err);
      })
      .finally(() => {
        this.setState({
          isDeleting: false
        });
      });
    }
  }

  private updateSubset = async(): Promise<void> => {
    if (this.formRef.current && this.formRef.current.validateForm()) {
      const swalResponse: any = await swal({
        icon: "warning",
        title: "Are you sure?",
        text: "This will update the selected subset",
        dangerMode: true,
        buttons: ["Cancel", "Update"]
      });

      if (swalResponse === true) {
        this.setState({
          isSaving: true
        });

        const url: string = `${getDataUrl()}/subsets/${this.props.match.params.subsetId}`;
        await fetch(url, {
          method: "PUT",
          body: JSON.stringify({
            name: this.state.form.name,
            itemIds: this.state.form.itemIds
          }),
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(async (res) => {
          if (res.status === 200) {
            this.props.fetchAllSubsets();
            history.push("/subset-management");
          } else {
            const text: string = await res.text();
            showErrorAlert("Couldn't save subset", text);
          }
        })
        .catch((err) => {
          showErrorAlert("Couldn't save subset", err);
        })
        .finally(() => {
          this.setState({
            isSaving: false
          });
        });
      }
    }
  }

  private handleFormChange = (name: string, itemIds: number[]): void => {
    this.setState({
      ...this.state,
      form: {...this.state.form, name, itemIds}
    });
  }
}

function mapStateToProps(state: IReduxState): IEditSubsetStateProps {
  return {
    isFetchingListings: state.listingsState.isFetchingListings,
    listings: state.listingsState.listings,
    subsets: state.subsetState.subsets
  };
}

function mapDispatchToProps(dispatch: any): IEditSubsetDispatchProps {
  return {
    fetchAllListings: () => dispatch(fetchAllListings()),
    fetchAllSubsets: () => dispatch(fetchAllSubsets())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditSubset);