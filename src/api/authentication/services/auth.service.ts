import { Request, Response } from "express";

const signIn = (req: Request, res: Response) => {
  res.json({ msg: "signin success" });
};

export { signIn };
