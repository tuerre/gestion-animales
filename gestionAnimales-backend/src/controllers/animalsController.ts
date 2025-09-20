import { supabase } from "../supabase-client.ts";

export const getAllAnimals = async (req, res) => {
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

export const uploadAnimal = async (req: any, res: any) => {
    try {
        const { name, species, race, age } = req.body;
        const { data, error } = await supabase
        .from("animals")
        .insert([{ name: name, species: species, race: race, age: age }])
        .select()
        .single();
        if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export const updateAnimal = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, species, race, age } = req.body;
        const { data, error } = await supabase
        .from("animals")
        .update([{ name: name, species: species, race: race, age: age }])
        .eq("id", id)
        .select()
        .single();
        if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
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
        .select()
        .single();
        if (error) return res.status(400).json({ error: error.message });
    res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}