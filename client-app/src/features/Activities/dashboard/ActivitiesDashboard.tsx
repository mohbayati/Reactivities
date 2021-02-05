import React, { useContext, useEffect } from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { observer } from "mobx-react-lite";
import { LoadingComponenet } from "../../../app/layout/LoadingComponenet";
import ActivityStore  from "../../../app/stores/activityStore";


export const ActivitiesDashboard: React.FC = observer(() => {
  
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadactivities();
  }, [activityStore]);

  if (activityStore.loadingInitial.valueOf())
    return <LoadingComponenet content="activities are loading ..." />;
  return (
    <Grid>
      <GridColumn width={10}>
        <ActivityList />
      </GridColumn>
      <GridColumn width={6}>
        <h1>Activity Filter</h1>
      </GridColumn>
    </Grid>
  );
});
