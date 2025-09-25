import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { supabase } from "../supabase-client.ts";

export const registerUser = async (req: any, res: any) => {
  const { username, name, email, password } = req.body;
  const DEFAULT_AVATAR = "https://gysasjmuglpuowjgzqyw.supabase.co/storage/v1/object/sign/avatars/user.webp?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9kMjUwMTUwYi0zMGEzLTQzMzAtOTg4ZC0yMjRmMzkyMjEzMTUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhdmF0YXJzL3VzZXIud2VicCIsImlhdCI6MTc1ODczNDgwMiwiZXhwIjoyMDc0MDk0ODAyfQ.RgkmJxRijzwY-5TwT3gvl0x5DrHd5T2I-CYGvJEJ7lE";

  if (!username || !name || !email || !password) {
    return res.status(400).json({ msg: "Todos los campos son obligatorios" });
  }

  try {
    // verify if the user exits
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("username", username)
      .single();

    if (existingUser) return res.status(400).json({ Error: "Este usuario ya está registrado" });

    const password_hash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([{ username: username, name: name, email: email, password_hash: password_hash, avatar_url: DEFAULT_AVATAR }])
      .select()

    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(500).json({ msg: "No se pudo registrar el usuario" });
    }

    res.status(201).json({
      msg: "Registro exitoso",
      user: data[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ Error: "Todos los campos son obligatorios" });
    }
  
    try {
      // verify if the user exits
      const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();          
      if (!user) return res.status(404).json({ Error: "Usuario no encontrado" });
  
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
  
      if (!passwordMatch) return res.status(401).json({ Error: "Contraseña incorrecta" });
  
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      res
        .cookie('token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60 * 1000,
          sameSite: 'lax'
        })
        .status(201).json({ msg: "Inicio de Sesión exitoso", user: username, token });

    } catch (err) {
      console.error(err);
      res.status(500).json({ Error: "Error en el servidor" });
    }
  }; 

export const logoutUser = async (req, res) => {

    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No hay sesión activa" });

    res
    .cookie('token', '', {
        maxAge: 0,
        httpOnly: true,
    })
    .status(200).json({ msg: "Se cerró la session exitosamente" });
};
