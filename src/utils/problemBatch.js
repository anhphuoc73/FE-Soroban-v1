import { getItem, setItem, removeItem } from "./localStorage";

// init batch với key động
export function initBatch(key, userId) {
    let data = []
    data = getItem(key, { userId, problems: [] });

    // Xóa bài chưa làm, giữ lại bài đã có kết quả
    data.problems = data.problems.filter(p => p.inputResult != null);

    setItem(key, data);
    return data;
}

// export function addProblem(key, problem, userId) {
//   const data = getItem(key, { userId, problems: [] });
//   data.problems.push(problem);
//   setItem(key, data);
//   return problem;
// }

// export function updateProblem(key, problemId, inputResult) {
//   const data = getItem(key, { userId: null, problems: [] });

//   data.problems = data.problems.map(p => {
//     if (p.id === problemId) {
//       const isCorrect = inputResult === p.resultExpression ? 1 : 0;
//       return { ...p, inputResult, result: isCorrect };
//     }
//     return p;
//   });

//   setItem(key, data);
//   return data;
// }

// export function finishBatch(key) {
//   const data = getItem(key);
//   if (!data) return null;

//   const totalCorrect = data.problems.filter(p => p.result === 1).length;
//   const totalWrong = data.problems.filter(p => p.result === 0).length;

//   const payload = {
//     ...data,
//     totalCorrect,
//     totalWrong,
//     createdAt: Date.now(),
//   };

//   removeItem(key); // reset batch sau khi gửi
//   return payload; // cái này bạn gửi lên API
// }
