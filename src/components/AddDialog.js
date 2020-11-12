import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import history from './../history';
import { Tooltip } from 'antd';
import 'antd/dist/antd.css';
import { ShoppingTwoTone } from '@ant-design/icons';

export default function FormDialog() {

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
        <Tooltip title="Make Leaf">
            <ShoppingTwoTone style={{ fontSize: '22px', color: '#08c' }} label="Leaf"  onClick={handleClickOpen} /> {" "}
        </Tooltip>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Make Leaf</DialogTitle>
            <DialogContent>
            <DialogContentText>
                To make it leaf, add the Product to it.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button style={{ color: '#08c' }} onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button style={{ color: '#08c' }} onClick={() => history.push('/addproduct')} color="primary">
                Add Product
            </Button>
            </DialogActions>
        </Dialog>
    </div>
  );
}