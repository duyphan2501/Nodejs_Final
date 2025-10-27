import React from "react";
import AddressBook from "../../components/AddressBook";
import AccountOverview from "../../components/AccountOverview";

const MyAccount = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-3">
              <AccountOverview />
            </div>

            <div className="md:col-span-9">
              <AddressBook />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyAccount;
