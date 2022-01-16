import React from "react";

class inputArea extends React.Component {
  render() {
    return (
      <div>
        <input type="text" id="subjectInput" onKeyPress={this.handleSubmit} />
      </div>
    );
  }

  handleSubmit = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const subject = event.target.value;
      this.props.addTerm(subject);
    }
  };
}

export default inputArea;
