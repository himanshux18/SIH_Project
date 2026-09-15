'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'Admin' | 'Viewer';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAdmin: boolean;
}

const RoleContext = createContext<RoleContextType>({
  role: 'Admin',
  setRole: () => {},
  isAdmin: true,
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>('Admin');

  useEffect(() => {
    const saved = localStorage.getItem('infrarisk_user_role') as UserRole;
    if (saved && (saved === 'Admin' || saved === 'Viewer')) {
      setRoleState(saved);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('infrarisk_user_role', newRole);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, isAdmin: role === 'Admin' }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
