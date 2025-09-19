import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { assets } from '../../assets/assets';

const Header = () => {
  return (
    <>
      {/* Carousel */}
      <div id="foodCarousel" className="carousel slide mb-4" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#foodCarousel" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#foodCarousel" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#foodCarousel" data-bs-slide-to="2"></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="carousel-slide slide-1">
              <div className="carousel-content">
                <h1 className="display-4 fw-bold text-white">Delicious Food Delivered</h1>
                <p className="fs-5 text-white mb-4">Order from your favorite restaurants</p>
                <Link to="/explore" className="btn btn-warning btn-lg">Order Now</Link>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="carousel-slide slide-2" style={{backgroundImage: `url(${assets.momos})`}}>
              <div className="carousel-content">
                <h1 className="display-4 fw-bold text-white">Fast Delivery</h1>
                <p className="fs-5 text-white mb-4">Get your food delivered in 30 minutes</p>
                <Link to="/explore" className="btn btn-warning btn-lg">Explore Menu</Link>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <div className="carousel-slide slide-3" style={{backgroundImage: `url(${assets.tandori})`}}>
              <div className="carousel-content">
                <h1 className="display-4 fw-bold text-white">Fresh & Quality</h1>
                <p className="fs-5 text-white mb-4">Made with the finest ingredients</p>
                <Link to="/explore" className="btn btn-warning btn-lg">Browse Food</Link>
              </div>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#foodCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#foodCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>
    </>
  );
};

export default Header;
