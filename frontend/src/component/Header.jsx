import { NavLink } from "react-router";

// const navItems = [
//     { to: "/", label: "Accueil", bgColor: "bg-slate-600" },
//     { to: "/prepare-expo", label: "Préparer mon expo", bgColor: "bg-emerald-600" },
//     { to: "/my-expo", label: "Voir mon expo", bgColor: "bg-indigo-600" },
//     { to: "/admin", label: "Administrer", bgColor: "bg-rose-600" },
// ];


const Header = () => {
    return (
        <header className="">
            <h1 className="">Timeline</h1>
            <nav className="" aria-label="Navigation principale">
{/* 
                {
                    navItems.map((item, index) =>
                        <NavLink key={index} to={item.to} className={({ isActive }) =>
                        `text-white px-4 py-2 rounded-lg ${item.bgColor} ${isActive ? "shadow-lg shadow-black/50" : ""}`
                      }>
                            {item.label}
                        </NavLink>
                    )
                } */}
            </nav>

        </header >
    );
}
export default Header;