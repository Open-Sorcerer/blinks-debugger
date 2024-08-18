import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export default function Dashboard() {
  return (
    <div className="mt-5 md:m-8 p-5 lg:w-[50%] bg-white border border-neutral-200 rounded-lg">
      <Tabs defaultValue="validate" className="w-full">
        <TabsList className="w-full bg-neutral-200 rounded-xl">
          <TabsTrigger
            className="min-w-[33.5%] rounded-xl py-2"
            value="validate"
          >
            Actions
          </TabsTrigger>
          <TabsTrigger
            className="min-w-[33.5%] rounded-xl py-2"
            value="console"
          >
            Console
          </TabsTrigger>
          <TabsTrigger
            className="min-w-[33.5%] rounded-xl py-2"
            value="request"
          >
            Request
          </TabsTrigger>
        </TabsList>
        <TabsContent value="validate">Verify the checks and speed</TabsContent>
        <TabsContent value="console">Console your logs here</TabsContent>
        <TabsContent value="request">
          Verify the requests and response here
        </TabsContent>
      </Tabs>
    </div>
  );
}
