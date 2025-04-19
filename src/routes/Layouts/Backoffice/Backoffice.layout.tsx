import { lazy } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import app_routes from "@/lib/consts/app_routes";

import { useSidebarStore } from "@/store/SidebarState/SidebarState";
import { useMobile } from "@/hooks/useMobile";

const Header = lazy(() => import("@/components/layout/Header/Header"));
const Sidebar = lazy(() => import("@/components/layout/Sidebar/Sidebar"));

/**
 * Backoffice layout component for the application.
 *
 * This component defines the main structure of the backoffice layout, including
 * a header, a sidebar, and a main content area. It uses animations to handle
 * the opening and closing of the sidebar and adjusts the layout dynamically
 * based on the sidebar's state.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered Backoffice layout component.
 *
 * @remarks
 * - The layout is implemented using CSS Grid with predefined grid areas.
 * - Animations are handled using the `motion` components from Framer Motion.
 * - The sidebar's width and margins are dynamically adjusted based on the
 *   `isOpen` state from the `useSidebarStore` hook.
 *
 *
 * @dependencies
 * - `useSidebarStore`: A custom hook to manage the sidebar's state.
 * - `motion`: Framer Motion library for animations.
 * - `ModeToggle`: A component for toggling between light and dark modes.
 * - `Sidebar`: A component for rendering the sidebar with navigation routes.
 * - `Outlet`: A React Router component for rendering nested routes.
 *
 * @styles
 * - The layout uses Tailwind CSS classes for styling.
 * - Dark mode styles are applied using `dark:` prefixed classes.
 */
const Backoffice = () => {
	const { screenType } = useMobile(); // 3sm is the breakpoint;
	const sidebarState = useSidebarStore((state) => state);

	// VARIABLES
	const IS_MOBILE = ["3sm", "2sm", "sm"].includes(screenType);
	const MOBILE_STYLE = `min-w-screen relative w-full z-20 ${
		IS_MOBILE && sidebarState.isOpen ? "visible" : "hidden"
	}`;

	const SIDEBAR_WIDTH = sidebarState.isOpen ? "250px" : "100px";

	const SIDEBAR_START_MARGIN = sidebarState.isOpen ? "0px" : "-170px";
	const SIDEBAR_END_MARGIN = sidebarState.isOpen ? "0px" : "-150px";

	const MOBILE_SIDEBAR_START_MARGIN = "0px";
	const MOBILE_SIDEBAR_END_MARGIN = "0px";

	const GRID_TEMPLATE = IS_MOBILE ? "0 1fr" : "250px 1fr";
	const mocked_profile = {
		username: "Adel Gannem",
		avatar: "",
	}; //TODO: Implementar sistema de carga de imagenes para el usuario

	return (
		<section
			style={{
				gridTemplateColumns: GRID_TEMPLATE,
			}}
			className="grid grid-areas-backoffice grid-rows-[auto_1fr] h-screen overflow-hidden"
		>
			<motion.header
				className="area-header bg-white border dark:bg-neutral-800 p-4"
				initial={{ marginLeft: IS_MOBILE ? MOBILE_SIDEBAR_START_MARGIN : SIDEBAR_START_MARGIN }}
				animate={{ marginLeft: IS_MOBILE ? MOBILE_SIDEBAR_END_MARGIN : SIDEBAR_END_MARGIN }}
				transition={{ duration: 0.3, ease: "easeInOut" }}
			>
				<Header profile={mocked_profile} />
			</motion.header>
			<AnimatePresence>
				{(!IS_MOBILE || sidebarState.isOpen) && (
					<motion.aside
						key="sidebar" // importante para que AnimatePresence detecte el cambio
						className={`area-aside border bg-white dark:bg-neutral-900 p-4 max-h-screen overflow-auto ${
							IS_MOBILE && MOBILE_STYLE
						}`}
						initial={IS_MOBILE ? { opacity: 0 } : { width: SIDEBAR_WIDTH }}
						animate={
							IS_MOBILE ? { opacity: sidebarState.isOpen ? 1 : 0 } : { width: SIDEBAR_WIDTH }
						}
						exit={IS_MOBILE ? { opacity: 0 } : { width: 0 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						style={{
							width: IS_MOBILE ? "100%" : SIDEBAR_WIDTH,
						}}
					>
						<Sidebar
							isOpen={sidebarState.isOpen}
							toggleSidebar={sidebarState.toggleSidebar}
							routes={app_routes}
						/>
					</motion.aside>
				)}
			</AnimatePresence>
			<motion.main
				className="area-main p-4 overflow-auto"
				initial={{ marginLeft: IS_MOBILE ? MOBILE_SIDEBAR_START_MARGIN : SIDEBAR_START_MARGIN }}
				animate={{ marginLeft: IS_MOBILE ? MOBILE_SIDEBAR_END_MARGIN : SIDEBAR_END_MARGIN }}
				transition={{ duration: 0.3, ease: "easeInOut" }}
			>
				<Outlet />
			</motion.main>
		</section>
	);
};

export default Backoffice;
