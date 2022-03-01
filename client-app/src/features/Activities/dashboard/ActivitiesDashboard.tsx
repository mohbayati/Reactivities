import React, { useContext, useEffect, useState } from "react";
import { Button, Grid, GridColumn, Loader } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { observer } from "mobx-react-lite";
import { LoadingComponenet } from "../../../app/layout/LoadingComponenet";
import { RootStoreContext } from "../../../app/stores/rootStore";
import InifinitScroller from "react-infinite-scroller";
import ActivityFilters from "./ActivityFilters";

export const ActivitiesDashboard: React.FC = observer(() => {
  const { activityStore } = useContext(RootStoreContext);
  const { loadingInitial, loadactivities, setPage, totalPage, page } =
    activityStore;
  const [loadingNext, setLoadingNext] = useState(false);
  const handleGetNext = () => {
    setLoadingNext(true);
    setPage(page + 1);
    console.log(totalPage, page);
    loadactivities().then(() => setLoadingNext(false));
  };

  useEffect(() => {
    loadactivities();
  }, [loadactivities]);

  if (loadingInitial && page === 0)
    return <LoadingComponenet content="activities are loading ..." />;
  return (
    <Grid>
      <GridColumn width={10}>
        <InifinitScroller
          pageStart={0}
          loadMore={handleGetNext}
          hasMore={!loadingNext && totalPage > page + 1}
        >
          <ActivityList />
        </InifinitScroller>
      </GridColumn>
      <GridColumn width={6}>
        <ActivityFilters />
      </GridColumn>
      <GridColumn width={10}>
        <Loader active={loadingNext} />
      </GridColumn>
    </Grid>
  );
});
