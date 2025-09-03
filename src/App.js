import React from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PrimeReactProvider } from "primereact/api";

import store from "./redux/store";
import Site from "./Site";
import ErrorBoundary from "./components/ErrorBoundary";

// Create QueryClient for react-query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      useErrorBoundary: true,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error.status === 404) return false;
        return failureCount < 2;
      },
    },
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { token: null, appid: null };
  }

  componentDidMount() {
    // Priority: URL params > props
    const param = new URLSearchParams(window.location.search);
    this.setState({
      token: param.get("token") || this.props.token,
      appid: param.get("appId") || this.props.appid,
    });
  }

  render() {
    const { token, appid } = this.state;
    console.log({ token, appid });
    return (
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <PrimeReactProvider>
            <Provider store={store}>
              {appid && token ? (
                <Site appid={appid} token={token} />
              ) : (
                <div>Loading...</div>
              )}
            </Provider>
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          </PrimeReactProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    );
  }
}

export default App;
