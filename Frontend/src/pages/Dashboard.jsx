// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";

import axios from "axios";
import { getDashboardAPI } from "../api/auth";


// ================= INDIA BOUNDS =================
const INDIA_BOUNDS = [
  [6.5, 68],   // south-west
  [37.5, 97]   // north-east
];


// ================= ROUTE COMPONENT =================
function Routing({ start, end }) {
  const map = useMap();

  useEffect(() => {
    if (!start || !end) return;

    const routing = L.Routing.control({
      waypoints: [L.latLng(start), L.latLng(end)],
      lineOptions: { styles: [{ weight: 5 }] },
      show: false,
      addWaypoints: false
    }).addTo(map);

    return () => map.removeControl(routing);
  }, [start, end, map]);

  return null;
}


// ================= MAIN =================
export default function Dashboard() {
  const navigate = useNavigate();

  const [userEmail, setUserEmail] = useState("");
  const [potholes, setPotholes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [mapCenter, setMapCenter] = useState([22.9734, 78.6569]); // India center

  const [search, setSearch] = useState("");
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  // ================= AUTH =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    (async () => {
      try {
        const res = await getDashboardAPI(token);
        setUserEmail(res.data.user?.email || "");
      } catch {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ================= SEARCH LOCATION =================
  const handleSearch = async () => {
    if (!search) return;

    const res = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${search}&format=json`
    );

    if (res.data.length > 0) {
      const lat = parseFloat(res.data[0].lat);
      const lon = parseFloat(res.data[0].lon);
      setMapCenter([lat, lon]);
    }
  };

  // ================= ROUTE SEARCH =================
  const handleRoute = async () => {
    if (!start || !end) return;

    const s = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${start}&format=json`
    );
    const e = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${end}&format=json`
    );

    if (s.data[0] && e.data[0]) {
      setStart([+s.data[0].lat, +s.data[0].lon]);
      setEnd([+e.data[0].lat, +e.data[0].lon]);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-200">

      {/* HEADER */}
      <div className="bg-white shadow p-4 flex justify-between">
        <h1 className="text-xl font-bold">India Road Monitoring Dashboard</h1>
        <div className="flex gap-4 items-center">
          <span className="text-sm">{userEmail}</span>
          <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
            Logout
          </button>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="p-4 bg-white flex flex-wrap gap-3">

        {/* Search */}
        <input
          placeholder="Search city / road"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={handleSearch} className="bg-blue-600 text-white px-3 rounded">
          Go
        </button>

        {/* Route */}
        <input
          placeholder="From"
          value={start || ""}
          onChange={(e) => setStart(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          placeholder="To"
          value={end || ""}
          onChange={(e) => setEnd(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={handleRoute} className="bg-green-600 text-white px-3 rounded">
          Show Route
        </button>
      </div>

      {/* MAP */}
      <div className="h-[80vh]">
        {!loading && (
          <MapContainer
            center={mapCenter}
            zoom={6}
            maxBounds={INDIA_BOUNDS}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* route */}
            {start && end && <Routing start={start} end={end} />}

            {/* potholes */}
            {potholes.map((p) => (
              <CircleMarker key={p.id} center={[p.lat, p.lng]} radius={8}>
                <Popup>{p.desc}</Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        )}
      </div>
    </div>
  );
}