
import { Box, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material'
import { Icon, ICON_NAME } from 'src/components/svg-color/index'
import Button from '@mui/material/Button'



import { useState, useCallback, useEffect } from 'react'
import Card from '@mui/material/Card'
import { formatDate } from 'src/utils/format-time'



import { useQuery } from '@tanstack/react-query'
import { UserApi } from 'src/apis/user-api'

import { getProfileFromLS } from '../../../utils/auth'

export function FilterUser({filters, setFilters}){
    const profile = getProfileFromLS();
    const positionAuth = profile?.position;
    const [position, setPosition] = useState('');
    const [centerId, setCenterId] = useState('');

    const handleChange = (event) => {
        const { value } = event.target; 
        setPosition(value);               
        setFilters((prev) => {
            const updated = { ...prev };
            if (value === "") { delete updated.position; } 
            else {  updated.position = value; }
            return updated;
        });
    };

    const listUserCenterQuery = useQuery({
        queryKey: ['user-select-list-center'],
        queryFn: UserApi.getListUserCenter,
        enabled: profile?.position === 2,
    });
    const dataUserCenter = listUserCenterQuery?.data?.data?.metadata || [];

    const handleChangeCenter = (event) => {
        const { value } = event.target; 
        setCenterId(value)
        setFilters((prev) => {
            const updated = { ...prev };
            if (value === "") { delete updated.centerId; } 
            else {  updated.centerId = value; }
            return updated;
        });
    }

    


    return (
        positionAuth === 2 || positionAuth === 3 ? (
            <Card 
                sx={{
                minHeight: '80px',
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                mb: 3
            }}>
                <Grid container spacing={2} sx={{ p: 3 }}>
                    <Grid item xs={6} md={3}>
                        <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Vai trò</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={position}
                                label="Vai trò"
                                onChange={handleChange}
                                >
                                <MenuItem value="">Tất cả</MenuItem>
                                {profile?.position === 2 && (
                                    <MenuItem value={3}>Trung tâm</MenuItem>
                                )}
                                <MenuItem value={4}>Giáo viên</MenuItem>
                                <MenuItem value={5}>Học viên</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>

                    {positionAuth === 2 && (
                        <Grid item xs={6} md={3}>
                            <Box sx={{ minWidth: 120 }}>
                                <FormControl fullWidth>
                                    <InputLabel id="school-select-label">Chọn trung tâm</InputLabel>
                                    <Select
                                        labelId="school-select-label"
                                        value={centerId || ""}
                                        onChange={handleChangeCenter}
                                        // disabled={formData.position === 4 || formData.position === 3} // chỉ enable khi position = 3
                                        label="Chọn trung tâm"
                                    >
                                        <MenuItem value="">Tất cả</MenuItem>
                                    {dataUserCenter.map((UserCenter) => (
                                        <MenuItem key={UserCenter.id} value={UserCenter.id}>
                                        {UserCenter.centerName}
                                        </MenuItem>
                                    ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Grid>
                    )}
                    

                    
                </Grid>
            </Card>
        ) : null
        
    )
}