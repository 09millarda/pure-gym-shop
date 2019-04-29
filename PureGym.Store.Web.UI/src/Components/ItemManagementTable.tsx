import React from "react";
import history from "../App/history";

interface IItemManagementTableProps {
  items: Array<{
    itemId: number;
    name: string;
    price: number;
  }>;
}

interface IItemManagementTableRowProps {
  itemId: number;
  title: string;
  price: number;
}

function ItemManagementTableRow(props: IItemManagementTableRowProps): JSX.Element {
  return (
    <tr onClick={() => history.push(`/item-management/edit/${props.itemId}`)} style={{cursor: "pointer"}}>
      <td>{props.itemId}</td>
      <td>{props.title}</td>
      <td>{props.price.toFixed(2)}</td>
    </tr>
  );
}

function ItemManagementTable(props: IItemManagementTableProps): JSX.Element {
  return (
    <div className="row">
      <div className="col-12">
        <div className="table-responsive mt-3">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Item Id</th>
                <th>Title</th>
                <th>Unit Price (£)</th>
              </tr>
            </thead>
            <tbody>
              {
                props.items.map((item, i) =>
                  <ItemManagementTableRow
                    itemId={item.itemId}
                    key={i}
                    price={item.price}
                    title={item.name}
                  />
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ItemManagementTable;