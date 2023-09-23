import Neon, { wallet,api }from "@cityofzion/neon-js";

const loadingCard = ({userAccount}) => {

  return (
    <div>
      <div className="w-full rounded-xl shadow-lg border" style={{ marginTop: "50px", width: "500px", height: "450px" }}>
        <div className="py-8 px-8 flex flex-col justify-center items-center h-full">
          <div className="max-w-sm mx-auto lg:max-w-none">
            {userAccount==="" ?
            <></>
            :
            <p className="text-2xl">Loading...</p>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default loadingCard;
