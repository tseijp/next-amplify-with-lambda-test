"use server";

import { z } from "zod";
import { invoker } from "@/invoker";
import { revalidatePath } from "next/cache";

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
  const res = MessageSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!res.success) return;

  const { title, content } = res.data;

  if (!id) await app.index.$post({ json: { title, content } });
  else await app[":id"].$patch({ param: { id }, json: { title, content } });

  revalidatePath("/");
}

export async function advancedSetting(id: string, formData: FormData) {
  const res = DisplayTimeSchema.safeParse({
    start_date: formData.get("start_date"),
    start_time: formData.get("start_time"),
    end_date: formData.get("end_date"),
    end_time: formData.get("end_time"),
  });

  if (!res.success) return;

  const { start_date, start_time, end_date, end_time } = res.data;

  const display_start = new Date(`${start_date}T${start_time}`).toISOString();
  const display_end = new Date(`${end_date}T${end_time}`).toISOString();

  await app[":id"].display.$patch({
    param: { id },
    json: { display_start, display_end },
  });

  revalidatePath("/");
}
