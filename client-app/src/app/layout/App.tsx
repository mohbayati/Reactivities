import React, {
  useEffect,
  Fragment,
  useContext,
} from "react";
import { Container } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";
import NavBar from "../../features/nav/NavBar";
import { ActivitiesDashboard } from "../../features/Activities/dashboard/ActivitiesDashboard";
import { LoadingComponenet } from "./LoadingComponenet";
import ActivityStore from "../stores/activityStore";
import { observer } from "mobx-react-lite";

const App = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadactivities();
  }, [activityStore]);
  
  if (activityStore.loadingInitial.valueOf())
    return <LoadingComponenet content="activities are loading ..." />;
  return (
    <Fragment>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <ActivitiesDashboard/>
      </Container>
    </Fragment>
  );
};

export default observer(App);
