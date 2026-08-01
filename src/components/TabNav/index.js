import React from "react";
import { TabNavContainer, TabButton } from "./component.styles";

const TabNav = ({ tabs, selectedTab, onTabChange }) => {
  return (
    <TabNavContainer>
      {tabs.map((tab) => (
        <TabButton
          key={tab}
          onClick={() => onTabChange(tab)}
          className={selectedTab === tab ? "active" : ""}
        >
          {tab}
        </TabButton>
      ))}
    </TabNavContainer>
  );
};

export default TabNav;
