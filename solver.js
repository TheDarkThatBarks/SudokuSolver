window.onload = function () {
    const table = document.querySelector("#inputs");
    for (let r = 0; r < 9; r++) {
        let row = "<tr>";
        for (let c = 0; c < 9; c++)
            row += `<td class="${r === 2 || r === 5 ? 'bottomBox' : ''}${c === 2 || c === 5 ? ' rightBox' : ''}">
                        <input type="number" id="r${r}c${c}" onclick="setCursorPos(${r}, ${c});">
                    </td>`;
        table.innerHTML += row + "</tr>";
    }
};

let cursorRow = 0;
let cursorCol = 0;

const setCursorPos = function (r, c) {
    cursorRow = r;
    cursorCol = c;
    //document.querySelector(`#r${r}c${c}`).focus();
};

document.addEventListener("keydown", (event) => {
    let arrow = true;
    switch (event.key) {
        case "ArrowUp":
            cursorRow -= cursorRow === 0 ? 0 : 1;
            break;
        case "ArrowDown":
            cursorRow += cursorRow === 8 ? 0 : 1;
            break;
        case "ArrowLeft":
            cursorCol -= cursorCol === 0 ? 0 : 1;
            break;
        case "ArrowRight":
            cursorCol += cursorCol === 8 ? 0 : 1;
            break;
        default:
            arrow = false;
    }
    if (arrow) {
        event.preventDefault();
        document.querySelector(`#r${cursorRow}c${cursorCol}`).focus();
    }
});

let puzzle, rows, cols, boxes;
let options, boxOptions;
let unknowns;

const solve = function () {
    init();
    let count = 0;
    while (unknowns > 0 && count < 100) {
        const temp = unknowns;
        step();
        if (temp === unknowns) {
            count++;
        } else {
            count = 0;
        }
    }
    check();
};

const init = function () {
    puzzle = Array.from(Array(9), () => Array(9).fill(0));
    rows = Array.from(Array(9), () => []);
    cols = Array.from(Array(9), () => []);
    boxes = Array.from(Array(9), () => []);
    unknowns = 0;
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const val = document.querySelector(`#r${r}c${c}`).value | 0;
            puzzle[r][c] = val;
            if (val === 0) {
                unknowns++;
            } else {
                rows[r].push(val);
                cols[c].push(val);
                boxes[toBox(r, c)].push(val);
            }
        }
    }
    options = JSON.parse(JSON.stringify(puzzle));
    boxOptions = Array.from(Array(9), () => []);
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (options[r][c] === 0)
                options[r][c] = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !rows[r].concat(cols[c]).concat(boxes[toBox(r, c)]).includes(n));
            boxOptions[toBox(r, c)].push(options[r][c]);
        }
    }
    print(puzzle);
    print(rows);
    print(cols);
    print(boxes);
    print(options);
    print(boxOptions);
};

const check = function () {
    for (let i = 0; i < 9; i++) {
        let rowCount = [];
        let colCount = [];
        let boxCount = [];
        for (let j = 0; j < 9; j++) {
            const coords = boxToGrid(i, j);
            if (rowCount.includes(puzzle[i][j]) || colCount.includes(puzzle[j][i]) || boxCount.includes(puzzle[coords.r][coords.c])) {
                return console.log("Fail", i, j);
            } else {
                rowCount.push(puzzle[i][j]);
                colCount.push(puzzle[j][i]);
                boxCount.push(puzzle[coords.r][coords.c]);
            }
        }
    }
    return console.log("Pass");
};

const reset = function () {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++)
            document.querySelector(`#r${i}c${j}`).value = "";
    }
};

const setup = function () {
    reset();
    /*placeNum(0, 2, 4);
    placeNum(0, 3, 7);
    placeNum(0, 8, 2);
    placeNum(1, 1, 5);
    placeNum(1, 4, 6);
    placeNum(1, 7, 1);
    placeNum(2, 0, 8);
    placeNum(2, 5, 9);
    placeNum(2, 6, 6);
    placeNum(3, 0, 7);
    placeNum(3, 5, 2);
    placeNum(3, 6, 3);
    placeNum(4, 1, 2);
    placeNum(4, 4, 8);
    placeNum(4, 7, 4);
    placeNum(5, 2, 3);
    placeNum(5, 3, 4);
    placeNum(5, 8, 5);
    placeNum(6, 2, 6);
    placeNum(6, 3, 1);
    placeNum(6, 8, 4);
    placeNum(7, 1, 9);
    placeNum(7, 4, 5);
    placeNum(7, 7, 7);
    placeNum(8, 0, 4);
    placeNum(8, 5, 7);
    placeNum(8, 6, 2);*/

    /*placeNum(0, 1, 4);
    placeNum(0, 4, 2);
    placeNum(1, 3, 8);
    placeNum(1, 8, 7);
    placeNum(2, 0, 8);
    placeNum(2, 1, 2);
    placeNum(2, 4, 6);
    placeNum(2, 8, 4);
    placeNum(3, 1, 6);
    placeNum(3, 4, 3);
    placeNum(3, 8, 1);
    placeNum(4, 4, 5);
    placeNum(4, 6, 8);
    placeNum(5, 1, 8);
    placeNum(5, 2, 5);
    placeNum(5, 3, 2);
    placeNum(5, 5, 9);
    placeNum(5, 6, 3);
    placeNum(6, 0, 4);
    placeNum(6, 1, 9);
    placeNum(6, 2, 6);
    placeNum(6, 3, 3);
    placeNum(6, 5, 2);
    placeNum(7, 0, 2);
    placeNum(7, 3, 4);
    placeNum(7, 8, 9);
    placeNum(8, 0, 7);
    placeNum(8, 3, 9);
    placeNum(8, 6, 4);
    placeNum(8, 8, 8);*/

    placeNum(0, 0, 3);
    placeNum(0, 4, 9);
    placeNum(0, 7, 7);
    placeNum(0, 8, 1);
    placeNum(1, 0, 7);
    placeNum(1, 3, 5);
    placeNum(1, 5, 1);
    placeNum(1, 6, 3);
    placeNum(2, 0, 8);
    placeNum(2, 3, 7);
    placeNum(2, 7, 5);
    placeNum(3, 2, 8);
    placeNum(3, 5, 9);
    placeNum(3, 7, 6);
    placeNum(4, 2, 2);
    placeNum(4, 5, 4);
    placeNum(4, 6, 5);
    placeNum(4, 8, 8);
    placeNum(5, 0, 4);
    placeNum(5, 1, 7);
    placeNum(5, 2, 9);
    placeNum(5, 7, 3);
    placeNum(6, 4, 3);
    placeNum(7, 1, 1);
    placeNum(7, 3, 6);
    placeNum(7, 5, 8);
    placeNum(7, 8, 7);
    placeNum(8, 0, 2);
    placeNum(8, 1, 5);
    placeNum(8, 8, 3);

    init();
};

const placeNum = function (r, c, n) {
    document.querySelector(`#r${r}c${c}`).value = n;
};

const step = function () {
    console.log(unknowns);
    ifOnlyPlace();
    pairsAndTriples();
    while (singleton() !== 0);
    print(options);
};

const singleton = function () {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (Array.isArray(options[r][c]) && options[r][c].length === 1)
                return placeNumber(r, c, options[r][c][0]);
        }
    }
    return 0;
};

const ifOnlyPlace = function () {
    for (let n = 1; n <= 9; n++) {
        const rowPairs = [];
        const colPairs = [];
        const rowTriples = [];
        const colTriples = [];
        for (let i = 0; i < 9; i++) {
            let cellsR = [];
            let cellsC = [];
            let cellsB = [];
            for (let j = 0; j < 9; j++) {
                if (Array.isArray(options[i][j]) && options[i][j].includes(n))
                    cellsR.push(j);
                if (Array.isArray(options[j][i]) && options[j][i].includes(n))
                    cellsC.push(j);
                if (Array.isArray(boxOptions[i][j]) && boxOptions[i][j].includes(n))
                    cellsB.push(j);
            }
            if (cellsR.length === 1) {
                placeNumber(i, cellsR[0], n);
                return;
            }
            if (cellsC.length === 1) {
                placeNumber(cellsC[0], i, n);
                return;
            }
            if (cellsB.length === 1) {
                const coords = boxToGrid(i, cellsB[0]);
                placeNumber(coords.r, coords.c, n);
                return;
            }

            if (cellsR.length === 2) {
                for (const pair of rowPairs) {
                    if (pair.c1 === cellsR[0] && pair.c2 === cellsR[1]) {
                        for (let j = 0; j < 9; j++) {
                            if (j === pair.r || j === i)
                                continue;
                            removeOption(j, pair.c1, pair.n);
                            removeOption(j, pair.c2, pair.n);
                        }
                        return;
                    }
                }
                rowPairs.push({
                    r: i,
                    c1: cellsR[0],
                    c2: cellsR[1],
                    n: n
                });
            }

            if (cellsC.length === 2) {
                for (const pair of colPairs) {
                    if (pair.r1 === cellsC[0] && pair.r2 === cellsC[1]) {
                        for (let j = 0; j < 9; j++) {
                            if (j === pair.c || j === i)
                                continue;
                            removeOption(pair.r1, j, pair.n);
                            removeOption(pair.r2, j, pair.n);
                        }
                        return;
                    }
                }
                colPairs.push({
                    c: i,
                    r1: cellsC[0],
                    r2: cellsC[1],
                    n: n
                });
            }

            if (cellsR.length <= 3 && cellsR.length > 0) {
                let found = [];
                let newTriple = JSON.parse(JSON.stringify(cellsR));
                for (const triple of rowTriples) {
                    const t = JSON.parse(JSON.stringify(newTriple));
                    for (const c of triple.c) {
                        if (!t.includes(c))
                            t.push(c);
                    }
                    if (t.length === 3) {
                        if (found.length > 0) {
                            for (let sets of found) {
                                if (JSON.stringify(sets.c.toSorted((a, b) => a - b)) === JSON.stringify(t.toSorted((a, b) => a - b))) {
                                    for (let j = 0; j < 9; j++) {
                                        if (j === sets.r || j === triple.r || j === i)
                                            continue;
                                        console.log(sets.c, j, n);
                                        removeOption(j, sets.c[0], n);
                                        removeOption(j, sets.c[1], n);
                                        removeOption(j, sets.c[2], n);
                                    }
                                    return;
                                }
                            }
                        } else {
                            found.push({
                                r: triple.r,
                                c: t
                            });
                        }
                    }
                }
                rowTriples.push({
                    r: i,
                    c: newTriple
                });
            }

            if (cellsC.length <= 3 && cellsC.length > 0) {
                let found = [];
                let newTriple = JSON.parse(JSON.stringify(cellsC));
                for (const triple of colTriples) {
                    const t = JSON.parse(JSON.stringify(newTriple));
                    for (const r of triple.r) {
                        if (!t.includes(r))
                            t.push(r);
                    }
                    if (t.length === 3) {
                        if (found.length > 0) {
                            for (let sets of found) {
                                if (JSON.stringify(sets.r.toSorted((a, b) => a - b)) === JSON.stringify(t.toSorted((a, b) => a - b))) {
                                    for (let j = 0; j < 9; j++) {
                                        if (j === sets.c || j === triple.c || j === i)
                                            continue;
                                        print(found);
                                        console.log(sets.r, j, n);
                                        removeOption(sets.r[0], j, n);
                                        removeOption(sets.r[1], j, n);
                                        removeOption(sets.r[2], j, n);
                                    }
                                    return;
                                }
                            }
                        } else {
                            console.log("t", t, n);
                            found.push({
                                r: t,
                                c: triple.c
                            });
                            print(found);
                        }
                    }
                }
                colTriples.push({
                    r: newTriple,
                    c: i
                });
            }
        }
    }
    print(options);
};

const pairsAndTriples = function () {
    for (let i = 0; i < 9; i++) {
        const template = {
            cells: [],
            p: [],
            found: false
        };
        const rowPairs = [];
        const colPairs = [];
        const boxPairs = [];

        const rowTriples = [];
        const colTriples = [];
        const boxTriples = [];
        for (let j = 0; j < 9; j++) {
            const findPairsAndTriples = function (type) {
                const pairList = type === 0 ? rowPairs : (type === 1 ? colPairs : boxPairs);
                const tripleList = type === 0 ? rowTriples : (type === 1 ? colTriples : boxTriples);
                const pair = JSON.parse(JSON.stringify(template));
                const triple = JSON.parse(JSON.stringify(template));
                const opts = (type === 2 ? boxOptions : options)[type === 1 ? j : i][type === 1 ? i : j];
                if (Array.isArray(opts) && opts.length <= 3) {
                    let coords = {
                        r: type === 1 ? j : i,
                        c: type === 1 ? i : j
                    };
                    if (opts.length === 2) {
                        pair.cells.push(coords);
                        pair.p = JSON.parse(JSON.stringify(opts));
                    }
                    triple.cells.push(JSON.parse(JSON.stringify(coords)));
                    triple.p = triple.p.concat(opts);

                    let found1 = false;
                    for (let k = j + 1; !pair.found && !triple.found && k < 9; k++) {
                        const newOpts = (type === 2 ? boxOptions : options)[type === 1 ? k : i][type === 1 ? i : k];
                        if (!Array.isArray(newOpts))
                            continue;

                        pair.found = JSON.stringify(newOpts) === JSON.stringify(pair.p);

                        coords = {
                            r: type === 1 ? k : i,
                            c: type === 1 ? i : k
                        };
                        if (pair.found) {
                            pair.cells.push(JSON.parse(JSON.stringify(coords)));
                            pairList.push(pair);
                        }

                        let newTriple = JSON.parse(JSON.stringify(newOpts));
                        for (const n of triple.p) {
                            if (!newTriple.includes(n))
                                newTriple.push(n);
                        }
                        if (newTriple.length <= 3) {
                            triple.p = JSON.parse(JSON.stringify(newTriple));
                            triple.cells.push(coords);
                            triple.found = found1;
                            if (triple.found)
                                tripleList.push(triple);
                            found1 = true;
                        }
                    }
                }
            };
            for (let t = 0; t < 3; t++)
                findPairsAndTriples(t);
        }
        const remOpts = function (type) {
            const pairList = type === 0 ? rowPairs : (type === 1 ? colPairs : boxPairs);
            const tripleList = type === 0 ? rowTriples : (type === 1 ? colTriples : boxTriples);
            const list = pairList.concat(tripleList);
            for (let j = 0; j < 9; j++) {
                for (const set of list) {
                    if (set.cells.some((cell) => j === (type === 1 ? cell.r : cell.c)))
                        continue;
                    if (Array.isArray((type === 2 ? boxOptions : options)[type === 1 ? j : i][type === 1 ? i : j])) {
                        for (const p of set.p) {
                            switch (type) {
                                case 0:
                                    removeOption(i, j, p);
                                    break;
                                case 1:
                                    removeOption(j, i, p);
                                    break;
                                case 2:
                                    const coords = boxToGrid(i, j);
                                    removeOption(coords.r, coords.c, p);
                                    break;
                            }
                        }
                    }
                }
            }
        };
        for (let t = 0; t < 3; t++)
            remOpts(t);
    }
    print(options);
};

const placeNumber = function (r, c, n) {
    unknowns--;
    puzzle[r][c] = n;
    rows[r].push(n);
    cols[c].push(n);
    boxes[toBox(r, c)].push(n);
    document.querySelector(`#r${r}c${c}`).value = n;
    for (let i = 0; i < 9; i++) {
        if (i === r) {
            options[i][c] = n;
            const coords = gridToBox(i, c);
            boxOptions[coords.b][coords.i] = n;
        } else if (Array.isArray(options[i][c]))
            removeOption(i, c, n);
        if (i !== c && Array.isArray(options[r][i]))
            removeOption(r, i, n);
    }
    removeOptionsInBox(r, c, n);
    return n;
};

const removeOption = function (r, c, n) {
    if (r === 8 && c === 7 && n === 2)
        console.log("removed");
    if (!Array.isArray(options[r][c]))
        return;
    let idx = options[r][c].indexOf(n);
    if (idx > -1)
        options[r][c].splice(idx, 1);
};

const removeOptionsInBox = function (r, c, n) {
    const b = toBox(r, c);
    for (let i = 0; i < 9; i++) {
        if (Array.isArray(boxOptions[b][i])) {
            const idx = boxOptions[b][i].indexOf(n);
            if (idx > -1)
                boxOptions[b][i].splice(idx, 1);
        }
    }
};

const print = function (arr) {
    console.log(JSON.parse(JSON.stringify(arr)));
};

const toBox = function (r, c) {
    return (Math.floor(r / 3) * 3) + Math.floor(c / 3);
};

const gridToBox = function (r, c) {
    return {
        b: (Math.floor(r / 3) * 3) + Math.floor(c / 3),
        i: ((r % 3) * 3) + (c % 3)
    };
};

const boxToGrid = function (b, i) {
    return {
        r: (Math.floor(b / 3) * 3) + Math.floor(i / 3),
        c: ((b % 3) * 3) + (i % 3)
    };
};