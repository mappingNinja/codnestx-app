import axios from "axios";
import { toast } from "react-toastify";
import constants from "../constants/constant";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const {
  ADD_PRODUCT,
  ADD_PRODUCT_SUCCESS,
  ADD_PRODUCT_ERROR,
  DELETE_PRODUCT,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_ERROR,
  EDIT_PRODUCT,
  EDIT_PRODUCT_SUCCESS,
  EDIT_PRODUCT_ERROR,
  GET_PRODUCTS,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_ERROR
} = constants;

const GET_PRODUCTS_API_URL = BASE_URL + "/getProducts";
const EDIT_PRODUCT_API_URL = BASE_URL + "/editProduct";
const DELETE_PRODUCT_API_URL = BASE_URL + "/deleteProduct";
const ADD_PRODUCT_API_URL = BASE_URL + "/addProduct";

export const addProductAction = (data, config, callback1, callback2) => async (dispatch) => {
  dispatch({ type: ADD_PRODUCT });
  await axios.post(ADD_PRODUCT_API_URL, data, config)
    .then((res) => {
      dispatch({ type: ADD_PRODUCT_SUCCESS, message: res.data.message })
      callback1();
      callback2();
    })
    .catch((error) => dispatch({ type: ADD_PRODUCT_ERROR, error }))
};


export const getProductsAction = (config) => async (dispatch) => {
  dispatch({ type: GET_PRODUCTS });
  await axios.get(GET_PRODUCTS_API_URL, config)
    .then((res) => dispatch({ type: GET_PRODUCTS_SUCCESS, products: res?.data?.products }))
    .catch((error) => dispatch({ type: GET_PRODUCTS_ERROR, error }))
};

export const editProductAction = (update, config, callback1, callback2) => async (dispatch) => {
  dispatch({ type: EDIT_PRODUCT });
  await axios.post(EDIT_PRODUCT_API_URL, { update }, config)
    .then((res) => {
      dispatch({ type: EDIT_PRODUCT_SUCCESS, message: res.data.message });
      callback1();
      callback2();
    })
    .catch((error) => dispatch({ type: EDIT_PRODUCT_ERROR, error }))
};

export const deleteProductAction = (data, config, callback) => async (dispatch) => {
  dispatch({ type: DELETE_PRODUCT })
  await axios.post(DELETE_PRODUCT_API_URL, data, config)
    .then((res) => {
      dispatch({ type: DELETE_PRODUCT_SUCCESS, message: res?.data?.message })
      callback();
    })
    .catch((error) => dispatch({ type: DELETE_PRODUCT_ERROR, error }))
}
