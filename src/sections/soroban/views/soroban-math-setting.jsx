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

const levelParents = [
    { id: 1, value: "Không công thức" },
    { id: 2, value: "Anh bạn nhỏ cộng" },
    { id: 3, value: "Anh bạn nhỏ trừ" },
    { id: 4, value: "Anh bạn lớn cộng" },
    { id: 5, value: "Anh bạn thân cộng" },
    { id: 6, value: "Anh bạn lớn trừ" },
    { id: 7, value: "Anh bạn thân trừ" },
];

export function SorobanSettingView() {
    const [exercises, setExercises] = useState([]);
    // finger_math
    const profileLocalStorage = getProfileFromLS()
    const congfigSorobanMath = profileLocalStorage?.soroban_math
    const children = levelChilds.find(item => item.idParent === congfigSorobanMath?.keyParent)?.children
    const [parentId, setParentId] = React.useState(congfigSorobanMath?.keyParent); // 

    const [childId, setChildId] = React.useState(congfigSorobanMath?.keyLesson); // 
    const [levelChild, setLevelChild] = React.useState(children)
  
    const [numberQuestion, setNumberQuestion] = useState(congfigSorobanMath?.numberQuestion) // số câu hỏi
    const [calculationLength, setCalculationLength] = useState(congfigSorobanMath?.calculationLength) // độ dài phép tính
    const [timePerCalculation, setTimePerCalculation] = React.useState(congfigSorobanMath?.timePerCalculation); // thời gian mỗi phép tính
    const [timeAnswer, setTimeAnswer] = React.useState(congfigSorobanMath?.timeAnswer); // thời gian trả lời
    const [firstNumber, setFirstNumber] = React.useState(congfigSorobanMath?.firstNumber); // số hạng thứ 1
    const [secondNumber, setSecondNumber] = React.useState(congfigSorobanMath?.secondNumber); // số hạng thứ 2
    const [soundEnabled, setSoundEnabled] = React.useState(congfigSorobanMath?.soundEnabled);
    const [rangeResult, setRangeResult] = React.useState(congfigSorobanMath?.rangeResult);
    const [displayStyle, setDisplayStyle] = React.useState(congfigSorobanMath?.displayStyle);
    const [allowExceed, setAllowExceed] = React.useState(congfigSorobanMath?.allowExceed);
    const [openPDFDrawer, setOpenPDFDrawer] = useState(false);

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
                count: congfigSorobanMath?.calculationLength,
                main: congfigSorobanMath?.keyLesson,
                digits1:congfigSorobanMath?.firstNumber,
                digits2: congfigSorobanMath?.secondNumber,
                allowExceed: congfigSorobanMath?.allowExceed === 1 ? "yes" : "no",
                number: congfigSorobanMath?.numberQuestion,
            });
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
                mathTypeId: 2,
                mathTypeName: "soroban",
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
                allowExceed
            };
           
            updateConfigMathMutation.mutate({...param, id: "123"},{
                    onSuccess: (response) => {
                        profileLocalStorage.soroban_math = param;
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
            return [{ value: "9", label: "9" }];
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

    useEffect(() => {
    // Nếu chưa có childId thì bỏ qua
        if (!childId) return;

        const max = Math.max(Number(firstNumber) || 0, Number(secondNumber) || 0) || 1;
        let newRangeResult = rangeResult; // giữ giá trị cũ nếu không thay đổi

        // Trường hợp đặc biệt: idChild === 4
        if (childId === 4) {
            newRangeResult = "4".repeat(max);
        }
        // Trường hợp idChild === 5 → 9
        else if ([5, 6, 7, 8, 9].includes(childId)) {
            newRangeResult = "9".repeat(max);
        }

        // Nếu giá trị mới khác với hiện tại thì cập nhật
        if (newRangeResult !== rangeResult) {
            setRangeResult(newRangeResult);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [firstNumber, secondNumber, childId]);

    useEffect(() => {
        if (!rangeResult || !options?.length) return;

        // Nếu chỉ có 1 lựa chọn => luôn là 0
        if (options.length === 1) {
            setAllowExceed(0);
            return;
        }

        // Tìm độ dài lớn nhất / nhỏ nhất trong danh sách options
        const maxLength = Math.max(...options.map(o => o.value.length));
        const minLength = Math.min(...options.map(o => o.value.length));

        // Nếu người dùng chọn giá trị có độ dài lớn nhất => 1
        if (rangeResult.length === maxLength) {
            setAllowExceed(1);
        } 
        // Nếu chọn giá trị ngắn hơn => 0
        else if (rangeResult.length === minLength) {
            setAllowExceed(0);
        }
    }, [rangeResult, options]);


    

    const handleChange = (e) => {
        setRangeResult(e.target.value);
    };

    
    

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
                        { value: 2, label: "2" },
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
                        { value: 3, label: "3" },
                        { value: 4, label: "4" },
                        { value: 5, label: "5" },
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
                        { value: 3, label: "3" },
                        { value: 4, label: "4" },
                        { value: 5, label: "5" },
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

                {/* <Grid item xs={12} md={6}>
                    <Box sx={{ minWidth: 120 }}>
                        <Typography variant="h6" sx={{ marginTop: 2 }}>
                            Phạm vi kết quả: {rangeResult}
                        </Typography>
                    </Box>
                </Grid> */}

                <Grid item xs={12} md={6}>
                    <Box sx={{ minWidth: 120 }}>
                        <Box sx={{ display: "flex", alignItems: "center", pt: "10px" }}>
                        <FormLabel component="legend">Phạm vi kết quả:</FormLabel>
                        </Box>
                        <Box margin="normal" sx={{ display: "flex", alignItems: "center" }}>
                        <RadioGroup
                            row
                            value={rangeResult}
                            onChange={handleChange}
                        >
                            {options.map((opt) => (
                                <FormControlLabel
                                key={opt.value}
                                value={opt.value}
                                control={<Radio />}
                                label={opt.label}
                                />
                            ))}
                        </RadioGroup>
                        </Box>
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

                {/* <Grid item xs={12} md={6}>
                    <Box sx={{ minWidth: 120 }}>
                        <Box>
                            <Button variant="contained" color="primary" sx={{mt:2}} onClick={saveConfig}>
                                Lưu thiết lập
                            </Button>
                            {formError && <Typography color="error" sx={{ mt: 2 }}>{formError}</Typography>}
                        </Box>
                    </Box>
                </Grid> */}

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
                            onClick={() => setOpenPDFDrawer(true)}
                            fullWidth
                        >
                            Tạo đề
                        </Button>
                        <MathPDFDrawer
                            open={openPDFDrawer}
                            onClose={() => setOpenPDFDrawer(false)}
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

