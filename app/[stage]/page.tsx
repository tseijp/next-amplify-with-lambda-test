import Demo from "./demo";

interface Props {
  params: Promise<{ stage: string }>;
}

export default async function StagePage(props: Props) {
  const { params } = props;
  const { stage } = await params;
  return <Demo stage={stage} />;
}
