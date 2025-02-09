/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 */

import React, { SyntheticEvent, useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import secureIcon from '../../../assets/secure.png';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircle from '@mui/icons-material/CheckCircle';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ContainerCard from '../../common/ContainerCard';
import { useAppSelector, useAppDispatch } from '../../../hooks';
import { IResponse } from '../../../../types/interfaces';
import { setConnectionArgs, setConnectionStatus, setConnectionValidationDetails, setHost, setPort,
               setUser, setPassword, setJobStatement, setSecure, setSecureOptions, selectConnectionArgs, setAcceptCertificates, selectConnectionStatus, selectConnectionSecure, selectConnectionValidationDetails, selectAcceptCertificates} from './connectionSlice';
import { setLoading, setNextStepEnabled, selectZoweCLIVersion } from '../../configuration-wizard/wizardSlice';
import { Container } from "@mui/material";
import { alertEmitter } from "../../Header";

const Connection = () => {

  const dispatch = useAppDispatch();
  const zoweCLIVersion = useAppSelector(selectZoweCLIVersion);
  const [expanded, setExpanded] = React.useState<string | false>('FTPConn');

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const connectionStatus = useAppSelector(selectConnectionStatus);

  useEffect(() => {
    connectionStatus ? dispatch(setNextStepEnabled(true)) : dispatch(setNextStepEnabled(false));
  }, []);

  return (
    <ContainerCard 
      title="Connection" 
      description="Specify connection details to your z/OS mainframe." 
      onSubmit={(e: SyntheticEvent) => e.preventDefault()} 
      sx={{display: 'flex', flexDirection: 'column', height: '-webkit-fill-available'}}
    >
      {zoweCLIVersion 
      ? <React.Fragment>
        <Accordion expanded={expanded === 'FTPConn'} onChange={handleChange('FTPConn')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id="ftp-conn-header">
            <Typography>Connect with FTP</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FTPConnectionForm/>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded === 'CLIConn'} onChange={handleChange('CLIConn')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} id="cli-conn-header">
            <Typography>Connect with Zowe CLI</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <CLIConnectionForm zoweCLIVersion={zoweCLIVersion}/>
          </AccordionDetails>
        </Accordion>
      </React.Fragment>
      : <FTPConnectionForm/>} 
    </ContainerCard>
  )
};

const CLIConnectionForm = ({zoweCLIVersion}: {zoweCLIVersion: string}) => {
  return (
    <Typography variant="body2" display="block" style={{whiteSpace: 'pre-wrap'}}>
      {`<Not implemented yet>

Found Zowe CLI ${zoweCLIVersion}It can be used as a provider to install Zowe Server side components 
<List available profiles there with hosts>`
      }
    </Typography>
  );
}

const FTPConnectionForm = () => {

  const dispatch = useAppDispatch();
  
  const connectionStatus = useAppSelector(selectConnectionStatus);
  const connectionArgs = useAppSelector(selectConnectionArgs);
  const connValidationDetails = useAppSelector(selectConnectionValidationDetails);
  const [isFtpConnection, setIsFtpConnection] = useState(useAppSelector(selectConnectionSecure));
  const [isCertificateAccepted, setIsCertificateAccepted] = useState(useAppSelector(selectAcceptCertificates));

  const [formProcessed, toggleFormProcessed] = React.useState(false);
  const [validationDetails, setValidationDetails] = React.useState('');
  
  const handleFormChange = (ftpConnection?:boolean, acceptCerts?:boolean) => {
    dispatch(setConnectionStatus(false));
    dispatch(setNextStepEnabled(false));
  }

  const processForm = () => {
    if(connectionStatus) {
      toggleFormProcessed(true);
      setValidationDetails(connValidationDetails);
    }
    alertEmitter.emit('hideAlert');
    dispatch(setLoading(true));
    window.electron.ipcRenderer
      .connectionButtonOnClick(connectionArgs)
      .then((res: IResponse) => {
        dispatch(setConnectionStatus(res.status));
        if(res.status) {
          dispatch(setNextStepEnabled(true));
        }
        toggleFormProcessed(true);
        setValidationDetails(res.details);
        dispatch(setConnectionValidationDetails(res.details));
        dispatch(setLoading(false));
      }); 
  };

  return (
    <Box 
      onSubmit={(e: SyntheticEvent) => e.preventDefault()} 
      onChange={() => toggleFormProcessed(false)}
    >
      <FormControl>
        <TextField
          required
          id="standard-required"
          label="Host"
          variant="standard"
          helperText="Target z/OS system for Zowe's installation."
          value={connectionArgs.host}
          onChange={(e) => { dispatch(setHost(e.target.value)); handleFormChange(); }}
        />
      </FormControl>
      <FormControl>
        <TextField
          id="standard-number"
          label="FTP Port"
          type="number"
          InputLabelProps={{ shrink: true }}
          variant="standard"
          helperText="FTP port number. If not specified, Zen will try to use a default service port."
          value={connectionArgs.port}
    onChange={(e) => { dispatch(setPort(Number(e.target.value))); handleFormChange(); }}
        />
      </FormControl>
      <FormControl>
        <TextField
          required
          id="standard-required"
          label="User Name"
          variant="standard"
          helperText="Your z/OS user name or user ID."
          value={connectionArgs.user}
          onChange={(e) => { dispatch(setUser(e.target.value)); handleFormChange(); }}
        />
      </FormControl>
      <FormControl>
        <TextField
          required
          id="standard-password-input"
          label="Password"
          type="password"
          autoComplete="current-password"
          variant="standard"
          helperText={<span style={{display: 'flex', margin: 0}}>
              <img style={{width: '12px', height: '16px', paddingRight: '8px'}} src={secureIcon} alt="secure"/> 
              <span>Your password is securely stored for only the current session.</span>
            </span>}
          value={connectionArgs.password}
          onChange={(e) => { dispatch(setPassword(e.target.value)); handleFormChange(); }}
        />
      </FormControl>
      <FormControl>
        <Container sx={{display: "flex", justifyContent: "center", flexDirection: "row"}}>  
          <FormControlLabel
            control={<Checkbox 
              checked={isFtpConnection} 
              onChange={(e) => { 
                dispatch(setSecure(e.target.checked)); 
                handleFormChange(); 
                setIsFtpConnection(e.target.checked);
              }} 
            />}
            label="Use FTP over TLS."
            labelPlacement="start"
          />
        </Container>
      </FormControl>

      {connectionArgs.secure &&
      <Container sx={{
        borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem", borderBottomRightRadius: "1rem", borderBottomLeftRadius: "1rem",
        borderColor: "#aaaaaa", backgroundColor: "#f0f0f0", borderStyle: "solid", padding: "1rem"
      }}>
      <FormControl>
        <TextField
          id="standard-required"
          label="Min TLS"
          variant="standard"
          select={true}
          helperText="Minimum TLS version to accept from server."
          value={connectionArgs.secureOptions.minVersion}
          onChange={(e) => { dispatch(setSecureOptions({...connectionArgs.secureOptions, minVersion: e.target.value})); handleFormChange(); }} 

        >
          {/* TODO: This needs to be conditionally added, because older Zowe versions support 1.0-1.1 */}
          {/* <MenuItem value={"TLSv1"}>1.0</MenuItem>
          <MenuItem value={"TLSv1.1"}>1.1</MenuItem> */}
          <MenuItem value={"TLSv1.2"}>1.2</MenuItem>
          <MenuItem value={"TLSv1.3"}>1.3</MenuItem>
      </TextField>
      </FormControl>
      <FormControl>
        <TextField
          id="standard-required"
          label="Max TLS"
          variant="standard"
          select={true}
          helperText="Maximum TLS version to accept from server."
          value={connectionArgs.secureOptions.maxVersion}
          onChange={(e) => { dispatch(setSecureOptions({...connectionArgs.secureOptions, maxVersion: e.target.value})); handleFormChange(); }} 

        >
          {/* TODO: This needs to be conditionally added, because older Zowe versions support 1.0-1.1 */}
          {/* <MenuItem value={"TLSv1"}>1.0</MenuItem>
          <MenuItem value={"TLSv1.1"}>1.1</MenuItem> */}
          <MenuItem value={"TLSv1.2"}>1.2</MenuItem>
          <MenuItem value={"TLSv1.3"}>1.3</MenuItem>
        </TextField>
      </FormControl>

      <FormControl>
        <Container sx={{display: "flex", justifyContent: "center", flexDirection: "row"}}>
          <FormControlLabel
            control={<Checkbox  
                checked = {isCertificateAccepted} 
                onChange={(e) => { 
                  dispatch(setSecureOptions({...connectionArgs.secureOptions, rejectUnauthorized: !e.target.value}));
                  dispatch(setAcceptCertificates(e.target.checked));
                  handleFormChange(); 
                  setIsCertificateAccepted(e.target.checked);
                }}
              />
            }
            label="Accept all certificates."
            labelPlacement="start"
          />
        </Container>
      </FormControl>

      </Container>
      }
          
      <Container sx={{display: "flex", justifyContent: "center", flexDirection: "row", paddingTop: '12px', paddingBottom: '12px'}}>
        <Button sx={{boxShadow: 'none'}} type="submit" variant="text" onClick={() => processForm()}>Validate credentials</Button>
        <div>{connectionStatus && <CheckCircle sx={{ color: 'green', fontSize: '1rem', marginTop: '9px' }} />}</div>
        <div style={{opacity: formProcessed ? '1' : '0'}}>
          {!connectionStatus && (validationDetails && alertEmitter.emit('showAlert', validationDetails, 'error'))}
        </div>
      </Container>
    </Box>
  )
} 

export default Connection;

