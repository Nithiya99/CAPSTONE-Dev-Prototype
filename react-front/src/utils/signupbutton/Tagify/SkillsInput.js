import React, { Component } from "react";
import TagFinal from "./TagFinal";
class SkillsInput extends Component {
  state = {
    words: [],
  };

  componentDidMount() {
    fetch("http://localhost:8081/words")
      .then((response) => response.json())
      .then((data) => this.setState({ words: data.words }));
  }
  render() {
    const { words } = this.state;
    const { setSkills } = this.props;
    return (
      <>
        <TagFinal
          suggestions={words}
          label={"What are you good at?"}
          setSkills={setSkills}
        />
      </>
    );
  }
}

export default SkillsInput;
