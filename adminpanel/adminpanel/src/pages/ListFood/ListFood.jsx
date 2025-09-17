import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./ListFood.css";
import { deleteFood, getFoodList } from "../../services/foodService";

const ListFood = () => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const fetchList = async () => {
    try {
      const data = await getFoodList();
      setList(data);
    } catch (error) {
      toast.error("Error while reading the foods.");
    }
  };

  const removeFood = async (foodId) => {
    try {
      const success = await deleteFood(foodId);
      if (success) {
        toast.success("Food removed.");
        await fetchList();
      } else {
        toast.error("Error occred while removing the food.");
      }
    } catch (error) {
      toast.error("Error occred while removing the food.");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);
  return (
    <div className="py-5 row justify-content-center">
      <div className="col-11 card">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => {
              return (
                <tr key={index}>
                  <td>
                    <img src={`http://localhost:8080${item.imageUrl}`} alt="" height={48} width={48} />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>&#8377;{item.price}.00</td>
                  <td>
                    <i
                      className="bi bi-pencil-square fs-4 text-primary me-3"
                      onClick={() => navigate(`/update/${item.id}`)}
                      style={{cursor: 'pointer'}}
                    ></i>
                    <i
                      className="bi bi-trash-fill fs-4 text-danger"
                      onClick={() => removeFood(item.id)}
                      style={{cursor: 'pointer'}}
                    ></i>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListFood;
