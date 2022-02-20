import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import { LoadingComponenet } from "../../app/layout/LoadingComponenet";
import { RootStoreContext } from "../../app/stores/rootStore";
import ProfileContent from "./profileContent";
import ProfileHeader from "./profileHeader";

interface RoutParams {
  username: string;
}

interface IProp extends RouteComponentProps<RoutParams> {}

const ProfilePage: React.FC<IProp> = ({ match }) => {
  const rootStore = useContext(RootStoreContext);
  const { loadProfile, loadingProfile, profile } = rootStore.profileStore;

  useEffect(() => {
    loadProfile(match.params.username);
  }, [match, loadProfile]);

  if (loadingProfile) return <LoadingComponenet content="Loading profile..." />;
  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader profile={profile!} />
        <ProfileContent />
      </Grid.Column>
    </Grid>
  );
};
export default observer(ProfilePage);
