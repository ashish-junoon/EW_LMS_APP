import PuffLoader from "react-spinners/PuffLoader";

function Loader() {
    return (
        <div className="flex justify-center items-center h-screen bg-white opacity-40 w-full fixed top-0 left-0 z-50">
            <PuffLoader
                size={100}
                color="#003397"
                loading={true}
                speedMultiplier={1}
            />
        </div>
    );
}

export default Loader;
