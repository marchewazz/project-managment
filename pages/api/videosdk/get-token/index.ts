import type { NextApiRequest, NextApiResponse } from 'next'
import * as jwt from "jsonwebtoken";

type Message = {
    token: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Message>) {
  const API_KEY = process.env.VIDEOSDK_API_KEY;
  const SECRET_KEY: any = process.env.VIDEOSDK_SECRET_KEY;

  const options: any = { expiresIn: "10m", algorithm: "HS256" };

  const payload = {
    apikey: API_KEY,
    permissions: ["allow_join", "allow_mod"], // also accepts "ask_join"
  };

  const token = jwt.sign(payload, SECRET_KEY, options);
  res.json({ token });
    
}
