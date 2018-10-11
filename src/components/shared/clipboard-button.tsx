import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Button from "./button";

const POPUP_TIME = 300;

interface ClipboardBtnProps {
  text;
}

class ClipboardBtn extends React.Component<ClipboardBtnProps> {
  state = { popTimeout: undefined };

  render() {
    return (
      <CopyToClipboard
        text={this.props.text}
        onCopy={() => {
          window.clearTimeout(this.state.popTimeout);
          const popTimeout = window.setTimeout(
            () => this.setState({ popTimeout: undefined }),
            POPUP_TIME
          );
          this.setState({ popTimeout });
        }}
      >
        <Button className="clipboard-button">
          {!!this.state.popTimeout ? "Copied!" : this.props.children}
        </Button>
      </CopyToClipboard>
    );
  }
}

export default ClipboardBtn;
