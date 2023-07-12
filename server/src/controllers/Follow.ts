import { Request, Response } from "express";
import { Follower } from "../models/Follow";
import {
  addFollower,
  removeFollower,
  removeAllFollowers,
  getAllFollowers,
} from "../logic/FollowLogic";

export const addFollowerController = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  const vacationId = parseInt(req.params.vacationId);

  try {
    await addFollower(userId, vacationId);
    res.status(200).json({ message: "Follower added successfully." });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const removeFollowerController = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  const vacationId = parseInt(req.params.vacationId);

  try {
    await removeFollower(userId, vacationId);
    res.status(200).json({ message: "Follower removed successfully." });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const removeAllFollowersController = async (
  req: Request,
  res: Response
) => {
  const { vacationId } = req.params;

  try {
    await removeAllFollowers(Number(vacationId));
    res.status(200).json({ message: "All followers removed successfully." });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllFollowersController = async (
  req: Request,
  res: Response
) => {
  try {
    const followers = await getAllFollowers();
    res.status(200).json(followers);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
