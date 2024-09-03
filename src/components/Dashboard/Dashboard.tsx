import ActionValidator from "@/components/ActionValidator/ActionValidator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dashboardTabs } from "@/lib/constants";
import { AccountInfoObject, SignatureDetails } from "@/types/blink";
import { Validations } from "@/types/common";
import Console from "../Console/Console";
import Requests from "../Requests/Requests";
import ActionValidatorSkeleton from "../Skeletons/ActionValidatorSkeleton";
import ConsoleSkeleton from "../Skeletons/ConsoleSkeleton";
import RequestsSkeleton from "../Skeletons/RequestsSkeleton";

interface DashboardProps {
  AccountList: Array<AccountInfoObject>;
  Logs: string[];
  Signatures: Array<SignatureDetails>;
  Validations: Validations;
  GetResponse: string;
  PostResponse: string;
  isValidating: boolean;
  isSimulating: boolean;
}

export default function Dashboard({
  AccountList,
  Logs,
  Signatures,
  Validations,
  GetResponse,
  PostResponse,
  isValidating,
  isSimulating,
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
          {isValidating ? (
            <ActionValidatorSkeleton />
          ) : (
            <ActionValidator ActionsValidations={Validations} />
          )}
        </TabsContent>
        <TabsContent value="console">
          {isSimulating ? (
            <ConsoleSkeleton />
          ) : (
            <Console
              AccountList={AccountList}
              Logs={Logs}
              Signatures={Signatures}
            />
          )}
        </TabsContent>
        <TabsContent value="request">
          {isValidating ? (
            <RequestsSkeleton />
          ) : (
            <Requests GetResponse={GetResponse} PostResponse={PostResponse} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
