import React from "react";
import { IListingState } from "../App/index";

interface ISubsetEditForm {
  form: {
    name: string;
    itemIds: number[];
    subsetId: number;
  };
  listings: IListingState[];
  isFetchingListings: boolean;
  formChanged: (name: string, itemIds: number[]) => void;
  readonly: boolean;
}

interface ISubsetEditFormState {
  form: {
    name: string;
    itemIds: number[];
  };
  nameError: string;
}

class SubsetEditForm extends React.PureComponent<ISubsetEditForm, ISubsetEditFormState> {
  public constructor(props: ISubsetEditForm) {
    super(props);

    this.state = {
      form: {
        itemIds: props.form.itemIds,
        name: props.form.name
      },
      nameError: ""
    };

    this.removeItem.bind(this);
    this.addItem.bind(this);
  }

  public componentWillReceiveProps(nextProps: ISubsetEditForm) {
    if (this.props.form.subsetId !== nextProps.form.subsetId) {
      this.setState({
        form: {
          name: nextProps.form.name,
          itemIds: nextProps.form.itemIds
        },
        nameError: ""
      });
    }
  }

  public validateForm = (): boolean => {
    let isValid: boolean = true;

    // name
    if (this.state.form.name.length === 0 || this.state.form.name.length > 50) {
      this.setState({
        nameError: "Name must be between 1 and 50 characters"
      });
      isValid = false;
    }

    return isValid;
  }

  public render(): JSX.Element {
    return (
      <form className="mt-3" onBlur={this.updateForm}>
        <div className="row">
          <div className="col-12">
            <label>Name *</label>
            <input
              type="text"
              maxLength={50}
              className="form-control"
              readOnly={this.props.readonly}
              value={this.state.form.name}
              style={{
                maxWidth: "350px"
              }}
              onChange={this.updateName}
            />
            {
              this.state.nameError.length > 0 &&
              <p className="text-danger font-13 mb-0">{this.state.nameError}</p>
            }
          </div>
          <div className="col-12 mt-3">
            <label>Items</label>
            <input
              type="text"
              className="form-control"
              readOnly={this.props.readonly}
              style={{
                maxWidth: "350px"
              }}
              list="subsetItemsDl"
              onChange={this.addItem}
            />
            <datalist id="subsetItemsDl">
              {
                this.props.listings.filter(i => this.props.form.itemIds.indexOf(i.itemId) === -1).map((item, i) =>
                  <option key={i} value={item.name}>{item.itemId}</option>
                )
              }
            </datalist>
            <table className="table table-sm mt-3" style={{maxWidth: "350px"}}>
              <thead>
                <tr>
                  <th>Item Id</th>
                  <th>Name</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {
                  this.props.listings.filter(i => this.state.form.itemIds.indexOf(i.itemId) > -1).map((item, i) =>
                    <tr key={i}>
                      <td>{item.itemId}</td>
                      <td>{item.name}</td>
                      <td>
                        <button
                          className="btn btn-link"
                          style={{
                            padding: "0px"
                          }}
                          disabled={this.props.readonly}
                          onClick={() => this.removeItem(item.itemId)}
                        >Remove</button>
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      </form>
    );
  }

  private addItem = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const item: IListingState | undefined = this.props.listings.find(i => i.name === e.target.value);
    if (item == null) {
      return;
    }
    const itemIds: number[] = this.state.form.itemIds.slice();
    itemIds.push(item.itemId);
    this.setState({...this.state, form: {...this.state.form, itemIds }});
    e.target.value = "";

    this.props.formChanged(this.state.form.name, itemIds);
  }

  private removeItem = (id: number): void => {
    const itemIds: number[] = this.state.form.itemIds.slice().filter(i => i !== id);
    this.setState({...this.state, form: {...this.state.form, itemIds }});

    this.props.formChanged(this.state.form.name, itemIds);
  }

  private updateForm = (): void => {
    this.props.formChanged(this.state.form.name, this.state.form.itemIds);
  }

  private updateName = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({...this.state, form: {...this.state.form, name: e.target.value}, nameError: ""});
  }
}

export default SubsetEditForm;