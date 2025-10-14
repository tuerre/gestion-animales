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

    // procesar los timestamps
    const formattedAnimals = (animals || []).map(animal => {
      const createdAt = new Date(animal.created_at);
      const now = new Date();
      const diffMs = now.getTime() - createdAt.getTime();;
      const diffHours = diffMs / (1000 * 60 * 60);

      let timeAgo;
      if (diffHours < 24) {
        const hours = Math.floor(diffHours);
        timeAgo = hours <= 1 ? "1 hour ago" : `${hours} hours ago`;
      } else {
        const days = Math.floor(diffHours / 24);
        timeAgo = days <= 1 ? "1 day ago" : `${days} days ago`;
      }

      return {
        ...animal,
        created_at: timeAgo,
      };
    });

    res.status(200).json({
      user,
      animals: formattedAnimals,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
