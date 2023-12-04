import Layout from "../../components/Layout";
import Api from "../../api.config";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Loading from "../screens/Loading";
import ErrorPage from "../screens/Error";
import { useNavigate } from "react-router-dom";
import defaultPic from "../../assets/pic3.jpg";
import {
  Top,
  ProfileImg,
  HoldImg,
  PicForm,
  EditIcon,
  PicLabel,
  PicInput,
  UploadBtn,
} from "./Settings.style";
import SettingOptions from "./Options";

function SettingsPage() {
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [profilePic, changePic] = useState(defaultPic);
  const [email, setEmail] = useState("");
  const [history, setHistory] = useState(["Settings"]);
  const [picFile, setPicFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState("");

  function picChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      const file = e.target.files[0];
      setPicFile(file);
      //   changePic(URL.createObjectURL(file));
      setFeedback("Click upload to change profile picture");
    }
  }

  function uploadImage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (picFile && !uploading) {
      setUploading(true);
      setFeedback("Uploading...");
      Api.put(
        "/users",
        { picture: picFile },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
        .then((res) => {
          const { picture } = res.data.data;
          changePic(picture);
          setFeedback("Successful");

          setTimeout(() => {
            setFeedback("");
            setPicFile(null);
            setUploading(false);
          }, 1200);
        })
        .catch(() => {
          setFeedback("Failed. Please try again");
          setPicFile(null);
          setUploading(false);
          setTimeout(() => {
            setFeedback("");
          }, 1200);
        });
    }
  }

  const navigate = useNavigate();
  useEffect(() => {
    Api.get("/users/dashboard")
      .then((res) => {
        const { message } = res.data;
        const { picture, email } = res.data.data;
        setEmail(email);
        if (picture) {
          changePic(picture);
        }

        setHistory(["Settings"]);
        setData(message);
      })
      .catch((err) => {
        if (err.response) {
          const { message } = err.response.data;
          setErrorMessage(message);
          if (err.response.status === 401) {
            setTimeout(() => {
              navigate("/login");
            }, 1200);
          }
        } else {
          setErrorMessage("No response from server");
        }
      });
  }, [navigate]);

  if (errorMessage) {
    return <ErrorPage message={errorMessage} />;
  }

  if (data) {
    return (
      <Layout activeNav="settings" history={history}>
        <div className="set">
          <Top>
            <HoldImg>
              <ProfileImg src={profilePic} alt="load img" />
              <PicForm onSubmit={uploadImage}>
                <PicLabel htmlFor="picture">
                  <EditIcon />
                </PicLabel>
                <PicInput
                  type="file"
                  id="picture"
                  accept="image/*"
                  required
                  onChange={picChange}
                />
                <UploadBtn show={picFile !== null}>Upload</UploadBtn>
              </PicForm>
            </HoldImg>
            <p
              style={{
                marginTop: "12px",
                display: picFile !== null ? "none" : "block",
                fontSize: "16px",
              }}
            >
              {email}
            </p>
            <p style={{ marginTop: "60px" }}>{feedback}</p>
          </Top>
          <SettingOptions />
        </div>
      </Layout>
    );
  }

  return <Loading />;
}

export default SettingsPage;
