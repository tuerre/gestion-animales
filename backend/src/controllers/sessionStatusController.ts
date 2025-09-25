import { Router } from "express";
import { supabase } from "../supabase-client.ts";

export const sessionStatusController = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("id, username, name, email, avatar_url")
      .eq("id", req.user.id)
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.json({
      isLoggedIn: true,
      user,
    });
  } catch (err) {
    res.status(500).json({ error: "Error verificando sesión", message: err.message });
  }
};