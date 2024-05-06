import React, { useContext, useEffect, useState } from "react";
import AddProductModal from "../../modals/AddProductModal";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import moment from "moment";

import {
  deleteProductAction,
  getProductsAction,
} from "../../../redux/actions/productAction";
import EditProductModal from "../../modals/EditProductModal";
import authContext from "../../../context/authContext/authContext";

const Admin = () => {
  const dispatch = useDispatch();
  const { getConfig } = useContext(authContext);

  const intialState = { products: [] };
  const [state, setCompleteState] = useState(intialState);
  const setState = (newState) =>
    setCompleteState((prevState) => ({ ...prevState, ...newState }));

  const getProducts = () => {
    const config = getConfig();
    dispatch(getProductsAction(config));
  };

  useEffect(() => {
    getProducts();
  }, []);

  const deleteProduct = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        confirmDeleteProduct(id);
      }
    });
  };

  const confirmDeleteProduct = async (id) => {
    const data = { id };
    const config = getConfig();
    dispatch(deleteProductAction(data, config, getProducts));
  };

  const { loading, products } = useSelector((state) => state.products);
  return (
    <div className="mt-5 pt-5">
      <div className="container">
        {loading ? (
          <div className="text-center mb-3">
            <div class="spinner-border text-primary" role="status" />
          </div>
        ) : null}
        <div class="card">
          <div class="card-header">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <strong>Products</strong>
              </div>
              <div>
                <button
                  className="btn btn-primary"
                  onClick={() => setState({ openAddProductModal: true })}
                >
                  Add Product
                </button>
              </div>
            </div>
          </div>

          <div class="card-body">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Image</th>
                  <th scope="col">Name</th>
                  <th scope="col">Note</th>
                  <th scope="col">Last update</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {(products || []).map((product, index) => {
                  const { _id, name, note, image, updatedAt } = product;
                  return (
                    <tr key={_id}>
                      <th>{index + 1}</th>
                      <td>
                        <img
                          src={image}
                          className="img-product"
                          alt="img-product"
                        />
                      </td>
                      <td>{name}</td>
                      <td>{note}</td>
                      <td>
                        {moment(updatedAt).format("dddd, MMMM Do YYYY, h:mm a")}
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary mx-1 my-1"
                          onClick={() =>
                            setState({
                              productId: _id,
                              openEditProductModal: true,
                            })
                          }
                        >
                          <i className="fa fa-pencil" />
                        </button>
                        <button
                          className="btn btn-danger mx-1 my-1"
                          onClick={() => deleteProduct(_id)}
                        >
                          <i className="fa fa-trash" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddProductModal
        key={() => new Date()}
        isOpen={state.openAddProductModal}
        toggle={() => setState({ openAddProductModal: false })}
        getProducts={getProducts}
      />

      <EditProductModal
        key={() => new Date()}
        isOpen={state.openEditProductModal}
        toggle={() => setState({ openEditProductModal: false })}
        getProducts={getProducts}
        productId={state.productId}
        products={products || []}
      />
    </div>
  );
};

export default Admin;
