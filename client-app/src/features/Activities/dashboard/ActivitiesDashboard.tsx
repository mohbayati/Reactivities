import React, { useContext, useEffect, useState } from "react";
import { Grid, GridColumn, Loader } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../../app/stores/rootStore";
import InifinitScroller from "react-infinite-scroller";
import ActivityFilters from "./ActivityFilters";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceHolder";

export const ActivitiesDashboard: React.FC = observer(() => {
  const { activityStore } = useContext(RootStoreContext);
  const { loadingInitial, loadactivities, setPage, totalPage, page } =
    activityStore;
  const [loadingNext, setLoadingNext] = useState(false);
  const handleGetNext = () => {
    setLoadingNext(true);
    setPage(page + 1);
    loadactivities().then(() => setLoadingNext(false));
  };

  useEffect(() => {
    loadactivities();
  }, [loadactivities]);

  return (
    <Grid>
      <GridColumn width={10}>
        {loadingInitial && page === 0 ? (
          <ActivityListItemPlaceholder />
        ) : (
          <InifinitScroller
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={!loadingNext && totalPage > page + 1}
          >
            <ActivityList />
          </InifinitScroller>
        )}
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
