import React, { Component, ErrorInfo } from 'react'
import CommonErrorComponent from '../Common500'

interface Props {
  children: React.ReactNode
}
interface State {
  hasError: boolean
}
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error: ', error, errorInfo)
    this.setState({ hasError: true })
  }
  handleRedirect = () => {
    window.location.href = '/enrolment/student/list/'
  }
  render() {
    if (this.state.hasError) {
      return <CommonErrorComponent handleRedirect={this.handleRedirect} />
    }

    return this.props.children
  }
}
export default ErrorBoundary
