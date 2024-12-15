import { invoker } from "@/invoker";

const app = invoker();

interface StageProps {
  stage?: string;
  msgId?: string;
}

const Hatena = () => (
  <span className="ml-[5px] inline-block w-[18px] h-[18px] leading-[18px] text-center border border-[#e0e0e0] text-[#666] rounded-full">
    ?
  </span>
);

const Status = () => (
  <div className="flex items-center text-[14px] leading-[24px] text-[#AAAAAA]">
    <span>90 days ago</span>
    <span className="flex-1 mx-4 h-[1px] bg-[#AAA]"></span>
    <span>99.67 % uptime</span>
    <span className="flex-1 mx-4 h-[1px] bg-[#AAA]"></span>
    <span>Today</span>
  </div>
);

export async function Stage(props: StageProps) {
  const { stage, msgId } = props;

  let res, data;
  if (stage) res = await app.stage[":stage"].$get({ param: { stage } });
  if (msgId) res = await app[":id"].$get({ param: { id: msgId } });
  if (res) data = await res.json();

  return (
    <div className="min-w-[1440px] min-h-[1024px] bg-white">
      <div className="mx-auto max-w-[850px]">
        <div className="pt-[70px] mb-[70px]">
          <span className="text-[#050505] text-[40px] font-bold">OpenAI</span>
          <a
            href="#"
            className="px-[15px] py-[10px] float-right bg-[#10A37F] rounded"
            style={{ boxShadow: "rgba(0, 0, 0, 0.15) 0px -2px 0px 0px inset" }}
          >
            <span className="text-xs font-bold leading-[22px]">
              SUBSCRIBE TO UPDATES
            </span>
          </a>
        </div>
        <div className="mx-auto max-w-[850px]">
          {data ? (
            <div className="mb-[70px]">
              <div className="px-5 py-3 bg-[#EAAC34] rounded-t">
                <span className="text-xl font-bold">
                  All System Operational
                </span>
              </div>
              <div className="px-5 py-3 border border-[#EAAC34] rounded-b text-[#050505]">
                <span className="font-bold">title</span>
                <span className="mx-2">-</span>
                <span>content</span>
              </div>
            </div>
          ) : (
            <div className="mb-[70px] px-5 py-3 bg-[#10A37F] rounded">
              <span className="text-xl font-bold">All System Operational</span>
            </div>
          )}
        </div>
        <div className="text-right leading-[24px]">
          <span className="text-[#aaaaaa]">Uptime over the past 90 days.</span>
          <span className="text-[#10A37F]">View historical uptime.</span>
        </div>
        <div className="text-[#050505] border border-1 border-[#e0e0e0] rounded">
          <div className="px-5 py-4">
            <div>
              <span className="text-base font-bold">API</span>
              <Hatena />
              <span className="float-right text-[14px] text-[#10A37F]">
                Operational
              </span>
            </div>
            <img className="w-full h-[34px]" src="/svgs/0.svg" />
            <Status />
          </div>
          <div className="px-5 py-4 border-t border-[#e0e0e0]">
            <div>
              <span className="text-base font-bold">ChatGPT</span>
              <Hatena />
              <span className="float-right text-[14px] text-[#10A37F]">
                Operational
              </span>
            </div>
            <img className="w-full h-[34px]" src="/svgs/1.svg" />
            <Status />
          </div>
          <div className="px-5 py-4 border-t border-[#e0e0e0]">
            <div>
              <span className="text-base font-bold">Sora</span>
              <Hatena />
              <span className="float-right text-[14px] text-[#10A37F]">
                Operational
              </span>
            </div>
            <img className="w-full h-[34px]" src="/svgs/2.svg" />
            <Status />
          </div>
          <div className="px-5 py-4 border-t border-[#e0e0e0]">
            <div>
              <span className="text-base font-bold">Playground</span>
              <Hatena />
              <span className="float-right text-[14px] text-[#10A37F]">
                Operational
              </span>
            </div>
            <img className="w-full h-[34px]" src="/svgs/3.svg" />
            <Status />
          </div>
          <div className="px-5 py-4 border-t border-[#e0e0e0]">
            <div>
              <span className="text-base font-bold">Labs</span>
              <Hatena />
              <span className="float-right text-[14px] text-[#10A37F]">
                Operational
              </span>
            </div>
            <img className="w-full h-[34px]" src="/svgs/4.svg" />
            <Status />
          </div>
        </div>
      </div>
    </div>
  );
}

interface Props {
  params: Promise<{ stage: string }>;
}

export default async function StagePage(props: Props) {
  const { params } = props;
  const { stage } = await params;
  return <Stage stage={stage} />;
}
