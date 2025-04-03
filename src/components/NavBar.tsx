import { Link } from "@tanstack/react-router";
import { cyberpunkTheme, appTokens } from "../theme/c4Theme";

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  color?: string;
}

const NavLink = ({ to, children, color = cyberpunkTheme.colorBrandBackground }: NavLinkProps) => (
  <li>
    <Link
      to={to}
      style={{
        color: color,
        textDecoration: "none",
        fontSize: appTokens.fontSizeNormal,
        fontWeight: "bold",
        padding: `${appTokens.paddingXs} ${appTokens.paddingS}`,
        borderRadius: cyberpunkTheme.borderRadiusSmall,
        transition: "all 0.2s ease-in-out",
        display: "inline-block",
      }}
      activeProps={{
        style: {
          backgroundColor: `${color}20`, // 20% opacity
          textDecoration: "underline",
        },
      }}
    >
      {children}
    </Link>
  </li>
);

const NavBar = () => {
  return (
    <>
      <nav
        style={{
          backgroundColor: cyberpunkTheme.colorNeutralBackground1,
          padding: `${appTokens.paddingS} 0`,
          borderBottom: `1px solid ${cyberpunkTheme.colorBrandBackground}`,
        }}
      >
        <ul
          style={{
            listStyle: "none",
            padding: appTokens.paddingNone,
            margin: appTokens.marginNone,
            display: "flex",
            justifyContent: "center",
            gap: appTokens.spacingHorizontalS,
            alignItems: "center", // Vertically align items
            flexWrap: "wrap", // Allow wrapping on smaller screens
          }}
        >
          <NavLink to="/" color={cyberpunkTheme.colorBrandBackground}>Home</NavLink>
          <NavLink to="/settings" color={cyberpunkTheme.colorBrandBackgroundHover}>Settings</NavLink>
          <NavLink to="/profile" color={cyberpunkTheme.colorBrandForeground1}>Profile</NavLink>
          <NavLink to="/monty" color={cyberpunkTheme.colorNeutralStroke1}>Monty</NavLink>
          <NavLink to="/system" color={cyberpunkTheme.colorBrandBackgroundPressed}>System</NavLink>
          <NavLink to="/system-flow" color={cyberpunkTheme.colorBrandBackgroundHover}>System Flow</NavLink>
          <NavLink to="/flow" color={cyberpunkTheme.colorNeutralForeground2}>Flow</NavLink>
          <NavLink to="/experimental-flow" color={cyberpunkTheme.colorNeutralForeground2}>Experimental Flow</NavLink>
          <NavLink to="/mermaid-flow" color={cyberpunkTheme.colorNeutralForeground2}>Mermaid Flow</NavLink>
        </ul>
      </nav>
    </>
  );
};

export default NavBar;
