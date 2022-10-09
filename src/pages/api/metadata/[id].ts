// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import path from "path";
import { asyncCatch } from "../../../utils/asyncCatch";
type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id } = req.query;
  const dir = path.join(process.cwd(), "public", "metadata", `${id}.json`);
  const [err, file] = await asyncCatch(fs.readFile(dir));
  //@ts-ignore
  if (err) return res.status(500).json({ message: "metadata not found" });
  res.setHeader("content-type", "application/json");
  res.setHeader(
    "access-control-allow-headers",
    "Content-Type, Range, User-Agent, X-Requested-With"
  );
  res.setHeader("access-control-allow-methods", "GET, HEAD");
  //@ts-ignore
  res.status(200).send(file);
}
