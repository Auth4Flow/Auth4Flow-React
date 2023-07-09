import React, { useEffect, useState } from "react";
import { CheckMany } from "@auth4flow/auth4flow-js";
import useAuth4Flow from "./useAuth4Flow";

export interface WithWarrantCheckOptions extends CheckMany {
  redirectTo: string;
}

/**
 * A higher order component (HOC) to wrap around any component that should only be visible to users with the appropriate warrant
 *
 * @param WrappedComponent The component to be rendered if the user has the appropriate warrant
 * @param options The options used to construct the warrant(s) to check for. Consists of op, warrants, and a redirectTo path for unauthorized access.
 * @returns
 */
const withWarrantCheck = (
  WrappedComponent: React.ComponentClass,
  options: WithWarrantCheckOptions
) => {
  return (props: any) => {
    const { op, warrants, consistentRead, debug, redirectTo } = options;
    const { sessionToken, checkMany } = useAuth4Flow();
    const [showWrappedComponent, setShowWrappedComponent] =
      useState<boolean>(false);

    useEffect(() => {
      const checkWarrant = async () => {
        setShowWrappedComponent(
          await checkMany({ op, warrants, consistentRead, debug })
        );
      };

      if (sessionToken) {
        checkWarrant();
      }
    }, [sessionToken]);

    if (!sessionToken) {
      return <></>;
    }

    if (showWrappedComponent) {
      return <WrappedComponent {...props} />;
    }

    window.history.replaceState({}, document.title, redirectTo);

    return null;
  };
};

export default withWarrantCheck;
