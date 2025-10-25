import React from "react";
import UserProvider from "../../components/UserProvider";
import ProfileInfo from "../../components/FrofileInfo";
import AccountOverview from "../../components/AccountOverview";

const MyAccount = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="py-8">
        {/* Khung lưới chia 12 cột */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Sidebar chiếm 3 phần */}
            <div className="md:col-span-3">
              <AccountOverview />
            </div>

            {/* Nội dung chính chiếm 9 phần */}
            <div className="md:col-span-9">
              <UserProvider>
                <ProfileInfo />
              </UserProvider>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyAccount;
