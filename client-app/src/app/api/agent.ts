import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { dataURItoBlob } from "../common/util/util";
import { IActivitiesEnvelope, IActivity } from "../models/activity";
import { IPhoto, IProfile } from "../models/profile";
import { IUser, IUserFromValues } from "../models/user";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("jwt");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(undefined, (error) => {
  if (error.message === "Network Error" && !error.response) {
    toast.error("Network Error");
  }
  const { status, config, data, headers } = error.response;
  if (status === 404) {
    history.push("/NotFound");
  }
  if (
    status === 401 &&
    headers["www-authenticate"] ===
      'Bearer error="invalid_token", error_description="The token is expired"'
  ) {
    window.localStorage.removeItem("jwt");
    history.push("/");
    toast.info("your session has expired, please login again");
  }
  if (
    status === 400 &&
    config.method === "get" &&
    data.errors.hasOwnProperty("id")
  ) {
    history.push("/NotFound");
  }
  if (status === 500) {
    toast.error("Server error-----");
  }
  throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

const request = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  del: (url: string) => axios.delete(url).then(responseBody),
  postForm: (url: string, file: Blob) => {
    let formData = new FormData();
    const blo = dataURItoBlob(file);
    formData.append("File", blo);
    return axios
      .post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(responseBody);
  },
};

const Activities = {
  list: (params: URLSearchParams): Promise<IActivitiesEnvelope> =>
    axios.get("/activities", { params: params }).then(responseBody),
  details: (id: string): Promise<IActivity> => request.get(`/activities/${id}`),
  create: (activity: IActivity) => request.post("/activities", activity),
  update: (activity: IActivity) =>
    request.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => request.del(`/activities/${id}`),
  attend: (id: string) => request.post(`/activities/${id}/attend`, {}),
  unattend: (id: string) => request.del(`/activities/${id}/attend`),
};

const User = {
  current: (): Promise<IUser> => request.get(`/user`),
  login: (user: IUserFromValues): Promise<IUser> =>
    request.post(`/user/login`, user),
  register: (user: IUserFromValues): Promise<IUser> =>
    request.post(`/user/register`, user),
  refreshToken: (): Promise<IUser> => request.post(`/user/refreshToken`, {}),
};

const Profiles = {
  get: (username: string): Promise<IProfile> =>
    request.get(`/profiles/${username}`),
  uploadPhoto: (photo: Blob): Promise<IPhoto> =>
    request.postForm("/photo", photo),
  setMainPhoto: (id: string) => request.post(`/photo/${id}/setMain`, {}),
  deletePhoto: (id: string) => request.del(`/photo/${id}`),
  updateProfile: (profile: Partial<IProfile>) =>
    request.put(`/profiles`, profile),
  follow: (username: string) =>
    request.post(`/profiles/${username}/follow`, {}),
  unfollow: (username: string) => request.del(`/profiles/${username}/follow`),
  listFollowings: (username: string, predicate: string) =>
    request.get(`/profiles/${username}/follow?predicate=${predicate}`),
  listActivities: (username: string, predicate: string) =>
    request.get(`/profiles/${username}/activities?predicate=${predicate}`),
};

const objects = {
  Activities,
  User,
  Profiles,
};
export default objects;
