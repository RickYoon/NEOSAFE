import Neon, { wallet,api }from "@cityofzion/neon-js";

const BasicDetail = ({ userAccount }) => {

  return (
    <div>
      <div className="w-full rounded-xl shadow-lg border hover:border-blue-500 cursor-pointer" style={{ marginTop: "50px", width: "500px", height: "450px" }}>
        <div className="py-8 px-8 flex flex-col justify-center items-center h-full">
          <div className="max-w-sm mx-auto lg:max-w-none">
            <p className="text-2xl font-bold">Activate 2-FA Wallet</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicDetail;
