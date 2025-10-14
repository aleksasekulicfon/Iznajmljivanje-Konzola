import { Link } from "react-router-dom";

export default function Home(){
  return (
    <div className="container mt-4">
      <h3>Dobro došli</h3>
      <p>Izaberite akciju:</p>
      <div className="d-flex gap-2">
        <Link className="btn btn-primary" to="/app/catalog">Katalog</Link>
        <Link className="btn btn-outline-primary" to="/app/rentals">Moja iznajmljivanja</Link>
        <Link className="btn btn-outline-secondary" to="/app/wallet">Kredit</Link>
      </div>
    </div>
  );
}