import React from "react";
import { Button, ButtonGroup, Card, Image } from "semantic-ui-react";
import { IActivity } from "../../../models/activity";
interface IProps {
  activity: IActivity | null;
  setEditMode: (editMode: boolean) => void;
  setSelectedActivity: (selectedActivity: IActivity | null) => void;
}
export const ActivityDetails: React.FC<IProps> = (props) => {
  return (
    props.activity && (
      <Card fluid>
        <Image
          src={"/assets/categoryImages/" + props.activity?.category + ".jpg"}
          wrapped
          ui={false}
        />
        <Card.Content>
          <Card.Header>{props.activity?.title}</Card.Header>
          <Card.Meta>
            <span> {props.activity?.date} </span>
          </Card.Meta>
          <Card.Description>{props.activity?.description}</Card.Description>
        </Card.Content>
        <Card.Content extra>
          <ButtonGroup widths={2}>
            <Button onClick={() => props.setEditMode(true)} basic color="blue" content="Edit" />
            <Button onClick={() => props.setSelectedActivity(null)} basic color="grey" content="Cancel" />
          </ButtonGroup>
        </Card.Content>
      </Card>
    )
  );
};
