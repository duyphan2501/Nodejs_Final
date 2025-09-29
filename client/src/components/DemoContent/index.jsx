import React from "react";

const DemoContent = () => {
  return (
    <>
      {/* Demo content below */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">Main Content Area</h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          This is where your main website content would go. The USP header above
          is fully responsive and matches the Adidas design pattern. Click the
          header to see the dropdown panel in action.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 p-6 rounded-lg">
              <h3 className="font-semibold mb-2">Demo Card {i}</h3>
              <p className="text-gray-600">
                Sample content to demonstrate the layout.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Repeated sections */}
      {[1, 2, 3, 4].map((section) => (
        <div key={section} className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-6">
            Main Content Area {section + 1}
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            This is where your main website content would go. The USP header
            above is fully responsive and matches the Adidas design pattern.
            Click the header to see the dropdown panel in action.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 p-6 rounded-lg">
                <h3 className="font-semibold mb-2">Demo Card {i}</h3>
                <p className="text-gray-600">
                  Sample content to demonstrate the layout.
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default DemoContent;
