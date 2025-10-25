import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
const EmptyCart = ({}) => {
  return (
    <div className="min-h-screen bg-white-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-8 md:p-16 rounded">
          <h1 className="text-6xl md:text-8xl font-bold mb-4">
            TÚI CỦA BẠN TRỐNG
          </h1>
          <p className="text-gray-600 mb-8 text-3xl">
            Once you add something to your bag - it will appear here. Ready to
            get started?
          </p>
          <button className="bg-black text-white px-8 py-3 text-sm font-semibold inline-flex items-center gap-2 hover:bg-gray-800 transition-colors">
            GET STARTED <ArrowRight size={26} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;
