"use server";

import { z } from "zod";
import { invoker } from "@/invoker";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const MessageSchema = z.object({
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(1000),
});

const DisplayTimeSchema = z.object({
  start_date: z.string().min(1).max(100),
  start_time: z.string().min(1).max(100),
  end_date: z.string().min(1).max(1000),
  end_time: z.string().min(1).max(1000),
});

const app = invoker();

export async function basicSetting(id: string, formData: FormData) {
  const { success, data } = MessageSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!success) return;

  const { title, content } = data;

  let res;
  if (!id) res = await app.index.$post({ json: { title, content } });
  else await app[":id"].$patch({ param: { id }, json: { title, content } });

  if (res) redirect(`/?q=${(await res.json()).id}`);

  revalidatePath("/");
}

export async function advancedSetting(id: string, formData: FormData) {
  const { success, data } = DisplayTimeSchema.safeParse({
    start_date: formData.get("start_date"),
    start_time: formData.get("start_time"),
    end_date: formData.get("end_date"),
    end_time: formData.get("end_time"),
  });

  if (!success) return;

  const { start_date, start_time, end_date, end_time } = data;

  const display_start = new Date(`${start_date}T${start_time}`).toISOString();
  const display_end = new Date(`${end_date}T${end_time}`).toISOString();

  await app[":id"].display.$patch({
    param: { id },
    json: { display_start, display_end },
  });

  revalidatePath("/");

}
