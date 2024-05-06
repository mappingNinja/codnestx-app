import React, { useContext, useEffect, useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import axios from 'axios'
import { toast } from 'react-toastify';
import { Editor } from '@tinymce/tinymce-react';

import { useDispatch, useSelector } from 'react-redux';
import { editProductAction } from '../../redux/actions/productAction';
import authContext from '../../context/authContext/authContext';

const IMAGE_UPLOAD_ENDPOINT = process.env.REACT_APP_IMAGE_UPLOAD_ENDPOINT

const EditProductModal = ({ isOpen, toggle, productId, products, getProducts }) => {
  const dispatch = useDispatch();
  const { getConfig } = useContext(authContext)
  const intialState = { nameError: '', imageError: '', editProductError: '', product: {} }
  const [state, setCompleteState] = useState(intialState)
  const setState = (newState) => setCompleteState((prevState) => ({ ...prevState, ...newState }));

  const { loading } = useSelector((state) => state.products);

  const onHideModal = () => {
    setState({ ...intialState });
    toggle();
  }

  useEffect(() => {
    const product = (products || []).find((product) => product?._id === productId);
    if (product) {
      product.imageUrl = product.image;
    }
    setState({ product: JSON.parse(JSON.stringify(product || {})) })
  }, [productId]);


  const handleSubmit = (e) => {
    e.preventDefault();
    editProduct();
  }

  const editProduct = async () => {
    const { product: { name, image, content, note, imageUrl }, nameError, imageError, editProductError } = state;
    const isValid = name && image && content && (nameError === intialState.nameError) && (imageError === intialState.imageError) && (editProductError === intialState.editProductError);
    if (!isValid) {
      setState({ editProductError: '*Please fill all the required fields' });
      return;
    }


    let fileUrl = imageUrl;
    if (image && typeof (image) !== "string") {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', process.env.REACT_APP_UPLOAD_PRESETs);
      formData.append('cloud_name', process.env.REACT_APP_CLOUD_NAME);
      try {
        const { data } = await axios.post(IMAGE_UPLOAD_ENDPOINT, formData);
        fileUrl = data?.url
      } catch (err) {
        toast.error(err?.response?.data?.error || err.message)
        return;
      }
    }

    const config = getConfig();
    const update = { ...state.product, image: fileUrl }
    console.log("🚀 ~ editProduct ~ update:", update)
    dispatch(editProductAction(update, config, getProducts, onHideModal))
  }

  const validateName = () => {
    if (!state.product.name) {
      setState({ nameError: '*Please enter product name' });
    }
  }

  const validateImage = () => {
    if (!state.product.image) {
      setState({ imageError: '*Please choose product image' });
    }
  }

  const handleFileChange = (files) => {
    if (!(files || []).length) {
      setState({ imageError: "Upload an image" })
      return;
    }

    const file = files[0]
    const fileSize = file?.size * 0.000001

    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      setState({ imageError: "choose jpeg or png image" })
      return
    }

    if (fileSize > 1) {
      setState({ imageError: "File size not higer than 1MB!" })
      toast.error("File size not higer than 1MB!");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    updateProductState('image', file);
    updateProductState('imageUrl', imageUrl);

    // setState({ image: file, imageUrl });
  }

  const updateProductState = (key, value) => {
    const { product } = state || {};
    product[key] = value;
    setState({ product })
  }

  const closeBtn = () => <button className='btn btn-close' onClick={onHideModal}>X</button>;

  return (
    <Modal isOpen={isOpen} toggle={onHideModal} size='lg'>
      <ModalHeader toggle={onHideModal} close={closeBtn()}>
        <div className='d-flex align-items-center'>
          <div>Edit Product</div>
          <div className='ml-3'>
            {loading ? <div class="spinner-border text-primary" role="status" /> : null}
          </div>
        </div>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={state?.product?.name}
              onChange={(e) => updateProductState('name', e.target.value)}
              onBlur={validateName}
              onFocus={() => setState({ nameError: '', editProductError: '' })}
              disabled={loading}
            />
            {state?.nameError ? <div className='text-danger ml-2'>{state.nameError}</div> : null}
          </div>

          <div className="form-group">
            <label>Image</label>
            {state?.product?.imageUrl ? (
              <div className='d-flex align-items-center justify-content-between'>
                <div className='d-flex align-items-center justify-content-center ml-3'>
                  <img src={state?.product?.imageUrl} className='img-add-product' alt="product image" />
                </div>
                <div>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) => handleFileChange(e.target.files)}
                    onBlur={validateImage}
                    onFocus={() => setState({ imageError: '', editProductError: '' })}
                    disabled={loading}
                  />
                </div>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => handleFileChange(e.target.files)}
                  onBlur={validateImage}
                  onFocus={() => setState({ imageError: '', editProductError: '' })}
                  disabled={loading}
                />
                {state?.imageError ? <div className="text-danger ml-2">{state?.imageError}</div> : null}
              </>
            )}
          </div>

          <div className="form-group">
            <label>Note</label>
            <input
              type="text"
              className="form-control"
              value={state?.product?.note}
              onChange={(e) => updateProductState('note', e.target.value)}
              disabled={loading}
            />
            <small className='text-muted ml-2'>This note is only for admin</small>
          </div>

          <div className="form-group">
            <label>content</label>
            <div className='mb-5 product-content'>
              <Editor
                apiKey='5an9l2os1l8x6d86wh1gb5fyutt4cbse9iz601i9wrp3756t'
                value={state?.product?.content || ''}
                init={{
                  toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                  tinycomments_mode: 'embedded',
                  tinycomments_author: 'Author name',
                  mergetags_list: [
                    { value: 'First.Name', title: 'First Name' },
                    { value: 'Email', title: 'Email' },
                  ],
                  ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
                }}
                disabled={loading}
                onEditorChange={(content) => updateProductState('content', content)}
              // initialValue="Welcome Admin"
              />
            </div>
          </div>
          <div className="form-group">
            <label>Preview</label>
            <div dangerouslySetInnerHTML={{ __html: state?.product?.content || '' }} />
          </div>
          {state?.editProductError ? <div className="text-center text-danger">{state?.editProductError}</div> : null}
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onHideModal} disabled={loading}>
          Cancel
        </Button>
        <Button type='submit' color="primary" onClick={handleSubmit} disabled={loading}>
          Update Product
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default EditProductModal;