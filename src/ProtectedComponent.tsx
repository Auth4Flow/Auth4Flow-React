import React, { useEffect, useState } from "react";
import { CheckMany } from "@auth4flow/auth4flow-js";
import useAuth4Flow from "./useAuth4Flow";

export interface ProtectedComponentProps extends CheckMany {
  children: React.ReactNode;
}

const ProtectedComponent: React.FunctionComponent<ProtectedComponentProps> = ({
  children,
  op,
  warrants,
  consistentRead,
  debug,
}) => {
  const [showChildren, setShowChildren] = useState<boolean>(false);
  const { sessionToken, checkMany } = useAuth4Flow();

  useEffect(() => {
    if (!warrants || warrants.length === 0) {
      throw new Error("Invalid or no warrants provided to ProtectedComponent");
    }

    const checkWarrant = async () => {
      setShowChildren(await checkMany({ op, warrants, consistentRead, debug }));
    };

    if (sessionToken) {
      checkWarrant();
    }
  }, [sessionToken, JSON.stringify(warrants)]);

  if (showChildren) {
    return <>{children}</>;
  }

  return null;
};

export default ProtectedComponent;
