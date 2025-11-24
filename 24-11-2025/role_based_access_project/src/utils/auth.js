export const getUserFromSession = () => {
  const raw = sessionStorage.getItem("currentUser");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const getUserRole = () => {
  const user = getUserFromSession();
  return user?.role || "EMPLOYEE";
};

export const isAdmin = () => {
  return getUserRole() === "ADMIN";
};

export const isManager = () => {
  return getUserRole() === "MANAGER";
};

export const isEmployee = () => {
  return getUserRole() === "EMPLOYEE";
};

export const canAddOrEdit = () => {
  const role = getUserRole();
  return role === "ADMIN" || role === "MANAGER";
};

export const canDelete = () => {
  return isAdmin();
};

export const getUserProduct = () => {
  const user = getUserFromSession();
  return user?.product_name || null;
};

export const logout = () => {
  sessionStorage.removeItem("currentUser");
};


export const getUserProductId = () => {
  const user = getUserFromSession();
  // need to store product_id in session during login
  return user?.product_id || null;
};


