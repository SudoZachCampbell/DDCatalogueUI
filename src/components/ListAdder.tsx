import React, { useState, useEffect } from 'react';
import { Box, IconButton, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@material-ui/core';
import { SaveTwoTone as SaveIcon, CancelTwoTone as CancelIcon } from '@material-ui/icons';
import { AddCircleTwoTone as AddIcon } from '@material-ui/icons';
import { DeleteTwoTone as DeleteIcon } from '@material-ui/icons';
import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            maxWidth: 360,
            backgroundColor: theme.palette.background.paper,
        },
        paper: {
            width: '80%',
            maxHeight: 435,
        },
    }),
);

export interface Change {
    add: {
        [index: string]: {
            index: string,
            value: string
        }
    },
    replace: {
        [index: string]: {
            index: string,
            value: string
        }
    },
    remove: {
        [index: string]: { index: string }
    }
}

export function ListAdder(props: { label: string, items: string[], saveField: Function, toggleEdit: Function }) {
    interface List {
        index: number,
        value: string,
        state: State
    }
    const [list, setList] = useState<List[]>([])
    const [changes, setChanges] = useState<Change>({ add: {}, replace: {}, remove: {} })
    const [deleteIndex, setDeleteIndex] = useState(-1);

    const classes = useStyles();

    enum State {
        NoChange,
        Added,
        Edited,
        Removed
    }

    useEffect(() => {
        const newList = props.items.map((value, index) => {
            return {
                index,
                value,
                state: State.NoChange
            }
        })
        setList(newList);
    }, [])

    const addField = () => {
        let newList = [...list, { index: list.length + 1, value: '', state: State.Added }]
        console.log("New List: ", newList);
        setList(() => {
            const index: string = JSON.stringify(list.length);
            changes.add[index] = { index, value: '' }
            setChanges(changes);
            return newList;
        });
    }

    const editField = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (list) {
            const text = event.target.value;
            let newList = [...list];
            newList[index].value = text;
            setList(() => {
                const indexString = JSON.stringify(index);
                changes[changes.add[indexString] ? 'add' : 'replace'][indexString] = { index: indexString, value: text }
                setChanges(changes);
                return newList
            });
        }
    }

    const removeField = () => {
        if (list) {
            setList(() => {
                const indexString = JSON.stringify(deleteIndex);
                if (changes.add[indexString]) {
                    delete list[deleteIndex]
                    delete changes.add[indexString]
                } else {
                    list[deleteIndex].state = State.Removed
                    changes.remove[indexString] = { index: indexString }
                }
                setChanges(changes);
                return list
            });
        }
    }

    const openDeleteDialog = (index: number) => {
        setDeleteIndex(index)
    }

    const handleDeleteClose = (deleteItem: boolean) => {
        if (deleteItem) {
            removeField();
        }
        setDeleteIndex(-1)
    }

    const saveField = () => {
        props.saveField(changes);
    }

    const toggleEdit = () => {
        props.toggleEdit();
    }

    const listArea = (
        <Box>
            {list?.map((item, index) => {
                if (item.state !== State.Removed) {
                    return (<Box key={index} display='flex'>
                        <IconButton onClick={() => openDeleteDialog(index)}>
                            <DeleteIcon />
                        </IconButton>
                        <TextField fullWidth value={item.value} multiline={true} onChange={(event: React.ChangeEvent<HTMLInputElement>) => editField(event, index)} />
                    </Box>
                    )
                }
            })}
            <Box display='flex' justifyContent='flex-end'>
                <IconButton onClick={addField}>
                    <AddIcon />
                </IconButton>
            </Box>
            <IconButton onClick={toggleEdit}>
                <CancelIcon />
            </IconButton>
            <IconButton onClick={saveField}>
                <SaveIcon />
            </IconButton>
            <ConfirmationDialogRaw
                classes={{
                    paper: classes.paper,
                }}
                id="delete-confirm"
                keepMounted
                open={deleteIndex !== -1}
                onClose={handleDeleteClose}
                title={props.label}
                value={deleteIndex}
            />
        </Box>
    )

    return listArea;
}

export interface ConfirmationDialogRawProps {
    classes: Record<'paper', string>;
    id: string;
    keepMounted: boolean;
    title: string;
    open: boolean;
    value: number;
    onClose: (deleteItem: boolean) => void;
}

function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
    const radioGroupRef = React.useRef<HTMLElement>(null);

    const handleEntering = () => {
        if (radioGroupRef.current != null) {
            radioGroupRef.current.focus();
        }
    };

    const handleCancel = () => {
        props.onClose(false);
    };

    const handleOk = () => {
        props.onClose(true);
    };

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            maxWidth="xs"
            onEntering={handleEntering}
            aria-labelledby="confirmation-dialog-title"
            open={props.open}
        >
            <DialogTitle id="confirmation-dialog-title">Delete Item</DialogTitle>
            <DialogContent dividers>
                <Typography>Are you sure you want to delete this {props.title}?</Typography>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel} color="primary">
                    Cancel
          </Button>
                <Button onClick={handleOk} color="primary">
                    Ok
          </Button>
            </DialogActions>
        </Dialog>
    );
}
