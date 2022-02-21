import { observer } from "mobx-react-lite";
import { Tab } from "semantic-ui-react";
import ProfileDescription from "./profileDescription";
import ProfilePhotos from "./profilePhotos";

const panes = [
  { menuItem: "About", render: () => <ProfileDescription /> },
  { menuItem: "Photos", render: () => <ProfilePhotos /> },
  {
    menuItem: "Activities",
    render: () => <Tab.Pane>Activities content</Tab.Pane>,
  },
  {
    menuItem: "Followers",
    render: () => <Tab.Pane>Followers content</Tab.Pane>,
  },
  {
    menuItem: "Following",
    render: () => <Tab.Pane>Following content</Tab.Pane>,
  },
];
const ProfileContent = () => {
  return (
    <Tab
      menu={{ fluid: true, vertical: true }}
      menuPosition="right"
      panes={panes}
      //activeIndex={1}
    />
  );
};

export default observer(ProfileContent);
