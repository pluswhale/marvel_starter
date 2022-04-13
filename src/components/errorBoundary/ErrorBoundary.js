import {Component} from "react";
import ErrorMsg from "../errorMsg/errorMsg";

class ErrorBoundary extends Component {
    state = {
        error: false
    }


    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo)
        this.setState({
            error: true
        })
    }

    render() {
        if (this.state.error) {
            return <ErrorMsg/>
        }

        return this.props.children;
    }
}

export default ErrorBoundary;