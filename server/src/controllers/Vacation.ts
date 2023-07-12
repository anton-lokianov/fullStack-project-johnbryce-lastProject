import { Request, Response } from "express";
import { Vacation } from "../models/Vacation";
import {
  addVacation,
  deleteVacation,
  getAllVacations,
  getVacationByDestination,
  getVacationById,
  updateVacation,
} from "../logic/VacationLogic";
import fs from "fs";
import path from "path";

export const createVacation = async (req: Request, res: Response) => {
  try {
    const vacation = req.body;

    const image = req.file ? req.file.filename : "";

    const existingVacation = await getVacationByDestination(
      vacation.destination
    );

    if (existingVacation && existingVacation.length > 0) {
      return res
        .status(400)
        .json({ error: "Vacation for this destination already exists" });
    }

    const newVacation: Vacation = {
      ...vacation,
      image,
    };

    await addVacation(newVacation);
    res.status(201).json(newVacation);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export const getAllVacationsController = async (
  req: Request,
  res: Response
) => {
  try {
    const vacations = await getAllVacations();

    res.status(200).json(vacations);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export const deleteVacationController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const vacationToDelete = await getVacationById(Number(id));
    console.log(vacationToDelete);

    if (vacationToDelete && vacationToDelete.length > 0) {
      if (vacationToDelete[0].image) {
        const imagePath = path.join(
          __dirname,
          `../../public/assets/${vacationToDelete[0].image}`
        );

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log("Image deleted successfully");
        } else {
          console.log("Image does not exist");
        }
      }

      const success = await deleteVacation(Number(id));

      if (success) {
        res.status(200).json({ message: `Deleted vacation with id: ${id}` });
      } else {
        res.status(404).json({ message: `No vacation found with id: ${id}` });
      }
    } else {
      res.status(404).json({ message: `No vacation found with id: ${id}` });
    }
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export const updateVacationController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const existingVacation = await getVacationById(Number(id));

    if (existingVacation) {
      let image = existingVacation[0].image;

      if (req.file) {
        const oldImagePath = path.join(
          __dirname,
          `../../public/assets/${existingVacation[0].image}`
        );
        fs.unlinkSync(oldImagePath);

        image = req.file.filename;
      }

      const updatedVacation: Vacation = {
        ...updateData,
        image,
      };

      await updateVacation(Number(id), updatedVacation);

      res.status(200).json({ message: "Vacation updated successfully" });
    } else {
      res.status(400).json({ error: "No vacation found for the provided id" });
    }
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
