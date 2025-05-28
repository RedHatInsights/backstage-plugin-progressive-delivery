import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });
  
  const DialogContent = withStyles((theme) => ({
    root: {
      padding: theme.spacing(2),
    },
  }))(MuiDialogContent);

export const NodeInfoComponent = ({ nodeData, isPopupOpen, handleClose }: { nodeData: any, isPopupOpen: boolean, handleClose: any }, ) => {
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

  const CheckIsTest = ({ isTest }: { isTest: boolean }) => {
    if (!isTest) return;
    
    return <Typography>Job Type: TEST</Typography>
  }

  const DisplayNodeData = () => {
    return (
        <div>
            <CheckIsTest isTest={nodeData?.isTest} />
            <Typography>Commit Sha: {nodeData?.commit_sha || "N/A"}</Typography>
            <Typography>Cluster: {nodeData?.cluster}</Typography>
            <Typography>Namespace: {nodeData?.namespace}</Typography>
            <Typography>Deployment State: {nodeData?.deployment_state}</Typography>
            <Typography>Saas: {nodeData?.saas}</Typography>
        </div>
    )
  }

  if (!isPopupOpen) {
    return null;
  }

  return (
    <div>
        <Dialog onClose={handleCloseEvent} aria-labelledby="customized-dialog-title" open={open}>
            <DialogTitle id="customized-dialog-title" onClose={handleCloseEvent}>
                {nodeData?.resourceTemplate}
            </DialogTitle>
            <DialogContent dividers>
                <DisplayNodeData />
            </DialogContent>
        </Dialog>
    </div>
  );
}