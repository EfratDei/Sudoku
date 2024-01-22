var url = window.location.href;//שורת קוד קבועה על מנת לגשת לURL שנשלח בקובץ EXPLANTION
var emptyCells = parseInt(url.slice(-2)); // //ישמר במשתנה זה השני תווים האחרונים בנתב שזה בעצם הערך המספרי ששלחנו 

var indices = [];
var matrix = [];
var inputs = [];

function initIndices() { // [[0,0], [0,1], ..., [8,8]] יוצרת מערך של זוגות על מנת שיהיה שורה ועמודה 
    for (var i = 0; i < 9; i++)
        for (var j = 0; j < 9; j++)
            indices.push([i, j]);
}

function shuffle(arr) {//מעררבת את הזוגות על מנת שבכל איטרציה מקומות אחרים בלוח יהיו מלאים מקבלת מערך ועליו מבצעת את השיונויים
    var j, x, i;
    for (i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = arr[i];

        arr[i] = arr[j];
        arr[j] = x;
    }
    return arr;
}

function pickCells() {//מערבבת את האינדקסים וחותכת על מנת להשאיר רק את הכמות של מה שהשחקן צריך למלא 
    shuffle(indices); // mix
    indices.splice(emptyCells) // remain only the empty cells
}

function initBoard() {//יצירת הלוח ע"י בניית מטריצה 9על 9  שמכילה אפסים
    matrix = [];
    for (var i = 0; i < 9; i++) {
        matrix.push([]);
        for (var j = 0; j < 9; j++)
            matrix[i].push(0);
    }
}

function fillBoard() {//מילוי הלוח על פי חוקיו
    for (var i = 0; i < indices.length; i++) { // ריצה על כל האידקסים
        var val = 0;//בפועל יכיל את ערך התא 
        var index = indices[i]; // index = [i,j]
        var isStuck = true;//האם הגענו למבוי סתום 

        var k = index[0];
        var t = index[1];

        for (var v = 1; v <= 9; v++)//בדיקה האם קיים ערך שניתן לשים בתא 
            if (isValidValue(v, k, t)) {
                isStuck = false;
                break;
            }
        if (isStuck)
            return false;

        while (val==0 || !isValidValue(val, k, t))// יגריל ערכים כל עוד או שעדיין לא הגרלתי לאותו תא או שהגרלתי והערך לא מתאים 
            val = Math.floor(Math.random() * 9) + 1; // random number 1-9        
        matrix[k][t] = val;
    }
    return true;
}

function isValidValue(val, i, j) {
    for (var k = 0; k < matrix.length; k++) // check row and col
        if (matrix[i][k] == val && k != j || matrix[k][j] == val && k != i)
            return false;

    for (var k = ~~(i / 3) * 3; k < ~~(i / 3) * 3 + 3; k++) // check box  כלומר ננסה להגיע מכל אינדקס לתחילת  הריבוע המתאים לו וממנו לרוץ על כל הקופ
        for (var t = ~~(j / 3) * 3; t < ~~(j / 3) * 3 + 3; t++)
            if (k == i && t == j)
                continue;
            else if (matrix[k][t] == val)
                return false;
    return true;
}

function removeCells() {//מחיקת הערכים מהלוח הפתרון על מנת שהשחקן יוכל לשחק
    for (var i = 0; i < indices.length; i++) {
        var k = indices[i][0];
        var t = indices[i][1];
        matrix[k][t] = 0;
    }
}

function generateSudokoBoard() {//הפונקציה הראשית שעושה הכל 
    initIndices(); // create all possible indices (i,j)    //יוצרת זוגות אינדקסים  שורה ועמודה 

    do {
        initBoard(); // יצירת הלוח ומילוי אפסים בכולו
    }
    while (!fillBoard()); // מילוי הלוח על פי חוקיו (תפעיל את IS VALID וכו)

    pickCells(); // הפונקציה שמערבבת ומוחקת את האינדקסים 
    removeCells(); // מחיקת ערכים כדי שהשחקן יוכל לשחק 
}

function checkBoard(e) {// בדיקת ניצחון 
    valid = ['1', '2', '3', '4', '5', '6', '7', '8', '9']

    inputElement = e.target;
    var i = parseInt(inputElement.id[0]);// id = 'i,j'קיבול שורה ועמוד דרך הID
    var j = parseInt(inputElement.id[2]);

    inputVal = inputElement.value;//הערך שהוקש בתוך האלמנט במקרה זה מספר בין 1-9

    if (!valid.includes(inputVal)) {// במידה והוקש ערך לא תקין כדוג אות לא יכניס דבר לאלמנט
        
        if (!valid.includes(inputElement.value[0]))
            inputElement.value = '';
        else
            inputElement.value = inputElement.value[0];
        return;
    }
    matrix[i][j] = parseInt(inputVal);

    for (var k = 0; k < matrix.length; k++)//בדיקה האם הלוח מלא על מנת להקפיץ הודעת ניצחון או אפס משמע שי עוד תא לא מלא ולכן לא נקפיץ
        for (var t = 0; t < matrix[k].length; t++)
            if (matrix[k][t] == 0) // if board not full
                return;

    for (var k = 0; k < matrix.length; k++)
        for (var t = 0; t < matrix[k].length; t++)
            if (!isValidValue(matrix[k][t], k, t)) { // if board is full and theres a mistake
                window.alert("OH NO :(\nYou Have A Mistake");
                return;
            }
    // player won
    window.alert("YOU WON!!!\nGood Job :)");
}

function drawBoard() {
    let board = document.getElementById("game-board");
    generateSudokoBoard();// פונקציית הMAIN
    for (let i = 0; i < 9; i++) {//יצירת הטבלה 
        let row = document.createElement('tr');

        for (let j = 0; j < 9; j++) {
            let cell = document.createElement('td');
            cell.style.textAlign = "center"

            if (matrix[i][j] == 0) {//אם התא ריק שיכניס את הערך שהשחקן הקיש
                var input = document.createElement("input");
                input.style.width = '20px';
                input.style.textAlign = "center";
                input.addEventListener('input', checkBoard);//ברגע שהוכנס ערך מופעלת הפונקציה שבודקת ניצחון והרי היא מקבלת אלמנט והוא יעל את התז החדש 
                input.id = i + ',' + j;

                if (~~(i / 3) == ~~(j / 3) || ~~(i / 3) == 2 - ~~(j / 3))
                    input.style.backgroundColor = '#aaaaaa'; // gray

                cell.appendChild(input);
                inputs.push(input);
            }
            else
                cell.innerHTML = matrix[i][j];// אם הגעתי לתא שכבר מלא כלומר  תא שהשחקן לא ממלא רק אכניב טאת הערך למטריצה ואבדוק מיקוד קופסא כדי לצבוע 

            if (~~(i / 3) == ~~(j / 3) || ~~(i / 3) == 2 - ~~(j / 3))
                cell.style.backgroundColor = '#aaaaaa'; // gray
            row.appendChild(cell);
        }
        board.append(row);
    }
}
drawBoard();