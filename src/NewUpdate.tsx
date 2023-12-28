import { useEffect, useState } from 'react';
const { shell, ipcRenderer } = window.require('electron');
import { useTranslation } from 'react-i18next';
import React from 'react';
import { Snackbar, Alert, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const NewUpdate = () => {
    const { t } = useTranslation('translation', { keyPrefix: 'updateChecker' });
    const [updateArgs, setUpdateArgs] = useState<null | NewUpdateArgs>(null);
    const [snackbarOpen, setSnackbarOpen] = React.useState(true);
    const handleSnackbarClose = () => setSnackbarOpen(false);

    useEffect(() => {
        ipcRenderer.send('updateAvailable');

        ipcRenderer.on('updateAvailableResponse', (_event, args) => {
            setUpdateArgs(args);
            console.log('0gsafga')
            ipcRenderer.removeAllListeners('updateAvailableResponse');
        });
    }, []);

    const snackbarAction = (
        <React.Fragment>
          <Button color="secondary" size="small" onClick={() => shell.openExternal(updateArgs!.url!)}>
            {t('viewRelease')}
          </Button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleSnackbarClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
    );

    return (
        <div>
            {updateArgs && (
                <div>
                    <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={handleSnackbarClose} action={snackbarAction}>
                        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }} action={snackbarAction}>
                            {t('updateAvailable', { version: updateArgs.version })}
                        </Alert>
                    </Snackbar>
                </div>
            )}
        </div>
    );
};

export default NewUpdate;

interface NewUpdateArgs {
    version: string;
    url: string;
}