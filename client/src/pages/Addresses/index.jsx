import React from "react";
import AddressBook from "../../components/AddressBook";
import AccountOverview from "../../components/AccountOverview";
import AddressList from "../../components/Address/AddressList";
import useAddressStore from "../../store/useAddressStore";

const MyAccount = () => {
  const addresses = useAddressStore(state => state.addresses)
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 flex-col lg:flex-row">
            <div className="">
              <AccountOverview />
            </div>
            <div className="flex-1 bg-white shadow-sm divide-gray-200 p-5">
              <AddressList address={addresses} title={"SỔ ĐỊA CHỈ"}/>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyAccount;
