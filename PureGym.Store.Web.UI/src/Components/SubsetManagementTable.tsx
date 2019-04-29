import React from "react";
import { ISubsetGroup } from "../App/index";
import history from "../App/history";

interface ISubsetManagementTableProps {
  subsets: ISubsetGroup[];
}

interface ISubsetManagementTableRowProps {
  subsetId: number;
  name: string;
  items: string[];
}

function SubsetManagementTableRow(props: ISubsetManagementTableRowProps): JSX.Element {
  return (
    <tr onClick={() => history.push(`/subset-management/edit/${props.subsetId}`)} style={{cursor: "pointer"}}>
      <td>{props.subsetId}</td>
      <td>{props.name}</td>
      <td>{props.items.length === 0 ? "-" : props.items.join(", ")}</td>
    </tr>
  );
}

function SubsetManagementTable(props: ISubsetManagementTableProps): JSX.Element {
  return (
    <div className="row">
      <div className="col-12">
        <div className="table-responsive mt-3">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Subset Id</th>
                <th>Name</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {
                props.subsets.map((subset, i) =>
                  <SubsetManagementTableRow
                    subsetId={subset.subsetId}
                    key={i}
                    name={subset.name}
                    items={subset.items.map(item => item.name)}
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

export default SubsetManagementTable;