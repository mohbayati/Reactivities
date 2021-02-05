import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Button, ButtonGroup, Card, Image } from "semantic-ui-react";
import { LoadingComponenet } from "../../../app/layout/LoadingComponenet";
import ActivityStore from "../../../app/stores/activityStore";

interface DetailProps {
  id: string;
}
export const ActivityDetails: React.FC<
  RouteComponentProps<DetailProps>
> = observer(({ match, history }) => {
  const activityStore = useContext(ActivityStore);
  const {
    activity,
    loadingInitial,
    loadActivity,
  } = activityStore;

  useEffect(() => {
    loadActivity(match.params.id);
  }, [loadActivity, match.params.id]);
  if (loadingInitial || !activity)
    return <LoadingComponenet content="Loading activity..." />;
  return (
    <Card fluid>
      <Image
        src={"/assets/categoryImages/" + activity!.category + ".jpg"}
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{activity!.title}</Card.Header>
        <Card.Meta>
          <span> {activity!.date} </span>
        </Card.Meta>
        <Card.Description>{activity!.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <ButtonGroup widths={2}>
          <Button
            as={Link}
            to={`/manage/${activity.id}`}
            basic
            color="blue"
            content="Edit"
          />
          <Button
            onClick={() => history.push("/activities")}
            basic
            color="grey"
            content="Cancel"
          />
        </ButtonGroup>
      </Card.Content>
    </Card>
  );
});
