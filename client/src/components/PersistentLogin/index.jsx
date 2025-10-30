import { useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import useUserStore from "../../store/useUserStore";
import { MyContext } from "../../Context/MyContext";

const PersistentLogin = () => {
  const { refreshToken } = useUserStore();
  const { persist } = useContext(MyContext);
  const navigator = useNavigate();
  const location = useLocation();
  const user = useUserStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const refresh = async () => {
      setIsLoading(true);
      try {
        if (user || !persist) return;
        await refreshToken();
      } catch (error) {
        if (isMounted) {
          if (
            location.pathname === "/cart" ||
            location.pathname === "/checkout" ||
            location.pathname === "/my-account"
          ) {
            toast.error("Bạn cần phải đăng nhập trước!");
            navigator("/login");
          }
        }
      } finally {
        isMounted && setIsLoading(false);
      }
    };
    refresh();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  return (
    <>
      {isLoading ? (
        <>
          <div className="fixed inset-0 z-50 bg-black opacity-30"></div>
          <div className="fixed inset-0 z-60 flex items-center justify-center">
            <AiOutlineLoading3Quarters
              className="animate-spin text-white"
              size={50}
            />
          </div>
        </>
      ) : (
        <Outlet />
      )}
    </>
  );
};

export default PersistentLogin;
