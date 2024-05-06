import axios from "axios";
import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { Editor } from "@tinymce/tinymce-react";
import errorHandle from "../../utils/errorHandle";
import { addProductAction } from "../../redux/actions/productAction";
import authContext from "../../context/authContext/authContext";

const IMAGE_UPLOAD_ENDPOINT = process.env.REACT_APP_IMAGE_UPLOAD_ENDPOINT;

const AddProductModal = ({ isOpen, toggle, getProducts }) => {
  const dispatch = useDispatch();
  const intialState = {
    loading: false,
    name: "",
    nameError: "",
    image: "",
    imageUrl: "",
    imageError: "",
    content: "",
    addProductError: "",
    note: "",
  };
  const [state, setCompleteState] = useState(intialState);
  const setState = (newState) =>
    setCompleteState((prevState) => ({ ...prevState, ...newState }));

  const { getConfig } = useContext(authContext);

  const { loading } = useSelector((state) => state.products);

  const handleSubmit = (e) => {
    e.preventDefault();
    addProduct();
  };

  const onHideModal = () => {
    setState(intialState);
    toggle();
  };

  const validateName = () => {
    if (!state.name) {
      setState({ nameError: "*Please enter Product name" });
    }
  };

  const validateImage = () => {
    if (!state.image) {
      setState({ imageError: "*Please choose Product image" });
    }
  };

  const handleFileChange = (files) => {
    if (!(files || []).length) {
      setState({ imageError: "Upload an image" });
      return;
    }

    const file = files[0];
    const fileSize = file?.size * 0.000001;

    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      setState({ imageError: "choose jpeg or png image" });
      return;
    }

    if (fileSize > 1) {
      setState({ imageError: "File size not higer than 1MB!" });
      toast.error("File size not higer than 1MB!");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setState({ image: file, imageUrl });
  };

  const addProduct = async () => {
    const {
      name,
      nameError,
      image,
      imageError,
      content,
      addProductError,
      note,
    } = state;

    const isValid =
      name &&
      content &&
      image &&
      nameError === intialState.nameError &&
      imageError === intialState.imageError &&
      addProductError === intialState.addProductError;
    if (!isValid) {
      setState({ addProductError: "*Please fill all the required fields" });
      return;
    }

    let fileUrl = "";
    if (image && typeof image !== "string") {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", process.env.REACT_APP_UPLOAD_PRESET);
      formData.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);
      try {
        const { data } = await axios.post(IMAGE_UPLOAD_ENDPOINT, formData);
        fileUrl = data?.url;
      } catch (err) {
        errorHandle(err);
        return;
      }
    }

    const config = getConfig();
    const data = { name, image: fileUrl, content, note };
    dispatch(addProductAction(data, config, getProducts, onHideModal));
  };

  return (
    <Modal isOpen={isOpen} toggle={onHideModal} size="lg">
      <ModalHeader toggle={onHideModal}>
        <div className="d-flex align-items-center">
          <div>Add Product</div>
          <div className="ml-3">
            {loading ? (
              <div class="spinner-border text-primary" role="status" />
            ) : null}
          </div>
        </div>
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit}>
          <div class="form-group mb-3">
            <label>Name</label>
            <input
              type="text"
              class="form-control"
              value={state?.name}
              onChange={(e) => setState({ name: e.target.value })}
              onBlur={validateName}
              onFocus={() => setState({ nameError: "", addProductError: "" })}
              disabled={loading}
            />
            {state.nameError ? (
              <div className="text-danger ml-2">{state.nameError}</div>
            ) : null}
          </div>
          <div class="form-group mb-3">
            <label>Image</label>
            {state.imageUrl ? (
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center justify-content-center ml-3">
                  <img
                    src={state.imageUrl}
                    className="img-add-Product"
                    alt="Product image"
                  />
                </div>
                <div>
                  <input
                    type="file"
                    class="form-control"
                    onChange={(e) => handleFileChange(e.target.files)}
                    onBlur={validateImage}
                    onFocus={() =>
                      setState({ imageError: "", addProductError: "" })
                    }
                    disabled={loading}
                  />
                </div>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  class="form-control"
                  onChange={(e) => handleFileChange(e.target.files)}
                  onBlur={validateImage}
                  onFocus={() =>
                    setState({ imageError: "", addProductError: "" })
                  }
                  disabled={loading}
                />
                {state?.imageError ? (
                  <div className="text-danger ml-2">{state?.imageError}</div>
                ) : null}
              </>
            )}
          </div>

          <div class="form-group mb-3">
            <label>Note</label>
            <input
              type="text"
              class="form-control"
              value={state.note}
              onChange={(e) => setState({ note: e.target.value })}
              disabled={loading}
            />
            <small className="text-muted ml-2">
              This note is only for admin
            </small>
          </div>

          <div class="form-group mb-3">
            <label>content</label>
            <div className="mb-5 Product-content">
              <Editor
                apiKey="5an9l2os1l8x6d86wh1gb5fyutt4cbse9iz601i9wrp3756t"
                value={state?.content || ""}
                init={{
                  toolbar:
                    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                  tinycomments_mode: "embedded",
                  tinycomments_author: "Author name",
                  mergetags_list: [
                    { value: "First.Name", title: "First Name" },
                    { value: "Email", title: "Email" },
                  ],
                }}
                disabled={loading}
                onEditorChange={(content) => setState({ content })}
              />
            </div>
          </div>
          <div class="form-group mb-3">
            <label>Preview</label>
            <div dangerouslySetInnerHTML={{ __html: state.content || "" }} />
          </div>
          {state?.addProductError ? (
            <div className="text-center text-danger">
              {state?.addProductError}
            </div>
          ) : null}
        </form>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={onHideModal} disabled={loading}>
          Cancel
        </Button>
        <Button color="primary" onClick={handleSubmit} disabled={loading}>
          Add Product
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddProductModal;
