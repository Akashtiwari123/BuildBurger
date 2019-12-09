import React, { Component } from "react";
import "./Model.css";
import AUX from "../../../hoc/Aux";
import Backdrop from "../Backdrop/Backdrop";

class Model extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.show !== this.props.show ||
      nextProps.children !== this.props.children
    );
  }

  render() {
    return (
      <AUX>
        <div className="Box"/>
        <Backdrop show={this.props.show} click={this.props.modalClicked} />
        <div
          className="Mod"
          style={{
            transform: this.props.show ? "translateX(0)" : "translateY(-100vh)",
            opacity: this.props.show ? "1" : "0"
          }}
        >
          {this.props.children}
        </div>
      </AUX>
    );
  }
}

export default Model;
