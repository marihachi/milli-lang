## ISA(命令セット)

### Nop
何もしない

### PushLocal
オペランドを１つとる(変数インデックス)
1. 変数インデックスをスタックにpush

### Push
オペランドを１つとる(値)
1. 値をスタックにpush

### Add
1. スタックから1つpop(A)
2. スタックから1つpop(B)
3. A+Bの演算結果をスタックにpush

### Sub
1. スタックから1つpop(A)
2. スタックから1つpop(B)
3. A-Bの演算結果をスタックにpush

### Mul
1. スタックから1つpop(A)
2. スタックから1つpop(B)
3. A*Bの演算結果をスタックにpush

### Div
1. スタックから1つpop(A)
2. スタックから1つpop(B)
3. A/Bの演算結果をスタックにpush

### Rem
1. スタックから1つpop(A)
2. スタックから1つpop(B)
3. A%Bの演算結果をスタックにpush

### Store
1. スタックから1つpop(識別子)
2. スタックから1つpop(値)
3. 識別子のメモリ領域に値をセット

### Load
1. スタックから1つpop(識別子)
2. 識別子のメモリ領域から値を取得してスタックにpush

### Print
1. スタックから1つpop(値)
2. 値を画面に表示
