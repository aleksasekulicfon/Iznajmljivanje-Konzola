// OPTIONAL: ako već nemaš ovako
import http from "./http";

// Pokuša radnika, pa klijenta; oba endpointa očekuju query parametre
export async function login({ korisnickoIme, lozinka }) {
  try {
    const res = await http.post("/radnici/login", null, {
      params: { korisnickoIme, lozinka },
    });
    return { ...res.data, role: "RADNIK" };
  } catch (e1) {
    try {
      const res = await http.post("/klijenti/login", null, {
        params: { korisnickoIme, lozinka },
      });
      return { ...res.data, role: "KLIJENT" };
    } catch (e2) {
      const msg =
        e2.response?.data?.message ||
        e1.response?.data?.message ||
        "Neuspešna prijava";
      throw new Error(msg);
    }
  }
}