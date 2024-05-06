import errorHandle from "../../utils/errorHandle";
import successHandle from "../../utils/successHandle";
import constants from "../constants/constant";

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

const INITIAL_STATE = { loading: false }
export const productReducer = (state = INITIAL_STATE, action) => {

  const { type, products, message, error } = action;
  switch (type) {
    case GET_PRODUCTS:
    case ADD_PRODUCT:
    case DELETE_PRODUCT:
    case EDIT_PRODUCT:
      return { loading: true, error: '', message: '' }

    case GET_PRODUCTS_SUCCESS:
      return { loading: false, products }

    case ADD_PRODUCT_SUCCESS:
    case EDIT_PRODUCT_SUCCESS:
    case DELETE_PRODUCT_SUCCESS:
      return { loading: false, message: successHandle(message) }

    case GET_PRODUCTS_ERROR:
    case ADD_PRODUCT_ERROR:
    case EDIT_PRODUCT_ERROR:
    case DELETE_PRODUCT_ERROR:
      return { loading: false, error: errorHandle(error) }

    default:
      return state
  }
};
