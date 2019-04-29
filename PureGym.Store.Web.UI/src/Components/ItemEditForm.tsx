import React, { useState } from "react";
import { render } from "react-dom";

interface IItemEditFormProps {
  form: {
    title: string;
    unitPrice: number;
    description: string;
    imageUri: string;
    itemId: number;
  };
  formChanged: (title: string, description: string, price: number, imageUri: string) => void;
  readonly?: boolean;
}

interface IItemEditFormState {
  form: {
    title: string;
    description: string;
    price: string;
    imageUri: string;
  };
  titleError: string;
  descriptionError: string;
  priceError: string;
  imageError: string;
}

class ItemEditForm extends React.PureComponent<IItemEditFormProps, IItemEditFormState> {
  public constructor(props: IItemEditFormProps) {
    super(props);

    this.state = {
      form: {
        description: props.form.description,
        price: props.form.unitPrice.toString(),
        title: props.form.title,
        imageUri: props.form.imageUri
      },
      descriptionError: "",
      priceError: "",
      titleError: "",
      imageError: ""
    };

    this.setState.bind(this);
  }

  public componentWillReceiveProps(nextProps: IItemEditFormProps) {
    if (this.props.form.itemId !== nextProps.form.itemId) {
      this.setState({
        form: {
          description: nextProps.form.description,
          imageUri: nextProps.form.imageUri,
          price: nextProps.form.unitPrice.toString(),
          title: nextProps.form.title
        },
        descriptionError: "",
        imageError: "",
        priceError: "",
        titleError: ""
      });
    }
  }

  public validateForm = (): boolean => {
    let isValid: boolean = true;

    this.setState({
      titleError: "",
      priceError: "",
      descriptionError: "",
      imageError: ""
    });

    // title
    if (this.state.form.title.length === 0 || this.state.form.title.length > 50) {
      this.setState({
        titleError: "Title must be between 1 and 50 characters"
      });
      isValid = false;
    }

    // description
    if (this.state.form.description.length === 0 || this.state.form.description.length > 255) {
      this.setState({
        descriptionError: "Description must be between 1 and 255 characters"
      });
      isValid = false;
    }

    // price
    if (parseFloat(this.state.form.price) < 0) {
      this.setState({
        priceError: "Price must be 0 or greater"
      });
      isValid = false;
    }

    // image
    if (this.state.form.imageUri.length === 0) {
      this.setState({
        imageError: "You must upload an image"
      });
      isValid = false;
    }

    return isValid;
  }

  public render(): JSX.Element {
    return (
      <form className="mt-3" onBlur={this.updateForm}>
        <div className="row">
          <div className="col-md-6">
            <label>Title *</label>
            <input
              type="text"
              className="form-control"
              maxLength={50}
              value={this.state.form.title}
              onChange={this.updateTitle}
              readOnly={this.props.readonly}
            />
            {
              this.state.titleError.length > 0 &&
              <p className="text-danger font-13 mb-0">{this.state.titleError}</p>
            }
          </div>
          <div className="col-md-6">
            <label>Unit Price *</label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">£</span>
              </div>
              <input
                type="number"
                className="form-control"
                accept="\d*\.?\d*"
                min={0}
                step="any"
                value={this.state.form.price}
                onChange={this.updatePrice}
                onBlur={this.onBlurPrice}
                readOnly={this.props.readonly}
              />
              {
                this.state.priceError.length > 0 &&
                <p className="text-danger font-13 mb-0">{this.state.priceError}</p>
              }
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12">
            <label>Image</label>
            <br/>
            {
              !this.props.readonly &&
              <>
                {
                  this.state.form.imageUri.length > 0 &&
                  <>
                    <button
                      className="btn btn-default"
                      onClick={this.clearImage}
                    >Clear Image</button>
                    <br/>
                  </>
                }
                {
                  this.state.form.imageUri.length === 0 &&
                  <>
                    <input
                      type="file"
                      className="form-control"
                      multiple={false}
                      accept="image/png,image/jpeg,image/jpg"
                      onChange={this.updateImage}
                      readOnly={this.props.readonly}
                    />
                  </>
                }
              </>
            }
            <img
              src={this.state.form.imageUri}
              style={{
                maxWidth: "100%",
                maxHeight: "200px"
              }}
              className="mt-3"
            />
            {
              this.state.imageError.length > 0 &&
              <p className="text-danger font-13 mb-0">{this.state.imageError}</p>
            }
          </div>
          <div className="col-12 mt-3">
            <label>Description *</label>
            <textarea
              className="form-control"
              rows={5}
              style={{minHeight: "100px"}}
              value={this.state.form.description}
              onChange={this.updateDescription}
              readOnly={this.props.readonly}
            />
            {
              this.state.descriptionError.length > 0 &&
              <p className="text-danger font-13 mb-0">{this.state.descriptionError}</p>
            }
          </div>
        </div>
      </form>
    );
  }

  private clearImage = (e: any): void => {
    e.preventDefault();
    this.setState({...this.state, form: {...this.state.form, imageUri: ""}, imageError: ""});
  }

  private updateImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file: File | undefined = e.target.files ? e.target.files[0] : undefined;

    if (file == null || (!file.name.includes(".jpg") && !file.name.includes(".png") && !file.name.includes(".jpeg"))) {
      this.setState(
        {...this.state, form: {...this.state.form, imageUri: ""}, imageError: "Unsupported media type. Allowed types or .jpg and .png"}
      );
      e.target.value = "";
    } else {
      var reader: FileReader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (): void => {
        const result: string = reader.result as string;
        this.setState({...this.state, form: {...this.state.form, imageUri: result}, imageError: ""});
        this.props.formChanged(this.props.form.title, this.props.form.description, this.props.form.unitPrice, result);
      };

      reader.onerror = (): void => {
        this.setState({...this.state, imageError: "Unsupported media. Try a jpg or png file"});
      };
    }
  }

  private updateForm = (): void => {
    this.props.formChanged(this.state.form.title, this.state.form.description, parseFloat(this.state.form.price), this.state.form.imageUri);
  }

  private onBlurPrice = (e: React.FocusEvent<HTMLInputElement>): void => {
    const price: string = (e.target.validity.valid && e.target.value.length > 0 ? parseFloat(e.target.value) : 0).toFixed(2);

    this.setState({...this.state, form: {...this.state.form, price}, priceError: ""});
  }

  private updatePrice = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({...this.state, form: {...this.state.form, price: e.target.value}, priceError: ""});
  }

  private updateTitle = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({...this.state, form: {...this.state.form, title: e.target.value}, titleError: ""});
  }

  private updateDescription = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({...this.state, form: {...this.state.form, description: e.target.value}, descriptionError: ""});
  }
}

export default ItemEditForm;