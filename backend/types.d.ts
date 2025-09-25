import multer from "multer";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string;
      file?: multer.File;
    }
  }
}
