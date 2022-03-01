import { observer } from "mobx-react-lite";
import { Tab } from "semantic-ui-react";
import ProfileActivities from "./profileActivities";
import ProfileDescription from "./profileDescription";
import ProfileFollowings from "./profileFollowings";
import ProfilePhotos from "./profilePhotos";

const panes = [
  { menuItem: "About", render: () => <ProfileDescription /> },
  { menuItem: "Photos", render: () => <ProfilePhotos /> },
  {
    menuItem: "Activities",
    render: () => <ProfileActivities />,
  },
  {
    menuItem: "Followers",
    render: () => <ProfileFollowings />,
  },
  {
    menuItem: "Following",
    render: () => <ProfileFollowings />,
  },
];

interface IProps {
  setActiveTab: (activeIndex: any) => void;
}
const ProfileContent: React.FC<IProps> = ({ setActiveTab }) => {
  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition="right"
      panes={panes}
      onTabChange={(e, data) => setActiveTab(data.activeIndex)}
      //activeIndex={1}
    />
  );
};

export default observer(ProfileContent);
