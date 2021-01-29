import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { Button, ButtonGroup, Card, Image } from "semantic-ui-react";
import ActivityStore from "../../../app/stores/activityStore";

export const ActivityDetails: React.FC = observer(() => {
  const activityStore =useContext(ActivityStore);
  const {selectedActivity:activity, openEditForm, cancelSelectedActivity} =activityStore;
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
              onClick={() => openEditForm(activity!.id)}
              basic
              color="blue"
              content="Edit"
            />
            <Button
              onClick={cancelSelectedActivity}
              basic
              color="grey"
              content="Cancel"
            />
          </ButtonGroup>
        </Card.Content>
      </Card>
    
  );
});
