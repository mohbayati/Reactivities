import {
  action,
  computed,
  makeObservable,
  observable,
  configure,
  runInAction,
} from "mobx";
import { createContext, SyntheticEvent } from "react";
import { toast } from "react-toastify";
import { history } from "../..";
import agent from "../api/agent";
import { IActivity } from "../models/activity";

configure({ enforceActions: "always" });
class ActivityStore {
  constructor() {
    makeObservable(this);
  }

  @observable activityRegistry = new Map();
  @observable activities: IActivity[] = [];
  @observable loadingInitial: boolean = false;
  @observable activity: IActivity | null = null;
  @observable submitting = false;
  @observable target = "";

  @computed get activitiesByDate() {
    return this.groupActivityByDate(Array.from(this.activityRegistry.values()));
  }

  groupActivityByDate(activities: IActivity[]) {
    const sortActivities = activities.sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
    return Object.entries(
      sortActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split("T")[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  @action loadactivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction(() => {
        activities.forEach((activity) => {
          activity.date = new Date(activity.date);

          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingInitial = false;
      });
      console.log(error);
    }
  };
  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);

    if (activity) {
      this.activity = activity;
      return activity;
    } else {
      try {
        this.loadingInitial = false;
        activity = await agent.Activities.details(id);
        runInAction(() => {
          activity.date = new Date(activity.date);
          this.activity = activity;
          this.activityRegistry.set(activity.id, activity);
          this.loadingInitial = false;
        });
        return activity;
      } catch (error) {
        runInAction(() => {
          this.loadingInitial = false;
        });
        console.log(error);
        //throw error;
      }
    }
  };
  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };
  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
      });
      toast.error("Problem submitting data");
      //console.log(error.response);
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;

        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
      });
      toast.error("Problem submitting data");
      console.log(error);
    }
  };

  @action deleteActivity = async (
    e: SyntheticEvent<HTMLButtonElement>,
    activity: IActivity
  ) => {
    this.submitting = true;
    this.target = e.currentTarget.name;
    try {
      await agent.Activities.delete(activity.id);
      runInAction(() => {
        this.activityRegistry.delete(activity.id);
        this.submitting = false;
        this.target = "";
      });
    } catch (error) {
      runInAction(() => {
        this.submitting = false;
        this.target = "";
      });
      console.log(error);
    }
  };
  @action clearActivity = () => {
    this.activity = null;
  };
}

export default createContext(new ActivityStore());
