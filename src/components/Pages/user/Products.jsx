import React, { useContext, useEffect } from "react";
import { getProductsAction } from "../../../redux/actions/productAction";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import authContext from "../../../context/authContext/authContext";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { getConfig } = useContext(authContext);

  const getProducts = () => {
    const config = getConfig();
    dispatch(getProductsAction(config));
  };

  useEffect(() => {
    getProducts();
  }, []);

  const { loading, products } = useSelector((state) => state.products);

  return (
    <div className="pt-5 mt-5">
      <div className="container">
        {loading ? (
          <div className="text-center mb-3">
            <div class="spinner-border text-primary" role="status" />
          </div>
        ) : null}
        {products?.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center vh-100">
            <button className="btn btn-secondary" disabled>
              No Product to Display
            </button>
          </div>
        ) : (
          <div className="row">
            {(products || []).map((product) => {
              const { _id, name, note, image } = product;
              return (
                <div key={_id} className="col-md-3 my-2">
                  <div class="card">
                    <div className="text-center mt-2">
                      <img
                        src={image}
                        class="card-img-top img-product-card"
                        alt="..."
                      />
                    </div>
                    <div class="card-body">
                      <h5 class="card-title">{name}</h5>
                      <p class="card-text">{note}</p>
                      <div className="text-center">
                        <button
                          className="btn btn-primary"
                          onClick={() => navigate(`/product/${_id}`)}
                        >
                          View Product
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
