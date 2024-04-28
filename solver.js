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
    //init();
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

const setup = function () {
    placeNum(0, 2, 4);
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
    placeNum(8, 6, 2);
    //init();
};

const placeNum = function (r, c, n) {
    document.querySelector(`#r${r}c${c}`).value = n;
};

const step = function () {
    console.log(unknowns);
    //ifOnlyPlace();
    pairsAndTriples();
    while (singleton() !== 0);
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
            if (cellsR.length === 1)
                return placeNumber(i, cellsR[0], n);
            if (cellsC.length === 1)
                return placeNumber(cellsC[0], i, n);
            if (cellsB.length === 1) {
                const coords = boxToGrid(i, cellsB[0]);
                return placeNumber(coords.r, coords.c, n);
            }
        }
    }
};

const onlyTwo = function () {
    for (let r = 0; r < 9; r++) {
        
    }
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