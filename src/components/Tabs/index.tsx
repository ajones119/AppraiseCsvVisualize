import { ReactNode } from "react";
import css from "./Tabs.module.scss";
import Button from "../Button";
type TabsProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: { key: string; title: ReactNode; content: ReactNode }[];
};

const Tabs = ({ activeTab, tabs, setActiveTab }: TabsProps) => {
  return (
    <div className={css.tabs}>
      <div className={`no-print ${css.tabList}`}>
        {tabs.map((tab) => (
          <Button onClick={() => setActiveTab(tab.key)}>{tab.title}</Button>
        ))}
      </div>
      <div className={css.content}>
        {tabs.find((tab) => tab.key === activeTab)?.content}
      </div>
    </div>
  );
};

export default Tabs;
