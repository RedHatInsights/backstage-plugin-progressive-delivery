import React from 'react';
import { createStyles, makeStyles, withStyles } from '@material-ui/core/styles';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

const styles = (theme) => ({
    root: {
      margin: 0,
      padding: theme.spacing(2),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
});

// Grid styling
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginTop: "10px",
      flexGrow: 1,
    },
    button: {
      justifyContent: 'center'
    },
  }),
);

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
  const classes = useStyles();

  const config = useApi(configApiRef);
  const grafanaUrl = config.getString('grafana.dashboardUrl');

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

  const createLogsLink = (grafanaUrl: string, appName: string, cluster: string, targetRef: string, saasFilename: string) => {
      let identifier: string = "";

      if (cluster.substring(0,5) === "hivei") identifier = "integration";
      else if (cluster.substring(0,5) === "hives") identifier = "stage";

      const env: string = `osd-${identifier}-${cluster}`;
      const namespace: string = `${appName}-pipelines`

      return `${grafanaUrl}?var-namespace=${namespace}&var-targetref=${targetRef}&var-env=${env}&var-saasfilename=${saasFilename}`;
  }

  const DisplayNodeData = () => {
    return (
        <div className={classes.root}>
          <CheckIsTest isTest={nodeData?.isTest} />
          <Typography>Commit Sha: {nodeData?.commit_sha || "N/A"}</Typography>
          <Typography>Cluster: {nodeData?.cluster}</Typography>
          <Typography>Namespace: {nodeData?.namespace}</Typography>
          <Typography>Deployment State: {nodeData?.deployment_state}</Typography>
          <Typography>Saas: {nodeData?.saas}</Typography>

          <Box textAlign='center'>
            <Button href={createLogsLink(grafanaUrl, nodeData?.app, nodeData?.cluster, nodeData?.commit_sha, nodeData?.saas)} variant="contained" target="_blank">Logs</Button>
          </Box>
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
