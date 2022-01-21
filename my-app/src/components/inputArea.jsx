import React from "react";

class inputArea extends React.Component {
  render() {
    return (
      <div className="w-50 mx-auto">
        <h2 className="text-center">Enter a term to correlate:</h2>
        <div className=" input-group mb-3">
          <input
            className="form-control center-block"
            type="text"
            placeholder="Omicron Variant"
            id="subjectInput"
            onKeyPress={this.handleSubmit}
          />
          <div className="input-group-append">
            <button
              className="btn btn-primary"
              type="button"
              onClick={this.handleClick}
            >
              Correlate!
            </button>
          </div>
        </div>
      </div>
    );
  }

  handleSubmit = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const subject = event.target.value;
      event.target.value = "";
      this.props.addTerm(subject);
    }
  };

  handleClick = (event) => {
    const subject = event.target.parentElement.parentElement.children[0].value;
    event.target.parentElement.parentElement.children[0].value = "";
    this.props.addTerm(subject);
  };
}

export default inputArea;
