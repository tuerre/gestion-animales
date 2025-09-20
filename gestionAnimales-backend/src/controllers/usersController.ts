import { supabase } from "../supabase-client.ts";

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .single();
        if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}