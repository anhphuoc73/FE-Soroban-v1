import { useEffect, useState } from 'react';
import { Box, Button, Typography, TextField, IconButton } from '@mui/material';

import { Iconify } from 'src/components/iconify';
import { Timer } from './timer-test';
import { ShowCaculator } from './show-caculator';
import { ResultMathView } from '../../../components/math/result';


export function FingerMathPracticeView() {
    const expression = "1+2+3";
    const numbersWithSign = expression.match(/[-+]?\d+/g);
    const [isDisabled, setIsDisabled] = useState(true);
    const [equal, setEqual] = useState(true);
    const [start, setStart] = useState(false);
    const [calculate, setCalculate] = useState();
    const [result, setResult] = useState([]);
    const [showNumber, setShowNumber] = useState('');
    const [resultEqua, setResultEqua] = useState('');
    const [initialTime , setInitialTime ] = useState(0);
    const [open, setOpen] = useState(false);

    const [stringNumber, setStringNumber] = useState("")
    

    const handleCreateCalculation = () => {
        setStart(true)
        if (!start) {
            const calculatedResult = numbersWithSign.reduce((acc, num) => acc + (+num), 0);
            setCalculate(calculatedResult);
            setResult([...numbersWithSign, '=?']);
        }
        setInitialTime(5);
        setStringNumber("");
    }
    const handleEqual = () => {
        if (!equal) {
            if(+calculate === +resultEqua){
                console.log("Nhập kết quả đúng");
            }else{
                console.log("Nhập kết quả sai")
            }
            setResultEqua('');
            setEqual(true); 
            setStart(false);

        } else {
            console.log("Button is disabled");
        }
    }

    const handleOnchangeEqua = (e) => {
        setResultEqua(e.target.value)
    }

    const handleNoti = () => {
        setOpen(prev => !prev)
    }

    useEffect(() => {
        if (result.length > 0 && start) {
            let index = 0;
            const timer = setInterval(() => {
            if (index < result.length) {
                setShowNumber(result[index]);
                index += 1;
            } else {
                clearInterval(timer);
                setEqual(false);
            }
            }, 1000);

            return () => clearInterval(timer);
        }

        // Trường hợp else
        return () => {};
    }, [result, start]);

   

    useEffect(() => {
        if (showNumber !== '') {
            setStringNumber(prev => prev + showNumber);
        }
    }, [showNumber]);

    return (
        <Box sx={{
            display: 'flex', 
            gap: 2, 
            height: '100vh',        // Toàn màn hình cao 100%
            overflow: 'hidden'      // Ngăn scroll
        }}>
            <ResultMathView />
            
            <Box sx={{ display: 'flex',flex: 1,justifyContent: 'center',}}>
                <Box
                    sx={{
                        backgroundColor: 'white',
                        borderRadius: 2,
                        boxShadow: 3,
                        width: '100%', // Chiều rộng full màn hình
                        padding: 2,
                        alignItems: 'center',
                        textAlign: 'center',
                        position: "relative",
                        // backgroundImage: 'url("/assets/background/elephan.png")', // Đường dẫn đến hình ảnh
                        backgroundSize: 'cover', // Hình nền phủ kín
                        backgroundPosition: 'center', // Đặt hình ở giữa
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(255, 255, 255, 0.5)', // Màu phủ trắng với độ mờ 50%
                            borderRadius: 'inherit', // Đảm bảo cạnh tròn của Box
                        },
                    }}
                
                >
                    <Box
                        sx={{
                            height: "calc(100vh - 380px)",
                            border: '2px dashed rgb(5, 94, 39)',
                            borderRadius: 2,
                            padding: 2,
                            marginBottom: 2,
                            display: 'flex', // Sử dụng flex để căn giữa nội dung
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Typography
                            sx={{
                                flexGrow: 1,
                                fontSize: {
                                    xs: 80,   // mobile
                                    sm: 100,  // tablet
                                    md: 200,  // desktop trung bình
                                    lg: 300   // màn lớn
                                },
                                fontWeight: 500,
                                background:
                                'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                zIndex: 9999999
                            }}
                        >
                            {showNumber}
                        </Typography>
                    </Box>

                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        marginTop={4}
                        sx={{
                            flexDirection: { xs: 'column', md: 'row' }, // mobile: dọc, desktop: ngang
                            gap: 2
                        }}
                        >
                        {/* Ô nhập */}
                        <TextField
                            label="Trả lời"
                            variant="outlined"
                            type="number"
                            margin="normal"
                            value={resultEqua}
                            onChange={handleOnchangeEqua}
                            disabled={equal}
                            sx={{
                            zIndex: 9999999,
                            margin: { xs: '0 0 2px 0', md: '0 5px' },
                            textAlign: 'center',
                            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "success.dark"
                            },
                            "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "success.dark"
                            }
                            }}
                        />
                        <Box
                            display="flex"
                            flexDirection="row"
                        >
                            <IconButton onClick={handleEqual} disabled={equal} sx={{ zIndex: 9999999 }}>
                            <Iconify width={50} color="success.dark" icon="akar-icons:equal" />
                            </IconButton>
                            <IconButton onClick={handleCreateCalculation} disabled={start} sx={{ zIndex: 9999999 }}>
                            <Iconify width={50} color="success.dark" icon="carbon:next-outline" />
                            </IconButton>
                            <IconButton sx={{ zIndex: 9999999 }} onClick={handleNoti}>
                            <Iconify width={50} color="success.dark" icon="mynaui:notification-solid" />
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
                
                
                <Box sx={{
                    position:"absolute",
                    left: { xs: 130, md: 200 }, // mobile (xs) thì 50, desktop (md) thì 200
                    top: { xs: 180, md: 200 },  // mobile thì 50, desktop thì 200
                    
                }}>
                    <Timer initialTime={initialTime} setInitialTime={setInitialTime} equal={equal} setEqual={setEqual} start={start} setStart={setStart} />
                </Box>
            </Box> 

            <Box xs={{backgroundColor: "red"}}>
                <ShowCaculator open={open} setOpen={setOpen} stringNumber={stringNumber} />
            </Box> 
              
        </Box>
        

        
    );
}

