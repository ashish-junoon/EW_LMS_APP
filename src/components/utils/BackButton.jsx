import { useLocation, useNavigate } from "react-router-dom";
import Icon from "./Icon";

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hidebtn = (location.pathname === "/admin/edit-collection") && location?.state?.user_id;

  return (
    <>
      {!hidebtn ? (
        <button
          onClick={() => navigate(-1)}
          className="bg-primary text-white font-semibold px-4 py-1 rounded-md flex w-fit items-center gap-1 block mb-2"
          to="/"
        >
          <Icon name="TiArrowBack" size="18" color="white" />
          Back
        </button>
      ) : ""}
    </>
  );
};

export default BackButton;
