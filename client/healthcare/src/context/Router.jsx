import React, { useState, useEffect } from "react";


const RouterContext = React.createContext();

// Hook to get the navigate function to navigate within the app and the currentPath
export function useRouter() {
  const context = React.useContext(RouterContext);
  if (!context) throw new Error("useRouter must be used within Router");
  return context;
}


// To declare the route and component associated in the Navigation component
export function Route({ path, component: Component }) {
  const { currentPath } = useRouter();
  const currentPathname = currentPath.split("?")[0];
  return currentPathname === path ? <Component /> : null;
}

// Router context wrapper
export default function Router({ children }) {
  const getFullPath = () => window.location.pathname + window.location.search;

  const [currentPath, setCurrentPath] = useState(getFullPath());

  useEffect(() => {
    const handlePopState = () => setCurrentPath(getFullPath());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setCurrentPath(getFullPath());
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}