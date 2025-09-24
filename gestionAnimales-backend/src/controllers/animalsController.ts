import { supabase } from "../supabase-client.ts";

export const getAllAnimals = async (res) => {
    try {
        const { data, error } = await supabase
        .from("animals")
        .select("*");
        if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export const getAnimalById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
        .from("animals")
        .select("*")
        .eq("id", id)
        .single();
        if (error) return res.status(400).json({ error: error.message });
        if (!data) return res.status(404).json({ error: "Animal no encontrado" });
    
    res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export const uploadAnimal = async (req, res) => {
    try {
        const { name, species, race, age } = req.body;
        const user_id = req.user.id;
        const { data, error } = await supabase
        .from("animals")
        .insert([{ name, species, race, age, user_id }])
        .select()
        .single();
        if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: `${name} ahora tiene un lugar seguro en el sistema <3 | Animal registrado exitosamente.` });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export const updateAnimal = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, species, race, age } = req.body;
        const user_id = req.user.id;
        const { data, error } = await supabase
        .from("animals")
        .update([{ name, species, race, age, user_id }])
        .eq("id", id)
        .select();
        if (error) return res.status(400).json({ error: error.message });
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "Animal no encontrado" });
        }
    res.status(200).json({ message: `Los datos de ${name} han sido actualizados exitosamente` });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export const deleteAnimal = async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
        .from("animals")
        .delete()
        .eq("id", id)
        .select();
        if (error) return res.status(400).json({ error: error.message });
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "Animal no encontrado" });
        }
        res.status(200).json({
            message: `${data[0].name} se ha retirado del sistema:( | Animal eliminado exitosamente`,
          });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}