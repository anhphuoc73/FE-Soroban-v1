// import React from 'react';
import React, { useEffect, useMemo, useState } from 'react';
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
import MathPDFDrawer from 'src/components/math/math-pdf-drawer';
import { CustomNumberInput } from 'src/components/custom-input/custom-number-input';
import { CustomFloatInput } from 'src/components/custom-input/custom-float-input';
import { CustomTextInput } from 'src/components/custom-input/custom-text-input';

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
    const [exercises, setExercises] = useState([]);
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

    const [fullname, setFullname] = React.useState(congfigFingerMath?.fullname);
    const [teachername, setTeachername] = React.useState(congfigFingerMath?.teachername);

    const [openPDFDrawer, setOpenPDFDrawer] = useState(false);

    const [formError, setFormError] = useState('');
    const [errorMessages, setErrorMessages] = useState({
        numberQuestion: '',
        calculationLength: '',
        timePerCalculation: '',
        timeAnswer: '',
        firstNumber: '',
        secondNumber: '',
        fullname: '',
        classname: '',      
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

    const createConfigMathListMutation = useMutation({
        mutationFn: ConfigMathApi.createPracticeFingerMathList,
        onSuccess: (data) => {
            const param = data?.data?.metadata
            setExercises(param);
        },
    });
    useEffect(() => {
        if (openPDFDrawer) {
            createConfigMathListMutation.mutate({
                count: congfigFingerMath?.calculationLength,
                main: congfigFingerMath?.keyLesson,
                digits1:congfigFingerMath?.firstNumber,
                digits2: congfigFingerMath?.secondNumber,
                allowExceed: "yes",
                number: congfigFingerMath?.numberQuestion,
            }); // Gọi API khi Drawer mở
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openPDFDrawer]);
    
    const saveConfig = () => {
        const newErrorMessages = {
            numberQuestion: '',
            calculationLength: '',
            timePerCalculation: '',
            timeAnswer: '',
            firstNumber: '',
            secondNumber: '',
            fullname: "", 
            teachername: "",
        };
    
        let isValid = true;

        if (!numberQuestion) {
            newErrorMessages.numberQuestion = 'Vui lòng nhập số câu hỏi.';
            isValid = false;
        }
        if (!calculationLength) {
            newErrorMessages.calculationLength = 'Vui lòng nhập độ dài phép tính.';
            isValid = false;
        }
        if (!timePerCalculation || Number(timePerCalculation) === 0) {
            newErrorMessages.timePerCalculation = 'Vui lòng nhập thời gian mỗi phép tính.';
            isValid = false;
        }
        if (!timeAnswer) {
            newErrorMessages.timeAnswer = 'Vui lòng nhập thời gian trả lời.';
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

        if (!fullname) {
            newErrorMessages.fullname = 'Vui lòng nhập họ và tên';
            isValid = false;
        }
        if (!teachername) {
            newErrorMessages.teachername = 'Vui lòng nhập tên giáo viên';
            isValid = false;
        }

        setErrorMessages(newErrorMessages);
        if (isValid) {
            const param = {
                mathTypeId: 1,
                mathTypeName: "finger",
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
                valueParent: levelParents.find(item => item.id === parentId)?.value,
                fullname,
                teachername, 
            };
            if(+firstNumber < +secondNumber){
               toast.error('Số hạng 1 phải lớn hơn hoặc bằng số hạng 2!', { duration: 3000 });
               return "";
            }
            updateConfigMathMutation.mutate({...param, id: "123"},{
                    onSuccess: (response) => {
                        profileLocalStorage.finger_math = param;
                        setProfileToLS(profileLocalStorage)
                        localStorage.removeItem('logFingerMath');
                        toast.success(response?.data?.message || 'Cập nhật cấu hình thành công', { duration: 2000 });
                    },
                    onError: (error) => {
                        toast.error(error?.data?.message || 'Có lỗi xảy ra', { duration: 2000 });
                    },
                }
            )
        }
    } 

    const options = useMemo(() => {
        const max = Math.max(Number(firstNumber) || 0, Number(secondNumber) || 0) || 1;

        // Nếu idChild === 4 => chỉ 1 lựa chọn: '4' lặp max lần
        if (childId === 4) {
            const value = "4".repeat(max);
            return [{ value, label: `${value}` }];
        }
        if(childId === 5 || childId === 6 || childId === 7 || childId === 8 || childId === 9){
            const value = "9".repeat(max);
            return [{ value, label: `${value}` }];
        }

        // Trường hợp bình thường
        if (max === 1) {
            return [{ value: "9", label: "1 chữ số (9)" }];
        }

        const firstValue = "9".repeat(max);
        const secondValue = "9".repeat(max + 1);

        return [
            { value: firstValue, label: `${firstValue}` },
            { value: secondValue, label: `${secondValue}` },
        ];
    }, [firstNumber, secondNumber, childId]);
    
    useEffect(() => {
        if (options?.length > 0) {
            // chỉ set lại nếu rangeResult chưa chọn hoặc không còn hợp lệ
            const exists = options.some(o => o.value === rangeResult);
            if (!exists) {
                setRangeResult(options[0].value);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options]);
    const handleOpenPDFDrawer = () => {
        if (+firstNumber < +secondNumber) {
            toast.error('Số hạng 1 phải lớn hơn hoặc bằng số hạng 2!', { duration: 3000 });
            return;
        }
        setOpenPDFDrawer(true);
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
                <CustomTextInput 
                    label="Họ và tên"
                    placeholder="Họ và tên"
                    value={fullname}
                    onChange={(e) => {
                        setFullname(e.target.value);
                        setErrorMessages((prev) => ({ ...prev, fullname: "" }));
                    }}
                    error={errorMessages.fullname}
                
                />
                <CustomTextInput 
                    label="Tên giáo viên"
                    placeholder="Tên giáo viên"
                    value={teachername}
                    onChange={(e) => {
                        setTeachername(e.target.value);
                        setErrorMessages((prev) => ({ ...prev, teachername: "" }));
                    }}
                    error={errorMessages.teachername}
                
                />
                <CustomNumberInput
                    label="Số câu hỏi"
                    placeholder="Số câu hỏi"
                    value={numberQuestion}
                    onChange={(e) => {
                        setNumberQuestion(e.target.value);
                        setErrorMessages((prev) => ({ ...prev, numberQuestion: "" }));
                    }}
                    error={errorMessages.numberQuestion}
                />

                <CustomNumberInput
                    label="Độ dài phép tính"
                    placeholder="Độ dài phép tính"
                    value={calculationLength}
                    onChange={(e) => {
                        setCalculationLength(e.target.value);
                        setErrorMessages((prev) => ({ ...prev, calculationLength: "" }));
                    }}
                    error={errorMessages.calculationLength}
                />

                <CustomFloatInput
                    label="Thời gian mỗi phép tính (giây)"
                    placeholder="Thời gian mỗi phép tính (giây)"
                    value={timePerCalculation}
                    onChange={(e) => {
                        setTimePerCalculation(e.target.value);
                        setErrorMessages((prev) => ({ ...prev, timePerCalculation: "" }));
                    }}
                    error={errorMessages.timePerCalculation}
                />

                <CustomNumberInput
                    label="Thời gian trả lời (giây)"
                    placeholder="Thời gian trả lời (giây)"
                    value={timeAnswer}
                    onChange={(e) => {
                        setTimeAnswer(e.target.value);
                        setErrorMessages((prev) => ({ ...prev, timeAnswer: "" }));
                    }}
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
                        {/* Nút Lưu thiết lập */}
                        <Box sx={{ minWidth: 120 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={saveConfig}
                            fullWidth
                        >
                            Lưu thiết lập
                        </Button>
                        {formError && (
                            <Typography color="error" sx={{ mt: 1 }}>
                            {formError}
                            </Typography>
                        )}
                        </Box>

                        {/* Nút Tạo đề */}
                        <Box sx={{ minWidth: 120 }}>
                        <Button
                            variant="contained"
                            sx={{ backgroundColor: "#1976d2" }}
                            onClick={handleOpenPDFDrawer}
                            fullWidth
                        >
                            Tạo đề
                        </Button>
                        <MathPDFDrawer
                            open={openPDFDrawer}
                            onClick={handleOpenPDFDrawer}
                            exercises={exercises}
                        />
                        </Box>
                    </Box>
                </Grid>          
                
            </Grid>  
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

