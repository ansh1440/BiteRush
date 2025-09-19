import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { getImageUrl } from "../../util/imageUtils";
import "./FoodItem.css";

const FoodItem = ({ name, description, id, imageUrl, price }) => {
  const { increaseQty, decreaseQty, quantities } = useContext(StoreContext);

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex justify-content-center">
      <div className="card food-card" style={{ maxWidth: "320px" }}>
        <Link to={`/food/${id}`}>
          <img
            src={getImageUrl(imageUrl)}
            className="card-img-top"
            alt="Product Image"
            height={300}
            width={60}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x300?text=Food+Image';
            }}
          />
        </Link>
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          <p className="card-text">{description}</p>
          <div className="d-flex justify-content-between align-items-center">
            <span className="h5 mb-0 price">&#8377;{price}</span>
            <div className="rating">
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-fill text-warning"></i>
              <i className="bi bi-star-half text-warning"></i>
              <small className="text-muted">(4.5)</small>
            </div>
          </div>
        </div>
        <div className="card-footer d-flex justify-content-between bg-light">
          <Link className="btn btn-success btn-sm" to={`/food/${id}`}>
            View Food
          </Link>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => increaseQty(id)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
