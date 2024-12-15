import { invoker } from "@/invoker";

const app = invoker();

interface StageProps {
  stage?: string;
  msgId?: string;
}

export async function Stage(props: StageProps) {
  const { stage } = props;
  let res, data;
  if (stage) res = await app[":stage"].$get({ param: { stage } });
  if (res) data = await res.json();

  return <div className="w-[1440px] h-[1024px] bg-white">{data?.content}</div>;
}

interface Props {
  params: { stage: string };
}

export default async function StagePage(props: Props) {
  const { params } = props;
  const { stage } = params;
  return <Stage stage={stage} />;
}
