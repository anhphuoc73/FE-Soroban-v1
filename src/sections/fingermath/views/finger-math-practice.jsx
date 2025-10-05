/* eslint-disable no-unsafe-optional-chaining */
import { useEffect, useRef, useState } from 'react';
import { Box, Button, Typography, TextField, IconButton } from '@mui/material';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { ConfigMathApi } from 'src/apis/configMath-api';
import { Iconify } from 'src/components/iconify';
import { Timer } from './timer';

import { ShowCaculator } from '../../../components/math/show-caculator';
import { ResultMathView } from '../../../components/math/result';
import { getProfileFromLS } from '../../../utils/auth';
import ActionMath from '../../../components/math/action-math';
import ShowCalculatorInterval from '../../../components/math/show-caculator-interval';
import { ensureItem, getItem, setItem } from '../../../utils/localStorage';
import { ResultDrawer } from '../../../components/math/result-drawer';
// import { use } from 'react';





export function FingerMathPracticeView() {
    const profileLocalStorage = getProfileFromLS()
    const congfigFingerMath = profileLocalStorage?.finger_math
    
    const timePerCalculation = +congfigFingerMath?.timePerCalculation * 1000
    

    const [logMath, setLogMath] = useState(getItem("logFingerMath") || [])

    const [idMath, setIdMath] = useState("");

    const [numberQuestion, setNumberQuestion] = useState(congfigFingerMath?.numberQuestion)

    const [isDisabled, setIsDisabled] = useState(true);
    const [equal, setEqual] = useState(true);
    const [start, setStart] = useState(false);

    const [calculate, setCalculate] = useState(); // kết quả đúng

    const [result, setResult] = useState([]);
    const [showNumber, setShowNumber] = useState('');
    const [resultEqua, setResultEqua] = useState(''); // kết quả nhập
    const [initialTime , setInitialTime ] = useState(0);
    const [open, setOpen] = useState(false);
    const [stringNumber, setStringNumber] = useState("")

    const [openResultDrawer, setOpenResultDrawer] = useState(false);
    const [resultSummary, setResultSummary] = useState({
        total: 0,
        correct: 0,
        wrong: 0,
    });

    const createPacticeFingerMathMutation = useMutation({
        mutationFn: ConfigMathApi.createPacticeFingerMath
    })

    const savePacticeFingerMathMutation = useMutation({
        mutationFn: ConfigMathApi.savePacticeFingerMath
    })

//   console.log("idMath", idMath)
    

    const handleCreateCalculation = () => {
        const param = {
            "count": congfigFingerMath?.calculationLength, 
            "main": congfigFingerMath?.keyLesson, 
            "digits1": congfigFingerMath?.firstNumber, 
            "digits2": congfigFingerMath?.firstNumber, 
            "allowExceed": "no" 
        }
        createPacticeFingerMathMutation.mutate({...param},{
                onSuccess: (response) => {
                    const expression = response?.data?.metadata?.expression 
                    const resultExpression = response?.data?.metadata?.result
                 
                    const numbersWithSign = expression.replace(/\s+/g, "").match(/[+-]?\d+/g);
                    
                    setStart(true)
                    if (!start) {
                        // const calculatedResult = numbersWithSign.reduce((acc, num) => acc + (+num), 0);
                        setCalculate(resultExpression);
                        setResult([...numbersWithSign, '=?']);
                    }
                    setInitialTime(congfigFingerMath?.timeAnswer);
                    setStringNumber("");

                    const batch = ensureItem("logFingerMath", []);
                    // Tính id mới (nếu mảng rỗng thì id = 1)
                    const newId = batch.length > 0 ? batch[batch.length - 1].id + 1 : 1;
                    setIdMath(newId)
                    // lưu vào localStore
                    const fingerMathLocalStoge = {
                        id: newId, 
                        expression, 
                        resultExpression, 
                    };
                    batch.push(fingerMathLocalStoge);
                    // Lưu lại vào localStorage
                    setItem("logFingerMath", batch);
                },
                onError: (error) => {
                    toast.error(error?.data?.message || 'Có lỗi xảy ra', { duration: 2000 });
                },
            }
        )

        
    }

    const playClapSound = () => {
        const clapSounds = [
            "/sound/correct/1.mp3",
            "/sound/correct/2.mp3",
        ];

        // 🎲 Chọn ngẫu nhiên 1 file trong mảng
        const randomIndex = Math.floor(Math.random() * clapSounds.length);
        const filePath = clapSounds[randomIndex];

        // 🎧 Phát âm thanh
        const audio = new Audio(filePath);
        audio.playbackRate = 2.0; // tốc độ phát nhanh gấp đôi

        audio.play().catch((err) => {
            console.error("Không phát được âm thanh:", err);
        });
    };
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
                playClapSound()
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
                console.log("Nhập kết quả sai");
            }
            const updatedLogFingerMath = updateLogMathResult(logFingerMath, idMath, +resultEqua, +calculate);


            setItem("logFingerMath", logFingerMath);
            setLogMath(updatedLogFingerMath);
            setResultEqua('');
            setEqual(true); 
            setStart(false);
            if(+idMath === +numberQuestion){
                // lưu db ==> chưa thực hiện
                const math = logFingerMath
                // setLogMath(math)
                savePacticeFingerMathMutation.mutate({...math},{
                        onSuccess: (response) => {
                            

                            setResultSummary({
                                total: math.length,
                                correct: math.filter(item => item.result === 1).length,
                                wrong: math.filter(item => item.result === 0).length
                            });

                            setOpenResultDrawer(true); // 👉 mở Drawer

                            // setItem("logFingerMath", []);
                            // setLogMath([]);

                            // ở đây nên có Modal hiện thị số câu hỏi đúng, số câu hỏi sai và câu hỏi không làm
                            // toast.success(`Bạn đã hoàn thành ${numberQuestion} bài tập`, { duration: 2000 });
                        },
                    }
                )
                
                // xóa toàn bộ bài tập trong localStorage
                
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

   // bắt đầu chạy bài toán
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
            }, timePerCalculation);

            return () => clearInterval(timer);
        }

        // Trường hợp else
        return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [result, start]);

    


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
    }, [numberQuestion]);


    useEffect(() => {
        if (showNumber !== '') {
            setStringNumber(prev => prev + showNumber);
        }
    }, [showNumber]);

    
    const inputRef = useRef(null);
    useEffect(() => {
        if (!equal && inputRef.current) {
            inputRef.current.focus();
        }
    }, [equal]);


    return (
        // numberQuestion, setNumberQuestion
        // logMath, setLogMath
        <Box sx={{display: 'flex',gap: 2}}>
            <ResultMathView 
                numberQuestion={numberQuestion} 
                setNumberQuestion={setNumberQuestion} 
                logMath={logMath}
                setLogMath={setLogMath}
            />
            
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
                    <ShowCalculatorInterval showNumber={showNumber} timePerCalculation={timePerCalculation} />
                    

                    <ActionMath
                        resultEqua={resultEqua}
                        handleOnchangeEqua={handleOnchangeEqua}
                        handleEqual={handleEqual}
                        handleCreateCalculation={handleCreateCalculation}
                        handleNoti={handleNoti}
                        equal={equal}
                        start={start}
                    />
                </Box>
                <Box sx={{
                    position:"absolute",
                    left: { xs: 120, md: 200 }, // mobile (xs) thì 50, desktop (md) thì 200
                    top: { xs: 180, md: 200 },  // mobile thì 50, desktop thì 200
                    
                }}>
                    <Timer initialTime={initialTime} setInitialTime={setInitialTime} equal={equal} setEqual={setEqual} start={start} setStart={setStart} />
                </Box>
            </Box> 

           

            <ShowCaculator open={open} setOpen={setOpen} stringNumber={stringNumber} />

            <ResultDrawer
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
            />
              
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

