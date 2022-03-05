import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import {
  action,
  computed,
  makeObservable,
  observable,
  reaction,
  runInAction,
  toJS,
} from "mobx";
import { SyntheticEvent } from "react";
import { toast } from "react-toastify";
import { history } from "../..";
import agent from "../api/agent";
import { createAttendee, setActivityProps } from "../common/util/util";
import { IActivity } from "../models/activity";
import { RootStore } from "./rootStore";

const LIMIT = 2;
export default class ActivityStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeObservable(this);

    reaction(
      () => this.predicate.keys(),
      () => {
        this.page = 0;
        this.activityRegistry.clear();
        this.loadactivities();
      }
    );
  }

  @observable activityRegistry = new Map();
  @observable activities: IActivity[] = [];
  @observable loadingInitial: boolean = false;
  @observable activity: IActivity | null = null;
  @observable submitting = false;
  @observable target = "";
  @observable loading = false;
  @observable.ref hunconnection: HubConnection | null = null;
  @observable activityCount = 0;
  @observable page = 0;
  @observable predicate = new Map();

  @action setPredicate = (predicate: string, value: string | Date) => {
    this.predicate.clear();
    if (predicate !== "all") {
      this.predicate.set(predicate, value);
    }
  };

  @computed get axiosParams() {
    const params = new URLSearchParams();
    params.append("limit", String(LIMIT));
    params.append("offset", `${this.page ? this.page * LIMIT : 0}`);
    this.predicate.forEach((value, key) => {
      if (key === "startDate") {
        params.append(key, value.toISOString());
      } else {
        params.append(key, value);
      }
    });
    return params;
  }

  @computed get totalPage() {
    return Math.ceil(this.activityCount / LIMIT);
  }

  @action setPage = (page: number) => {
    this.page = page;
  };

  @action createHunConnection = (activityId: string) => {
    this.hunconnection = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_API_CHAT_URL!, {
        accessTokenFactory: () => this.rootStore.commonStore.token!,
      })
      .configureLogging(LogLevel.Information)
      .build();
    this.hunconnection
      .start()
      .then(() => console.log(this.hunconnection!.state))
      .then(() => {
        console.log("Attempt to join group");
        this.hunconnection?.invoke("AddToGroup", activityId);
      })
      .catch((error) => console.log("Error establishing connection", error));
    this.hunconnection.on("ReceiveComment", (comment) => {
      runInAction(() => {
        console.log(comment);
        this.activity!.comments.push(comment);
      });
    });

    this.hunconnection.on("Send", (meesage) => toast.info(meesage));
  };
  @action stopConnection = () => {
    this.hunconnection!.invoke("RemoveFromGroup", this.activity!.id)
      .then(() => {
        this.hunconnection!.stop();
      })
      .then(() => console.log("Connection stopped"))
      .catch((err) => console.log(err));
  };
  @action addComment = async (values: any) => {
    values.activityId = this.activity!.id;
    try {
      console.log(values);
      await this.hunconnection!.invoke("SendComment", values);
    } catch (error) {
      console.log(error);
    }
  };
  @computed get activitiesByDate() {
    return this.groupActivityByDate(Array.from(this.activityRegistry.values()));
  }

  groupActivityByDate(activities: IActivity[]) {
    const sortActivities = activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
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
      const activitiesEnvelopes = await agent.Activities.list(this.axiosParams);
      const { activities, activityCount } = activitiesEnvelopes;
      runInAction(() => {
        activities.forEach((activity) => {
          setActivityProps(activity, this.rootStore.userStore.user!);
          this.activityRegistry.set(activity.id, activity);
        });
        this.activityCount = activityCount;
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
      return toJS(activity);
    } else {
      try {
        this.loadingInitial = false;
        activity = await agent.Activities.details(id);
        runInAction(() => {
          setActivityProps(activity, this.rootStore.userStore.user!);
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
      const attendee = createAttendee(this.rootStore.userStore.user!);
      attendee.isHost = true;
      let attendees = [];
      attendees.push(attendee);
      activity.attendees = attendees;
      activity.comments = [];
      activity.isHost = true;
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

  @action attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!);
    this.loading = true;
    try {
      await agent.Activities.attend(this.activity!.id);
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees.push(attendee);
          this.activity.isGoing = true;
          this.activityRegistry.set(this.activity.id, this.activity);
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem singing up to activity");
      console.log(error);
    }
  };
  @action cancelAttendee = async () => {
    this.loading = true;
    try {
      await agent.Activities.unattend(this.activity!.id);
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees = this.activity.attendees.filter(
            (a) => a.username !== this.rootStore.userStore.user!.username
          );
          this.activity.isGoing = false;
          this.activityRegistry.set(this.activity.id, this.activity);
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Problem cancelling activity");
      console.log(error);
    }
  };
}
