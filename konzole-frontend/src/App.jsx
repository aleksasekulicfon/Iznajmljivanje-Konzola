import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import Login from "./components/auth/Login";
import RequireAuth from "./routes/RequireAuth";

// Admin
import Dashboard from "./components/admin/Dashboard";
import ListRadnici from "./components/admin/radnici/ListRadnici";
import RadnikForm from "./components/admin/radnici/RadnikForm";
import ListKlijenti from "./components/admin/klijenti/ListKlijenti";
import KlijentForm from "./components/admin/klijenti/KlijentForm";
import ListKonzole from "./components/admin/oprema/konzole/ListKonzole";
import KonzolaForm from "./components/admin/oprema/konzole/KonzolaForm";
import ListDodatnaOprema from "./components/admin/oprema/dodatna/ListDodatnaOprema";
import DodatnaOpremaForm from "./components/admin/oprema/dodatna/DodatnaOpremaForm";
import ListIznajmljivanja from "./components/admin/iznajmljivanja/ListIznajmljivanja";
import IznajmljivanjeForm from "./components/admin/iznajmljivanja/IznajmljivanjeForm";
import IznajmljivanjeDetalj from "./components/admin/iznajmljivanja/IznajmljivanjeDetalj";

// Client
import Home from "./components/client/Home";
import Catalog from "./components/client/Catalog";
import RentalNew from "./components/client/RentalNew";
import WalletTopUp from "./components/client/WalletTopUp";
import MyRentals from "./components/client/MyRentals";

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<div className="container mt-4">Nemate dozvolu.</div>} />

        {/* ADMIN */}
        <Route element={<RequireAuth allow={['RADNIK']} />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/radnici" element={<ListRadnici />} />
          <Route path="/admin/radnici/:id" element={<RadnikForm />} />
          <Route path="/admin/klijenti" element={<ListKlijenti />} />
          <Route path="/admin/klijenti/:id" element={<KlijentForm />} />
          <Route path="/admin/oprema/konzole" element={<ListKonzole />} />
          <Route path="/admin/oprema/konzole/:id" element={<KonzolaForm />} />
          <Route path="/admin/oprema/dodatna" element={<ListDodatnaOprema />} />
          <Route path="/admin/oprema/dodatna/:id" element={<DodatnaOpremaForm />} />
          <Route path="/admin/iznajmljivanja" element={<ListIznajmljivanja />} />
          <Route path="/admin/iznajmljivanja/new" element={<IznajmljivanjeForm />} />
          <Route path="/admin/iznajmljivanja/:id" element={<IznajmljivanjeDetalj />} />
        </Route>

        {/* CLIENT */}
        <Route element={<RequireAuth allow={['KLIJENT']} />}>
          <Route path="/app" element={<Home />} />
          <Route path="/app/catalog" element={<Catalog />} />
          <Route path="/app/rentals" element={<MyRentals />} />
          <Route path="/app/rentals/new" element={<RentalNew />} />
          <Route path="/app/wallet" element={<WalletTopUp />} />
        </Route>

        <Route path="*" element={<div className="container mt-4">404</div>} />
      </Routes>
      </main>
      <Footer />
    </div>
  );
}