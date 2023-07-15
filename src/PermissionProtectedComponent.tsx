import React, { useEffect, useState } from "react";
import { PermissionCheck } from "@forge4flow/forge4flow-js";
import useForge4Flow from "./useForge4Flow";

export interface PermissionProtectedComponentProps extends PermissionCheck {
  children: React.ReactNode;
}

const PermissionProtectedComponent: React.FunctionComponent<
  PermissionProtectedComponentProps
> = ({ children, permissionId, consistentRead, debug }) => {
  const [showChildren, setShowChildren] = useState<boolean>(false);
  const { sessionToken, hasPermission } = useForge4Flow();

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
