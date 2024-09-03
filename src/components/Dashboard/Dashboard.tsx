import ActionValidator from "@/components/ActionValidator/ActionValidator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dashboardTabs } from "@/lib/constants";
import { AccountInfoObject, SignatureDetails } from "@/types/blink";
import { Validations } from "@/types/common";
import Console from "../Console/Console";

interface DashboardProps {
  AccountList: Array<AccountInfoObject>;
  Logs: string[];
  Signatures: Array<SignatureDetails>;
  Validations: Validations;
  GetResponse: string;
  PostResponse: string;
}

export default function Dashboard({
  AccountList,
  Logs,
  Signatures,
  Validations,
  GetResponse,
  PostResponse,
}: DashboardProps) {
  return (
    <div className="p-5 lg:w-[60%] h-fit bg-white border border-neutral-200 rounded-xl">
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
          <ActionValidator ActionsValidations={Validations} />
        </TabsContent>
        <TabsContent value="console">
          <Console
            AccountList={AccountList}
            Logs={Logs}
            Signatures={Signatures}
          />
        </TabsContent>
        <TabsContent value="request">
          <div className="flex flex-col gap-4">
            <div className="text-lg font-semibold">Get Response</div>
            <div className="bg-neutral-200 rounded-xl p-4">
              <pre className="whitespace-pre-wrap break-words w-full overflow-x-auto">
                {GetResponse &&
                  JSON.stringify(JSON.parse(GetResponse), null, 2)}
              </pre>
            </div>
            <div className="text-lg font-semibold">Post Response</div>
            <div className="bg-neutral-200 rounded-xl p-4">
              <pre className="whitespace-pre-wrap break-words w-full overflow-x-auto">
                {PostResponse &&
                  JSON.stringify(JSON.parse(PostResponse), null, 2)}
              </pre>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
