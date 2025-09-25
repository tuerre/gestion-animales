import { supabase } from "../supabase-client.ts";

export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id, username, name, email, avatar_url")
      .eq("username", username)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const { data: animals, error: animalsError } = await supabase
      .from("animals")
      .select("*")
      .eq("user_id", user.id);

    if (animalsError) {
      return res.status(500).json({ error: "Error al obtener animales" });
    }

    res.status(200).json({
      user,
      animals: animals || [],
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
