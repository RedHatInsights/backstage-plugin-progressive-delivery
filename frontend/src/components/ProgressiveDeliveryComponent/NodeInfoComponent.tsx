import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export const NodeInfoComponent = ({ isPopupOpen, handleClose }: { isPopupOpen: boolean, handleClose: any }, ) => {
  const [open, setOpen] = React.useState(true);

//   const handleClose = () => {
//     setIsPopupOpen(false);
//   };

const handleCloseEvent = (event) => {
    handleClose(event.target.value)
}

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (isPopupOpen) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [isPopupOpen]);

  if (!isPopupOpen) {
    return null;
  }

  return (
    <div>
      <Dialog
        open={isPopupOpen}
        onClose={handleCloseEvent}
        // scroll={body}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">Subscribe</DialogTitle>
        {/* <DialogContent dividers={scroll === 'paper'}> */}
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            {[...new Array(2)]
              .map(
                () => `Cras mattis consectetur purus sit amet fermentum.
Cras justo odio, dapibus ac facilisis in, egestas eget quam.
Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
Praesent commodo cursus magna, vel scelerisque nisl consectetur et.`,
              )
              .join('\n')}
          </DialogContentText>
        {/* </DialogContent> */}
        {/* <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions> */}
      </Dialog>
    </div>
  );
}
