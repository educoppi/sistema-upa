import { useState } from 'react';
import styles from '@/components/TabGroup/styles.module.css'
import Tab from '../Tab';

type tabOptions = {
    label: string;
    value: string;
}



type Props = {
    tabs: tabOptions[];
    name: string;
    onChange?: () => void;
}


export default function TabGroup({ tabs, name, onChange }: Props) {

    const [activeTab, setactiveTab] = useState(tabs[0].value)

    const changeTab = (value: string) => {
        setactiveTab(value);
    };

    return (
        <div>
            {tabs.map((tab) => (
                <Tab
                    key={tab.value}
                    label={tab.label}
                    name={name}
                    checked={activeTab === tab.value}
                    onClick={() => changeTab(tab.value)}
                />
            ))}
        </div>
    )
};