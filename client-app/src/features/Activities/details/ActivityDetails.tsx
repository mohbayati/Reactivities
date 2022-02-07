import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import { LoadingComponenet } from "../../../app/layout/LoadingComponenet";
import { RootStoreContext } from "../../../app/stores/rootStore";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivitySidebar from "./ActivityDetailedSidebar";

interface DetailProps {
  id: string;
}
export const ActivityDetails: React.FC<RouteComponentProps<DetailProps>> =
  observer(({ match, history }) => {
    const rootStore = useContext(RootStoreContext);
    const { activity, loadingInitial, loadActivity } = rootStore.activityStore;

    useEffect(() => {
      loadActivity(match.params.id);
    }, [loadActivity, match.params.id, history]);
    if (loadingInitial)
      return <LoadingComponenet content="Loading activity..." />;

    if (!activity) return <h2>activity not found</h2>;
    return (
      <Grid>
        <Grid.Column width="10">
          <ActivityDetailedHeader activity={activity} />
          <ActivityDetailedInfo activity={activity} />
          <ActivityDetailedChat />
        </Grid.Column>
        <Grid.Column width="6">
          <ActivitySidebar />
        </Grid.Column>
      </Grid>
    );
  });
