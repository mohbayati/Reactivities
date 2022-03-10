import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { history } from "../..";

import agent from "../api/agent";
import { IUser, IUserFromValues } from "../models/user";
import { RootStore } from "./rootStore";

export default class UserStore {
  rootStore: RootStore;
  refreshTokenTimeout: any;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeObservable(this);
  }
  @observable user: IUser | null = null;
  @computed get isLoggedIn() {
    return !!this.user;
  }
  @action login = async (values: IUserFromValues) => {
    try {
      const user = await agent.User.login(values);
      runInAction(() => {
        this.user = user;
        this.rootStore.commonStore.setToken(user.token);
        this.startRefreshTokenTimer(user);
      });
      history.push("/activities");
    } catch (error) {
      throw error;
    }
  };

  @action getUser = async () => {
    try {
      const user = await agent.User.current();
      runInAction(() => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
      this.rootStore.modalStore.closeModal();
    } catch (error) {
      console.log();
    }
  };
  @action logout = () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;
    history.push("/");
  };
  @action register = async (value: IUserFromValues) => {
    try {
      const user = await agent.User.register(value);
      this.rootStore.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
      this.rootStore.modalStore.closeModal();
      history.push("/activities");
    } catch (error) {
      throw error;
    }
  };

  @action refreshToken = async () => {
    this.stopRefreshTokenTimer();
    try {
      const user = await agent.User.refreshToken();
      runInAction(() => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.startRefreshTokenTimer(user);
    } catch (error) {
      console.log();
    }
  };

  private startRefreshTokenTimer(user: IUser) {
    const jwtToken = JSON.parse(atob(user.token.split(".")[1]));
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - 60 * 1000;
    this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
}
