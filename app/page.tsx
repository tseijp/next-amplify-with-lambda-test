import { invoker } from "@/invoker";

const app = invoker();

const padding = (value: string | number = 0, length = 2, target = "0") => {
  return (target.repeat(length) + value).slice(-length);
};

function formatTime(time: string) {
  if (!time) return "";
  const jst = new Date(time);
  const YYYY = padding(jst.getFullYear(), 4);
  const MM = padding(jst.getMonth() + 1, 2);
  const dd = padding(jst.getDate(), 2);
  const hh = padding(jst.getHours(), 2);
  const mm = padding(jst.getMinutes(), 2);
  return `${YYYY}年${MM}/${dd} ${hh}:${mm}`;
}

export default async function Home() {
  const res = await app.index.$get();
  const data = await res.json();

  return (
    <table className="w-full border-separate border-spacing-y-4 text-sm text-justify">
      <thead>
        <tr>
          <th>title</th>
          <th>content</th>
          <th>display_start</th>
          <th>display_end</th>
          <th>created_at</th>
          <th>updated_at</th>
          <th>deleted_at</th>
          <th>target_stage</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.title}</td>
            <td>{item.content}</td>
            <td>{formatTime(item.display_start)}</td>
            <td>{formatTime(item.display_end)}</td>
            <td>{formatTime(item.created_at)}</td>
            <td>{formatTime(item.updated_at)}</td>
            <td>{formatTime(item.deleted_at)}</td>
            <td>{item.target_stage}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
