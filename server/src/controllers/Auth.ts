import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { getUserByEmail, userLogin, userRegister } from "../logic/UserLogic";

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const registeredUser: User = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
    };

    await userRegister(registeredUser);

    res.status(201).json({ message: "User created successfully" });
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user: User = await userLogin(email);
    if (!user || !user.password) {
      return res.status(401).send({ message: "Email or password incorrect" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).send({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
    delete user.password;

    res.status(200).send({ user, token });
  } catch (err: any) {
    res.status(500).send(err.message);
  }
};
