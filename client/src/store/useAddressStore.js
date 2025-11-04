import { create } from "zustand";
import { toast } from "react-toastify";

const useAddressStore = create((set) => {
  const createAddress = async (addressData, axiosPrivate) => {
    set({ isLoadingAddress: true });
    try {
      const res = await axiosPrivate.post(`/api/address/create`, addressData);
      toast.success(res.data.message || "Address added successfully");
      set({ addresses: res.data.addresses });
      return res.data.success;
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error(error.response?.data?.message || "Failed to add address");
    } finally {
      set({
        isLoadingAddress: false,
      });
    }
  };

  const getAllAddresses = async (axiosPrivate) => {
    try {
      const res = await axiosPrivate.get(`/api/address/all`);
      set({ addresses: res.data.addresses });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch addresses");
    }
  };

  const updateAddress = async (addressData, axiosPrivate) => {
    set({ isLoadingAddress: true });
    try {
      const res = await axiosPrivate.put(`/api/address/update`, addressData);
      set({ addresses: res.data.addresses });
      toast.success(res.data.message || "Address updated successfully");
      return res.data.success;
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error(error.response?.data?.message || "Failed to update address");
    } finally {
      set({
        isLoadingAddress: false,
      });
    }
  };

  const deleteAddress = async (id, axiosPrivate) => {
    set({ isLoadingAddress: true });
    try {
      const res = await axiosPrivate.delete(`/api/address/delete/${id}`);
      set({ addresses: res.data.addresses });
      toast.success(res.data.message || "Address deleted successfully");
      return res.data.success;
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error(error.response?.data?.message || "Failed to delete address");
    } finally {
      set({
        isLoadingAddress: false,
      });
    }
  };

  return {
    isLoadingAddress: false,
    addresses: [],
    createAddress,
    getAllAddresses,
    updateAddress,
    deleteAddress,
  };
});

export default useAddressStore;
