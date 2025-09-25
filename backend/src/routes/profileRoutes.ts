import sharp from "sharp";
import multer from "multer";
import { supabase } from "../supabase-client.ts";
import express, { Request, Response } from "express";
import upload from "../middlewares/uploadMiddleware.ts";
import { verifyToken } from "../middlewares/authMiddleware.ts";

const router = express.Router();

router.post("/upload-avatar", verifyToken, upload.single("avatar"), async (req: Request & { file?: multer.File }, res: Response) => {
  try {
    const userId = req.user.id;
    const file = req.file;

    if (!userId) return res.status(401).json({ error: "Debes estar autenticado para actualizar tu foto de perfil" });
    if (!file) return res.status(400).json({ error: "No se subió ningún archivo" });

    const resizedImage = await sharp(file.buffer)
      .resize(256, 256, { fit: "cover" })
      .toFormat("webp")
      .toBuffer();

    const fileName = `${userId}_${Date.now()}.webp`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, resizedImage, {
        contentType: "image/webp",
        upsert: true,
      });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl.publicUrl })
      .eq("id", userId);

    res.json({ url: publicUrl.publicUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
