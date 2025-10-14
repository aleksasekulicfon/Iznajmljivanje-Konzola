import { useEffect, useState } from "react";
import * as IznService from "../../services/IznajmljivanjeService";
import { useAuth } from "../../context/AuthContext";

export default function MyRentals(){
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(()=>{
    IznService.list({ klijentId: user?.id }).then(setItems);
  }, [user?.id]);

  return (
    <div className="container mt-4">
      <h4>Moja iznajmljivanja</h4>
      <table className="table table-striped">
        <thead><tr><th>ID</th><th>Početak</th><th>Status</th><th>Iznos</th></tr></thead>
        <tbody>
          {items.map(x=>(
            <tr key={x.id}><td>{x.id}</td><td>{x.pocetak}</td><td>{x.status}</td><td>{x.ukupanIznos}</td></tr>
          ))}
          {items.length===0 && <tr><td colSpan={4}>Nema podataka.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}