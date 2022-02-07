import { Fragment, useContext, useEffect } from "react";
import { Container } from "semantic-ui-react";
import { ToastContainer } from "react-toastify";
import "semantic-ui-css/semantic.min.css";
import NavBar from "../../features/nav/NavBar";
import { ActivitiesDashboard } from "../../features/Activities/dashboard/ActivitiesDashboard";
import { observer } from "mobx-react-lite";
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from "react-router-dom";
import homePage from "../../features/HomePage/homePage";
import ActivityForm from "../../features/Activities/form/ActivityForm";
import { ActivityDetails } from "../../features/Activities/details/ActivityDetails";
import NotFound from "./NotFound";
import LoginForm from "../../features/user/loginForm";
import { RootStoreContext } from "../stores/rootStore";
import { LoadingComponenet } from "./LoadingComponenet";
import ModalContainer from "../common/modals/modalContainer";

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, token } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;
  useEffect(() => {
    if (token) {
      getUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [token, getUser, setAppLoaded]);

  if (!setAppLoaded) return <LoadingComponenet content="Loading app..." />;

  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer position="bottom-right" />
      <Route exact path={"/"} component={homePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Switch>
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
                <Route path="/login" component={LoginForm} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
