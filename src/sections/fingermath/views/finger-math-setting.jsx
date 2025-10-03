// import React from 'react';
import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Typography,
    FormLabel,
    Grid,
} from '@mui/material';
import { CustomSelectBasic } from 'src/components/custome-select/custom-select-basic';
import { ConfigMathApi } from 'src/apis/configMath-api';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getProfileFromLS, setProfileToLS } from 'src/utils/auth';

const levelParents = [
    { id: 1, value: "Không công thức" },
    { id: 2, value: "Anh bạn nhỏ cộng" },
    { id: 3, value: "Anh bạn nhỏ trừ" },
    { id: 4, value: "Anh bạn lớn cộng" },
    { id: 5, value: "Anh bạn thân cộng" },
    { id: 6, value: "Anh bạn lớn trừ" },
    { id: 7, value: "Anh bạn thân trừ" },
];

export function FingerMathSettingView() {
    const profileLocalStorage = getProfileFromLS()
    const congfigFingerMath = profileLocalStorage?.finger_math
    const children = levelChilds.find(item => item.idParent === congfigFingerMath?.keyParent)?.children
    const [parentId, setParentId] = React.useState(congfigFingerMath?.keyParent); // 

    const [childId, setChildId] = React.useState(congfigFingerMath?.keyLesson); // 
    const [levelChild, setLevelChild] = React.useState(children)
  

    
    const [numberQuestion, setNumberQuestion] = useState(congfigFingerMath?.numberQuestion) // số câu hỏi
    
    const [calculationLength, setCalculationLength] = useState(congfigFingerMath?.calculationLength) // độ dài phép tính
    const [timePerCalculation, setTimePerCalculation] = React.useState(congfigFingerMath?.timePerCalculation); // thời gian mỗi phép tính
    const [timeAnswer, setTimeAnswer] = React.useState(congfigFingerMath?.timeAnswer); // thời gian trả lời
    const [firstNumber, setFirstNumber] = React.useState(congfigFingerMath?.firstNumber); // số hạng thứ 1
    const [secondNumber, setSecondNumber] = React.useState(congfigFingerMath?.secondNumber); // số hạng thứ 2
    const [soundEnabled, setSoundEnabled] = React.useState(congfigFingerMath?.soundEnabled);
    const [rangeResult, setRangeResult] = React.useState(congfigFingerMath?.rangeResult);
    const [displayStyle, setDisplayStyle] = React.useState(congfigFingerMath?.displayStyle);

    const [formError, setFormError] = useState('');
    const [errorMessages, setErrorMessages] = useState({
        numberQuestion: '',
        calculationLength: '',
        timePerCalculation: '',
        timeAnswer: '',
        firstNumber: '',
        secondNumber: ''
    });

    const handleLevelParentChange = (event) => {
        const idParent = event.target.value;
        setParentId(idParent)
        const selectedValue = levelParents.filter(item => item.id === idParent)[0];
        const selectedValueChildren = levelChilds.filter(item => item.idParent === idParent)[0].children;
        setLevelChild(selectedValueChildren)
        setChildId(selectedValueChildren[0].idChild)
    }
    const handleLevelChildChange = (event) => {
        const idChild = event.target.value;
        const selectedValue = levelChild.filter(item => item.idChild === idChild)[0];
        setChildId(selectedValue.idChild)
        if(selectedValue.idChild > 4){
            setRangeResult(99)
        }
        if(selectedValue.idChild === 4){
            if(firstNumber === 1 && secondNumber === 1){
                setRangeResult(4)
            }else{
                setRangeResult(44)
            }
        }
    }
    const handleFirstNumberChange = (event) => {
        setFirstNumber(event.target.value);
        if(event.target.value === 1 && secondNumber === 1){
            setRangeResult(4)
        }else{
            setRangeResult(44)
        }
    }
    const handleSecondNumberChange = (event) => {
        setSecondNumber(event.target.value);
        if(event.target.value === 1 && firstNumber === 1){
            setRangeResult(4)
        }else{
            setRangeResult(44)
        }
    }
    const handleDisplayStyle = (event) => {
        setDisplayStyle(event.target.value)
    }
  

    const updateConfigMathMutation = useMutation({
        mutationFn: ConfigMathApi.updateConfigFingerMath
    })

    const saveConfig = () => {
        const newErrorMessages = {
            numberQuestion: '',
            calculationLength: '',
            timePerCalculation: '',
            timeAnswer: '',
            firstNumber: '',
            secondNumber: ''
        };
    
        let isValid = true;

        if (!numberQuestion) {
            newErrorMessages.numberQuestion = 'Vui lòng chọn số câu hỏi.';
            isValid = false;
        }
        if (!calculationLength) {
            newErrorMessages.calculationLength = 'Vui lòng chọn độ dài phép tính.';
            isValid = false;
        }
        if (!timePerCalculation) {
            newErrorMessages.timePerCalculation = 'Vui lòng chọn thời gian mỗi phép tính.';
            isValid = false;
        }
        if (!timeAnswer) {
            newErrorMessages.timeAnswer = 'Vui lòng chọn thời gian trả lời.';
            isValid = false;
        }
        if (!firstNumber) {
            newErrorMessages.firstNumber = 'Vui lòng chọn số hạng 1.';
            isValid = false;
        }
        if (!secondNumber) {
            newErrorMessages.secondNumber = 'Vui lòng chọn số hạng 2.';
            isValid = false;
        }

        setErrorMessages(newErrorMessages);
        if (isValid) {
            const param = {
                numberQuestion,
                calculationLength,
                timePerCalculation,
                timeAnswer,
                firstNumber,
                secondNumber,
                keyLesson: childId,
                valueLesson: levelChild.find(item => item.idChild === childId)?.value,
                displayStyle,
                displayStyleName: displayStyle === 1 ? "chữ số" : displayStyle === 2 ? "bàn tay" : "",
                rangeResult,
                soundEnabled,
                soundEnabledName: soundEnabled === 1 ? "Có" : soundEnabled === 0 ? "Không" : "",
                keyParent: parentId,
                keyParentName: levelParents.find(item => item.id === parentId)?.value,
            };
            updateConfigMathMutation.mutate({...param, id: "123"},{
                    onSuccess: (response) => {
                        profileLocalStorage.finger_math = param;
                        setProfileToLS(profileLocalStorage)
                        toast.success(response?.data?.message || 'Cập nhật cấu hình thành công', { duration: 2000 });
                    },
                    onError: (error) => {
                        toast.error(error?.data?.message || 'Có lỗi xảy ra', { duration: 2000 });
                    },
                }
            )
        }
    } 

    
    

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: 3,
                width: '100%', // Chiều rộng full màn hình
                padding: 2,
            }}
        >
             <Grid container spacing={2}>
                <CustomSelectBasic
                    label="Số câu hỏi"
                    value={numberQuestion}
                    onChange={(e) => {
                        setNumberQuestion(e.target.value);
                        setErrorMessages((prev) => ({ ...prev, numberQuestion: "" }));
                    }}
                    options={[
                        { value: 2, label: "2" },
                        { value: 5, label: "5" },
                        { value: 10, label: "10" },
                        { value: 15, label: "15" },
                        { value: 20, label: "20" },
                    ]}
                    error={errorMessages.numberQuestion}
                />

                <CustomSelectBasic
                    label="Độ dài phép tính"
                    value={calculationLength}
                    onChange={(e) => {
                        setCalculationLength(e.target.value);
                        setErrorMessages((prev) => ({ ...prev, calculationLength: "" }));
                    }}
                    options={[
                        { value: 2, label: "2" },
                        { value: 3, label: "3" },
                        { value: 5, label: "5" },
                        { value: 10, label: "10" },
                        { value: 15, label: "15" },
                        { value: 20, label: "20" },
                    ]}
                    error={errorMessages.calculationLength}
                />

                <CustomSelectBasic
                    label="Thời gian mỗi phép tính (giây)"
                    value={timePerCalculation}
                    onChange={(e) => {
                        setTimePerCalculation(e.target.value);
                        setErrorMessages((prev) => ({ ...prev, timePerCalculation: "" }));
                    }}
                    options={[
                        { value: 1.0, label: "1.0" },
                        { value: 1.2, label: "1.2" },
                        { value: 14, label: "1.4" },
                        { value: 16, label: "1.6" },
                        { value: 1.8, label: "1.8" },
                        { value: 2.0, label: "2.0" },
                        { value: 2.2, label: "2.2" },
                        { value: 2.4, label: "2.4" },
                        { value: 2.6, label: "2.6" },
                        { value: 2.8, label: "2.8" },
                        { value: 3.0, label: "3.0" },
                    ]}
                    error={errorMessages.timePerCalculation}
                />

                <CustomSelectBasic
                    label="Thời gian trả lời (giây)"
                    value={timeAnswer}
                    onChange={(e) => {
                        setTimeAnswer(e.target.value);
                        setErrorMessages((prev) => ({ ...prev, timeAnswer: "" }));
                    }}
                    options={[
                        { value: 5, label: "5" },
                        { value: 10, label: "10" },
                        { value: 15, label: "15" },
                        { value: 20, label: "20" },
                    ]}
                    error={errorMessages.timeAnswer}
                />

                <CustomSelectBasic
                    label="Cấp độ cha"
                    value={parentId}
                    onChange={handleLevelParentChange}
                    options={levelParents.map(item => ({
                        value: item.id,
                        label: item.value,
                    }))}
                />

                <CustomSelectBasic
                    label="Cấp độ con"
                    value={childId}
                    onChange={handleLevelChildChange}
                    options={levelChild.map(item => ({
                        value: item.idChild,
                        label: item.value,
                    }))}
                />

                <CustomSelectBasic
                    label="Số hạng 1"
                    value={firstNumber}
                    onChange={(e) => {
                        setFirstNumber(e.target.value);
                        setErrorMessages((prev) => ({ ...prev, firstNumber: "" }));
                    }}
                    options={[
                        { value: 1, label: "1" },
                        { value: 2, label: "2" },
                    ]}
                    error={errorMessages.firstNumber}
                />

                <CustomSelectBasic
                    label="Số hạng 2"
                    value={secondNumber}
                    onChange={(e) => {
                        setSecondNumber(e.target.value);
                        setErrorMessages((prev) => ({ ...prev, secondNumber: "" }));
                    }}
                    options={[
                        { value: 1, label: "1" },
                        { value: 2, label: "2" },
                    ]}
                    error={errorMessages.secondNumber}
                />

                
                <CustomSelectBasic
                    label="Âm thanh"
                    value={soundEnabled}
                    onChange={(e) => {
                        setSoundEnabled(e.target.value);
                        setErrorMessages((prev) => ({ ...prev, soundEnabled: "" }));
                    }}
                    options={[
                        { value: 0, label: "Không" },
                        { value: 1, label: "Có" },
                    ]}
                    error={errorMessages.soundEnabled}
                />

                <Grid item xs={12} md={6}>
                    <Box sx={{ minWidth: 120 }}>
                        <Typography variant="h6" sx={{ marginTop: 2 }}>
                            Phạm vi kết quả: {rangeResult}
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box sx={{ minWidth: 120 }}>
                        <Box sx={{
                            display: "flex", alignItems:"center", pt:"10px"
                        }}>
                            <FormLabel component="legend">Cách hiện thị:</FormLabel>
                        </Box>
                        <Box margin="normal" sx={{display: "flex", alignItems:"center",}}>
                            <RadioGroup
                                row
                                value={displayStyle}
                                onChange={handleDisplayStyle}
                            >
                                <FormControlLabel value="1" control={<Radio />} label="Chữ số" />
                                <FormControlLabel value="2" control={<Radio />} label="Hình bàn tay" />
                            </RadioGroup>
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box sx={{ minWidth: 120 }}>
                        <Box>
                            <Button variant="contained" color="primary" sx={{mt:2}} onClick={saveConfig}>
                                Lưu thiết lập
                            </Button>
                            {formError && <Typography color="error" sx={{ mt: 2 }}>{formError}</Typography>}
                        </Box>
                    </Box>
                </Grid>

                

                
                
                

                                
                                
                
            </Grid>  

            {/* <Box sx={{ flexBasis: '50%', marginRight: 2 }}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="time-label">Số câu hỏi</InputLabel>
                    <Select
                        labelId="time-label"
                        value={numberQuestion}
                        onChange={(e) => {
                            SetNumberQuestion(e.target.value);
                            setErrorMessages({ ...errorMessages, numberQuestion: '' }); // Xóa lỗi khi người dùng thay đổi
                        }}
                        label="Số câu hỏi"
                    >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={15}>15</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                    </Select>
                    {errorMessages.numberQuestion && <Typography color="error">{errorMessages.numberQuestion}</Typography>}
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="time-label">Thời gian mỗi phép tính (giây)</InputLabel>
                    <Select
                        labelId="time-label"
                        value={timePerCalculation}
                        onChange={(e) => {
                            setTimePerCalculation(e.target.value);
                            setErrorMessages({ ...errorMessages, timePerCalculation: '' });
                        }}
                        label="Thời gian mỗi phép tính (giây)"
                    >
                        <MenuItem value={5}>5 giây</MenuItem>
                        <MenuItem value={10}>10 giây</MenuItem>
                        <MenuItem value={15}>15 giây</MenuItem>
                        <MenuItem value={20}>20 giây</MenuItem>
                    </Select>
                    {errorMessages.timePerCalculation && <Typography color="error">{errorMessages.timePerCalculation}</Typography>}
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="level-label">Cấp độ cha</InputLabel>
                    <Select
                        labelId="level-label"
                        value={levelParent.id}
                        onChange={handleLevelParentChange}
                        label="Cấp độ cha"
                    >
                        {levelParents.map((item) => (
                            <MenuItem key={item.id} value={item.id}>{item.value}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="level-label">Cấp độ con</InputLabel>
                    <Select
                        labelId="level-label"
                        value={childId}
                        onChange={handleLevelChildChange}
                        label="Cấp độ con"
                    >
                        {levelChild.map((item) => (
                            <MenuItem key={item.idChild} value={item.idChild}>{item.value}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Typography variant="h6" sx={{ marginTop: 2 }}>
                    Phạm vi kết quả: {rangeResult}
                </Typography>
            </Box>

            <Box sx={{ flexBasis: '50%', marginLeft: 2 }}>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="time-label">Độ dài phép tính</InputLabel>
                    <Select
                        labelId="time-label"
                        value={calculationLength}
                        onChange={(e) => SetCalculationLength(e.target.value)}
                        label="Độ dài phép tính"
                    >
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={15}>15</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                    </Select>
                </FormControl>
               
                <FormControl fullWidth margin="normal">
                    <InputLabel id="time-answer-label">Thời gian trả lời (giây)</InputLabel>
                    <Select
                        labelId="time-answer-label"
                        value={timeAnswer}
                        onChange={handleTimeAnswerChange}
                        label="Thời gian trả lời (giây)"
                    >
                        <MenuItem value={5}>5 giây</MenuItem>
                        <MenuItem value={10}>10 giây</MenuItem>
                        <MenuItem value={15}>15 giây</MenuItem>
                        <MenuItem value={20}>20 giây</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="first-number-label">Số hạng 1</InputLabel>
                    <Select
                        labelId="first-number-label"
                        value={firstNumber}
                        onChange={handleFirstNumberChange}
                        label="Số hạng 1"
                    >
                        {[...Array(3).keys()].map((number) => (
                            <MenuItem key={number + 1} value={number + 1}>
                                {number + 1}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                    <InputLabel id="second-number-label">Số hạng 2</InputLabel>
                    <Select
                        labelId="second-number-label"
                        value={secondNumber}
                        onChange={handleSecondNumberChange}
                        label="Số hạng 2"
                    >
                        {[...Array(5).keys()].map((number) => (
                            <MenuItem key={number + 1} value={number + 1}>
                                {number + 1}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box sx={{
                    display: "flex", alignItems:"center", pt:"10px"
                }}>
                    <FormLabel component="legend">Cách hiện thị:</FormLabel>
                </Box>
                <Box margin="normal" sx={{display: "flex", alignItems:"center",}}>
                    <RadioGroup
                        row
                        value={displayStyle}
                        onChange={handleDisplayStyle}
                    >
                        <FormControlLabel value="1" control={<Radio />} label="Chữ số" />
                        <FormControlLabel value="2" control={<Radio />} label="Hình bàn tay" />
                    </RadioGroup>
                </Box>
                <Box>
                    <Button variant="contained" color="primary" sx={{mt:2}} onClick={saveConfig}>
                        Lưu thiết lập
                    </Button>
                    {formError && <Typography color="error" sx={{ mt: 2 }}>{formError}</Typography>}
                </Box>
            </Box> */}
        </Box>
    );
}
const levelChilds = [
    {
        idParent: 1,
        children: [
            {
                idChild: 4,
                value: "Không công thức từ (0-4)"
            },
            {
                idChild: 5,
                value: "Không công thức từ (0-5)"
            },
            {
                idChild: 6,
                value: "Không công thức từ (0-6)"
            },
            {
                idChild: 7,
                value: "Không công thức từ (0-7)"
            },
            {
                idChild: 8,
                value: "Không công thức từ (0-8)"
            },
            {
                idChild: 9,
                value: "Không công thức từ (0-9)"
            }
        ]
    },
    {
        idParent: 2,
        children: [
            {
                idChild: 10,
                value: "Anh bạn nhỏ cộng 4"
            },
            {
                idChild: 11,
                value: "Anh bạn nhỏ cộng 3"
            },
            {
                idChild: 12 ,
                value: "Anh bạn nhỏ cộng 2"
            },
            {
                idChild: 13,
                value: "Anh bạn nhỏ cộng 1"
            },
        ]
    },
    {
        idParent: 3,
        children: [
            {
                idChild: 14,
                value: "Anh bạn nhỏ trừ 4"
            },
            {
                idChild: 15,
                value: "Anh bạn nhỏ trừ 3"
            },
            {
                idChild: 16 ,
                value: "Anh bạn nhỏ trừ 2"
            },
            {
                idChild: 17,
                value: "Anh bạn nhỏ trừ 1"
            },
        ]
    },
    {
        idParent: 4,
        children: [
            {
                idChild: 18,
                value: "Anh bạn lớn cộng 9"
            },
            {
                idChild: 19,
                value: "Anh bạn lớn cộng 8"
            },
            {
                idChild: 20 ,
                value: "Anh bạn lớn cộng 7"
            },
            {
                idChild: 21,
                value: "Anh bạn lớn cộng 6"
            },
            {
                idChild: 22,
                value: "Anh bạn lớn cộng 5"
            },
            {
                idChild: 23,
                value: "Anh bạn lớn cộng 4"
            },
            {
                idChild: 24 ,
                value: "Anh bạn lớn cộng 3"
            },
            {
                idChild: 25,
                value: "Anh bạn lớn cộng 2"
            },
            {
                idChild: 26,
                value: "Anh bạn lớn cộng 1"
            },
        ]
    },
    {
        idParent: 5,
        children: [
            {
                idChild: 27,
                value: "Anh bạn thân cộng 9"
            },
            {
                idChild: 28,
                value: "Anh bạn thân cộng 8"
            },
            {
                idChild: 29 ,
                value: "Anh bạn thân cộng 7"
            },
            {
                idChild: 30,
                value: "Anh bạn thân cộng 6"
            },
        ]
    },
    {
        idParent: 6,
        children: [
            {
                idChild: 31,
                value: "Anh bạn lớn trừ 9"
            },
            {
                idChild: 32,
                value: "Anh bạn lớn trừ 8"
            },
            {
                idChild: 33 ,
                value: "Anh bạn lớn trừ 7"
            },
            {
                idChild: 34,
                value: "Anh bạn lớn trừ 6"
            },
            {
                idChild: 35,
                value: "Anh bạn lớn trừ 5"
            },
            {
                idChild: 36,
                value: "Anh bạn lớn trừ 4"
            },
            {
                idChild: 37 ,
                value: "Anh bạn lớn trừ 3"
            },
            {
                idChild: 38,
                value: "Anh bạn lớn trừ 2"
            },
            {
                idChild: 39,
                value: "Anh bạn lớn trừ 1"
            },
        ]
    },
    {
        idParent: 7,
        children: [
            {
                idChild: 40,
                value: "Anh bạn thân trừ 9"
            },
            {
                idChild: 41,
                value: "Anh bạn thân trừ 8"
            },
            {
                idChild: 42 ,
                value: "Anh bạn thân trừ 7"
            },
            {
                idChild: 43,
                value: "Anh bạn thân trừ 6"
            },
        ]
    },
];

