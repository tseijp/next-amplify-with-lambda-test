import { invoker } from "@/invoker";
import Image from "next/image";
import { basicSetting, advancedSetting } from "./server";
import Wheelable from "./_client/Wheelable";
import Bounding from "./_client/Bounding";
import { ZoomPercent } from "./_hooks/useZoomStore";
import Link from "next/link";
import { Stage } from "./[stage]/page";

const isNoEnv = !process.env.VPC_LAMBDA_AWS_REGION;

const app = invoker();

const padding = (value: string | number = 0, length = 2, target = "0") => {
  return (target.repeat(length) + value).slice(-length);
};

function formatTime(time: string) {
  if (!time) return "";
  const iso = new Date(time);
  const jst = new Date(iso.toLocaleString("ja-JP"));
  const YYYY = padding(jst.getFullYear(), 4);
  const MM = padding(jst.getMonth() + 1, 2);
  const dd = padding(jst.getDate(), 2);
  const hh = padding(jst.getHours(), 2);
  const mm = padding(jst.getMinutes(), 2);
  return `${YYYY}年${MM}/${dd} ${hh}:${mm}`;
}

interface Props {
  searchParams: Promise<{ q: string }>;
}

export default async function Home(props: Props) {
  const { searchParams } = props;
  const { q } = await searchParams;

  if (isNoEnv)
    return "Error: Environment variable not set in local or amplify console";

  const res = await app.index.$get();
  const list = await res.json();
  const target = q ? list.find((item) => `${item.id}` === q) : null;

  return (
    <>
      <nav>
        <div className="flex">
          <button className="gap-0.5 w-[50px] bg-out-of-the-blue">
            <Image src="/icons/ungra.svg" alt="😺" width={24} height={19} />
            <Image src="/icons/arrow.svg" alt="🔽" width={8} height={7} />
          </button>
          <button className="w-10">
            <Image src="/icons/move.svg" alt="👆" width={18} height={18} />
          </button>
          <button className="w-10">
            <Image src="/icons/hand.svg" alt="🖐️" width={20} height={20} />
          </button>
          <button className="w-10">
            <Image src="/icons/comment.svg" alt="💬" width={20} height={20} />
          </button>
        </div>
        <button className="gap-1 px-3.5">
          <span className="text-[11px]">
            <ZoomPercent />
          </span>
          <Image src="/icons/arrow.svg" alt="🔽" width={8} height={7} />
        </button>
      </nav>
      <aside className="left-0">
        <div className="flex border-1 h-10 border-y-1 border-y border-goshawk-grey">
          <button className="px-2.5 ml-1.5">
            <Image src="/icons/find.svg" alt="🔍" width={16} height={16} />
          </button>
          <input placeholder="Find..." />
        </div>
        <ul className="px-4 text-sm">
          {list.map((item) => {
            const isActive = `${item.id}` === q;
            const style = isActive ? {} : { opacity: 0.5 };
            const href = isActive ? "/" : `?q=${item.id}`;
            return (
              <li key={item.id} className="mt-4" style={style}>
                <Link href={href} className="flex flex-col">
                  <span className="text-xs">{formatTime(item.created_at)}</span>
                  <span className="font-bold">{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>
      <main>
        <Bounding>
          <Wheelable>{q ? <Stage msgId={q} /> : null}</Wheelable>
        </Bounding>
      </main>
      <aside className="right-0">
        <div className="h-10 border-1 border-y border-goshawk-grey">
          <span className="mx-4 leading-10 font-bold">
            {q ? "Update" : "New Creation"}
          </span>
        </div>
        <h3 className="mx-4 mt-4 font-bold text-xs">Basic Setting</h3>
        <form key={q} className="px-4" action={basicSetting.bind(null, q)}>
          <label>
            <span>title</span>
            <textarea
              required
              name="title"
              className="peer/title"
              placeholder="input here..."
              defaultValue={target?.title}
            />
          </label>
          <label>
            <span>content</span>
            <textarea
              required
              name="content"
              className="peer/content"
              placeholder="input here..."
              defaultValue={target?.content}
            />
          </label>
          <label>
            <span>created by</span>
            <input
              name="created_by"
              placeholder="input here..."
              defaultValue={target?.created_by}
            />
          </label>
          <div className="py-4">
            <button className="bg-out-of-the-blue px-2 py-0.5 rounded-sm">
              <span className="text-sm">Save</span>
            </button>
          </div>
        </form>
        {q ? (
          <>
            <div className="w-full h-[1px] bg-goshawk-grey" />
            <h3 className="mx-4 mt-4 font-bold text-xs">Advanced Setting</h3>
            <form
              key={q}
              className="px-4"
              action={advancedSetting.bind(null, q)}
            >
              <label>
                <span>display start</span>
                <input required name="start_date" type="date" />
                <input required name="start_time" type="time" />
              </label>
              <label>
                <span>display end</span>
                <input name="end_date" type="date" />
                <input name="end_time" type="time" />
              </label>
              <div className="py-4">
                <button className="bg-out-of-the-blue px-2 py-0.5 rounded-sm">
                  <span className="text-sm">Save</span>
                </button>
              </div>
            </form>
          </>
        ) : null}
      </aside>
    </>
  );
}
