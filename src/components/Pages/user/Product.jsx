import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import errorHandle from '../../../utils/errorHandle';
import authContext from '../../../context/authContext/authContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const GET_PRODUCT_API_URL = BASE_URL + "/getProduct";
const Product = () => {
  const { id } = useParams();
  const { getConfig } = useContext(authContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const intialState = { product: {} }
  const [state, setCompleteState] = useState(intialState)
  const setState = (newState) => setCompleteState((prevState) => ({ ...prevState, ...newState }));

  const getProduct = async () => {
    setState({ loading: true })
    const config = getConfig();
    const data = { id }
    await axios.post(GET_PRODUCT_API_URL, data, config)
      .then((res) => setState({ lodaing: false, product: res.data.product }))
      .catch((error) => {
        setState({ loading: false });
        errorHandle(error)
        navigate('/')
      })
  }


  useEffect(() => {
    getProduct()
  }, [])



  return (
    <div className='mt-5 pt-5'>
      <div className='container'>
        <div className='text-center'>
          <h3>{state?.product?.name}</h3>
        </div>

        <div className='row mt-4'>
          <div className='col-md-6'>
            <div className='text-center mt-4 mb-4'>
              <img src={state?.product?.image} alt={state.name} className='img-product-page' />
            </div>
          </div>

          <div className='col-md-6'>
            <strong>Description:</strong>
            <div className='mt-3'>
              <div dangerouslySetInnerHTML={{ __html: state.product?.content || '' }} />
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Product