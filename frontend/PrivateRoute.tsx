import { Redirect, Route, RouteComponentProps, useLocation } from "react-router";
import AppBody from "../../AppBody";

type AppBodyType = ReturnType<typeof AppBody>;

type Props = {
    component: (props: RouteComponentProps) => JSX.Element | AppBodyType,
    authed: boolean,
    path: string
}

function PrivateRoute ({ component: Component, authed, path, ...rest }: Props) {
    const location = useLocation();
    return (
      <Route {...rest} path={path} render={(props) => {
        return authed === true
          ? <Component {...props}/>
          : <Redirect to={{pathname: '/login', state: { from: location }}}/>
      }}/>
    )
  }

export default PrivateRoute;