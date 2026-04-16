import { useEffect, useState } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import "./OrderHeader.css";

const API = "https://zyntaweb.com/demoalafiya/api/order_details.php";

const ITEM_API = "https://zyntaweb.com/demoalafiya/api/items.php";
const LOCATION_API = "https://zyntaweb.com/demoalafiya/api/locations.php";
const BRAND_API = "https://zyntaweb.com/demoalafiya/api/brands.php";
const STATUS_API = "https://zyntaweb.com/demoalafiya/api/status.php";
const ORDER_API = "https://zyntaweb.com/demoalafiya/api/order_header.php";

const OrderDetails = () => {

  const [data, setData] = useState([]);
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [locations, setLocations] = useState([]);
  const [brands, setBrands] = useState([]);
  const [status, setStatus] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: "",
    order_id: "",
    item_id: "",
    qty: "",
    batch: "",
    expiry: "",
    location_id: "",
    brand_id: "",
    remark: "",
    status_id: ""
  });

  // LOAD
  const loadData = async () => {
    const res = await fetch(API);
    const d = await res.json();
    setData(d);
  };

  const loadDropdowns = async () => {
    setItems(await (await fetch(ITEM_API)).json());
    setLocations(await (await fetch(LOCATION_API)).json());
    setBrands(await (await fetch(BRAND_API)).json());
    setStatus(await (await fetch(STATUS_API)).json());
  };

  const loadOrders = async () => {
    const res = await fetch(ORDER_API);
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    loadData();
    loadDropdowns();
    loadOrders();
  }, []);

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(API, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    loadData();
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      id: "",
      order_id: "",
      item_id: "",
      qty: "",
      batch: "",
      expiry: "",
      location_id: "",
      brand_id: "",
      remark: "",
      status_id: ""
    });
    setIsEdit(false);
  };

  const editItem = (d) => {
    setForm(d);
    setIsEdit(true);
    setShowModal(true);
  };

  const deleteItem = async (id) => {
    await fetch(`${API}?id=${id}`, { method: "DELETE" });
    loadData();
  };

  return (
    <div className="order-page">
      <TopNavbar />

      <button className="add-order-top" onClick={() => setShowModal(true)}>
        <FaPlus /> Add Order Details
      </button>

      <div className="order-list-card">
        <div className="card-header">
          <h3>📦 ORDER DETAILS</h3>
        </div>

        <table>
          <thead>
            <tr>
              <th>Order</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Batch</th>
              <th>Expiry</th>
              <th>Location</th>
              <th>Brand</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d) => (
              <tr key={d.id}>
                <td>{d.order_number}</td>
                <td>{d.item_name}</td>
                <td>{d.qty}</td>
                <td>{d.batch}</td>
                <td>{d.expiry}</td>
                <td>{d.location_name}</td>
                <td>{d.brand_name}</td>
                <td>{d.status_name}</td>

                <td>
                  <button onClick={() => editItem(d)}>
                    <FaEdit />
                  </button>
                  <button onClick={() => deleteItem(d.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="order-modal-overlay">
          <div className="order-modal-box">
            <h3>{isEdit ? "Update" : "Add"} Order Details</h3>

            <form onSubmit={handleSubmit} className="order-modal-body">

              {/* ✅ ORDER DROPDOWN */}
              <select onChange={e => setForm({...form, order_id:e.target.value})}>
                <option>Select Order</option>
                {orders.map(o => (
                  <option key={o.id} value={o.id}>{o.number}</option>
                ))}
              </select>

              {/* ✅ ITEM DROPDOWN */}
              <select onChange={e => setForm({...form, item_id:e.target.value})}>
                <option>Select Item</option>
                {items.map(i => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>

              <input placeholder="Qty" onChange={e => setForm({...form, qty:e.target.value})} />
              <input placeholder="Batch" onChange={e => setForm({...form, batch:e.target.value})} />
              <input type="date" onChange={e => setForm({...form, expiry:e.target.value})} />

              <select onChange={e => setForm({...form, location_id:e.target.value})}>
                <option>Select Location</option>
                {locations.map(l => (
                  <option key={l.id} value={l.id}>{l.name}</option>
                ))}
              </select>

              <select onChange={e => setForm({...form, brand_id:e.target.value})}>
                <option>Select Brand</option>
                {brands.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>

              <select onChange={e => setForm({...form, status_id:e.target.value})}>
                <option>Select Status</option>
                {status.map(s => (
                  <option key={s.id} value={s.id}>{s.status}</option>
                ))}
              </select>

              <input placeholder="Remark" onChange={e => setForm({...form, remark:e.target.value})} />

              <button className="save-btn">SAVE</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;