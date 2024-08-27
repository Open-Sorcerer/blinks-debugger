import ActionValidator from "@/components/ActionValidator/ActionValidator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dashboardTabs } from "@/lib/constants";
import { AccountInfoObject, SignatureDetails } from "@/types/blink/Metadata";
import Console from "../Console/Console";

interface DashboardProps {
  AccountList: Array<AccountInfoObject>;
  Logs: string[];
  Signatures: Array<SignatureDetails>;
}

export default function Dashboard({
  AccountList,
  Logs,
  Signatures,
}: DashboardProps) {
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
          <Console
            AccountList={AccountList}
            Logs={Logs}
            Signatures={Signatures}
          />
        </TabsContent>
        <TabsContent value="request">
          Verify the requests and response here
        </TabsContent>
      </Tabs>
    </div>
  );
}
