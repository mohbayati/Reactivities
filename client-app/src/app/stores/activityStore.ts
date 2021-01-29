import { action, computed, makeObservable, observable, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import agent from "../api/agent";
import { IActivity } from "../models/activity";

configure({ enforceActions: "always" });
class ActivityStore {
    constructor() {
        makeObservable(this)
    }

    @observable activityRegistry = new Map();
    @observable activities: IActivity[] = [];
    @observable loadingInitial: boolean = false;
    @observable selectedActivity: IActivity | undefined;
    @observable editMode = false;
    @observable submitting = false;
    @observable target = '';

    @computed get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).slice().sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
    }

    @action loadactivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction(() => {
                activities.forEach((activity) => {
                    activity.date = activity.date.split(".")[0];

                    this.activityRegistry.set(activity.id, activity);
                });
                this.loadingInitial = false;
            })

        }
        catch (error) {
            runInAction(() => {
                this.loadingInitial = false;
            })
            console.log(error)

        }
    };

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.editMode = false;
                this.submitting = false;
            })

        } catch (error) {
            runInAction(() => {
                this.submitting = false;
            })
            console.log(error);
        }
    }

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.submitting = false;
            })

        } catch (error) {
            runInAction(() => {
                this.submitting = false;
            })
            console.log(error);

        }

    }

    @action deleteActivity = async (e: SyntheticEvent<HTMLButtonElement>,
        activity: IActivity) => {
        this.submitting = true;
        this.target = e.currentTarget.name;
        try {
            await agent.Activities.delete(activity.id);
            runInAction(() => {
                this.activityRegistry.delete(activity.id);
                this.submitting = false;
                this.target = '';
            })

        } catch (error) {
            runInAction(() => {
                this.submitting = false;
                this.target = '';
            })
            console.log(error);
        }
    }

    @action openEditForm = (id: string) => {
        this.activityRegistry.get(id)
        this.editMode = true;
    }
    @action cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
        this.editMode = false;
    }
    @action openCreateForm = () => {
        this.selectedActivity = undefined;
        this.editMode = true;
    }

    @action selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);//this.activities.find(a => a.id === id);
        this.editMode = false;
    }
}


export default createContext(new ActivityStore()) 