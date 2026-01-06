/* eslint-disable no-unsafe-optional-chaining */
import { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography, TextField, IconButton } from '@mui/material';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { ConfigMathApi } from 'src/apis/configMath-api';
import { Iconify } from 'src/components/iconify';
import { Timer } from '../../../components/math/timer';

import { ShowCaculatorAuto } from '../../../components/math/show-caculator-auto';
import { ResultMathView } from '../../../components/math/result';
import { getProfileFromLS } from '../../../utils/auth';
import ActionMath from '../../../components/math/action-math';
import ShowCalculatorIntervalAuto from '../../../components/math/show-caculator-interval-auto';
import { ensureItem, getItem, setItem } from '../../../utils/localStorage';
import { ResultDrawer } from '../../../components/math/result-drawer';
import { Anime } from '../../../components/math/anime';
import { ReportDrawer } from 'src/components/math/report-drawer';
import { Slogan } from 'src/components/math/slogan';
import ActionMathAuto from 'src/components/math/action-math-auto';


export function FingerMathPracticeAutoView() {
    const profileLocalStorage = getProfileFromLS()
    const configFingerMath = profileLocalStorage?.finger_math
    
    const timePerCalculation = +configFingerMath?.timePerCalculation * 1000
    

    const [logMath, setLogMath] = useState(getItem("logFingerMath") || [])
    const [logMathFinger, setLogMathFinger] = useState(getItem("logFingerMath") || [])

    const [idMath, setIdMath] = useState("");

    const [numberQuestion, setNumberQuestion] = useState(configFingerMath?.numberQuestion)
    const [soundEnabled, setSoundEnabled] = useState(configFingerMath?.soundEnabled)

    const [isDisabled, setIsDisabled] = useState(true);
    const [equal, setEqual] = useState(true);
    const [start, setStart] = useState(false);

    const [calculate, setCalculate] = useState(); 

    const [result, setResult] = useState([]);
    const [showNumber, setShowNumber] = useState(['']);
    const [resultEqua, setResultEqua] = useState(''); // kết quả nhập
    const [initialTime , setInitialTime ] = useState(0);
    const [caculation, setCaculation] = useState(configFingerMath?.caculation || 1)
    const [keyLesson, setKeyLession] = useState(configFingerMath?.keyLesson)
    
    const [open, setOpen] = useState(false);
    const [report, setReport] = useState(false);
    const [stringNumber, setStringNumber] = useState("")

    const [showAnime, setShowAnime] = useState(false);
    

    const [openResultDrawer, setOpenResultDrawer] = useState(false);
    const [resultSummary, setResultSummary] = useState({
        total: 0,
        correct: 0,
        wrong: 0,
    });

    const [infoReport, setInforReport] = useState({
        fullname: configFingerMath?.fullname,
        mathTypeName: "FingerMath",
        valueLesson: configFingerMath?.valueLesson,
        calculation:"+/-",
        timePerCalculation: configFingerMath?.timePerCalculation,
        firstNumber:configFingerMath?.firstNumber,
        secondNumber: configFingerMath?.secondNumber,
        numberQuestion: configFingerMath?.numberQuestion,
        calculationLength:configFingerMath?.calculationLength,
    })

    const createPracticeFingerMathMutation = useMutation({
        mutationFn: ConfigMathApi.createPracticeFingerMath
    })

    const createPracticeFingerMathListMutation = useMutation({
        mutationFn: ConfigMathApi.createPracticeFingerMathList
    })

    

    const savePracticeFingerMathMutation = useMutation({
        mutationFn: ConfigMathApi.savePracticeFingerMath
    })
    
    const handleCreateCalculation = () => {
        const param ={
            count: configFingerMath?.calculationLength,
            main: configFingerMath?.keyLesson,
            digits1:configFingerMath?.firstNumber,
            digits2: configFingerMath?.secondNumber,
            allowExceed: "no",
            number: configFingerMath?.numberQuestion,
        }

        createPracticeFingerMathListMutation.mutate({...param},{
                onSuccess: (response) => {
                    const arrExpression = response?.data?.metadata
                    const input = arrExpression
                    const PAUSE_COUNT = 3
                    const numbersWithSign = input.flatMap((subArr, index) => {
                        const sum = subArr.reduce((total, item) => total + Number(item), 0)
                        const isLast = index === input.length - 1
                        return [
                            ...subArr,
                            `=${sum}`,
                            ...(isLast ? [] : Array(PAUSE_COUNT).fill(" "))
                        ];
                    });

                    // const expression = response?.data?.metadata?.expression
                    // const resultExpression = response?.data?.metadata?.result;
                    // const numbersWithSign = expression.replace(/\s+/g, "").match(/[+-]?\d+/g);

                  
                    setStart(true)
                    if (!start) {
                        // setCalculate(resultExpression);
                        setResult([...numbersWithSign]);
                    }
                    // setInitialTime(configFingerMath?.timeAnswer);
                    // setStringNumber("");

                    // const batch = ensureItem("logFingerMath", []);
                    // // Tính id mới (nếu mảng rỗng thì id = 1)
                    // const newId = batch.length > 0 ? batch[batch.length - 1].id + 1 : 1;
                    // setIdMath(newId)
                    // lưu vào localStore
                    // const fingerMathLocalStoge = {
                    //     id: newId, 
                    //     expression, 
                    //     resultExpression, 
                    // };
                    // batch.push(fingerMathLocalStoge);
                    // // Lưu lại vào localStorage
                    // setItem("logFingerMath", batch);
                },
                onError: (error) => {
                    toast.error(error?.data?.message || 'Có lỗi xảy ra', { duration: 2000 });
                },
            }
        )
    }

    const playClapSoundIncorrect = () => {
        const clapSounds = [
            "/sound/correct/1.mp3",
            "/sound/correct/2.mp3",
        ];

        // 🎲 Chọn ngẫu nhiên 1 file trong mảng
        const randomIndex = Math.floor(Math.random() * clapSounds.length);
        const filePath = clapSounds[randomIndex];

        // 🎧 Phát âm thanh
        const audio = new Audio(filePath);
        audio.playbackRate = 1.2; // tốc độ phát nhanh gấp đôi

        audio.play().catch((err) => {
            console.error("Không phát được âm thanh:", err);
        });
        setShowAnime(true);
        setTimeout(() => {
            setShowAnime(false);
        }, 10000);
    }

    const playClapSoundWrong = () => {
        const clapSounds = [
            "/sound/wrong/1.mp3",
        ];
        const randomIndex = Math.floor(Math.random() * clapSounds.length);
        const filePath = clapSounds[randomIndex];
        const audio = new Audio(filePath);
        audio.playbackRate = 1.2; 
        audio.play().catch((err) => {
            console.error("Không phát được âm thanh:", err);
        });
    }

    const handleEqual = () => {
        let logFingerMath = []
        logFingerMath = getItem("logFingerMath")
        if (!equal) {
            if(+calculate === +resultEqua){
                logFingerMath = logFingerMath.map(item => {
                    if (item.id === idMath) {
                        return {
                            ...item,
                            inputResult: +resultEqua,
                            result: 1, 
                        };
                    }
                    return item;
                });
                if(initialTime > 0){
                    playClapSoundIncorrect()
                }
                console.log("Nhập kết quả đúng");
            }else{
                logFingerMath = logFingerMath.map(item => {
                    if (item.id === idMath) {
                        return {
                            ...item,
                            inputResult: +resultEqua,
                            result: 0, 
                        };
                    }
                    return item;
                });
                playClapSoundWrong();
                console.log("Nhập kết quả sai");
            }
            const updatedLogFingerMath = updateLogMathResult(logFingerMath, idMath, +resultEqua, +calculate);

            setItem("logFingerMath", logFingerMath);
            setLogMath(updatedLogFingerMath);
            setResultEqua('');
            setEqual(true); 
            setStart(false);
            if(+idMath >= +numberQuestion) {
                const math = logFingerMath
                savePracticeFingerMathMutation.mutate({...math},{
                        onSuccess: (response) => {
                            setResultSummary({
                                total: math.length,
                                correct: math.filter(item => item.result === 1).length,
                                wrong: math.filter(item => item.result === 0).length
                            });

                            // setOpenResultDrawer(true); // 👉 mở Drawer
                            setReport(true)
                        },
                    }
                )
            }
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
    const handleReport = () => {
        setReport(prev => !prev)
        setLogMathFinger(getItem("logFingerMath"))
    }

    const handleResetCreateCaculation = () => {
        setStart(false);
        setResult([]);
        setStringNumber("");
    }
    
    useEffect(() => {
        if (result.length > 0 && start) {
            let index = 0;
            const timer = setInterval(() => {
                if (index < result.length) {
                    setShowNumber([result[index]]);
                    index += 1;
                } else {
                    clearInterval(timer);
                    setEqual(false);
                }
                // 
            }, timePerCalculation);
            return () => clearInterval(timer);
        }
        return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [result, start])
    
    useEffect(() => {
        const batch = JSON.parse(localStorage.getItem("logFingerMath")) || [];
        if (batch.length >= numberQuestion) {
            // Nếu đã đủ số lượng bài toán
            const total = batch.length;
            const correct = batch.filter(x => x.result === 1).length;
            const wrong = batch.filter(x => x.result === 0 || x.result === undefined).length;

            setResultSummary({ total, correct, wrong });
            setOpenResultDrawer(true);
        } 
    }, [numberQuestion])

    useEffect(() => {
        if (showNumber !== '') {
            setStringNumber(prev => prev + showNumber[0]);
        }
    }, [showNumber])

    const inputRef = useRef(null);
    useEffect(() => {
        if (!equal && inputRef.current) {
            inputRef.current.focus();
        }
        setLogMathFinger(getItem("logFingerMath"));
    }, [equal])


    
    return (
        // numberQuestion, setNumberQuestion
        // logMath, setLogMath
        <Box sx={{display: 'flex',gap: 2}}>
            {/* <ResultMathView 
                numberQuestion={numberQuestion} 
                setNumberQuestion={setNumberQuestion} 
                logMath={logMath}
                setLogMath={setLogMath}
            /> */}
            
            <Box sx={{ display: 'flex',flex: 1,justifyContent: 'center',}}>
                <Box sx={{
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
                    <ShowCalculatorIntervalAuto showNumber={showNumber} timePerCalculation={timePerCalculation} soundEnabled={soundEnabled} caculation={caculation} keyLesson={keyLesson} />
                    
                    <ActionMathAuto
                        resultEqua={resultEqua}
                        handleOnchangeEqua={handleOnchangeEqua}
                        handleEqual={handleEqual}
                        handleCreateCalculation={handleCreateCalculation}
                        handleResetCreateCaculation={handleResetCreateCaculation}
                        handleNoti={handleNoti}
                        handleReport={handleReport}
                        equal={equal}
                        start={start}
                        infoReport={infoReport}
                    />
                </Box>

                {/* <Box
                    sx={{
                        position: "absolute",
                        left: { xs: 120, md: 200 },
                        top: { xs: 180, md: 200 },
                    }}
                    >
                    <Timer
                        initialTime={initialTime}
                        setInitialTime={setInitialTime}
                        equal={equal}
                        setEqual={setEqual}
                        start={start}
                        setStart={setStart}
                    />
                </Box> */}
                <Box
                    sx={{
                        position: "absolute",
                        right: { xs: 20, md: 40 }, // 👈 đổi từ left → right
                        top: { xs: 180, md: 200 },
                    }}
                    >
                    {/* <Slogan /> */}
                </Box>


                {showAnime && (
                    <Box
                    sx={{
                        position: "absolute",
                        bottom: "30%",
                        left: "20%",
                        transform: "translateX(-20%)",
                        opacity: 0,
                        animation: "fadeZoom 5s ease-in-out forwards", // tổng thời gian 5s
                        "@keyframes fadeZoom": {
                        "0%": {
                            opacity: 0,
                            transform: "translateY(30px) scale(0.5)", // nhỏ và mờ, từ dưới đi lên
                        },
                        "20%": {
                            opacity: 1,
                            transform: "translateY(0) scale(1.1)", // rõ và phóng to nhẹ
                        },
                        "50%": {
                            opacity: 1,
                            transform: "translateY(0) scale(1)", // đứng yên một lúc
                        },
                        "80%": {
                            opacity: 0.6,
                            transform: "translateY(-10px) scale(0.9)", // bắt đầu nhỏ lại
                        },
                        "100%": {
                            opacity: 0,
                            transform: "translateY(-20px) scale(0.7)", // nhỏ dần rồi biến mất
                        },
                        },
                    }}
                    >
                        <Anime />
                    </Box>
                )}
                
            </Box> 

           
            <ShowCaculatorAuto open={open} setOpen={setOpen} stringNumber={stringNumber} soundEnabled={soundEnabled} />

            {/* <ReportDrawer 
                report={report}              
                setReport={setReport}
                content = {logMathFinger} 
                infoReport={infoReport} 
                setLogMath={setLogMath}
                logMath={logMath}
                numberQuestion={numberQuestion}
                caculation={caculation}
                keyLesson={keyLesson} 
            /> */}
            
            {/* <ResultDrawer
                open={openResultDrawer}
                // onClose={() => setOpenResultDrawer(false)}
                onClose={() => {
                    setOpenResultDrawer(false);

                    // Xóa localStorage sau khi đã hiển thị kết quả
                    localStorage.removeItem("logFingerMath");

                    // Reset state
                    setLogMath([]);
                    setIdMath("");
                    setResult([]);
                    setShowNumber("");
                    setStringNumber("");
                }}
                total={resultSummary.total}
                correct={resultSummary.correct}
                wrong={resultSummary.wrong}
                data={logMath}
            /> */}
              
        </Box>
        

        
    );
}

// eslint-disable-next-line arrow-body-style
const updateLogMathResult = (logArray, idMath, inputResult, calculate) => {
  return logArray.map(item => {
    if (item.id === idMath) {
      return {
        ...item,
        inputResult,
        result: +inputResult === +calculate ? 1 : 0
      };
    }
    return item;
  });
};

