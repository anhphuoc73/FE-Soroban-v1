
import React from "react";
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import * as XLSX from "xlsx";
import { UserApi } from 'src/apis/user-api';
import {
  Drawer,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  Radio,
  Box
} from '@mui/material';
import { form } from "src/theme/core/components/form";

export default function UploadUserDrawerView() {
  const [formData, setFormData] = useState({
      centerName: '',
      centerId: '',
      adminName: '',
      fullname: '',
      phone: '',
      address: '',
      expiredDate: '',
      position: 3,
      birthDay: ""
    });
    const [openDrawer, setOpenDrawer] = React.useState(false);
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [user, setUser] = React.useState({});

    const handleOpen = () => setOpenDrawer(true);
    const handleClose = () => setOpenDrawer(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const addListUserMutation = useMutation({
        mutationFn: UserApi.createListUser
    });

  // Hàm xử lý tạo tài khoản
    const handleCreateAccounts = () => {
        if(!formData?.position){
          alert("Vui lòng chọn vai trò tài khoản");
          return;
        }
        
        if(formData?.position == 4 || formData?.position == 5){
          if(!formData?.centerId){
            alert("Vui lòng chọn trung tâm");
            return;
          }
        }
        if (!selectedFile) {
            alert("Vui lòng chọn file Excel trước!");
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: "array" });

            // Lấy sheet đầu tiên
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convert sheet → JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            const updatedData = jsonData.map(item => {
              const expiredDate = new Date();

              // +3 tháng
              expiredDate.setMonth(expiredDate.getMonth() + 3);

              // Set giờ 23:59:59
              expiredDate.setHours(23, 59, 59, 0);

              return {
                ...item,
                position: formData?.position,
                expiredDate: expiredDate.toISOString()
              };
            });
            addListUserMutation.mutate(updatedData, {
              onSuccess: (response) => {
                const message = response?.data?.message || 'Thêm danh sách tài khoản thành công'; 
                toast.success(message, { duration: 2000 });
              },
              onError: (error) => {
                const message = error?.response?.data?.message  || 'Thêm danh sách tài khoản thất bại'; 
                toast.error(message);
              }
            });

      

        
        };

        // đọc file excel
        reader.readAsArrayBuffer(selectedFile);
        };


    

    // const handleSubmit = () => {
    //     if (!validate()) return;

    //     addAdminMutation.mutate(formData, {
    //         onSuccess: (response) => {
    //         const message =   response?.data?.message || 'Thêm user thành công'; 
    //         toast.success(message, { duration: 2000 });
    //         },
    //         onError: (error) => {
    //         const message = error?.response?.data?.message  || 'Thêm user thất bại'; 
    //         toast.error(message);
    //         }
    //     });
    // };

  const handleChangeCenter = (event) => {
    setFormData((prev) => ({
      ...prev,
      centerId: event.target.value, 
    }));
  };

  const listUserCenterQuery = useQuery({
    queryKey: ['user-select-list-center'],
    queryFn: UserApi.getListUserCenter
  });

  const dataUserCenter = listUserCenterQuery?.data?.data?.metadata || [];


  return (
    <>
      <Button
        variant="contained"
        color="info"
        sx={{ mt: 3 }}
        onClick={handleOpen}
      >
        Thêm danh sách tài khoản
      </Button>

      <Drawer anchor="right" open={openDrawer} onClose={handleClose}>
        <Box sx={{ width: 350, p: 2 }}>
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel component="legend">Chọn vai trò</FormLabel>
            <RadioGroup
              row
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: parseInt(e.target.value, 10) })
              }
            >
              <FormControlLabel value={3} control={<Radio />} label="Trung tâm" />
              <FormControlLabel value={4} control={<Radio />} label="Giáo viên" />
              <FormControlLabel value={5} control={<Radio />} label="Học sinh" />
            </RadioGroup>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="school-select-label">Chọn trung tâm</InputLabel>
            <Select
              labelId="school-select-label"
              value={formData.centerId}
              label="Chọn trung tâm"
              onChange={handleChangeCenter}
              disabled={formData.position === 3} // disable khi là trung tâm
              sx={{
                "&.Mui-disabled .MuiSelect-select": {
                  backgroundColor: "#f5f5f5",  // nền xám nhạt
                  WebkitTextFillColor: "#666", // chữ sẫm hơn
                },
                "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#999", // viền đậm hơn
                },
              }}
            >
              {dataUserCenter.map((UserCenter) => (
                <MenuItem key={UserCenter.id} value={UserCenter.id}>
                  {UserCenter.centerName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="h6" sx={{ mb: 2 }}>
            
          </Typography>

          {/* Chọn file Excel */}
          <Button variant="contained" component="label" color="primary">
            Chọn file Excel
            <input
              hidden
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
            />
          </Button>

          {/* Hiển thị tên file */}
          {selectedFile && (
            <Typography sx={{ mt: 2, fontSize: 14, color: "green" }}>
              Đã chọn file: <strong>{selectedFile.name}</strong>
            </Typography>
          )}

          {/* Nút tạo tài khoản từ file */}
          <Button
            variant="contained"
            color="success"
            sx={{ mt: 3, width: "100%" }}
            disabled={!selectedFile}
            onClick={handleCreateAccounts}
          >
            Tạo tài khoản từ Excel
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
