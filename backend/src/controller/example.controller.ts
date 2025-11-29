import { supabase } from "../services/supabase.service";

export const saveData = async (req, res) => {
  const body = req.body;

  const { data, error } = await supabase
    .from("tu_tabla")
    .insert([body]);

  if (error) {
    console.error(error);
    return res.status(400).json({ error });
  }

  return res.json({ success: true, data });
};

export const getData = async (req, res) => {
  const { data, error } = await supabase.from("tu_tabla").select("*");

  if (error) return res.status(400).json({ error });

  return res.json(data);
};
