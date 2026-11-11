import { NextResponse } from "next/server";
import { parseFilters, queryCharacters, PAGE_SIZE } from "@/lib/characters";

export async function GET(req: Request) {
  const sp = Object.fromEntries(new URL(req.url).searchParams);
  const size = /^\d+$/.test(sp.pageSize ?? "") ? Number(sp.pageSize) : PAGE_SIZE;
  return NextResponse.json(await queryCharacters(parseFilters(sp), size));
}
