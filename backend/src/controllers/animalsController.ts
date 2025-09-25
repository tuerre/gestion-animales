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
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

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
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        const { name, species, race, age } = req.body;
        const user_id = req.user.id;

        const { data: animalData, error: animalError } = await supabase
            .from("animals")
            .select("user_id")
            .eq("id", id)
            .maybeSingle();
        if (animalError) return res.status(400).json({ error: animalError.message });
        if (!animalData) return res.status(404).json({ error: "Animal no encontrado" });

        if (animalData.user_id !== user_id) {
            return res.status(403).json({ error: "No tienes permiso para actualizar este animal" });
        }

        const { data, error } = await supabase
            .from("animals")
            .update({ name, species, race, age })
            .eq("id", id)
            .select();
        if (error) return res.status(400).json({ error: error.message });
        if (!data || data.length === 0) return res.status(404).json({ error: "Animal no encontrado" });

        res.status(200).json({ message: `Los datos de ${name} han sido actualizados exitosamente` });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
}

export const deleteAnimal = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        const { data: animalData, error: animalError } = await supabase
            .from("animals")
            .select("id, name, user_id")
            .eq("id", id)
            .single();
        if (animalError && animalError.code === "PGRST116") return res.status(404).json({ error: "Animal no encontrado" });
        if (animalError) return res.status(400).json({ error: animalError.message });
        if (!animalData) return res.status(404).json({ error: "Animal no encontrado" });

        if (animalData.user_id !== req.user.id) {
            return res.status(403).json({ error: "No tienes permiso para eliminar este animal" });
        }

        const { error: deleteError } = await supabase
            .from("animals")
            .delete()
            .eq("id", id);
        if (deleteError) return res.status(400).json({ error: deleteError.message });

        res.status(200).json({
            message: `${animalData.name} se ha retirado del sistema :( | Animal eliminado exitosamente`
        });
    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};
