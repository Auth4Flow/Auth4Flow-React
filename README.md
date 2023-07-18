# @forge4flow/forge4flow-react

[![npm](https://img.shields.io/npm/v/@forge4flow/forge4flow-react)](https://www.npmjs.com/package/@forge4flow/forge4flow-react)

## Overview

The Forge4Flow React library provides components, hooks, and helper methods for controlling access to pages and components in React using [Forge4Flow](https://github.com/Forge4Flow). The library interacts directly with the Forge4Flow-Core API using short-lived session tokens that can be created server-side using your API key or using the built in Authentication methods.

## Installation

Use `npm` to install `@forge4flow/forge4flow-react`:

```sh
npm install @forge4flow/forge4flow-react
```

## Usage

### `Forge4FlowProvider`

Wrap your application with `Forge4FlowProvider`, passing it your Client Key and API Endpoint. `Forge4FlowProvider` uses [React Context](https://reactjs.org/docs/context.html) to allow you to access utility methods for performing access checks anywhere in your app.

```jsx
// App.jsx
import React from "react";
import { Forge4FlowProvider } from "@forge4flow/forge4flow-react";

const App = () => {
  return (
    <Forge4FlowProvider
      clientKey="client_test_f5dsKVeYnVSLHGje44zAygqgqXiLJBICbFzCiAg1E="
      endpoint="https://your_api_endpoint.com"
    >
      {/* Routes, ThemeProviders, etc. */}
    </Forge4FlowProvider>
  );
};

export default App;
```

#### **Authentication**

Once your application has been wrapped with `Forge4FlowProvider` you can simple call add the `useForge4Flow` hook then call the `authenticate` method.

```jsx
import { useForge4Flow } from "@forge4flow/forge4flow-nextjs";

const auth = useForge4Flow();

const handleLogin = async () => {
  const login = await auth.authenticate();

  if (login) {
    router.push("/admin");
  }
};
```

### `check`

`check` is a utility function that returns a `Promise` which resolves with `true` if the user for the current session token has the specified `relation` on the specified `object` and returns `false` otherwise. Use it for fine-grained conditional rendering or for specific logic within components.

Using `check` through the `useForge4Flow` hook:

```jsx
import React, { useEffect } from "react";
import { useForge4Flow } from "@forge4flow/forge4flow-react";

const MyComponent = () => {
  const { check } = useForge4Flow();

  useEffect(() => {
    const fetchProtectedInfo = async () => {
      // Only fetch protected info from server if
      // user can "view" the info object "protected_info".
      const userIsAuthorized = await check({
        object: {
          objectType: "info",
          objectId: "protected_info",
        },
        relation: "viewer",
      });
      if (userIsAuthorized) {
        // request protected info from server
      }
    };

    fetchProtectedInfo();
  });

  return (
    <div>{protectedInfo && <ProtectedInfo>{protectedInfo}</ProtectedInfo>}</div>
  );
};

export default MyComponent;
```

Or using the React Context API:

```jsx
import React, { useEffect } from "react";
import { Forge4FlowContext } from "@forge4flow/forge4flow-react";

class MyComponent extends React.Component {
  async componentDidMount() {
    const { check } = this.context;

    // Only fetch protected info from server if
    // user can "view" the info object "protected_info".
    const userIsAuthorized = await check({
      object: {
        objectType: "info",
        objectId: "protected_info",
      },
      relation: "viewer",
    });
    if (userIsAuthorized) {
      await fetchProtectedInfo();
    }
  }

  async fetchProtectedInfo() {
    // request protected info from server
  }

  render() {
    return (
      <div>
        {protectedInfo && <ProtectedInfo>{protectedInfo}</ProtectedInfo>}
      </div>
    );
  }
}

MyComponent.contextType = Forge4FlowContext;

export default MyComponent;
```

### `checkMany`

`checkMany` is a utility function that returns a `Promise` which resolves with `true` if the user for the current session token has _all of_ or _any of_ (based on a specified `op`) a set of specified `warrants` and returns `false` otherwise.

```jsx
import { CheckOp } from "@forge4flow/forge4flow-js";

const { checkMany } = useForge4Flow();

// userIsAuthorized will only be true if the user is
// a member of tenant-A AND has permission view-protected-info
const userIsAuthorized = await checkMany({
  op: CheckOp.AllOf,
  warrants: [
    {
      object: {
        objectType: "tenant",
        objectId: "tenant-A",
      },
      relation: "member",
    },
    {
      object: {
        objectType: "permission",
        objectId: "view-protected-info",
      },
      relation: "member",
    },
  ],
});
```

### `hasPermission`

`hasPermission` is a utility function that returns a `Promise` which resolves with `true` if the user for the current session token has the specified `permissionId` and returns `false` otherwise.

```jsx
import { CheckOp } from "@forge4flow/forge4flow-js";

const { hasPermission } = useForge4Flow();

// userHasPermission will only be true if the user
// has the permission view-protected-info
const userHasPermission = await hasPermission({
  permissionId: "view-protected-info",
});
```

### `hasFeature`

`hasFeature` is a utility function that returns a `Promise` which resolves with `true` if the user for the current session token has the specified `featureId` and returns `false` otherwise.

```jsx
import { CheckOp } from "@forge4flow/forge4flow-js";

const { hasFeature } = useForge4Flow();

// userHasFeature will only be true if the user
// has the feature protected-info
const userHasFeature = await hasFeature({
  featureId: "protected-info",
});
```

### `ProtectedComponent`

`ProtectedComponent` is a utility component you can wrap around markup or components that should only be accessible to users with certain privileges. It only renders the components it wraps if the user has the given warrants.

```jsx
import React from "react";
import { ProtectedComponent } from "@forge4flow/forge4flow-react";

const MyComponent = () => {
  return (
    <div>
      <MyPublicComponent />
      {/* hides MyProtectedComponent unless the user can "view" myObject with id object.id */}
      <ProtectedComponent
        warrants={[
          {
            object: {
              objectType: "myObject",
              objectId: object.id,
            },
            relation: "view",
          },
        ]}
      >
        <MyProtectedComponent />
      </ProtectedComponent>
    </div>
  );
};

export default MyComponent;
```

### `PermissionProtectedComponent`

`PermissionProtectedComponent` is a utility component you can wrap around markup or components that should only be accessible to users with certain privileges. It only renders the components it wraps if the user has the given permission.

```jsx
import React from "react";
import { PermissionProtectedComponent } from "@forge4flow/forge4flow-react";

const MyComponent = () => {
  return (
    <div>
      <MyPublicComponent />
      {/* hides MyProtectedComponent unless the user has permission "view-protected-info" */}
      <PermissionProtectedComponent permissionId="view-protected-info">
        <MyProtectedComponent />
      </PermissionProtectedComponent>
    </div>
  );
};

export default MyComponent;
```

### `FeatureProtectedComponent`

`FeatureProtectedComponent` is a utility component you can wrap around markup or components that should only be accessible to users with certain privileges. It only renders the components it wraps if the user has the given feature.

```jsx
import React from "react";
import { FeatureProtectedComponent } from "@forge4flow/forge4flow-react";

const MyComponent = () => {
  return (
    <div>
      <MyPublicComponent />
      {/* hides MyProtectedComponent unless the user has feature "protected-info" */}
      <FeatureProtectedComponent featureId="protected-info">
        <MyProtectedComponent />
      </FeatureProtectedComponent>
    </div>
  );
};

export default MyComponent;
```

### `withForge4FlowCheck`

Use the `withForge4FlowCheck` Higher Order Component (HOC) to protect components that should only be accessible to users with certain privileges.

#### **Protecting Routes**

NOTE: This example uses `react-router` but you can use any routing library.

```jsx
// App.jsx
import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Forge4FlowProvider, withForge4FlowCheck } from "@forge4flow/forge4flow-react";
import PublicPage from "./PublicPage";
import ProtectedPage from "./ProtectedPage";

const history = createBrowserHistory();

const App = () => {
    return <Forge4FlowProvider clientKey="client_test_f5dsKVeYnVSLHGje44zAygqgqXiLJBICbFzCiAg1E=">
        <Router history={history}>
            <Switch>
                <Route path="/public_route" exact component={PublicPage}/>
                {/*
                    Only render ProtectedPage if the user
                    can "view" the route "protected_route".
                */}
                <Route path="/protected_route" exact component={withForge4FlowCheck(ProtectedPage, {
                    warrants: [{
                        object: {
                            objectType: "route",
                            objectId: "protected_route",
                        },
                        relation: "view",
                    }],
                    redirectTo: "/public_route",
                })}>
            </Switch>
        </Router>
    </Forge4FlowProvider>;
};

export default App;
```

#### **Protecting Components**

```jsx
import React from "react";
import { withForge4FlowCheck } from "@forge4flow/forge4flow-react";

const MySecretComponent = () => {
  return <div>Super secret text</div>;
};

// Only render MySecretComponent if the user
// can "view" the component "MySecretComponent".
export default withForge4FlowCheck(MySecretComponent, {
  warrants: [
    {
      object: {
        objectType: "component",
        objectId: "MySecretComponent",
      },
      relation: "view",
    },
  ],
  redirectTo: "/",
});
```

### `withPermissionCheck`

Use the `withPermissionCheck` Higher Order Component (HOC) to protect components that should only be accessible to users with a certain permission.

#### **Protecting Routes**

NOTE: This example uses `react-router` but you can use any routing library.

```jsx
// App.jsx
import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Forge4FlowProvider, withPermissionCheck } from "@forge4flow/forge4flow-react";
import PublicPage from "./PublicPage";
import ProtectedPage from "./ProtectedPage";

const history = createBrowserHistory();

const App = () => {
    return <Forge4FlowProvider clientKey="client_test_f5dsKVeYnVSLHGje44zAygqgqXiLJBICbFzCiAg1E=">
        <Router history={history}>
            <Switch>
                <Route path="/public_route" exact component={PublicPage}/>
                {/*
                    Only render ProtectedPage if the user
                    has the "view-protected-route" permission.
                */}
                <Route path="/protected_route" exact component={withPermissionCheck(ProtectedPage, {
                    permissionId: "view-protected-route",
                    redirectTo: "/public_route",
                })}>
            </Switch>
        </Router>
    </Forge4FlowProvider>;
};

export default App;
```

#### **Protecting Components**

```jsx
import React from "react";
import { withPermissionCheck } from "@forge4flow/forge4flow-react";

const MySecretComponent = () => {
  return <div>Super secret text</div>;
};

// Only render MySecretComponent if the user
// has the "view-protected-route" permission.
export default withPermissionCheck(MySecretComponent, {
  permissionId: "view-protected-route",
  redirectTo: "/",
});
```

### `withFeatureCheck`

Use the `withFeatureCheck` Higher Order Component (HOC) to protect components that should only be accessible to users with a certain feature.

#### **Protecting Routes**

NOTE: This example uses `react-router` but you can use any routing library.

```jsx
// App.jsx
import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Forge4FlowProvider, withFeatureCheck } from "@forge4flow/forge4flow-react";
import PublicPage from "./PublicPage";
import ProtectedPage from "./ProtectedPage";

const history = createBrowserHistory();

const App = () => {
    return <Forge4FlowProvider clientKey="client_test_f5dsKVeYnVSLHGje44zAygqgqXiLJBICbFzCiAg1E=">
        <Router history={history}>
            <Switch>
                <Route path="/public_route" exact component={PublicPage}/>
                {/*
                    Only render ProtectedPage if the user
                    has the "protected-route" feature.
                */}
                <Route path="/protected_route" exact component={withFeatureCheck(ProtectedPage, {
                    featureId: "protected-route",
                    redirectTo: "/public_route",
                })}>
            </Switch>
        </Router>
    </Forge4FlowProvider>;
};

export default App;
```

#### **Protecting Components**

```jsx
import React from "react";
import { withFeatureCheck } from "@forge4flow/forge4flow-react";

const MySecretComponent = () => {
  return <div>Super secret text</div>;
};

// Only render MySecretComponent if the user
// has the "protected-route" feature.
export default withFeatureCheck(MySecretComponent, {
  featureId: "protected-route",
  redirectTo: "/",
});
```
