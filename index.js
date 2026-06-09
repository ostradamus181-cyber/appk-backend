import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// CONEXIÓN SUPABASE
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// TEST
app.get("/", (req, res) => {
  res.json({ message: "APPK Backend conectado a Supabase 🚀" });
});

// REGISTER
app.post("/register", async (req, res) => {
  const { nombres, dni, celular, email, password } = req.body;

  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        nombres,
        dni,
        celular,
        email,
        password,
        estado: "PENDIENTE",
      },
    ])
    .select();

  if (error) return res.status(400).json({ error: error.message });

  res.json({
    status: "ok",
    message: "Usuario registrado en espera de aprobación",
    user: data,
  });
});

// LOGIN
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .single();

  if (error || !data) {
    return res.status(401).json({ status: "error", message: "Credenciales inválidas" });
  }

  if (data.estado !== "APROBADO") {
    return res.status(403).json({ status: "blocked", message: "Usuario no aprobado" });
  }

  res.json({
    status: "ok",
    message: "Login exitoso",
    user: data,
  });
});

// ADMIN APPROVE
app.post("/admin/approve", async (req, res) => {
  const { email } = req.body;

  const expires = new Date();
  expires.setDate(expires.getDate() + 360);

  const { data, error } = await supabase
    .from("users")
    .update({
      estado: "APROBADO",
      fecha_aprobacion: new Date(),
      fecha_vencimiento: expires,
      dias_licencia: 360,
    })
    .eq("email", email)
    .select();

  if (error) return res.status(400).json({ error: error.message });

  res.json({
    status: "approved",
    user: data,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`APPK backend running on port ${PORT}`);
});