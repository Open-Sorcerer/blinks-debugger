import ActionValidator from "@/components/ActionValidator/ActionValidator";
import Console from "@/components/Console/Console";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dashboardTabs } from "@/lib/constants";

interface DashboardProps {
  AccountList: string[];
  Logs: string[];
}

export default function Dashboard({ AccountList, Logs }: DashboardProps) {
  return (
    <div className="mt-6 p-5 lg:w-[60%] bg-white border border-neutral-200 rounded-xl">
      <Tabs defaultValue="validate" className="w-full overflow-auto">
        <TabsList className="w-full bg-neutral-200 rounded-xl">
          {dashboardTabs.map((tab, index) => (
            <TabsTrigger
              key={index}
              className="min-w-[33.5%] rounded-xl py-2"
              value={tab.value}
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="validate" className="max-h-[36rem]">
          <ActionValidator />
        </TabsContent>
        <TabsContent value="console">
          <Console AccountList={AccountList} Logs={Logs} />
        </TabsContent>
        <TabsContent value="request">
          Verify the requests and response here
        </TabsContent>
      </Tabs>
    </div>
  );
}
