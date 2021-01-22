import React, { SyntheticEvent } from "react";
import { Grid, GridColumn } from "semantic-ui-react";
import { IActivity } from "../../../models/activity";
import { ActivityDetails } from "../details/ActivityDetails";
import { ActivityForm } from "../form/ActivityForm";
import { ActivityList } from "./ActivityList";

interface IProps {
  activities: IActivity[];
  selectedActivity: IActivity | null;
  selectActivity: (id: string) => void;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
  setSelectedActivity: (selectedActivity: IActivity | null) => void;
  createActivity:(activity:IActivity) => void;
  editActivity:(activity:IActivity) => void;
  deleteActivity :(e: SyntheticEvent<HTMLButtonElement>,activity:IActivity) => void;
  submitting: boolean;
  target:string;
}

export const ActivitiesDashboard: React.FC<IProps> = (props) => {
  return (
    <Grid>
      <GridColumn width={10}>
        <ActivityList
          activities={props.activities}
          selectActivity={props.selectActivity}
          deleteActivity ={props.deleteActivity}
          submitting={props.submitting}
          target={props.target}
        ></ActivityList>
      </GridColumn>
      <GridColumn width={6}>
        {props.selectedActivity && !props.editMode && (
          <ActivityDetails
            activity={props.selectedActivity}
            setEditMode={props.setEditMode}
            setSelectedActivity={props.setSelectedActivity}
            
          />
        )}
        {props.editMode && (
          <ActivityForm
          key = {((props.selectedActivity && props.selectedActivity.id) || 0)}
            setEditMode={props.setEditMode}
            activity={props.selectedActivity!}
            createActivity ={props.createActivity}
            editActivity = {props.editActivity}
            submitting={props.submitting}
          />
        )}
      </GridColumn>
    </Grid>
  );
};
