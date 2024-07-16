import { createContext, ReactNode, useContext, useState } from "react";
import { CgMoreVertical } from "react-icons/cg";
import { FaRegUserCircle } from "react-icons/fa";
import { LuChevronFirst, LuChevronLast } from "react-icons/lu";
import { MdModelTraining, MdOutlineDashboard } from "react-icons/md";
import { Link } from "react-router-dom";

interface SidebarContextType {
  expanded: boolean;
}

interface SidebarProps {
  children?: ReactNode;
  activeItem: string;
}

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  active?: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const Sidebar: React.FC<SidebarProps> = ({ activeItem, children }) => {
  const [expanded, setExpanded] = useState(true);

  const sidebarItems = [
    { icon: <MdOutlineDashboard size={20} />, text: "Dashboard" },
    { icon: <FaRegUserCircle size={20} />, text: "Employees" },
    { icon: <MdModelTraining size={20} />, text: "Trainings" },
  ];

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
            src="https://img.logoipsum.com/330.svg"
            className={`overflow-hidden transition-all ${
              expanded ? "w-32" : "w-0"
            }`}
            alt="Logo"
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
          >
            {expanded ? <LuChevronFirst /> : <LuChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">
            {sidebarItems.map((item, index) => (
              <SidebarItem
                key={index}
                icon={item.icon}
                text={item.text}
                active={activeItem === item.text}
              />
            ))}
            {children}
          </ul>
        </SidebarContext.Provider>

        <div className="border-t flex items-center p-3">
          <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
            <span className="font-medium text-gray-600 dark:text-gray-300">
              U
            </span>
          </div>
          <h4
            className={`font-semibold ml-3 overflow-hidden transition-all ${
              expanded ? "" : "w-0 ml-0"
            }`}
          >
            User
          </h4>
          <CgMoreVertical
            size={20}
            className={`ml-auto cursor-pointer overflow-hidden transition-all ${
              expanded ? "" : "w-0 ml-0"
            }`}
          />
        </div>
      </nav>
    </aside>
  );
};

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  text,
  active,
}) => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error(
      "SidebarItem must be used within a SidebarContext.Provider"
    );
  }
  const { expanded } = context;
  return (
    <Link to={`/${text}`}>
      <li
        className={`relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group : ${
          active
            ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
            : "hover:bg-indigo-50 text-gray-600"
        }`}
      >
        {icon}
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-32 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>

        {!expanded && (
          <div
            className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}
          >
            {text}
          </div>
        )}
      </li>
    </Link>
  );
};

export default Sidebar;
