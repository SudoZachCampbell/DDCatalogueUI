﻿import { useState } from 'react';
import * as React from 'react';
import * as _ from 'lodash';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import { makeStyles } from '@material-ui/styles'
import { ITableData } from '../interfaces/Models';
import Npc from './Npc';
import MonsterSummary from './MonsterSummary';

const useRowStyles = makeStyles({
    root: {
        '& > *': {
            borderBottom: 'unset',
        },
    },
});

export default function CollapsibleTable(props: ITableData) {
    return (
        <Grid item style={{margin: 'auto'}} xs={10}>
            <TableContainer  component={Paper}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow>
                            <TableCell key="Empty"></TableCell>
                            {props.dataSet.headers.map((header: string) => {
                                return <TableCell key={header}>{header}</TableCell>
                            })}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            props.dataSet.data.map((instance: { id: number }) => {
                                return <Row key={instance.id} component={props.component} instance={instance} />
                            })
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    );

}

function Row(props: { component: string, instance: { id: number } }) {
    const [open, setOpen] = useState<boolean>(false);
    const classes = useRowStyles();

    const types = {
        Npc: Npc,
        MonsterSummary: MonsterSummary
    }

    return (
        <>
            <TableRow className={classes.root}>
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                {
                    _.map(props.instance, (instanceData: string | number | boolean, key: string) => {
                        return <TableCell key={key}>{instanceData}</TableCell>
                    })
                }
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={Object.keys(props.instance).length + 1}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box>
                            {React.createElement(types[props.component], {id: props.instance.id}, null)}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    )
}