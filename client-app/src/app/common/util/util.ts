import { IActivity, IAttendee } from "../../models/activity";
import { IUser } from "../../models/user";

export const combineDateAndTime = (date: Date, time: Date) => {
  // const timeString = time.getHours() + ":" + time.getMinutes() + ":00";
  // const year = date.getFullYear();
  // const month = date.getMonth();
  // const day = date.getDate();
  // const dateString = year + "-" + month + "-" + day;
  const dateString = date.toISOString().split("T")[0];
  const timeString = time.toISOString().split("T")[1];
  return new Date(dateString + " " + timeString);
};

export const setActivityProps = (activity: IActivity, user: IUser) => {
  activity.date = new Date(activity.date);
  activity.isGoing = activity.attendees.some(
    (a) => a.displayName === user.displayName
  );
  activity.isHost = activity.attendees.some(
    (a) => a.displayName === user.displayName && a.isHost
  );
  return activity;
};
export const createAttendee = (user: IUser): IAttendee => {
  return {
    displayName: user.displayName,
    isHost: false,
    username: user.username,
    image: user.image!,
  };
};

export const dataURItoBlob = (dataURI: any) => {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(",")[0].indexOf("base64") >= 0)
    byteString = atob(dataURI.split(",")[1]);
  else byteString = unescape(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
};
