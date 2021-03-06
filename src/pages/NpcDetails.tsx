import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { INpc, Field } from '../interfaces/Models';
import { Typography, Box, Button } from '@material-ui/core';
import BP from '../interfaces/Initialisations'
import { Type, getEntity } from '../api/dndDb';
import MonsterSummary from '../components/MonsterSummary'
import _ from 'lodash';
import { FieldType } from '../interfaces/Lookups';
import Details from '../layouts/Details';
import LocationMap from '../components/mapping/LocationMap';
import LocationAdder from '../components/mapping/LocationAdder';

const multiline: string[] = [
    "background"
]

const ignoreFields: string[] = [
    "picture",
    "monster",
    "locale",
    "building"
]

const include = [
    "Monster",
    "Building.Maps.Map",
    "Locale"
]

const fields: Field[] = [
    {
        name: "name",
        type: FieldType.String
    },
    {
        name: "background",
        type: FieldType.String
    },
    {
        name: "noteable_events",
        type: FieldType.Array
    },
    {
        name: "beliefs",
        type: FieldType.Array
    },
    {
        name: "passions",
        type: FieldType.Array
    },
    {
        name: "flaws",
        type: FieldType.Array
    }
]

export default function NpcDetails(props: { setPageName: Function, setPageBanner: Function }) {
    const [npc, setNpc] = useState<INpc>(BP.Npc);
    const [loading, setLoading] = useState<boolean>(true);
    const [editLocation, setEditLocation] = useState<boolean>(false);

    props.setPageName(npc.name);
    npc.picture && props.setPageBanner(`npc/${npc.picture}`);

    const { id } = useParams();

    const populateNpcData = async () => {
        const data = await getEntity<INpc>(Type.Npc, id, include);
        console.log(`NPC Details Data: `, data)
        setNpc(data);
        setLoading(false);
    }

    useEffect(() => {
        populateNpcData();
    }, [])

    const setLocation = npc => {
        setNpc(() => {
            setEditLocation(false);
            return npc
        });
    }

    const tabs = {
        headers: [
            'Monster',
            'Pictures',
            'Location'
        ],
        data: [
            <MonsterSummary instance={npc.monster} />,
            <Pictures />,
            npc.building?.maps && !editLocation ? (
                <Box p={1}>
                    <Button onClick={() => setEditLocation(true)}>Edit Location</Button>
                    <LocationMap map={npc.building.maps[0].map} iconName='arrow' data={[npc]} />
                </Box>)
                : <LocationAdder id={npc.id} type={Type.Npc} include={include} set={setLocation} building={npc.building} />
        ]
    }

    const detailProps = {
        id,
        entity: npc,
        type: Type.Npc,
        ignoreFields,
        multiline,
        include,
        tabs,
        fields
    }

    const display = <Details {...detailProps} />

    const loadingCheck = loading ?
        <Typography>Loading</Typography> :
        display

    return loadingCheck;
}

function Pictures(props) {
    return <Typography>Test Pictures</Typography>
}

function Location(props) {
    return <Typography>Test Location</Typography>
}