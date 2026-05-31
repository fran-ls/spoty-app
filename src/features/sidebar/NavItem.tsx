export interface NavItemProps {
  isCollapsed: boolean;
  content: React.ReactNode;
  icon: React.ReactNode;
  redirectTo: () => void;
}

const NavItem = (props: NavItemProps) => {
  return (
    <li
      onClick={() => props.redirectTo()}
      className="hover:text-white cursor-pointer transition-colors duration-200 flex items-center gap-2 group truncate opacity-80"
      title={props.isCollapsed ? "Post-Rock Essentials" : undefined}
    >
      {props.isCollapsed ? (
        <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0 border border-transparent group-hover:border-primary/40 transition-all shadow-md">
          {props.icon}
        </div>
      ) : (
        props.content
      )}
    </li>
  )
}

export default NavItem;