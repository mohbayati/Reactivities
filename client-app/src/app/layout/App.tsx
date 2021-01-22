import React, { useState, useEffect, Fragment, SyntheticEvent } from "react";
import { Container } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";
import { IActivity } from "../../models/activity";
import NavBar from "../../features/nav/NavBar";
import { ActivitiesDashboard } from "../../features/Activities/dashboard/ActivitiesDashboard";
import agent from "../../api/agent";
import { LoadingComponenet } from "./LoadingComponenet";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState('');

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter((a) => a.id === id)[0]);
    setEditMode(false);
  };

  const handleOpenCreateForm = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCreateActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.create(activity).then(() => {
      setActivities([...activities, activity]);
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(() => setSubmitting(false));
  };
  const handleEditActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.update(activity).then(() => {
      setActivities([
        ...activities.filter((a) => a.id !== activity.id),
        activity,
      ]);
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(() => setSubmitting(false));
  };
  const handleDeleteActivity = (e: SyntheticEvent<HTMLButtonElement>, activity: IActivity) => {
    setTarget(e.currentTarget.name);
    setSubmitting(true);
    agent.Activities.delete(activity.id).then(() => {
      setActivities([...activities.filter((a) => a.id !== activity.id)]);
    }).then(() => setSubmitting(false));
  };
  useEffect(() => {
    agent.Activities.list().then((response) => {
      let activities: IActivity[] = [];
      response.forEach((activity) => {
        activity.date = activity.date.split(".")[0];
        activities.push(activity);
      });
      setActivities(activities);
    }).then(()=> setLoading(false));
  }, []);
  if (loading){
    return <LoadingComponenet content="activities are loading ..."/>
  }
  return (
    <Fragment>
      <NavBar openCreateForm={handleOpenCreateForm}></NavBar>
      <Container style={{ marginTop: "7em" }}>
        <ActivitiesDashboard
          activities={activities}
          selectActivity={handleSelectActivity}
          selectedActivity={selectedActivity}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
          target={target}
        />
      </Container>
    </Fragment>
  );
};

export default App;
