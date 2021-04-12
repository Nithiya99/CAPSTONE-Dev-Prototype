import React, { Component } from "react";
import { Button, Modal } from "react-bootstrap";
import { withStyles } from "@material-ui/core/styles";
import Rating from "@material-ui/lab/Rating";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import FavoriteIcon from "@material-ui/icons/Favorite";

const StyledRating = withStyles({
  iconFilled: {
    color: "#ff6d75",
  },
  iconHover: {
    color: "#ff3d47",
  },
})(Rating);

class RatingComponent extends Component {
  state = {
    rating: {},
  };
  componentDidMount() {
    const { team } = this.props;
    team.map((member) => {
      let { rating } = this.state;
      rating[member._id] = 0;
      this.setState({ rating });
    });
  }
  handleChange(userId, ratingValue) {
    console.log(userId);
    const { rating } = this.state;
    rating[userId] = ratingValue;
    console.log(rating);
    this.setState({ rating });
  }
  renderFeedback(memberId) {
    let { rating } = this.state;
    return (
      <Box component="fieldset" mb={5} borderColor="transparent">
        <StyledRating
          name="customized-color"
          getLabelText={(value) => `${value} Heart${value !== 1 ? "s" : ""}`}
          onChange={(event, newValue) => {
            console.log(memberId);
            this.handleChange(memberId, newValue * 2);
            //   console.log(rating, rating);
          }}
          precision={0.5}
          icon={<FavoriteIcon fontSize="inherit" />}
        />
      </Box>
    );
  }
  render() {
    const { team } = this.props;
    console.log(this.state.rating);
    return (
      <>
        {team.map((member) => (
          <>
            <div>{member.name}</div>
            {this.renderFeedback(member._id)}
          </>
        ))}
        <Button
          onClick={() => {
            const { rating } = this.state;
            Object.keys(rating).map((rat) => {
              console.log(rat + " " + rating[rat]);
            });
          }}
        >
          Submit
        </Button>
      </>
    );
  }
}

export default RatingComponent;
