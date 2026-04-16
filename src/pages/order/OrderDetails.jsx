import { useEffect, useState } from "react";
import TopNavbar from "../dashboard/TopNavbar";
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";
import "./OrderDetails.css";

const API = "https://zyntaweb.com/demoalafiya/api/order_details.php";
const OrderDetails = () => {

  const [data,setData]=useState([]);
  const [showModal,setShowModal]=useState(false);
  const [isEdit,setIsEdit]=useState(false);

  const [form,setForm]=useState({
    id:"",
    order_id:"",
    item_id:"",
    qty:""
  });

  const load = async ()=>{
    const res = await fetch(API);
    const d = await res.json();
    setData(d);
  };

  useEffect(()=>{ load(); },[]);

  const submit = async(e)=>{
    e.preventDefault();

    await fetch(API,{
      method:isEdit?"PUT":"POST",
      headers:{ "Content-Type":"application/json"},
      body:JSON.stringify(form)
    });

    load();
    setShowModal(false);
    setIsEdit(false);
  };

  const edit=(d)=>{
    setForm(d);
    setShowModal(true);
    setIsEdit(true);
  };

  const del=async(id)=>{
    await fetch(`${API}?id=${id}`,{method:"DELETE"});
    load();
  };

  return (
    <div className="order-details-page">
      <TopNavbar />

      <button className="add-details-top" onClick={()=>setShowModal(true)}>
        <FaPlus/> Add Details
      </button>

      <div className="order-details-card">
        <h3>📋 ORDER DETAILS</h3>

        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map(d=>(
              <tr key={d.id}>
                <td>{d.item_id}</td>
                <td>{d.qty}</td>

                <td>
                  <button onClick={()=>edit(d)}><FaEdit/></button>
                  <button onClick={()=>del(d.id)}><FaTrash/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">

            <form onSubmit={submit}>
              <input placeholder="Order ID" onChange={e=>setForm({...form,order_id:e.target.value})}/>
              <input placeholder="Item ID" onChange={e=>setForm({...form,item_id:e.target.value})}/>
              <input placeholder="Qty" onChange={e=>setForm({...form,qty:e.target.value})}/>

              <button className="save-btn">
                {isEdit?"UPDATE":"SAVE"}
              </button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;