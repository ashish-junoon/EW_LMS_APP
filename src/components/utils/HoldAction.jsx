
const HoldAction = ({setisOnHold, isOnHold}) => {
  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => setisOnHold(false)}
          className={`text-base font-semibold ${
            !isOnHold ? "bg-primary" : "bg-primary/50"
          } text-white px-5 py-1 rounded shadow-lg flex items-center gap-1`}
        >
          UnHold Leads
        </button>

        <button
          onClick={() => setisOnHold(true)}
          className={`text-base font-semibold ${
            isOnHold ? "bg-primary" : "bg-primary/50"
          } text-white px-5 py-1 rounded shadow-lg flex items-center gap-1`}
        >
          Hold Leads
        </button>
      </div>
    </>
  )
}

export default HoldAction
