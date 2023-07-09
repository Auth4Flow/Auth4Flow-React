import React, { useEffect, useState } from "react";
import { PermissionCheck } from "@auth4flow/auth4flow-js";
import useAuth4Flow from "./useAuth4Flow";

export interface PermissionProtectedComponentProps extends PermissionCheck {
  children: React.ReactNode;
}

const PermissionProtectedComponent: React.FunctionComponent<
  PermissionProtectedComponentProps
> = ({ children, permissionId, consistentRead, debug }) => {
  const [showChildren, setShowChildren] = useState<boolean>(false);
  const { sessionToken, hasPermission } = useAuth4Flow();

  useEffect(() => {
    if (!permissionId) {
      throw new Error(
        "Invalid or no permissionId provided to PermissionProtectedComponent"
      );
    }

    const checkWarrant = async () => {
      setShowChildren(
        await hasPermission({ permissionId, consistentRead, debug })
      );
    };

    if (sessionToken) {
      checkWarrant();
    }
  }, [sessionToken, JSON.stringify(permissionId)]);

  if (showChildren) {
    return <>{children}</>;
  }

  return null;
};

export default PermissionProtectedComponent;
