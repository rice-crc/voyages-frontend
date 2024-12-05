import React, { useState } from 'react';
import { Box, TextField, MenuItem, Button } from '@mui/material';
import { Input, TreeSelect } from 'antd';

interface ShipData {
    name: string;
    constructionPlace: string;
    registrationPlace: string;
    constructionYear: string;
    registrationYear: string;
    nationalCarrier: string;
    vesselSize: string;
    tonDefinition: string;
    gunsMounted: string;
    firstOwner: string;
    secondOwner: string;
    otherOwners: string;
    cargo: { type: string; unit: string; amount: string }[];
}


const ShipNationOwners: React.FC = () => {
    const [shipData, setShipData] = useState<ShipData>({
        name: '',
        constructionPlace: '',
        registrationPlace: '',
        constructionYear: '',
        registrationYear: '',
        nationalCarrier: '',
        vesselSize: '',
        tonDefinition: '',
        gunsMounted: '',
        firstOwner: '',
        secondOwner: '',
        otherOwners: '',
        cargo: [{ type: '', unit: '', amount: '' }],
    });

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setShipData({
            ...shipData,
            [event.target.name]: event.target.value,
        });
    };

    const handleTreeSelect = (
        field: 'constructionPlace' | 'registrationPlace',
        value: string
    ) => {
        setShipData({
            ...shipData,
            [field]: value,
        });
    };

    const handleCargoChange = (
        index: number,
        field: 'type' | 'unit' | 'amount',
        value: string
    ) => {
        setShipData({
            ...shipData,
            cargo: shipData.cargo.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            ),
        });
    };

    const handleAddCargo = () => {
        setShipData({
            ...shipData,
            cargo: [...shipData.cargo, { type: '', unit: '', amount: '' }],
        });
    };

    const handleDeleteCargo = (index: number) => {
        setShipData({
            ...shipData,
            cargo: shipData.cargo.filter((_, i) => i !== index),
        });
    };

    const treeData = [
        {
            title: 'Africa',
            value: 'Africa',
            children: [
                {
                    title: 'Senegalambia and offshore Atlantic',
                    value: 'Africa > Senegalambia and offshore Atlantic',
                    children: [
                        {
                            title: 'Albreda',
                            value: 'Africa > Senegalambia and offshore Atlantic > Albreda',
                        },
                    ],
                },
            ],
        },
    ];


    return (
        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ m: '10px 0' }}>
                <label htmlFor="name" style={{ fontWeight: 'bold' }}>Name of vessel:</label>
                <Input id="name" name="name" value={shipData.name} onChange={handleChange} />
            </Box>
            <label htmlFor="constructionPlace" style={{ fontWeight: 'bold' }}>Place where ship constructed:</label>
            <TreeSelect
                placeholder="Select place where ship constructed"
                value={shipData.constructionPlace}
                onChange={(value) => handleTreeSelect('constructionPlace', value)}
                treeData={treeData}
                treeDefaultExpandAll
            />
            <label htmlFor="registrationPlace" style={{ fontWeight: 'bold' }}>Place where ship registered:</label>
            <TreeSelect
                placeholder="Select place where ship registered"
                value={shipData.registrationPlace}
                onChange={(value) => handleTreeSelect('registrationPlace', value)}
                treeData={treeData}
                treeDefaultExpandAll
            />
            <Box sx={{ m: '10px 0' }}>
                <label htmlFor="name" style={{ fontWeight: 'bold' }}>Year of ship construction:</label>
                <Input id="constructionYear" name="constructionYear" value={shipData.constructionYear} onChange={handleChange} />
            </Box>

            <Box sx={{ m: '10px 0' }}>
                <label htmlFor="name" style={{ fontWeight: 'bold' }}>Year of ship registrationn:</label>
                <Input id="registrationYear" name="registrationYear" value={shipData.registrationYear} onChange={handleChange} />
            </Box>

            <TextField
                label="National carrier"
                name="nationalCarrier"
                value={shipData.nationalCarrier}
                onChange={handleChange}
                select
            >
                <MenuItem value="Denmark">Denmark</MenuItem>
            </TextField>
            <TextField
                label="Rig of vessel"
                name="vesselSize"
                value={shipData.vesselSize}
                onChange={handleChange}
            />
            <TextField
                label="Tonnage of vessel"
                name="tonDefinition"
                value={shipData.tonDefinition}
                onChange={handleChange}
            />
            <TextField
                label="Guns mounted"
                name="gunsMounted"
                value={shipData.gunsMounted}
                onChange={handleChange}
            />
            <TextField
                label="First or managing owner of venture"
                name="firstOwner"
                value={shipData.firstOwner}
                onChange={handleChange}
            />
            <TextField
                label="Second owner of venture"
                name="secondOwner"
                value={shipData.secondOwner}
                onChange={handleChange}
            />
            <TextField
                label="Other owners"
                name="otherOwners"
                value={shipData.otherOwners}
                onChange={handleChange}
            />
            <Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {shipData.cargo.map((item, index) => (
                        <Box key={index} sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Cargo Type"
                                name={`cargo[${index}].type`}
                                value={item.type}
                                onChange={(e) => handleCargoChange(index, 'type', e.target.value)}
                            />
                            <TextField
                                label="Unit"
                                name={`cargo[${index}].unit`}
                                value={item.unit}
                                onChange={(e) => handleCargoChange(index, 'unit', e.target.value)}
                            />
                            <TextField
                                label="Amount"
                                name={`cargo[${index}].amount`}
                                value={item.amount}
                                onChange={(e) => handleCargoChange(index, 'amount', e.target.value)}
                            />
                            <Button onClick={() => handleDeleteCargo(index)}>Delete</Button>
                        </Box>
                    ))}
                </Box>
                <Button onClick={handleAddCargo}>Add Cargo</Button>
            </Box>
        </Box>
    );
};

export default ShipNationOwners;