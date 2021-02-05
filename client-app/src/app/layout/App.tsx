import { Fragment } from "react";
import { Container } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";
import NavBar from "../../features/nav/NavBar";
import { ActivitiesDashboard } from "../../features/Activities/dashboard/ActivitiesDashboard";
import { observer } from "mobx-react-lite";
import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import homePage from "../../features/HomePage/homePage";
import ActivityForm from "../../features/Activities/form/ActivityForm";
import { ActivityDetails } from "../../features/Activities/details/ActivityDetails";

const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <Fragment>
      <Route exact path={"/"} component={homePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Route
                exact
                path={"/activities"}
                component={ActivitiesDashboard}
              />
              <Route
                key={location.key}
                path={["/createActivity", "/manage/:id"]}
                component={ActivityForm}
              />
              <Route path={"/activities/:id"} component={ActivityDetails} />
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
