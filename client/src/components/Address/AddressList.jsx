import AddressCard from "./AddressCard";
import { Button } from "@mui/material";
import { FaPlus } from "react-icons/fa";
import { useContext, useState } from "react";
import { MyContext } from "../../Context/MyContext";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAddressStore from "../../store/useAddressStore";

const AddressList = ({
  title,
  address,
  isCheckout = false,
  selectedAddress = null,
  setSelectedAddress = null,
}) => {
  if (!address) return;
  const defaultAddress =
    selectedAddress || address.find((addr) => addr.isDefault === true);

  const { setUpdateAddr, openAddrFrm } = useContext(MyContext);
  const [selectedId, setSelectedId] = useState(defaultAddress?._id || null);
  const axiosPrivate = useAxiosPrivate();
  const deleteAddress = useAddressStore((state) => state.deleteAddress);

  const handleSelect = (id) => {
    setSelectedId(id);
    if (setSelectedAddress) {
      const selectedAddress = address.find((addr) => addr._id === id);
      console.log(selectedAddress);
      setSelectedAddress(selectedAddress);
    }
  };

  const handleCreate = () => {
    setUpdateAddr(null);
    openAddrFrm();
  };

  const handleDelete = (addressId) => {
    deleteAddress(addressId, axiosPrivate);
    if (selectedId === addressId) {
      handleSelect(null);
    }
  };

  const handleUpdate = (address) => {
    setUpdateAddr(address);
    openAddrFrm();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-bold uppercase">{title}</h4>
        <Button
          className="!gap-1 !bg-white !border-2 !font-semibold !text-black  !border-black !rounded-md flex !items-center"
          onClick={handleCreate}
        >
          Thêm địa chỉ mới
          <FaPlus />
        </Button>
      </div>
      <div className="mt-5 space-y-5">
        {address.length > 0 ? (
          address.map((addr) => (
            <AddressCard
              key={addr._id}
              address={addr}
              selected={
                selectedId === addr._id || (!selectedId && addr.isDefault)
              }
              onSelect={() => handleSelect(addr._id)}
              onUpdate={() => handleUpdate(addr)}
              onDelete={() => handleDelete(addr._id)}
              isCheckout={isCheckout}
            />
          ))
        ) : (
          <>
            <div className="flex flex-col items-center justify-center py-10  border rounded">
              <p className="text-lg font-medium">Chưa có địa chỉ nào</p>
              <p className="text-sm text-gray-500">
                Hãy thêm địa chỉ để thuận tiện khi đặt hàng
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddressList;
