import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

function TabWrap({ tabData }) {
    return (
        // <div className="mt-5 shadow-md">
        <Tabs className="shadow-md border border-primary rounded-t-lg">
            <TabList className={`bg-primary text-white shadow-md px-4 pt-1 rounded-t-md font-bold italic text-xs`}>
                {tabData.map((tab, index) => (
                    <Tab key={index}>{tab.label}</Tab>
                ))}
            </TabList>

            {tabData.map((tab, index) => (
                <TabPanel key={index} className="px-2 md:px-4">
                    {tab.content}
                </TabPanel>
            ))}
        </Tabs>
        // </div>
    );
}

export default TabWrap;
