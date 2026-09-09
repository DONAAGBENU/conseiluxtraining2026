// app/centre-de-langues/admin/programmes/page.tsx
import { supabase } from "@/lib/supabaseClient";
import ProgrammesManager from "./ProgrammesManager";

export default async function AdminProgrammesPage() {
  let programmes = [];
  
  if (supabase) {
    try {
      const { data } = await supabase
        .from("programmes")
        .select("*")
        .order("ordre");
      programmes = data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des programmes:', error);
    }
  }
  
  return <ProgrammesManager initial={programmes} />;
}