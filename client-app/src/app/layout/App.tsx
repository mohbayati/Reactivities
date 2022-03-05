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
import ProfilePage from "../../features/profile/profilePage";
import PrivateRoute from "./PrivateRoute";

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
                <PrivateRoute
                  exact
                  path={"/activities"}
                  component={ActivitiesDashboard}
                />
                <PrivateRoute
                  key={location.key}
                  path={["/createActivity", "/manage/:id"]}
                  component={ActivityForm}
                />
                <PrivateRoute
                  path={"/activities/:id"}
                  component={ActivityDetails}
                />
                <PrivateRoute
                  path={"/profile/:username"}
                  component={ProfilePage}
                />
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
