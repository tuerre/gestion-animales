import { supabase } from "../supabase-client.ts";

export const getUserByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const { data, error } = await supabase
        .from("users")
        .select("id, username, name, email, avatar_url")
        .eq("username", username)
        .single();
        if (!data) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}