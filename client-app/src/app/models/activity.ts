/**
 * interface IActivity
 */

export interface IActivitiesEnvelope {
  activities: IActivity[];
  activityCount: number;
}
export interface IActivity {
  id: string;
  title: string;
  date: Date;
  description: string;
  category: string;
  city: string;
  venue: string;
  isGoing: boolean;
  isHost: boolean;
  attendees: IAttendee[];
  comments: IComment[];
}

export interface IComment {
  id: string;
  createAt: string;
  body: string;
  username: string;
  displayName: string;
  image: string;
}
export interface IActivityFormValues extends Partial<IActivity> {
  time?: Date;
}
export class ActivityFormValues implements IActivityFormValues {
  id?: string = undefined;
  title: string = "";
  date?: Date = undefined;
  time?: Date = undefined;
  description: string = "";
  category: string = "";
  city: string = "";
  venue: string = "";
  constructor(init?: IActivityFormValues) {
    if (init && init.date) {
      init.time = init.date;
    }
    Object.assign(this, init);
  }
}

export interface IAttendee {
  username: string;
  displayName: string;
  image: string;
  isHost: boolean;
  following?: boolean;
}
