import React, { useEffect } from "react";
import PageTitle from "../../Layout/PageTitle/PageTitle";
import { Link, Switch, Route } from "react-router-dom";
import SubsetManagementTable from "../../Components/SubsetManagementTable";
import { ISubsetGroup, IReduxState } from "../../App/index";
import { fetchAllSubsets } from "./redux/subsetActions";
import { connect } from "react-redux";
import NewSubset from "./New/NewSubset";
import EditSubset from "./Edit/EditSubset";

interface ISubsetManagementDispatchProps {
  fetchAllSubsets: () => void;
}

interface ISubsetManagementStateProps {
  subsets: ISubsetGroup[];
  isFetchingSubsets: boolean;
}

type ISubsetManagementProps = ISubsetManagementStateProps & ISubsetManagementDispatchProps;

function SubsetsManagement(props: ISubsetManagementProps): JSX.Element {
  useEffect(() => {
    props.fetchAllSubsets();
  }, []);

  return (
    <div className="row">
      <div className="col-xl-8 col-lg-6">
        <div className="card-box">
          <PageTitle
            title="ITEM SUBSETS"
          />
          <div className="row">
            <div className="col-12">
              <Link to="/subset-management/new" className="btn btn-info mt-3">New Subset</Link>
              <button className="btn btn-secondary mt-3 float-right" onClick={props.fetchAllSubsets}>Refresh</button>
            </div>
          </div>
          <SubsetManagementTable
            subsets={props.subsets}
          />
        </div>
      </div>
      <div className="col-lg-6 col-xl-4">
        <Switch>
          <Route exact={true} path="/subset-management/new" component={NewSubset} />
          <Route path="/subset-management/edit/:subsetId" component={EditSubset} />
        </Switch>
      </div>
    </div>
  );
}

function mapStateToProps(state: IReduxState): ISubsetManagementStateProps {
  return {
    isFetchingSubsets: state.subsetState.isFetchingSubsets,
    subsets: state.subsetState.subsets
  };
}

function mapDispatchToProps(dispatch: any): ISubsetManagementDispatchProps {
  return {
    fetchAllSubsets: () => dispatch(fetchAllSubsets())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SubsetsManagement);