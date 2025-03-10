import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function CollapsibleSidebar() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex">
      <div
        className={`fixed inset-y-0 left-0 bg-teal-700 text-white w-64 p-4 transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Contribute: Slave Voyages</h2>
          <button onClick={() => setIsOpen(false)} className="p-2">
            <X size={20} />
          </button>
        </div>
        <nav className="space-y-2">
          <a href="#" className="block hover:underline">Guidelines for Contributors</a>
          <a href="#" className="block hover:underline">New Voyages</a>
          <a href="#" className="block hover:underline">Edit Existing Voyage</a>
          <a href="#" className="block hover:underline">Merge Voyages</a>
          <a href="#" className="block hover:underline">Recommend Voyage Deletion</a>
          <a href="#" className="block hover:underline">Log Out</a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 ml-0 sm:ml-64">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="fixed top-4 left-4 bg-teal-700 text-white p-2 rounded"
          >
            <Menu size={20} />
          </button>
        )}
        <h1 className="text-2xl font-bold">Contribution Content Here</h1>
      </div>
    </div>
  );
}
